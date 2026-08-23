import type {
  LovaszApplication,
} from './lovaszPartition'
import type {
  AcrossDirection,
} from './orientAcrossPartition'
import type {
  StabilizeOutdegreeClassApplication,
} from './stabilizeOutdegreeClassApplication'

export type ReservoirMengerChecks = {
  validDegree:
    boolean

  hasLovaszCertificate:
    boolean

  lovaszCertificateMatchesDegree:
    boolean

  correctCertificateSides:
    boolean

  hasIndependentClassCertificate:
    boolean

  independentClassOnL:
    boolean

  stabilizationMatchesDegree:
    boolean

  cutPointsFromRToL:
    boolean

  reservoirIsBalanced:
    boolean

  qCanIncrease:
    boolean

  qCurrentlyPossible:
    boolean

  qIsForbidden:
    boolean

  repairedValueIsSafe:
    boolean

  allOtherLClassesAreSafe:
    boolean

  reservoirSafeIntervalIsSafe:
    boolean

  currentRClassesLieInReservoirInterval:
    boolean
}

export type DirectedMengerReservoirCertificate = {
  type:
    'lovasz-independent-reservoir'

  degree:
    number

  s:
    number

  t:
    number

  /*
   * The strengthened Lovasz certificate
   * is asymmetric:
   *
   *   L = independent bad-class side,
   *   R = reservoir side.
   */
  demandPart:
    'L'

  reservoirPart:
    'R'

  /*
   * P_q is the independent class being
   * repaired.
   */
  q:
    number

  repairedOutdegree:
    number

  /*
   * General reservoir parameter
   *
   *       k = ceil((t+1)/2).
   *
   * The t=3 proof has k=2.
   */
  k:
    number

  /*
   * Every reservoir vertex will finish
   * with outdegree at least this value.
   */
  reservoirSafeFloor:
    number

  reservoirSafeOutdegrees:
    readonly number[]

  /*
   * Exact TOTAL-outdegree state on which
   * this certificate was verified.
   */
  startingOutdegreesL:
    readonly number[]

  startingOutdegreesR:
    readonly number[]
}

export type DirectedMengerReservoirAnalysis = {
  applicable:
    boolean

  checks:
    ReservoirMengerChecks

  q:
    number | null

  repairedOutdegree:
    number | null

  t:
    number | null

  k:
    number | null

  reservoirSafeFloor:
    number | null

  reservoirSafeOutdegrees:
    readonly number[]

  certificate:
    DirectedMengerReservoirCertificate | null
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

function everyValueSafe(
  values:
    readonly number[],

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
  minimum:
    number,

  maximum:
    number,
) {
  if (
    maximum <
    minimum
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
    (
      _,
      index,
    ) =>
      minimum +
      index,
  )
}

/*
 * From the strengthened extremal
 * Lovasz certificate,
 *
 *   e_{G[R]}(S)+|Q_P(S)|
 *       <= ((t+1)/2)|S|.
 *
 * Capacities must be integral, so a
 * convenient uniform coefficient is
 *
 *   k = ceil((t+1)/2).
 *
 * For t=3 this is k=2.
 */
export function getReservoirMengerK(
  t:
    number,
) {
  if (
    !Number.isInteger(t) ||
    t < 0
  ) {
    return null
  }

  return globalThis.Math.ceil(
    (t + 1) /
      2,
  )
}

export function getReservoirSafeFloor({
  degree,
  t,
}: {
  degree:
    number

  t:
    number
}) {
  const k =
    getReservoirMengerK(
      t,
    )

  if (
    k ===
    null
  ) {
    return null
  }

  return degree - k
}

export function getReservoirSafeOutdegrees({
  degree,
  t,
}: {
  degree:
    number

  t:
    number
}) {
  const floor =
    getReservoirSafeFloor({
      degree,
      t,
    })

  if (
    floor ===
      null ||
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
 * Analyze whether the CURRENT proof
 * state satisfies the general Lovasz
 * reservoir-repair hypotheses.
 *
 * This mode deliberately does not ask
 * the user to invent demands or
 * capacities.
 *
 * The proof state already determines:
 *
 *   - the independent class P_q,
 *   - the repair q -> q+1,
 *   - the reservoir side R,
 *   - the coefficient k,
 *   - the safe reservoir floor.
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
}): DirectedMengerReservoirAnalysis {
  const validDegree =
    Number.isInteger(
      degree,
    ) &&
    degree >= 0

  const hasLovaszCertificate =
    lovaszApplication !==
    null

  const lovaszCertificateMatchesDegree =
    lovaszApplication !==
      null &&
    lovaszApplication
      .certificate
      .degree ===
      degree

  const correctCertificateSides =
    lovaszApplication !==
      null &&
    lovaszApplication
      .certificate
      .stablePart ===
      'L' &&
    lovaszApplication
      .certificate
      .reservoirPart ===
      'R'

  const hasIndependentClassCertificate =
    stabilizationApplication !==
    null

  const independentClassOnL =
    stabilizationApplication !==
      null &&
    stabilizationApplication
      .target ===
      'L' &&
    stabilizationApplication
      .certificate
      .conclusion ===
      'q-class-independent'

  const stabilizationMatchesDegree =
    stabilizationApplication !==
      null &&
    stabilizationApplication
      .degree ===
      degree

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
    q !==
      null &&
    q >= 0 &&
    q <
      degree

  const normalizedL =
    uniqueSorted(
      currentOutdegreesL,
    )

  const normalizedR =
    uniqueSorted(
      currentOutdegreesR,
    )

  const qCurrentlyPossible =
    q !==
      null &&
    normalizedL.includes(
      q,
    )

  const qIsForbidden =
    q !==
      null &&
    forbiddenSet.includes(
      q,
    )

  const repairedOutdegree =
    qCanIncrease &&
    q !==
      null
      ? q + 1
      : null

  const repairedValueIsSafe =
    repairedOutdegree !==
      null &&
    !forbiddenSet.includes(
      repairedOutdegree,
    )

  /*
   * The Menger network contains only
   *
   *     R union P_q.
   *
   * Thus vertices of L\P_q are never
   * internal vertices of a repair path.
   *
   * They must already be safe.
   */
  const otherLClasses =
    q ===
    null
      ? normalizedL
      : normalizedL.filter(
          (value) =>
            value !==
            q,
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
    t ===
    null
      ? null
      : getReservoirMengerK(
          t,
        )

  const reservoirSafeFloor =
    t ===
    null
      ? null
      : getReservoirSafeFloor(
          {
            degree,
            t,
          },
        )

  const reservoirSafeOutdegrees =
    t ===
    null
      ? []
      : getReservoirSafeOutdegrees(
          {
            degree,
            t,
          },
        )

  /*
   * A reservoir vertex b starts with
   *
   *     d_G^+(b)=d-i(b),
   *
   * where i(b)=d^-_{G[R]}(b).
   *
   * We give it capacity
   *
   *     c(b)=k-i(b).
   *
   * Hence after all paths begin there,
   * it still has outdegree at least
   *
   *     d-k.
   *
   * Therefore the entire interval
   *
   *     d-k,...,d
   *
   * must be safe.
   */
  const reservoirSafeIntervalIsSafe =
    reservoirSafeOutdegrees
      .length >
      0 &&
    everyValueSafe(
      reservoirSafeOutdegrees,
      forbiddenSet,
    )

  /*
   * This is mainly a consistency check
   * on the abstract playground state.
   *
   * Under R->L plus a balanced
   * orientation of G[R], these current
   * classes should automatically lie in
   * the reservoir interval.
   */
  const currentRClassesLieInReservoirInterval =
    reservoirSafeFloor !==
      null &&
    normalizedR.every(
      (value) =>
        value >=
          reservoirSafeFloor &&
        value <=
          degree,
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
    ).every(
      Boolean,
    )

  if (
    !applicable ||
    q ===
      null ||
    repairedOutdegree ===
      null ||
    t ===
      null ||
    k ===
      null ||
    reservoirSafeFloor ===
      null ||
    lovaszApplication ===
      null
  ) {
    return {
      applicable:
        false,

      checks,

      q,

      repairedOutdegree,

      t,

      k,

      reservoirSafeFloor,

      reservoirSafeOutdegrees,

      certificate:
        null,
    }
  }

  return {
    applicable:
      true,

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

      demandPart:
        'L',

      reservoirPart:
        'R',

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