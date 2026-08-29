import { useState } from 'react'
import {
  createLovaszApplication,
  type LovaszApplication,
  type LovaszPair,
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
  createDirectedMengerReservoirApplication,
  type DirectedMengerReservoirApplication,
} from '../tools/directedMengerReservoirApplication'
import {
  createStabilizeOutdegreeClassesApplication,
  type StabilizeOutdegreeClassApplication,
} from '../tools/stabilizeOutdegreeClassApplication'
import type {
  StabilizeTarget,
} from '../tools/stabilizeOutdegreeClassMath'
import {
  createParityBoundsApplication,
  type ParityBoundsApplication,
} from '../tools/parityBoundsApplication'
import {
  getParityBoundsOutdegreePossibilities,
} from './parityBoundsOutdegrees'
import {
  getStabilizedOutdegreePossibilities,
} from './stabilizeOutdegreeClassOutdegrees'
import {
  getDirectedMengerRepairedPartOutdegrees,
} from './directedMengerOutdegrees'
import {
  getDirectedMengerReservoirRepairedOutdegrees,
} from './directedMengerReservoirOutdegrees'
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
      application:
        LovaszApplication
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
      type: 'parity-bounds'
      application:
        ParityBoundsApplication
    }
  | {
      type:
        'stabilize-outdegree-class'
      application:
        StabilizeOutdegreeClassApplication
    }
  | {
      type:
        'directed-menger-repair'
      application:
        DirectedMengerApplication
    }
  | {
      type:
        'directed-menger-reservoir-repair'
      application:
        DirectedMengerReservoirApplication
    }

export type PlaygroundState = {
  partition:
    LovaszPair | null

  lovaszApplication:
    LovaszApplication | null

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

  /*
   * Parity Bounds is currently a
   * whole-working-graph constructor.
   */
  parityBoundsG:
    ParityBoundsApplication | null

  orientedTwoFactorCount:
    number

  stabilizeOutdegreeClass:
    StabilizeOutdegreeClassApplication | null

  directedMenger:
    DirectedMengerApplication | null

  directedMengerReservoir:
    DirectedMengerReservoirApplication | null
}

const initialState:
  PlaygroundState = {
  partition: null,

  lovaszApplication:
    null,

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

  parityBoundsG:
    null,

  orientedTwoFactorCount:
    0,

  stabilizeOutdegreeClass:
    null,

  directedMenger:
    null,

  directedMengerReservoir:
    null,
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
      state.lovaszApplication =
        move.application

      state.partition =
        move.application.pair
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
      'parity-bounds'
    ) {
      state.parityBoundsG =
        move.application
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
      'stabilize-outdegree-class'
    ) {
      state
        .stabilizeOutdegreeClass =
        move.application
    }

    if (
      move.type ===
      'directed-menger-repair'
    ) {
      state.directedMenger =
        move.application
    }

    if (
      move.type ===
      'directed-menger-reservoir-repair'
    ) {
      state.directedMengerReservoir =
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

  forbiddenSet:
    readonly number[] = [],
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

  const hasAnyDirectedMengerRepair =
    state.directedMenger !==
      null ||
    state
      .directedMengerReservoir !==
      null

  const wholeGraphAlreadyOriented =
    state.balancedG ||
    state.avoidCG !==
      null ||
    state.maLuG !==
      null ||
    state.hasanvandG !==
      null ||
    state.parityBoundsG !==
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

  const arcReversalFixersCompatibleWithConstruction =
    state
      .orientedTwoFactorCount ===
    0

  /*
   * This remains the residual possibility
   * calculation for the existing
   * constructors.
   *
   * Parity Bounds is handled immediately
   * afterward because it already stores
   * its certified TOTAL outdegrees.
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
   * Constructor state -> TOTAL outdegrees.
   *
   * Parity Bounds already contains the
   * fixed contribution from any removed
   * oriented 2-factors, so it must NOT be
   * shifted a second time.
   */
  const preStabilizationOutdegreePossibilities =
    state.parityBoundsG !==
      null
      ? getParityBoundsOutdegreePossibilities(
          {
            application:
              state
                .parityBoundsG,
          },
        )
      : shiftPartOutdegrees(
          residualOutdegreePossibilities,

          residualGraph
            .fixedOutdegreeContribution,
        )

  const preRepairOutdegreePossibilities =
    state
      .stabilizeOutdegreeClass ===
    null
      ? preStabilizationOutdegreePossibilities
      : getStabilizedOutdegreePossibilities(
          {
            possibilities:
              preStabilizationOutdegreePossibilities,

            application:
              state
                .stabilizeOutdegreeClass,
          },
        )

  const directedMengerReservoirCandidate =
    !hasAnyDirectedMengerRepair &&
    startingOrientationComplete
      ? createDirectedMengerReservoirApplication(
          {
            degree:
              originalDegree,

            workingDegree:
              residualGraph
                .workingDegree,

            fixedOutdegreeContribution:
              residualGraph
                .fixedOutdegreeContribution,

            forbiddenSet,

            lovaszApplication:
              state
                .lovaszApplication,

            acrossDirection:
              state
                .acrossDirection,

            balancedR:
              state.balancedR,

            stabilizationApplication:
              state
                .stabilizeOutdegreeClass,

            currentOutdegreesL:
              preRepairOutdegreePossibilities
                .L,

            currentOutdegreesR:
              preRepairOutdegreePossibilities
                .R,
          },
        )
      : null

  const outdegreePossibilities =
    state
      .directedMengerReservoir !==
    null
      ? getDirectedMengerReservoirRepairedOutdegrees(
          {
            possibilities:
              preRepairOutdegreePossibilities,

            application:
              state
                .directedMengerReservoir,
          },
        )
      : state.directedMenger !==
          null
        ? getDirectedMengerRepairedPartOutdegrees(
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
        : preRepairOutdegreePossibilities

  function applyLovaszPartition(
    pair: LovaszPair,
  ) {
    if (
      hasAnyDirectedMengerRepair ||
      state
        .stabilizeOutdegreeClass !==
        null ||
      wholeGraphAlreadyOriented
    ) {
      return
    }

    const application =
      createLovaszApplication(
        {
          degree:
            residualGraph
              .workingDegree,

          pair,
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
            'lovasz-partition',

          application,
        },
      ],
    )
  }

  function orientAcross(
    direction:
      AcrossDirection,
  ) {
    if (
      hasAnyDirectedMengerRepair ||
      state
        .stabilizeOutdegreeClass !==
        null ||
      state.parityBoundsG !==
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
      hasAnyDirectedMengerRepair ||
      state.parityBoundsG !==
        null
    ) {
      return
    }

    if (
      state
        .stabilizeOutdegreeClass
        ?.target ===
      part
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
      hasAnyDirectedMengerRepair ||
      state
        .stabilizeOutdegreeClass !==
        null ||
      wholeGraphAlreadyOriented
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
      hasAnyDirectedMengerRepair ||
      state
        .stabilizeOutdegreeClass !==
        null ||
      wholeGraphAlreadyOriented
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
      hasAnyDirectedMengerRepair ||
      state.parityBoundsG !==
        null
    ) {
      return
    }

    if (
      state
        .stabilizeOutdegreeClass
        ?.target ===
      part
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
      hasAnyDirectedMengerRepair ||
      state
        .stabilizeOutdegreeClass !==
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
      hasAnyDirectedMengerRepair ||
      state.partition ===
        null ||
      state.parityBoundsG !==
        null ||
      selectedValues.length ===
        0
    ) {
      return
    }

    if (
      state
        .stabilizeOutdegreeClass
        ?.target ===
      part
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

  function applyHasanvandCompression(
    target:
      HasanvandTarget,

    mode:
      HasanvandMode,

    rules:
      readonly HasanvandDegreeRule[],
  ) {
    if (
      hasAnyDirectedMengerRepair ||
      state.parityBoundsG !==
        null
    ) {
      return
    }

    if (
      state
        .stabilizeOutdegreeClass
        ?.target ===
      target
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
        wholeGraphAlreadyOriented ||
        state
          .stabilizeOutdegreeClass !==
          null
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

  /*
   * New whole-working-graph constructor.
   *
   * It may be applied after one or more
   * oriented 2-factor reductions because
   * createParityBoundsApplication receives
   * both:
   *
   *   - the residual working degree;
   *   - the already fixed outdegree
   *     contribution.
   */
  function applyParityBounds({
    normalLower,
    normalUpper,
    exceptionalLower,
    exceptionalUpper,
  }: {
    normalLower:
      number

    normalUpper:
      number

    exceptionalLower:
      number

    exceptionalUpper:
      number
  }) {
    if (
      hasAnyDirectedMengerRepair ||
      state
        .stabilizeOutdegreeClass !==
        null ||
      state.partition !==
        null ||
      wholeGraphAlreadyOriented
    ) {
      return
    }

    const application =
      createParityBoundsApplication({
        workingDegree:
          residualGraph
            .workingDegree,

        fixedOutdegreeContribution:
          residualGraph
            .fixedOutdegreeContribution,

        normalLower,

        normalUpper,

        exceptionalLower,

        exceptionalUpper,
      })

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
            'parity-bounds',

          application,
        },
      ],
    )
  }

  function takeOrientedTwoFactor() {
    if (
      hasAnyDirectedMengerRepair ||
      state
        .stabilizeOutdegreeClass !==
        null ||
      state.parityBoundsG !==
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

  function applyStabilizeOutdegreeClass(
    target:
      StabilizeTarget,

    qs:
      readonly number[],
  ) {
    if (
      hasAnyDirectedMengerRepair ||
      state
        .stabilizeOutdegreeClass !==
        null ||
      !arcReversalFixersCompatibleWithConstruction
    ) {
      return
    }

    let currentOutdegrees:
      readonly number[]

    if (
      target ===
      'G'
    ) {
      if (
        state.partition !==
          null ||
        !wholeGraphAlreadyOriented
      ) {
        return
      }

      currentOutdegrees =
        getCurrentOutdegreeClasses(
          preStabilizationOutdegreePossibilities,
        )
    } else {
      if (
        state.partition ===
          null ||
        state.acrossDirection ===
          null
      ) {
        return
      }

      if (
        target ===
          'L' &&
        !leftAlreadyOriented
      ) {
        return
      }

      if (
        target ===
          'R' &&
        !rightAlreadyOriented
      ) {
        return
      }

      currentOutdegrees =
        target ===
        'L'
          ? preStabilizationOutdegreePossibilities
              .L
          : preStabilizationOutdegreePossibilities
              .R
    }

    const application =
      createStabilizeOutdegreeClassesApplication(
        {
          target,

          qs,

          degree:
            originalDegree,

          currentOutdegrees,
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
            'stabilize-outdegree-class',

          application,
        },
      ],
    )
  }

  function applyDirectedMengerRepair(
    application:
      DirectedMengerApplication,
  ) {
    if (
      hasAnyDirectedMengerRepair ||
      !startingOrientationComplete ||
      !arcReversalFixersCompatibleWithConstruction
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

  function applyDirectedMengerReservoirRepair() {
    if (
      hasAnyDirectedMengerRepair ||
      !startingOrientationComplete ||
      directedMengerReservoirCandidate ===
        null
    ) {
      return
    }

    setMoves(
      (current) => [
        ...current,

        {
          type:
            'directed-menger-reservoir-repair',

          application:
            directedMengerReservoirCandidate,
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

  const canApplyParityBounds =
    !hasAnyDirectedMengerRepair &&
    state
      .stabilizeOutdegreeClass ===
      null &&
    state.partition ===
      null &&
    !wholeGraphAlreadyOriented

  const canStabilizeCommon =
    !hasAnyDirectedMengerRepair &&
    state
      .stabilizeOutdegreeClass ===
      null &&
    arcReversalFixersCompatibleWithConstruction

  const canStabilizeG =
    canStabilizeCommon &&
    state.partition ===
      null &&
    wholeGraphAlreadyOriented

  const canStabilizeL =
    canStabilizeCommon &&
    state.partition !==
      null &&
    state.acrossDirection !==
      null &&
    leftAlreadyOriented

  const canStabilizeR =
    canStabilizeCommon &&
    state.partition !==
      null &&
    state.acrossDirection !==
      null &&
    rightAlreadyOriented

  const canApplyDirectedMengerRepair =
    startingOrientationComplete &&
    arcReversalFixersCompatibleWithConstruction &&
    !hasAnyDirectedMengerRepair

  const canApplyDirectedMengerReservoirRepair =
    startingOrientationComplete &&
    !hasAnyDirectedMengerRepair &&
    directedMengerReservoirCandidate !==
      null

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

    lovaszApplication:
      state
        .lovaszApplication,

    lovaszCertificate:
      state
        .lovaszApplication
        ?.certificate ??
      null,

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

    /*
     * New Parity Bounds state.
     */
    parityBoundsG:
      state.parityBoundsG !==
      null,

    parityBoundsApplication:
      state.parityBoundsG,

    canApplyParityBounds,

    stabilizeOutdegreeClassApplied:
      state
        .stabilizeOutdegreeClass !==
      null,

    stabilizeOutdegreeClassApplication:
      state
        .stabilizeOutdegreeClass,

    stabilizationCertificate:
      state
        .stabilizeOutdegreeClass
        ?.certificate ??
      null,

    canStabilizeG,

    canStabilizeL,

    canStabilizeR,

    directedMengerApplied:
      hasAnyDirectedMengerRepair,

    directedMengerApplication:
      state.directedMenger,

    directedMengerReservoirApplication:
      state
        .directedMengerReservoir,

    directedMengerReservoirCandidate,

    preStabilizationOutdegreePossibilities,

    preRepairOutdegreePossibilities,

    residualOutdegreePossibilities,

    outdegreePossibilities,

    outdegreeGuarantees:
      outdegreePossibilities,

    startingOrientationComplete,

    canApplyDirectedMengerRepair,

    canApplyDirectedMengerReservoirRepair,

    applyLovaszPartition,

    orientAcross,

    balancePart,

    balanceGraph,

    avoidCGraph,

    avoidCPart,

    applyMaLuGraph,

    applyMaLuPart,

    applyHasanvandCompression,

    /*
     * New action.
     */
    applyParityBounds,

    takeOrientedTwoFactor,

    applyStabilizeOutdegreeClass,

    applyDirectedMengerRepair,

    applyDirectedMengerReservoirRepair,

    undo,

    reset,

    canUndo:
      moves.length >
      0,
  }
}
