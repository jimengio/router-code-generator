export let genRouter = {
  a: {
    name: "a",
    raw: "a",
    path: () => `/a`,
    go: () => switchPath(`/a`),
    b: {
      name: "b",
      raw: "b",
      path: () => `/a/b`,
      go: () => switchPath(`/a/b`),
    },
    c_: {
      name: "c",
      raw: "c/:cid",
      path: (cid: string) => `/a/c/${cid}`,
      go: (cid: string) => switchPath(`/a/c/${cid}`),
      d_: {
        name: "d",
        raw: "d/:did",
        path: (cid: string, did: string) => `/a/c/${cid}/d/${did}`,
        go: (cid: string, did: string) => switchPath(`/a/c/${cid}/d/${did}`),
      },
      e: {
        name: "e",
        raw: "e",
        path: (cid: string, queries?: IGenQueryAC_E) => `/a/c/${cid}/e?${qsStringify(queries)}`,
        go: (cid: string, queries?: IGenQueryAC_E) => switchPath(`/a/c/${cid}/e?${qsStringify(queries)}`),
      },
      g_: {
        name: "g",
        raw: "g/:gid",
        path: (cid: string, gid: string, queries?: IGenQueryAC_G_) => `/a/c/${cid}/g/${gid}?${qsStringify(queries)}`,
        go: (cid: string, gid: string, queries?: IGenQueryAC_G_) => switchPath(`/a/c/${cid}/g/${gid}?${qsStringify(queries)}`),
      },
    },
  },
};

export interface IGenQueryAC_E {
  f?: string;
}

export interface IGenQueryAC_G_ {
  h?: string;
}

export type GenRouterTypeMain = GenRouterTypeTree["a"];

export interface GenRouterTypeTree {
  a: {
    name: "a";
    params: {};
    query: {};
    next: GenRouterTypeTree["a"]["b"] | GenRouterTypeTree["a"]["c_"];
    b: {
      name: "b";
      params: {};
      query: {};
      next: null;
    };
    c_: {
      name: "c";
      params: { cid: string };
      query: {};
      next: GenRouterTypeTree["a"]["c_"]["d_"] | GenRouterTypeTree["a"]["c_"]["e"] | GenRouterTypeTree["a"]["c_"]["g_"];
      d_: {
        name: "d";
        params: { cid: string; did: string };
        query: {};
        next: null;
      };
      e: {
        name: "e";
        params: { cid: string };
        query: { f: string };
        next: null;
      };
      g_: {
        name: "g";
        params: { cid: string; gid: string };
        query: { h: string };
        next: null;
      };
    };
  };
}
