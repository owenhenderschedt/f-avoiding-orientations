import deriveOutdegreePossibilities from '../playground/deriveOutdegreePossibilities'
import {
  getResidualGraphState,
} from '../playground/residualGraphState'
import {
  shiftPartOutdegrees,
} from '../playground/shiftOutdegrees'
import type {
  AuditSearchState,
} from './auditState'

/*
 * The audit only removes an oriented
 * 2-factor BEFORE choosing a constructor.
 *
 * This is mathematically clean:
 *
 *   G
 *   -> remove/orient a 2-factor
 *   -> work in the residual regular graph
 *   -> choose Lovasz / Balance / Ma-Lu /
 *      Hasanvand / etc.
 *
 * Repeated 2-factor removals are allowed.
 */
function constructionIsPristine(
  state:
    AuditSearchState,
) {
  return (
    state.partition ===
      null &&
    state.acrossDirection ===
      null &&

    !state.balancedG &&
    !state.balancedL &&
    !state.balancedR &&

    state.avoidCG ===
      null &&
    state.avoidCL ===
      null &&
    state.avoidCR ===
      null &&

    state.maLuG ===
      null &&
    state.maLuL ===
      null &&
    state.maLuR ===
      null &&

    state.hasanvandG ===
      null &&
    state.hasanvandL ===
      null &&
    state.hasanvandR ===
      null &&

    state.stabilization ===
      null &&

    state.directedMenger ===
      null &&

    state
      .directedMengerReservoir ===
      null
  )
}

export function canApplyAuditOrientedTwoFactor(
  state:
    AuditSearchState,
) {
  return (
    constructionIsPristine(
      state,
    ) &&
    state.workingDegree >=
      2
  )
}

/*
 * Remove one spanning 2-factor and orient
 * every cycle cyclically.
 *
 * Every vertex therefore receives exactly
 * one fixed outgoing edge from the removed
 * factor.
 */
export function applyAuditOrientedTwoFactor(
  state:
    AuditSearchState,
): AuditSearchState | null {
  if (
    !canApplyAuditOrientedTwoFactor(
      state,
    )
  ) {
    return null
  }

  const nextCount =
    state
      .orientedTwoFactorCount +
    1

  /*
   * Reuse the exact residual-state
   * calculation used by the playground.
   */
  const residual =
    getResidualGraphState(
      state.degree,

      nextCount,
    )

  /*
   * No constructor has been chosen yet, so
   * the residual graph initially allows all
   * residual outdegrees.
   */
  const residualPossibilities =
    deriveOutdegreePossibilities({
      degree:
        residual
          .workingDegree,

      partition:
        null,

      acrossDirection:
        null,

      balancedG:
        false,

      balancedL:
        false,

      balancedR:
        false,

      avoidCG:
        null,

      avoidCL:
        null,

      avoidCR:
        null,

      maLuG:
        null,

      maLuL:
        null,

      maLuR:
        null,

      hasanvandG:
        null,

      hasanvandL:
        null,

      hasanvandR:
        null,
    })

  /*
   * Convert residual outdegrees back to
   * TOTAL outdegrees in the original graph.
   */
  const totalPossibilities =
    shiftPartOutdegrees(
      residualPossibilities,

      residual
        .fixedOutdegreeContribution,
    )

  return {
    ...state,

    orientedTwoFactorCount:
      nextCount,

    workingDegree:
      residual
        .workingDegree,

    fixedOutdegreeContribution:
      residual
        .fixedOutdegreeContribution,

    outdegreePossibilities:
      totalPossibilities,

    steps: [
      ...state.steps,

      {
        type:
          'oriented-two-factor',
      },
    ],
  }
}

export function getAuditTwoFactorTransitions(
  state:
    AuditSearchState,
) {
  const next =
    applyAuditOrientedTwoFactor(
      state,
    )

  return next ===
    null
    ? []
    : [next]
}