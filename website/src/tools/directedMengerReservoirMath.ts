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

export type ReservoirIndependenceSource =
  | 'stabilization'
  | 'zero-internal'

export type ReservoirMengerChecks = {
  validDegreeFrame: boolean
  hasLovaszCertificate: boolean
  lovaszCertificateMatchesWorkingDegree: boolean
  correctCertificateSides: boolean
  hasIndependentSetCertificate: boolean
  independentSetOnL: boolean
  independenceCertificateMatchesDegreeFrame: boolean
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

/*
 * Backwards-compatible type name.
 */
export type ReservoirMengerClassesChecks =
  ReservoirMengerChecks

export type DirectedMengerReservoirCertificate = {
  type:
    | 'lovasz-independent-reservoir'
    | 'lovasz-independent-class-set-reservoir'
    | 'lovasz-zero-internal-reservoir'

  /*
   * degree is retained as the original
   * total degree for backwards
   * compatibility.
   */
  degree: number
  originalDegree: number
  workingDegree: number
  fixedOutdegreeContribution: number

  s: number
  t: number

  demandPart: 'L'
  reservoirPart: 'R'

  independenceSource:
    ReservoirIndependenceSource

  qs: readonly number[]
  repairedOutdegrees:
    readonly number[]

  /*
   * Compatibility fields for the
   * original single-q interface.
   */
  q: number
  repairedOutdegree: number

  repairShift: 1

  k: number

  /*
   * Residual outdegree interval in the
   * working graph H.
   */
  residualReservoirSafeFloor:
    number

  residualReservoirSafeOutdegrees:
    readonly number[]

  /*
   * TOTAL outdegree interval after adding
   * the fixed contribution from oriented
   * 2-factors.
   */
  reservoirSafeFloor: number

  reservoirSafeOutdegrees:
    readonly number[]

  startingOutdegreesL:
    readonly number[]

  startingOutdegreesR:
    readonly number[]
}

/*
 * The generalized certificate now has the
 * same shape for singleton and multi-class
 * demand sets.
 */
export type DirectedMengerReservoirClassesCertificate =
  DirectedMengerReservoirCertificate

export type DirectedMengerReservoirV4Analysis = {
  applicable: boolean

  checks:
    ReservoirMengerChecks

  independenceSource:
    ReservoirIndependenceSource

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
    DirectedMengerReservoirCertificate | null
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
 * From the strengthened Lovasz
 * certificate,
 *
 *   e_{H[R]}(S)+|Q_P(S)|
 *       <= ((t+1)/2)|S|.
 *
 * We use the integral coefficient
 *
 *   k = ceil((t+1)/2).
 */
export function getReservoirMengerK(
  t:
    number,
) {
  if (
    !Number.isInteger(
      t,
    ) ||
    t < 0
  ) {
    return null
  }

  return globalThis.Math.ceil(
    (t + 1) / 2,
  )
}

/*
 * Residual safe floor in the current
 * regular working graph H.
 */
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

type IndependenceCandidate = {
  source:
    ReservoirIndependenceSource

  qs:
    readonly number[]
}

function stabilizationCertifiesIndependence(
  application:
    StabilizeOutdegreeClassApplication | null,
) {
  if (
    application ===
      null ||
    application.target !==
      'L'
  ) {
    return false
  }

  return (
    application
      .certificate
      .conclusion ===
      'q-class-independent' ||
    application
      .certificate
      .conclusion ===
      'selected-classes-independent'
  )
}

function getStabilizedClasses(
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
 * There are currently two LIVE ways to
 * supply the independent demand set.
 *
 * 1. Stabilization certifies an arbitrary
 *    nonconsecutive union P_Q in L.
 *
 * 2. Without stabilization, the TOTAL
 *    class equal to the fixed contribution
 *    is automatically independent.
 *
 * For (2), every cut edge enters L. Hence
 *
 *   d_G^+(v)=r
 *
 * means that v has residual outdegree 0 in
 * H[L]. Two adjacent vertices cannot both
 * have outdegree 0 in the same orientation,
 * so this class is independent.
 */
function getIndependenceCandidates({
  stabilizationApplication,
  fixedOutdegreeContribution,
}: {
  stabilizationApplication:
    StabilizeOutdegreeClassApplication | null

  fixedOutdegreeContribution:
    number
}) {
  const candidates:
    IndependenceCandidate[] = []

  if (
    stabilizationCertifiesIndependence(
      stabilizationApplication,
    )
  ) {
    const qs =
      getStabilizedClasses(
        stabilizationApplication,
      )

    if (
      qs.length >
      0
    ) {
      candidates.push({
        source:
          'stabilization',

        qs,
      })
    }
  }

  const zeroClass =
    fixedOutdegreeContribution

  const alreadyIncluded =
    candidates.some(
      (candidate) =>
        candidate.qs.length ===
          1 &&
        candidate.qs[0] ===
          zeroClass,
    )

  if (
    !alreadyIncluded
  ) {
    candidates.push({
      source:
        'zero-internal',

      qs: [
        zeroClass,
      ],
    })
  }

  return candidates
}

function analyzeCandidate({
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
  candidate,
}: {
  degree:
    number

  workingDegree:
    number

  fixedOutdegreeContribution:
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

  candidate:
    IndependenceCandidate
}): DirectedMengerReservoirV4Analysis {
  const validDegreeFrame =
    Number.isInteger(
      degree,
    ) &&
    Number.isInteger(
      workingDegree,
    ) &&
    Number.isInteger(
      fixedOutdegreeContribution,
    ) &&
    degree >= 0 &&
    workingDegree >= 0 &&
    fixedOutdegreeContribution >=
      0 &&
    degree ===
      workingDegree +
      2 *
        fixedOutdegreeContribution

  const hasLovaszCertificate =
    lovaszApplication !==
    null

  const lovaszCertificateMatchesWorkingDegree =
    lovaszApplication !==
      null &&
    lovaszApplication
      .certificate
      .degree ===
      workingDegree

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

  const hasIndependentSetCertificate =
    candidate.source ===
      'zero-internal' ||
    stabilizationCertifiesIndependence(
      stabilizationApplication,
    )

  const independentSetOnL =
    candidate.source ===
      'zero-internal' ||
    (
      stabilizationApplication !==
        null &&
      stabilizationApplication
        .target ===
        'L'
    )

  const independenceCertificateMatchesDegreeFrame =
    candidate.source ===
      'zero-internal'
      ? candidate.qs.length ===
          1 &&
        candidate.qs[0] ===
          fixedOutdegreeContribution
      : stabilizationApplication !==
          null &&
        stabilizationApplication
          .degree ===
          degree

  const cutPointsFromRToL =
    acrossDirection ===
    'R-to-L'

  const reservoirIsBalanced =
    balancedR

  const qs =
    uniqueSorted(
      candidate.qs,
    )

  /*
   * The maximum TOTAL outdegree available
   * while the fixed oriented factors stay
   * untouched is
   *
   *   r + d(H).
   *
   * A demand class at that maximum cannot
   * be increased by reversing an H-path.
   */
  const maximumCurrentTotalOutdegree =
    fixedOutdegreeContribution +
    workingDegree

  const everySelectedClassCanIncrease =
    qs.length >
      0 &&
    qs.every(
      (q) =>
        q >=
          fixedOutdegreeContribution &&
        q <
          maximumCurrentTotalOutdegree,
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
    qs.length >
      0 &&
    qs.every(
      (q) =>
        normalizedL.includes(
          q,
        ),
    )

  const everySelectedClassIsForbidden =
    qs.length >
      0 &&
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
            (q) =>
              q + 1,
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
    new Set(
      qs,
    )

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
    t ===
      null
      ? null
      : getReservoirMengerK(
          t,
        )

  const residualReservoirSafeFloor =
    t ===
      null
      ? null
      : getReservoirSafeFloor({
          degree:
            workingDegree,

          t,
        })

  const residualReservoirSafeOutdegrees =
    t ===
      null
      ? []
      : getReservoirSafeOutdegrees({
          degree:
            workingDegree,

          t,
        })

  const reservoirSafeFloor =
    residualReservoirSafeFloor ===
      null
      ? null
      : fixedOutdegreeContribution +
        residualReservoirSafeFloor

  const reservoirSafeOutdegrees =
    residualReservoirSafeOutdegrees.map(
      (value) =>
        fixedOutdegreeContribution +
        value,
    )

  const reservoirSafeIntervalIsSafe =
    reservoirSafeOutdegrees
      .length >
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

  const checks:
    ReservoirMengerChecks = {
    validDegreeFrame,
    hasLovaszCertificate,
    lovaszCertificateMatchesWorkingDegree,
    correctCertificateSides,
    hasIndependentSetCertificate,
    independentSetOnL,
    independenceCertificateMatchesDegreeFrame,
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
    ).every(
      Boolean,
    )

  if (
    !applicable ||
    t ===
      null ||
    k ===
      null ||
    residualReservoirSafeFloor ===
      null ||
    reservoirSafeFloor ===
      null ||
    lovaszApplication ===
      null ||
    qs.length ===
      0 ||
    repairedOutdegrees.length ===
      0
  ) {
    return {
      applicable:
        false,

      checks,

      independenceSource:
        candidate.source,

      qs,

      repairedOutdegrees,

      t,

      k,

      reservoirSafeFloor,

      reservoirSafeOutdegrees,

      certificate:
        null,
    }
  }

  let certificateType:
    DirectedMengerReservoirCertificate[
      'type'
    ]

  if (
    candidate.source ===
    'zero-internal'
  ) {
    certificateType =
      'lovasz-zero-internal-reservoir'
  } else if (
    qs.length >
    1
  ) {
    certificateType =
      'lovasz-independent-class-set-reservoir'
  } else {
    certificateType =
      'lovasz-independent-reservoir'
  }

  return {
    applicable:
      true,

    checks,

    independenceSource:
      candidate.source,

    qs,

    repairedOutdegrees,

    t,

    k,

    reservoirSafeFloor,

    reservoirSafeOutdegrees,

    certificate: {
      type:
        certificateType,

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

      independenceSource:
        candidate.source,

      qs,

      repairedOutdegrees,

      q:
        qs[0],

      repairedOutdegree:
        repairedOutdegrees[0],

      repairShift:
        1,

      k,

      residualReservoirSafeFloor,

      residualReservoirSafeOutdegrees,

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
 * Directed Menger Reservoir V4.
 *
 * The theorem runs in the current regular
 * working graph H, while all safety checks
 * are performed on TOTAL outdegrees in the
 * original graph G.
 *
 * If r oriented spanning 2-factors have
 * already been removed, then
 *
 *   d(H)=d(G)-2r
 *
 * and every vertex already has fixed
 * outdegree contribution r.
 */
export function analyzeDirectedMengerReservoirV4({
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
}): DirectedMengerReservoirV4Analysis {
  const candidates =
    getIndependenceCandidates({
      stabilizationApplication,

      fixedOutdegreeContribution,
    })

  let firstAnalysis:
    DirectedMengerReservoirV4Analysis | null =
      null

  for (
    const candidate
    of candidates
  ) {
    const analysis =
      analyzeCandidate({
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

        candidate,
      })

    if (
      firstAnalysis ===
      null
    ) {
      firstAnalysis =
        analysis
    }

    if (
      analysis.applicable
    ) {
      return analysis
    }
  }

  if (
    firstAnalysis !==
    null
  ) {
    return firstAnalysis
  }

  /*
   * This branch is defensive only:
   * zero-internal always supplies at least
   * one candidate.
   */
  const emptyChecks:
    ReservoirMengerChecks = {
    validDegreeFrame:
      false,

    hasLovaszCertificate:
      false,

    lovaszCertificateMatchesWorkingDegree:
      false,

    correctCertificateSides:
      false,

    hasIndependentSetCertificate:
      false,

    independentSetOnL:
      false,

    independenceCertificateMatchesDegreeFrame:
      false,

    cutPointsFromRToL:
      false,

    reservoirIsBalanced:
      false,

    everySelectedClassCanIncrease:
      false,

    everySelectedClassCurrentlyPossible:
      false,

    everySelectedClassIsForbidden:
      false,

    everyRepairedValueIsSafe:
      false,

    allOtherLClassesAreSafe:
      false,

    reservoirSafeIntervalIsSafe:
      false,

    currentRClassesLieInReservoirInterval:
      false,
  }

  return {
    applicable:
      false,

    checks:
      emptyChecks,

    independenceSource:
      'zero-internal',

    qs: [],

    repairedOutdegrees:
      [],

    t:
      null,

    k:
      null,

    reservoirSafeFloor:
      null,

    reservoirSafeOutdegrees:
      [],

    certificate:
      null,
  }
}

/*
 * Backwards-compatible single-q analysis.
 */
export function analyzeDirectedMengerReservoir({
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
}): DirectedMengerReservoirAnalysis {
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

      currentOutdegreesL,

      currentOutdegreesR,
    })

  return {
    applicable:
      analysis.applicable,

    checks:
      analysis.checks,

    q:
      analysis.qs[0] ??
      null,

    repairedOutdegree:
      analysis
        .repairedOutdegrees[0] ??
      null,

    t:
      analysis.t,

    k:
      analysis.k,

    reservoirSafeFloor:
      analysis
        .reservoirSafeFloor,

    reservoirSafeOutdegrees:
      analysis
        .reservoirSafeOutdegrees,

    certificate:
      analysis.certificate,
  }
}

/*
 * Backwards-compatible generalized
 * analysis.
 */
export function analyzeDirectedMengerReservoirClasses({
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
}): DirectedMengerReservoirClassesAnalysis {
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

      currentOutdegreesL,

      currentOutdegreesR,
    })

  return {
    applicable:
      analysis.applicable,

    checks:
      analysis.checks,

    qs:
      analysis.qs,

    repairedOutdegrees:
      analysis
        .repairedOutdegrees,

    t:
      analysis.t,

    k:
      analysis.k,

    reservoirSafeFloor:
      analysis
        .reservoirSafeFloor,

    reservoirSafeOutdegrees:
      analysis
        .reservoirSafeOutdegrees,

    certificate:
      analysis.certificate,
  }
}
