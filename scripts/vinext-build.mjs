import { spawn } from "node:child_process";

const child = spawn(
  process.execPath,
  ["node_modules/vinext/dist/cli.js", "build"],
  {
    cwd: process.cwd(),
    env: process.env,
    stdio: ["ignore", "pipe", "pipe"],
  },
);

let output = "";

child.stdout.on("data", (chunk) => {
  const text = chunk.toString();
  output += text;
  process.stdout.write(chunk);
});

child.stderr.on("data", (chunk) => {
  const text = chunk.toString();
  output += text;
  process.stderr.write(chunk);
});

child.on("exit", (code, signal) => {
  if (code === 0) {
    process.exit(0);
  }

  const completed = /Build complete\. Run `vinext start`/i.test(output);
  const nativeWindowsAssertion =
    /Assertion failed: !\(handle->flags & UV_HANDLE_CLOSING\)/i.test(output);

  if (completed && nativeWindowsAssertion) {
    process.stderr.write(
      "\nVinext finished the build, but Node 24 on Windows raised a native shutdown assertion. Treating the completed build as successful.\n",
    );
    process.exit(0);
  }

  if (signal) {
    process.stderr.write(`\nvinext build exited with signal ${signal}.\n`);
  }

  process.exit(code ?? 1);
});
