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

/** Deprecating, use GenRouterTypeTree["next"] instead */
export type GenRouterTypeMain = GenRouterTypeTree["next"];

export interface GenRouterTypeTree {
  next: GenRouterTypeTree["a"];
  a: {
    name: "a";
    params: {};
    query: { b?: string; c?: string[] };
    next: null;
  };
}
