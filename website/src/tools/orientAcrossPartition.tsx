import type { LovaszPair } from './lovaszPartition'

export type AcrossDirection = 'L-to-R' | 'R-to-L'

export type OutdegreeRange = {
  min: number
  max: number
}

export type AcrossOutdegreeGuarantees = {
  L: OutdegreeRange
  R: OutdegreeRange
}

export const orientAcrossPartitionTool = {
  id: 'orient-across-partition',
  name: 'Orient Across Partition',
} as const

export function getAcrossDirectionLabel(direction: AcrossDirection) {
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
      L: {
        min: degree - partition.s,
        max: degree,
      },
      R: {
        min: 0,
        max: partition.t,
      },
    }
  }

  return {
    L: {
      min: 0,
      max: partition.s,
    },
    R: {
      min: degree - partition.t,
      max: degree,
    },
  }
}