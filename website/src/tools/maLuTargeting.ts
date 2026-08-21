import type {
  LovaszPair,
} from './lovaszPartition'
import type {
  AcrossDirection,
} from './orientAcrossPartition'
import {
  getMaLuSelectableValues,
  getMaLuSelectionDegreeCheck,
  type MaLuPartTarget,
  type MaLuSelectionDegreeCheck,
  type MaLuTarget,
} from './maLuMath'

export type MaLuSelectionMode =
  | 'total'
  | 'internal'

/*
 * A degree-by-degree check for the
 * "Target total outdegrees" mode.
 *
 * At a vertex of internal degree r,
 * outsideContribution records the
 * amount already forced outside the
 * graph to which Ma-Lu is being
 * applied.
 *
 * For a target total outdegree q,
 * Ma-Lu must therefore avoid the
 * internal value
 *
 *   q - outsideContribution.
 */
export type MaLuTotalDegreeCheck =
  MaLuSelectionDegreeCheck & {
    outsideContribution: number
  }

export type MaLuTotalCertificate = {
  target: MaLuTarget

  /*
   * These are FINAL total outdegrees
   * the user wants to eliminate.
   */
  selectedTotalOutdegrees:
    number[]

  /*
   * False when there is not yet enough
   * information to translate total
   * outdegrees into internal
   * outdegrees.
   *
   * For a Lovasz part, this happens
   * until the crossing direction is
   * known.
   */
  ready: boolean

  possibleDegrees: number[]

  checks:
    MaLuTotalDegreeCheck[]

  applicable: boolean

  firstFailingCheck:
    MaLuTotalDegreeCheck | null
}

type MaLuTotalCertificateArgs = {
  target: MaLuTarget

  /*
   * Degree of the current residual
   * regular graph before a Lovasz
   * partition.
   */
  workingDegree: number

  /*
   * Contribution already forced by
   * previously oriented 2-factors.
   */
  fixedOutdegreeContribution:
    number

  partition:
    LovaszPair | null

  acrossDirection:
    AcrossDirection | null

  selectedTotalOutdegrees:
    readonly number[]
}

function uniqueSorted(
  values: readonly number[],
) {
  return Array.from(
    new Set(values),
  ).sort(
    (a, b) => a - b,
  )
}

function crossingEdgesPointOut(
  target: MaLuPartTarget,

  acrossDirection:
    AcrossDirection,
) {
  return (
    (
      target === 'L' &&
      acrossDirection ===
        'L-to-R'
    ) ||
    (
      target === 'R' &&
      acrossDirection ===
        'R-to-L'
    )
  )
}

/*
 * Translate selected FINAL total
 * outdegrees into the internal
 * forbidden list seen by Ma-Lu at a
 * vertex of internal degree r.
 *
 * If c is the contribution already
 * fixed outside the target graph, then
 *
 *   final outdegree
 *     =
 *   c + internal outdegree.
 *
 * Therefore a selected final value q
 * corresponds to internal value q-c.
 */
export function translateTotalTargetsAtDegree(
  selectedTotalOutdegrees:
    readonly number[],

  outsideContribution: number,

  internalDegree: number,
) {
  const localValues:
    number[] = []

  for (
    const totalOutdegree
    of selectedTotalOutdegrees
  ) {
    const internalValue =
      totalOutdegree -
      outsideContribution

    if (
      internalValue >= 0 &&
      internalValue <=
        internalDegree
    ) {
      localValues.push(
        internalValue,
      )
    }
  }

  return uniqueSorted(
    localValues,
  )
}

function getWholeGraphCertificate({
  workingDegree,
  fixedOutdegreeContribution,
  selectedTotalOutdegrees,
}: MaLuTotalCertificateArgs):
  MaLuTotalCertificate {
  const normalizedTargets =
    uniqueSorted(
      selectedTotalOutdegrees,
    )

  const localForbiddenSet =
    translateTotalTargetsAtDegree(
      normalizedTargets,

      fixedOutdegreeContribution,

      workingDegree,
    )

  const baseCheck =
    getMaLuSelectionDegreeCheck(
      workingDegree,

      localForbiddenSet,
    )

  const check:
    MaLuTotalDegreeCheck = {
    ...baseCheck,

    outsideContribution:
      fixedOutdegreeContribution,
  }

  return {
    target: 'G',

    selectedTotalOutdegrees:
      normalizedTargets,

    ready: true,

    possibleDegrees: [
      workingDegree,
    ],

    checks: [check],

    applicable:
      check.passes,

    firstFailingCheck:
      check.passes
        ? null
        : check,
  }
}

function getPartCertificate({
  target,
  workingDegree,
  fixedOutdegreeContribution,
  partition,
  acrossDirection,
  selectedTotalOutdegrees,
}: MaLuTotalCertificateArgs):
  MaLuTotalCertificate {
  const normalizedTargets =
    uniqueSorted(
      selectedTotalOutdegrees,
    )

  if (
    target === 'G'
  ) {
    throw new Error(
      'Part certificate requires target L or R.',
    )
  }

  if (
    partition === null ||
    acrossDirection === null
  ) {
    return {
      target,

      selectedTotalOutdegrees:
        normalizedTargets,

      ready: false,

      possibleDegrees: [],

      checks: [],

      applicable: false,

      firstFailingCheck:
        null,
    }
  }

  const maxInternalDegree =
    target === 'L'
      ? partition.s
      : partition.t

  const possibleDegrees =
    getMaLuSelectableValues(
      maxInternalDegree,
    )

  const pointsOut =
    crossingEdgesPointOut(
      target,
      acrossDirection,
    )

  const checks:
    MaLuTotalDegreeCheck[] = []

  /*
   * The Lovasz partition only gives an
   * upper bound on internal degree, so
   * every r in
   *
   *   0,...,maxInternalDegree
   *
   * must be checked.
   */
  for (
    const internalDegree
    of possibleDegrees
  ) {
    /*
     * A vertex of internal degree r has
     *
     *   workingDegree-r
     *
     * crossing edges.
     *
     * They contribute to outdegree
     * exactly when the crossing
     * orientation points out of this
     * part.
     */
    const crossingContribution =
      pointsOut
        ? workingDegree -
          internalDegree
        : 0

    const outsideContribution =
      fixedOutdegreeContribution +
      crossingContribution

    const localForbiddenSet =
      translateTotalTargetsAtDegree(
        normalizedTargets,

        outsideContribution,

        internalDegree,
      )

    const baseCheck =
      getMaLuSelectionDegreeCheck(
        internalDegree,

        localForbiddenSet,
      )

    checks.push({
      ...baseCheck,

      outsideContribution,
    })
  }

  const firstFailingCheck =
    checks.find(
      (check) =>
        !check.passes,
    ) ?? null

  return {
    target,

    selectedTotalOutdegrees:
      normalizedTargets,

    ready: true,

    possibleDegrees,

    checks,

    applicable:
      firstFailingCheck === null,

    firstFailingCheck,
  }
}

export function getMaLuTotalCertificate(
  args:
    MaLuTotalCertificateArgs,
): MaLuTotalCertificate {
  if (
    args.target === 'G'
  ) {
    return getWholeGraphCertificate(
      args,
    )
  }

  return getPartCertificate(
    args,
  )
}