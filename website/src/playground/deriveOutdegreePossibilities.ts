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

function possibilitiesForPart(
  degree: number,
  maxInternalDegree: number,
  part: GraphPart,
  acrossDirection: AcrossDirection | null,
  balanced: boolean,
): OutdegreeSet {
  /*
   * If the internal edges have not been balanced, then our only
   * orientation information may come from the crossing edges.
   */
  if (!balanced) {
    if (acrossDirection === null) {
      return allOutdegrees(degree)
    }

    const crossingEdgesPointOut =
      (part === 'L' && acrossDirection === 'L-to-R') ||
      (part === 'R' && acrossDirection === 'R-to-L')

    if (crossingEdgesPointOut) {
      const values: number[] = []

      /*
       * If a vertex has internal degree r, then it has d-r crossing
       * edges, all directed outward. Its internal outdegree can still
       * be anything from 0 through r.
       */
      for (
        let internalDegree = 0;
        internalDegree <= maxInternalDegree;
        internalDegree += 1
      ) {
        const crossingDegree = degree - internalDegree

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

    /*
     * All crossing edges point inward, so total outdegree comes only
     * from internal edges.
     */
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
   * If the internal graph is balanced but the crossing edges have not
   * yet been oriented, then no useful uniform restriction on total
   * outdegree follows yet. In particular, internal degree 0 is allowed
   * by our current information, leaving every total outdegree 0,...,d
   * possible.
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

    for (const internalOutdegree of internalChoices) {
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
  balancedL,
  balancedR,
}: DeriveOutdegreePossibilitiesArgs):
  PartOutdegreePossibilities {
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