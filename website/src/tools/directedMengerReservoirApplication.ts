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
  analyzeDirectedMengerReservoir,
  analyzeDirectedMengerReservoirClasses,
  type DirectedMengerReservoirCertificate,
  type DirectedMengerReservoirClassesCertificate,
  type ReservoirMengerChecks,
  type ReservoirMengerClassesChecks,
} from './directedMengerReservoirMath'

export type DirectedMengerReservoirApplication = {
  /*
   * One live reservoir mode handles both
   * singleton and multi-class demand sets.
   */
  mode:
    'reservoir'

  direction:
    'increase'

  degree:
    number

  /*
   * Compatibility fields for the original
   * single-q plumbing.
   *
   * When |Q|=1 these are exactly the old
   * q and q+1 fields.  When |Q|>1 they are
   * the first repair pair and should not be
   * used to describe the full certificate.
   */
  q:
    number

  repairedOutdegree:
    number

  /*
   * Full set of independent bad classes
   * repaired simultaneously:
   *
   *     q -> q+1  for every q in Q.
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
    | ReservoirMengerChecks
    | ReservoirMengerClassesChecks

  certificate:
    | DirectedMengerReservoirCertificate
    | DirectedMengerReservoirClassesCertificate
}

/*
 * The generalized name remains available
 * for audit/search code that wants to say
 * explicitly that several classes may be
 * repaired at once.
 */
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

function getSelectedClasses(
  application:
    StabilizeOutdegreeClassApplication | null,
) {
  if (
    application ===
    null
  ) {
    return []
  }

  if (
    application.qs.length >
    0
  ) {
    return uniqueSorted(
      application.qs,
    )
  }

  return [
    application.q,
  ]
}

/*
 * Live creator.
 *
 * For a singleton Q={q}, retain the
 * original single-q certificate.  For a
 * genuine multi-class selection, use the
 * generalized independent-set reservoir
 * certificate.
 */
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
}): DirectedMengerReservoirApplication | null {
  const normalizedL =
    uniqueSorted(
      currentOutdegreesL,
    )

  const normalizedR =
    uniqueSorted(
      currentOutdegreesR,
    )

  const qs =
    getSelectedClasses(
      stabilizationApplication,
    )

  if (
    qs.length ===
    0
  ) {
    return null
  }

  if (
    qs.length ===
    1
  ) {
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

      qs: [
        analysis.q,
      ],

      repairedOutdegrees: [
        analysis
          .repairedOutdegree,
      ],

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

  const classAnalysis =
    analyzeDirectedMengerReservoirClasses({
      degree,

      forbiddenSet,

      lovaszApplication,

      acrossDirection,

      balancedR,

      stabilizationApplication:
        stabilizationApplication as StabilizeOutdegreeClassesApplication,

      currentOutdegreesL:
        normalizedL,

      currentOutdegreesR:
        normalizedR,
    })

  if (
    !classAnalysis.applicable ||
    classAnalysis.certificate ===
      null ||
    classAnalysis.qs.length ===
      0 ||
    classAnalysis.repairedOutdegrees.length ===
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

    q:
      classAnalysis.qs[0],

    repairedOutdegree:
      classAnalysis
        .repairedOutdegrees[0],

    qs:
      classAnalysis.qs,

    repairedOutdegrees:
      classAnalysis
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
      classAnalysis.checks,

    certificate:
      classAnalysis.certificate,
  }
}

/*
 * Explicit generalized creator retained
 * as a convenience for the completeness
 * audit.  It uses the same live creator,
 * so the audit and playground share the
 * same certificate logic.
 */
export function createDirectedMengerReservoirClassesApplication({
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
    StabilizeOutdegreeClassesApplication | null

  currentOutdegreesL:
    readonly number[]

  currentOutdegreesR:
    readonly number[]
}): DirectedMengerReservoirClassesApplication | null {
  return createDirectedMengerReservoirApplication({
    degree,

    forbiddenSet,

    lovaszApplication,

    acrossDirection,

    balancedR,

    stabilizationApplication,

    currentOutdegreesL,

    currentOutdegreesR,
  })
}
