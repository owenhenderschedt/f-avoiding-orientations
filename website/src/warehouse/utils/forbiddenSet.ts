export function forbiddenSetKey(
  forbiddenSet:
    readonly number[],
) {
  return forbiddenSet.join('-')
}

export function forbiddenSetLatex(
  forbiddenSet:
    readonly number[],
) {
  return (
    '\\{' +
    forbiddenSet.join(',') +
    '\\}'
  )
}

export function reverseForbiddenSet(
  degree:
    number,

  forbiddenSet:
    readonly number[],
) {
  return forbiddenSet
    .map(
      (value) =>
        degree - value,
    )
    .sort(
      (a, b) =>
        a - b,
    )
}

export function compareForbiddenSets(
  first:
    readonly number[],

  second:
    readonly number[],
) {
  const length =
    globalThis.Math.min(
      first.length,
      second.length,
    )

  for (
    let index = 0;
    index < length;
    index += 1
  ) {
    if (
      first[index] !==
      second[index]
    ) {
      return (
        first[index] -
        second[index]
      )
    }
  }

  return (
    first.length -
    second.length
  )
}

export function sameForbiddenSet(
  first:
    readonly number[],

  second:
    readonly number[],
) {
  return (
    first.length ===
      second.length &&
    first.every(
      (
        value,
        index,
      ) =>
        value ===
        second[index],
    )
  )
}
