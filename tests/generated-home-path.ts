export let genRouter = {
  $: {
    name: "home",
    raw: "",
    path: <T = IGenQuery$>(queries?: T) => `/?${qsStringify(queries)}`,
    go: <T = IGenQuery$>(queries?: T) => switchPath(`/?${qsStringify(queries)}`),
  },
};

export interface IGenQuery$ {
  a?: string;
}
