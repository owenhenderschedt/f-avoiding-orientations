import { useState } from 'react'
import type { LovaszPair } from '../tools/lovaszPartition'
import type { AcrossDirection } from '../tools/orientAcrossPartition'
import type { GraphPart } from './outdegreePossibilities'
import deriveOutdegreePossibilities from './deriveOutdegreePossibilities'

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

export type PlaygroundState = {
  partition: LovaszPair | null
  acrossDirection: AcrossDirection | null
  balancedL: boolean
  balancedR: boolean
}

const initialState: PlaygroundState = {
  partition: null,
  acrossDirection: null,
  balancedL: false,
  balancedR: false,
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
      state.acrossDirection = move.direction
    }

    if (move.type === 'balanced-orientation') {
      if (move.part === 'L') {
        state.balancedL = true
      }

      if (move.part === 'R') {
        state.balancedR = true
      }
    }
  }

  return state
}

export default function usePlayground(
  degree: number,
) {
  const [moves, setMoves] = useState<PlaygroundMove[]>([])

  const state = deriveState(moves)

  const outdegreePossibilities =
    deriveOutdegreePossibilities({
      degree,
      partition: state.partition,
      acrossDirection: state.acrossDirection,
      balancedL: state.balancedL,
      balancedR: state.balancedR,
    })

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

  function balancePart(part: GraphPart) {
    setMoves((current) => [
      ...current,
      {
        type: 'balanced-orientation',
        part,
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

    partition: state.partition,
    acrossDirection: state.acrossDirection,
    balancedL: state.balancedL,
    balancedR: state.balancedR,

    outdegreePossibilities,

    /*
     * Temporary compatibility name for GraphView.
     * We can remove this once all files use the more general
     * "outdegreePossibilities" terminology.
     */
    outdegreeGuarantees: outdegreePossibilities,

    applyLovaszPartition,
    orientAcross,
    balancePart,

    undo,
    reset,

    canUndo: moves.length > 0,
  }
}