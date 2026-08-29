import {
  createStabilizeOutdegreeClassesApplication,
} from '../tools/stabilizeOutdegreeClassApplication'
import type {
  StabilizeTarget,
} from '../tools/stabilizeOutdegreeClassMath'
import {
  getStabilizedClassesOutdegreePossibilities,
} from '../playground/stabilizeOutdegreeClassOutdegrees'
import type {
  AuditSearchState,
} from './auditState'

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

function wholeGraphOriented(
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

function leftInternallyOriented(
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

function rightInternallyOriented(
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

/*
 * Stabilization acts on an already
 * oriented graph.
 */
function startingOrientationComplete(
  state:
    AuditSearchState,
) {
  if (
    state.partition ===
      null
  ) {
    return wholeGraphOriented(
      state,
    )
  }

  return (
    state.acrossDirection !==
      null &&
    leftInternallyOriented(
      state,
    ) &&
    rightInternallyOriented(
      state,
    )
  )
}

/*
 * Match the LIVE playground exactly.
 *
 * Stabilize Q is still restricted to the
 * original graph orientation.  After an
 * oriented 2-factor has been removed, the
 * new Reservoir Menger V4 may operate in
 * the residual graph, but Stabilize Q does
 * not.
 */
function stabilizationCompatible(
  state:
    AuditSearchState,
) {
  return (
    state
      .orientedTwoFactorCount ===
    0
  )
}

function targetIsAvailable(
  state:
    AuditSearchState,

  target:
    StabilizeTarget,
) {
  if (
    target ===
    'G'
  ) {
    return (
      state.partition ===
        null &&
      wholeGraphOriented(
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

  return (
    leftInternallyOriented(
      state,
    ) &&
    rightInternallyOriented(
      state,
    )
  )
}

function getTargetOutdegrees(
  state:
    AuditSearchState,

  target:
    StabilizeTarget,
) {
  if (
    target ===
    'G'
  ) {
    return uniqueSorted([
      ...state
        .outdegreePossibilities
        .L,

      ...state
        .outdegreePossibilities
        .R,
    ])
  }

  return uniqueSorted(
    state
      .outdegreePossibilities[
        target
      ],
  )
}

function isForbidden(
  state:
    AuditSearchState,

  q:
    number,
) {
  return state
    .forbiddenSet
    .includes(
      q,
    )
}

function hasNoConsecutiveValues(
  values:
    readonly number[],
) {
  const normalized =
    uniqueSorted(
      values,
    )

  return normalized.every(
    (
      value,
      index,
    ) =>
      index === 0 ||
      value -
        normalized[
          index - 1
        ] >
        1,
  )
}

/*
 * Enumerate every nonempty
 * nonconsecutive subset of the currently
 * bad classes on one target.
 *
 * We do NOT include safe classes in Q.
 *
 * This loses no proof in the CURRENT
 * toolkit:
 *
 * - stabilization itself never removes a
 *   selected outdegree class;
 *
 * - the reservoir certificate requires
 *   every selected class to be forbidden;
 *
 * - the local-alpha Menger certificate
 *   does not use the independence
 *   certificate at all.
 *
 * Thus stabilizing a safe class cannot
 * create a new proof route with the tools
 * currently available after stabilization.
 */
function getCandidateClassSets(
  state:
    AuditSearchState,

  target:
    StabilizeTarget,
) {
  const badClasses =
    getTargetOutdegrees(
      state,

      target,
    ).filter(
      (q) =>
        isForbidden(
          state,

          q,
        ),
    )

  const candidates:
    number[][] = []

  const count =
    1 <<
    badClasses.length

  for (
    let mask = 1;
    mask < count;
    mask += 1
  ) {
    const qs:
      number[] = []

    for (
      let index = 0;
      index <
        badClasses.length;
      index += 1
    ) {
      if (
        (
          mask &
          (
            1 <<
            index
          )
        ) !==
        0
      ) {
        qs.push(
          badClasses[
            index
          ],
        )
      }
    }

    if (
      hasNoConsecutiveValues(
        qs,
      )
    ) {
      candidates.push(
        qs,
      )
    }
  }

  /*
   * Larger Q first.  In particular, if
   * all currently bad L-classes can be
   * stabilized together, the reservoir
   * candidate that can actually finish
   * the state is generated immediately.
   */
  candidates.sort(
    (
      a,
      b,
    ) =>
      b.length -
        a.length ||
      a.join(',')
        .localeCompare(
          b.join(','),
        ),
  )

  return candidates
}

/*
 * Apply the exact LIVE Q-class
 * stabilization creator.
 *
 * The audit proposes only target and Q;
 * the playground certificate remains the
 * mathematical gatekeeper.
 */
export function applyAuditStabilization({
  state,
  target,
  qs,
}: {
  state:
    AuditSearchState

  target:
    StabilizeTarget

  qs:
    readonly number[]
}): AuditSearchState | null {
  if (
    state.stabilization !==
      null ||
    state.directedMenger !==
      null ||
    state
      .directedMengerReservoir !==
      null ||
    !stabilizationCompatible(
      state,
    ) ||
    !startingOrientationComplete(
      state,
    ) ||
    !targetIsAvailable(
      state,
      target,
    )
  ) {
    return null
  }

  const currentOutdegrees =
    getTargetOutdegrees(
      state,

      target,
    )

  const application =
    createStabilizeOutdegreeClassesApplication({
      target,

      qs,

      degree:
        state.degree,

      currentOutdegrees,
    })

  if (
    application ===
    null
  ) {
    return null
  }

  const stabilizedPossibilities =
    getStabilizedClassesOutdegreePossibilities({
      possibilities:
        state
          .outdegreePossibilities,

      application,
    })

  return {
    ...state,

    stabilization:
      application,

    outdegreePossibilities:
      stabilizedPossibilities,

    steps: [
      ...state.steps,

      {
        type:
          'stabilize-outdegree-class',

        target,

        qs: [
          ...application.qs,
        ],
      },
    ],
  }
}

function getTargetTransitions(
  state:
    AuditSearchState,

  target:
    StabilizeTarget,
) {
  if (
    !targetIsAvailable(
      state,
      target,
    )
  ) {
    return []
  }

  const transitions:
    AuditSearchState[] = []

  for (
    const qs
    of getCandidateClassSets(
      state,

      target,
    )
  ) {
    const next =
      applyAuditStabilization({
        state,

        target,

        qs,
      })

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

/*
 * Generate every meaningful generalized
 * stabilization available to the current
 * audit.
 *
 * One certificate is enough: the live
 * tool itself now permits an arbitrary
 * nonconsecutive set Q in a single
 * stabilization step.
 */
export function getAuditStabilizationTransitions(
  state:
    AuditSearchState,
) {
  if (
    state.stabilization !==
      null ||
    state.directedMenger !==
      null ||
    state
      .directedMengerReservoir !==
      null ||
    !stabilizationCompatible(
      state,
    ) ||
    !startingOrientationComplete(
      state,
    )
  ) {
    return []
  }

  if (
    state.partition ===
      null
  ) {
    return getTargetTransitions(
      state,

      'G',
    )
  }

  return [
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
