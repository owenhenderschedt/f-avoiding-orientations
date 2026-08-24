import type {
  ParityBoundsApplication,
} from '../tools/parityBoundsApplication'
import type {
  PartOutdegreePossibilities,
} from './outdegreePossibilities'

export function getParityBoundsOutdegreePossibilities({
  application,
}: {
  application:
    ParityBoundsApplication
}): PartOutdegreePossibilities {
  /*
   * Parity Bounds is currently a
   * whole-working-graph constructor.
   *
   * Before a Lovasz partition, the
   * playground represents G by placing
   * the same abstract possibility set in
   * the L and R slots.
   */
  return {
    L: [
      ...application
        .totalOutdegrees,
    ],

    R: [
      ...application
        .totalOutdegrees,
    ],
  }
}

export default
  getParityBoundsOutdegreePossibilities