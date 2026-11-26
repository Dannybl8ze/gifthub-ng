// Creates the values the admin sign-in needs. Run it in your own terminal:
//   node scripts/admin-credentials.mjs
// It asks for a password (not shown as you type), then prints a hash and a session
// secret to copy into your hosting environment variables. Nothing is written to disk.
import { randomBytes, scryptSync } from "node:crypto";

const MIN_LENGTH = 12;

function readHidden(prompt) {
  return new Promise((resolve) => {
    process.stdout.write(prompt);
    const { stdin } = process;
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");
    let value = "";
    const cleanup = () => {
      stdin.setRawMode(false);
      stdin.pause();
      stdin.removeListener("data", onData);
    };
    const onData = (chunk) => {
      for (const ch of chunk) {
        if (ch === "\u0003") {
          cleanup();
          process.stdout.write("\n");
          process.exit(1);
        } else if (ch === "\r" || ch === "\n") {
          cleanup();
          process.stdout.write("\n");
          resolve(value);
          return;
        } else if (ch === "\u007f" || ch === "\b") {
          value = value.slice(0, -1);
        } else {
          value += ch;
        }
      }
    };
    stdin.on("data", onData);
  });
}

async function readPiped() {
  let data = "";
  for await (const chunk of process.stdin) data += chunk;
  const lines = data.split(/\r?\n/);
  return [lines[0] ?? "", lines[1] ?? lines[0] ?? ""];
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

let password;
let confirm;
if (process.stdin.isTTY) {
  password = await readHidden(`Choose an admin password (at least ${MIN_LENGTH} characters): `);
  confirm = await readHidden("Type it again: ");
} else {
  [password, confirm] = await readPiped();
}

if (password.length < MIN_LENGTH) fail(`Password must be at least ${MIN_LENGTH} characters.`);
if (password !== confirm) fail("The two passwords didn't match.");

const salt = randomBytes(16);
const hash = scryptSync(password, salt, 64);

console.log("\nAdd these to your environment variables (Vercel, and .env.local for local use):\n");
console.log(`ADMIN_PASSWORD_HASH=${salt.toString("hex")}:${hash.toString("hex")}`);
console.log(`ADMIN_SESSION_SECRET=${randomBytes(32).toString("hex")}`);
console.log("\nAlso set ADMIN_EMAIL to the email address you'll sign in with.");
console.log("Changing ADMIN_SESSION_SECRET later signs everyone out.\n");
