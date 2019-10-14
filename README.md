## Router code generator

> Router controller code generated of [ruled-router](https://github.com/jimengio/ruled-router).

Live version: http://fe.jimu.io/router-code-generator

### Usage

![](https://img.shields.io/npm/v/@jimengio/router-code-generator.svg?style=flat-square)

```bash
yarn add --dev @jimengio/router-code-generator
```

```ts
import { generateTree } from "@jimengio/router-code-generator";

generateTree(jsonRules);
```

### Simplified demos

- Basic router controller generator

```json
[{ "name": "a", "path": "a" }]
```

```ts
export let genRouter = {
  a: {
    name: "a",
    raw: "a",
    path: () => `/a`,
    go: () => switchPath(`/a`),
  },
};
```

- Router with parameter

```json
[
  {
    "name": "a",
    "path": "a/:code"
  }
]
```

```ts
export let genRouter = {
  a_: {
    name: "a",
    raw: "a/:code",
    path: (code: string) => `/a/${code}`,
    go: (code: string) => switchPath(`/a/${code}`),
  },
};
```

- Router with query options

```json
[
  {
    "name": "a",
    "path": "a",
    "queries": ["a", "b"]
  }
]
```

```ts
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
```

- Nested router

```json
[
  {
    "name": "a",
    "path": "a",
    "next": [
      {
        "name": "b",
        "path": "b"
      }
    ]
  }
]
```

```ts
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
```

### License

MIT
