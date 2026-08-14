/**
 * Lets the assertion scripts under scripts/ import modules that are marked
 * `import "server-only"`.
 *
 * That package deliberately throws when required outside a React Server
 * Component. Running node with `--conditions=react-server` resolves it to a
 * no-op, but that also flips `next/cache` onto a react-server build of React
 * that refuses to load outside experimental channels. So instead we neutralise
 * just this one specifier and leave every other resolution alone.
 *
 * Usage:  npx tsx --require ./scripts/_stub-server-only.cjs scripts/<file>.ts
 */
const Module = require("module");
const path = require("path");

const stub = path.join(__dirname, "_empty.cjs");
const originalResolve = Module._resolveFilename;

Module._resolveFilename = function (request, ...rest) {
  if (request === "server-only") return stub;
  return originalResolve.call(this, request, ...rest);
};
