import {
  createDirectedMengerReservoirApplication,
} from '../tools/directedMengerReservoirApplication'
import {
  getDirectedMengerReservoirRepairedOutdegrees,
} from '../playground/directedMengerReservoirOutdegrees'
import type {
  AuditSearchState,
} from './auditState'

/*
 * Reservoir Directed Menger audit layer.
 *
 * This is the structural repair based on:
 *
 *   - a strengthened Lovasz partition;
 *   - cut orientation R -> L;
 *   - balanced orientation on R;
 *   - an independent bad class P_q in L;
 *   - the reservoir capacity supplied by R.
 *
 * The audit itself does NOT reproduce
 * those hypotheses.
 *
 * It hands the current symbolic state to
 * the exact reservoir validator already
 * used by the playground.
 */

/*
 * We currently apply the reservoir theorem
 * only in the original regular graph.
 *
 * After removing an oriented 2-factor,
 * the audit records TOTAL outdegrees with
 * an added fixed contribution, whereas the
 * present reservoir certificate was built
 * for the unshifted regular graph.
 *
 * Until we explicitly develop the shifted
 * residual version, rejecting that
 * composition is the conservative choice.
 */
function reservoirCompatible(
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
 * Cheap structural checks before invoking
 * the full certificate analyzer.
 *
 * These do not replace any mathematical
 * checks. They only avoid calling the
 * validator on obviously irrelevant states.
 */
function couldHaveReservoirStructure(
  state:
    AuditSearchState,
) {
  return (
    state.partition !==
      null &&
    state.lovaszApplication !==
      null &&
    state.acrossDirection ===
      'R-to-L' &&
    state.balancedR &&
    state.stabilization !==
      null &&
    state.stabilization.target ===
      'L'
  )
}

/*
 * Apply the exact reservoir certificate
 * checker to the current state.
 */
export function applyAuditDirectedMengerReservoir(
  state:
    AuditSearchState,
): AuditSearchState | null {
  if (
    state.directedMenger !==
      null ||
    state
      .directedMengerReservoir !==
      null ||
    !reservoirCompatible(
      state,
    ) ||
    !couldHaveReservoirStructure(
      state,
    )
  ) {
    return null
  }

  const application =
    createDirectedMengerReservoirApplication({
      degree:
        state.degree,

      forbiddenSet:
        state.forbiddenSet,

      lovaszApplication:
        state
          .lovaszApplication,

      acrossDirection:
        state
          .acrossDirection,

      balancedR:
        state.balancedR,

      stabilizationApplication:
        state.stabilization,

      currentOutdegreesL:
        state
          .outdegreePossibilities
          .L,

      currentOutdegreesR:
        state
          .outdegreePossibilities
          .R,
    })

  /*
   * This is the mathematical gatekeeper.
   *
   * In particular, the existing analyzer
   * verifies things such as:
   *
   *   - the strengthened Lovasz
   *     certificate;
   *
   *   - P_q subset L is independent;
   *
   *   - R is the correct reservoir;
   *
   *   - the cut is R -> L;
   *
   *   - R is balanced;
   *
   *   - q is forbidden;
   *
   *   - q+1 is safe;
   *
   *   - all other L classes are safe;
   *
   *   - the entire certified reservoir
   *     interval is safe.
   */
  if (
    application ===
    null
  ) {
    return null
  }

  const repairedPossibilities =
    getDirectedMengerReservoirRepairedOutdegrees({
      possibilities:
        state
          .outdegreePossibilities,

      application,
    })

  return {
    ...state,

    directedMengerReservoir:
      application,

    outdegreePossibilities:
      repairedPossibilities,

    steps: [
      ...state.steps,

      {
        type:
          'directed-menger-reservoir',

        q:
          application.q,

        repairedOutdegree:
          application
            .repairedOutdegree,
      },
    ],
  }
}

/*
 * There is no parameter search here.
 *
 * Once a stabilization certificate is
 * present, the existing reservoir analyzer
 * determines q automatically.
 *
 * Thus each symbolic state has at most one
 * reservoir-Menger successor.
 */
export function getAuditReservoirMengerTransitions(
  state:
    AuditSearchState,
) {
  const next =
    applyAuditDirectedMengerReservoir(
      state,
    )

  return next ===
    null
    ? []
    : [next]
}