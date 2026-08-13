import type { PartOutdegreePossibilities } from './outdegreePossibilities'

type OrientationStatusArgs = {
  forbiddenSet: readonly number[]
  outdegreePossibilities: PartOutdegreePossibilities
  balancedG: boolean
  acrossOriented: boolean
  balancedL: boolean
  balancedR: boolean
}

export type OrientationStatus = {
  isComplete: boolean
  isValidFAvoiding: boolean
}

function avoidsForbiddenSet(
  values: readonly number[],
  forbiddenSet: readonly number[],
) {
  return values.every(
    (value) => !forbiddenSet.includes(value),
  )
}

export default function getOrientationStatus({
  forbiddenSet,
  outdegreePossibilities,
  balancedG,
  acrossOriented,
  balancedL,
  balancedR,
}: OrientationStatusArgs): OrientationStatus {
  /*
   * Balancing G orients the whole graph immediately.
   *
   * Otherwise, in the partitioned picture all edges are oriented
   * exactly when the crossing edges, G[L], and G[R] have all been
   * oriented.
   */
  const isComplete =
    balancedG ||
    (
      acrossOriented &&
      balancedL &&
      balancedR
    )

  if (!isComplete) {
    return {
      isComplete: false,
      isValidFAvoiding: false,
    }
  }

  const leftAvoidsF = avoidsForbiddenSet(
    outdegreePossibilities.L,
    forbiddenSet,
  )

  const rightAvoidsF = avoidsForbiddenSet(
    outdegreePossibilities.R,
    forbiddenSet,
  )

  return {
    isComplete: true,
    isValidFAvoiding:
      leftAvoidsF && rightAvoidsF,
  }
}