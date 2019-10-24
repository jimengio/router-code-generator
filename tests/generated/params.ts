export let genRouter = {
  a_: {
    name: "a",
    raw: "a/:code",
    path: (code: string) => `/a/${code}`,
    go: (code: string) => switchPath(`/a/${code}`),
  },
};
