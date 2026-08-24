import {
  allOutdegrees,
} from '../playground/outdegreePossibilities'
import type {
  AuditSearchState,
} from './auditState'

/*
 * General interval reductions for an
 * even-regular graph.
 *
 * These are the two symmetric reductions
 * obtained from the independent-set
 * orientation lemma, reversal, and repeated
 * cyclically oriented 2-factor removal.
 *
 * For d = 2k:
 *
 * q-version:
 *
 *   q in {k,...,2k-1},
 *   q,q+1 not in F,
 *
 * and
 *
 *   F ∩ {2k-(q+1),...,k}
 *
 * contains no consecutive integers.
 *
 * p-version:
 *
 *   p in {0,...,k-1},
 *   p,p+1 not in F,
 *
 * and
 *
 *   F ∩ {k,...,2k-p}
 *
 * contains no consecutive integers.
 */

function hasConsecutiveValues(
  values:
    readonly number[],
) {
  const set =
    new Set(
      values,
    )

  return values.some(
    (value) =>
      set.has(
        value + 1,
      ),
  )
}

function valuesInInterval(
  values:
    readonly number[],

  minimum:
    number,

  maximum:
    number,
) {
  return values.filter(
    (value) =>
      value >=
        minimum &&
      value <=
        maximum,
  )
}

/*
 * This theorem is applied directly to the
 * original whole regular graph.
 *
 * We do not apply it midway through some
 * unrelated constructor sequence.
 */
function intervalReductionReady(
  state:
    AuditSearchState,
) {
  return (
    state.steps.length ===
      0 &&
    state.degree ===
      state.workingDegree &&
    state
      .fixedOutdegreeContribution ===
      0 &&
    state.partition ===
      null &&
    state.acrossDirection ===
      null
  )
}

/*
 * Lemma 2.9 / q-version.
 */
export function auditQIntervalReductionApplies({
  degree,
  forbiddenSet,
  q,
}: {
  degree:
    number

  forbiddenSet:
    readonly number[]

  q:
    number
}) {
  if (
    degree % 2 !==
      0
  ) {
    return false
  }

  const k =
    degree / 2

  if (
    q < k ||
    q >
      degree - 1
  ) {
    return false
  }

  if (
    forbiddenSet.includes(
      q,
    ) ||
    forbiddenSet.includes(
      q + 1,
    )
  ) {
    return false
  }

  const minimum =
    degree -
    (
      q + 1
    )

  const relevant =
    valuesInInterval(
      forbiddenSet,

      minimum,

      k,
    )

  return (
    !hasConsecutiveValues(
      relevant,
    )
  )
}

/*
 * Corollary 2.10 / p-version.
 */
export function auditPIntervalReductionApplies({
  degree,
  forbiddenSet,
  p,
}: {
  degree:
    number

  forbiddenSet:
    readonly number[]

  p:
    number
}) {
  if (
    degree % 2 !==
      0
  ) {
    return false
  }

  const k =
    degree / 2

  if (
    p < 0 ||
    p >
      k - 1
  ) {
    return false
  }

  if (
    forbiddenSet.includes(
      p,
    ) ||
    forbiddenSet.includes(
      p + 1,
    )
  ) {
    return false
  }

  const relevant =
    valuesInInterval(
      forbiddenSet,

      k,

      degree - p,
    )

  return (
    !hasConsecutiveValues(
      relevant,
    )
  )
}

/*
 * Once either theorem applies, it directly
 * guarantees an F-avoiding orientation.
 *
 * We therefore represent the resulting
 * possible total outdegrees conservatively
 * as every value outside F.
 *
 * The audit only needs to know that every
 * possible final value is safe.
 */
function createSolvedIntervalState({
  state,
  mode,
  parameter,
}: {
  state:
    AuditSearchState

  mode:
    'p' | 'q'

  parameter:
    number
}): AuditSearchState {
  const safeOutdegrees =
    allOutdegrees(
      state.degree,
    ).filter(
      (value) =>
        !state
          .forbiddenSet
          .includes(
            value,
          ),
    )

  return {
    ...state,

    outdegreePossibilities: {
      L: [
        ...safeOutdegrees,
      ],

      R: [
        ...safeOutdegrees,
      ],
    },

    steps: [
      ...state.steps,

      {
        type:
          'interval-reduction',

        mode,

        parameter,
      },
    ],
  }
}

/*
 * Exhaustively test every p and q supplied
 * by the two general reductions.
 *
 * We do NOT encode particular forbidden
 * sets such as 1457 or 2458.
 */
export function getAuditIntervalReductionTransitions(
  state:
    AuditSearchState,
) {
  const transitions:
    AuditSearchState[] = []

  if (
    !intervalReductionReady(
      state,
    ) ||
    state.degree % 2 !==
      0
  ) {
    return transitions
  }

  const k =
    state.degree / 2

  /*
   * q-reduction:
   *
   * q = k,...,d-1.
   */
  for (
    let q = k;
    q <=
      state.degree - 1;
    q += 1
  ) {
    if (
      auditQIntervalReductionApplies({
        degree:
          state.degree,

        forbiddenSet:
          state.forbiddenSet,

        q,
      })
    ) {
      transitions.push(
        createSolvedIntervalState({
          state,

          mode:
            'q',

          parameter:
            q,
        }),
      )
    }
  }

  /*
   * p-reduction:
   *
   * p = 0,...,k-1.
   */
  for (
    let p = 0;
    p <=
      k - 1;
    p += 1
  ) {
    if (
      auditPIntervalReductionApplies({
        degree:
          state.degree,

        forbiddenSet:
          state.forbiddenSet,

        p,
      })
    ) {
      transitions.push(
        createSolvedIntervalState({
          state,

          mode:
            'p',

          parameter:
            p,
        }),
      )
    }
  }

  return transitions
}