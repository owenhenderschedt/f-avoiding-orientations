import type {
  StabilizeOutdegreeClassApplication,
  StabilizeOutdegreeClassesApplication,
} from '../tools/stabilizeOutdegreeClassApplication'
import type {
  PartOutdegreePossibilities,
} from './outdegreePossibilities'

function uniqueSorted(
  values: readonly number[],
) {
  return Array.from(
    new Set(values),
  ).sort(
    (a, b) => a - b,
  )
}

function stabilizedClassSetChoices(
  startingOutdegrees: readonly number[],
  application:
    StabilizeOutdegreeClassesApplication,
) {
  /*
   * Stabilization does not eliminate Q.
   * It only makes the remaining union
   *
   *   P_Q = {v : d_D^+(v) in Q}
   *
   * independent. Neighboring classes may be created.
   */
  return uniqueSorted([
    ...startingOutdegrees,
    ...application
      .certificate
      .createdOutdegrees,
  ])
}

export function getStabilizedClassesOutdegreePossibilities({
  possibilities,
  application,
}: {
  possibilities:
    PartOutdegreePossibilities
  application:
    StabilizeOutdegreeClassesApplication
}): PartOutdegreePossibilities {
  if (
    application.target === 'G'
  ) {
    const combined =
      uniqueSorted([
        ...possibilities.L,
        ...possibilities.R,
      ])

    const stabilized =
      stabilizedClassSetChoices(
        combined,
        application,
      )

    return {
      L: stabilized,
      R: stabilized,
    }
  }

  if (
    application.target === 'L'
  ) {
    return {
      L:
        stabilizedClassSetChoices(
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
      stabilizedClassSetChoices(
        possibilities.R,
        application,
      ),
  }
}

/*
 * Backwards-compatible single-q updater.
 */

function stabilizedChoices(
  startingOutdegrees: readonly number[],
  application:
    StabilizeOutdegreeClassApplication,
) {
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
    application.target === 'G'
  ) {
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
    application.target === 'L'
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
