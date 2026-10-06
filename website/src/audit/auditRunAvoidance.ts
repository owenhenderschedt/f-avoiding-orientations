import {
  createRunAvoidanceApplication,
  type RunAvoidanceApplication,
} from '../tools/runAvoidanceApplication'
import {
  getRunAvoidanceRValues,
  type RunAvoidanceSide,
  type RunAvoidanceTarget,
} from '../tools/runAvoidanceMath'
import {
  getRunAvoidancePartOutdegreePossibilities,
  getRunAvoidanceWholeGraphChoices,
} from '../tools/runAvoidanceOutdegrees'
import type {
  AuditSearchState,
} from './auditState'

/*
 * =========================================================
 * RUN AVOIDANCE AUDIT TRANSITIONS
 * =========================================================
 *
 * This file searches applications of the LIVE generalized
 * Run Avoidance theorem.
 *
 * selectedTotalOutdegrees always means FINAL total
 * outdegrees in the original graph.
 *
 * In particular, the search is allowed to select safe
 * classes as well as forbidden ones. This is intentional:
 * eliminating an additional safe class can change the
 * structure available to a later repair tool.
 *
 * Every proposed application is verified by
 * createRunAvoidanceApplication(), i.e. by exactly the same
 * certificate machinery used by the Playground.
 */

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
    state.runAvoidanceG !==
      null ||
    state.hasanvandG !==
      null ||
    state.parityBoundsG !==
      null
  )
}

function leftAlreadyOriented(
  state:
    AuditSearchState,
) {
  return (
    state.balancedL ||
    state.avoidCL !==
      null ||
    state.maLuL !==
      null ||
    state.runAvoidanceL !==
      null ||
    state.hasanvandL !==
      null
  )
}

function rightAlreadyOriented(
  state:
    AuditSearchState,
) {
  return (
    state.balancedR ||
    state.avoidCR !==
      null ||
    state.maLuR !==
      null ||
    state.runAvoidanceR !==
      null ||
    state.hasanvandR !==
      null
  )
}

function targetIsAvailable(
  state:
    AuditSearchState,

  target:
    RunAvoidanceTarget,
) {
  if (
    constructorsLocked(
      state,
    )
  ) {
    return false
  }

  if (
    target ===
      'G'
  ) {
    return (
      state.partition ===
        null &&
      !wholeGraphAlreadyOriented(
        state,
      )
    )
  }

  if (
    state.partition ===
      null ||
    state.acrossDirection ===
      null
  ) {
    return false
  }

  return target ===
    'L'
    ? !leftAlreadyOriented(
        state,
      )
    : !rightAlreadyOriented(
        state,
      )
}

function getTargetMaxDegree(
  state:
    AuditSearchState,

  target:
    RunAvoidanceTarget,
) {
  if (
    target ===
      'G'
  ) {
    return state
      .workingDegree
  }

  if (
    state.partition ===
      null
  ) {
    return 0
  }

  return target ===
    'L'
    ? state.partition.s
    : state.partition.t
}

/*
 * These are TOTAL outdegrees already represented by the
 * current symbolic state on the chosen target.
 *
 * Restricting to them loses nothing for the immediate Run
 * orientation: selecting an outdegree that cannot currently
 * occur cannot further restrict that starting orientation.
 */
function getCurrentTargetOutdegrees(
  state:
    AuditSearchState,

  target:
    RunAvoidanceTarget,
) {
  if (
    target ===
      'L'
  ) {
    return uniqueSorted(
      state
        .outdegreePossibilities
        .L,
    )
  }

  if (
    target ===
      'R'
  ) {
    return uniqueSorted(
      state
        .outdegreePossibilities
        .R,
    )
  }

  return uniqueSorted([
    ...state
      .outdegreePossibilities
      .L,

    ...state
      .outdegreePossibilities
      .R,
  ])
}

function getNonemptySubsets(
  values:
    readonly number[],
) {
  const normalized =
    uniqueSorted(
      values,
    )

  const subsets:
    number[][] = []

  /*
   * The audit is currently used at small regular degrees
   * (in particular d=14). Recursive generation avoids the
   * 32-bit limitations of bit-mask enumeration and keeps
   * this helper correct if larger degrees are tested later.
   */
  function visit(
    index:
      number,

    chosen:
      number[],
  ) {
    if (
      index ===
        normalized.length
    ) {
      if (
        chosen.length >
        0
      ) {
        subsets.push([
          ...chosen,
        ])
      }

      return
    }

    visit(
      index + 1,
      chosen,
    )

    chosen.push(
      normalized[index],
    )

    visit(
      index + 1,
      chosen,
    )

    chosen.pop()
  }

  visit(
    0,
    [],
  )

  return subsets
}

function createApplication({
  state,
  target,
  r,
  side,
  selectedTotalOutdegrees,
}: {
  state:
    AuditSearchState

  target:
    RunAvoidanceTarget

  r:
    number

  side:
    RunAvoidanceSide

  selectedTotalOutdegrees:
    readonly number[]
}) {
  return createRunAvoidanceApplication({
    target,

    workingDegree:
      state.workingDegree,

    fixedOutdegreeContribution:
      state
        .fixedOutdegreeContribution,

    partition:
      state.partition,

    acrossDirection:
      state.acrossDirection,

    r,

    side,

    selectedTotalOutdegrees,
  })
}

function shiftResidualValues(
  values:
    readonly number[],

  fixedOutdegreeContribution:
    number,
) {
  return uniqueSorted(
    values.map(
      (value) =>
        value +
        fixedOutdegreeContribution,
    ),
  )
}

function getApplicationTotalOutdegrees(
  state:
    AuditSearchState,

  application:
    RunAvoidanceApplication,
) {
  if (
    application.target ===
      'G'
  ) {
    return shiftResidualValues(
      getRunAvoidanceWholeGraphChoices(
        state.workingDegree,
        application,
      ),

      state
        .fixedOutdegreeContribution,
    )
  }

  if (
    state.partition ===
      null
  ) {
    return []
  }

  const maxInternalDegree =
    application.target ===
      'L'
      ? state.partition.s
      : state.partition.t

  return shiftResidualValues(
    getRunAvoidancePartOutdegreePossibilities({
      degree:
        state.workingDegree,

      maxInternalDegree,

      part:
        application.target,

      acrossDirection:
        state.acrossDirection,

      application,
    }),

    state
      .fixedOutdegreeContribution,
  )
}

function applyRunAvoidance(
  state:
    AuditSearchState,

  application:
    RunAvoidanceApplication,
) {
  const target =
    application.target

  const targetOutdegrees =
    getApplicationTotalOutdegrees(
      state,
      application,
    )

  const nextState:
    AuditSearchState = {
    ...state,

    runAvoidanceG:
      target ===
        'G'
        ? application
        : state
            .runAvoidanceG,

    runAvoidanceL:
      target ===
        'L'
        ? application
        : state
            .runAvoidanceL,

    runAvoidanceR:
      target ===
        'R'
        ? application
        : state
            .runAvoidanceR,

    outdegreePossibilities:
      target ===
        'G'
        ? {
            L: [
              ...targetOutdegrees,
            ],

            R: [
              ...targetOutdegrees,
            ],
          }
        : target ===
            'L'
          ? {
              L: [
                ...targetOutdegrees,
              ],

              R: [
                ...state
                  .outdegreePossibilities
                  .R,
              ],
            }
          : {
              L: [
                ...state
                  .outdegreePossibilities
                  .L,
              ],

              R: [
                ...targetOutdegrees,
              ],
            },

    steps: [
      ...state.steps,

      {
        type:
          'run-avoidance',

        target,

        r:
          application.r,

        side:
          application.side,

        selectedTotalOutdegrees: [
          ...application
            .selectedTotalOutdegrees,
        ],
      },
    ],
  }

  return nextState
}

function countForbidden(
  values:
    readonly number[],

  forbidden:
    ReadonlySet<number>,
) {
  return values.filter(
    (value) =>
      forbidden.has(
        value,
      ),
  ).length
}

/*
 * Generate Run candidates for one target.
 *
 * Key finite reduction:
 *
 * If a total value q fails the theorem as a singleton,
 * then no valid larger selected set can contain q.
 *
 * Indeed, enlarging the selected set cannot repair a range
 * failure, while the run condition is also monotone under
 * taking subsets.
 *
 * Thus we first retain exactly the individually admissible
 * currently-possible total classes, and only enumerate
 * subsets of that smaller universe.
 */
function getTargetTransitions(
  state:
    AuditSearchState,

  target:
    RunAvoidanceTarget,
) {
  if (
    !targetIsAvailable(
      state,
      target,
    )
  ) {
    return []
  }

  const maxDegree =
    getTargetMaxDegree(
      state,
      target,
    )

  const rValues =
    getRunAvoidanceRValues(
      maxDegree,
    )

  const currentValues =
    getCurrentTargetOutdegrees(
      state,
      target,
    )

  const forbidden =
    new Set(
      state.forbiddenSet,
    )

  const transitions:
    AuditSearchState[] = []

  /*
   * Different Run certificates can occasionally lead to
   * exactly the same symbolic outdegree state.
   *
   * Later audit tools depend on that resulting state and on
   * whether the target has been oriented, not on which of
   * two equivalent Run certificates produced it. Keep one
   * representative to avoid needless search branching.
   */
  const seenOutcomeKeys =
    new Set<string>()

  const sides:
    RunAvoidanceSide[] = [
      'low',
      'high',
    ]

  for (
    const r
    of rValues
  ) {
    for (
      const side
      of sides
    ) {
      const singletonCandidates =
        currentValues.filter(
          (value) =>
            createApplication({
              state,
              target,
              r,
              side,

              selectedTotalOutdegrees: [
                value,
              ],
            }) !==
            null,
        )

      for (
        const selectedTotalOutdegrees
        of getNonemptySubsets(
          singletonCandidates,
        )
      ) {
        /*
         * A constructor that eliminates only currently-safe
         * classes does not make progress on the F-avoiding
         * problem before the repair layer is reached.
         *
         * Safe values may still be included freely alongside
         * at least one forbidden value.
         */
        if (
          countForbidden(
            selectedTotalOutdegrees,
            forbidden,
          ) ===
          0
        ) {
          continue
        }

        const application =
          createApplication({
            state,
            target,
            r,
            side,
            selectedTotalOutdegrees,
          })

        if (
          application ===
            null
        ) {
          continue
        }

        const nextState =
          applyRunAvoidance(
            state,
            application,
          )

        const outcomeKey =
          target ===
            'G'
            ? [
                'G',
                nextState
                  .outdegreePossibilities
                  .L
                  .join(','),
              ].join(':')
            : target ===
                'L'
              ? [
                  'L',
                  nextState
                    .outdegreePossibilities
                    .L
                    .join(','),
                ].join(':')
              : [
                  'R',
                  nextState
                    .outdegreePossibilities
                    .R
                    .join(','),
                ].join(':')

        if (
          seenOutcomeKeys.has(
            outcomeKey,
          )
        ) {
          continue
        }

        seenOutcomeKeys.add(
          outcomeKey,
        )

        transitions.push(
          nextState,
        )
      }
    }
  }

  /*
   * Put states eliminating more currently-forbidden classes
   * first, then states leaving fewer total possibilities.
   *
   * proofSearch still performs its own global priority
   * ordering; this merely gives sensible serial tie-breaking.
   */
  transitions.sort(
    (a, b) => {
      const valuesA =
        target ===
          'R'
          ? a
              .outdegreePossibilities
              .R
          : a
              .outdegreePossibilities
              .L

      const valuesB =
        target ===
          'R'
          ? b
              .outdegreePossibilities
              .R
          : b
              .outdegreePossibilities
              .L

      const badA =
        countForbidden(
          valuesA,
          forbidden,
        )

      const badB =
        countForbidden(
          valuesB,
          forbidden,
        )

      return (
        badA -
          badB ||
        valuesA.length -
          valuesB.length
      )
    },
  )

  return transitions
}

export function getAuditRunAvoidanceTransitions(
  state:
    AuditSearchState,
) {
  return [
    ...getTargetTransitions(
      state,
      'G',
    ),

    ...getTargetTransitions(
      state,
      'L',
    ),

    ...getTargetTransitions(
      state,
      'R',
    ),
  ]
}
