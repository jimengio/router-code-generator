export let genRouter = {
  a: {
    name: "a",
    raw: "a",
    path: (queries?: {}) => `/a`,
    go: (queries?: {}) => switchPath(`/a`),
  },
};
