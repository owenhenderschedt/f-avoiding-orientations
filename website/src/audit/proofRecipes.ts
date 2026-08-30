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
        'parity-bounds'

      normalLower:
        number

      normalUpper:
        number

      exceptionalLower:
        number

      exceptionalUpper:
        number
    }
  | {
      /*
       * After one or more cyclically
       * oriented spanning 2-factors have
       * been removed, the remaining graph
       * is a fresh smaller regular graph.
       *
       * This step records a certified proof
       * of that residual instance.
       */
      type:
        'lower-degree-certificate'

      residualDegree:
        number

      residualForbiddenSet:
        readonly number[]

      /*
       * Number of already-fixed outgoing
       * edges contributed by the removed
       * 2-factors.
       */
      fixedOutdegreeContribution:
        number

      /*
       * true means the stored residual
       * recipe certifies
       *
       *     residualDegree - residualForbiddenSet
       *
       * and the residual orientation is
       * reversed before lifting it back to
       * the original graph.
       */
      reversed:
        boolean

      recipe:
        AuditProofRecipe
    }

  /*
   * Legacy audit-only recipe variants.
   * proofSearch does not generate these.
   */
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

      qs:
        readonly number[]
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

      qs:
        readonly number[]

      repairedOutdegrees:
        readonly number[]
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

type AuditSearchStatistics = {
  expandedStates:
    number

  generatedStates:
    number
}

export type AuditCaseResult =
  | (
      {
        status:
          'proved'

        degree:
          number

        forbiddenSet:
          readonly number[]

        recipe:
          AuditProofRecipe
      } &
      AuditSearchStatistics
    )
  | (
      {
        status:
          'unresolved'

        /*
         * exhausted:
         *   every reachable encoded state
         *   was searched and no proof was
         *   found.
         *
         * search-limit:
         *   the frontier was still nonempty
         *   when the expansion budget was
         *   reached.
         */
        reason:
          | 'exhausted'
          | 'search-limit'

        degree:
          number

        forbiddenSet:
          readonly number[]
      } &
      AuditSearchStatistics
    )

export type AuditDegreeResult = {
  degree:
    number

  totalCases:
    number

  provedCases:
    number

  /*
   * Genuine exhaustive failures.
   */
  unresolvedCases:
    number

  /*
   * Not a mathematical failure: the
   * search budget was reached.
   */
  searchLimitedCases:
    number

  uncertifiedCases:
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
