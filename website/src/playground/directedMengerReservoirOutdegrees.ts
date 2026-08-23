import type {
  DirectedMengerReservoirApplication,
} from '../tools/directedMengerReservoirApplication'
import type {
  PartOutdegreePossibilities,
} from './outdegreePossibilities'

function uniqueSorted(
  values:
    readonly number[],
) {
  return Array.from(
    new Set(values),
  ).sort(
    (a, b) =>
      a - b,
  )
}

/*
 * Numerical effect of a certified
 * reservoir Menger repair.
 *
 * The application repairs every
 * remaining vertex in the independent
 * q-class P_q subset L by one unit:
 *
 *      q -> q+1.
 *
 * Thus q disappears from the possible
 * outdegrees on L.
 *
 * The repair paths begin at reservoir
 * vertices in R. Each path reversal
 * decreases the outdegree of its start
 * vertex by one, while internal
 * vertices of the path keep the same
 * outdegree.
 *
 * The reservoir certificate guarantees
 * that every R-vertex remains inside
 *
 *      d-k, d-k+1, ..., d.
 *
 * Therefore the safest abstract
 * possibility set for R after the
 * repair is the entire certified
 * reservoir interval.
 */
export function getDirectedMengerReservoirRepairedOutdegrees({
  possibilities,
  application,
}: {
  possibilities:
    PartOutdegreePossibilities

  application:
    DirectedMengerReservoirApplication
}): PartOutdegreePossibilities {
  const repairedL =
    uniqueSorted([
      ...possibilities.L.filter(
        (outdegree) =>
          outdegree !==
          application.q,
      ),

      application
        .repairedOutdegree,
    ])

  const repairedR =
    uniqueSorted(
      application
        .certificate
        .reservoirSafeOutdegrees,
    )

  return {
    L:
      repairedL,

    R:
      repairedR,
  }
}

export default
  getDirectedMengerReservoirRepairedOutdegrees