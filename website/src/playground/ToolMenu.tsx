import {
  useState,
  type ReactNode,
} from 'react'
import Math from '../components/Math'
import MaLuSelector from '../components/MaLuSelector'
import HasanvandSelector from '../components/HasanvandSelector'
import ParityBoundsSelector, {
  type ParityBoundsSelection,
} from '../components/ParityBoundsSelector'
import StabilizeOutdegreeClassSelector, {
  type StabilizeTargetOption,
} from '../components/StabilizeOutdegreeClassSelector'
import DirectedMengerModeSelector from '../components/DirectedMengerModeSelector'
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
  StabilizeTarget,
} from '../tools/stabilizeOutdegreeClassMath'
import type {
  DirectedMengerReservoirApplication,
} from '../tools/directedMengerReservoirApplication'
import type {
  GraphPart,
  PartOutdegreePossibilities,
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

  /*
   * Parity Bounds is currently a
   * whole-working-graph constructor.
   */
  parityBoundsG?: boolean

  canApplyParityBounds?: boolean

  onApplyParityBounds?:
    (
      selection:
        ParityBoundsSelection,
    ) => void

  onOpenParityBoundsReference?:
    () => void

  directedMengerApplied?: boolean

  canApplyDirectedMengerRepair?: boolean

  onOpenDirectedMengerWorkspace?:
    () => void

  /*
   * Directed Menger V3 reservoir mode.
   *
   * These are optional during the
   * incremental wiring step. BlobLab
   * will supply them next.
   */
  directedMengerReservoirCandidate?:
    DirectedMengerReservoirApplication | null

  onApplyDirectedMengerReservoirRepair?:
    () => void

  onOpenDirectedMengerReservoirReference?:
    (
      application:
        DirectedMengerReservoirApplication,
    ) => void

  stabilizeOutdegreeClassApplied?:
    boolean

  canStabilizeG?: boolean
  canStabilizeL?: boolean
  canStabilizeR?: boolean

  preStabilizationOutdegreePossibilities?:
    PartOutdegreePossibilities

  onApplyStabilizeOutdegreeClass?:
    (
      target:
        StabilizeTarget,

      qs:
        readonly number[],
    ) => void

  onOpenStabilizeOutdegreeClassReference?:
    (
      target:
        StabilizeTarget,
    ) => void

  onApplyLovasz:
    (pair: LovaszPair) => void

  onOrientAcross:
    (
      direction:
        AcrossDirection,
    ) => void

  onBalanceGraph:
    () => void

  onBalancePart:
    (
      part:
        GraphPart,
    ) => void

  onAvoidCGraph:
    (c: number) => void

  onAvoidCPart:
    (
      part:
        GraphPart,

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
      part:
        GraphPart,

      mode:
        MaLuApplicationMode,

      selectedValues:
        readonly number[],
    ) => void

  onOpenMaLuReference?:
    (
      target:
        MaLuTarget,
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

  onOpenHasanvandReference?:
    (
      target:
        HasanvandTarget,
    ) => void
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

function getCurrentTotalOutdegrees(
  target:
    MaLuTarget,

  workingDegree:
    number,

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
      partition ===
        null ||
      acrossDirection ===
        null
    ) {
      return []
    }

    const maxInternalDegree =
      target === 'L'
        ? partition.s
        : partition.t

    const crossingPointsOut =
      (
        target ===
          'L' &&
        acrossDirection ===
          'L-to-R'
      ) ||
      (
        target ===
          'R' &&
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
    (
      _,
      index,
    ) =>
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
  onBack,
}: {
  target:
    OrientationMenuTarget

  onBack:
    () => void
}) {
  let title:
    ReactNode

  if (
    target ===
    'across'
  ) {
    title = (
      <>
        Orient{' '}

        <Math>
          {'L\\leftrightarrow R'}
        </Math>
      </>
    )
  } else {
    title = (
      <>
        Orient{' '}

        <Math>
          {target}
        </Math>
      </>
    )
  }

  return (
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
      <div
        style={{
          display:
            'flex',

          alignItems:
            'center',

          justifyContent:
            'space-between',

          gap:
            '10px',
        }}
      >
        <button
          type="button"
          onClick={
            onBack
          }
          style={{
            font:
              'inherit',

            border:
              'none',

            background:
              'transparent',

            color:
              '#64748b',

            cursor:
              'pointer',

            padding: 0,
          }}
        >
          ← Back
        </button>

        <div>
          {title}
        </div>
      </div>
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
  parityBoundsG = false,
  canApplyParityBounds = false,
  onApplyParityBounds,
  onOpenParityBoundsReference,
  directedMengerApplied = false,
  canApplyDirectedMengerRepair = false,
  onOpenDirectedMengerWorkspace,
  directedMengerReservoirCandidate = null,
  onApplyDirectedMengerReservoirRepair,
  onOpenDirectedMengerReservoirReference,
  stabilizeOutdegreeClassApplied = false,
  canStabilizeG = false,
  canStabilizeL = false,
  canStabilizeR = false,
  preStabilizationOutdegreePossibilities,
  onApplyStabilizeOutdegreeClass,
  onOpenStabilizeOutdegreeClassReference,
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
    orientationTarget,
    setOrientationTarget,
  ] =
    useState<
      OrientationMenuTarget | null
    >(
      null,
    )

  const [
    avoidCTarget,
    setAvoidCTarget,
  ] =
    useState<
      AvoidCTarget | null
    >(
      null,
    )

  const [
    maLuTarget,
    setMaLuTarget,
  ] =
    useState<
      MaLuTarget | null
    >(
      null,
    )

  const [
    hasanvandTarget,
    setHasanvandTarget,
  ] =
    useState<
      HasanvandTarget | null
    >(
      null,
    )

  const [
    parityBoundsOpen,
    setParityBoundsOpen,
  ] =
    useState(false)

  const [
    stabilizationOpen,
    setStabilizationOpen,
  ] =
    useState(false)

  /*
   * NEW:
   * Clicking Directed Menger from the
   * root menu now opens a certificate
   * mode chooser rather than jumping
   * directly to Local-alpha.
   */
  const [
    directedMengerModeOpen,
    setDirectedMengerModeOpen,
  ] =
    useState(false)

  const lovaszPairs =
    getLovaszPairs(
      workingDegree,
    )

  const wholeGraphOriented =
    balancedG ||
    avoidCG !==
      null ||
    maLuG ||
    hasanvandG !==
      null ||
    parityBoundsG

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

  const canOrientG =
    !constructorsLocked &&
    partition ===
      null &&
    !wholeGraphOriented &&
    workingDegree >=
      0

  const canOrientL =
    !constructorsLocked &&
    partition !==
      null &&
    !leftInternallyOriented

  const canOrientR =
    !constructorsLocked &&
    partition !==
      null &&
    !rightInternallyOriented

  const canOrientAcross =
    !constructorsLocked &&
    partition !==
      null &&
    acrossDirection ===
      null

  const canAvoidCInG =
    canOrientG &&
    workingDegree >=
      2

  const canAvoidCInL =
    canOrientL &&
    partition !==
      null &&
    partition.s >=
      2

  const canAvoidCInR =
    canOrientR &&
    partition !==
      null &&
    partition.t >=
      2

  const canUseMaLuInG =
    canOrientG &&
    workingDegree >
      0

  const canUseMaLuInL =
    canOrientL &&
    partition !==
      null &&
    partition.s >
      0

  const canUseMaLuInR =
    canOrientR &&
    partition !==
      null &&
    partition.t >
      0

  const canUseHasanvandInG =
    canOrientG

  const canUseParityBoundsInG =
    canOrientG &&
    canApplyParityBounds &&
    workingDegree >=
      4 &&
    workingDegree %
      2 ===
      0 &&
    onApplyParityBounds !==
      undefined

  const canUseHasanvandInL =
    canOrientL

  const canUseHasanvandInR =
    canOrientR

  const anyStabilizationAvailable =
    (
      canStabilizeG ||
      canStabilizeL ||
      canStabilizeR
    ) &&
    !stabilizeOutdegreeClassApplied &&
    onApplyStabilizeOutdegreeClass !==
      undefined &&
    preStabilizationOutdegreePossibilities !==
      undefined

  const stabilizationTargets:
    StabilizeTargetOption[] = []

  if (
    anyStabilizationAvailable &&
    preStabilizationOutdegreePossibilities !==
      undefined
  ) {
    if (
      canStabilizeG
    ) {
      stabilizationTargets.push({
        target:
          'G',

        possibleOutdegrees:
          uniqueSorted([
            ...preStabilizationOutdegreePossibilities
              .L,

            ...preStabilizationOutdegreePossibilities
              .R,
          ]),
      })
    }

    if (
      canStabilizeL
    ) {
      stabilizationTargets.push({
        target:
          'L',

        possibleOutdegrees:
          preStabilizationOutdegreePossibilities
            .L,
      })
    }

    if (
      canStabilizeR
    ) {
      stabilizationTargets.push({
        target:
          'R',

        possibleOutdegrees:
          preStabilizationOutdegreePossibilities
            .R,
      })
    }
  }

  let avoidCMaxDegree =
    0

  if (
    avoidCTarget ===
    'G'
  ) {
    avoidCMaxDegree =
      workingDegree
  }

  if (
    avoidCTarget ===
      'L' &&
    partition !==
      null
  ) {
    avoidCMaxDegree =
      partition.s
  }

  if (
    avoidCTarget ===
      'R' &&
    partition !==
      null
  ) {
    avoidCMaxDegree =
      partition.t
  }

  const avoidCValues =
    getAvoidCValues(
      avoidCMaxDegree,
    )

  let maLuMaxDegree =
    0

  let maLuPossibleDegrees:
    number[] = []

  if (
    maLuTarget ===
    'G'
  ) {
    maLuMaxDegree =
      workingDegree

    maLuPossibleDegrees = [
      workingDegree,
    ]
  }

  if (
    maLuTarget ===
      'L' &&
    partition !==
      null
  ) {
    maLuMaxDegree =
      partition.s

    maLuPossibleDegrees =
      getMaLuSelectableValues(
        partition.s,
      )
  }

  if (
    maLuTarget ===
      'R' &&
    partition !==
      null
  ) {
    maLuMaxDegree =
      partition.t

    maLuPossibleDegrees =
      getMaLuSelectableValues(
        partition.t,
      )
  }

  const maLuTotalCandidates =
    maLuTarget ===
    null
      ? []
      : getCurrentTotalOutdegrees(
          maLuTarget,

          workingDegree,

          fixedOutdegreeContribution,

          partition,

          acrossDirection,
        )

  let hasanvandMaxDegree =
    0

  let hasanvandPossibleDegrees:
    number[] = []

  if (
    hasanvandTarget ===
    'G'
  ) {
    hasanvandMaxDegree =
      workingDegree

    hasanvandPossibleDegrees = [
      workingDegree,
    ]
  }

  if (
    hasanvandTarget ===
      'L' &&
    partition !==
      null
  ) {
    hasanvandMaxDegree =
      partition.s

    hasanvandPossibleDegrees =
      getAllDegreesThrough(
        partition.s,
      )
  }

  if (
    hasanvandTarget ===
      'R' &&
    partition !==
      null
  ) {
    hasanvandMaxDegree =
      partition.t

    hasanvandPossibleDegrees =
      getAllDegreesThrough(
        partition.t,
      )
  }

  function closeSubmenus() {
    setLovaszOpen(
      false,
    )

    setOrientationTarget(
      null,
    )

    setAvoidCTarget(
      null,
    )

    setMaLuTarget(
      null,
    )

    setHasanvandTarget(
      null,
    )

    setParityBoundsOpen(
      false,
    )

    setStabilizationOpen(
      false,
    )

    setDirectedMengerModeOpen(
      false,
    )
  }

  function toggleTools() {
    setToolsOpen(
      (current) =>
        !current,
    )

    closeSubmenus()
  }

  function returnToRoot() {
    closeSubmenus()
  }

  function openLovaszMenu() {
    closeSubmenus()

    setLovaszOpen(
      true,
    )
  }

  function openOrientationFolder(
    target:
      OrientationMenuTarget,
  ) {
    closeSubmenus()

    setOrientationTarget(
      target,
    )
  }

  function openAvoidCMenu(
    target:
      AvoidCTarget,
  ) {
    setOrientationTarget(
      null,
    )

    setAvoidCTarget(
      target,
    )
  }

  function openMaLuMenu(
    target:
      MaLuTarget,
  ) {
    setOrientationTarget(
      null,
    )

    setMaLuTarget(
      target,
    )
  }

  function openHasanvandMenu(
    target:
      HasanvandTarget,
  ) {
    setOrientationTarget(
      null,
    )

    setHasanvandTarget(
      target,
    )
  }

  function openStabilizationMenu() {
    closeSubmenus()

    setStabilizationOpen(
      true,
    )
  }

  function openDirectedMengerModeMenu() {
    closeSubmenus()

    setDirectedMengerModeOpen(
      true,
    )
  }

  function applyLovasz(
    pair:
      LovaszPair,
  ) {
    onApplyLovasz(
      pair,
    )

    setToolsOpen(
      false,
    )

    closeSubmenus()
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

    closeSubmenus()
  }

  function applyBalanceGraph() {
    onBalanceGraph()

    setToolsOpen(
      false,
    )

    closeSubmenus()
  }

  function applyBalancedOrientation(
    part:
      GraphPart,
  ) {
    onBalancePart(
      part,
    )

    setToolsOpen(
      false,
    )

    closeSubmenus()
  }

  function applyAvoidC(
    c:
      number,
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

    closeSubmenus()
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

    closeSubmenus()
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

    closeSubmenus()
  }

  function applyParityBounds(
    selection:
      ParityBoundsSelection,
  ) {
    if (
      onApplyParityBounds ===
      undefined
    ) {
      return
    }

    onApplyParityBounds(
      selection,
    )

    setToolsOpen(
      false,
    )

    closeSubmenus()
  }

  function applyStabilization(
    target:
      StabilizeTarget,

    qs:
      readonly number[],
  ) {
    if (
      onApplyStabilizeOutdegreeClass ===
      undefined
    ) {
      return
    }

    onApplyStabilizeOutdegreeClass(
      target,

      qs,
    )

    setToolsOpen(
      false,
    )

    closeSubmenus()
  }

  function takeOrientedTwoFactor() {
    onTakeOrientedTwoFactor()

    setToolsOpen(
      false,
    )

    closeSubmenus()
  }

  /*
   * LOCAL-ALPHA MODE
   */
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

    closeSubmenus()
  }

  /*
   * RESERVOIR MODE
   */
  function applyDirectedMengerReservoirRepair() {
    if (
      onApplyDirectedMengerReservoirRepair ===
      undefined
    ) {
      return
    }

    onApplyDirectedMengerReservoirRepair()

    setToolsOpen(
      false,
    )

    closeSubmenus()
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

  const hasAnyConstructor =
    partition ===
      null
      ? !wholeGraphOriented
      : (
          canOrientL ||
          canOrientR ||
          canOrientAcross
        )

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
          {/* DIRECTED MENGER MODE SELECTOR */}

          {directedMengerModeOpen ? (
            <DirectedMengerModeSelector
              canUseLocalAlpha={
                canApplyDirectedMengerRepair
              }
              reservoirCandidate={
                directedMengerReservoirCandidate
              }
              onOpenLocalAlpha={
                openDirectedMengerWorkspace
              }
              onApplyReservoir={
                applyDirectedMengerReservoirRepair
              }
              onOpenReservoirReference={(
                application,
              ) =>
                onOpenDirectedMengerReservoirReference?.(
                  application,
                )
              }
              onBack={
                returnToRoot
              }
            />

          /* STABILIZATION SELECTOR */

          ) : stabilizationOpen ? (
            <StabilizeOutdegreeClassSelector
              targets={
                stabilizationTargets
              }
              onApply={
                applyStabilization
              }
              onOpenReference={(
                target,
              ) =>
                onOpenStabilizeOutdegreeClassReference?.(
                  target,
                )
              }
              onBack={
                returnToRoot
              }
            />

          /* PARITY BOUNDS SELECTOR */

          ) : parityBoundsOpen ? (
            <>
              <button
                type="button"
                onClick={
                  returnToRoot
                }
                style={{
                  ...menuButtonStyle,

                  marginBottom:
                    '4px',

                  borderBottom:
                    '1px solid #e2e8f0',

                  textAlign:
                    'center',
                }}
              >
                ← Back
              </button>

              <div
                style={{
                  margin:
                    '0 -6px -6px',
                }}
              >
                <ParityBoundsSelector
                  workingDegree={
                    workingDegree
                  }
                  fixedOutdegreeContribution={
                    fixedOutdegreeContribution
                  }
                  forbiddenSet={
                    globalForbiddenSet
                  }
                  canApply={
                    canUseParityBoundsInG
                  }
                  onApply={
                    applyParityBounds
                  }
                  onOpenReference={() =>
                    onOpenParityBoundsReference?.()
                  }
                  onBack={
                    returnToRoot
                  }
                />
              </div>
            </>

          /* AVOID C SELECTOR */

          ) : avoidCTarget !==
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
                    avoidCTarget ===
                    'G'
                      ? 'G'
                      : `G[${avoidCTarget}]`
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
                  (
                    c,
                  ) => (
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

          /* MA-LU SELECTOR */

          ) : maLuTarget !==
            null ? (
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
              onOpenReference={() =>
                onOpenMaLuReference?.(
                  maLuTarget,
                )
              }
              onBack={() =>
                setMaLuTarget(
                  null,
                )
              }
            />

          /* HASANVAND SELECTOR */

          ) : hasanvandTarget !==
            null ? (
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
              onOpenReference={() =>
                onOpenHasanvandReference?.(
                  hasanvandTarget,
                )
              }
              onBack={() =>
                setHasanvandTarget(
                  null,
                )
              }
            />

          /* LOVASZ SELECTOR */

          ) : lovaszOpen ? (
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
                  {'(s,t)'}
                </Math>
              </div>

              {lovaszPairs.map(
                (
                  pair,
                ) => (
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
                onClick={
                  returnToRoot
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

          /* ORIENTATION FOLDERS */

          ) : orientationTarget !==
            null ? (
            <>
              <OrientationFolderHeader
                target={
                  orientationTarget
                }
                onBack={
                  returnToRoot
                }
              />

              {orientationTarget ===
                'G' && (
                <>
                  <button
                    type="button"
                    onClick={
                      applyBalanceGraph
                    }
                    style={
                      menuButtonStyle
                    }
                  >
                    Balance{' '}

                    <Math>
                      {'G'}
                    </Math>
                  </button>

                  {canAvoidCInG && (
                    <button
                      type="button"
                      onClick={() =>
                        openAvoidCMenu(
                          'G',
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

                  {canUseMaLuInG && (
                    <button
                      type="button"
                      onClick={() =>
                        openMaLuMenu(
                          'G',
                        )
                      }
                      style={
                        menuButtonStyle
                      }
                    >
                      Ma–Lu →
                    </button>
                  )}

                  {canUseHasanvandInG && (
                    <button
                      type="button"
                      onClick={() =>
                        openHasanvandMenu(
                          'G',
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
                  {canUseParityBoundsInG && (
  <button
    type="button"
    onClick={() =>
      setParityBoundsOpen(
        true,
      )
    }
    style={
      menuButtonStyle
    }
  >
    Parity Bounds →
  </button>
)}
                </>
              )}

              {orientationTarget ===
                'L' && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      applyBalancedOrientation(
                        'L',
                      )
                    }
                    style={
                      menuButtonStyle
                    }
                  >
                    Balance{' '}

                    <Math>
                      {'L'}
                    </Math>
                  </button>

                  {canAvoidCInL && (
                    <button
                      type="button"
                      onClick={() =>
                        openAvoidCMenu(
                          'L',
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

                  {canUseMaLuInL && (
                    <button
                      type="button"
                      onClick={() =>
                        openMaLuMenu(
                          'L',
                        )
                      }
                      style={
                        menuButtonStyle
                      }
                    >
                      Ma–Lu →
                    </button>
                  )}

                  {canUseHasanvandInL && (
                    <button
                      type="button"
                      onClick={() =>
                        openHasanvandMenu(
                          'L',
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
                </>
              )}

              {orientationTarget ===
                'R' && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      applyBalancedOrientation(
                        'R',
                      )
                    }
                    style={
                      menuButtonStyle
                    }
                  >
                    Balance{' '}

                    <Math>
                      {'R'}
                    </Math>
                  </button>

                  {canAvoidCInR && (
                    <button
                      type="button"
                      onClick={() =>
                        openAvoidCMenu(
                          'R',
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

                  {canUseMaLuInR && (
                    <button
                      type="button"
                      onClick={() =>
                        openMaLuMenu(
                          'R',
                        )
                      }
                      style={
                        menuButtonStyle
                      }
                    >
                      Ma–Lu →
                    </button>
                  )}

                  {canUseHasanvandInR && (
                    <button
                      type="button"
                      onClick={() =>
                        openHasanvandMenu(
                          'R',
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
                </>
              )}

              {orientationTarget ===
                'across' && (
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
                    Orient{' '}

                    <Math>
                      {'L\\to R'}
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
                    Orient{' '}

                    <Math>
                      {'R\\to L'}
                    </Math>
                  </button>
                </>
              )}
            </>

          /* ROOT MENU */

          ) : (
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
                  The orientation has
                  already been repaired.
                </div>
              ) : (
                <>
                  {partition ===
                  null ? (
                    <>
                      {!wholeGraphOriented &&
                        workingDegree >
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

                      {canOrientG && (
                        <button
                          type="button"
                          onClick={() =>
                            openOrientationFolder(
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
                    <>
                      {canOrientL && (
                        <button
                          type="button"
                          onClick={() =>
                            openOrientationFolder(
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

                      {canOrientR && (
                        <button
                          type="button"
                          onClick={() =>
                            openOrientationFolder(
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

                      {canOrientAcross && (
                        <button
                          type="button"
                          onClick={() =>
                            openOrientationFolder(
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
                  )}

                  {!hasAnyConstructor && (
                    <div
                      style={
                        mutedMessageStyle
                      }
                    >
                      Starting orientation
                      complete.
                    </div>
                  )}
                </>
              )}

              {partition ===
                null &&
                canTakeTwoFactor && (
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

              {stabilizeOutdegreeClassApplied ? (
                <div
                  style={
                    mutedMessageStyle
                  }
                >
                  Outdegree classes have
                  been stabilized.
                </div>
              ) : anyStabilizationAvailable ? (
                <button
                  type="button"
                  onClick={
                    openStabilizationMenu
                  }
                  style={
                    menuButtonStyle
                  }
                >
                  Stabilize classes{' '}

                  <Math>
                    {'Q'}
                  </Math>{' '}
                  →

                </button>
              ) : null}

              {directedMengerApplied ? (
                <div
                  style={
                    mutedMessageStyle
                  }
                >
                  Directed Menger
                  repair applied.
                </div>
              ) : (
                canApplyDirectedMengerRepair ||
                directedMengerReservoirCandidate !==
                  null
              ) ? (
                <button
                  type="button"
                  onClick={
                    openDirectedMengerModeMenu
                  }
                  style={
                    menuButtonStyle
                  }
                >
                  Directed Menger
                  repair →
                </button>
              ) : !anyStabilizationAvailable &&
                !stabilizeOutdegreeClassApplied ? (
                <div
                  style={
                    mutedMessageStyle
                  }
                >
                  Complete a starti
                  orientation first.
                </div>
              ) : null}
            </>
          )}
        </div>
      )}
    </div>
  )
}

