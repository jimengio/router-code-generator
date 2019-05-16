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
  },
};
