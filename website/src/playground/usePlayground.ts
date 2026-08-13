import { useState } from 'react'
import type {
  LovaszPair,
} from '../tools/lovaszPartition'
import type {
  AcrossDirection,
} from '../tools/orientAcrossPartition'
import type {
  GraphPart,
  PartOutdegreePossibilities,
} from './outdegreePossibilities'
import {
  getHasanvandValues,
  type HasanvandParameters,
} from '../tools/hasanvandCompression'
import deriveOutdegreePossibilities from './deriveOutdegreePossibilities'
import {
  getResidualGraphState,
} from './residualGraphState'
import {
  shiftPartOutdegrees,
} from './shiftOutdegrees'

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
  | {
      type: 'hasanvand-compression'
      parameters: HasanvandParameters
    }

export type PlaygroundState = {
  partition: LovaszPair | null
  acrossDirection: AcrossDirection | null

  balancedG: boolean
  balancedL: boolean
  balancedR: boolean

  orientedTwoFactorCount: number

  hasanvandG:
    HasanvandParameters | null
}

const initialState: PlaygroundState = {
  partition: null,
  acrossDirection: null,

  balancedG: false,
  balancedL: false,
  balancedR: false,

  orientedTwoFactorCount: 0,

  hasanvandG: null,
}

function deriveState(
  moves: PlaygroundMove[],
): PlaygroundState {
  const state: PlaygroundState = {
    ...initialState,
  }

  for (const move of moves) {
    if (
      move.type ===
      'lovasz-partition'
    ) {
      state.partition = move.pair
    }

    if (
      move.type ===
      'orient-across'
    ) {
      state.acrossDirection =
        move.direction
    }

    if (
      move.type ===
      'balanced-orientation'
    ) {
      if (move.part === 'L') {
        state.balancedL = true
      }

      if (move.part === 'R') {
        state.balancedR = true
      }
    }

    if (
      move.type ===
      'balanced-whole-graph'
    ) {
      state.balancedG = true
    }

    if (
      move.type ===
      'oriented-two-factor'
    ) {
      state.orientedTwoFactorCount += 1
    }

    if (
      move.type ===
      'hasanvand-compression'
    ) {
      state.hasanvandG =
        move.parameters
    }
  }

  return state
}

export default function usePlayground(
  originalDegree: number,
) {
  const [
    moves,
    setMoves,
  ] = useState<PlaygroundMove[]>([])

  const state =
    deriveState(moves)

  const residualGraph =
    getResidualGraphState(
      originalDegree,
      state.orientedTwoFactorCount,
    )

  let residualOutdegreePossibilities:
    PartOutdegreePossibilities

  if (state.hasanvandG !== null) {
    const hasanvandValues =
      getHasanvandValues(
        state.hasanvandG.p,
        state.hasanvandG.q,
      )

    residualOutdegreePossibilities = {
      L: hasanvandValues,
      R: hasanvandValues,
    }
  } else {
    residualOutdegreePossibilities =
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
  }

  const outdegreePossibilities =
    shiftPartOutdegrees(
      residualOutdegreePossibilities,
      residualGraph
        .fixedOutdegreeContribution,
    )

  function applyLovaszPartition(
    pair: LovaszPair,
  ) {
    setMoves((current) => [
      ...current,
      {
        type:
          'lovasz-partition',
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
        type:
          'orient-across',
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
        type:
          'balanced-orientation',
        part,
      },
    ])
  }

  function balanceGraph() {
    setMoves((current) => [
      ...current,
      {
        type:
          'balanced-whole-graph',
      },
    ])
  }

  function takeOrientedTwoFactor() {
    setMoves((current) => [
      ...current,
      {
        type:
          'oriented-two-factor',
      },
    ])
  }

  function applyHasanvandCompression(
    parameters: HasanvandParameters,
  ) {
    setMoves((current) => [
      ...current,
      {
        type:
          'hasanvand-compression',
        parameters,
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

    originalDegree,

    workingDegree:
      residualGraph.workingDegree,

    fixedOutdegreeContribution:
      residualGraph
        .fixedOutdegreeContribution,

    orientedTwoFactorCount:
      state.orientedTwoFactorCount,

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

    hasanvandG:
      state.hasanvandG,

    residualOutdegreePossibilities,

    outdegreePossibilities,

    /*
     * Kept for compatibility with
     * existing GraphView code.
     */
    outdegreeGuarantees:
      outdegreePossibilities,

    applyLovaszPartition,
    orientAcross,
    balancePart,
    balanceGraph,
    takeOrientedTwoFactor,
    applyHasanvandCompression,

    undo,
    reset,

    canUndo:
      moves.length > 0,
  }
}