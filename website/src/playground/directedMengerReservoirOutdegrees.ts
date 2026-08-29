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
 * All values here are TOTAL outdegrees in
 * the original graph.
 *
 * Every selected demand class is repaired
 * by one unit:
 *
 *     q -> q+1.
 *
 * The fixed oriented 2-factors, if any,
 * are untouched. The certificate has
 * already translated the residual
 * reservoir interval in H into the
 * corresponding TOTAL interval in G.
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
