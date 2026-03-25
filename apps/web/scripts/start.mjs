import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const nextBin = resolve(scriptDir, "../../../node_modules/next/dist/bin/next");
const port = process.env.PORT ?? "3000";

const child = spawn(process.execPath, [nextBin, "start", "-H", "0.0.0.0", "-p", port], {
  stdio: "inherit",
  env: process.env,
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
