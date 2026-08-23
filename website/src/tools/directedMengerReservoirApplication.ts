import type {
  LovaszApplication,
} from './lovaszPartition'
import type {
  AcrossDirection,
} from './orientAcrossPartition'
import type {
  StabilizeOutdegreeClassApplication,
} from './stabilizeOutdegreeClassApplication'
import {
  analyzeDirectedMengerReservoir,
  type DirectedMengerReservoirCertificate,
  type ReservoirMengerChecks,
} from './directedMengerReservoirMath'

export type DirectedMengerReservoirApplication = {
  /*
   * This distinguishes the new
   * certificate mode from the existing
   * local-alpha Directed Menger mode.
   */
  mode:
    'reservoir'

  /*
   * The reservoir argument repairs an
   * independent q-class upward:
   *
   *       q -> q+1.
   */
  direction:
    'increase'

  degree:
    number

  q:
    number

  repairedOutdegree:
    number

  /*
   * We keep the forbidden set that was
   * used when the application was
   * certified. This makes the saved
   * proof step self-contained.
   */
  forbiddenSet:
    readonly number[]

  /*
   * Exact total-outdegree states before
   * the reservoir repair.
   */
  startingOutdegreesL:
    readonly number[]

  startingOutdegreesR:
    readonly number[]

  /*
   * All automatic hypothesis checks
   * used when this application was
   * created.
   */
  checks:
    ReservoirMengerChecks

  /*
   * The actual mathematical certificate:
   *
   * - strengthened Lovasz partition,
   * - independent P_q subset L,
   * - R is the reservoir,
   * - k = ceil((t+1)/2),
   * - safe reservoir interval.
   */
  certificate:
    DirectedMengerReservoirCertificate
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

export function createDirectedMengerReservoirApplication({
  degree,
  forbiddenSet,
  lovaszApplication,
  acrossDirection,
  balancedR,
  stabilizationApplication,
  currentOutdegreesL,
  currentOutdegreesR,
}: {
  degree:
    number

  forbiddenSet:
    readonly number[]

  lovaszApplication:
    LovaszApplication | null

  acrossDirection:
    AcrossDirection | null

  balancedR:
    boolean

  stabilizationApplication:
    StabilizeOutdegreeClassApplication | null

  currentOutdegreesL:
    readonly number[]

  currentOutdegreesR:
    readonly number[]
}):
  DirectedMengerReservoirApplication | null {
  const normalizedL =
    uniqueSorted(
      currentOutdegreesL,
    )

  const normalizedR =
    uniqueSorted(
      currentOutdegreesR,
    )

  const analysis =
    analyzeDirectedMengerReservoir({
      degree,

      forbiddenSet,

      lovaszApplication,

      acrossDirection,

      balancedR,

      stabilizationApplication,

      currentOutdegreesL:
        normalizedL,

      currentOutdegreesR:
        normalizedR,
    })

  if (
    !analysis.applicable ||
    analysis.certificate ===
      null ||
    analysis.q ===
      null ||
    analysis.repairedOutdegree ===
      null
  ) {
    return null
  }

  return {
    mode:
      'reservoir',

    direction:
      'increase',

    degree,

    q:
      analysis.q,

    repairedOutdegree:
      analysis
        .repairedOutdegree,

    forbiddenSet:
      uniqueSorted(
        forbiddenSet,
      ),

    startingOutdegreesL:
      normalizedL,

    startingOutdegreesR:
      normalizedR,

    checks:
      analysis.checks,

    certificate:
      analysis.certificate,
  }
}