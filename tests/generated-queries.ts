export let genRouter = {
  a: {
    name: "a",
    raw: "a",
    path: <T = IGenQueryA>(queries?: T) => `/a?${qsStringify(queries)}`,
    go: <T = IGenQueryA>(queries?: T) => switchPath(`/a?${qsStringify(queries)}`),
  },
};

export interface IGenQueryA {
  a?: string;
  b?: string;
}
