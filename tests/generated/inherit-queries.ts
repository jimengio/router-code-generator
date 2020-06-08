export let genRouter = {
  a: {
    name: "a",
    raw: "a",
    path: (queries?: IGenQueryA) => `/a?${qsStringify(queries)}`,
    go: (queries?: IGenQueryA) => switchPath(`/a?${qsStringify(queries)}`),
    b: {
      name: "b",
      raw: "b",
      path: (queries?: IGenQueryAB) => `/a/b?${qsStringify(queries)}`,
      go: (queries?: IGenQueryAB) => switchPath(`/a/b?${qsStringify(queries)}`),
    },
  },
};

export interface IGenQueryAB {
  a?: string;
  b?: string;
}

export interface IGenQueryA {
  a?: string;
  b?: string;
}

/** Deprecating, use GenRouterTypeTree["next"] instead */
export type GenRouterTypeMain = GenRouterTypeTree["next"];

export interface GenRouterTypeTree {
  next: GenRouterTypeTree["a"];
  a: {
    name: "a";
    params: {};
    query: { a?: string; b?: string };
    next: GenRouterTypeTree["a"]["b"];
    b: {
      name: "b";
      params: {};
      query: { a?: string; b?: string };
      next: null;
    };
  };
}
