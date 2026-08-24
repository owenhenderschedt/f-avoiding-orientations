import type {
  AcrossDirection,
} from '../tools/orientAcrossPartition'
import type {
  HasanvandDegreeRule,
  HasanvandMode,
  HasanvandTarget,
} from '../tools/hasanvandMath'
import type {
  MaLuApplicationMode,
} from '../tools/maLuApplication'
import type {
  MaLuTarget,
} from '../tools/maLuMath'
import type {
  StabilizeTarget,
} from '../tools/stabilizeOutdegreeClassMath'
import type {
  MengerCapacityRule,
  MengerDemandRule,
  MengerRepairDirection,
} from '../tools/directedMengerMath'

export type AuditProofStep =
  | {
      type:
        'lovasz-partition'

      s:
        number

      t:
        number
    }
  | {
      type:
        'orient-across'

      direction:
        AcrossDirection
    }
  | {
      type:
        'balance'

      target:
        'G' | 'L' | 'R'
    }
  | {
      type:
        'avoid-c'

      target:
        'G' | 'L' | 'R'

      c:
        number
    }
  | {
      type:
        'ma-lu'

      target:
        MaLuTarget

      mode:
        MaLuApplicationMode

      selectedValues:
        readonly number[]
    }
  | {
      type:
        'hasanvand'

      target:
        HasanvandTarget

      mode:
        HasanvandMode

      rules:
        readonly HasanvandDegreeRule[]
    }
  | {
      type:
        'bounded-degree-constructor'

      target:
        'G' | 'L' | 'R'

      theorem:
        'delta-5-0125'
        | 'delta-6-avoid-356'

      reversed:
        boolean
    }
  | {
      type:
        'oriented-two-factor'
    }
  | {
      type:
        'interval-reduction'

      mode:
        'p' | 'q'

      parameter:
        number
    }
  | {
      type:
        'stabilize-outdegree-class'

      target:
        StabilizeTarget

      q:
        number
    }
  | {
      type:
        'directed-menger-local'

      direction:
        MengerRepairDirection

      demandRules:
        readonly MengerDemandRule[]

      capacityRules:
        readonly MengerCapacityRule[]
    }
  | {
      type:
        'directed-menger-reservoir'

      q:
        number

      repairedOutdegree:
        number
    }

export type AuditProofRecipe = {
  degree:
    number

  forbiddenSet:
    readonly number[]

  steps:
    readonly AuditProofStep[]

  finalOutdegreesL:
    readonly number[]

  finalOutdegreesR:
    readonly number[]
}

export type AuditCaseResult =
  | {
      status:
        'proved'

      degree:
        number

      forbiddenSet:
        readonly number[]

      recipe:
        AuditProofRecipe
    }
  | {
      status:
        'unresolved'

      degree:
        number

      forbiddenSet:
        readonly number[]
    }

export type AuditDegreeResult = {
  degree:
    number

  totalCases:
    number

  provedCases:
    number

  unresolvedCases:
    number

  elapsedMs:
    number

  cases:
    readonly AuditCaseResult[]
}

export function uniqueSorted(
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

export function recipeLength(
  recipe:
    AuditProofRecipe,
) {
  return recipe
    .steps
    .length
}

export function isAuditCaseProved(
  result:
    AuditCaseResult,
): result is Extract<
  AuditCaseResult,
  {
    status:
      'proved'
  }
> {
  return (
    result.status ===
    'proved'
  )
}