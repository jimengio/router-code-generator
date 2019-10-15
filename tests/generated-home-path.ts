export let genRouter = {
  $: {
    name: "home",
    raw: "",
    path: (queries?: IGenQuery$) => `/?${qsStringify(queries)}`,
    go: (queries?: IGenQuery$) => switchPath(`/?${qsStringify(queries)}`),
  },
};

export interface IGenQuery$ {
  a?: string;
}
