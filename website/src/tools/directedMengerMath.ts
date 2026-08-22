/*
 * Pure mathematics for the directed
 * Menger repair tool.
 *
 * This file contains no React and no
 * playground state.
 *
 * Basic directed-path move:
 *
 *   x ----directed path----> y
 *
 * Reversing the path changes only the
 * endpoint outdegrees:
 *
 *   d+(x) decreases by 1,
 *   d+(y) increases by 1.
 *
 * Internal vertices keep the same
 * outdegree.
 *
 * Therefore there are two symmetric
 * one-sided repair modes.
 *
 * INCREASE:
 *
 *   buffer ----path----> bad vertex
 *
 * The bad vertex gains outdegree and
 * the buffer vertex loses outdegree.
 *
 * DECREASE:
 *
 *   bad vertex ----path----> buffer
 *
 * The bad vertex loses outdegree and
 * the buffer vertex gains outdegree.
 */

export type MengerRepairDirection =
  | 'increase'
  | 'decrease'

export type MengerDemandRule = {
  /*
   * Current total outdegree of the
   * bad class being repaired.
   */
  outdegree: number

  /*
   * Exact amount by which the bad
   * outdegree must move.
   *
   * In increase mode:
   *
   *   q -> q + demand.
   *
   * In decrease mode:
   *
   *   q -> q - demand.
   */
  demand: number
}

export type MengerCapacityRule = {
  /*
   * Current total outdegree of a
   * buffer class.
   */
  outdegree: number

  /*
   * Maximum number of repair paths
   * that may use a vertex in this
   * class as the opposite endpoint.
   *
   * In increase mode the buffer loses
   * outdegree:
   *
   *   q, q-1, ..., q-capacity.
   *
   * In decrease mode the buffer gains
   * outdegree:
   *
   *   q, q+1, ..., q+capacity.
   */
  capacity: number
}

export type MengerEndpointSafetyCheck = {
  kind:
    | 'demand'
    | 'capacity'

  direction:
    MengerRepairDirection

  outdegree: number

  amount: number

  visitedOutdegrees: number[]

  passes: boolean
}

export type MengerAlphaLowerBound = {
  kind: 'demand'

  direction:
    MengerRepairDirection

  outdegree: number

  demand: number

  /*
   * Positive imbalance available at
   * a bad vertex in the chosen repair
   * direction.
   *
   * Increase:
   *
   *   d - 2q.
   *
   * Decrease:
   *
   *   2q - d.
   */
  imbalance: number

  /*
   * alpha >= bound.
   */
  bound: number

  valid: boolean
}

export type MengerAlphaUpperBound = {
  kind: 'capacity'

  direction:
    MengerRepairDirection

  outdegree: number

  capacity: number

  /*
   * Positive imbalance opposing the
   * chosen repair direction.
   *
   * Increase:
   *
   *   2q - d.
   *
   * Decrease:
   *
   *   d - 2q.
   */
  imbalance: number

  /*
   * alpha <= bound.
   */
  bound: number

  valid: boolean
}

export type DirectedMengerAlphaCertificate = {
  degree: number

  direction:
    MengerRepairDirection

  demandBounds:
    MengerAlphaLowerBound[]

  capacityBounds:
    MengerAlphaUpperBound[]

  lowerBound: number

  upperBound: number

  applicable: boolean
}

export type DirectedMengerRepairCertificate = {
  degree: number

  direction:
    MengerRepairDirection

  currentOutdegrees: number[]

  demandRules:
    MengerDemandRule[]

  capacityRules:
    MengerCapacityRule[]

  rolesValid: boolean

  badOutdegrees: number[]

  uncoveredBadOutdegrees:
    number[]

  coversAllBadClasses: boolean

  endpointChecks:
    MengerEndpointSafetyCheck[]

  endpointSafe: boolean

  alphaCertificate:
    DirectedMengerAlphaCertificate

  applicable: boolean
}

function uniqueSorted(
  values: readonly number[],
) {
  return Array.from(
    new Set(values),
  ).sort(
    (a, b) =>
      a - b,
  )
}

function isIntegerInDegreeRange(
  value: number,
  degree: number,
) {
  return (
    Number.isInteger(
      value,
    ) &&
    value >= 0 &&
    value <= degree
  )
}

function isPositiveInteger(
  value: number,
) {
  return (
    Number.isInteger(
      value,
    ) &&
    value > 0
  )
}

function isNonnegativeInteger(
  value: number,
) {
  return (
    Number.isInteger(
      value,
    ) &&
    value >= 0
  )
}

function getDirectionStep(
  direction:
    MengerRepairDirection,
) {
  return direction ===
    'increase'
    ? 1
    : -1
}

function getDemandImbalance({
  degree,
  outdegree,
  direction,
}: {
  degree: number
  outdegree: number
  direction:
    MengerRepairDirection
}) {
  /*
   * Increase uses
   *
   *   d^- - d^+
   *   =
   *   d - 2q.
   *
   * Decrease uses
   *
   *   d^+ - d^-
   *   =
   *   2q - d.
   */
  return direction ===
    'increase'
    ? degree -
        2 * outdegree
    : 2 * outdegree -
        degree
}

function getCapacityImbalance({
  degree,
  outdegree,
  direction,
}: {
  degree: number
  outdegree: number
  direction:
    MengerRepairDirection
}) {
  /*
   * This is the positive quantity
   * appearing when a capacity class
   * creates an upper bound on alpha.
   *
   * It is exactly the negative of the
   * demand imbalance.
   */
  return -getDemandImbalance({
    degree,
    outdegree,
    direction,
  })
}

function rulesUseDistinctClasses(
  demandRules:
    readonly MengerDemandRule[],

  capacityRules:
    readonly MengerCapacityRule[],
) {
  const demandClasses =
    demandRules.map(
      (rule) =>
        rule.outdegree,
    )

  const capacityClasses =
    capacityRules.map(
      (rule) =>
        rule.outdegree,
    )

  const demandSet =
    new Set(
      demandClasses,
    )

  const capacitySet =
    new Set(
      capacityClasses,
    )

  if (
    demandSet.size !==
    demandClasses.length
  ) {
    return false
  }

  if (
    capacitySet.size !==
    capacityClasses.length
  ) {
    return false
  }

  return demandClasses.every(
    (value) =>
      !capacitySet.has(
        value,
      ),
  )
}

export function getDemandFinalOutdegree({
  outdegree,
  demand,
  direction = 'increase',
}: {
  outdegree: number
  demand: number

  direction?:
    MengerRepairDirection
}) {
  return (
    outdegree +
    getDirectionStep(
      direction,
    ) *
      demand
  )
}

export function getDemandVisitedOutdegrees(
  outdegree: number,
  demand: number,
  direction:
    MengerRepairDirection =
      'increase',
) {
  const values:
    number[] = []

  const step =
    getDirectionStep(
      direction,
    )

  for (
    let amount = 0;
    amount <= demand;
    amount += 1
  ) {
    values.push(
      outdegree +
        step *
          amount,
    )
  }

  return values
}

export function getCapacityVisitedOutdegrees(
  outdegree: number,
  capacity: number,
  direction:
    MengerRepairDirection =
      'increase',
) {
  const values:
    number[] = []

  /*
   * Capacity vertices move in the
   * opposite direction from demand
   * vertices.
   *
   * Increase repair:
   *
   *   q -> q-j.
   *
   * Decrease repair:
   *
   *   q -> q+j.
   */
  const step =
    -getDirectionStep(
      direction,
    )

  for (
    let amount = 0;
    amount <= capacity;
    amount += 1
  ) {
    values.push(
      outdegree +
        step *
          amount,
    )
  }

  return values
}

export function getDemandEndpointSafetyCheck({
  degree,
  forbiddenSet,
  rule,
  direction = 'increase',
}: {
  degree: number

  forbiddenSet:
    readonly number[]

  rule:
    MengerDemandRule

  direction?:
    MengerRepairDirection
}): MengerEndpointSafetyCheck {
  const visitedOutdegrees =
    getDemandVisitedOutdegrees(
      rule.outdegree,
      rule.demand,
      direction,
    )

  const finalOutdegree =
    getDemandFinalOutdegree({
      outdegree:
        rule.outdegree,

      demand:
        rule.demand,

      direction,
    })

  /*
   * The starting value is allowed to
   * be forbidden: that is precisely
   * why it belongs to the bad set.
   *
   * The demand is exact, so only the
   * final value needs to be F-safe.
   */
  const passes =
    isIntegerInDegreeRange(
      rule.outdegree,
      degree,
    ) &&
    isPositiveInteger(
      rule.demand,
    ) &&
    isIntegerInDegreeRange(
      finalOutdegree,
      degree,
    ) &&
    !forbiddenSet.includes(
      finalOutdegree,
    )

  return {
    kind:
      'demand',

    direction,

    outdegree:
      rule.outdegree,

    amount:
      rule.demand,

    visitedOutdegrees,

    passes,
  }
}

export function getCapacityEndpointSafetyCheck({
  degree,
  forbiddenSet,
  rule,
  direction = 'increase',
}: {
  degree: number

  forbiddenSet:
    readonly number[]

  rule:
    MengerCapacityRule

  direction?:
    MengerRepairDirection
}): MengerEndpointSafetyCheck {
  const visitedOutdegrees =
    getCapacityVisitedOutdegrees(
      rule.outdegree,
      rule.capacity,
      direction,
    )

  /*
   * A capacity vertex may actually be
   * used 0,1,...,capacity times.
   *
   * Thus every possible resulting
   * outdegree must be F-safe,
   * including the current value
   * corresponding to zero uses.
   */
  const passes =
    isIntegerInDegreeRange(
      rule.outdegree,
      degree,
    ) &&
    isNonnegativeInteger(
      rule.capacity,
    ) &&
    visitedOutdegrees.every(
      (value) =>
        isIntegerInDegreeRange(
          value,
          degree,
        ) &&
        !forbiddenSet.includes(
          value,
        ),
    )

  return {
    kind:
      'capacity',

    direction,

    outdegree:
      rule.outdegree,

    amount:
      rule.capacity,

    visitedOutdegrees,

    passes,
  }
}

function getEffectiveCapacityRules({
  currentOutdegrees,
  demandRules,
  capacityRules,
}: {
  currentOutdegrees:
    readonly number[]

  demandRules:
    readonly MengerDemandRule[]

  capacityRules:
    readonly MengerCapacityRule[]
}) {
  const demandClasses =
    new Set(
      demandRules.map(
        (rule) =>
          rule.outdegree,
      ),
    )

  const capacityMap =
    new Map(
      capacityRules.map(
        (rule) => [
          rule.outdegree,
          rule.capacity,
        ],
      ),
    )

  /*
   * The repair theorem assigns a
   * capacity c(v) to every vertex
   * outside the bad set.
   *
   * Any class not explicitly given a
   * capacity is interpreted as
   * capacity zero.
   */
  return currentOutdegrees
    .filter(
      (outdegree) =>
        !demandClasses.has(
          outdegree,
        ),
    )
    .map(
      (outdegree) => ({
        outdegree,

        capacity:
          capacityMap.get(
            outdegree,
          ) ??
          0,
      }),
    )
}

export function getMengerAlphaCertificate({
  degree,
  currentOutdegrees,
  demandRules,
  capacityRules,
  direction = 'increase',
}: {
  degree: number

  currentOutdegrees:
    readonly number[]

  demandRules:
    readonly MengerDemandRule[]

  capacityRules:
    readonly MengerCapacityRule[]

  direction?:
    MengerRepairDirection
}): DirectedMengerAlphaCertificate {
  const demandBounds =
    demandRules.map(
      (
        rule,
      ): MengerAlphaLowerBound => {
        /*
         * INCREASE:
         *
         *   r
         *   <=
         *   alpha(d-2q).
         *
         * DECREASE:
         *
         *   r
         *   <=
         *   alpha(2q-d).
         */
        const imbalance =
          getDemandImbalance({
            degree,

            outdegree:
              rule.outdegree,

            direction,
          })

        const valid =
          isIntegerInDegreeRange(
            rule.outdegree,
            degree,
          ) &&
          isPositiveInteger(
            rule.demand,
          ) &&
          imbalance > 0

        const bound =
          valid
            ? rule.demand /
              imbalance
            : Number
                .POSITIVE_INFINITY

        return {
          kind:
            'demand',

          direction,

          outdegree:
            rule.outdegree,

          demand:
            rule.demand,

          imbalance,

          bound,

          valid,
        }
      },
    )

  const effectiveCapacityRules =
    getEffectiveCapacityRules({
      currentOutdegrees,

      demandRules,

      capacityRules,
    })

  /*
   * Every effective capacity rule
   * must itself be meaningful, even
   * when its local alpha inequality
   * is automatic.
   */
  const allCapacityRulesValid =
    effectiveCapacityRules.every(
      (rule) =>
        isIntegerInDegreeRange(
          rule.outdegree,
          degree,
        ) &&
        isNonnegativeInteger(
          rule.capacity,
        ),
    )

  /*
   * A capacity class gives an upper
   * bound only when its imbalance
   * points against the chosen repair
   * direction.
   *
   * INCREASE:
   *
   *   q > d/2
   *
   * gives
   *
   *   alpha <= c/(2q-d).
   *
   * DECREASE:
   *
   *   q < d/2
   *
   * gives
   *
   *   alpha <= c/(d-2q).
   *
   * On the other side of d/2, the
   * capacity inequality is automatic
   * for alpha >= 0.
   */
  const capacityBounds =
    effectiveCapacityRules
      .filter(
        (rule) =>
          getCapacityImbalance({
            degree,

            outdegree:
              rule.outdegree,

            direction,
          }) >
          0,
      )
      .map(
        (
          rule,
        ): MengerAlphaUpperBound => {
          const imbalance =
            getCapacityImbalance({
              degree,

              outdegree:
                rule.outdegree,

              direction,
            })

          const valid =
            isIntegerInDegreeRange(
              rule.outdegree,
              degree,
            ) &&
            isNonnegativeInteger(
              rule.capacity,
            ) &&
            imbalance > 0

          const bound =
            valid
              ? rule.capacity /
                imbalance
              : Number
                  .NEGATIVE_INFINITY

          return {
            kind:
              'capacity',

            direction,

            outdegree:
              rule.outdegree,

            capacity:
              rule.capacity,

            imbalance,

            bound,

            valid,
          }
        },
      )

  const allDemandRulesValid =
    demandBounds.every(
      (check) =>
        check.valid,
    )

  const allCapacityBoundsValid =
    capacityBounds.every(
      (check) =>
        check.valid,
    )

  const validDemandBounds =
    demandBounds
      .filter(
        (check) =>
          check.valid,
      )
      .map(
        (check) =>
          check.bound,
      )

  const validCapacityBounds =
    capacityBounds
      .filter(
        (check) =>
          check.valid,
      )
      .map(
        (check) =>
          check.bound,
      )

  const lowerBound =
    validDemandBounds.length ===
    0
      ? 0
      : globalThis.Math.max(
          ...validDemandBounds,
        )

  const upperBound =
    validCapacityBounds.length ===
    0
      ? 1
      : globalThis.Math.min(
          1,
          ...validCapacityBounds,
        )

  const applicable =
    demandRules.length > 0 &&
    allDemandRulesValid &&
    allCapacityRulesValid &&
    allCapacityBoundsValid &&
    lowerBound >= 0 &&
    lowerBound <= 1 &&
    upperBound >= 0 &&
    upperBound <= 1 &&
    lowerBound <=
      upperBound

  return {
    degree,

    direction,

    demandBounds,

    capacityBounds,

    lowerBound,

    upperBound,

    applicable,
  }
}

export function getDirectedMengerRepairCertificate({
  degree,
  forbiddenSet,
  currentOutdegrees,
  demandRules,
  capacityRules,
  direction = 'increase',
}: {
  degree: number

  forbiddenSet:
    readonly number[]

  currentOutdegrees:
    readonly number[]

  demandRules:
    readonly MengerDemandRule[]

  capacityRules:
    readonly MengerCapacityRule[]

  direction?:
    MengerRepairDirection
}): DirectedMengerRepairCertificate {
  const normalizedForbiddenSet =
    uniqueSorted(
      forbiddenSet,
    )

  const normalizedCurrentOutdegrees =
    uniqueSorted(
      currentOutdegrees,
    )

  const normalizedDemandRules =
    demandRules.map(
      (rule) => ({
        outdegree:
          rule.outdegree,

        demand:
          rule.demand,
      }),
    )

  const normalizedCapacityRules =
    capacityRules.map(
      (rule) => ({
        outdegree:
          rule.outdegree,

        capacity:
          rule.capacity,
      }),
    )

  const currentClassSet =
    new Set(
      normalizedCurrentOutdegrees,
    )

  const demandClassSet =
    new Set(
      normalizedDemandRules.map(
        (rule) =>
          rule.outdegree,
      ),
    )

  const rulesDistinct =
    rulesUseDistinctClasses(
      normalizedDemandRules,
      normalizedCapacityRules,
    )

  const allCurrentClassesValid =
    normalizedCurrentOutdegrees.every(
      (outdegree) =>
        isIntegerInDegreeRange(
          outdegree,
          degree,
        ),
    )

  const allRuleClassesCurrent =
    [
      ...normalizedDemandRules.map(
        (rule) =>
          rule.outdegree,
      ),

      ...normalizedCapacityRules.map(
        (rule) =>
          rule.outdegree,
      ),
    ].every(
      (outdegree) =>
        currentClassSet.has(
          outdegree,
        ),
    )

  /*
   * B is the set of vertices whose
   * CURRENT outdegree is forbidden.
   *
   * Therefore demand rules may only
   * be assigned to currently bad
   * classes.
   */
  const allDemandClassesBad =
    normalizedDemandRules.every(
      (rule) =>
        normalizedForbiddenSet.includes(
          rule.outdegree,
        ),
    )

  const rolesValid =
    rulesDistinct &&
    allCurrentClassesValid &&
    allRuleClassesCurrent &&
    allDemandClassesBad

  const badOutdegrees =
    normalizedCurrentOutdegrees.filter(
      (outdegree) =>
        normalizedForbiddenSet.includes(
          outdegree,
        ),
    )

  const uncoveredBadOutdegrees =
    badOutdegrees.filter(
      (outdegree) =>
        !demandClassSet.has(
          outdegree,
        ),
    )

  const coversAllBadClasses =
    uncoveredBadOutdegrees.length ===
    0

  const effectiveCapacityRules =
    getEffectiveCapacityRules({
      currentOutdegrees:
        normalizedCurrentOutdegrees,

      demandRules:
        normalizedDemandRules,

      capacityRules:
        normalizedCapacityRules,
    })

  const endpointChecks = [
    ...normalizedDemandRules.map(
      (rule) =>
        getDemandEndpointSafetyCheck({
          degree,

          forbiddenSet:
            normalizedForbiddenSet,

          rule,

          direction,
        }),
    ),

    ...effectiveCapacityRules.map(
      (rule) =>
        getCapacityEndpointSafetyCheck({
          degree,

          forbiddenSet:
            normalizedForbiddenSet,

          rule,

          direction,
        }),
    ),
  ]

  const endpointSafe =
    endpointChecks.every(
      (check) =>
        check.passes,
    )

  const alphaCertificate =
    getMengerAlphaCertificate({
      degree,

      currentOutdegrees:
        normalizedCurrentOutdegrees,

      demandRules:
        normalizedDemandRules,

      capacityRules:
        normalizedCapacityRules,

      direction,
    })

  return {
    degree,

    direction,

    currentOutdegrees:
      normalizedCurrentOutdegrees,

    demandRules:
      normalizedDemandRules,

    capacityRules:
      normalizedCapacityRules,

    rolesValid,

    badOutdegrees,

    uncoveredBadOutdegrees,

    coversAllBadClasses,

    endpointChecks,

    endpointSafe,

    alphaCertificate,

    applicable:
      rolesValid &&
      coversAllBadClasses &&
      endpointSafe &&
      alphaCertificate
        .applicable,
  }
}