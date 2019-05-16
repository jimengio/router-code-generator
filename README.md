## Router code generator

### Usage

![](https://img.shields.io/npm/v/@jimengio/router-code-generator.svg?style=flat-square)

```bash
yarn add --dev @jimengio/router-code-generator
```

```js
import { generateTree } from "@jimengio/router-code-generator";
```

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
    path: <T = { a?: string; b?: string }>(queries?: T) => `/a?${qsStringify(queries)}`,
    go: <T = { a?: string; b?: string }>(queries?: T) => switchPath(`/a?${qsStringify(queries)}`),
  },
};
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
