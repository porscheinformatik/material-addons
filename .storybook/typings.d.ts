declare module '*.md' {
  const content: string;
  export default content;
}

declare module '*?example-source' {
  const source: string;
  export default source;
}
