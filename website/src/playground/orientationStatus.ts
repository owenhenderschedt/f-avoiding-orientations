import type {
  PartOutdegreePossibilities,
} from './outdegreePossibilities'

type OrientationStatusArgs = {
  forbiddenSet:
    readonly number[]

  outdegreePossibilities:
    PartOutdegreePossibilities

  /*
   * These names deliberately describe
   * the mathematical state rather than
   * the particular theorem/tool used
   * to obtain the orientation.
   */
  wholeGraphOriented: boolean

  acrossOriented: boolean

  leftInternallyOriented: boolean
  rightInternallyOriented: boolean
}

export type OrientationStatus = {
  isComplete: boolean
  isValidFAvoiding: boolean
}

function avoidsForbiddenSet(
  values: readonly number[],
  forbiddenSet:
    readonly number[],
) {
  return values.every(
    (value) =>
      !forbiddenSet.includes(
        value,
      ),
  )
}

export default function getOrientationStatus({
  forbiddenSet,
  outdegreePossibilities,
  wholeGraphOriented,
  acrossOriented,
  leftInternallyOriented,
  rightInternallyOriented,
}: OrientationStatusArgs): OrientationStatus {
  const isComplete =
    wholeGraphOriented ||
    (
      acrossOriented &&
      leftInternallyOriented &&
      rightInternallyOriented
    )

  if (!isComplete) {
    return {
      isComplete: false,
      isValidFAvoiding:
        false,
    }
  }

  const leftAvoidsF =
    avoidsForbiddenSet(
      outdegreePossibilities.L,
      forbiddenSet,
    )

  const rightAvoidsF =
    avoidsForbiddenSet(
      outdegreePossibilities.R,
      forbiddenSet,
    )

  return {
    isComplete: true,

    isValidFAvoiding:
      leftAvoidsF &&
      rightAvoidsF,
  }
}