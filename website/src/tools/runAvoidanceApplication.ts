import type {
  LovaszPair,
} from './lovaszPartition'
import type {
  AcrossDirection,
} from './orientAcrossPartition'
import {
  getRunAvoidanceTotalCertificate,
  type RunAvoidanceTotalCertificate,
  type RunAvoidanceTotalDegreeCheck,
} from './runAvoidanceTargeting'
import type {
  RunAvoidanceSide,
  RunAvoidanceTarget,
} from './runAvoidanceMath'

export type RunAvoidanceDegreeRule = {
  /*
   * Internal degree in the graph H on
   * which Run Avoidance is applied.
   */
  degree: number

  /*
   * Outdegree contribution already
   * forced outside H.
   */
  outsideContribution: number

  /*
   * Local internal outdegrees avoided
   * by the generalized Run Avoidance
   * theorem at vertices of this degree.
   */
  localForbiddenSet:
    number[]

  /*
   * Length of the longest consecutive
   * run in localForbiddenSet.
   */
  longestConsecutiveRun:
    number
}

/*
 * A completed Run Avoidance move.
 *
 * selectedTotalOutdegrees are FINAL
 * total outdegree classes that the
 * constructor eliminates.
 *
 * They need not all belong to the
 * original forbidden set. Strategically
 * removing safe classes is legitimate
 * and can enable a later repair step.
 */
export type RunAvoidanceApplication = {
  target:
    RunAvoidanceTarget

  r: number

  side:
    RunAvoidanceSide

  selectedTotalOutdegrees:
    number[]

  /*
   * Degree-by-degree local lists used
   * by the theorem.
   *
   * For target G there is one rule.
   *
   * For target L or R there is one rule
   * for every possible internal degree.
   */
  degreeRules:
    RunAvoidanceDegreeRule[]

  /*
   * Preserve the exact theorem
   * certificate used when the move was
   * created. This lets the UI and
   * Warehouse explain the proof without
   * recomputing or guessing it later.
   */
  certificate:
    RunAvoidanceTotalCertificate
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

function createDegreeRule(
  check:
    RunAvoidanceTotalDegreeCheck,
): RunAvoidanceDegreeRule {
  return {
    degree:
      check.degree,

    outsideContribution:
      check.outsideContribution,

    localForbiddenSet:
      [...check
        .localForbiddenSet],

    longestConsecutiveRun:
      check
        .longestConsecutiveRun,
  }
}

/*
 * Create a permanent Run Avoidance
 * application only after the complete
 * generalized theorem certificate has
 * been verified.
 *
 * Returning null means that the
 * proposed move must not be committed
 * to playground or audit state.
 */
export function createRunAvoidanceApplication({
  target,
  workingDegree,
  fixedOutdegreeContribution,
  partition,
  acrossDirection,
  r,
  side,
  selectedTotalOutdegrees,
}: {
  target:
    RunAvoidanceTarget

  workingDegree:
    number

  fixedOutdegreeContribution:
    number

  partition:
    LovaszPair | null

  acrossDirection:
    AcrossDirection | null

  r: number

  side:
    RunAvoidanceSide

  selectedTotalOutdegrees:
    readonly number[]
}): RunAvoidanceApplication | null {
  const normalizedTargets =
    uniqueSorted(
      selectedTotalOutdegrees,
    )

  /*
   * A move that eliminates no total
   * outdegree class has no effect and
   * should not be stored.
   */
  if (
    normalizedTargets.length ===
    0
  ) {
    return null
  }

  const certificate =
    getRunAvoidanceTotalCertificate({
      target,

      workingDegree,

      fixedOutdegreeContribution,

      partition,

      acrossDirection,

      r,

      side,

      selectedTotalOutdegrees:
        normalizedTargets,
    })

  if (
    !certificate.ready ||
    !certificate.applicable
  ) {
    return null
  }

  return {
    target,

    r,

    side,

    selectedTotalOutdegrees:
      normalizedTargets,

    degreeRules:
      certificate
        .checks
        .map(
          createDegreeRule,
        ),

    certificate,
  }
}

export function getRunAvoidanceApplicationLabel(
  application:
    RunAvoidanceApplication,
) {
  const values =
    application
      .selectedTotalOutdegrees
      .join(',')

  const sideLabel =
    application.side ===
      'low'
      ? 'low'
      : 'high'

  return (
    `Run Avoidance on ${application.target}: `
    + `r=${application.r}, `
    + `${sideLabel}, `
    + `eliminate total {${values}}`
  )
}

export default
  createRunAvoidanceApplication
