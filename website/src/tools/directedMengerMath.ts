/*
 * Pure mathematics for the directed
 * Menger repair tool.
 *
 * This file contains no React and no
 * playground state.
 *
 * Basic repair move:
 *
 *   donor ----directed path----> receiver
 *
 * Reversing the path decreases the
 * donor's outdegree by 1 and increases
 * the receiver's outdegree by 1.
 *
 * Internal vertices keep the same
 * outdegree.
 */

export type MengerDemandRule = {
  /*
   * Current total outdegree of the
   * receiver class.
   */
  outdegree: number

  /*
   * Exact number of repair paths that
   * must end at each vertex in this
   * class.
   *
   * Example:
   *
   *   1 -> 2
   *
   * has demand 1.
   */
  demand: number
}

export type MengerCapacityRule = {
  /*
   * Current total outdegree of the
   * donor class.
   */
  outdegree: number

  /*
   * Maximum number of repair paths
   * that may begin at a vertex in this
   * class.
   *
   * Example:
   *
   *   10 -> 9 -> 8 -> 7
   *
   * has capacity 3.
   */
  capacity: number
}

export type MengerEndpointSafetyCheck = {
  kind: 'demand' | 'capacity'

  outdegree: number

  amount: number

  visitedOutdegrees: number[]

  passes: boolean
}

export type MengerAlphaLowerBound = {
  kind: 'demand'

  outdegree: number

  demand: number

  /*
   * d - 2d^+(v).
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

  outdegree: number

  capacity: number

  /*
   * 2d^+(v) - d.
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
    (a, b) => a - b,
  )
}

function isIntegerInDegreeRange(
  value: number,
  degree: number,
) {
  return (
    Number.isInteger(value) &&
    value >= 0 &&
    value <= degree
  )
}

function isPositiveInteger(
  value: number,
) {
  return (
    Number.isInteger(value) &&
    value > 0
  )
}

function isNonnegativeInteger(
  value: number,
) {
  return (
    Number.isInteger(value) &&
    value >= 0
  )
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

export function getDemandVisitedOutdegrees(
  outdegree: number,
  demand: number,
) {
  const values:
    number[] = []

  for (
    let step = 0;
    step <= demand;
    step += 1
  ) {
    values.push(
      outdegree + step,
    )
  }

  return values
}

export function getCapacityVisitedOutdegrees(
  outdegree: number,
  capacity: number,
) {
  const values:
    number[] = []

  for (
    let step = 0;
    step <= capacity;
    step += 1
  ) {
    values.push(
      outdegree - step,
    )
  }

  return values
}

export function getDemandEndpointSafetyCheck({
  degree,
  forbiddenSet,
  rule,
}: {
  degree: number

  forbiddenSet:
    readonly number[]

  rule:
    MengerDemandRule
}): MengerEndpointSafetyCheck {
  const visitedOutdegrees =
    getDemandVisitedOutdegrees(
      rule.outdegree,
      rule.demand,
    )

  const finalOutdegree =
    rule.outdegree +
    rule.demand

  /*
   * The starting value is allowed to
   * be forbidden: that is precisely
   * why it belongs to the bad set.
   *
   * The demand is exact, so only the
   * final value must be F-safe.
   */
  const passes =
    isIntegerInDegreeRange(
      rule.outdegree,
      degree,
    ) &&
    isPositiveInteger(
      rule.demand,
    ) &&
    finalOutdegree <=
      degree &&
    !forbiddenSet.includes(
      finalOutdegree,
    )

  return {
    kind: 'demand',

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
}: {
  degree: number

  forbiddenSet:
    readonly number[]

  rule:
    MengerCapacityRule
}): MengerEndpointSafetyCheck {
  const visitedOutdegrees =
    getCapacityVisitedOutdegrees(
      rule.outdegree,
      rule.capacity,
    )

  /*
   * A donor may actually be used
   * 0,1,...,capacity times.
   *
   * Thus every possible landing value
   * must be F-safe, including the
   * current value corresponding to
   * zero uses.
   */
  const passes =
    isIntegerInDegreeRange(
      rule.outdegree,
      degree,
    ) &&
    isNonnegativeInteger(
      rule.capacity,
    ) &&
    rule.outdegree -
      rule.capacity >=
      0 &&
    visitedOutdegrees.every(
      (value) =>
        !forbiddenSet.includes(
          value,
        ),
    )

  return {
    kind: 'capacity',

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
   * positive capacity is interpreted
   * as capacity zero.
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
}: {
  degree: number

  currentOutdegrees:
    readonly number[]

  demandRules:
    readonly MengerDemandRule[]

  capacityRules:
    readonly MengerCapacityRule[]
}): DirectedMengerAlphaCertificate {
  const demandBounds =
    demandRules.map(
      (
        rule,
      ): MengerAlphaLowerBound => {
        /*
         * At a receiver of current
         * outdegree q:
         *
         *   r
         *   <=
         *   alpha(d-2q).
         */
        const imbalance =
          degree -
          2 * rule.outdegree

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
            : Number.POSITIVE_INFINITY

        return {
          kind: 'demand',

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
   * For q <= d/2, the inequality
   *
   *   -c(q)
   *   <=
   *   alpha(d-2q)
   *
   * is automatic for alpha >= 0.
   *
   * Only high-outdegree classes give
   * an upper bound on alpha.
   */
  const capacityBounds =
    effectiveCapacityRules
      .filter(
        (rule) =>
          2 * rule.outdegree >
          degree,
      )
      .map(
        (
          rule,
        ): MengerAlphaUpperBound => {
          const imbalance =
            2 * rule.outdegree -
            degree

          const valid =
            isIntegerInDegreeRange(
              rule.outdegree,
              degree,
            ) &&
            isNonnegativeInteger(
              rule.capacity,
            )

          const bound =
            valid
              ? rule.capacity /
                imbalance
              : Number.NEGATIVE_INFINITY

          return {
            kind: 'capacity',

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

  const allCapacityRulesValid =
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
    lowerBound >= 0 &&
    lowerBound <= 1 &&
    upperBound >= 0 &&
    upperBound <= 1 &&
    lowerBound <=
      upperBound

  return {
    degree,

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
   * The bad set B consists precisely
   * of vertices whose CURRENT
   * outdegree is forbidden.
   *
   * Hence demand rules may only be
   * assigned to currently bad classes.
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
        }),
    ),

    ...effectiveCapacityRules.map(
      (rule) =>
        getCapacityEndpointSafetyCheck({
          degree,

          forbiddenSet:
            normalizedForbiddenSet,

          rule,
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
    })

  return {
    degree,

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
      alphaCertificate.applicable,
  }
}