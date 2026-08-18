import type {
  LovaszPair,
} from '../tools/lovaszPartition'
import type {
  AcrossDirection,
} from '../tools/orientAcrossPartition'
import {
  getAvoidCChoices,
} from '../tools/avoidC'
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

  /*
   * These are optional for now so that
   * the existing playground continues
   * to behave exactly as before until
   * Avoid c is wired into the state.
   */
  avoidCG?: number | null
  avoidCL?: number | null
  avoidCR?: number | null
}

function balancedInternalChoices(
  internalDegree: number,
): number[] {
  return uniqueSorted([
    Math.floor(
      internalDegree / 2,
    ),
    Math.ceil(
      internalDegree / 2,
    ),
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

function unrestrictedInternalChoices(
  internalDegree: number,
): OutdegreeSet {
  return allOutdegrees(
    internalDegree,
  )
}

function avoidCInternalChoices(
  internalDegree: number,
  c: number,
): OutdegreeSet {
  return getAvoidCChoices(
    internalDegree,
    c,
  )
}

function possibilitiesForPart(
  degree: number,
  maxInternalDegree: number,
  part: GraphPart,
  acrossDirection: AcrossDirection | null,
  balanced: boolean,
  avoidC: number | null,
): OutdegreeSet {
  /*
   * An orientation only inside the part
   * does not yet restrict the total
   * outdegree while the crossing edges
   * remain unoriented.
   */
  if (acrossDirection === null) {
    return allOutdegrees(degree)
  }

  const crossingEdgesPointOut =
    (
      part === 'L' &&
      acrossDirection ===
        'L-to-R'
    ) ||
    (
      part === 'R' &&
      acrossDirection ===
        'R-to-L'
    )

  const values: number[] = []

  for (
    let internalDegree = 0;
    internalDegree <=
    maxInternalDegree;
    internalDegree += 1
  ) {
    let internalChoices:
      OutdegreeSet

    if (balanced) {
      internalChoices =
        balancedInternalChoices(
          internalDegree,
        )
    } else if (avoidC !== null) {
      internalChoices =
        avoidCInternalChoices(
          internalDegree,
          avoidC,
        )
    } else {
      internalChoices =
        unrestrictedInternalChoices(
          internalDegree,
        )
    }

    const crossingContribution =
      crossingEdgesPointOut
        ? degree -
          internalDegree
        : 0

    for (
      const internalOutdegree
      of internalChoices
    ) {
      values.push(
        crossingContribution +
          internalOutdegree,
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
  avoidCG = null,
  avoidCL = null,
  avoidCR = null,
}: DeriveOutdegreePossibilitiesArgs):
  PartOutdegreePossibilities {
  /*
   * A balanced orientation of the whole
   * graph completely determines the
   * possible total outdegrees.
   */
  if (balancedG) {
    const values =
      balancedWholeGraphChoices(
        degree,
      )

    return {
      L: values,
      R: values,
    }
  }

  /*
   * Avoid c on the whole graph removes
   * c from the set of possible total
   * outdegrees.
   */
  if (avoidCG !== null) {
    const values =
      getAvoidCChoices(
        degree,
        avoidCG,
      )

    return {
      L: values,
      R: values,
    }
  }

  if (partition === null) {
    const all =
      allOutdegrees(degree)

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
      avoidCL,
    ),

    R: possibilitiesForPart(
      degree,
      partition.t,
      'R',
      acrossDirection,
      balancedR,
      avoidCR,
    ),
  }
}