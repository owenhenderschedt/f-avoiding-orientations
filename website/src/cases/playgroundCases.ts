export const playgroundDegrees = [
  4,
  6,
  8,
  10,
  12,
  14,
] as const

export type PlaygroundDegree =
  typeof playgroundDegrees[number]

export type ForbiddenSetOption = {
  forbiddenSet: readonly number[]
}

export type PlaygroundCaseGroup = {
  id: string
  degree: PlaygroundDegree
  options: readonly ForbiddenSetOption[]
}

/*
 * We only need to display maximal forbidden sets.
 *
 * For a d-regular graph, the conjecture assumes
 *
 *     |F| < d/2.
 *
 * Thus the maximal cases have
 *
 *     |F| = d/2 - 1.
 *
 * If F is contained in F' and we find an F'-avoiding
 * orientation, then that orientation automatically avoids F.
 * Hence every smaller forbidden set is covered by one of
 * these maximal cases.
 */

function generateCombinations(
  values: readonly number[],
  size: number,
): number[][] {
  const combinations: number[][] = []

  function build(
    start: number,
    current: number[],
  ) {
    if (current.length === size) {
      combinations.push([...current])
      return
    }

    for (
      let index = start;
      index < values.length;
      index += 1
    ) {
      current.push(values[index])

      build(
        index + 1,
        current,
      )

      current.pop()
    }
  }

  build(0, [])

  return combinations
}

function reverseForbiddenSet(
  degree: number,
  forbiddenSet: readonly number[],
): number[] {
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

function forbiddenSetKey(
  forbiddenSet: readonly number[],
) {
  return forbiddenSet.join('-')
}

function compareForbiddenSets(
  first: readonly number[],
  second: readonly number[],
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

function sameForbiddenSet(
  first: readonly number[],
  second: readonly number[],
) {
  return (
    first.length ===
      second.length &&
    first.every(
      (value, index) =>
        value ===
        second[index],
    )
  )
}

function isSelfReversingGroup(
  group: PlaygroundCaseGroup,
) {
  return group.options.length === 1
}

function generateCaseGroups(
  degree: PlaygroundDegree,
): PlaygroundCaseGroup[] {
  const forbiddenSetSize =
    degree / 2 - 1

  const possibleOutdegrees =
    Array.from(
      {
        length:
          degree + 1,
      },
      (_, value) =>
        value,
    )

  const forbiddenSets =
    generateCombinations(
      possibleOutdegrees,
      forbiddenSetSize,
    )

  const seen =
    new Set<string>()

  const groups:
    PlaygroundCaseGroup[] = []

  for (
    const forbiddenSet
    of forbiddenSets
  ) {
    const reversed =
      reverseForbiddenSet(
        degree,
        forbiddenSet,
      )

    const key =
      forbiddenSetKey(
        forbiddenSet,
      )

    const reversedKey =
      forbiddenSetKey(
        reversed,
      )

    if (
      seen.has(key) ||
      seen.has(reversedKey)
    ) {
      continue
    }

    seen.add(key)
    seen.add(reversedKey)

    const selfReversing =
      sameForbiddenSet(
        forbiddenSet,
        reversed,
      )

    if (selfReversing) {
      groups.push({
        id:
          `${degree}-${key}`,
        degree,
        options: [
          {
            forbiddenSet,
          },
        ],
      })

      continue
    }

    const [
      first,
      second,
    ] =
      compareForbiddenSets(
        forbiddenSet,
        reversed,
      ) <= 0
        ? [
            forbiddenSet,
            reversed,
          ]
        : [
            reversed,
            forbiddenSet,
          ]

    groups.push({
      id:
        `${degree}-${forbiddenSetKey(first)}-${forbiddenSetKey(second)}`,
      degree,
      options: [
        {
          forbiddenSet:
            first,
        },
        {
          forbiddenSet:
            second,
        },
      ],
    })
  }

  /*
   * Keep all self-reversing cases together at the
   * beginning of the grid. Within each section,
   * order the forbidden sets lexicographically.
   */
  groups.sort(
    (
      firstGroup,
      secondGroup,
    ) => {
      const firstSelfReversing =
        isSelfReversingGroup(
          firstGroup,
        )

      const secondSelfReversing =
        isSelfReversingGroup(
          secondGroup,
        )

      if (
        firstSelfReversing &&
        !secondSelfReversing
      ) {
        return -1
      }

      if (
        !firstSelfReversing &&
        secondSelfReversing
      ) {
        return 1
      }

      return compareForbiddenSets(
        firstGroup.options[0]
          .forbiddenSet,
        secondGroup.options[0]
          .forbiddenSet,
      )
    },
  )

  return groups
}

const caseGroupsByDegree:
  Record<
    PlaygroundDegree,
    readonly PlaygroundCaseGroup[]
  > = {
  4: generateCaseGroups(4),
  6: generateCaseGroups(6),
  8: generateCaseGroups(8),
  10: generateCaseGroups(10),
  12: generateCaseGroups(12),
  14: generateCaseGroups(14),
}

export const playgroundCaseGroups =
  playgroundDegrees.flatMap(
    (degree) =>
      caseGroupsByDegree[
        degree
      ],
  )

export function getCaseGroupsForDegree(
  degree: PlaygroundDegree,
) {
  return caseGroupsByDegree[
    degree
  ]
}
