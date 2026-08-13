import type { LovaszPair } from '../tools/lovaszPartition'
import type { AcrossDirection } from '../tools/orientAcrossPartition'
import {
  allOutdegrees,
  uniqueSorted,
  type GraphPart,
  type OutdegreeSet,
  type PartOutdegreePossibilities,
} from './outdegreePossibilities'

type DeriveOutdegreePossibilitiesArgs = {
  degree: number
  partition: LovaszPair | null
  acrossDirection: AcrossDirection | null
  balancedG: boolean
  balancedL: boolean
  balancedR: boolean
}

function balancedInternalChoices(
  internalDegree: number,
): number[] {
  return uniqueSorted([
    Math.floor(internalDegree / 2),
    Math.ceil(internalDegree / 2),
  ])
}

function balancedWholeGraphChoices(
  degree: number,
): OutdegreeSet {
  return uniqueSorted([
    Math.floor(degree / 2),
    Math.ceil(degree / 2),
  ])
}

function possibilitiesForPart(
  degree: number,
  maxInternalDegree: number,
  part: GraphPart,
  acrossDirection: AcrossDirection | null,
  balanced: boolean,
): OutdegreeSet {
  if (!balanced) {
    if (acrossDirection === null) {
      return allOutdegrees(degree)
    }

    const crossingEdgesPointOut =
      (part === 'L' && acrossDirection === 'L-to-R') ||
      (part === 'R' && acrossDirection === 'R-to-L')

    if (crossingEdgesPointOut) {
      const values: number[] = []

      for (
        let internalDegree = 0;
        internalDegree <= maxInternalDegree;
        internalDegree += 1
      ) {
        const crossingDegree =
          degree - internalDegree

        for (
          let internalOutdegree = 0;
          internalOutdegree <= internalDegree;
          internalOutdegree += 1
        ) {
          values.push(
            crossingDegree + internalOutdegree,
          )
        }
      }

      return uniqueSorted(values)
    }

    const values: number[] = []

    for (
      let internalDegree = 0;
      internalDegree <= maxInternalDegree;
      internalDegree += 1
    ) {
      for (
        let internalOutdegree = 0;
        internalOutdegree <= internalDegree;
        internalOutdegree += 1
      ) {
        values.push(internalOutdegree)
      }
    }

    return uniqueSorted(values)
  }

  /*
   * Balancing the internal graph alone does not yet restrict the
   * total outdegree if the crossing edges remain unoriented.
   */
  if (acrossDirection === null) {
    return allOutdegrees(degree)
  }

  const crossingEdgesPointOut =
    (part === 'L' && acrossDirection === 'L-to-R') ||
    (part === 'R' && acrossDirection === 'R-to-L')

  const values: number[] = []

  for (
    let internalDegree = 0;
    internalDegree <= maxInternalDegree;
    internalDegree += 1
  ) {
    const internalChoices =
      balancedInternalChoices(internalDegree)

    const crossingContribution =
      crossingEdgesPointOut
        ? degree - internalDegree
        : 0

    for (
      const internalOutdegree
      of internalChoices
    ) {
      values.push(
        crossingContribution + internalOutdegree,
      )
    }
  }

  return uniqueSorted(values)
}

export default function deriveOutdegreePossibilities({
  degree,
  partition,
  acrossDirection,
  balancedG,
  balancedL,
  balancedR,
}: DeriveOutdegreePossibilitiesArgs):
  PartOutdegreePossibilities {
  /*
   * A balanced orientation of the whole graph completely determines
   * the only possible total outdegrees. For an even-regular graph,
   * this is a single value d/2.
   */
  if (balancedG) {
    const values =
      balancedWholeGraphChoices(degree)

    return {
      L: values,
      R: values,
    }
  }

  if (partition === null) {
    const all = allOutdegrees(degree)

    return {
      L: all,
      R: all,
    }
  }

  return {
    L: possibilitiesForPart(
      degree,
      partition.s,
      'L',
      acrossDirection,
      balancedL,
    ),

    R: possibilitiesForPart(
      degree,
      partition.t,
      'R',
      acrossDirection,
      balancedR,
    ),
  }
}