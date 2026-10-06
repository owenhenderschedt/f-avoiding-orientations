import type {
  LovaszPair,
} from './lovaszPartition'
import type {
  AcrossDirection,
} from './orientAcrossPartition'
import {
  getRunAvoidanceDegreeCheck,
  type RunAvoidanceDegreeCheck,
  type RunAvoidanceSide,
  type RunAvoidanceTarget,
} from './runAvoidanceMath'

export type RunAvoidanceTotalDegreeCheck =
  RunAvoidanceDegreeCheck & {
    /*
     * Contribution to FINAL outdegree
     * that is already fixed outside
     * the graph on which Run Avoidance
     * is being applied.
     *
     * This includes:
     *
     *   - one outgoing edge from every
     *     previously oriented 2-factor;
     *
     *   - all crossing edges when the
     *     cut orientation points out of
     *     the target Lovasz part.
     */
    outsideContribution: number
  }

export type RunAvoidanceTotalCertificate = {
  target:
    RunAvoidanceTarget

  r: number

  side:
    RunAvoidanceSide

  /*
   * These are FINAL TOTAL outdegrees
   * that Run Avoidance is being asked
   * to eliminate.
   *
   * They are not required to belong to
   * the original forbidden set. This
   * is deliberate: strategically
   * eliminating safe classes can make
   * later repair tools possible.
   */
  selectedTotalOutdegrees:
    number[]

  /*
   * False when a part-targeted
   * application cannot yet translate
   * total outdegrees because the
   * crossing direction is unknown.
   */
  ready: boolean

  /*
   * Actual internal degrees that must
   * be checked.
   *
   * For G this is the single working
   * degree.
   *
   * For a Lovasz part with maximum
   * internal degree s, this is
   *
   *   0,...,s.
   */
  possibleDegrees:
    number[]

  checks:
    RunAvoidanceTotalDegreeCheck[]

  applicable: boolean

  firstFailingCheck:
    RunAvoidanceTotalDegreeCheck | null
}

type RunAvoidanceTotalCertificateArgs = {
  target:
    RunAvoidanceTarget

  /*
   * Degree of the current residual
   * regular graph after removing any
   * oriented 2-factors.
   */
  workingDegree: number

  /*
   * Every removed oriented 2-factor
   * contributes exactly one outgoing
   * edge at every vertex.
   */
  fixedOutdegreeContribution: number

  partition:
    LovaszPair | null

  acrossDirection:
    AcrossDirection | null

  r: number

  side:
    RunAvoidanceSide

  selectedTotalOutdegrees:
    readonly number[]
}

function uniqueSorted(
  values:
    readonly number[],
) {
  return Array.from(
    new Set(values),
  ).sort(
    (a, b) =>
      a - b,
  )
}

function getPossibleDegrees(
  maxDegree: number,
) {
  return Array.from(
    {
      length:
        maxDegree + 1,
    },

    (_, degree) =>
      degree,
  )
}

function crossingEdgesPointOut(
  target:
    'L' | 'R',

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
 * outdegrees into the local internal
 * list seen by Run Avoidance at a
 * vertex of internal degree h.
 *
 * If c units of outdegree are already
 * forced outside the target graph,
 * then
 *
 *   final outdegree
 *     =
 *   c + internal outdegree.
 *
 * Hence total value q corresponds to
 *
 *   q-c.
 *
 * Values outside [0,h] are irrelevant
 * at vertices of internal degree h and
 * are discarded.
 */
export function translateRunAvoidanceTargetsAtDegree(
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
  target,
  workingDegree,
  fixedOutdegreeContribution,
  r,
  side,
  selectedTotalOutdegrees,
}: RunAvoidanceTotalCertificateArgs):
  RunAvoidanceTotalCertificate {
  if (
    target !== 'G'
  ) {
    throw new Error(
      'Whole-graph certificate requires target G.',
    )
  }

  const normalizedTargets =
    uniqueSorted(
      selectedTotalOutdegrees,
    )

  const localForbiddenSet =
    translateRunAvoidanceTargetsAtDegree(
      normalizedTargets,

      fixedOutdegreeContribution,

      workingDegree,
    )

  const baseCheck =
    getRunAvoidanceDegreeCheck({
      degree:
        workingDegree,

      r,

      side,

      localForbiddenSet,
    })

  const check:
    RunAvoidanceTotalDegreeCheck = {
    ...baseCheck,

    outsideContribution:
      fixedOutdegreeContribution,
  }

  return {
    target: 'G',

    r,

    side,

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
  r,
  side,
  selectedTotalOutdegrees,
}: RunAvoidanceTotalCertificateArgs):
  RunAvoidanceTotalCertificate {
  if (
    target === 'G'
  ) {
    throw new Error(
      'Part certificate requires target L or R.',
    )
  }

  const normalizedTargets =
    uniqueSorted(
      selectedTotalOutdegrees,
    )

  if (
    partition === null ||
    acrossDirection === null
  ) {
    return {
      target,

      r,

      side,

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
    getPossibleDegrees(
      maxInternalDegree,
    )

  const pointsOut =
    crossingEdgesPointOut(
      target,
      acrossDirection,
    )

  const checks:
    RunAvoidanceTotalDegreeCheck[] = []

  /*
   * A Lovasz partition only supplies
   * an upper bound on internal degree.
   * Therefore every possible degree
   *
   *   h=0,...,maxInternalDegree
   *
   * must satisfy the generalized
   * vertexwise theorem.
   */
  for (
    const internalDegree
    of possibleDegrees
  ) {
    /*
     * In the residual working graph,
     * a vertex of internal degree h
     * has
     *
     *   workingDegree-h
     *
     * crossing edges.
     *
     * They contribute to total
     * outdegree precisely when the cut
     * points out of this part.
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
      translateRunAvoidanceTargetsAtDegree(
        normalizedTargets,

        outsideContribution,

        internalDegree,
      )

    const baseCheck =
      getRunAvoidanceDegreeCheck({
        degree:
          internalDegree,

        r,

        side,

        localForbiddenSet,
      })

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

    r,

    side,

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

/*
 * Build the complete theorem
 * certificate for a proposed Run
 * Avoidance move.
 *
 * No application should be committed
 * to playground or audit state unless
 * this certificate is ready and
 * applicable.
 */
export function getRunAvoidanceTotalCertificate(
  args:
    RunAvoidanceTotalCertificateArgs,
): RunAvoidanceTotalCertificate {
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
