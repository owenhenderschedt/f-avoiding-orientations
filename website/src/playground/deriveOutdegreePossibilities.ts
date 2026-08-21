import type {
  LovaszPair,
} from '../tools/lovaszPartition'
import type {
  AcrossDirection,
} from '../tools/orientAcrossPartition'
import {
  getAvoidCChoices,
} from '../tools/avoidC'
import type {
  MaLuApplication,
} from '../tools/maLuApplication'
import {
  getMaLuPartOutdegreePossibilities,
  getMaLuWholeGraphChoices,
} from '../tools/maLuOutdegrees'
import {
  allOutdegrees,
  uniqueSorted,
  type GraphPart,
  type OutdegreeSet,
  type PartOutdegreePossibilities,
} from './outdegreePossibilities'

type DeriveOutdegreePossibilitiesArgs = {
  degree: number

  partition:
    LovaszPair | null

  acrossDirection:
    AcrossDirection | null

  balancedG: boolean
  balancedL: boolean
  balancedR: boolean

  avoidCG: number | null
  avoidCL: number | null
  avoidCR: number | null

  maLuG:
    MaLuApplication | null

  maLuL:
    MaLuApplication | null

  maLuR:
    MaLuApplication | null
}

function balancedInternalChoices(
  internalDegree: number,
): OutdegreeSet {
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
    Math.floor(
      degree / 2,
    ),
    Math.ceil(
      degree / 2,
    ),
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

  maxInternalDegree:
    number,

  part: GraphPart,

  acrossDirection:
    AcrossDirection | null,

  balanced: boolean,

  avoidC:
    number | null,

  maLuApplication:
    MaLuApplication | null,
): OutdegreeSet {
  /*
   * Ma-Lu has its own helper because
   * the application remembers the
   * exact internal set S selected by
   * the user.
   */
  if (
    maLuApplication !==
    null
  ) {
    return getMaLuPartOutdegreePossibilities(
      {
        degree,

        maxInternalDegree,

        part,

        acrossDirection,

        application:
          maLuApplication,
      },
    )
  }

  /*
   * An orientation only inside the
   * part does not yet restrict total
   * outdegree while crossing edges
   * remain unoriented.
   */
  if (
    acrossDirection ===
    null
  ) {
    return allOutdegrees(
      degree,
    )
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

  const values:
    number[] = []

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
    } else if (
      avoidC !== null
    ) {
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

  return uniqueSorted(
    values,
  )
}

export default function deriveOutdegreePossibilities({
  degree,
  partition,
  acrossDirection,
  balancedG,
  balancedL,
  balancedR,
  avoidCG,
  avoidCL,
  avoidCR,
  maLuG,
  maLuL,
  maLuR,
}: DeriveOutdegreePossibilitiesArgs):
  PartOutdegreePossibilities {
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

  if (
    avoidCG !== null
  ) {
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

  /*
   * A whole-graph Ma-Lu application
   * removes exactly the residual
   * outdegrees selected by the user.
   */
  if (
    maLuG !== null
  ) {
    const values =
      getMaLuWholeGraphChoices(
        degree,
        maLuG,
      )

    return {
      L: values,
      R: values,
    }
  }

  if (
    partition === null
  ) {
    const all =
      allOutdegrees(
        degree,
      )

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
      maLuL,
    ),

    R: possibilitiesForPart(
      degree,
      partition.t,
      'R',
      acrossDirection,
      balancedR,
      avoidCR,
      maLuR,
    ),
  }
}