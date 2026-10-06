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
  getAuditRunAvoidanceTransitions,
} from './auditRunAvoidance'
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

    ...getAuditRunAvoidanceTransitions(
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
    state.runAvoidanceG !==
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
    state.runAvoidanceL !==
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
    state.runAvoidanceR !==
      null ||
    state.hasanvandR !==
      null
  )
}

/*
 * Bounded canonical finisher.
 *
 * Once Lovasz and the cut direction are in
 * place, try completing any still-unoriented
 * parts using Balance only.  There are at
 * most two such moves.
 *
 * On each resulting state test the existing
 * live reservoir transition directly and
 * after one stabilization.
 *
 * This is only a search shortcut: every
 * state in the returned recipe is produced
 * by an ordinary audit transition.
 */
function tryBalancedReservoirFinisher(
  state:
    AuditSearchState,
): AuditSearchState | null {
  if (
    state.partition ===
      null ||
    state.lovaszApplication ===
      null ||
    state.acrossDirection ===
      null ||
    state.stabilization !==
      null ||
    state.directedMenger !==
      null ||
    state
      .directedMengerReservoir !==
      null
  ) {
    return null
  }

  const balanceClosure:
    AuditSearchState[] = [
      state,
    ]

  const seen =
    new Set<string>([
      getAuditStateKey(
        state,
      ),
    ])

  let layerStart =
    0

  /*
   * At most L and R can still need their
   * internal orientations, hence depth 2.
   */
  for (
    let depth = 0;
    depth < 2;
    depth += 1
  ) {
    const layerEnd =
      balanceClosure.length

    for (
      let index =
        layerStart;
      index <
        layerEnd;
      index += 1
    ) {
      const current =
        balanceClosure[index]

      for (
        const candidate
        of getBasicAuditTransitions(
          current,
        )
      ) {
        const lastStep =
          candidate.steps[
            candidate.steps.length -
              1
          ]

        if (
          lastStep ===
            undefined ||
          lastStep.type !==
            'balance' ||
          lastStep.target ===
            'G'
        ) {
          continue
        }

        const key =
          getAuditStateKey(
            candidate,
          )

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

        balanceClosure.push(
          candidate,
        )
      }
    }

    layerStart =
      layerEnd
  }

  for (
    const candidate
    of balanceClosure
  ) {
    /*
     * Weighted Reservoir may already finish
     * without stabilization.
     */
    for (
      const repaired
      of getAuditReservoirMengerTransitions(
        candidate,
      )
    ) {
      if (
        isAuditStateSolved(
          repaired,
        )
      ) {
        return repaired
      }
    }

    /*
     * Otherwise try exactly one stabilization
     * followed by the live reservoir theorem.
     */
    for (
      const stabilized
      of getAuditStabilizationTransitions(
        candidate,
      )
    ) {
      for (
        const repaired
        of getAuditReservoirMengerTransitions(
          stabilized,
        )
      ) {
        if (
          isAuditStateSolved(
            repaired,
          )
        ) {
          return repaired
        }
      }
    }
  }

  return null
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
 * Search the CONSTRUCTION layer before
 * diving deeply into repair states.
 *
 * This matters because constructor tools
 * such as Run Avoidance can create many
 * attractive-looking near-solutions.  If
 * badCount is made the dominant priority,
 * those states can bury a short Lovasz
 * construction whose next move solves the
 * case immediately.
 *
 * Order:
 *
 * 1. Pure construction states before states
 *    that have already entered the repair
 *    layer.
 *
 * 2. Shorter recipes first.  Thus the
 *    constructor search behaves roughly
 *    breadth-first instead of greedily
 *    following one near-solution.
 *
 * 3. Among equally short construction
 *    states, prefer a more complete starting
 *    orientation.
 *
 * 4. Then prefer fewer currently forbidden
 *    possibilities.
 *
 * 5. Inside the repair layer, continue to
 *    prefer an existing stabilization
 *    certificate so its reservoir successor
 *    is examined promptly.
 *
 * Solved children are checked immediately
 * when generated, before they enter the
 * frontier.  Therefore this changes only
 * SEARCH ORDER, never the toolkit or the
 * validity of a proof.
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

  const inRepairLayer =
    state.stabilization !==
      null ||
    state.directedMenger !==
      null ||
    state
      .directedMengerReservoir !==
      null

  const repairPenalty =
    inRepairLayer
      ? 1
      : 0

  const fixerPenalty =
    state.stabilization !==
      null
      ? 0
      : 1

  return (
    repairPenalty *
      1_000_000_000 +
    state.steps.length *
      1_000_000 +
    constructionPenalty *
      10_000 +
    badCount *
      100 +
    fixerPenalty
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

function tryCanonicalLovaszReservoirSweep(
  initialState:
    AuditSearchState,
) {
  let generatedStates =
    0

  /*
   * First choose a genuine Lovasz partition.
   */
  for (
    const partitionState
    of getBasicAuditTransitions(
      initialState,
    )
  ) {
    const partitionStep =
      partitionState.steps[
        partitionState.steps.length -
          1
      ]

    if (
      partitionStep ===
        undefined ||
      partitionStep.type !==
        'lovasz-partition'
    ) {
      continue
    }

    generatedStates +=
      1

    /*
     * Then choose one of the live cut
     * orientations.
     */
    for (
      const cutState
      of getBasicAuditTransitions(
        partitionState,
      )
    ) {
      const cutStep =
        cutState.steps[
          cutState.steps.length -
            1
        ]

      if (
        cutStep ===
          undefined ||
        cutStep.type !==
          'orient-across'
      ) {
        continue
      }

      generatedStates +=
        1

      /*
       * The existing bounded finisher tries
       * Balance on either/both missing parts,
       * then Reservoir directly and after one
       * Stabilization.
       */
      const finish =
        tryBalancedReservoirFinisher(
          cutState,
        )

      if (
        finish !==
          null
      ) {
        return {
          state:
            finish,

          generatedStates,
        }
      }
    }
  }

  return {
    state:
      null,

    generatedStates,
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

      const balancedReservoirFinish =
        tryBalancedReservoirFinisher(
          nextState,
        )

      if (
        balancedReservoirFinish !==
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
            solvedStateToRecipe(
              balancedReservoirFinish,
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
       * TWO-STEP FINISHER LOOKAHEAD.
       *
       * A complete constructor state may be
       * only
       *
       *   stabilization -> reservoir
       *
       * away from a proof.  Such a state can
       * otherwise sit behind thousands of
       * equally short constructor states
       * before it is ever expanded.
       *
       * Test this only when the structural
       * prerequisites for the current
       * L-demand / R-reservoir theorem are
       * already present.  This therefore
       * avoids opening a general repair
       * search from every generated state.
       *
       * Again, this adds no mathematical
       * transition: both moves are ordinary
       * live audit transitions.
       */
      if (
        nextState.partition !==
          null &&
        nextState.lovaszApplication !==
          null &&
        nextState.acrossDirection ===
          'R-to-L' &&
        leftInternallyOriented(
          nextState,
        ) &&
        nextState.balancedR &&
        nextState.stabilization ===
          null &&
        nextState.directedMenger ===
          null &&
        nextState
          .directedMengerReservoir ===
          null
      ) {
        const immediateStabilizations =
          getAuditStabilizationTransitions(
            nextState,
          )

        for (
          const stabilizedState
          of immediateStabilizations
        ) {
          const immediateReservoirStates =
            getAuditReservoirMengerTransitions(
              stabilizedState,
            )

          for (
            const reservoirState
            of immediateReservoirStates
          ) {
            if (
              !isAuditStateSolved(
                reservoirState,
              )
            ) {
              continue
            }

            /*
             * These two lookahead states were
             * genuinely generated even though
             * the search returns before they
             * need to enter the frontier.
             */
            const lookaheadKeys =
              new Set<string>()

            const stabilizedKey =
              getAuditStateKey(
                stabilizedState,
              )

            if (
              !visited.has(
                stabilizedKey,
              )
            ) {
              lookaheadKeys.add(
                stabilizedKey,
              )
            }

            const reservoirKey =
              getAuditStateKey(
                reservoirState,
              )

            if (
              !visited.has(
                reservoirKey,
              )
            ) {
              lookaheadKeys.add(
                reservoirKey,
              )
            }

            return {
              status:
                'proved',

              degree,

              forbiddenSet: [
                ...forbiddenSet,
              ],

              recipe:
                solvedStateToRecipe(
                  reservoirState,
                ),

              expandedStates:
                expandedStates +
                residualExpandedStates,

              generatedStates:
                visited.size +
                lookaheadKeys.size +
                residualGeneratedStates,
            }
          }
        }
      }

      /*
       * A stabilization certificate is often
       * designed specifically to unlock an
       * immediate reservoir repair.
       *
       * Repair states are intentionally kept
       * behind the pure-construction frontier,
       * but we should not delay a reservoir
       * application that already FINISHES the
       * proof.  Test that one certified step
       * here before placing the stabilization
       * state into the delayed repair layer.
       *
       * This is only search lookahead: it
       * introduces no new mathematical
       * transition.
       */
      if (
        nextState.stabilization !==
          null &&
        nextState.directedMenger ===
          null &&
        nextState
          .directedMengerReservoir ===
          null
      ) {
        const immediateReservoirStates =
          getAuditReservoirMengerTransitions(
            nextState,
          )

        for (
          const reservoirState
          of immediateReservoirStates
        ) {
          if (
            !isAuditStateSolved(
              reservoirState,
            )
          ) {
            continue
          }

          const reservoirKey =
            getAuditStateKey(
              reservoirState,
            )

          const newlyGenerated =
            visited.has(
              reservoirKey,
            )
              ? 0
              : 1

          return {
            status:
              'proved',

            degree,

            forbiddenSet: [
              ...forbiddenSet,
            ],

            recipe:
              solvedStateToRecipe(
                reservoirState,
              ),

            expandedStates:
              expandedStates +
              residualExpandedStates,

            generatedStates:
              visited.size +
              newlyGenerated +
              residualGeneratedStates,
          }
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
   * FINAL RESCUE PASS.
   *
   * The ordinary search gets first choice
   * so simple proofs such as Balance G or
   * Avoid c remain the preferred Warehouse
   * recipes.
   *
   * Only when that search would otherwise
   * return unresolved do we try the small
   * canonical
   *
   *   Lovasz -> cut -> Balance ->
   *   [Stabilization] -> Reservoir
   *
   * sweep.
   *
   * This is still composed entirely of live
   * audit transitions; it changes only proof
   * selection/search order.
   */
  const canonicalReservoirSweep =
    tryCanonicalLovaszReservoirSweep(
      initialState,
    )

  if (
    canonicalReservoirSweep.state !==
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
        solvedStateToRecipe(
          canonicalReservoirSweep
            .state,
        ),

      expandedStates:
        expandedStates +
        residualExpandedStates,

      generatedStates:
        visited.size +
        residualGeneratedStates +
        canonicalReservoirSweep
          .generatedStates,
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
