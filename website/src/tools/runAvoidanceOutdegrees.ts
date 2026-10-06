import type {
  AcrossDirection,
} from './orientAcrossPartition'
import type {
  RunAvoidanceApplication,
} from './runAvoidanceApplication'
import {
  allOutdegrees,
  uniqueSorted,
  type GraphPart,
  type OutdegreeSet,
} from '../playground/outdegreePossibilities'

/*
 * Return the internal outdegrees that
 * the certified Run Avoidance
 * application forbids at vertices of
 * one particular internal degree.
 *
 * Run Avoidance is always stored in
 * total-targeting form. The exact
 * translated local list was certified
 * when the application was created and
 * is recorded in degreeRules.
 */
export function getRunAvoidanceForbiddenInternalValues(
  internalDegree: number,

  application:
    RunAvoidanceApplication,
): number[] {
  const rule =
    application
      .degreeRules
      .find(
        (candidate) =>
          candidate.degree ===
          internalDegree,
      )

  /*
   * A valid application has a rule for
   * every degree that can occur.
   *
   * If state ever becomes inconsistent,
   * remain conservative: remove
   * nothing rather than claim an
   * unsupported restriction.
   */
  if (
    rule === undefined
  ) {
    return []
  }

  return [
    ...rule.localForbiddenSet,
  ]
}

/*
 * Possible outdegrees INSIDE the graph
 * on which Run Avoidance was applied.
 */
export function getRunAvoidanceInternalChoices(
  internalDegree: number,

  application:
    RunAvoidanceApplication,
): OutdegreeSet {
  const forbiddenValues =
    getRunAvoidanceForbiddenInternalValues(
      internalDegree,
      application,
    )

  return allOutdegrees(
    internalDegree,
  ).filter(
    (outdegree) =>
      !forbiddenValues.includes(
        outdegree,
      ),
  )
}

/*
 * Whole current residual graph.
 *
 * Any fixed contribution from
 * previously oriented 2-factors is
 * added later by shiftPartOutdegrees().
 */
export function getRunAvoidanceWholeGraphChoices(
  degree: number,

  application:
    RunAvoidanceApplication,
): OutdegreeSet {
  return getRunAvoidanceInternalChoices(
    degree,
    application,
  )
}

type RunAvoidancePartPossibilitiesArgs = {
  /*
   * Degree of the current residual
   * regular graph before the Lovasz
   * partition.
   */
  degree: number

  /*
   * Lovasz upper bound on internal
   * degree in this part.
   */
  maxInternalDegree: number

  part:
    GraphPart

  acrossDirection:
    AcrossDirection | null

  application:
    RunAvoidanceApplication
}

/*
 * Convert a Run Avoidance orientation
 * inside G[L] or G[R] into possible
 * residual TOTAL outdegrees.
 *
 * The contribution from previously
 * oriented 2-factors is deliberately
 * omitted here. It is added later by
 * shiftPartOutdegrees().
 */
export function getRunAvoidancePartOutdegreePossibilities({
  degree,
  maxInternalDegree,
  part,
  acrossDirection,
  application,
}: RunAvoidancePartPossibilitiesArgs):
  OutdegreeSet {
  /*
   * A part-targeted Run application
   * cannot be certified until the
   * crossing direction is known.
   *
   * If inconsistent state ever reaches
   * this function, stay conservative.
   */
  if (
    acrossDirection === null
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

  /*
   * A Lovasz partition gives only
   *
   *   d_{G[X]}(v)
   *     <=
   *   maxInternalDegree.
   *
   * Therefore take the union over every
   * possible actual internal degree.
   */
  for (
    let internalDegree = 0;

    internalDegree <=
      maxInternalDegree;

    internalDegree += 1
  ) {
    const internalChoices =
      getRunAvoidanceInternalChoices(
        internalDegree,
        application,
      )

    /*
     * In the residual degree-d graph,
     * a vertex with internal degree h
     * has d-h crossing edges.
     */
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
