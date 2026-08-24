import {
  createStabilizeOutdegreeClassApplication,
} from '../tools/stabilizeOutdegreeClassApplication'
import type {
  StabilizeTarget,
} from '../tools/stabilizeOutdegreeClassMath'
import {
  getStabilizedOutdegreePossibilities,
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
    state.boundedDegreeG !==
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
      null ||
    state.boundedDegreeL !==
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
      null ||
    state.boundedDegreeR !==
      null
  )
}

/*
 * Stabilization acts on an already
 * oriented graph.
 *
 * Whole graph:
 *
 *   one constructor on G is enough.
 *
 * Partitioned graph:
 *
 *   - the cut must be oriented;
 *   - L must be internally oriented;
 *   - R must be internally oriented.
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

  /*
   * Stabilizing either L or R is only
   * meaningful after the full partitioned
   * starting orientation has been built.
   */
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

/*
 * Apply stabilization to one q-class.
 *
 * The audit does not recreate the
 * stabilization theorem.
 *
 * It passes the proposed target and q to
 *
 *   createStabilizeOutdegreeClassApplication
 *
 * and lets the existing playground
 * certificate decide whether the move is
 * valid.
 */
export function applyAuditStabilization({
  state,
  target,
  q,
}: {
  state:
    AuditSearchState

  target:
    StabilizeTarget

  q:
    number
}): AuditSearchState | null {
  if (
    state.stabilization !==
      null ||
    state.directedMenger !==
      null ||
    state
      .directedMengerReservoir !==
      null ||
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

  if (
    !currentOutdegrees.includes(
      q,
    )
  ) {
    return null
  }

  const application =
    createStabilizeOutdegreeClassApplication({
      target,

      q,

      /*
       * q is a TOTAL outdegree class in
       * the original graph.
       */
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
    getStabilizedOutdegreePossibilities({
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

        q,
      },
    ],
  }
}

/*
 * Stabilization is useful to the audit as
 * a structural fixer for a currently bad
 * class.
 *
 * It does NOT eliminate q.
 *
 * Instead it guarantees that the remaining
 *
 *     P_q
 *
 * is independent, while q-1 and q+1 may
 * also appear.
 *
 * Therefore the meaningful search targets
 * are currently forbidden q-classes that
 * may later be repaired by a Menger-style
 * argument.
 */
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

  const currentOutdegrees =
    getTargetOutdegrees(
      state,

      target,
    )

  const badClasses =
    currentOutdegrees.filter(
      (q) =>
        isForbidden(
          state,

          q,
        ),
    )

  const transitions:
    AuditSearchState[] = []

  for (
    const q
    of badClasses
  ) {
    const next =
      applyAuditStabilization({
        state,

        target,

        q,
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
 * Generate every currently meaningful
 * stabilization.
 *
 * We permit at most one stabilization
 * certificate in the present state model.
 *
 * That is enough for the current reservoir
 * Menger architecture, where one bad class
 * P_q is made independent and then repaired.
 *
 * If we later develop proofs requiring
 * several independent bad classes
 * simultaneously, the state model should
 * be generalized from one certificate to
 * an array of stabilization certificates.
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