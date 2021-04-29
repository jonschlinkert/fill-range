declare module 'fill-range' {
  export function fill(
    from: string | number,
    to: string | number,
    options?: string | number | {
      step?: string | number,
      strictRanges?: boolean,
      stringify?: boolean,
      toRegex?: boolean,
      transform?: (value: string | number) => string | number
    } | ((value: string | number) => string | number)
    ): Array<string> | Array<number>
}
