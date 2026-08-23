import type {
  StabilizeOutdegreeClassApplication,
} from '../tools/stabilizeOutdegreeClassApplication'
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

function stabilizedChoices(
  startingOutdegrees:
    readonly number[],

  application:
    StabilizeOutdegreeClassApplication,
) {
  /*
   * Stabilization does NOT eliminate q.
   *
   * It only guarantees that the
   * vertices which remain in the
   * q-class form an independent set.
   *
   * Reversing an arc between two
   * q-vertices can additionally create
   *
   *   q-1 and q+1.
   */
  return uniqueSorted([
    ...startingOutdegrees,

    ...application
      .certificate
      .createdOutdegrees,
  ])
}

export function getStabilizedOutdegreePossibilities({
  possibilities,
  application,
}: {
  possibilities:
    PartOutdegreePossibilities

  application:
    StabilizeOutdegreeClassApplication
}): PartOutdegreePossibilities {
  if (
    application.target ===
    'G'
  ) {
    /*
     * Before a whole-graph stabilization,
     * L and R are just two copies of the
     * same whole-graph possibility set in
     * our existing representation.
     */
    const combined =
      uniqueSorted([
        ...possibilities.L,
        ...possibilities.R,
      ])

    const stabilized =
      stabilizedChoices(
        combined,
        application,
      )

    return {
      L: stabilized,
      R: stabilized,
    }
  }

  if (
    application.target ===
    'L'
  ) {
    return {
      L:
        stabilizedChoices(
          possibilities.L,
          application,
        ),

      R:
        possibilities.R,
    }
  }

  return {
    L:
      possibilities.L,

    R:
      stabilizedChoices(
        possibilities.R,
        application,
      ),
  }
}

export default
  getStabilizedOutdegreePossibilities