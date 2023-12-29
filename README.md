# `@akopyl/docusaurus-mdx-patcher`

A remark plugin, that replaces the built-in Docusaurus toc plugin. 
It generates the table of contents properly, when importing markdown files with headings.

## Installation

```sh
yarn add @akopyl/docusaurus-mdx-patcher
```

## Usage

```js
// ...
docs: {
  // ... 
  remarkPlugins: [
    [
      require('@akopyl/docusaurus-mdx-patcher'),
      {}
    ],
  ]
}
```

## Options

### `name`

How the exported toc variable will be named. Defaults to `toc`.
