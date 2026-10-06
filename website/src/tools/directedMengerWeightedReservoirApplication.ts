import type {
  LovaszApplication,
} from './lovaszPartition'
import type {
  AcrossDirection,
} from './orientAcrossPartition'
import {
  analyzeWeightedReservoir,
  type WeightedReservoirAnalysis,
  type WeightedReservoirDemandAnalysis,
} from './directedMengerWeightedReservoirMath'

export type WeightedReservoirRepair = {
  q: number
  repairedOutdegree: number
}

export type DirectedMengerWeightedReservoirCertificate = {
  type:
    'lovasz-weighted-density-reservoir'

  degree: number
  originalDegree: number
  workingDegree: number
  fixedOutdegreeContribution: number

  s: number
  t: number

  demandPart: 'L'
  reservoirPart: 'R'

  /*
   * For now every density charge is
   * supplied automatically from the
   * current orientation:
   *
   *   beta_q = q-r.
   *
   * This is a genuine certificate because
   * the cut is R -> L, hence a vertex of
   * total outdegree q has
   *
   *   d^+_{H[L]} = q-r.
   */
  densitySource:
    'automatic-outdegree'

  demands:
    readonly WeightedReservoirDemandAnalysis[]

  lambda: number
  k: number

  reservoirSafeFloor: number
  reservoirSafeOutdegrees:
    readonly number[]

  startingOutdegreesL:
    readonly number[]
  startingOutdegreesR:
    readonly number[]
}

export type DirectedMengerWeightedReservoirApplication = {
  mode:
    'weighted-reservoir'

  direction:
    'increase'

  degree: number
  originalDegree: number
  workingDegree: number
  fixedOutdegreeContribution: number

  repairs:
    readonly WeightedReservoirRepair[]

  qs:
    readonly number[]

  repairedOutdegrees:
    readonly number[]

  forbiddenSet:
    readonly number[]

  startingOutdegreesL:
    readonly number[]

  startingOutdegreesR:
    readonly number[]

  analysis:
    WeightedReservoirAnalysis

  certificate:
    DirectedMengerWeightedReservoirCertificate
}

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

export function createDirectedMengerWeightedReservoirApplication({
  degree,
  workingDegree =
    degree,
  fixedOutdegreeContribution =
    0,
  forbiddenSet,
  lovaszApplication,
  acrossDirection,
  balancedR,
  currentOutdegreesL,
  currentOutdegreesR,
  repairs,
}: {
  degree:
    number

  workingDegree?:
    number

  fixedOutdegreeContribution?:
    number

  forbiddenSet:
    readonly number[]

  lovaszApplication:
    LovaszApplication | null

  acrossDirection:
    AcrossDirection | null

  balancedR:
    boolean

  currentOutdegreesL:
    readonly number[]

  currentOutdegreesR:
    readonly number[]

  repairs:
    readonly WeightedReservoirRepair[]
}): DirectedMengerWeightedReservoirApplication | null {
  if (
    lovaszApplication ===
      null ||
    lovaszApplication
      .certificate
      .degree !==
      workingDegree ||
    lovaszApplication
      .certificate
      .stablePart !==
      'L' ||
    lovaszApplication
      .certificate
      .reservoirPart !==
      'R' ||
    acrossDirection !==
      'R-to-L' ||
    !balancedR
  ) {
    return null
  }

  const normalizedL =
    uniqueSorted(
      currentOutdegreesL,
    )

  const normalizedR =
    uniqueSorted(
      currentOutdegreesR,
    )

  const normalizedRepairs =
    Array.from(
      new Map(
        repairs.map(
          (repair) => [
            repair.q,
            {
              q:
                repair.q,

              repairedOutdegree:
                repair
                  .repairedOutdegree,
            },
          ],
        ),
      ).values(),
    ).sort(
      (a, b) =>
        a.q - b.q,
    )

  if (
    normalizedRepairs.length ===
      0
  ) {
    return null
  }

  /*
   * A selected total outdegree q has
   *
   *   d^+_{H[L]} = q-r
   *
   * because every residual cut edge is
   * directed R -> L.
   *
   * Consequently, for every subset X of
   * the selected demand vertices,
   *
   *   e_H(X)
   *     = sum_{v in X} d^+_{H[X]}(v)
   *     <= sum_{v in X} (q(v)-r).
   *
   * Thus beta_q=q-r is an automatic valid
   * density charge.
   */
  const demands =
    normalizedRepairs.map(
      (repair) => ({
        q:
          repair.q,

        repairedOutdegree:
          repair
            .repairedOutdegree,

        beta:
          repair.q -
          fixedOutdegreeContribution,
      }),
    )

  const t =
    lovaszApplication
      .pair
      .t

  const analysis =
    analyzeWeightedReservoir({
      degree,

      workingDegree,

      fixedOutdegreeContribution,

      t,

      forbiddenSet,

      currentOutdegreesL:
        normalizedL,

      currentOutdegreesR:
        normalizedR,

      demands,
    })

  if (
    !analysis.applicable ||
    analysis.k ===
      null ||
    analysis.lambda ===
      null ||
    analysis.reservoirSafeFloor ===
      null ||
    analysis.demands.length ===
      0
  ) {
    return null
  }

  const qs =
    analysis.demands.map(
      (demand) =>
        demand.q,
    )

  const repairedOutdegrees =
    analysis.demands.map(
      (demand) =>
        demand
          .repairedOutdegree,
    )

  return {
    mode:
      'weighted-reservoir',

    direction:
      'increase',

    degree,

    originalDegree:
      degree,

    workingDegree,

    fixedOutdegreeContribution,

    repairs:
      normalizedRepairs,

    qs,

    repairedOutdegrees,

    forbiddenSet:
      uniqueSorted(
        forbiddenSet,
      ),

    startingOutdegreesL:
      normalizedL,

    startingOutdegreesR:
      normalizedR,

    analysis,

    certificate: {
      type:
        'lovasz-weighted-density-reservoir',

      degree,

      originalDegree:
        degree,

      workingDegree,

      fixedOutdegreeContribution,

      s:
        lovaszApplication
          .pair
          .s,

      t,

      demandPart:
        'L',

      reservoirPart:
        'R',

      densitySource:
        'automatic-outdegree',

      demands:
        analysis.demands,

      lambda:
        analysis.lambda,

      k:
        analysis.k,

      reservoirSafeFloor:
        analysis
          .reservoirSafeFloor,

      reservoirSafeOutdegrees:
        analysis
          .reservoirSafeOutdegrees,

      startingOutdegreesL:
        normalizedL,

      startingOutdegreesR:
        normalizedR,
    },
  }
}
