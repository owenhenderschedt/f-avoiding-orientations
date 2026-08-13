import { useState } from 'react'
import type { LovaszPair } from '../tools/lovaszPartition'
import type { AcrossDirection } from '../tools/orientAcrossPartition'
import type { GraphPart } from './outdegreePossibilities'
import deriveOutdegreePossibilities from './deriveOutdegreePossibilities'
import { getResidualGraphState } from './residualGraphState'
import { shiftPartOutdegrees } from './shiftOutdegrees'

export type PlaygroundMove =
  | {
      type: 'lovasz-partition'
      pair: LovaszPair
    }
  | {
      type: 'orient-across'
      direction: AcrossDirection
    }
  | {
      type: 'balanced-orientation'
      part: GraphPart
    }
  | {
      type: 'balanced-whole-graph'
    }
  | {
      type: 'oriented-two-factor'
    }

export type PlaygroundState = {
  partition: LovaszPair | null
  acrossDirection: AcrossDirection | null
  balancedG: boolean
  balancedL: boolean
  balancedR: boolean
  orientedTwoFactorCount: number
}

const initialState: PlaygroundState = {
  partition: null,
  acrossDirection: null,
  balancedG: false,
  balancedL: false,
  balancedR: false,
  orientedTwoFactorCount: 0,
}

function deriveState(
  moves: PlaygroundMove[],
): PlaygroundState {
  const state: PlaygroundState = {
    ...initialState,
  }

  for (const move of moves) {
    if (move.type === 'lovasz-partition') {
      state.partition = move.pair
    }

    if (move.type === 'orient-across') {
      state.acrossDirection =
        move.direction
    }

    if (move.type === 'balanced-orientation') {
      if (move.part === 'L') {
        state.balancedL = true
      }

      if (move.part === 'R') {
        state.balancedR = true
      }
    }

    if (move.type === 'balanced-whole-graph') {
      state.balancedG = true
    }

    if (move.type === 'oriented-two-factor') {
      state.orientedTwoFactorCount += 1
    }
  }

  return state
}

export default function usePlayground(
  originalDegree: number,
) {
  const [moves, setMoves] =
    useState<PlaygroundMove[]>([])

  const state = deriveState(moves)

  /*
   * This describes the graph on which the NEXT orientation
   * tool is currently operating.
   *
   * For example, after one oriented 2-factor in a 12-regular
   * graph:
   *
   * workingDegree = 10
   * fixedOutdegreeContribution = 1
   */
  const residualGraph =
    getResidualGraphState(
      originalDegree,
      state.orientedTwoFactorCount,
    )

  /*
   * First calculate possibilities inside the residual graph
   * itself.
   */
  const residualOutdegreePossibilities =
    deriveOutdegreePossibilities({
      degree:
        residualGraph.workingDegree,

      partition:
        state.partition,

      acrossDirection:
        state.acrossDirection,

      balancedG:
        state.balancedG,

      balancedL:
        state.balancedL,

      balancedR:
        state.balancedR,
    })

  /*
   * Then add back the outgoing edges that have already been
   * fixed by oriented 2-factors.
   *
   * These are the TOTAL outdegrees in the original graph G,
   * and therefore these are the values that should be compared
   * with the original forbidden set F.
   */
  const outdegreePossibilities =
    shiftPartOutdegrees(
      residualOutdegreePossibilities,
      residualGraph.fixedOutdegreeContribution,
    )

  function applyLovaszPartition(
    pair: LovaszPair,
  ) {
    setMoves((current) => [
      ...current,
      {
        type: 'lovasz-partition',
        pair,
      },
    ])
  }

  function orientAcross(
    direction: AcrossDirection,
  ) {
    setMoves((current) => [
      ...current,
      {
        type: 'orient-across',
        direction,
      },
    ])
  }

  function balancePart(
    part: GraphPart,
  ) {
    setMoves((current) => [
      ...current,
      {
        type: 'balanced-orientation',
        part,
      },
    ])
  }

  function balanceGraph() {
    setMoves((current) => [
      ...current,
      {
        type: 'balanced-whole-graph',
      },
    ])
  }

  function takeOrientedTwoFactor() {
    setMoves((current) => [
      ...current,
      {
        type: 'oriented-two-factor',
      },
    ])
  }

  function undo() {
    setMoves((current) =>
      current.slice(0, -1),
    )
  }

  function reset() {
    setMoves([])
  }

  return {
    moves,
    state,

    /*
     * Original problem data.
     */
    originalDegree,

    /*
     * Current residual graph data.
     */
    workingDegree:
      residualGraph.workingDegree,

    fixedOutdegreeContribution:
      residualGraph.fixedOutdegreeContribution,

    orientedTwoFactorCount:
      state.orientedTwoFactorCount,

    /*
     * Orientation state on the current residual graph.
     */
    partition:
      state.partition,

    acrossDirection:
      state.acrossDirection,

    balancedG:
      state.balancedG,

    balancedL:
      state.balancedL,

    balancedR:
      state.balancedR,

    /*
     * Both versions are useful.
     *
     * residualOutdegreePossibilities describes only the
     * remaining graph.
     *
     * outdegreePossibilities describes total outdegrees in
     * the original graph G and is what the user should see.
     */
    residualOutdegreePossibilities,

    outdegreePossibilities,

    outdegreeGuarantees:
      outdegreePossibilities,

    /*
     * Moves.
     */
    applyLovaszPartition,
    orientAcross,
    balancePart,
    balanceGraph,
    takeOrientedTwoFactor,

    undo,
    reset,

    canUndo:
      moves.length > 0,
  }
}