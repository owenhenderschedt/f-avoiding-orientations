import { useState } from 'react'
import Math from '../components/Math'
import MaLuSelector from '../components/MaLuSelector'
import HasanvandSelector from '../components/HasanvandSelector'
import {
  getLovaszPairs,
  lovaszPartitionTool,
  type LovaszPair,
} from '../tools/lovaszPartition'
import {
  orientedTwoFactorTool,
} from '../tools/orientedTwoFactor'
import {
  hasanvandCompressionTool,
} from '../tools/hasanvandCompression'
import type {
  HasanvandApplication,
} from '../tools/hasanvandApplication'
import type {
  HasanvandDegreeRule,
  HasanvandMode,
  HasanvandTarget,
} from '../tools/hasanvandMath'
import type {
  AcrossDirection,
} from '../tools/orientAcrossPartition'
import type {
  AvoidCTarget,
} from '../tools/avoidC'
import {
  getMaLuSelectableValues,
  type MaLuTarget,
} from '../tools/maLuMath'
import type {
  MaLuApplicationMode,
} from '../tools/maLuApplication'
import type {
  GraphPart,
} from './outdegreePossibilities'

type OrientationMenuTarget =
  | 'G'
  | 'L'
  | 'R'
  | 'across'

type ToolMenuProps = {
  workingDegree: number

  fixedOutdegreeContribution:
    number

  globalForbiddenSet:
    readonly number[]

  partition:
    LovaszPair | null

  acrossDirection:
    AcrossDirection | null

  balancedG: boolean
  balancedL: boolean
  balancedR: boolean

  avoidCG: number | null
  avoidCL: number | null
  avoidCR: number | null

  maLuG: boolean
  maLuL: boolean
  maLuR: boolean

  hasanvandG:
    HasanvandApplication | null

  hasanvandL:
    HasanvandApplication | null

  hasanvandR:
    HasanvandApplication | null

  directedMengerApplied?: boolean

  /*
   * When supplied, this is the
   * authoritative playground answer
   * about whether the Menger workspace
   * may open.
   *
   * In particular, usePlayground knows
   * about restrictions such as the
   * current oriented-2-factor safeguard.
   */
  canApplyDirectedMengerRepair?:
    boolean

  onOpenDirectedMengerWorkspace?:
    () => void

  onApplyLovasz:
    (pair: LovaszPair) => void

  onOrientAcross:
    (
      direction:
        AcrossDirection,
    ) => void

  onBalanceGraph: () => void

  onBalancePart:
    (part: GraphPart) => void

  onAvoidCGraph:
    (c: number) => void

  onAvoidCPart:
    (
      part: GraphPart,
      c: number,
    ) => void

  onApplyMaLuGraph:
    (
      mode:
        MaLuApplicationMode,

      selectedValues:
        readonly number[],
    ) => void

  onApplyMaLuPart:
    (
      part: GraphPart,

      mode:
        MaLuApplicationMode,

      selectedValues:
        readonly number[],
    ) => void

  onOpenMaLuReference?: (
    target: MaLuTarget,
  ) => void

  onTakeOrientedTwoFactor:
    () => void

  onApplyHasanvand:
    (
      target:
        HasanvandTarget,

      mode:
        HasanvandMode,

      rules:
        readonly HasanvandDegreeRule[],
    ) => void

  onOpenHasanvandReference?: (
    target:
      HasanvandTarget,
  ) => void
}

function getAvoidCValues(
  maxDegree: number,
) {
  const values:
    number[] = []

  for (
    let c = 2;
    c <= maxDegree;
    c += 1
  ) {
    values.push(c)
  }

  return values
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

function getCurrentTotalOutdegrees(
  target: MaLuTarget,

  workingDegree: number,

  fixedOutdegreeContribution:
    number,

  partition:
    LovaszPair | null,

  acrossDirection:
    AcrossDirection | null,
) {
  let minimumTotal =
    fixedOutdegreeContribution

  let maximumTotal =
    fixedOutdegreeContribution +
    workingDegree

  if (
    target !== 'G'
  ) {
    if (
      partition === null ||
      acrossDirection === null
    ) {
      return []
    }

    const maxInternalDegree =
      target === 'L'
        ? partition.s
        : partition.t

    const crossingPointsOut =
      (
        target === 'L' &&
        acrossDirection ===
          'L-to-R'
      ) ||
      (
        target === 'R' &&
        acrossDirection ===
          'R-to-L'
      )

    if (
      crossingPointsOut
    ) {
      minimumTotal =
        fixedOutdegreeContribution +
        workingDegree -
        maxInternalDegree

      maximumTotal =
        fixedOutdegreeContribution +
        workingDegree
    } else {
      minimumTotal =
        fixedOutdegreeContribution

      maximumTotal =
        fixedOutdegreeContribution +
        maxInternalDegree
    }
  }

  return Array.from(
    {
      length:
        maximumTotal -
        minimumTotal +
        1,
    },
    (_, index) =>
      minimumTotal +
      index,
  )
}

function MenuSectionLabel({
  label,
  separated = false,
}: {
  label: string
  separated?: boolean
}) {
  return (
    <div
      style={{
        marginTop:
          separated
            ? '8px'
            : '2px',

        padding:
          separated
            ? '12px 10px 5px'
            : '5px 10px',

        borderTop:
          separated
            ? '1px solid #e2e8f0'
            : 'none',

        color:
          '#94a3b8',

        fontSize:
          '12px',

        fontWeight:
          600,

        letterSpacing:
          '0.08em',

        textTransform:
          'uppercase',
      }}
    >
      {label}
    </div>
  )
}

function OrientationFolderHeader({
  target,
}: {
  target:
    OrientationMenuTarget
}) {
  return (
    <div
      style={{
        padding:
          '8px 10px 10px',

        borderBottom:
          '1px solid #e2e8f0',

        marginBottom:
          '4px',

        textAlign:
          'center',

        color:
          '#334155',
      }}
    >
      Orient{' '}

      {target ===
      'across' ? (
        <Math>
          {
            'L\\leftrightarrow R'
          }
        </Math>
      ) : (
        <Math>
          {target}
        </Math>
      )}
    </div>
  )
}

export default function ToolMenu({
  workingDegree,
  fixedOutdegreeContribution,
  globalForbiddenSet,
  partition,
  acrossDirection,
  balancedG,
  balancedL,
  balancedR,
  avoidCG,
  avoidCL,
  avoidCR,
  maLuG,
  maLuL,
  maLuR,
  hasanvandG,
  hasanvandL,
  hasanvandR,
  directedMengerApplied = false,
  canApplyDirectedMengerRepair,
  onOpenDirectedMengerWorkspace,
  onApplyLovasz,
  onOrientAcross,
  onBalanceGraph,
  onBalancePart,
  onAvoidCGraph,
  onAvoidCPart,
  onApplyMaLuGraph,
  onApplyMaLuPart,
  onOpenMaLuReference,
  onTakeOrientedTwoFactor,
  onApplyHasanvand,
  onOpenHasanvandReference,
}: ToolMenuProps) {
  const [
    toolsOpen,
    setToolsOpen,
  ] =
    useState(false)

  const [
    lovaszOpen,
    setLovaszOpen,
  ] =
    useState(false)

  const [
    orientationMenuTarget,
    setOrientationMenuTarget,
  ] =
    useState<
      OrientationMenuTarget | null
    >(null)

  const [
    avoidCTarget,
    setAvoidCTarget,
  ] =
    useState<
      AvoidCTarget | null
    >(null)

  const [
    maLuTarget,
    setMaLuTarget,
  ] =
    useState<
      MaLuTarget | null
    >(null)

  const [
    hasanvandTarget,
    setHasanvandTarget,
  ] =
    useState<
      HasanvandTarget | null
    >(null)

  const lovaszPairs =
    getLovaszPairs(
      workingDegree,
    )

  /*
   * Avoid-c data for whichever
   * orientation folder launched the
   * selector.
   */
  let avoidCMaxDegree = 0

  if (
    avoidCTarget === 'G'
  ) {
    avoidCMaxDegree =
      workingDegree
  }

  if (
    avoidCTarget === 'L' &&
    partition !== null
  ) {
    avoidCMaxDegree =
      partition.s
  }

  if (
    avoidCTarget === 'R' &&
    partition !== null
  ) {
    avoidCMaxDegree =
      partition.t
  }

  const avoidCValues =
    getAvoidCValues(
      avoidCMaxDegree,
    )

  /*
   * Ma-Lu data for the selected
   * orientation target.
   */
  let maLuMaxDegree = 0

  let maLuPossibleDegrees:
    number[] = []

  if (
    maLuTarget === 'G'
  ) {
    maLuMaxDegree =
      workingDegree

    maLuPossibleDegrees = [
      workingDegree,
    ]
  }

  if (
    maLuTarget === 'L' &&
    partition !== null
  ) {
    maLuMaxDegree =
      partition.s

    maLuPossibleDegrees =
      getMaLuSelectableValues(
        partition.s,
      )
  }

  if (
    maLuTarget === 'R' &&
    partition !== null
  ) {
    maLuMaxDegree =
      partition.t

    maLuPossibleDegrees =
      getMaLuSelectableValues(
        partition.t,
      )
  }

  const maLuTotalCandidates =
    maLuTarget === null
      ? []
      : getCurrentTotalOutdegrees(
          maLuTarget,

          workingDegree,

          fixedOutdegreeContribution,

          partition,

          acrossDirection,
        )

  /*
   * Hasanvand degree information.
   *
   * The whole graph is regular, so G
   * has one actual degree.
   *
   * For a Lovasz part with
   *
   *   Delta(H) <= s,
   *
   * the abstract playground must allow
   * every degree 0,...,s.
   */
  let hasanvandMaxDegree = 0

  let hasanvandPossibleDegrees:
    number[] = []

  if (
    hasanvandTarget === 'G'
  ) {
    hasanvandMaxDegree =
      workingDegree

    hasanvandPossibleDegrees = [
      workingDegree,
    ]
  }

  if (
    hasanvandTarget === 'L' &&
    partition !== null
  ) {
    hasanvandMaxDegree =
      partition.s

    hasanvandPossibleDegrees =
      getAllDegreesThrough(
        partition.s,
      )
  }

  if (
    hasanvandTarget === 'R' &&
    partition !== null
  ) {
    hasanvandMaxDegree =
      partition.t

    hasanvandPossibleDegrees =
      getAllDegreesThrough(
        partition.t,
      )
  }

  /*
   * Closing a leaf selector should
   * return to its orientation folder.
   *
   * Closing everything returns to the
   * root Tools menu.
   */
  function closeLeafMenus() {
    setLovaszOpen(false)
    setAvoidCTarget(null)
    setMaLuTarget(null)
    setHasanvandTarget(null)
  }

  function closeAllSubmenus() {
    closeLeafMenus()
    setOrientationMenuTarget(
      null,
    )
  }

  function toggleTools() {
    setToolsOpen(
      (current) =>
        !current,
    )

    closeAllSubmenus()
  }

  function openLovaszMenu() {
    closeAllSubmenus()

    setLovaszOpen(
      true,
    )
  }

  function openOrientationMenu(
    target:
      OrientationMenuTarget,
  ) {
    closeLeafMenus()

    setOrientationMenuTarget(
      target,
    )
  }

  function openAvoidCMenu(
    target:
      AvoidCTarget,
  ) {
    setAvoidCTarget(
      target,
    )

    setMaLuTarget(
      null,
    )

    setHasanvandTarget(
      null,
    )

    setLovaszOpen(
      false,
    )
  }

  function openMaLuMenu(
    target:
      MaLuTarget,
  ) {
    setMaLuTarget(
      target,
    )

    setAvoidCTarget(
      null,
    )

    setHasanvandTarget(
      null,
    )

    setLovaszOpen(
      false,
    )
  }

  function openHasanvandMenu(
    target:
      HasanvandTarget,
  ) {
    setHasanvandTarget(
      target,
    )

    setAvoidCTarget(
      null,
    )

    setMaLuTarget(
      null,
    )

    setLovaszOpen(
      false,
    )
  }

  function openMaLuReference() {
    if (
      maLuTarget ===
      null
    ) {
      return
    }

    onOpenMaLuReference?.(
      maLuTarget,
    )
  }

  function openHasanvandReference() {
    if (
      hasanvandTarget ===
      null
    ) {
      return
    }

    onOpenHasanvandReference?.(
      hasanvandTarget,
    )
  }

  function openDirectedMengerWorkspace() {
    if (
      onOpenDirectedMengerWorkspace ===
      undefined
    ) {
      return
    }

    onOpenDirectedMengerWorkspace()

    setToolsOpen(
      false,
    )

    closeAllSubmenus()
  }

  function applyLovasz(
    pair: LovaszPair,
  ) {
    onApplyLovasz(
      pair,
    )

    setToolsOpen(
      false,
    )

    closeAllSubmenus()
  }

  function applyAcrossOrientation(
    direction:
      AcrossDirection,
  ) {
    onOrientAcross(
      direction,
    )

    setToolsOpen(
      false,
    )

    closeAllSubmenus()
  }

  function applyBalanceGraph() {
    onBalanceGraph()

    setToolsOpen(
      false,
    )

    closeAllSubmenus()
  }

  function applyBalancedOrientation(
    part: GraphPart,
  ) {
    onBalancePart(
      part,
    )

    setToolsOpen(
      false,
    )

    closeAllSubmenus()
  }

  function applyAvoidC(
    c: number,
  ) {
    if (
      avoidCTarget ===
      'G'
    ) {
      onAvoidCGraph(
        c,
      )
    }

    if (
      avoidCTarget ===
        'L' ||
      avoidCTarget ===
        'R'
    ) {
      onAvoidCPart(
        avoidCTarget,
        c,
      )
    }

    setToolsOpen(
      false,
    )

    closeAllSubmenus()
  }

  function applyMaLu(
    mode:
      MaLuApplicationMode,

    selectedValues:
      readonly number[],
  ) {
    if (
      maLuTarget ===
      'G'
    ) {
      onApplyMaLuGraph(
        mode,
        selectedValues,
      )
    }

    if (
      maLuTarget ===
        'L' ||
      maLuTarget ===
        'R'
    ) {
      onApplyMaLuPart(
        maLuTarget,
        mode,
        selectedValues,
      )
    }

    setToolsOpen(
      false,
    )

    closeAllSubmenus()
  }

  function applyHasanvand(
    mode:
      HasanvandMode,

    rules:
      readonly HasanvandDegreeRule[],
  ) {
    if (
      hasanvandTarget ===
      null
    ) {
      return
    }

    onApplyHasanvand(
      hasanvandTarget,
      mode,
      rules,
    )

    setToolsOpen(
      false,
    )

    closeAllSubmenus()
  }

  function takeOrientedTwoFactor() {
    onTakeOrientedTwoFactor()

    setToolsOpen(
      false,
    )

    closeAllSubmenus()
  }

  const controlButtonStyle = {
    font:
      'inherit',

    padding:
      '10px 18px',

    border:
      '1px solid #64748b',

    borderRadius:
      '8px',

    background:
      '#f8fafc',

    color:
      '#334155',

    cursor:
      'pointer',
  }

  const menuButtonStyle = {
    font:
      'inherit',

    width:
      '100%',

    padding:
      '10px 14px',

    border:
      'none',

    borderRadius:
      '6px',

    background:
      'transparent',

    color:
      '#334155',

    cursor:
      'pointer',

    textAlign:
      'left' as const,
  }

  const mutedMessageStyle = {
    padding:
      '8px 14px 10px',

    color:
      '#94a3b8',

    fontSize:
      '14px',

    lineHeight:
      1.35,
  }

  const wholeGraphOriented =
    balancedG ||
    avoidCG !==
      null ||
    maLuG ||
    hasanvandG !==
      null

  const leftInternallyOriented =
    balancedL ||
    avoidCL !==
      null ||
    maLuL ||
    hasanvandL !==
      null

  const rightInternallyOriented =
    balancedR ||
    avoidCR !==
      null ||
    maLuR ||
    hasanvandR !==
      null

  /*
   * A Menger fixer needs a complete
   * starting orientation.
   */
  const startingOrientationComplete =
    wholeGraphOriented ||
    (
      partition !==
        null &&
      acrossDirection !==
        null &&
      leftInternallyOriented &&
      rightInternallyOriented
    )

  const constructorsLocked =
    directedMengerApplied

  const canTakeTwoFactor =
    !constructorsLocked &&
    partition ===
      null &&
    !wholeGraphOriented &&
    workingDegree >=
      2 &&
    workingDegree %
      2 ===
      0

  const canAvoidCInG =
    !constructorsLocked &&
    partition ===
      null &&
    !wholeGraphOriented &&
    workingDegree >=
      2

  const canAvoidCInL =
    !constructorsLocked &&
    partition !==
      null &&
    !leftInternallyOriented &&
    partition.s >=
      2

  const canAvoidCInR =
    !constructorsLocked &&
    partition !==
      null &&
    !rightInternallyOriented &&
    partition.t >=
      2

  const canUseMaLuInG =
    !constructorsLocked &&
    partition ===
      null &&
    !wholeGraphOriented &&
    workingDegree >
      0

  const canUseMaLuInL =
    !constructorsLocked &&
    partition !==
      null &&
    !leftInternallyOriented &&
    partition.s >
      0

  const canUseMaLuInR =
    !constructorsLocked &&
    partition !==
      null &&
    !rightInternallyOriented &&
    partition.t >
      0

  const canUseHasanvandInG =
    !constructorsLocked &&
    partition ===
      null &&
    !wholeGraphOriented &&
    workingDegree >
      0

  const canUseHasanvandInL =
    !constructorsLocked &&
    partition !==
      null &&
    !leftInternallyOriented

  const canUseHasanvandInR =
    !constructorsLocked &&
    partition !==
      null &&
    !rightInternallyOriented

  const hasAvailablePartitionConstructor =
    !constructorsLocked &&
    (
      acrossDirection ===
        null ||
      !leftInternallyOriented ||
      !rightInternallyOriented
    )

  /*
   * Prefer the authoritative value
   * supplied by usePlayground.
   *
   * The fallback preserves compatibility
   * until BlobLab is updated.
   */
  const canOpenDirectedMenger =
    canApplyDirectedMengerRepair ??
    (
      startingOrientationComplete &&
      !directedMengerApplied
    )

  const directedMengerButtonEnabled =
    canOpenDirectedMenger &&
    onOpenDirectedMengerWorkspace !==
      undefined

  /*
   * The target currently represented by
   * an Orient G/L/R folder.
   */
  const orientationTarget =
    orientationMenuTarget ===
      'G' ||
    orientationMenuTarget ===
      'L' ||
    orientationMenuTarget ===
      'R'
      ? orientationMenuTarget
      : null

  let orientationTargetMaxDegree =
    0

  if (
    orientationTarget ===
    'G'
  ) {
    orientationTargetMaxDegree =
      workingDegree
  }

  if (
    orientationTarget ===
      'L' &&
    partition !==
      null
  ) {
    orientationTargetMaxDegree =
      partition.s
  }

  if (
    orientationTarget ===
      'R' &&
    partition !==
      null
  ) {
    orientationTargetMaxDegree =
      partition.t
  }

  return (
    <div
      style={{
        position:
          'relative',

        width:
          '300px',
      }}
    >
      <button
        type="button"
        onClick={
          toggleTools
        }
        style={{
          ...controlButtonStyle,

          width:
            '100%',
        }}
      >
        Tools{' '}

        {toolsOpen
          ? '▴'
          : '▾'}
      </button>

      {toolsOpen && (
        <div
          style={{
            marginTop:
              '8px',

            padding:
              '6px',

            border:
              '1px solid #cbd5e1',

            borderRadius:
              '10px',

            background:
              '#ffffff',

            boxShadow:
              '0 8px 24px rgba(0, 0, 0, 0.08)',

            textAlign:
              'left',
          }}
        >
          {/* AVOID C SELECTOR */}

          {avoidCTarget !==
          null ? (
            <>
              <div
                style={{
                  padding:
                    '8px 10px 10px',

                  borderBottom:
                    '1px solid #e2e8f0',

                  marginBottom:
                    '4px',

                  textAlign:
                    'center',
                }}
              >
                Avoid{' '}

                <Math>
                  {'c'}
                </Math>{' '}

                in{' '}

                <Math>
                  {
                    avoidCTarget
                  }
                </Math>

                <div
                  style={{
                    marginTop:
                      '5px',

                    color:
                      '#64748b',

                    fontSize:
                      '16px',
                  }}
                >
                  Choose{' '}

                  <Math>
                    {
                      `2\\leq c\\leq ${avoidCMaxDegree}`
                    }
                  </Math>
                </div>
              </div>

              <div
                style={{
                  maxHeight:
                    '300px',

                  overflowY:
                    'auto',
                }}
              >
                {avoidCValues.map(
                  (c) => (
                    <button
                      key={
                        c
                      }
                      type="button"
                      onClick={() =>
                        applyAvoidC(
                          c,
                        )
                      }
                      style={{
                        ...menuButtonStyle,

                        textAlign:
                          'center',
                      }}
                    >
                      <Math>
                        {
                          `c=${c}`
                        }
                      </Math>
                    </button>
                  ),
                )}
              </div>

              <button
                type="button"
                onClick={() =>
                  setAvoidCTarget(
                    null,
                  )
                }
                style={{
                  ...menuButtonStyle,

                  marginTop:
                    '4px',

                  borderTop:
                    '1px solid #e2e8f0',

                  textAlign:
                    'center',
                }}
              >
                ← Back
              </button>
            </>
          ) : maLuTarget !==
            null ? (
            /*
             * MA-LU SELECTOR
             *
             * Back returns to the
             * corresponding Orient
             * folder because
             * orientationMenuTarget is
             * intentionally preserved.
             */
            <MaLuSelector
              target={
                maLuTarget
              }
              maxSelectableDegree={
                maLuMaxDegree
              }
              possibleDegrees={
                maLuPossibleDegrees
              }
              globalForbiddenSet={
                globalForbiddenSet
              }
              totalCandidateOutdegrees={
                maLuTotalCandidates
              }
              workingDegree={
                workingDegree
              }
              fixedOutdegreeContribution={
                fixedOutdegreeContribution
              }
              partition={
                partition
              }
              acrossDirection={
                acrossDirection
              }
              onApply={
                applyMaLu
              }
              onOpenReference={
                openMaLuReference
              }
              onBack={() =>
                setMaLuTarget(
                  null,
                )
              }
            />
          ) : hasanvandTarget !==
            null ? (
            /*
             * HASANVAND V2 SELECTOR
             */
            <HasanvandSelector
              target={
                hasanvandTarget
              }
              maxDegree={
                hasanvandMaxDegree
              }
              possibleDegrees={
                hasanvandPossibleDegrees
              }
              onApply={
                applyHasanvand
              }
              onOpenReference={
                openHasanvandReference
              }
              onBack={() =>
                setHasanvandTarget(
                  null,
                )
              }
            />
          ) : lovaszOpen ? (
            /*
             * LOVASZ PARTITION
             */
            <>
              <div
                style={{
                  padding:
                    '8px 10px 10px',

                  borderBottom:
                    '1px solid #e2e8f0',

                  marginBottom:
                    '4px',
                }}
              >
                Choose{' '}

                <Math>
                  {
                    '(s,t)'
                  }
                </Math>
              </div>

              {lovaszPairs.map(
                (pair) => (
                  <button
                    key={
                      `${pair.s}-${pair.t}`
                    }
                    type="button"
                    onClick={() =>
                      applyLovasz(
                        pair,
                      )
                    }
                    style={{
                      ...menuButtonStyle,

                      textAlign:
                        'center',
                    }}
                  >
                    <Math>
                      {
                        `(${pair.s},${pair.t})`
                      }
                    </Math>
                  </button>
                ),
              )}

              <button
                type="button"
                onClick={() =>
                  setLovaszOpen(
                    false,
                  )
                }
                style={{
                  ...menuButtonStyle,

                  marginTop:
                    '4px',

                  borderTop:
                    '1px solid #e2e8f0',

                  textAlign:
                    'center',
                }}
              >
                ← Back
              </button>
            </>
          ) : orientationMenuTarget !==
            null ? (
            /*
             * ORIENTATION FOLDER
             */
            <>
              <OrientationFolderHeader
                target={
                  orientationMenuTarget
                }
              />

              {orientationMenuTarget ===
              'across' ? (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      applyAcrossOrientation(
                        'L-to-R',
                      )
                    }
                    style={
                      menuButtonStyle
                    }
                  >
                    <Math>
                      {
                        'L\\to R'
                      }
                    </Math>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      applyAcrossOrientation(
                        'R-to-L',
                      )
                    }
                    style={
                      menuButtonStyle
                    }
                  >
                    <Math>
                      {
                        'R\\to L'
                      }
                    </Math>
                  </button>
                </>
              ) : orientationTarget !==
                null ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      if (
                        orientationTarget ===
                        'G'
                      ) {
                        applyBalanceGraph()
                      } else {
                        applyBalancedOrientation(
                          orientationTarget,
                        )
                      }
                    }}
                    style={
                      menuButtonStyle
                    }
                  >
                    Balance
                  </button>

                  {(
                    orientationTarget ===
                      'G'
                      ? canAvoidCInG
                      : orientationTarget ===
                          'L'
                        ? canAvoidCInL
                        : canAvoidCInR
                  ) && (
                    <button
                      type="button"
                      onClick={() =>
                        openAvoidCMenu(
                          orientationTarget,
                        )
                      }
                      style={
                        menuButtonStyle
                      }
                    >
                      Avoid{' '}

                      <Math>
                        {'c'}
                      </Math>{' '}

                      →
                    </button>
                  )}

                  {(
                    orientationTarget ===
                      'G'
                      ? canUseMaLuInG
                      : orientationTarget ===
                          'L'
                        ? canUseMaLuInL
                        : canUseMaLuInR
                  ) && (
                    <button
                      type="button"
                      onClick={() =>
                        openMaLuMenu(
                          orientationTarget,
                        )
                      }
                      style={
                        menuButtonStyle
                      }
                    >
                      Ma–Lu{' '}
                      →
                    </button>
                  )}

                  {(
                    orientationTarget ===
                      'G'
                      ? canUseHasanvandInG
                      : orientationTarget ===
                          'L'
                        ? canUseHasanvandInL
                        : canUseHasanvandInR
                  ) && (
                    <button
                      type="button"
                      onClick={() =>
                        openHasanvandMenu(
                          orientationTarget,
                        )
                      }
                      style={
                        menuButtonStyle
                      }
                    >
                      {
                        hasanvandCompressionTool
                          .menuLabel
                      }{' '}
                      →
                    </button>
                  )}

                  {orientationTargetMaxDegree ===
                    0 && (
                    <div
                      style={
                        mutedMessageStyle
                      }
                    >
                      This induced
                      graph is
                      edgeless.
                    </div>
                  )}
                </>
              ) : null}

              <button
                type="button"
                onClick={() =>
                  setOrientationMenuTarget(
                    null,
                  )
                }
                style={{
                  ...menuButtonStyle,

                  marginTop:
                    '4px',

                  borderTop:
                    '1px solid #e2e8f0',

                  textAlign:
                    'center',
                }}
              >
                ← Back
              </button>
            </>
          ) : (
            /*
             * ROOT TOOLS MENU
             */
            <>
              <MenuSectionLabel
                label="Constructors"
              />

              {directedMengerApplied ? (
                <div
                  style={
                    mutedMessageStyle
                  }
                >
                  The starting
                  orientation has
                  already been
                  repaired.
                </div>
              ) : partition ===
                null ? (
                <>
                  {!wholeGraphOriented ? (
                    <>
                      {workingDegree >
                        0 && (
                        <button
                          type="button"
                          onClick={
                            openLovaszMenu
                          }
                          style={
                            menuButtonStyle
                          }
                        >
                          {
                            lovaszPartitionTool
                              .menuLabel
                          }{' '}
                          →
                        </button>
                      )}

                      {workingDegree >
                        0 && (
                        <button
                          type="button"
                          onClick={() =>
                            openOrientationMenu(
                              'G',
                            )
                          }
                          style={
                            menuButtonStyle
                          }
                        >
                          Orient{' '}

                          <Math>
                            {'G'}
                          </Math>{' '}

                          →
                        </button>
                      )}
                    </>
                  ) : (
                    <div
                      style={
                        mutedMessageStyle
                      }
                    >
                      Starting
                      orientation
                      complete.
                    </div>
                  )}
                </>
              ) : hasAvailablePartitionConstructor ? (
                <>
                  {!leftInternallyOriented && (
                    <button
                      type="button"
                      onClick={() =>
                        openOrientationMenu(
                          'L',
                        )
                      }
                      style={
                        menuButtonStyle
                      }
                    >
                      Orient{' '}

                      <Math>
                        {'L'}
                      </Math>{' '}

                      →
                    </button>
                  )}

                  {!rightInternallyOriented && (
                    <button
                      type="button"
                      onClick={() =>
                        openOrientationMenu(
                          'R',
                        )
                      }
                      style={
                        menuButtonStyle
                      }
                    >
                      Orient{' '}

                      <Math>
                        {'R'}
                      </Math>{' '}

                      →
                    </button>
                  )}

                  {acrossDirection ===
                    null && (
                    <button
                      type="button"
                      onClick={() =>
                        openOrientationMenu(
                          'across',
                        )
                      }
                      style={
                        menuButtonStyle
                      }
                    >
                      Orient{' '}

                      <Math>
                        {
                          'L\\leftrightarrow R'
                        }
                      </Math>{' '}

                      →
                    </button>
                  )}
                </>
              ) : (
                <div
                  style={
                    mutedMessageStyle
                  }
                >
                  Starting
                  orientation
                  complete.
                </div>
              )}

              {canTakeTwoFactor && (
                <>
                  <MenuSectionLabel
                    label="Reductions"
                    separated
                  />

                  <button
                    type="button"
                    onClick={
                      takeOrientedTwoFactor
                    }
                    style={
                      menuButtonStyle
                    }
                  >
                    {
                      orientedTwoFactorTool
                        .menuLabel
                    }
                  </button>
                </>
              )}

              <MenuSectionLabel
                label="Fixers"
                separated
              />

              {directedMengerApplied ? (
                <div
                  style={
                    mutedMessageStyle
                  }
                >
                  Directed Menger
                  repair applied.
                </div>
              ) : canOpenDirectedMenger ? (
                <button
                  type="button"
                  onClick={
                    openDirectedMengerWorkspace
                  }
                  disabled={
                    !directedMengerButtonEnabled
                  }
                  style={{
                    ...menuButtonStyle,

                    color:
                      directedMengerButtonEnabled
                        ? '#334155'
                        : '#94a3b8',

                    cursor:
                      directedMengerButtonEnabled
                        ? 'pointer'
                        : 'default',
                  }}
                >
                  Directed Menger
                  repair{' '}
                  →
                </button>
              ) : (
                <div
                  style={
                    mutedMessageStyle
                  }
                >
                  Complete a
                  starting
                  orientation
                  first.
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}