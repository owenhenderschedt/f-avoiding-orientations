import { useMemo, useState } from 'react'
import type { LovaszPair } from '../tools/lovaszPartition'
import type { AcrossDirection } from '../tools/orientAcrossPartition'

export type PlaygroundMove =
  | {
      type: 'lovasz-partition'
      pair: LovaszPair
    }
  | {
      type: 'orient-across'
      direction: AcrossDirection
    }

export type PlaygroundState = {
  partition: LovaszPair | null
  acrossDirection: AcrossDirection | null
}

const initialState: PlaygroundState = {
  partition: null,
  acrossDirection: null,
}

function deriveState(moves: PlaygroundMove[]): PlaygroundState {
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
  }

  return state
}

export default function usePlayground() {
  const [moves, setMoves] = useState<PlaygroundMove[]>([])

  const state = useMemo(
    () => deriveState(moves),
    [moves],
  )

  function applyLovaszPartition(pair: LovaszPair) {
    setMoves((current) => [
      ...current,
      {
        type: 'lovasz-partition',
        pair,
      },
    ])
  }

  function orientAcross(direction: AcrossDirection) {
    setMoves((current) => [
      ...current,
      {
        type: 'orient-across',
        direction,
      },
    ])
  }

  function undo() {
    setMoves((current) => {
      if (current.length === 0) {
        return current
      }

      return current.slice(0, -1)
    })
  }

  function reset() {
    setMoves([])
  }

  return {
    moves,
    state,
    partition: state.partition,
    acrossDirection: state.acrossDirection,
    applyLovaszPartition,
    orientAcross,
    undo,
    reset,
    canUndo: moves.length > 0,
  }
}