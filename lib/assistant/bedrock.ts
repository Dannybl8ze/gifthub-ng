import type { ChatTurn } from "./types";

/**
 * Amazon Bedrock access through the Converse API (one request shape for every
 * model). Two ways to authenticate, checked in this order:
 *
 *   1. BEDROCK_API_KEY                        — a Bedrock API key, sent as a bearer token
 *   2. BEDROCK_ACCESS_KEY_ID + BEDROCK_SECRET_ACCESS_KEY (+ BEDROCK_SESSION_TOKEN)
 *                                             — IAM credentials, signed by the AWS SDK
 *
 * Nothing here runs unless one of those is set. The BEDROCK_ prefix is deliberate: it keeps
 * these separate from AWS_* names that Vercel and the SDK treat specially.
 */

const DEFAULT_REGION = "us-east-1";
// Amazon Nova Lite through a cross-region inference profile. Use whatever model Bedrock has
// enabled for the account — any Converse-capable model ID or inference-profile ID works.
const DEFAULT_MODEL = "us.amazon.nova-lite-v1:0";
const TIMEOUT_MS = 15_000;
const MAX_OUTPUT_TOKENS = 400;

export class BedrockError extends Error {
  constructor(
    message: string,
    readonly status?: number
  ) {
    super(message);
    this.name = "BedrockError";
  }
}

function env(name: string): string | undefined {
  const v = process.env[name]?.trim();
  return v ? v : undefined;
}

type Auth = { kind: "apiKey"; apiKey: string } | { kind: "iam"; accessKeyId: string; secretAccessKey: string; sessionToken?: string };

function auth(): Auth | null {
  const apiKey = env("BEDROCK_API_KEY");
  if (apiKey) return { kind: "apiKey", apiKey };
  const accessKeyId = env("BEDROCK_ACCESS_KEY_ID");
  const secretAccessKey = env("BEDROCK_SECRET_ACCESS_KEY");
  if (accessKeyId && secretAccessKey) {
    return { kind: "iam", accessKeyId, secretAccessKey, sessionToken: env("BEDROCK_SESSION_TOKEN") };
  }
  return null;
}

export function bedrockConfigured(): boolean {
  return auth() !== null;
}

interface ConverseResponse {
  output?: { message?: { content?: Array<{ text?: string }> } };
  stopReason?: string;
}

function textFrom(res: ConverseResponse): string {
  return (res.output?.message?.content ?? [])
    .map((c) => c.text ?? "")
    .join("")
    .trim();
}

/** Sends the conversation to the model and returns its plain-text answer. Throws BedrockError on any failure. */
export async function askBedrock(system: string, history: ChatTurn[]): Promise<string> {
  const creds = auth();
  if (!creds) throw new BedrockError("Bedrock is not configured");

  const region = env("BEDROCK_REGION") ?? DEFAULT_REGION;
  const modelId = env("BEDROCK_MODEL_ID") ?? DEFAULT_MODEL;
  // BEDROCK_ENDPOINT exists so tests can point at a local fake; leave it unset in real deployments.
  const endpoint = env("BEDROCK_ENDPOINT");

  const messages = history.map((t) => ({ role: t.role, content: [{ text: t.content }] }));
  const inferenceConfig = { maxTokens: MAX_OUTPUT_TOKENS, temperature: 0.4 };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    if (creds.kind === "apiKey") {
      const base = endpoint ?? `https://bedrock-runtime.${region}.amazonaws.com`;
      const res = await fetch(`${base}/model/${encodeURIComponent(modelId)}/converse`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${creds.apiKey}` },
        body: JSON.stringify({ system: [{ text: system }], messages, inferenceConfig }),
        signal: controller.signal,
        cache: "no-store",
      });
      if (!res.ok) {
        // Status and AWS's error type are enough to diagnose; never log the request or the key.
        const detail = await res.text().then((t) => t.slice(0, 200)).catch(() => "");
        throw new BedrockError(`Bedrock returned ${res.status} ${detail}`, res.status);
      }
      const answer = textFrom((await res.json()) as ConverseResponse);
      if (!answer) throw new BedrockError("Bedrock returned an empty answer");
      return answer;
    }

    // IAM credentials: let the AWS SDK sign the request. Imported lazily so the SDK is only loaded when needed.
    const { BedrockRuntimeClient, ConverseCommand } = await import("@aws-sdk/client-bedrock-runtime");
    const client = new BedrockRuntimeClient({
      region,
      endpoint,
      credentials: {
        accessKeyId: creds.accessKeyId,
        secretAccessKey: creds.secretAccessKey,
        sessionToken: creds.sessionToken,
      },
    });
    const out = await client.send(
      new ConverseCommand({ modelId, system: [{ text: system }], messages, inferenceConfig }),
      { abortSignal: controller.signal }
    );
    const answer = textFrom(out as ConverseResponse);
    if (!answer) throw new BedrockError("Bedrock returned an empty answer");
    return answer;
  } catch (err) {
    if (err instanceof BedrockError) throw err;
    const e = err as { name?: string; message?: string; $metadata?: { httpStatusCode?: number } };
    throw new BedrockError(`${e.name ?? "Error"}: ${(e.message ?? "").slice(0, 200)}`, e.$metadata?.httpStatusCode);
  } finally {
    clearTimeout(timer);
  }
}
