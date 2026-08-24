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

/*
 * A proof recipe is deliberately smaller
 * than PlaygroundMove.
 *
 * The playground stores full theorem
 * applications and certificates.
 *
 * The audit only needs enough information
 * to reconstruct and display the sequence
 * of mathematical moves that proved the
 * case.
 */

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
        'oriented-two-factor'
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

/*
 * A successful audit result.
 *
 * We store the actual forbidden set rather
 * than only an ID such as "34689", so the
 * audit engine remains degree-independent.
 */
export type AuditProofRecipe = {
  degree:
    number

  forbiddenSet:
    readonly number[]

  steps:
    readonly AuditProofStep[]

  /*
   * Final possible total outdegrees after
   * the proof recipe has been executed.
   *
   * Keeping these makes the result itself
   * easy to verify:
   *
   *   finalOutdegrees ∩ F = empty.
   */
  finalOutdegreesL:
    readonly number[]

  finalOutdegreesR:
    readonly number[]
}

/*
 * The result for one forbidden set.
 */
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

/*
 * Result of auditing an entire degree.
 *
 * elapsedMs records the actual runtime of
 * the census. The UI can decide whether to
 * display it in milliseconds or seconds.
 *
 * For example:
 *
 *   651 / 651 proved · completed in 0.42 s
 */
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

/*
 * Basic helpers used both by the search
 * engine and later by the UI.
 */

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