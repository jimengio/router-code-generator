export let genRouter = {
  a: {
    name: "a",
    raw: "a",
    path: (queries?: IGenQueryA) => `/a?${qsStringify(queries)}`,
    go: (queries?: IGenQueryA) => switchPath(`/a?${qsStringify(queries)}`),
  },
};

export interface IGenQueryA {
  b?: string;
  c?: string[];
}

export type GenRouterTypeMain = GenRouterTypeTree["a"];

export interface GenRouterTypeTree {
  a: {
    name: "a";
    params: {};
    query: { b?: string; c?: string[] };
    next: null;
  };
}
