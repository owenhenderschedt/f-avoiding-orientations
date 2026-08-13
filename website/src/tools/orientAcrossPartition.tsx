export type AcrossDirection = 'L-to-R' | 'R-to-L'

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