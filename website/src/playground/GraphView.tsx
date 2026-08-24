import type {
  LovaszPair,
} from '../tools/lovaszPartition'
import type {
  AcrossDirection,
} from '../tools/orientAcrossPartition'
import type {
  BalancedTarget,
} from '../tools/balancedOrientation'
import type {
  AvoidCTarget,
} from '../tools/avoidC'
import type {
  MaLuApplication,
} from '../tools/maLuApplication'
import type {
  HasanvandApplication,
} from '../tools/hasanvandApplication'
import type {
  ParityBoundsApplication,
} from '../tools/parityBoundsApplication'
import type {
  StabilizeOutdegreeClassApplication,
} from '../tools/stabilizeOutdegreeClassApplication'
import type {
  DirectedMengerApplication,
} from '../tools/directedMengerApplication'
import type {
  DirectedMengerReservoirApplication,
} from '../tools/directedMengerReservoirApplication'
import {
  allOutdegrees,
  type PartOutdegreePossibilities,
} from './outdegreePossibilities'
import InitialGraphView from './InitialGraphView'
import PartitionGraphView from './PartitionGraphView'

type GraphViewProps = {
  degree:
    number

  workingDegree:
    number

  fixedOutdegreeContribution:
    number

  orientedTwoFactorCount:
    number

  forbiddenSet:
    readonly number[]

  partition:
    LovaszPair | null

  acrossDirection:
    AcrossDirection | null

  balancedG:
    boolean

  balancedL:
    boolean

  balancedR:
    boolean

  avoidCG:
    number | null

  avoidCL:
    number | null

  avoidCR:
    number | null

  maLuApplicationG:
    MaLuApplication | null

  maLuApplicationL:
    MaLuApplication | null

  maLuApplicationR:
    MaLuApplication | null

  hasanvandApplicationG:
    HasanvandApplication | null

  hasanvandApplicationL:
    HasanvandApplication | null

  hasanvandApplicationR:
    HasanvandApplication | null

  parityBoundsApplicationG?:
    ParityBoundsApplication | null

  stabilizeOutdegreeClassApplication:
    StabilizeOutdegreeClassApplication | null

  directedMengerApplication:
    DirectedMengerApplication | null

  directedMengerReservoirApplication?:
    DirectedMengerReservoirApplication | null

  outdegreeGuarantees?:
    PartOutdegreePossibilities

  onOpenLovaszReference:
    () => void

  onOpenBalancedReference:
    (
      target:
        BalancedTarget,
    ) => void

  onOpenAvoidCReference:
    (
      target:
        AvoidCTarget,

      c:
        number,
    ) => void

  onOpenMaLuReference:
    (
      application:
        MaLuApplication,
    ) => void

  onOpenHasanvandReference:
    (
      application:
        HasanvandApplication,
    ) => void

  onOpenParityBoundsReference?:
    (
      application:
        ParityBoundsApplication,
    ) => void

  onOpenStabilizeOutdegreeClassReference:
    (
      application:
        StabilizeOutdegreeClassApplication,
    ) => void

  onOpenDirectedMengerReference:
    (
      application:
        DirectedMengerApplication,
    ) => void

  onOpenDirectedMengerReservoirReference?:
    (
      application:
        DirectedMengerReservoirApplication,
    ) => void

  onOpenTwoFactorReference:
    () => void
}

export default function GraphView({
  degree,
  workingDegree,
  fixedOutdegreeContribution,
  orientedTwoFactorCount,
  forbiddenSet,
  partition,
  acrossDirection,
  balancedG,
  balancedL,
  balancedR,
  avoidCG,
  avoidCL,
  avoidCR,
  maLuApplicationG,
  maLuApplicationL,
  maLuApplicationR,
  hasanvandApplicationG,
  hasanvandApplicationL,
  hasanvandApplicationR,
  parityBoundsApplicationG = null,
  stabilizeOutdegreeClassApplication,
  directedMengerApplication,
  directedMengerReservoirApplication = null,
  outdegreeGuarantees,
  onOpenLovaszReference,
  onOpenBalancedReference,
  onOpenAvoidCReference,
  onOpenMaLuReference,
  onOpenHasanvandReference,
  onOpenParityBoundsReference,
  onOpenStabilizeOutdegreeClassReference,
  onOpenDirectedMengerReference,
  onOpenDirectedMengerReservoirReference,
  onOpenTwoFactorReference,
}: GraphViewProps) {
  const allPossible =
    allOutdegrees(
      degree,
    )

  const possibleOutdegreesL =
    outdegreeGuarantees
      ?.L ??
    allPossible

  const possibleOutdegreesR =
    outdegreeGuarantees
      ?.R ??
    allPossible

  const possibleOutdegreesG =
    Array.from(
      new Set([
        ...possibleOutdegreesL,
        ...possibleOutdegreesR,
      ]),
    ).sort(
      (a, b) =>
        a - b,
    )

  if (
    partition ===
    null
  ) {
    return (
      <InitialGraphView
        degree={
          degree
        }
        workingDegree={
          workingDegree
        }
        fixedOutdegreeContribution={
          fixedOutdegreeContribution
        }
        orientedTwoFactorCount={
          orientedTwoFactorCount
        }
        forbiddenSet={
          forbiddenSet
        }
        balancedG={
          balancedG
        }
        avoidCG={
          avoidCG
        }
        maLuApplicationG={
          maLuApplicationG
        }
        hasanvandApplicationG={
          hasanvandApplicationG
        }
        parityBoundsApplicationG={
          parityBoundsApplicationG
        }
        stabilizeOutdegreeClassApplication={
          stabilizeOutdegreeClassApplication
        }
        directedMengerApplication={
          directedMengerApplication
        }
        possibleOutdegrees={
          possibleOutdegreesG
        }
        onOpenBalancedReference={
          onOpenBalancedReference
        }
        onOpenAvoidCReference={
          onOpenAvoidCReference
        }
        onOpenMaLuReference={
          onOpenMaLuReference
        }
        onOpenHasanvandReference={
          onOpenHasanvandReference
        }
        onOpenParityBoundsReference={
          onOpenParityBoundsReference
        }
        onOpenStabilizeOutdegreeClassReference={
          onOpenStabilizeOutdegreeClassReference
        }
        onOpenDirectedMengerReference={
          onOpenDirectedMengerReference
        }
        onOpenTwoFactorReference={
          onOpenTwoFactorReference
        }
      />
    )
  }

  return (
    <PartitionGraphView
      workingDegree={
        workingDegree
      }
      fixedOutdegreeContribution={
        fixedOutdegreeContribution
      }
      orientedTwoFactorCount={
        orientedTwoFactorCount
      }
      forbiddenSet={
        forbiddenSet
      }
      partition={
        partition
      }
      acrossDirection={
        acrossDirection
      }
      balancedL={
        balancedL
      }
      balancedR={
        balancedR
      }
      avoidCL={
        avoidCL
      }
      avoidCR={
        avoidCR
      }
      maLuApplicationL={
        maLuApplicationL
      }
      maLuApplicationR={
        maLuApplicationR
      }
      hasanvandApplicationL={
        hasanvandApplicationL
      }
      hasanvandApplicationR={
        hasanvandApplicationR
      }
      stabilizeOutdegreeClassApplication={
        stabilizeOutdegreeClassApplication
      }
      directedMengerApplication={
        directedMengerApplication
      }
      directedMengerReservoirApplication={
        directedMengerReservoirApplication
      }
      possibleOutdegreesL={
        possibleOutdegreesL
      }
      possibleOutdegreesR={
        possibleOutdegreesR
      }
      onOpenLovaszReference={
        onOpenLovaszReference
      }
      onOpenBalancedReference={
        onOpenBalancedReference
      }
      onOpenAvoidCReference={
        onOpenAvoidCReference
      }
      onOpenMaLuReference={
        onOpenMaLuReference
      }
      onOpenHasanvandReference={
        onOpenHasanvandReference
      }
      onOpenStabilizeOutdegreeClassReference={
        onOpenStabilizeOutdegreeClassReference
      }
      onOpenDirectedMengerReference={
        onOpenDirectedMengerReference
      }
      onOpenDirectedMengerReservoirReference={
        onOpenDirectedMengerReservoirReference
      }
      onOpenTwoFactorReference={
        onOpenTwoFactorReference
      }
    />
  )
}