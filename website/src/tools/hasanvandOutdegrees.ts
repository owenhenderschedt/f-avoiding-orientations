import type {
  AcrossDirection,
} from './orientAcrossPartition'
import type {
  HasanvandApplication,
} from './hasanvandApplication'
import {
  getHasanvandRuleForDegree,
  getHasanvandValuesForDegree,
} from './hasanvandMath'
import {
  allOutdegrees,
  uniqueSorted,
  type GraphPart,
  type OutdegreeSet,
} from '../playground/outdegreePossibilities'

/*
 * Determine the internal outdegree
 * possibilities supplied by a
 * Hasanvand application at a vertex
 * whose degree inside the target graph
 * is exactly r.
 *
 * The saved application has already
 * been certified, so exactly one rule
 * should apply to every possible
 * degree. We nevertheless return the
 * empty set defensively if that
 * invariant is violated.
 */
export function getHasanvandInternalChoicesForDegree({
  internalDegree,
  application,
}: {
  internalDegree: number

  application:
    HasanvandApplication
}): OutdegreeSet {
  const rule =
    getHasanvandRuleForDegree(
      application.rules,
      internalDegree,
    )

  if (
    rule === null
  ) {
    return []
  }

  return getHasanvandValuesForDegree(
    internalDegree,
    rule.p,
    rule.q,
  )
}

/*
 * Whole-graph application.
 *
 * In the playground, G is regular, so
 * every vertex has the same degree.
 * Hasanvand may use a rule system
 * internally, but only the rule for
 * this actual degree contributes to
 * the displayed possibilities.
 */
export function getHasanvandWholeGraphChoices(
  degree: number,

  application:
    HasanvandApplication,
): OutdegreeSet {
  return uniqueSorted(
    getHasanvandInternalChoicesForDegree({
      internalDegree:
        degree,

      application,
    }),
  )
}

/*
 * Hasanvand has oriented only the
 * induced graph on one side of a
 * partition.
 *
 * If the crossing edges have not yet
 * been oriented, this does not by
 * itself restrict TOTAL outdegree:
 * the unoriented crossing edges could
 * contribute any feasible amount.
 *
 * Once the crossing direction is
 * fixed, we loop over every internal
 * degree that may occur and translate
 * Hasanvand's internal choices into
 * total outdegrees.
 */
export function getHasanvandPartOutdegreePossibilities({
  degree,
  maxInternalDegree,
  part,
  acrossDirection,
  application,
}: {
  degree: number

  maxInternalDegree:
    number

  part: GraphPart

  acrossDirection:
    AcrossDirection | null

  application:
    HasanvandApplication
}): OutdegreeSet {
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
    const internalChoices =
      getHasanvandInternalChoicesForDegree(
        {
          internalDegree,

          application,
        },
      )

    /*
     * In the ambient degree-d graph, a
     * vertex with internal degree r has
     *
     *   d-r
     *
     * crossing edges.
     *
     * If all crossing edges point out
     * of this part, those contribute
     * d-r to total outdegree.
     *
     * If they point into this part,
     * they contribute zero.
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