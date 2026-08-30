import type {
  ForbiddenSetFilterState,
} from '../../components/ForbiddenSetFilter'
import type {
  WarehouseCaseRecord,
} from '../types'

/*
 * This matches the Playground's current
 * Ma--Lu filter semantics exactly:
 *
 * a forbidden list is a direct Ma--Lu case
 * when it contains no two consecutive
 * integers, so "hide Ma--Lu cases" keeps
 * only lists that DO contain a consecutive
 * pair.
 */
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
 * The Warehouse stores one record per
 * reversal class, but the shared filter bar
 * has the same two modes as the Playground.
 *
 * Individual-list mode:
 *   keep the reversal class when at least
 *   one member matches.
 *
 * Entire-pair mode:
 *   keep the reversal class only when every
 *   member matches.
 *
 * In individual-list mode, if only the
 * reversed member matches, we flip the
 * displayed representative.  This avoids
 * the confusing situation where a visible
 * card appears not to satisfy the filter
 * that produced it.
 */
export function filterWarehouseCases(
  cases:
    readonly WarehouseCaseRecord[],

  filter:
    ForbiddenSetFilterState,
): WarehouseCaseRecord[] {
  return cases.flatMap(
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
          ? [
              warehouseCase,
            ]
          : []
      }

      const reversalMatches =
        forbiddenSetMatchesWarehouseFilter(
          warehouseCase.reversal,

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
          ? [
              warehouseCase,
            ]
          : []
      }

      if (
        primaryMatches
      ) {
        return [
          warehouseCase,
        ]
      }

      if (
        reversalMatches
      ) {
        return [
          {
            ...warehouseCase,

            forbiddenSet: [
              ...warehouseCase
                .reversal,
            ],

            reversal: [
              ...warehouseCase
                .forbiddenSet,
            ],
          },
        ]
      }

      return []
    },
  )
}
