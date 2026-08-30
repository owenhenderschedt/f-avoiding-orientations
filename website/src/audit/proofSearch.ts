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
  getAuditParityBoundsTransitions,
} from './auditParityBounds'
import {
  getAuditHasanvandTransitions,
} from './auditHasanvand'
import {
  getAuditLocalMengerTransitions,
} from './auditDirectedMengerLocal'
import {
  getAuditReservoirMengerTransitions,
} from './auditDirectedMengerReservoir'
import {
  getAuditStabilizationTransitions,
} from './auditStabilization'
import {
  tryAuditResidualClosure,
} from './auditResidualClosure'
import type {
  AuditCaseResult,
  AuditProofRecipe,
} from './proofRecipes'

/*
 * IMPORTANT:
 *
 * This is now a limit on EXPANDED states,
 * not merely states generated and inserted
 * into the frontier.
 *
 * The old BFS stopped when visited.size
 * passed 50,000.  A single high-branching
 * constructor layer could therefore fill
 * the visited set before a very promising
 * child state was ever examined.
 *
 * That is exactly the wrong behavior for
 * an audit containing degree-dependent
 * Hasanvand searches.
 */
const DEFAULT_MAX_EXPANDED_STATES =
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
 * Honest current-toolkit transition list.
 *
 * No interval-reduction shortcut and no
 * audit-only bounded-degree constructor is
 * reachable from here.
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

    ...getAuditParityBoundsTransitions(
      state,
    ),

    ...getAuditHasanvandTransitions(
      state,
    ),

    ...getAuditLocalMengerTransitions(
      state,
    ),

    ...getAuditStabilizationTransitions(
      state,
    ),

    ...getAuditReservoirMengerTransitions(
      state,
    ),
  ]
}

function countBadValues(
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
 * Number of still-missing pieces in the
 * starting orientation.
 *
 * Lower is better.
 */
function getConstructionPenalty(
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
      ? 0
      : 1
  }

  let penalty =
    0

  if (
    state.acrossDirection ===
      null
  ) {
    penalty +=
      1
  }

  if (
    !leftInternallyOriented(
      state,
    )
  ) {
    penalty +=
      1
  }

  if (
    !rightInternallyOriented(
      state,
    )
  ) {
    penalty +=
      1
  }

  return penalty
}

/*
 * Best-first priority.
 *
 * 1. First prefer states with fewer
 *    currently forbidden possibilities.
 *
 * 2. Among those, prefer states whose
 *    starting orientation is closer to
 *    completion.
 *
 * 3. Once a stabilization certificate has
 *    been created, examine it promptly so
 *    its reservoir successor is not buried
 *    beneath unrelated constructor states.
 *
 * 4. Finally prefer shorter recipes.
 *
 * This affects only SEARCH ORDER.  Every
 * transition still comes from the same
 * live toolkit and the same visited-state
 * deduplication.
 */
function getStatePriority(
  state:
    AuditSearchState,
) {
  const forbidden =
    new Set(
      state.forbiddenSet,
    )

  const badCount =
    countBadValues(
      state
        .outdegreePossibilities
        .L,

      forbidden,
    ) +
    countBadValues(
      state
        .outdegreePossibilities
        .R,

      forbidden,
    )

  const constructionPenalty =
    getConstructionPenalty(
      state,
    )

  const fixerPenalty =
    state.stabilization !==
      null
      ? 0
      : 1

  return (
    badCount *
      1_000_000 +
    constructionPenalty *
      10_000 +
    fixerPenalty *
      100 +
    state.steps.length
  )
}

type FrontierEntry = {
  state:
    AuditSearchState

  priority:
    number

  serial:
    number
}

/*
 * Small binary min-heap.
 *
 * We use serial as a deterministic
 * tiebreaker, so equal-priority states are
 * explored in the order generated.
 */
class AuditFrontier {
  private entries:
    FrontierEntry[] = []

  push(
    entry:
      FrontierEntry,
  ) {
    this.entries.push(
      entry,
    )

    let index =
      this.entries.length -
      1

    while (
      index >
      0
    ) {
      const parent =
        globalThis.Math.floor(
          (index - 1) / 2,
        )

      if (
        !this.less(
          this.entries[
            index
          ],
          this.entries[
            parent
          ],
        )
      ) {
        break
      }

      const temporary =
        this.entries[
          parent
        ]

      this.entries[
        parent
      ] =
        this.entries[
          index
        ]

      this.entries[
        index
      ] =
        temporary

      index =
        parent
    }
  }

  pop() {
    if (
      this.entries.length ===
      0
    ) {
      return null
    }

    const first =
      this.entries[0]

    const last =
      this.entries.pop()

    if (
      this.entries.length >
        0 &&
      last !==
        undefined
    ) {
      this.entries[0] =
        last

      let index =
        0

      while (
        true
      ) {
        const left =
          2 *
            index +
          1

        const right =
          left + 1

        let smallest =
          index

        if (
          left <
            this.entries.length &&
          this.less(
            this.entries[
              left
            ],
            this.entries[
              smallest
            ],
          )
        ) {
          smallest =
            left
        }

        if (
          right <
            this.entries.length &&
          this.less(
            this.entries[
              right
            ],
            this.entries[
              smallest
            ],
          )
        ) {
          smallest =
            right
        }

        if (
          smallest ===
          index
        ) {
          break
        }

        const temporary =
          this.entries[
            index
          ]

        this.entries[
          index
        ] =
          this.entries[
            smallest
          ]

        this.entries[
          smallest
        ] =
          temporary

        index =
          smallest
      }
    }

    return first
  }

  get size() {
    return this.entries.length
  }

  private less(
    a:
      FrontierEntry,

    b:
      FrontierEntry,
  ) {
    return (
      a.priority <
        b.priority ||
      (
        a.priority ===
          b.priority &&
        a.serial <
          b.serial
      )
    )
  }
}

export function searchAuditCase({
  degree,
  forbiddenSet,
  maxStates =
    DEFAULT_MAX_EXPANDED_STATES,
}: {
  degree:
    number

  forbiddenSet:
    readonly number[]

  /*
   * Kept under the old public parameter
   * name so auditRunner and any external
   * callers remain compatible.
   *
   * It now means "maximum expanded
   * states."
   */
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

      expandedStates:
        0,

      generatedStates:
        1,
    }
  }

  const frontier =
    new AuditFrontier()

  let serial =
    0

  frontier.push({
    state:
      initialState,

    priority:
      getStatePriority(
        initialState,
      ),

    serial:
      serial,
  })

  serial +=
    1

  const visited =
    new Set<string>([
      getAuditStateKey(
        initialState,
      ),
    ])

  let expandedStates =
    0

  /*
   * Residual lower-degree searches are real
   * search work too.  Track them separately
   * so the reported statistics remain
   * honest even though they occur inside a
   * recursive certification step.
   */
  let residualExpandedStates =
    0

  let residualGeneratedStates =
    0

  while (
    frontier.size >
      0 &&
    expandedStates <
      maxStates
  ) {
    const entry =
      frontier.pop()

    if (
      entry ===
      null
    ) {
      break
    }

    const state =
      entry.state

    expandedStates +=
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

      /*
       * Check solved children immediately.
       *
       * A successful repair therefore never
       * waits behind the rest of the
       * frontier.
       */
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

          expandedStates:
            expandedStates +
            residualExpandedStates,

          generatedStates:
            visited.size +
            residualGeneratedStates,
        }
      }

      /*
       * NEW:
       *
       * If this child consists only of one
       * or more oriented 2-factors, regard
       * the remaining graph as a fresh
       * lower-degree regular instance.
       *
       * For example
       *
       *   d = 14,
       *   F = {0,1,5,7,8,10}
       *
       * after one oriented 2-factor becomes
       *
       *   d' = 12,
       *   F' = {0,4,6,7,9}.
       *
       * The lower-degree audit can now use
       * its FULL toolkit, including tools
       * whose certificates are intentionally
       * unavailable directly after a
       * 2-factor in the original state.
       */
      const residualClosure =
        tryAuditResidualClosure({
          state:
            nextState,

          maxStates,

          searchResidualCase:
            searchAuditCase,
        })

      residualExpandedStates +=
        residualClosure
          .expandedStates

      residualGeneratedStates +=
        residualClosure
          .generatedStates

      if (
        residualClosure.recipe !==
          null
      ) {
        return {
          status:
            'proved',

          degree,

          forbiddenSet: [
            ...forbiddenSet,
          ],

          recipe:
            residualClosure
              .recipe,

          expandedStates:
            expandedStates +
            residualExpandedStates,

          generatedStates:
            visited.size +
            residualGeneratedStates,
        }
      }

      frontier.push({
        state:
          nextState,

        priority:
          getStatePriority(
            nextState,
          ),

        serial,
      })

      serial +=
        1
    }
  }

  /*
   * Empty frontier means the reachable
   * encoded state space was genuinely
   * exhausted.
   *
   * Nonempty frontier means only that the
   * search budget was reached.  These two
   * outcomes must NEVER be displayed as
   * the same thing.
   */
  if (
    frontier.size ===
      0
  ) {
    return {
      status:
        'unresolved',

      reason:
        'exhausted',

      degree,

      forbiddenSet: [
        ...forbiddenSet,
      ],

      expandedStates:
        expandedStates +
        residualExpandedStates,

      generatedStates:
        visited.size +
        residualGeneratedStates,
    }
  }

  return {
    status:
      'unresolved',

    reason:
      'search-limit',

    degree,

    forbiddenSet: [
      ...forbiddenSet,
    ],

    expandedStates:
      expandedStates +
      residualExpandedStates,

    generatedStates:
      visited.size +
      residualGeneratedStates,
  }
}

export default
  searchAuditCase
