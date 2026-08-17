/**
 * Stands in for the `server-only` package, which throws by design when loaded
 * outside a React Server Component.
 *
 * This replaces `scripts/_stub-server-only.cjs`, which achieved the same thing
 * by monkey-patching `Module._resolveFilename`. A Vite resolve alias is scoped
 * to the test run and cannot leak into anything else — the CJS hook could, and
 * the migration doc records it crashing `assert-datetime`.
 */
export {};
