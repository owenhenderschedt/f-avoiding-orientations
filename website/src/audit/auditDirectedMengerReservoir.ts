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
 * This wrapper deliberately contains no
 * independent reservoir theorem.
 *
 * It proposes the current symbolic proof
 * state to the SAME V4 application creator
 * used by the playground.  That live
 * creator decides whether the available
 * Lovasz, cut, balance, independence, and
 * residual-degree certificates are enough.
 */

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

/*
 * Cheap structural prerequisites.
 *
 * These are not a substitute for the live
 * certificate checker. They merely avoid
 * calling it on states that do not yet
 * represent a complete starting
 * orientation for the reservoir theorem.
 *
 * V4 no longer requires a stabilization
 * certificate.  The live creator may also
 * use the automatic zero-internal class
 *
 *   P_r = {v in L : d_G^+(v)=r},
 *
 * where r is the fixed contribution from
 * previously oriented 2-factors.
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
    leftInternallyOriented(
      state,
    ) &&
    state.balancedR
  )
}

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
    !couldHaveReservoirStructure(
      state,
    )
  ) {
    return null
  }

  const application =
    createDirectedMengerReservoirApplication({
      /*
       * TOTAL degree of the original graph.
       */
      degree:
        state.degree,

      /*
       * V4 runs Directed Menger inside the
       * residual regular working graph H.
       */
      workingDegree:
        state.workingDegree,

      /*
       * Each removed cyclic 2-factor has
       * already contributed one fixed
       * outgoing edge at every vertex.
       */
      fixedOutdegreeContribution:
        state
          .fixedOutdegreeContribution,

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

      /*
       * May be null.
       *
       * If present, the live creator may
       * use the stabilized P_Q certificate.
       * If absent, V4 may instead use the
       * automatic zero-internal class.
       */
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
   * Among other things, the live V4
   * checker verifies:
   *
   *   - Lovasz was applied to the current
   *     working degree;
   *   - the cut is R -> L;
   *   - R is balanced;
   *   - the demand set is independent,
   *     either by stabilization or by the
   *     zero-internal certificate;
   *   - every selected q is bad and q+1
   *     is safe;
   *   - every other L class is safe;
   *   - the translated TOTAL reservoir
   *     interval is safe;
   *   - the current R classes lie in that
   *     interval.
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

        qs: [
          ...application.qs,
        ],

        repairedOutdegrees: [
          ...application
            .repairedOutdegrees,
        ],
      },
    ],
  }
}

/*
 * For each symbolic state there is at most
 * one live reservoir successor: V4 itself
 * chooses between the available
 * independence certificates.
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
