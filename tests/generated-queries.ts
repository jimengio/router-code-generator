export let genRouter = {
  a: {
    name: "a",
    raw: "a",
    path: <T = { a?: string; b?: string }>(queries: T) => `/a?${qsStringify(queries)}`,
    go: <T = { a?: string; b?: string }>(queries: T) => switchPath(`/a?${qsStringify(queries)}`),
  },
};
