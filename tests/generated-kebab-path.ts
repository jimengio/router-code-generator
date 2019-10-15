export let genRouter = {
  aB: {
    name: "a-b",
    raw: "a-b",
    path: () => `/a-b`,
    go: () => switchPath(`/a-b`),
    cD: {
      name: "c-d",
      raw: "c-d",
      path: (queries?: IGenQueryABCD) => `/a-b/c-d?${qsStringify(queries)}`,
      go: (queries?: IGenQueryABCD) => switchPath(`/a-b/c-d?${qsStringify(queries)}`),
    },
  },
};

export interface IGenQueryABCD {
  a?: string;
}
