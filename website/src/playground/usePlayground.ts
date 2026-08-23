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
  createHasanvandApplication,
  type HasanvandApplication,
} from '../tools/hasanvandApplication'
import type {
  HasanvandDegreeRule,
  HasanvandMode,
  HasanvandTarget,
} from '../tools/hasanvandMath'
import {
  createMaLuInternalApplication,
  createMaLuTotalApplication,
  type MaLuApplication,
  type MaLuApplicationMode,
} from '../tools/maLuApplication'
import {
  getMaLuPartSelectionCertificate,
  getMaLuWholeSelectionCertificate,
} from '../tools/maLuMath'
import {
  getMaLuTotalCertificate,
} from '../tools/maLuTargeting'
import type {
  DirectedMengerApplication,
} from '../tools/directedMengerApplication'
import {
  getDirectedMengerRepairedPartOutdegrees,
} from './directedMengerOutdegrees'
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
      application:
        HasanvandApplication
    }
  | {
      type: 'avoid-c-whole-graph'
      c: number
    }
  | {
      type: 'avoid-c-part'
      part: GraphPart
      c: number
    }
  | {
      type: 'ma-lu-whole-graph'
      application:
        MaLuApplication
    }
  | {
      type: 'ma-lu-part'
      application:
        MaLuApplication
    }
  | {
      type:
        'directed-menger-repair'
      application:
        DirectedMengerApplication
    }

export type PlaygroundState = {
  partition:
    LovaszPair | null

  acrossDirection:
    AcrossDirection | null

  balancedG: boolean
  balancedL: boolean
  balancedR: boolean

  avoidCG:
    number | null

  avoidCL:
    number | null

  avoidCR:
    number | null

  maLuG:
    MaLuApplication | null

  maLuL:
    MaLuApplication | null

  maLuR:
    MaLuApplication | null

  hasanvandG:
    HasanvandApplication | null

  hasanvandL:
    HasanvandApplication | null

  hasanvandR:
    HasanvandApplication | null

  orientedTwoFactorCount:
    number

  directedMenger:
    DirectedMengerApplication | null
}

const initialState:
  PlaygroundState = {
  partition: null,

  acrossDirection:
    null,

  balancedG: false,
  balancedL: false,
  balancedR: false,

  avoidCG: null,
  avoidCL: null,
  avoidCR: null,

  maLuG: null,
  maLuL: null,
  maLuR: null,

  hasanvandG: null,
  hasanvandL: null,
  hasanvandR: null,

  orientedTwoFactorCount:
    0,

  directedMenger: null,
}

function deriveState(
  moves:
    PlaygroundMove[],
): PlaygroundState {
  const state:
    PlaygroundState = {
    ...initialState,
  }

  for (
    const move
    of moves
  ) {
    if (
      move.type ===
      'lovasz-partition'
    ) {
      state.partition =
        move.pair
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
      if (
        move.part ===
        'L'
      ) {
        state.balancedL =
          true
      }

      if (
        move.part ===
        'R'
      ) {
        state.balancedR =
          true
      }
    }

    if (
      move.type ===
      'balanced-whole-graph'
    ) {
      state.balancedG =
        true
    }

    if (
      move.type ===
      'avoid-c-whole-graph'
    ) {
      state.avoidCG =
        move.c
    }

    if (
      move.type ===
      'avoid-c-part'
    ) {
      if (
        move.part ===
        'L'
      ) {
        state.avoidCL =
          move.c
      }

      if (
        move.part ===
        'R'
      ) {
        state.avoidCR =
          move.c
      }
    }

    if (
      move.type ===
      'ma-lu-whole-graph'
    ) {
      state.maLuG =
        move.application
    }

    if (
      move.type ===
      'ma-lu-part'
    ) {
      if (
        move.application
          .target ===
        'L'
      ) {
        state.maLuL =
          move.application
      }

      if (
        move.application
          .target ===
        'R'
      ) {
        state.maLuR =
          move.application
      }
    }

    if (
      move.type ===
      'hasanvand-compression'
    ) {
      if (
        move.application
          .target ===
        'G'
      ) {
        state.hasanvandG =
          move.application
      }

      if (
        move.application
          .target ===
        'L'
      ) {
        state.hasanvandL =
          move.application
      }

      if (
        move.application
          .target ===
        'R'
      ) {
        state.hasanvandR =
          move.application
      }
    }

    if (
      move.type ===
      'oriented-two-factor'
    ) {
      state
        .orientedTwoFactorCount +=
        1
    }

    if (
      move.type ===
      'directed-menger-repair'
    ) {
      state.directedMenger =
        move.application
    }
  }

  return state
}

function uniqueSorted(
  values:
    readonly number[],
) {
  return Array.from(
    new Set(values),
  ).sort(
    (a, b) =>
      a - b,
  )
}

function getCurrentOutdegreeClasses(
  possibilities:
    PartOutdegreePossibilities,
) {
  return uniqueSorted([
    ...possibilities.L,
    ...possibilities.R,
  ])
}

function getAllDegreesThrough(
  maxDegree: number,
) {
  return Array.from(
    {
      length:
        maxDegree + 1,
    },
    (
      _,
      degree,
    ) =>
      degree,
  )
}

/*
 * A DirectedMengerApplication is
 * mathematically certified when it is
 * created.
 *
 * The playground therefore does not
 * re-prove the alpha certificate here.
 * Its job is only to verify that the
 * saved application is being used on
 * exactly the starting outdegree state
 * for which it was certified.
 */
function directedMengerApplicationFits(
  application:
    DirectedMengerApplication,

  possibilities:
    PartOutdegreePossibilities,

  degree: number,
) {
  if (
    application.degree !==
    degree
  ) {
    return false
  }

  const currentClasses =
    getCurrentOutdegreeClasses(
      possibilities,
    )

  const certifiedClasses =
    uniqueSorted(
      application
        .startingOutdegrees,
    )

  if (
    currentClasses.length !==
    certifiedClasses.length
  ) {
    return false
  }

  return currentClasses.every(
    (
      outdegree,
      index,
    ) =>
      outdegree ===
      certifiedClasses[
        index
      ],
  )
}

export default function usePlayground(
  originalDegree: number,
) {
  const [
    moves,
    setMoves,
  ] =
    useState<
      PlaygroundMove[]
    >([])

  const state =
    deriveState(
      moves,
    )

  const residualGraph =
    getResidualGraphState(
      originalDegree,

      state
        .orientedTwoFactorCount,
    )

  const wholeGraphAlreadyOriented =
    state.balancedG ||
    state.avoidCG !==
      null ||
    state.maLuG !==
      null ||
    state.hasanvandG !==
      null

  const leftAlreadyOriented =
    state.balancedL ||
    state.avoidCL !==
      null ||
    state.maLuL !==
      null ||
    state.hasanvandL !==
      null

  const rightAlreadyOriented =
    state.balancedR ||
    state.avoidCR !==
      null ||
    state.maLuR !==
      null ||
    state.hasanvandR !==
      null

  /*
   * The Menger fixer acts only after
   * we have a genuine starting
   * orientation.
   */
  const startingOrientationComplete =
    wholeGraphAlreadyOriented ||
    (
      state.partition !==
        null &&
      state.acrossDirection !==
        null &&
      leftAlreadyOriented &&
      rightAlreadyOriented
    )

  /*
   * V2 safeguard:
   *
   * An oriented 2-factor is currently
   * represented as a removed factor
   * contributing a fixed +1 to every
   * total outdegree.
   *
   * Until we model the repair inside
   * an explicitly chosen residual
   * subdigraph, Directed Menger stays
   * unavailable after any such factor
   * has been removed.
   */
  const directedMengerCompatibleWithConstruction =
    state
      .orientedTwoFactorCount ===
    0

  /*
   * All constructor methods now feed
   * through the same possibility
   * engine.
   *
   * In particular, Hasanvand is no
   * longer a special whole-graph-only
   * branch. It can act on G, L, or R.
   */
  const residualOutdegreePossibilities =
    deriveOutdegreePossibilities(
      {
        degree:
          residualGraph
            .workingDegree,

        partition:
          state.partition,

        acrossDirection:
          state
            .acrossDirection,

        balancedG:
          state.balancedG,

        balancedL:
          state.balancedL,

        balancedR:
          state.balancedR,

        avoidCG:
          state.avoidCG,

        avoidCL:
          state.avoidCL,

        avoidCR:
          state.avoidCR,

        maLuG:
          state.maLuG,

        maLuL:
          state.maLuL,

        maLuR:
          state.maLuR,

        hasanvandG:
          state.hasanvandG,

        hasanvandL:
          state.hasanvandL,

        hasanvandR:
          state.hasanvandR,
      },
    )

  /*
   * Constructors first determine
   * residual outdegrees.
   *
   * Removed oriented 2-factors then
   * contribute their fixed amount.
   *
   * Directed Menger is a fixer of the
   * resulting TOTAL outdegrees, so it
   * is applied after this shift.
   */
  const preRepairOutdegreePossibilities =
    shiftPartOutdegrees(
      residualOutdegreePossibilities,

      residualGraph
        .fixedOutdegreeContribution,
    )

  const outdegreePossibilities =
    state.directedMenger ===
    null
      ? preRepairOutdegreePossibilities
      : getDirectedMengerRepairedPartOutdegrees(
          {
            L:
              preRepairOutdegreePossibilities
                .L,

            R:
              preRepairOutdegreePossibilities
                .R,

            application:
              state
                .directedMenger,
          },
        )

  function applyLovaszPartition(
    pair: LovaszPair,
  ) {
    if (
      state.directedMenger !==
      null
    ) {
      return
    }

    setMoves(
      (current) => [
        ...current,

        {
          type:
            'lovasz-partition',

          pair,
        },
      ],
    )
  }

  function orientAcross(
    direction:
      AcrossDirection,
  ) {
    if (
      state.directedMenger !==
      null
    ) {
      return
    }

    setMoves(
      (current) => [
        ...current,

        {
          type:
            'orient-across',

          direction,
        },
      ],
    )
  }

  function balancePart(
    part: GraphPart,
  ) {
    if (
      state.directedMenger !==
      null
    ) {
      return
    }

    setMoves(
      (current) => [
        ...current,

        {
          type:
            'balanced-orientation',

          part,
        },
      ],
    )
  }

  function balanceGraph() {
    if (
      state.directedMenger !==
      null
    ) {
      return
    }

    setMoves(
      (current) => [
        ...current,

        {
          type:
            'balanced-whole-graph',
        },
      ],
    )
  }

  function avoidCGraph(
    c: number,
  ) {
    if (
      state.directedMenger !==
      null
    ) {
      return
    }

    setMoves(
      (current) => [
        ...current,

        {
          type:
            'avoid-c-whole-graph',

          c,
        },
      ],
    )
  }

  function avoidCPart(
    part:
      GraphPart,
    c: number,
  ) {
    if (
      state.directedMenger !==
      null
    ) {
      return
    }

    setMoves(
      (current) => [
        ...current,

        {
          type:
            'avoid-c-part',

          part,

          c,
        },
      ],
    )
  }

  function applyMaLuGraph(
    mode:
      MaLuApplicationMode,

    selectedValues:
      readonly number[],
  ) {
    if (
      state.directedMenger !==
        null ||
      state.partition !==
        null ||
      wholeGraphAlreadyOriented ||
      selectedValues.length ===
        0
    ) {
      return
    }

    if (
      mode === 'internal'
    ) {
      const certificate =
        getMaLuWholeSelectionCertificate(
          {
            degree:
              residualGraph
                .workingDegree,

            selectedForbiddenSet:
              selectedValues,
          },
        )

      if (
        !certificate.applicable
      ) {
        return
      }

      const application =
        createMaLuInternalApplication(
          'G',

          selectedValues,
        )

      setMoves(
        (current) => [
          ...current,

          {
            type:
              'ma-lu-whole-graph',

            application,
          },
        ],
      )

      return
    }

    const certificate =
      getMaLuTotalCertificate(
        {
          target: 'G',

          workingDegree:
            residualGraph
              .workingDegree,

          fixedOutdegreeContribution:
            residualGraph
              .fixedOutdegreeContribution,

          partition:
            state.partition,

          acrossDirection:
            state
              .acrossDirection,

          selectedTotalOutdegrees:
            selectedValues,
        },
      )

    if (
      !certificate.ready ||
      !certificate.applicable
    ) {
      return
    }

    const application =
      createMaLuTotalApplication(
        'G',

        selectedValues,

        certificate.checks,
      )

    setMoves(
      (current) => [
        ...current,

        {
          type:
            'ma-lu-whole-graph',

          application,
        },
      ],
    )
  }

  function applyMaLuPart(
    part: GraphPart,

    mode:
      MaLuApplicationMode,

    selectedValues:
      readonly number[],
  ) {
    if (
      state.directedMenger !==
        null ||
      state.partition ===
        null ||
      selectedValues.length ===
        0
    ) {
      return
    }

    if (
      part ===
        'L' &&
      leftAlreadyOriented
    ) {
      return
    }

    if (
      part ===
        'R' &&
      rightAlreadyOriented
    ) {
      return
    }

    if (
      mode ===
      'internal'
    ) {
      const certificate =
        getMaLuPartSelectionCertificate(
          {
            target:
              part,

            partition:
              state.partition,

            selectedForbiddenSet:
              selectedValues,
          },
        )

      if (
        !certificate.applicable
      ) {
        return
      }

      const application =
        createMaLuInternalApplication(
          part,

          selectedValues,
        )

      setMoves(
        (current) => [
          ...current,

          {
            type:
              'ma-lu-part',

            application,
          },
        ],
      )

      return
    }

    const certificate =
      getMaLuTotalCertificate(
        {
          target:
            part,

          workingDegree:
            residualGraph
              .workingDegree,

          fixedOutdegreeContribution:
            residualGraph
              .fixedOutdegreeContribution,

          partition:
            state.partition,

          acrossDirection:
            state
              .acrossDirection,

          selectedTotalOutdegrees:
            selectedValues,
        },
      )

    if (
      !certificate.ready ||
      !certificate.applicable
    ) {
      return
    }

    const application =
      createMaLuTotalApplication(
        part,

        selectedValues,

        certificate.checks,
      )

    setMoves(
      (current) => [
        ...current,

        {
          type:
            'ma-lu-part',

          application,
        },
      ],
    )
  }

  /*
   * Hasanvand V2.
   *
   * The selector supplies a target,
   * mode, and degree-rule system.
   *
   * usePlayground determines the exact
   * degree information known about that
   * target and creates the certified
   * immutable application.
   *
   * For the regular whole graph G, the
   * only possible degree is the current
   * working degree.
   *
   * For a Lovasz part with maximum
   * internal degree s, the abstract
   * playground conservatively allows
   *
   *   0,1,...,s.
   */
  function applyHasanvandCompression(
    target:
      HasanvandTarget,

    mode:
      HasanvandMode,

    rules:
      readonly HasanvandDegreeRule[],
  ) {
    if (
      state.directedMenger !==
      null
    ) {
      return
    }

    let maxDegree:
      number

    let possibleDegrees:
      number[]

    if (
      target ===
      'G'
    ) {
      if (
        state.partition !==
          null ||
        wholeGraphAlreadyOriented
      ) {
        return
      }

      maxDegree =
        residualGraph
          .workingDegree

      possibleDegrees = [
        residualGraph
          .workingDegree,
      ]
    } else {
      if (
        state.partition ===
        null
      ) {
        return
      }

      if (
        target ===
          'L' &&
        leftAlreadyOriented
      ) {
        return
      }

      if (
        target ===
          'R' &&
        rightAlreadyOriented
      ) {
        return
      }

      maxDegree =
        target ===
        'L'
          ? state
              .partition
              .s
          : state
              .partition
              .t

      possibleDegrees =
        getAllDegreesThrough(
          maxDegree,
        )
    }

    const application =
      createHasanvandApplication(
        {
          target,

          mode,

          maxDegree,

          possibleDegrees,

          rules,
        },
      )

    if (
      application ===
      null
    ) {
      return
    }

    setMoves(
      (current) => [
        ...current,

        {
          type:
            'hasanvand-compression',

          application,
        },
      ],
    )
  }

  function takeOrientedTwoFactor() {
    if (
      state.directedMenger !==
      null
    ) {
      return
    }

    setMoves(
      (current) => [
        ...current,

        {
          type:
            'oriented-two-factor',
        },
      ],
    )
  }

  /*
   * The workspace creates and
   * mathematically certifies the
   * application before passing it
   * here.
   *
   * usePlayground verifies that:
   *
   *   1. Menger is compatible with the
   *      current construction, and
   *
   *   2. the current total-outdegree
   *      state is exactly the state for
   *      which the application was
   *      certified.
   */
  function applyDirectedMengerRepair(
    application:
      DirectedMengerApplication,
  ) {
    if (
      state.directedMenger !==
        null ||
      !startingOrientationComplete ||
      !directedMengerCompatibleWithConstruction
    ) {
      return
    }

    if (
      !directedMengerApplicationFits(
        application,

        preRepairOutdegreePossibilities,

        originalDegree,
      )
    ) {
      return
    }

    setMoves(
      (current) => [
        ...current,

        {
          type:
            'directed-menger-repair',

          application,
        },
      ],
    )
  }

  function undo() {
    setMoves(
      (current) =>
        current.slice(
          0,
          -1,
        ),
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
      residualGraph
        .workingDegree,

    fixedOutdegreeContribution:
      residualGraph
        .fixedOutdegreeContribution,

    orientedTwoFactorCount:
      state
        .orientedTwoFactorCount,

    partition:
      state.partition,

    acrossDirection:
      state
        .acrossDirection,

    balancedG:
      state.balancedG,

    balancedL:
      state.balancedL,

    balancedR:
      state.balancedR,

    avoidCG:
      state.avoidCG,

    avoidCL:
      state.avoidCL,

    avoidCR:
      state.avoidCR,

    maLuG:
      state.maLuG !==
      null,

    maLuL:
      state.maLuL !==
      null,

    maLuR:
      state.maLuR !==
      null,

    maLuApplicationG:
      state.maLuG,

    maLuApplicationL:
      state.maLuL,

    maLuApplicationR:
      state.maLuR,

    /*
     * Hasanvand applications are
     * returned directly, like avoid-c
     * state. Their null/non-null status
     * also tells the menu whether that
     * target has already been oriented.
     */
    hasanvandG:
      state.hasanvandG,

    hasanvandL:
      state.hasanvandL,

    hasanvandR:
      state.hasanvandR,

    hasanvandApplicationG:
      state.hasanvandG,

    hasanvandApplicationL:
      state.hasanvandL,

    hasanvandApplicationR:
      state.hasanvandR,

    directedMengerApplied:
      state.directedMenger !==
      null,

    directedMengerApplication:
      state.directedMenger,

    preRepairOutdegreePossibilities,

    residualOutdegreePossibilities,

    outdegreePossibilities,

    outdegreeGuarantees:
      outdegreePossibilities,

    startingOrientationComplete,

    canApplyDirectedMengerRepair:
      startingOrientationComplete &&
      directedMengerCompatibleWithConstruction &&
      state.directedMenger ===
        null,

    applyLovaszPartition,

    orientAcross,

    balancePart,

    balanceGraph,

    avoidCGraph,

    avoidCPart,

    applyMaLuGraph,

    applyMaLuPart,

    applyHasanvandCompression,

    takeOrientedTwoFactor,

    applyDirectedMengerRepair,

    undo,

    reset,

    canUndo:
      moves.length >
      0,
  }
}