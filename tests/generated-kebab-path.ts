export let genRouter = {
  aB: {
    name: "a-b",
    raw: "a-b",
    path: () => `/a-b`,
    go: () => switchPath(`/a-b`),
    cD: {
      name: "c-d",
      raw: "c-d",
      path: <T = IGenQueryABCD>(queries?: T) => `/a-b/c-d?${qsStringify(queries)}`,
      go: <T = IGenQueryABCD>(queries?: T) => switchPath(`/a-b/c-d?${qsStringify(queries)}`),
    },
  },
};

export interface IGenQueryABCD {
  a?: string;
}
