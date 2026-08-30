import type {
  ForbiddenSetFilterState,
} from '../../components/ForbiddenSetFilter'
import type {
  WarehouseCaseRecord,
} from '../types'

export function hasConsecutiveValues(
  forbiddenSet:
    readonly number[],
) {
  return forbiddenSet.some(
    (value) =>
      forbiddenSet.includes(
        value + 1,
      ),
  )
}

export function forbiddenSetMatchesWarehouseFilter(
  forbiddenSet:
    readonly number[],

  filter:
    ForbiddenSetFilterState,
) {
  const includesEverything =
    filter.mustInclude.every(
      (value) =>
        forbiddenSet.includes(
          value,
        ),
    )

  const excludesEverything =
    filter.mustExclude.every(
      (value) =>
        !forbiddenSet.includes(
          value,
        ),
    )

  const passesMaLuFilter =
    !filter.hideMaLuCases ||
    hasConsecutiveValues(
      forbiddenSet,
    )

  return (
    includesEverything &&
    excludesEverything &&
    passesMaLuFilter
  )
}

/*
 * The Warehouse has one card per reversal
 * class.
 *
 * Unlike the earlier atlas prototype, this
 * function NEVER swaps the displayed member
 * merely because the opposite member is the
 * one matching a filter.  Once proof data is
 * attached, the displayed member is chosen
 * to be the member on which the preferred
 * recipe is literally valid.
 *
 * Individual-list mode therefore keeps the
 * class if either member matches.
 *
 * Entire-pair mode keeps it only if both
 * members match.
 */
export function filterWarehouseCases(
  cases:
    readonly WarehouseCaseRecord[],

  filter:
    ForbiddenSetFilterState,
): WarehouseCaseRecord[] {
  return cases.filter(
    (warehouseCase) => {
      const primaryMatches =
        forbiddenSetMatchesWarehouseFilter(
          warehouseCase
            .forbiddenSet,

          filter,
        )

      if (
        warehouseCase
          .selfReversing
      ) {
        return primaryMatches
      }

      const reversalMatches =
        forbiddenSetMatchesWarehouseFilter(
          warehouseCase
            .reversal,

          filter,
        )

      if (
        filter.matchMode ===
          'pair'
      ) {
        return (
          primaryMatches &&
          reversalMatches
        )
      }

      return (
        primaryMatches ||
        reversalMatches
      )
    },
  )
}
