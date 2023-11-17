type Split<T extends string, Splitter extends string> = T extends `${infer Start}${Splitter}${infer End}`
  ? [Start, ...Split<End, Splitter>]
  : [T];

type Replace<
  T extends string,
  Lookup extends string,
  Value extends string
> = T extends `${infer Start}${Lookup}${infer End}`
  ? `${Replace<Start, Lookup, Value>}${Value}${Replace<End, Lookup, Value>}`
  : T;

// Better TypeScript support for string methods
interface String {
  startsWith<Start extends string>(searchString: Start): this is `${Start}${string}`;
  startsWith<Start extends string>(searchString: Start, position: 0): this is `${Start}${string}`;

  split<This extends string, Splitter extends readonly string>(this: This, separator: Splitter): Split<This, Splitter>;

  replace<This extends string, Lookup extends string, Value extends string>(
    this: This,
    searchValue: Lookup,
    replaceValue: Value
  ): Replace<This, Lookup, Value>;
}
