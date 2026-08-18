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
  HasanvandParameters,
} from '../tools/hasanvandCompression'
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

  hasanvandG:
    HasanvandParameters | null

  outdegreeGuarantees:
    AcrossOutdegreeGuarantees | null

  onOpenLovaszReference: () => void

  onOpenBalancedReference: (
    target: BalancedTarget,
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
  hasanvandG,
  outdegreeGuarantees,
  onOpenLovaszReference,
  onOpenBalancedReference,
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
        hasanvandG={
          hasanvandG
        }
        onOpenBalancedReference={
          onOpenBalancedReference
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
      onOpenTwoFactorReference={
        onOpenTwoFactorReference
      }
    />
  )
}