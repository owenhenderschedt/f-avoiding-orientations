import type {
  AcrossDirection,
} from '../tools/orientAcrossPartition'
import type {
  AuditBoundedDegreeApplication,
  AuditBoundedDegreeKind,
  AuditSearchState,
} from './auditState'

type Target =
  'G' | 'L' | 'R'

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

function allOutdegrees(
  degree:
    number,
) {
  return Array.from(
    {
      length:
        degree + 1,
    },
    (
      _,
      value,
    ) =>
      value,
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
    state.hasanvandR !==
      null
  )
}

function boundedAlreadyUsed(
  state:
    AuditSearchState,
) {
  return (
    state.boundedDegreeG !==
      null ||
    state.boundedDegreeL !==
      null ||
    state.boundedDegreeR !==
      null
  )
}

function repairsAlreadyUsed(
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

function getTheoremMaximum(
  kind:
    AuditBoundedDegreeKind,
): 5 | 6 {
  return (
    kind ===
      'delta-5-0125'
      ? 5
      : 6
  )
}

function getTargetMaximumDegree(
  state:
    AuditSearchState,

  target:
    Target,
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
    return null
  }

  return (
    target ===
      'L'
      ? state.partition.s
      : state.partition.t
  )
}

function getAllowedInternalOutdegrees({
  kind,
  exactDegree,
}: {
  kind:
    AuditBoundedDegreeKind

  exactDegree:
    number
}) {
  if (
    kind ===
    'delta-5-0125'
  ) {
    return [
      0,
      1,
      2,
      5,
    ].filter(
      (value) =>
        value <=
        exactDegree,
    )
  }

  return allOutdegrees(
    exactDegree,
  ).filter(
    (value) =>
      value !==
        3 &&
      value !==
        5 &&
      value !==
        6,
  )
}

function crossingEdgesPointOut(
  target:
    Target,

  direction:
    AcrossDirection | null,
) {
  return (
    (
      target ===
        'L' &&
      direction ===
        'L-to-R'
    ) ||
    (
      target ===
        'R' &&
      direction ===
        'R-to-L'
    )
  )
}

/*
 * Translate one bounded-degree theorem
 * into TOTAL outdegrees in the original
 * graph.
 *
 * For a vertex whose exact internal degree
 * in a Lovasz part is r, it has
 *
 *     workingDegree - r
 *
 * crossing edges.
 *
 * Thus we preserve the same important
 * internal-degree / cut-degree correlation
 * that we preserved for degree-dependent
 * Hasanvand.
 */
function getTotalOutdegrees({
  state,
  target,
  kind,
  reversed,
}: {
  state:
    AuditSearchState

  target:
    Target

  kind:
    AuditBoundedDegreeKind

  reversed:
    boolean
}) {
  const maximum =
    getTargetMaximumDegree(
      state,

      target,
    )

  if (
    maximum ===
    null
  ) {
    return []
  }

  const exactDegrees =
    target ===
      'G'
      ? [
          state
            .workingDegree,
        ]
      : allOutdegrees(
          maximum,
        )

  const totals:
    number[] = []

  for (
    const exactDegree
    of exactDegrees
  ) {
    const base =
      getAllowedInternalOutdegrees({
        kind,

        exactDegree,
      })

    const internalValues =
      reversed
        ? base.map(
            (value) =>
              exactDegree -
              value,
          )
        : base

    let crossingContribution =
      0

    if (
      target !==
      'G' &&
      crossingEdgesPointOut(
        target,

        state
          .acrossDirection,
      )
    ) {
      crossingContribution =
        state
          .workingDegree -
        exactDegree
    }

    for (
      const internal
      of internalValues
    ) {
      totals.push(
        state
          .fixedOutdegreeContribution +
        crossingContribution +
        internal,
      )
    }
  }

  return uniqueSorted(
    totals,
  )
}

function createApplication({
  state,
  target,
  kind,
  reversed,
}: {
  state:
    AuditSearchState

  target:
    Target

  kind:
    AuditBoundedDegreeKind

  reversed:
    boolean
}):
  AuditBoundedDegreeApplication | null {
  const targetMaximum =
    getTargetMaximumDegree(
      state,

      target,
    )

  if (
    targetMaximum ===
    null
  ) {
    return null
  }

  const theoremMaximum =
    getTheoremMaximum(
      kind,
    )

  if (
    targetMaximum >
      theoremMaximum
  ) {
    return null
  }

  /*
   * For a Lovasz part we insist that the
   * cut has already been oriented.
   *
   * This is only a canonical search order:
   * internal orientation and cut orientation
   * commute.
   */
  if (
    target !==
      'G' &&
    state.acrossDirection ===
      null
  ) {
    return null
  }

  const totalOutdegrees =
    getTotalOutdegrees({
      state,

      target,

      kind,

      reversed,
    })

  return {
    kind,

    target,

    theoremMaxDegree:
      theoremMaximum,

    targetMaxDegree:
      targetMaximum,

    reversed,

    totalOutdegrees,
  }
}

function getApplicationsForTarget(
  state:
    AuditSearchState,

  target:
    Target,
) {
  const applications:
    AuditBoundedDegreeApplication[] = []

  const seen =
    new Set<string>()

  const kinds:
    AuditBoundedDegreeKind[] = [
      'delta-5-0125',
      'delta-6-avoid-356',
    ]

  for (
    const kind
    of kinds
  ) {
    for (
      const reversed
      of [
        false,
        true,
      ]
    ) {
      const application =
        createApplication({
          state,

          target,

          kind,

          reversed,
        })

      if (
        application ===
        null
      ) {
        continue
      }

      /*
       * If two theorem/reversal choices
       * produce exactly the same abstract
       * total-outdegree set, future tools
       * cannot distinguish them.
       */
      const key =
        application
          .totalOutdegrees
          .join(',')

      if (
        seen.has(
          key,
        )
      ) {
        continue
      }

      seen.add(
        key,
      )

      applications.push(
        application,
      )
    }
  }

  return applications
}

function applicationStep(
  application:
    AuditBoundedDegreeApplication,
) {
  return {
    type:
      'bounded-degree-constructor' as const,

    target:
      application.target,

    theorem:
      application.kind,

    reversed:
      application.reversed,
  }
}

/*
 * We make bounded-degree constructors the
 * LAST constructor stage.
 *
 * This loses no proof:
 *
 * - orienting L internally;
 * - orienting R internally;
 * - orienting the cut
 *
 * commute with one another.
 *
 * Therefore any proof using a bounded
 * constructor can be reordered so that all
 * other starting-orientation choices are
 * made first.
 *
 * This dramatically simplifies the symbolic
 * state while preserving future fixers such
 * as stabilization and Menger.
 */
export function getAuditBoundedDegreeTransitions(
  state:
    AuditSearchState,
) {
  if (
    boundedAlreadyUsed(
      state,
    ) ||
    repairsAlreadyUsed(
      state,
    )
  ) {
    return []
  }

  /*
   * WHOLE GRAPH
   */
  if (
    state.partition ===
    null
  ) {
    if (
      wholeGraphAlreadyOriented(
        state,
      )
    ) {
      return []
    }

    return getApplicationsForTarget(
      state,

      'G',
    ).map(
      (application) => ({
        ...state,

        boundedDegreeG:
          application,

        outdegreePossibilities: {
          L: [
            ...application
              .totalOutdegrees,
          ],

          R: [
            ...application
              .totalOutdegrees,
          ],
        },

        steps: [
          ...state.steps,

          applicationStep(
            application,
          ),
        ],
      }),
    )
  }

  /*
   * PARTITIONED GRAPH
   *
   * The cut must be known so the exact
   * crossing contribution is known.
   */
  if (
    state.acrossDirection ===
      null
  ) {
    return []
  }

  const leftOriented =
    leftAlreadyOriented(
      state,
    )

  const rightOriented =
    rightAlreadyOriented(
      state,
    )

  /*
   * Nothing left to construct.
   */
  if (
    leftOriented &&
    rightOriented
  ) {
    return []
  }

  /*
   * R is already oriented: finish with a
   * bounded-degree constructor on L.
   */
  if (
    !leftOriented &&
    rightOriented
  ) {
    return getApplicationsForTarget(
      state,

      'L',
    ).map(
      (application) => ({
        ...state,

        boundedDegreeL:
          application,

        outdegreePossibilities: {
          L: [
            ...application
              .totalOutdegrees,
          ],

          R:
            state
              .outdegreePossibilities
              .R,
        },

        steps: [
          ...state.steps,

          applicationStep(
            application,
          ),
        ],
      }),
    )
  }

  /*
   * L is already oriented: finish with a
   * bounded-degree constructor on R.
   */
  if (
    leftOriented &&
    !rightOriented
  ) {
    return getApplicationsForTarget(
      state,

      'R',
    ).map(
      (application) => ({
        ...state,

        boundedDegreeR:
          application,

        outdegreePossibilities: {
          L:
            state
              .outdegreePossibilities
              .L,

          R: [
            ...application
              .totalOutdegrees,
          ],
        },

        steps: [
          ...state.steps,

          applicationStep(
            application,
          ),
        ],
      }),
    )
  }

  /*
   * Neither part is oriented.
   *
   * Since bounded constructors are our
   * final constructor stage, apply one to
   * BOTH parts simultaneously.
   *
   * This is precisely the type of branch
   * needed for 34679.
   */
  const leftApplications =
    getApplicationsForTarget(
      state,

      'L',
    )

  const rightApplications =
    getApplicationsForTarget(
      state,

      'R',
    )

  const transitions:
    AuditSearchState[] = []

  for (
    const left
    of leftApplications
  ) {
    for (
      const right
      of rightApplications
    ) {
      transitions.push({
        ...state,

        boundedDegreeL:
          left,

        boundedDegreeR:
          right,

        outdegreePossibilities: {
          L: [
            ...left
              .totalOutdegrees,
          ],

          R: [
            ...right
              .totalOutdegrees,
          ],
        },

        steps: [
          ...state.steps,

          applicationStep(
            left,
          ),

          applicationStep(
            right,
          ),
        ],
      })
    }
  }

  return transitions
}