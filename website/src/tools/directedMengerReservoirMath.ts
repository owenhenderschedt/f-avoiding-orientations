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

export type ReservoirMengerChecks = {
  validDegree: boolean
  hasLovaszCertificate: boolean
  lovaszCertificateMatchesDegree: boolean
  correctCertificateSides: boolean
  hasIndependentClassCertificate: boolean
  independentClassOnL: boolean
  stabilizationMatchesDegree: boolean
  cutPointsFromRToL: boolean
  reservoirIsBalanced: boolean
  qCanIncrease: boolean
  qCurrentlyPossible: boolean
  qIsForbidden: boolean
  repairedValueIsSafe: boolean
  allOtherLClassesAreSafe: boolean
  reservoirSafeIntervalIsSafe: boolean
  currentRClassesLieInReservoirInterval: boolean
}

export type ReservoirMengerClassesChecks = {
  validDegree: boolean
  hasLovaszCertificate: boolean
  lovaszCertificateMatchesDegree: boolean
  correctCertificateSides: boolean
  hasIndependentClassesCertificate: boolean
  independentClassesOnL: boolean
  stabilizationMatchesDegree: boolean
  cutPointsFromRToL: boolean
  reservoirIsBalanced: boolean
  everySelectedClassCanIncrease: boolean
  everySelectedClassCurrentlyPossible: boolean
  everySelectedClassIsForbidden: boolean
  everyRepairedValueIsSafe: boolean
  allOtherLClassesAreSafe: boolean
  reservoirSafeIntervalIsSafe: boolean
  currentRClassesLieInReservoirInterval: boolean
}

export type DirectedMengerReservoirCertificate = {
  type: 'lovasz-independent-reservoir'
  degree: number
  s: number
  t: number
  demandPart: 'L'
  reservoirPart: 'R'
  q: number
  repairedOutdegree: number
  k: number
  reservoirSafeFloor: number
  reservoirSafeOutdegrees: readonly number[]
  startingOutdegreesL: readonly number[]
  startingOutdegreesR: readonly number[]
}

export type DirectedMengerReservoirClassesCertificate = {
  type:
    'lovasz-independent-class-set-reservoir'

  degree: number
  s: number
  t: number

  demandPart: 'L'
  reservoirPart: 'R'

  /*
   * P_Q is the independent union of
   * selected bad outdegree classes.
   */
  qs: readonly number[]

  repairedOutdegrees:
    readonly number[]

  /*
   * Every q in Q is repaired by
   *
   *   q -> q+1.
   */
  repairShift: 1

  k: number
  reservoirSafeFloor: number
  reservoirSafeOutdegrees:
    readonly number[]

  startingOutdegreesL:
    readonly number[]

  startingOutdegreesR:
    readonly number[]
}

export type DirectedMengerReservoirAnalysis = {
  applicable: boolean
  checks: ReservoirMengerChecks
  q: number | null
  repairedOutdegree:
    number | null
  t: number | null
  k: number | null
  reservoirSafeFloor:
    number | null
  reservoirSafeOutdegrees:
    readonly number[]
  certificate:
    DirectedMengerReservoirCertificate | null
}

export type DirectedMengerReservoirClassesAnalysis = {
  applicable: boolean
  checks:
    ReservoirMengerClassesChecks
  qs: readonly number[]
  repairedOutdegrees:
    readonly number[]
  t: number | null
  k: number | null
  reservoirSafeFloor:
    number | null
  reservoirSafeOutdegrees:
    readonly number[]
  certificate:
    DirectedMengerReservoirClassesCertificate | null
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

function everyValueSafe(
  values: readonly number[],
  forbiddenSet:
    readonly number[],
) {
  return values.every(
    (value) =>
      !forbiddenSet.includes(
        value,
      ),
  )
}

function integerRange(
  minimum: number,
  maximum: number,
) {
  if (
    maximum < minimum
  ) {
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

/*
 * From the strengthened extremal
 * Lovasz certificate,
 *
 *   e_{G[R]}(S)+|Q_P(S)|
 *       <= ((t+1)/2)|S|.
 *
 * We use the integral uniform
 * coefficient
 *
 *   k = ceil((t+1)/2).
 */
export function getReservoirMengerK(
  t: number,
) {
  if (
    !Number.isInteger(t) ||
    t < 0
  ) {
    return null
  }

  return globalThis.Math.ceil(
    (t + 1) / 2,
  )
}

export function getReservoirSafeFloor({
  degree,
  t,
}: {
  degree: number
  t: number
}) {
  const k =
    getReservoirMengerK(t)

  if (
    k === null
  ) {
    return null
  }

  return degree - k
}

export function getReservoirSafeOutdegrees({
  degree,
  t,
}: {
  degree: number
  t: number
}) {
  const floor =
    getReservoirSafeFloor({
      degree,
      t,
    })

  if (
    floor === null ||
    floor < 0
  ) {
    return []
  }

  return integerRange(
    floor,
    degree,
  )
}

/*
 * General Q-class reservoir analysis.
 *
 * The cut proof does not use that all
 * demand vertices have the same
 * outdegree. It uses only that:
 *
 *   - P_Q subset L is independent;
 *   - every p in P_Q needs one unit of
 *     increase;
 *   - L\P_Q is already safe;
 *   - R is the certified reservoir.
 *
 * Therefore all selected classes may
 * be repaired simultaneously:
 *
 *   q -> q+1 for every q in Q.
 */
export function analyzeDirectedMengerReservoirClasses({
  degree,
  forbiddenSet,
  lovaszApplication,
  acrossDirection,
  balancedR,
  stabilizationApplication,
  currentOutdegreesL,
  currentOutdegreesR,
}: {
  degree: number
  forbiddenSet:
    readonly number[]
  lovaszApplication:
    LovaszApplication | null
  acrossDirection:
    AcrossDirection | null
  balancedR: boolean
  stabilizationApplication:
    StabilizeOutdegreeClassesApplication | null
  currentOutdegreesL:
    readonly number[]
  currentOutdegreesR:
    readonly number[]
}): DirectedMengerReservoirClassesAnalysis {
  const validDegree =
    Number.isInteger(degree) &&
    degree >= 0

  const hasLovaszCertificate =
    lovaszApplication !== null

  const lovaszCertificateMatchesDegree =
    lovaszApplication !== null &&
    lovaszApplication
      .certificate
      .degree === degree

  const correctCertificateSides =
    lovaszApplication !== null &&
    lovaszApplication
      .certificate
      .stablePart === 'L' &&
    lovaszApplication
      .certificate
      .reservoirPart === 'R'

  const hasIndependentClassesCertificate =
    stabilizationApplication !==
    null

  const independentClassesOnL =
    stabilizationApplication !==
      null &&
    stabilizationApplication
      .target === 'L' &&
    stabilizationApplication
      .certificate
      .conclusion ===
      'selected-classes-independent'

  const stabilizationMatchesDegree =
    stabilizationApplication !==
      null &&
    stabilizationApplication
      .degree === degree

  const cutPointsFromRToL =
    acrossDirection ===
    'R-to-L'

  const reservoirIsBalanced =
    balancedR

  const qs =
    stabilizationApplication ===
      null
      ? []
      : uniqueSorted(
          stabilizationApplication
            .qs,
        )

  const everySelectedClassCanIncrease =
    qs.length > 0 &&
    qs.every(
      (q) =>
        q >= 0 &&
        q < degree,
    )

  const normalizedL =
    uniqueSorted(
      currentOutdegreesL,
    )

  const normalizedR =
    uniqueSorted(
      currentOutdegreesR,
    )

  const everySelectedClassCurrentlyPossible =
    qs.length > 0 &&
    qs.every(
      (q) =>
        normalizedL.includes(
          q,
        ),
    )

  const everySelectedClassIsForbidden =
    qs.length > 0 &&
    qs.every(
      (q) =>
        forbiddenSet.includes(
          q,
        ),
    )

  const repairedOutdegrees =
    everySelectedClassCanIncrease
      ? uniqueSorted(
          qs.map(
            (q) => q + 1,
          ),
        )
      : []

  const everyRepairedValueIsSafe =
    repairedOutdegrees.length ===
      qs.length &&
    everyValueSafe(
      repairedOutdegrees,
      forbiddenSet,
    )

  const selectedClassSet =
    new Set(qs)

  const otherLClasses =
    normalizedL.filter(
      (value) =>
        !selectedClassSet.has(
          value,
        ),
    )

  const allOtherLClassesAreSafe =
    everyValueSafe(
      otherLClasses,
      forbiddenSet,
    )

  const t =
    lovaszApplication
      ?.pair
      .t ??
    null

  const k =
    t === null
      ? null
      : getReservoirMengerK(t)

  const reservoirSafeFloor =
    t === null
      ? null
      : getReservoirSafeFloor({
          degree,
          t,
        })

  const reservoirSafeOutdegrees =
    t === null
      ? []
      : getReservoirSafeOutdegrees({
          degree,
          t,
        })

  const reservoirSafeIntervalIsSafe =
    reservoirSafeOutdegrees
      .length > 0 &&
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
        value <= degree,
    )

  const checks:
    ReservoirMengerClassesChecks = {
    validDegree,
    hasLovaszCertificate,
    lovaszCertificateMatchesDegree,
    correctCertificateSides,
    hasIndependentClassesCertificate,
    independentClassesOnL,
    stabilizationMatchesDegree,
    cutPointsFromRToL,
    reservoirIsBalanced,
    everySelectedClassCanIncrease,
    everySelectedClassCurrentlyPossible,
    everySelectedClassIsForbidden,
    everyRepairedValueIsSafe,
    allOtherLClassesAreSafe,
    reservoirSafeIntervalIsSafe,
    currentRClassesLieInReservoirInterval,
  }

  const applicable =
    Object.values(
      checks,
    ).every(Boolean)

  if (
    !applicable ||
    t === null ||
    k === null ||
    reservoirSafeFloor ===
      null ||
    lovaszApplication === null
  ) {
    return {
      applicable: false,
      checks,
      qs,
      repairedOutdegrees,
      t,
      k,
      reservoirSafeFloor,
      reservoirSafeOutdegrees,
      certificate: null,
    }
  }

  return {
    applicable: true,
    checks,
    qs,
    repairedOutdegrees,
    t,
    k,
    reservoirSafeFloor,
    reservoirSafeOutdegrees,
    certificate: {
      type:
        'lovasz-independent-class-set-reservoir',
      degree,
      s:
        lovaszApplication
          .pair
          .s,
      t,
      demandPart: 'L',
      reservoirPart: 'R',
      qs,
      repairedOutdegrees,
      repairShift: 1,
      k,
      reservoirSafeFloor,
      reservoirSafeOutdegrees,
      startingOutdegreesL:
        normalizedL,
      startingOutdegreesR:
        normalizedR,
    },
  }
}

/*
 * Backwards-compatible single-q
 * analysis.
 */
export function analyzeDirectedMengerReservoir({
  degree,
  forbiddenSet,
  lovaszApplication,
  acrossDirection,
  balancedR,
  stabilizationApplication,
  currentOutdegreesL,
  currentOutdegreesR,
}: {
  degree: number
  forbiddenSet:
    readonly number[]
  lovaszApplication:
    LovaszApplication | null
  acrossDirection:
    AcrossDirection | null
  balancedR: boolean
  stabilizationApplication:
    StabilizeOutdegreeClassApplication | null
  currentOutdegreesL:
    readonly number[]
  currentOutdegreesR:
    readonly number[]
}): DirectedMengerReservoirAnalysis {
  const validDegree =
    Number.isInteger(degree) &&
    degree >= 0

  const hasLovaszCertificate =
    lovaszApplication !== null

  const lovaszCertificateMatchesDegree =
    lovaszApplication !== null &&
    lovaszApplication
      .certificate
      .degree === degree

  const correctCertificateSides =
    lovaszApplication !== null &&
    lovaszApplication
      .certificate
      .stablePart === 'L' &&
    lovaszApplication
      .certificate
      .reservoirPart === 'R'

  const hasIndependentClassCertificate =
    stabilizationApplication !==
    null

  const independentClassOnL =
    stabilizationApplication !==
      null &&
    stabilizationApplication
      .target === 'L' &&
    stabilizationApplication
      .certificate
      .conclusion ===
      'q-class-independent'

  const stabilizationMatchesDegree =
    stabilizationApplication !==
      null &&
    stabilizationApplication
      .degree === degree

  const cutPointsFromRToL =
    acrossDirection ===
    'R-to-L'

  const reservoirIsBalanced =
    balancedR

  const q =
    stabilizationApplication
      ?.q ??
    null

  const qCanIncrease =
    q !== null &&
    q >= 0 &&
    q < degree

  const normalizedL =
    uniqueSorted(
      currentOutdegreesL,
    )

  const normalizedR =
    uniqueSorted(
      currentOutdegreesR,
    )

  const qCurrentlyPossible =
    q !== null &&
    normalizedL.includes(q)

  const qIsForbidden =
    q !== null &&
    forbiddenSet.includes(q)

  const repairedOutdegree =
    qCanIncrease &&
    q !== null
      ? q + 1
      : null

  const repairedValueIsSafe =
    repairedOutdegree !== null &&
    !forbiddenSet.includes(
      repairedOutdegree,
    )

  const otherLClasses =
    q === null
      ? normalizedL
      : normalizedL.filter(
          (value) =>
            value !== q,
        )

  const allOtherLClassesAreSafe =
    everyValueSafe(
      otherLClasses,
      forbiddenSet,
    )

  const t =
    lovaszApplication
      ?.pair
      .t ??
    null

  const k =
    t === null
      ? null
      : getReservoirMengerK(t)

  const reservoirSafeFloor =
    t === null
      ? null
      : getReservoirSafeFloor({
          degree,
          t,
        })

  const reservoirSafeOutdegrees =
    t === null
      ? []
      : getReservoirSafeOutdegrees({
          degree,
          t,
        })

  const reservoirSafeIntervalIsSafe =
    reservoirSafeOutdegrees
      .length > 0 &&
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
        value <= degree,
    )

  const checks:
    ReservoirMengerChecks = {
    validDegree,
    hasLovaszCertificate,
    lovaszCertificateMatchesDegree,
    correctCertificateSides,
    hasIndependentClassCertificate,
    independentClassOnL,
    stabilizationMatchesDegree,
    cutPointsFromRToL,
    reservoirIsBalanced,
    qCanIncrease,
    qCurrentlyPossible,
    qIsForbidden,
    repairedValueIsSafe,
    allOtherLClassesAreSafe,
    reservoirSafeIntervalIsSafe,
    currentRClassesLieInReservoirInterval,
  }

  const applicable =
    Object.values(
      checks,
    ).every(Boolean)

  if (
    !applicable ||
    q === null ||
    repairedOutdegree === null ||
    t === null ||
    k === null ||
    reservoirSafeFloor ===
      null ||
    lovaszApplication === null
  ) {
    return {
      applicable: false,
      checks,
      q,
      repairedOutdegree,
      t,
      k,
      reservoirSafeFloor,
      reservoirSafeOutdegrees,
      certificate: null,
    }
  }

  return {
    applicable: true,
    checks,
    q,
    repairedOutdegree,
    t,
    k,
    reservoirSafeFloor,
    reservoirSafeOutdegrees,
    certificate: {
      type:
        'lovasz-independent-reservoir',
      degree,
      s:
        lovaszApplication
          .pair
          .s,
      t,
      demandPart: 'L',
      reservoirPart: 'R',
      q,
      repairedOutdegree,
      k,
      reservoirSafeFloor,
      reservoirSafeOutdegrees,
      startingOutdegreesL:
        normalizedL,
      startingOutdegreesR:
        normalizedR,
    },
  }
}
