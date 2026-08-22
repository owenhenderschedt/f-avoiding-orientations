import type {
  DirectedMengerApplication,
} from '../tools/directedMengerApplication'

function uniqueSorted(
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

function getDemandRule(
  outdegree: number,

  application:
    DirectedMengerApplication,
) {
  return (
    application
      .demandRules
      .find(
        (rule) =>
          rule.outdegree ===
          outdegree,
      ) ??
    null
  )
}

function getCapacityRule(
  outdegree: number,

  application:
    DirectedMengerApplication,
) {
  return (
    application
      .capacityRules
      .find(
        (rule) =>
          rule.outdegree ===
          outdegree,
      ) ??
    null
  )
}

/*
 * Apply the endpoint consequences of
 * a certified directed-Menger repair
 * to one current set of possible TOTAL
 * outdegrees.
 *
 * Receiver class:
 *
 *   q -> q+r
 *
 * because each receiver gets exactly r
 * repair paths.
 *
 * Donor class:
 *
 *   q -> {q-c,...,q}
 *
 * because each donor may actually be
 * used any number of times from zero
 * through its capacity.
 *
 * Every other outdegree class remains
 * unchanged.
 */
export function getDirectedMengerRepairedOutdegrees({
  possibleOutdegrees,
  application,
}: {
  possibleOutdegrees:
    readonly number[]

  application:
    DirectedMengerApplication
}) {
  const result:
    number[] = []

  possibleOutdegrees.forEach(
    (outdegree) => {
      const demandRule =
        getDemandRule(
          outdegree,
          application,
        )

      if (
        demandRule !==
        null
      ) {
        result.push(
          outdegree +
            demandRule.demand,
        )

        return
      }

      const capacityRule =
        getCapacityRule(
          outdegree,
          application,
        )

      if (
        capacityRule !==
        null
      ) {
        for (
          let used = 0;
          used <=
          capacityRule.capacity;
          used += 1
        ) {
          result.push(
            outdegree -
              used,
          )
        }

        return
      }

      result.push(
        outdegree,
      )
    },
  )

  return uniqueSorted(
    result,
  )
}

/*
 * The Menger repair acts on the
 * orientation globally, but our
 * partition display remembers which
 * total outdegree classes could occur
 * on L and on R before the repair.
 *
 * Applying the same class rules to
 * each side therefore gives the new
 * displayed possibilities.
 */
export function getDirectedMengerRepairedPartOutdegrees({
  L,
  R,
  application,
}: {
  L:
    readonly number[]

  R:
    readonly number[]

  application:
    DirectedMengerApplication
}) {
  return {
    L:
      getDirectedMengerRepairedOutdegrees({
        possibleOutdegrees:
          L,

        application,
      }),

    R:
      getDirectedMengerRepairedOutdegrees({
        possibleOutdegrees:
          R,

        application,
      }),
  }
}