import {
  createInitialAuditState,
  getAuditFinalOutdegrees,
  getAuditStateKey,
  isAuditStateSolved,
  type AuditSearchState,
} from './auditState'
import {
  getBasicAuditTransitions,
} from './auditTransitions'
import {
  getAuditTwoFactorTransitions,
} from './auditTwoFactor'
import {
  getAuditLocalMengerTransitions,
} from './auditDirectedMengerLocal'
import type {
  AuditCaseResult,
  AuditProofRecipe,
} from './proofRecipes'

const DEFAULT_MAX_STATES =
  50000

function solvedStateToRecipe(
  state:
    AuditSearchState,
): AuditProofRecipe {
  const finalOutdegrees =
    getAuditFinalOutdegrees(
      state,
    )

  return {
    degree:
      state.degree,

    forbiddenSet: [
      ...state
        .forbiddenSet,
    ],

    steps: [
      ...state.steps,
    ],

    finalOutdegreesL:
      finalOutdegrees.L,

    finalOutdegreesR:
      finalOutdegrees.R,
  }
}

/*
 * Every proof move currently known to
 * the symbolic audit.
 *
 * Constructor/reduction moves come
 * first.
 *
 * Directed Menger is then allowed to
 * act once a complete starting
 * orientation has been built.
 */
function getAuditTransitions(
  state:
    AuditSearchState,
) {
  return [
    ...getBasicAuditTransitions(
      state,
    ),

    ...getAuditTwoFactorTransitions(
      state,
    ),

    ...getAuditLocalMengerTransitions(
      state,
    ),
  ]
}

export function searchAuditCase({
  degree,
  forbiddenSet,
  maxStates =
    DEFAULT_MAX_STATES,
}: {
  degree:
    number

  forbiddenSet:
    readonly number[]

  maxStates?:
    number
}): AuditCaseResult {
  const initialState =
    createInitialAuditState({
      degree,
      forbiddenSet,
    })

  if (
    isAuditStateSolved(
      initialState,
    )
  ) {
    return {
      status:
        'proved',

      degree,

      forbiddenSet: [
        ...forbiddenSet,
      ],

      recipe:
        solvedStateToRecipe(
          initialState,
        ),
    }
  }

  const queue:
    AuditSearchState[] = [
      initialState,
    ]

  const visited =
    new Set<string>([
      getAuditStateKey(
        initialState,
      ),
    ])

  let queueIndex =
    0

  while (
    queueIndex <
      queue.length &&
    visited.size <=
      maxStates
  ) {
    const state =
      queue[
        queueIndex
      ]

    queueIndex +=
      1

    const nextStates =
      getAuditTransitions(
        state,
      )

    for (
      const nextState
      of nextStates
    ) {
      const key =
        getAuditStateKey(
          nextState,
        )

      if (
        visited.has(
          key,
        )
      ) {
        continue
      }

      visited.add(
        key,
      )

      if (
        isAuditStateSolved(
          nextState,
        )
      ) {
        return {
          status:
            'proved',

          degree,

          forbiddenSet: [
            ...forbiddenSet,
          ],

          recipe:
            solvedStateToRecipe(
              nextState,
            ),
        }
      }

      queue.push(
        nextState,
      )
    }
  }

  return {
    status:
      'unresolved',

    degree,

    forbiddenSet: [
      ...forbiddenSet,
    ],
  }
}

export default
  searchAuditCase