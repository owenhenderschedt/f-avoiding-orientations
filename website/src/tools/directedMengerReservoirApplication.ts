import type {
  LovaszApplication,
} from './lovaszPartition'
import type {
  AcrossDirection,
} from './orientAcrossPartition'
import type {
  StabilizeOutdegreeClassApplication,
  StabilizeOutdegreeClassesApplication,
} from './stabilizeOutdegreeClassApplication'
import {
  analyzeDirectedMengerReservoirV4,
  type DirectedMengerReservoirCertificate,
  type ReservoirIndependenceSource,
  type ReservoirMengerChecks,
} from './directedMengerReservoirMath'

export type DirectedMengerReservoirApplication = {
  mode:
    'reservoir'

  direction:
    'increase'

  /*
   * degree remains the original degree for
   * backwards compatibility.
   */
  degree:
    number

  originalDegree:
    number

  workingDegree:
    number

  fixedOutdegreeContribution:
    number

  independenceSource:
    ReservoirIndependenceSource

  /*
   * Compatibility fields for old
   * single-q consumers.
   */
  q:
    number

  repairedOutdegree:
    number

  /*
   * Full simultaneous repair.
   */
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

  checks:
    ReservoirMengerChecks

  certificate:
    DirectedMengerReservoirCertificate
}

export type DirectedMengerReservoirClassesApplication =
  DirectedMengerReservoirApplication

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

/*
 * Reservoir Menger V4.
 *
 * Existing callers may still pass only
 *
 *   degree
 *
 * in which case we recover the original
 * no-2-factor frame:
 *
 *   workingDegree = degree,
 *   fixed contribution = 0.
 *
 * The live playground also passes the
 * residual frame explicitly.
 */
export function createDirectedMengerReservoirApplication({
  degree,
  workingDegree =
    degree,
  fixedOutdegreeContribution =
    0,
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

  stabilizationApplication:
    StabilizeOutdegreeClassApplication | null

  currentOutdegreesL:
    readonly number[]

  currentOutdegreesR:
    readonly number[]
}): DirectedMengerReservoirApplication | null {
  const normalizedL =
    uniqueSorted(
      currentOutdegreesL,
    )

  const normalizedR =
    uniqueSorted(
      currentOutdegreesR,
    )

  const analysis =
    analyzeDirectedMengerReservoirV4({
      degree,

      workingDegree,

      fixedOutdegreeContribution,

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
    analysis.qs.length ===
      0 ||
    analysis
      .repairedOutdegrees
      .length ===
      0
  ) {
    return null
  }

  return {
    mode:
      'reservoir',

    direction:
      'increase',

    degree,

    originalDegree:
      degree,

    workingDegree,

    fixedOutdegreeContribution,

    independenceSource:
      analysis
        .independenceSource,

    q:
      analysis.qs[0],

    repairedOutdegree:
      analysis
        .repairedOutdegrees[0],

    qs:
      analysis.qs,

    repairedOutdegrees:
      analysis
        .repairedOutdegrees,

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

/*
 * Generalized-name alias retained for
 * audit/search code.
 */
export function createDirectedMengerReservoirClassesApplication({
  degree,
  workingDegree =
    degree,
  fixedOutdegreeContribution =
    0,
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

  stabilizationApplication:
    StabilizeOutdegreeClassesApplication | null

  currentOutdegreesL:
    readonly number[]

  currentOutdegreesR:
    readonly number[]
}): DirectedMengerReservoirClassesApplication | null {
  return createDirectedMengerReservoirApplication({
    degree,

    workingDegree,

    fixedOutdegreeContribution,

    forbiddenSet,

    lovaszApplication,

    acrossDirection,

    balancedR,

    stabilizationApplication,

    currentOutdegreesL,

    currentOutdegreesR,
  })
}
