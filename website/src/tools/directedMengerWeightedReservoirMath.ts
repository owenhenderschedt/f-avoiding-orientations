export type WeightedReservoirDemand = {
  q: number
  repairedOutdegree: number
  beta: number
}

export type WeightedReservoirDemandAnalysis = {
  q: number
  repairedOutdegree: number
  shift: number
  beta: number
  denominator: number
  lambda: number
}

export type WeightedReservoirAnalysis = {
  applicable: boolean

  t: number
  k: number | null
  lambda: number | null

  demands:
    readonly WeightedReservoirDemandAnalysis[]

  reservoirSafeFloor:
    number | null

  reservoirSafeOutdegrees:
    readonly number[]

  checks: {
    validDegreeFrame: boolean
    validT: boolean
    hasDemand: boolean
    everyDemandStartsPossible: boolean
    everyDemandStartsForbidden: boolean
    everyRepairIsSafe: boolean
    everyOtherLClassIsSafe: boolean
    everyDensityChargeIsValid: boolean
    everyShiftFitsDensitySlack: boolean
    reservoirSafeIntervalIsSafe: boolean
    currentRClassesLieInReservoirInterval: boolean
  }
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

function integerRange(
  minimum: number,
  maximum: number,
) {
  if (maximum < minimum) {
    return []
  }

  return Array.from(
    {
      length:
        maximum -
        minimum +
        1,
    },

    (_, index) =>
      minimum + index,
  )
}

function everyValueSafe(
  values: readonly number[],
  forbiddenSet: readonly number[],
) {
  return values.every(
    (value) =>
      !forbiddenSet.includes(
        value,
      ),
  )
}

/*
 * Weighted Reservoir Menger.
 *
 * Let H be the current regular working
 * graph and let V(H)=L union R be the
 * strengthened Lovasz partition with
 *
 *   Delta(H[R]) <= t.
 *
 * All cut edges are oriented R -> L and
 * H[R] is balanced.
 *
 * A demand vertex p in L has an integer
 * demand a(p) >= 1.  Suppose numbers
 * beta(p) satisfy
 *
 *   e_H(X) <= sum_{p in X} beta(p)
 *
 * for every subset X of the demand set.
 *
 * Put
 *
 *   lambda =
 *     max_p a(p)/(t-beta(p)).
 *
 * If a(p) <= t-beta(p), then the Lovasz
 * exchange inequality and the reservoir
 * degree inequality imply
 *
 *   e_{H[R]}(S) + D(S)
 *     <= t(1+lambda)|S|/2,
 *
 * where
 *
 *   D(S) =
 *     sum_p max(
 *       0,
 *       a(p)
 *       - |N_H(p) intersect (R\S)|
 *     ).
 *
 * Hence capacity
 *
 *   k = ceil(t(1+lambda)/2)
 *
 * is sufficient for the weighted
 * Menger flow.
 *
 * For an ordinary selected total
 * outdegree class q, the orientation
 * itself gives the automatic density
 * certificate
 *
 *   beta = q-r,
 *
 * because, when the cut is R -> L,
 *
 *   d^+_{H[L]}(v) = q-r.
 *
 * If the entire selected demand union
 * is independently certified, beta=0
 * may instead be used.
 */
export function analyzeWeightedReservoir({
  degree,
  workingDegree,
  fixedOutdegreeContribution,
  t,
  forbiddenSet,
  currentOutdegreesL,
  currentOutdegreesR,
  demands,
}: {
  degree: number
  workingDegree: number
  fixedOutdegreeContribution: number
  t: number
  forbiddenSet: readonly number[]
  currentOutdegreesL: readonly number[]
  currentOutdegreesR: readonly number[]
  demands: readonly WeightedReservoirDemand[]
}): WeightedReservoirAnalysis {
  const normalizedL =
    uniqueSorted(
      currentOutdegreesL,
    )

  const normalizedR =
    uniqueSorted(
      currentOutdegreesR,
    )

  const validDegreeFrame =
    Number.isInteger(degree) &&
    Number.isInteger(
      workingDegree,
    ) &&
    Number.isInteger(
      fixedOutdegreeContribution,
    ) &&
    degree >= 0 &&
    workingDegree >= 0 &&
    fixedOutdegreeContribution >= 0 &&
    degree ===
      workingDegree +
      2 *
        fixedOutdegreeContribution

  const validT =
    Number.isInteger(t) &&
    t >= 0

  const analyzedDemands =
    demands.map(
      ({
        q,
        repairedOutdegree,
        beta,
      }) => {
        const shift =
          repairedOutdegree - q

        const denominator =
          t - beta

        const lambda =
          denominator > 0
            ? shift /
              denominator
            : Number.POSITIVE_INFINITY

        return {
          q,
          repairedOutdegree,
          shift,
          beta,
          denominator,
          lambda,
        }
      },
    )

  const hasDemand =
    analyzedDemands.length > 0

  const selectedClasses =
    new Set(
      analyzedDemands.map(
        (demand) =>
          demand.q,
      ),
    )

  const everyDemandStartsPossible =
    hasDemand &&
    analyzedDemands.every(
      (demand) =>
        normalizedL.includes(
          demand.q,
        ),
    )

  const everyDemandStartsForbidden =
    hasDemand &&
    analyzedDemands.every(
      (demand) =>
        forbiddenSet.includes(
          demand.q,
        ),
    )

  const everyRepairIsSafe =
    hasDemand &&
    analyzedDemands.every(
      (demand) =>
        demand.shift >= 1 &&
        demand.repairedOutdegree <=
          fixedOutdegreeContribution +
            workingDegree &&
        !forbiddenSet.includes(
          demand
            .repairedOutdegree,
        ),
    )

  const otherLClasses =
    normalizedL.filter(
      (value) =>
        !selectedClasses.has(
          value,
        ),
    )

  const everyOtherLClassIsSafe =
    everyValueSafe(
      otherLClasses,
      forbiddenSet,
    )

  const everyDensityChargeIsValid =
    hasDemand &&
    analyzedDemands.every(
      (demand) =>
        Number.isFinite(
          demand.beta,
        ) &&
        Number.isInteger(
          demand.beta,
        ) &&
        demand.beta >= 0 &&
        demand.beta <= t,
    )

  const everyShiftFitsDensitySlack =
    hasDemand &&
    analyzedDemands.every(
      (demand) =>
        demand.shift >= 1 &&
        demand.denominator >=
          demand.shift,
    )

  const lambda =
    everyShiftFitsDensitySlack
      ? globalThis.Math.max(
          ...analyzedDemands.map(
            (demand) =>
              demand.lambda,
          ),
        )
      : null

  const k =
    lambda === null
      ? null
      : globalThis.Math.ceil(
          t *
            (1 + lambda) /
            2,
        )

  const residualReservoirSafeFloor =
    k === null
      ? null
      : workingDegree - k

  const reservoirSafeFloor =
    residualReservoirSafeFloor ===
      null
      ? null
      : fixedOutdegreeContribution +
        residualReservoirSafeFloor

  const maximumCurrentTotalOutdegree =
    fixedOutdegreeContribution +
    workingDegree

  const reservoirSafeOutdegrees =
    reservoirSafeFloor === null
      ? []
      : integerRange(
          reservoirSafeFloor,
          maximumCurrentTotalOutdegree,
        )

  const reservoirSafeIntervalIsSafe =
    reservoirSafeOutdegrees.length >
      0 &&
    everyValueSafe(
      reservoirSafeOutdegrees,
      forbiddenSet,
    )

  const currentRClassesLieInReservoirInterval =
    reservoirSafeFloor !==
      null &&
    normalizedR.every(
      (value) =>
        value >=
          reservoirSafeFloor &&
        value <=
          maximumCurrentTotalOutdegree,
    )

  const checks = {
    validDegreeFrame,
    validT,
    hasDemand,
    everyDemandStartsPossible,
    everyDemandStartsForbidden,
    everyRepairIsSafe,
    everyOtherLClassIsSafe,
    everyDensityChargeIsValid,
    everyShiftFitsDensitySlack,
    reservoirSafeIntervalIsSafe,
    currentRClassesLieInReservoirInterval,
  }

  return {
    applicable:
      Object.values(
        checks,
      ).every(Boolean),

    t,
    k,
    lambda,

    demands:
      analyzedDemands,

    reservoirSafeFloor,

    reservoirSafeOutdegrees,

    checks,
  }
}
