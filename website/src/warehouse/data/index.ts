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
 * This intentionally reuses the canonical
 * reversal classes already used by the
 * playground and completeness audit.
 *
 * Proof DATA is attached separately:
 *
 *   generated audit recipe
 *       ↓
 *   optional human preferred override
 *
 * The Warehouse never reruns the audit just
 * because a user opens this page.
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
      const representative =
        group.options[0]
          .forbiddenSet

      const reversal =
        group.options[1]
          ?.forbiddenSet ??
        reverseForbiddenSet(
          degree,
          representative,
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
