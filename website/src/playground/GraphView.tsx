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
  HasanvandParameters,
} from '../tools/hasanvandCompression'
import type {
  MaLuApplication,
} from '../tools/maLuApplication'
import type {
  AcrossDirection,
  AcrossOutdegreeGuarantees,
} from '../tools/orientAcrossPartition'

type GraphViewProps = {
  degree: number
  workingDegree: number
  fixedOutdegreeContribution: number
  orientedTwoFactorCount: number

  forbiddenSet: readonly number[]
  partition: LovaszPair | null
  acrossDirection: AcrossDirection | null

  balancedG: boolean
  balancedL: boolean
  balancedR: boolean

  avoidCG: number | null
  avoidCL: number | null
  avoidCR: number | null

  /*
   * Optional only during this one
   * plumbing step. BlobLab will supply
   * these in the next step.
   */
  maLuApplicationG?:
    MaLuApplication | null

  maLuApplicationL?:
    MaLuApplication | null

  maLuApplicationR?:
    MaLuApplication | null

  hasanvandG:
    HasanvandParameters | null

  outdegreeGuarantees:
    AcrossOutdegreeGuarantees | null

  onOpenLovaszReference: () => void

  onOpenBalancedReference: (
    target: BalancedTarget,
  ) => void

  onOpenAvoidCReference: (
    target: AvoidCTarget,
    c: number,
  ) => void

  onOpenMaLuReference?: (
    application: MaLuApplication,
  ) => void

  onOpenTwoFactorReference: () => void

  onOpenHasanvandReference: () => void
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
  hasanvandG,
  outdegreeGuarantees,
  onOpenLovaszReference,
  onOpenBalancedReference,
  onOpenAvoidCReference,
  onOpenMaLuReference,
  onOpenTwoFactorReference,
  onOpenHasanvandReference,
}: GraphViewProps) {
  const allPossible =
    allOutdegrees(degree)

  const possibleOutdegreesL =
    outdegreeGuarantees?.L ??
    allPossible

  const possibleOutdegreesR =
    outdegreeGuarantees?.R ??
    allPossible

  /*
   * Temporary safe fallback until
   * BlobLab wires the real right-panel
   * callback in the next step.
   */
  const openMaLuReference =
    onOpenMaLuReference ??
    (() => {})

  if (partition === null) {
    return (
      <InitialGraphView
        degree={degree}
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
        hasanvandG={
          hasanvandG
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
        onOpenTwoFactorReference={
          onOpenTwoFactorReference
        }
        onOpenHasanvandReference={
          onOpenHasanvandReference
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
      onOpenTwoFactorReference={
        onOpenTwoFactorReference
      }
    />
  )
}