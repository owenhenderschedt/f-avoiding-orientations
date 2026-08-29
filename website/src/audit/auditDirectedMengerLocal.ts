import {
  createDirectedMengerApplication,
} from '../tools/directedMengerApplication'
import type {
  MengerCapacityRule,
  MengerDemandRule,
  MengerRepairDirection,
} from '../tools/directedMengerMath'
import {
  getDirectedMengerRepairedPartOutdegrees,
} from '../playground/directedMengerOutdegrees'
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

function getCurrentOutdegrees(
  state:
    AuditSearchState,
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

function isForbidden(
  state:
    AuditSearchState,

  outdegree:
    number,
) {
  return state
    .forbiddenSet
    .includes(
      outdegree,
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

function startingOrientationComplete(
  state:
    AuditSearchState,
) {
  if (
    wholeGraphOriented(
      state,
    )
  ) {
    return true
  }

  return (
    state.partition !==
      null &&
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
 * The local-alpha certificate currently
 * uses the full original regular digraph
 * as J.
 *
 * Therefore we do not apply this repair
 * after removing an oriented 2-factor.
 *
 * A residual-subdigraph version can be
 * added separately later if we prove and
 * implement the appropriate certificate.
 */
function localMengerCompatible(
  state:
    AuditSearchState,
) {
  return (
    state
      .orientedTwoFactorCount ===
    0
  )
}

/*
 * When bad vertices are INCREASED,
 * reservoir vertices DECREASE.
 *
 * Give each safe reservoir class its
 * maximum contiguous safe capacity.
 */
function getMaximumDownwardCapacity(
  state:
    AuditSearchState,

  outdegree:
    number,
) {
  let capacity =
    0

  for (
    let next =
      outdegree - 1;
    next >= 0;
    next -= 1
  ) {
    if (
      isForbidden(
        state,
        next,
      )
    ) {
      break
    }

    capacity +=
      1
  }

  return capacity
}

/*
 * When bad vertices are DECREASED,
 * reservoir vertices INCREASE.
 */
function getMaximumUpwardCapacity(
  state:
    AuditSearchState,

  outdegree:
    number,
) {
  let capacity =
    0

  for (
    let next =
      outdegree + 1;
    next <=
      state.degree;
    next += 1
  ) {
    if (
      isForbidden(
        state,
        next,
      )
    ) {
      break
    }

    capacity +=
      1
  }

  return capacity
}

/*
 * There is no advantage in deliberately
 * choosing a smaller safe capacity.
 *
 * The local-alpha inequality is
 *
 *   r(v) - c(v)
 *     <=
 *   alpha(d - 2d^+(v)).
 *
 * Increasing c(v) only makes this
 * inequality easier to satisfy.
 */
function getCapacityRules(
  state:
    AuditSearchState,

  direction:
    MengerRepairDirection,
): MengerCapacityRule[] {
  return getCurrentOutdegrees(
    state,
  )
    .filter(
      (outdegree) =>
        !isForbidden(
          state,
          outdegree,
        ),
    )
    .map(
      (outdegree) => ({
        outdegree,

        capacity:
          direction ===
          'increase'
            ? getMaximumDownwardCapacity(
                state,
                outdegree,
              )
            : getMaximumUpwardCapacity(
                state,
                outdegree,
              ),
      }),
    )
}

/*
 * NEAREST SAFE REPAIR
 *
 * This is the main runtime optimization.
 *
 * Suppose q is bad and we repair upward.
 * Let q+r be the first safe value above q.
 *
 * Any farther safe target q+r' has
 *
 *     r' > r.
 *
 * The local-alpha certificate becomes
 * strictly harder as the demand increases,
 * while q+r is already a safe final
 * outdegree.
 *
 * Therefore:
 *
 * if some upward repair of q can satisfy
 * the local-alpha certificate, then the
 * nearest-safe upward repair is at least
 * as easy to certify.
 *
 * The same argument applies downward.
 *
 * Hence the audit loses no local-alpha
 * proofs by testing only the nearest safe
 * destination in each direction.
 */
function getNearestSafeDemandRule(
  state:
    AuditSearchState,

  outdegree:
    number,

  direction:
    MengerRepairDirection,
): MengerDemandRule | null {
  if (
    direction ===
    'increase'
  ) {
    for (
      let target =
        outdegree + 1;
      target <=
        state.degree;
      target += 1
    ) {
      if (
        !isForbidden(
          state,
          target,
        )
      ) {
        return {
          outdegree,

          demand:
            target -
            outdegree,
        }
      }
    }

    return null
  }

  for (
    let target =
      outdegree - 1;
    target >= 0;
    target -= 1
  ) {
    if (
      !isForbidden(
        state,
        target,
      )
    ) {
      return {
        outdegree,

        demand:
          outdegree -
          target,
      }
    }
  }

  return null
}

function getBadCurrentOutdegrees(
  state:
    AuditSearchState,
) {
  return getCurrentOutdegrees(
    state,
  ).filter(
    (outdegree) =>
      isForbidden(
        state,
        outdegree,
      ),
  )
}

/*
 * Build the unique minimum-demand repair
 * system for one direction.
 *
 * If even one currently bad class has no
 * safe destination in that direction,
 * that direction cannot repair the entire
 * state.
 */
function getNearestSafeDemandRules(
  state:
    AuditSearchState,

  badOutdegrees:
    readonly number[],

  direction:
    MengerRepairDirection,
): MengerDemandRule[] | null {
  const rules:
    MengerDemandRule[] = []

  for (
    const outdegree
    of badOutdegrees
  ) {
    const rule =
      getNearestSafeDemandRule(
        state,

        outdegree,

        direction,
      )

    if (
      rule ===
      null
    ) {
      return null
    }

    rules.push(
      rule,
    )
  }

  return rules
}

function createAuditLocalMengerState({
  state,
  demandRules,
  capacityRules,
  direction,
}: {
  state:
    AuditSearchState

  demandRules:
    readonly MengerDemandRule[]

  capacityRules:
    readonly MengerCapacityRule[]

  direction:
    MengerRepairDirection
}): AuditSearchState | null {
  const application =
    createDirectedMengerApplication({
      degree:
        state.degree,

      forbiddenSet:
        state.forbiddenSet,

      currentOutdegrees:
        getCurrentOutdegrees(
          state,
        ),

      demandRules,

      capacityRules,

      direction,
    })

  /*
   * The existing playground certificate
   * checker remains the source of truth.
   *
   * The audit merely proposes the repair.
   * If the local-alpha inequality does not
   * certify it, the application is rejected.
   */
  if (
    application ===
    null
  ) {
    return null
  }

  const repaired =
    getDirectedMengerRepairedPartOutdegrees(
      {
        L:
          state
            .outdegreePossibilities
            .L,

        R:
          state
            .outdegreePossibilities
            .R,

        application,
      },
    )

  return {
    ...state,

    directedMenger:
      application,

    outdegreePossibilities:
      repaired,

    steps: [
      ...state.steps,

      {
        type:
          'directed-menger-local',

        direction,

        demandRules: [
          ...demandRules,
        ],

        capacityRules: [
          ...capacityRules,
        ],
      },
    ],
  }
}

/*
 * Enumerate the local-alpha Menger repairs
 * that are meaningfully different.
 *
 * After the nearest-safe reduction there
 * are at most TWO candidates:
 *
 *   1. repair all bad classes upward;
 *   2. repair all bad classes downward.
 *
 * Previously the audit explored a
 * Cartesian product of every safe target
 * for every bad class.
 */
export function getAuditLocalMengerTransitions(
  state:
    AuditSearchState,
) {
  const transitions:
    AuditSearchState[] = []

  if (
    state.directedMenger !==
      null ||
    state
      .directedMengerReservoir !==
      null ||
    !startingOrientationComplete(
      state,
    ) ||
    !localMengerCompatible(
      state,
    )
  ) {
    return transitions
  }

  const badOutdegrees =
    getBadCurrentOutdegrees(
      state,
    )

  if (
    badOutdegrees.length ===
    0
  ) {
    return transitions
  }

  const directions:
    MengerRepairDirection[] = [
      'increase',
      'decrease',
    ]

  for (
    const direction
    of directions
  ) {
    const demandRules =
      getNearestSafeDemandRules(
        state,

        badOutdegrees,

        direction,
      )

    if (
      demandRules ===
      null
    ) {
      continue
    }

    const capacityRules =
      getCapacityRules(
        state,

        direction,
      )

    const next =
      createAuditLocalMengerState({
        state,

        demandRules,

        capacityRules,

        direction,
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
