/** "ai" = answered by the Bedrock model; "basic" = answered by the built-in matcher. */
export type AssistantMode = "ai" | "basic";

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

export interface AssistantReply {
  reply: string;
  /** Catalogue slugs to show as product cards. Always validated against the catalogue. */
  products: string[];
  /** What actually produced this reply (can be "basic" even when AI is configured, if the model call failed). */
  mode: AssistantMode;
}

/** Hard limits shared by the API route and the widget. */
export const LIMITS = {
  /** Max characters in a single user message. */
  messageChars: 400,
  /** How many of the most recent turns are sent to the model. */
  historyTurns: 8,
  /** Max product cards shown with one reply. */
  maxProducts: 3,
} as const;
