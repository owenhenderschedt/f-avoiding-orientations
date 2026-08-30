import {
  getCaseGroupsForDegree,
} from '../../cases/playgroundCases'
import {
  warehouseDegrees,
} from '../config'
import type {
  WarehouseCaseRecord,
  WarehouseDegree,
} from '../types'
import {
  reverseForbiddenSet,
  sameForbiddenSet,
} from '../utils/forbiddenSet'
import {
  getGeneratedPreferredRecipe,
} from './generated'
import {
  getPreferredOverride,
} from './preferredOverrides'

/*
 * Phase 3 source of truth for WHICH cases
 * exist in the Warehouse.
 *
 * The case generator determines the
 * reversal classes.  The audit-generated
 * data determines the preferred proof
 * orientation inside each class.
 *
 * This matters because the audit may find a
 * direct proof for d-F even when F is the
 * canonical stored representative.  We
 * therefore display the member on which the
 * preferred recipe was ACTUALLY proved.
 */
function buildDegreeCases(
  degree:
    WarehouseDegree,
): WarehouseCaseRecord[] {
  const groups =
    getCaseGroupsForDegree(
      degree,
    )

  return groups.map(
    (group) => {
      const canonical =
        group.options[0]
          .forbiddenSet

      const canonicalReversal =
        group.options[1]
          ?.forbiddenSet ??
        reverseForbiddenSet(
          degree,
          canonical,
        )

      const generatedRecipe =
        getGeneratedPreferredRecipe({
          degree,

          caseId:
            group.id,
        })

      const preferredRecipe =
        getPreferredOverride(
          group.id,
        ) ??
        generatedRecipe

      const recipeForbiddenSet =
        preferredRecipe
          ?.forbiddenSet ??
        null

      const recipeUsesReversal =
        recipeForbiddenSet !==
          null &&
        sameForbiddenSet(
          recipeForbiddenSet,
          canonicalReversal,
        ) &&
        !sameForbiddenSet(
          canonical,
          canonicalReversal,
        )

      const representative =
        recipeUsesReversal
          ? canonicalReversal
          : canonical

      const reversal =
        recipeUsesReversal
          ? canonical
          : canonicalReversal

      return {
        id:
          group.id,

        degree,

        forbiddenSet: [
          ...representative,
        ],

        reversal: [
          ...reversal,
        ],

        selfReversing:
          sameForbiddenSet(
            representative,
            reversal,
          ),

        preferredRecipeId:
          preferredRecipe
            ?.id ??
          null,

        preferredRecipe,
      }
    },
  )
}

const casesByDegree =
  new Map<
    WarehouseDegree,
    readonly WarehouseCaseRecord[]
  >(
    warehouseDegrees.map(
      (degree) => [
        degree,
        buildDegreeCases(
          degree,
        ),
      ],
    ),
  )

export function getWarehouseCasesForDegree(
  degree:
    WarehouseDegree,
) {
  return (
    casesByDegree.get(
      degree,
    ) ?? []
  )
}

export function getWarehouseCaseCount(
  degree:
    WarehouseDegree,
) {
  return getWarehouseCasesForDegree(
    degree,
  ).length
}
