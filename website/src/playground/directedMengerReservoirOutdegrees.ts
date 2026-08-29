import type {
  DirectedMengerReservoirApplication,
  DirectedMengerReservoirClassesApplication,
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
 * Let Q be the independent set of bad
 * TOTAL outdegree classes on L.  Every
 * remaining vertex in P_Q is repaired by
 * exactly one unit:
 *
 *     q -> q+1  for every q in Q.
 *
 * Hence every selected class disappears
 * from the abstract L-possibility set and
 * the corresponding repaired classes are
 * added.
 *
 * The repair paths begin at reservoir
 * vertices in R.  The certificate ensures
 * that every such vertex finishes inside
 *
 *     d-k, d-k+1, ..., d.
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
  const selectedClasses =
    new Set(
      application.qs,
    )

  const repairedL =
    uniqueSorted([
      ...possibilities.L.filter(
        (outdegree) =>
          !selectedClasses.has(
            outdegree,
          ),
      ),

      ...application
        .repairedOutdegrees,
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

/*
 * Generalized-name alias for audit code.
 */
export function getDirectedMengerReservoirClassesRepairedOutdegrees({
  possibilities,
  application,
}: {
  possibilities:
    PartOutdegreePossibilities

  application:
    DirectedMengerReservoirClassesApplication
}): PartOutdegreePossibilities {
  return getDirectedMengerReservoirRepairedOutdegrees({
    possibilities,
    application,
  })
}

export default
  getDirectedMengerReservoirRepairedOutdegrees
