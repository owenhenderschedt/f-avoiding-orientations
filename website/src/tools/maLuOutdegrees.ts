import type {
  AcrossDirection,
} from './orientAcrossPartition'
import type {
  MaLuApplication,
} from './maLuApplication'
import {
  allOutdegrees,
  uniqueSorted,
  type GraphPart,
  type OutdegreeSet,
} from '../playground/outdegreePossibilities'

/*
 * Return the internal forbidden values
 * imposed by a completed Ma-Lu
 * application at a vertex of a given
 * internal degree.
 *
 * INTERNAL MODE
 * -------------
 *
 * If the user selected
 *
 *   S = {2,4},
 *
 * then a vertex of degree r must avoid
 *
 *   S intersect [0,r].
 *
 *
 * TOTAL MODE
 * ----------
 *
 * The relevant internal list may depend
 * on r. That degree-dependent list was
 * computed and certified when the
 * Ma-Lu application was created, and is
 * stored in degreeRules.
 */
export function getMaLuForbiddenInternalValues(
  internalDegree: number,
  application: MaLuApplication,
): number[] {
  if (
    application.mode ===
    'internal'
  ) {
    return application
      .selectedValues
      .filter(
        (value) =>
          value >= 0 &&
          value <=
            internalDegree,
      )
  }

  const rule =
    application
      .degreeRules
      ?.find(
        (candidate) =>
          candidate.degree ===
          internalDegree,
      )

  /*
   * A valid total-mode application
   * should contain a rule for every
   * degree that can occur.
   *
   * If a rule is ever missing, we stay
   * conservative and remove nothing
   * rather than claiming an unsupported
   * outdegree restriction.
   */
  if (rule === undefined) {
    return []
  }

  return [
    ...rule.localForbiddenSet,
  ]
}

/*
 * Return the outdegrees still allowed
 * INSIDE the graph on which Ma-Lu was
 * applied.
 */
export function getMaLuInternalChoices(
  internalDegree: number,
  application: MaLuApplication,
): OutdegreeSet {
  const forbiddenValues =
    getMaLuForbiddenInternalValues(
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
 * For internal mode, this simply
 * removes the selected residual
 * outdegrees.
 *
 * For total mode, the stored rule for
 * this degree already contains the
 * correct translated residual
 * forbidden values.
 *
 * Any contribution from previously
 * oriented 2-factors is added afterward
 * by shiftPartOutdegrees().
 */
export function getMaLuWholeGraphChoices(
  degree: number,
  application: MaLuApplication,
): OutdegreeSet {
  return getMaLuInternalChoices(
    degree,
    application,
  )
}

type MaLuPartPossibilitiesArgs = {
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

  part: GraphPart

  acrossDirection:
    AcrossDirection | null

  application:
    MaLuApplication
}

/*
 * Convert a Ma-Lu orientation inside
 * G[L] or G[R] into possible residual
 * TOTAL outdegrees.
 *
 * The fixed contribution from removed
 * oriented 2-factors is not included
 * here. It is added later by
 * shiftPartOutdegrees().
 */
export function getMaLuPartOutdegreePossibilities({
  degree,
  maxInternalDegree,
  part,
  acrossDirection,
  application,
}: MaLuPartPossibilitiesArgs):
  OutdegreeSet {
  /*
   * Internal-mode Ma-Lu may be applied
   * before the crossing edges are
   * oriented.
   *
   * At that stage we know a useful
   * internal fact, but we deliberately
   * keep the displayed TOTAL
   * outdegrees conservative.
   *
   * A total-mode Ma-Lu application on a
   * part will normally never reach this
   * state, because total targeting
   * requires the crossing direction to
   * be known before it can be
   * certified.
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

  const values: number[] = []

  /*
   * We know only
   *
   *   d_{G[X]}(v)
   *     <=
   *   maxInternalDegree.
   *
   * Therefore we take the union over
   * every possible actual internal
   * degree r.
   */
  for (
    let internalDegree = 0;
    internalDegree <=
      maxInternalDegree;
    internalDegree += 1
  ) {
    /*
     * This is where the two Ma-Lu modes
     * differ.
     *
     * In internal mode, the same
     * selected set is restricted to
     * [0,r].
     *
     * In total mode, this reads the
     * degree-dependent local list that
     * was certified for this particular
     * r.
     */
    const internalChoices =
      getMaLuInternalChoices(
        internalDegree,
        application,
      )

    /*
     * A vertex of internal degree r in
     * the residual degree-d graph has
     *
     *   d-r
     *
     * crossing edges.
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