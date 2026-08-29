import {
  createParityBoundsApplication,
  type ParityBoundsApplication,
} from '../tools/parityBoundsApplication'
import {
  getParityBoundsOutdegreePossibilities,
} from '../playground/parityBoundsOutdegrees'
import type {
  AuditSearchState,
} from './auditState'

/*
 * Audit transition for the LIVE Parity
 * Bounds whole-working-graph constructor.
 *
 * The playground lets the user choose all
 * four interval endpoints in
 *
 *   {0,...,workingDegree}.
 *
 * We therefore enumerate exactly that finite
 * menu and let createParityBoundsApplication()
 * decide which choices are mathematically
 * certified.
 *
 * Valid applications depend only on the
 * current degree frame, not on F, so they are
 * cached.  Applications producing the same
 * possible TOTAL outdegree set are equivalent
 * for every later audit operation; we retain
 * one representative of each such set.
 */

const applicationCache =
  new Map<
    string,
    readonly ParityBoundsApplication[]
  >()

function frameKey(
  workingDegree:
    number,

  fixedOutdegreeContribution:
    number,
) {
  return (
    `${workingDegree}`
    + ':'
    + `${fixedOutdegreeContribution}`
  )
}

function wholeGraphAlreadyOriented(
  state:
    AuditSearchState,
) {
  return (
    state.balancedG ||
    state.avoidCG !==
      null ||
    state.maLuG !==
      null ||
    state.hasanvandG !==
      null ||
    state.parityBoundsG !==
      null
  )
}

function constructorsLocked(
  state:
    AuditSearchState,
) {
  return (
    state.stabilization !==
      null ||
    state.directedMenger !==
      null ||
    state
      .directedMengerReservoir !==
      null
  )
}

function getCertifiedApplications({
  workingDegree,
  fixedOutdegreeContribution,
}: {
  workingDegree:
    number

  fixedOutdegreeContribution:
    number
}) {
  const key =
    frameKey(
      workingDegree,
      fixedOutdegreeContribution,
    )

  const cached =
    applicationCache.get(
      key,
    )

  if (
    cached !==
    undefined
  ) {
    return cached
  }

  if (
    workingDegree <
      4 ||
    workingDegree %
      2 !==
      0
  ) {
    const empty:
      readonly ParityBoundsApplication[] =
        []

    applicationCache.set(
      key,
      empty,
    )

    return empty
  }

  const representatives =
    new Map<
      string,
      ParityBoundsApplication
    >()

  for (
    let normalLower = 0;
    normalLower <=
      workingDegree;
    normalLower += 1
  ) {
    for (
      let normalUpper =
        normalLower;
      normalUpper <=
        workingDegree;
      normalUpper += 1
    ) {
      for (
        let exceptionalLower = 0;
        exceptionalLower <=
          workingDegree;
        exceptionalLower += 1
      ) {
        for (
          let exceptionalUpper =
            exceptionalLower;
          exceptionalUpper <=
            workingDegree;
          exceptionalUpper += 1
        ) {
          const application =
            createParityBoundsApplication({
              workingDegree,

              fixedOutdegreeContribution,

              normalLower,

              normalUpper,

              exceptionalLower,

              exceptionalUpper,
            })

          if (
            application ===
            null
          ) {
            continue
          }

          const outdegreeKey =
            application
              .totalOutdegrees
              .join(',')

          if (
            !representatives.has(
              outdegreeKey,
            )
          ) {
            representatives.set(
              outdegreeKey,
              application,
            )
          }
        }
      }
    }
  }

  const applications =
    Array.from(
      representatives.values(),
    ).sort(
      (a, b) =>
        a.totalOutdegrees.length -
          b.totalOutdegrees.length ||
        a.normalInterval.lower -
          b.normalInterval.lower ||
        a.normalInterval.upper -
          b.normalInterval.upper ||
        a.exceptionalInterval.lower -
          b.exceptionalInterval.lower ||
        a.exceptionalInterval.upper -
          b.exceptionalInterval.upper,
    )

  applicationCache.set(
    key,
    applications,
  )

  return applications
}

function countForbiddenPossibilities(
  application:
    ParityBoundsApplication,

  forbiddenSet:
    readonly number[],
) {
  const forbidden =
    new Set(
      forbiddenSet,
    )

  return application
    .totalOutdegrees
    .filter(
      (value) =>
        forbidden.has(
          value,
        ),
    )
    .length
}

export function canApplyAuditParityBounds(
  state:
    AuditSearchState,
) {
  return (
    !constructorsLocked(
      state,
    ) &&
    state.partition ===
      null &&
    !wholeGraphAlreadyOriented(
      state,
    ) &&
    state.workingDegree >=
      4 &&
    state.workingDegree %
      2 ===
      0
  )
}

export function applyAuditParityBounds(
  state:
    AuditSearchState,

  application:
    ParityBoundsApplication,
): AuditSearchState | null {
  if (
    !canApplyAuditParityBounds(
      state,
    ) ||
    application.workingDegree !==
      state.workingDegree ||
    application
      .fixedOutdegreeContribution !==
      state
        .fixedOutdegreeContribution
  ) {
    return null
  }

  return {
    ...state,

    parityBoundsG:
      application,

    outdegreePossibilities:
      getParityBoundsOutdegreePossibilities({
        application,
      }),

    steps: [
      ...state.steps,

      {
        type:
          'parity-bounds',

        normalLower:
          application
            .normalInterval
            .lower,

        normalUpper:
          application
            .normalInterval
            .upper,

        exceptionalLower:
          application
            .exceptionalInterval
            .lower,

        exceptionalUpper:
          application
            .exceptionalInterval
            .upper,
      },
    ],
  }
}

export function getAuditParityBoundsTransitions(
  state:
    AuditSearchState,
) {
  if (
    !canApplyAuditParityBounds(
      state,
    )
  ) {
    return []
  }

  /*
   * Search promising Parity Bounds choices
   * first.  This changes only search order:
   * every distinct certified outdegree set is
   * still represented.
   */
  const applications =
    [
      ...getCertifiedApplications({
        workingDegree:
          state.workingDegree,

        fixedOutdegreeContribution:
          state
            .fixedOutdegreeContribution,
      }),
    ].sort(
      (a, b) =>
        countForbiddenPossibilities(
          a,
          state.forbiddenSet,
        ) -
          countForbiddenPossibilities(
            b,
            state.forbiddenSet,
          ) ||
        a.totalOutdegrees.length -
          b.totalOutdegrees.length,
    )

  const transitions:
    AuditSearchState[] =
      []

  for (
    const application
    of applications
  ) {
    const next =
      applyAuditParityBounds(
        state,
        application,
      )

    if (
      next !==
      null
    ) {
      transitions.push(
        next,
      )
    }
  }

  return transitions
}
