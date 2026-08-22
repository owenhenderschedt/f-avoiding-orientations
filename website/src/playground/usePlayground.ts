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
      parameters: HasanvandParameters
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
  partition: LovaszPair | null

  acrossDirection:
    AcrossDirection | null

  balancedG: boolean
  balancedL: boolean
  balancedR: boolean

  avoidCG: number | null
  avoidCL: number | null
  avoidCR: number | null

  maLuG:
    MaLuApplication | null

  maLuL:
    MaLuApplication | null

  maLuR:
    MaLuApplication | null

  orientedTwoFactorCount: number

  hasanvandG:
    HasanvandParameters | null

  directedMenger:
    DirectedMengerApplication | null
}

const initialState:
  PlaygroundState = {
  partition: null,

  acrossDirection: null,

  balancedG: false,
  balancedL: false,
  balancedR: false,

  avoidCG: null,
  avoidCL: null,
  avoidCR: null,

  maLuG: null,
  maLuL: null,
  maLuR: null,

  orientedTwoFactorCount: 0,

  hasanvandG: null,

  directedMenger: null,
}

function deriveState(
  moves: PlaygroundMove[],
): PlaygroundState {
  const state:
    PlaygroundState = {
    ...initialState,
  }

  for (const move of moves) {
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
        move.part === 'L'
      ) {
        state.balancedL =
          true
      }

      if (
        move.part === 'R'
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
        move.part === 'L'
      ) {
        state.avoidCL =
          move.c
      }

      if (
        move.part === 'R'
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
          .target === 'L'
      ) {
        state.maLuL =
          move.application
      }

      if (
        move.application
          .target === 'R'
      ) {
        state.maLuR =
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
      'hasanvand-compression'
    ) {
      state.hasanvandG =
        move.parameters
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

function getCurrentOutdegreeClasses(
  possibilities:
    PartOutdegreePossibilities,
) {
  return Array.from(
    new Set([
      ...possibilities.L,
      ...possibilities.R,
    ]),
  ).sort(
    (a, b) =>
      a - b,
  )
}

/*
 * This is a defensive state check.
 *
 * The application itself will already
 * have been certified before reaching
 * usePlayground, but the playground
 * also verifies that its roles refer
 * to outdegree classes that actually
 * occur in the current starting
 * orientation.
 *
 * Moreover, every currently possible
 * high-outdegree class must appear in
 * the capacity data. A missing class
 * would amount to silently ignoring a
 * negative-imbalance vertex class in
 * the alpha certificate.
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

  const currentClassSet =
    new Set(
      currentClasses,
    )

  const demandClasses =
    application
      .demandRules
      .map(
        (rule) =>
          rule.outdegree,
      )

  const capacityClasses =
    application
      .capacityRules
      .map(
        (rule) =>
          rule.outdegree,
      )

  const demandClassSet =
    new Set(
      demandClasses,
    )

  const capacityClassSet =
    new Set(
      capacityClasses,
    )

  if (
    demandClassSet.size !==
    demandClasses.length
  ) {
    return false
  }

  if (
    capacityClassSet.size !==
    capacityClasses.length
  ) {
    return false
  }

  const allDemandClassesCurrent =
    demandClasses.every(
      (outdegree) =>
        currentClassSet.has(
          outdegree,
        ),
    )

  if (
    !allDemandClassesCurrent
  ) {
    return false
  }

  const allCapacityClassesCurrent =
    capacityClasses.every(
      (outdegree) =>
        currentClassSet.has(
          outdegree,
        ),
    )

  if (
    !allCapacityClassesCurrent
  ) {
    return false
  }

  const rolesAreDisjoint =
    demandClasses.every(
      (outdegree) =>
        !capacityClassSet.has(
          outdegree,
        ),
    )

  if (
    !rolesAreDisjoint
  ) {
    return false
  }

  const demandClassesAreLow =
    application
      .demandRules
      .every(
        (rule) =>
          2 * rule.outdegree <
          degree,
      )

  if (
    !demandClassesAreLow
  ) {
    return false
  }

  const capacityClassesAreHigh =
    application
      .capacityRules
      .every(
        (rule) =>
          2 * rule.outdegree >
          degree,
      )

  if (
    !capacityClassesAreHigh
  ) {
    return false
  }

  /*
   * Every currently possible class
   * above d/2 participates in the
   * upper-bound side of the alpha
   * certificate.
   */
  const currentHighClasses =
    currentClasses.filter(
      (outdegree) =>
        2 * outdegree >
        degree,
    )

  const everyHighClassRepresented =
    currentHighClasses.every(
      (outdegree) =>
        capacityClassSet.has(
          outdegree,
        ),
    )

  if (
    !everyHighClassRepresented
  ) {
    return false
  }

  return true
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
      null

  const rightAlreadyOriented =
    state.balancedR ||
    state.avoidCR !==
      null ||
    state.maLuR !==
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

  let residualOutdegreePossibilities:
    PartOutdegreePossibilities

  if (
    state.hasanvandG !==
    null
  ) {
    const hasanvandValues =
      getHasanvandValues(
        state.hasanvandG.p,
        state.hasanvandG.q,
      )

    residualOutdegreePossibilities =
      {
        L: hasanvandValues,

        R: hasanvandValues,
      }
  } else {
    residualOutdegreePossibilities =
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
        },
      )
  }

  /*
   * Constructors first determine
   * residual outdegrees.
   *
   * Removed oriented 2-factors then
   * contribute their fixed amount.
   *
   * Directed Menger is a fixer of the
   * resulting TOTAL outdegrees, so it
   * must be applied only after this
   * shift.
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
    part: GraphPart,
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
      part === 'L' &&
      leftAlreadyOriented
    ) {
      return
    }

    if (
      part === 'R' &&
      rightAlreadyOriented
    ) {
      return
    }

    if (
      mode === 'internal'
    ) {
      const certificate =
        getMaLuPartSelectionCertificate(
          {
            target: part,

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
          target: part,

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

  function applyHasanvandCompression(
    parameters:
      HasanvandParameters,
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
            'hasanvand-compression',

          parameters,
        },
      ],
    )
  }

  /*
   * The workspace creates and
   * certifies the application before
   * passing it here.
   *
   * usePlayground then verifies that
   * the application is compatible
   * with the actual starting
   * orientation currently displayed.
   */
  function applyDirectedMengerRepair(
    application:
      DirectedMengerApplication,
  ) {
    if (
      state.directedMenger !==
        null ||
      !startingOrientationComplete
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
      state.acrossDirection,

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

    hasanvandG:
      state.hasanvandG,

    directedMengerApplied:
      state.directedMenger !==
      null,

    directedMengerApplication:
      state.directedMenger,

    /*
     * This is the orientation the
     * fixer sees when it opens.
     *
     * In our running d=10 example:
     *
     *   L = {0,1,2,3}
     *   R = {8,9,10}.
     */
    preRepairOutdegreePossibilities,

    residualOutdegreePossibilities,

    /*
     * This is what the graph displays.
     * After our running repair:
     *
     *   L = {0,2,3}
     *   R = {7,8,9,10}.
     */
    outdegreePossibilities,

    outdegreeGuarantees:
      outdegreePossibilities,

    startingOrientationComplete,

    canApplyDirectedMengerRepair:
      startingOrientationComplete &&
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

    takeOrientedTwoFactor,

    applyHasanvandCompression,

    applyDirectedMengerRepair,

    undo,

    reset,

    canUndo:
      moves.length > 0,
  }
}