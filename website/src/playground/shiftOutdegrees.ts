import {
  uniqueSorted,
  type OutdegreeSet,
  type PartOutdegreePossibilities,
} from './outdegreePossibilities'

export function shiftOutdegreeSet(
  values: readonly number[],
  amount: number,
): OutdegreeSet {
  return uniqueSorted(
    values.map(
      (value) => value + amount,
    ),
  )
}

export function shiftPartOutdegrees(
  possibilities: PartOutdegreePossibilities,
  amount: number,
): PartOutdegreePossibilities {
  return {
    L: shiftOutdegreeSet(
      possibilities.L,
      amount,
    ),

    R: shiftOutdegreeSet(
      possibilities.R,
      amount,
    ),
  }
}