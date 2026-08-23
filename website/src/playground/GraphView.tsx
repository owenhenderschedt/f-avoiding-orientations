import InitialGraphView from './InitialGraphView'
import PartitionGraphView from './PartitionGraphView'
import {
  allOutdegrees,
} from './outdegreePossibilities'
import type {
  LovaszPair,
} from '../tools/lovaszPartition'
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
  DirectedMengerApplication,
} from '../tools/directedMengerApplication'
import type {
  AcrossDirection,
  AcrossOutdegreeGuarantees,
} from '../tools/orientAcrossPartition'

type GraphViewProps = {
  degree: number

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

  balancedG: boolean
  balancedL: boolean
  balancedR: boolean

  avoidCG:
    number | null

  avoidCL:
    number | null

  avoidCR:
    number | null

  maLuApplicationG?:
    MaLuApplication | null

  maLuApplicationL?:
    MaLuApplication | null

  maLuApplicationR?:
    MaLuApplication | null

  hasanvandApplicationG?:
    HasanvandApplication | null

  hasanvandApplicationL?:
    HasanvandApplication | null

  hasanvandApplicationR?:
    HasanvandApplication | null

  directedMengerApplication?:
    DirectedMengerApplication | null

  outdegreeGuarantees:
    AcrossOutdegreeGuarantees | null

  onOpenLovaszReference:
    () => void

  onOpenBalancedReference: (
    target:
      BalancedTarget,
  ) => void

  onOpenAvoidCReference: (
    target:
      AvoidCTarget,
    c: number,
  ) => void

  onOpenMaLuReference?: (
    application:
      MaLuApplication,
  ) => void

  onOpenHasanvandReference?: (
    application:
      HasanvandApplication,
  ) => void

  onOpenDirectedMengerReference?: (
    application:
      DirectedMengerApplication,
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
  maLuApplicationG = null,
  maLuApplicationL = null,
  maLuApplicationR = null,
  hasanvandApplicationG = null,
  hasanvandApplicationL = null,
  hasanvandApplicationR = null,
  directedMengerApplication = null,
  outdegreeGuarantees,
  onOpenLovaszReference,
  onOpenBalancedReference,
  onOpenAvoidCReference,
  onOpenMaLuReference,
  onOpenHasanvandReference,
  onOpenDirectedMengerReference,
  onOpenTwoFactorReference,
}: GraphViewProps) {
  const allPossible =
    allOutdegrees(
      degree,
    )

  const possibleOutdegreesL =
    outdegreeGuarantees?.L ??
    allPossible

  const possibleOutdegreesR =
    outdegreeGuarantees?.R ??
    allPossible

  const openMaLuReference =
    onOpenMaLuReference ??
    (() => {})

  const openHasanvandReference =
    onOpenHasanvandReference ??
    (() => {})

  const openDirectedMengerReference =
    onOpenDirectedMengerReference ??
    (() => {})

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
        possibleOutdegrees={
          possibleOutdegreesL
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
        onOpenBalancedReference={
          onOpenBalancedReference
        }
        onOpenAvoidCReference={
          onOpenAvoidCReference
        }
        onOpenMaLuReference={
          openMaLuReference
        }
        onOpenHasanvandReference={
          openHasanvandReference
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
      directedMengerApplication={
        directedMengerApplication
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
        openMaLuReference
      }
      onOpenHasanvandReference={
        openHasanvandReference
      }
      onOpenDirectedMengerReference={
        openDirectedMengerReference
      }
      onOpenTwoFactorReference={
        onOpenTwoFactorReference
      }
    />
  )
}