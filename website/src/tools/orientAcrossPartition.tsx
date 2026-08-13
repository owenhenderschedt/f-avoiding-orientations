import type { LovaszPair } from './lovaszPartition'
import {
  integerRange,
  type PartOutdegreePossibilities,
} from '../playground/outdegreePossibilities'

export type AcrossDirection = 'L-to-R' | 'R-to-L'

export type AcrossOutdegreeGuarantees =
  PartOutdegreePossibilities

export const orientAcrossPartitionTool = {
  id: 'orient-across-partition',
  name: 'Orient Across Partition',
} as const

export function getAcrossDirectionLabel(
  direction: AcrossDirection,
) {
  if (direction === 'L-to-R') {
    return 'Orient L → R'
  }

  return 'Orient R → L'
}

export function getAcrossOutdegreeGuarantees(
  degree: number,
  partition: LovaszPair,
  direction: AcrossDirection,
): AcrossOutdegreeGuarantees {
  if (direction === 'L-to-R') {
    return {
      L: integerRange(
        degree - partition.s,
        degree,
      ),
      R: integerRange(
        0,
        partition.t,
      ),
    }
  }

  return {
    L: integerRange(
      0,
      partition.s,
    ),
    R: integerRange(
      degree - partition.t,
      degree,
    ),
  }
}