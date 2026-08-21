import type {
  LovaszPair,
} from './lovaszPartition'
import type {
  AcrossDirection,
} from './orientAcrossPartition'

export type MaLuTarget =
  | 'G'
  | 'L'
  | 'R'

export type MaLuPartTarget =
  | 'L'
  | 'R'

/*
 * ============================================================
 * NEW MA-LU SELECTION MODEL
 * ============================================================
 *
 * These types and functions describe
 * the redesigned tool.
 *
 * The user chooses a set S of
 * outdegrees to avoid INSIDE the graph
 * to which Ma-Lu is applied.
 *
 * For example, if the target is G[L],
 * then S={2,4} means
 *
 *   d^+_{G[L]}(v) notin {2,4}.
 *
 * No reference to the original global
 * forbidden set F is needed.
 */

export type MaLuSelectionDegreeCheck = {
  degree: number

  /*
   * Only selected values between
   * 0 and degree can actually occur at
   * a vertex of this degree.
   *
   * Thus Ma-Lu sees
   *
   *   S_r = S intersect [0,r].
   */
  relevantForbiddenSet: number[]

  hasNoConsecutiveValues: boolean

  /*
   * For positive degree r,
   * Corollary 3.1 requires
   *
   *   2|S_r| <= r - 1.
   */
  sizeBoundHolds: boolean | null

  /*
   * Degree 0 is handled directly.
   * The only possible outdegree is 0,
   * so an isolated vertex is safe
   * exactly when 0 is not forbidden.
   */
  isolatedVertexSafe: boolean | null

  passes: boolean
}

export type MaLuSelectionCertificate = {
  target: MaLuTarget

  /*
   * The exact set requested by the
   * user, normalized and sorted.
   */
  selectedForbiddenSet: number[]

  /*
   * These are the vertex degrees that
   * the playground currently knows
   * may occur in the target graph.
   *
   * Examples:
   *
   * - a 6-regular graph: [6]
   * - Delta(H) <= 4: [0,1,2,3,4]
   *
   * This makes the engine ready for
   * future structural tools that give
   * stronger degree information.
   */
  possibleDegrees: number[]

  checks: MaLuSelectionDegreeCheck[]

  applicable: boolean

  /*
   * Convenient access for the compact
   * selector UI.
   */
  firstFailingCheck:
    MaLuSelectionDegreeCheck | null
}

type MaLuSelectionCertificateArgs = {
  target: MaLuTarget

  selectedForbiddenSet:
    readonly number[]

  possibleDegrees:
    readonly number[]
}

type MaLuWholeSelectionArgs = {
  degree: number

  selectedForbiddenSet:
    readonly number[]
}

type MaLuPartSelectionArgs = {
  target: MaLuPartTarget

  partition: LovaszPair | null

  selectedForbiddenSet:
    readonly number[]
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

export function getMaLuSelectableValues(
  maxDegree: number,
) {
  const values: number[] = []

  for (
    let value = 0;
    value <= maxDegree;
    value += 1
  ) {
    values.push(value)
  }

  return values
}

export function hasConsecutiveForbiddenValues(
  forbiddenSet:
    readonly number[],
) {
  return forbiddenSet.some(
    (value) =>
      forbiddenSet.includes(
        value + 1,
      ),
  )
}

/*
 * At a vertex of degree r, selected
 * values larger than r are impossible
 * anyway and therefore irrelevant.
 */
export function getRelevantMaLuForbiddenSet(
  selectedForbiddenSet:
    readonly number[],

  degree: number,
) {
  return uniqueSorted(
    selectedForbiddenSet.filter(
      (value) =>
        value >= 0 &&
        value <= degree,
    ),
  )
}

export function getMaLuSelectionDegreeCheck(
  degree: number,

  selectedForbiddenSet:
    readonly number[],
): MaLuSelectionDegreeCheck {
  const relevantForbiddenSet =
    getRelevantMaLuForbiddenSet(
      selectedForbiddenSet,
      degree,
    )

  const hasNoConsecutiveValues =
    !hasConsecutiveForbiddenValues(
      relevantForbiddenSet,
    )

  /*
   * Isolated vertices are handled
   * directly rather than pretending
   * Corollary 3.1 applies at degree 0.
   */
  if (degree === 0) {
    const isolatedVertexSafe =
      !relevantForbiddenSet.includes(
        0,
      )

    return {
      degree,

      relevantForbiddenSet,

      hasNoConsecutiveValues,

      sizeBoundHolds: null,

      isolatedVertexSafe,

      passes:
        isolatedVertexSafe,
    }
  }

  const sizeBoundHolds =
    2 *
      relevantForbiddenSet.length <=
    degree - 1

  return {
    degree,

    relevantForbiddenSet,

    hasNoConsecutiveValues,

    sizeBoundHolds,

    isolatedVertexSafe: null,

    passes:
      hasNoConsecutiveValues &&
      sizeBoundHolds,
  }
}

export function getMaLuSelectionCertificate({
  target,
  selectedForbiddenSet,
  possibleDegrees,
}: MaLuSelectionCertificateArgs):
  MaLuSelectionCertificate {
  const normalizedSelection =
    uniqueSorted(
      selectedForbiddenSet,
    )

  const normalizedDegrees =
    uniqueSorted(
      possibleDegrees.filter(
        (degree) =>
          degree >= 0,
      ),
    )

  const checks =
    normalizedDegrees.map(
      (degree) =>
        getMaLuSelectionDegreeCheck(
          degree,
          normalizedSelection,
        ),
    )

  const firstFailingCheck =
    checks.find(
      (check) =>
        !check.passes,
    ) ?? null

  return {
    target,

    selectedForbiddenSet:
      normalizedSelection,

    possibleDegrees:
      normalizedDegrees,

    checks,

    applicable:
      checks.length > 0 &&
      firstFailingCheck === null,

    firstFailingCheck,
  }
}

/*
 * Whole current graph.
 *
 * The residual graph is regular, so
 * only one degree needs to be checked.
 */
export function getMaLuWholeSelectionCertificate({
  degree,
  selectedForbiddenSet,
}: MaLuWholeSelectionArgs):
  MaLuSelectionCertificate {
  return getMaLuSelectionCertificate({
    target: 'G',

    selectedForbiddenSet,

    possibleDegrees: [
      degree,
    ],
  })
}

/*
 * Lovasz part.
 *
 * At present the only degree
 * information supplied by a Lovasz
 * partition is
 *
 *   Delta(G[L]) <= s
 *
 * or
 *
 *   Delta(G[R]) <= t.
 *
 * Therefore every degree
 *
 *   0,1,...,s
 *
 * or
 *
 *   0,1,...,t
 *
 * must be treated as possible.
 *
 * Importantly, this calculation does
 * NOT depend on the direction of the
 * crossing edges.
 */
export function getMaLuPartSelectionCertificate({
  target,
  partition,
  selectedForbiddenSet,
}: MaLuPartSelectionArgs):
  MaLuSelectionCertificate {
  if (partition === null) {
    return {
      target,

      selectedForbiddenSet:
        uniqueSorted(
          selectedForbiddenSet,
        ),

      possibleDegrees: [],

      checks: [],

      applicable: false,

      firstFailingCheck: null,
    }
  }

  const maxDegree =
    target === 'L'
      ? partition.s
      : partition.t

  return getMaLuSelectionCertificate({
    target,

    selectedForbiddenSet,

    possibleDegrees:
      getMaLuSelectableValues(
        maxDegree,
      ),
  })
}

/*
 * ============================================================
 * CURRENT / LEGACY MODEL
 * ============================================================
 *
 * Everything below this line supports
 * the currently working implementation
 * while we migrate the playground to
 * the new selection model.
 *
 * We will remove this translation layer
 * only after the selector, state, and
 * outdegree display have all moved to
 * user-selected local sets.
 */

export type MaLuDegreeCheck = {
  internalDegree: number

  localForbiddenSet: number[]

  fixedContribution: number

  hasNoConsecutiveValues: boolean

  sizeBoundHolds: boolean | null

  isolatedVertexSafe: boolean | null

  passes: boolean
}

export type MaLuCertificate = {
  target: MaLuTarget

  ready: boolean

  applicable: boolean

  maxInternalDegree: number | null

  checks: MaLuDegreeCheck[]
}

export type MaLuWholeGraphCertificateArgs = {
  degree: number

  fixedOutdegreeContribution: number

  forbiddenSet:
    readonly number[]
}

export type MaLuPartCertificateArgs = {
  target: MaLuPartTarget

  degree: number

  fixedOutdegreeContribution: number

  forbiddenSet:
    readonly number[]

  partition: LovaszPair | null

  acrossDirection:
    AcrossDirection | null
}

export type MaLuCertificateArgs = {
  target: MaLuTarget

  degree: number

  fixedOutdegreeContribution: number

  forbiddenSet:
    readonly number[]

  partition: LovaszPair | null

  acrossDirection:
    AcrossDirection | null
}

/*
 * Legacy translation:
 *
 * if a already contributes to the
 * final outdegree, then a+j is
 * forbidden exactly when
 *
 *   j = f-a
 *
 * for some f in the original F.
 */
export function translateForbiddenSet(
  forbiddenSet:
    readonly number[],

  fixedContribution: number,

  internalDegree: number,
) {
  const translated:
    number[] = []

  for (
    const forbidden
    of forbiddenSet
  ) {
    const localValue =
      forbidden -
      fixedContribution

    if (
      localValue >= 0 &&
      localValue <=
        internalDegree
    ) {
      translated.push(
        localValue,
      )
    }
  }

  return uniqueSorted(
    translated,
  )
}

export function getMaLuDegreeCheck(
  internalDegree: number,

  localForbiddenSet:
    number[],

  fixedContribution: number,
): MaLuDegreeCheck {
  const hasNoConsecutiveValues =
    !hasConsecutiveForbiddenValues(
      localForbiddenSet,
    )

  if (internalDegree === 0) {
    const isolatedVertexSafe =
      !localForbiddenSet.includes(
        0,
      )

    return {
      internalDegree,

      localForbiddenSet,

      fixedContribution,

      hasNoConsecutiveValues,

      sizeBoundHolds: null,

      isolatedVertexSafe,

      passes:
        isolatedVertexSafe,
    }
  }

  const sizeBoundHolds =
    2 *
      localForbiddenSet.length <=
    internalDegree - 1

  return {
    internalDegree,

    localForbiddenSet,

    fixedContribution,

    hasNoConsecutiveValues,

    sizeBoundHolds,

    isolatedVertexSafe: null,

    passes:
      hasNoConsecutiveValues &&
      sizeBoundHolds,
  }
}

export function getMaLuWholeGraphCertificate({
  degree,
  fixedOutdegreeContribution,
  forbiddenSet,
}: MaLuWholeGraphCertificateArgs):
  MaLuCertificate {
  const localForbiddenSet =
    translateForbiddenSet(
      forbiddenSet,

      fixedOutdegreeContribution,

      degree,
    )

  const check =
    getMaLuDegreeCheck(
      degree,

      localForbiddenSet,

      fixedOutdegreeContribution,
    )

  return {
    target: 'G',

    ready: true,

    applicable:
      check.passes,

    maxInternalDegree:
      degree,

    checks: [check],
  }
}

export function maLuCrossingEdgesPointOut(
  target: MaLuPartTarget,

  acrossDirection:
    AcrossDirection,
) {
  return (
    (
      target === 'L' &&
      acrossDirection ===
        'L-to-R'
    ) ||
    (
      target === 'R' &&
      acrossDirection ===
        'R-to-L'
    )
  )
}

export function getMaLuPartCertificate({
  target,
  degree,
  fixedOutdegreeContribution,
  forbiddenSet,
  partition,
  acrossDirection,
}: MaLuPartCertificateArgs):
  MaLuCertificate {
  if (
    partition === null ||
    acrossDirection === null
  ) {
    return {
      target,

      ready: false,

      applicable: false,

      maxInternalDegree:
        partition === null
          ? null
          : target === 'L'
            ? partition.s
            : partition.t,

      checks: [],
    }
  }

  const maxInternalDegree =
    target === 'L'
      ? partition.s
      : partition.t

  const crossingPointsOut =
    maLuCrossingEdgesPointOut(
      target,
      acrossDirection,
    )

  const checks:
    MaLuDegreeCheck[] = []

  for (
    let internalDegree = 0;

    internalDegree <=
      maxInternalDegree;

    internalDegree += 1
  ) {
    const crossingContribution =
      crossingPointsOut
        ? degree -
          internalDegree
        : 0

    const totalFixedContribution =
      fixedOutdegreeContribution +
      crossingContribution

    const localForbiddenSet =
      translateForbiddenSet(
        forbiddenSet,

        totalFixedContribution,

        internalDegree,
      )

    checks.push(
      getMaLuDegreeCheck(
        internalDegree,

        localForbiddenSet,

        totalFixedContribution,
      ),
    )
  }

  return {
    target,

    ready: true,

    applicable:
      checks.every(
        (check) =>
          check.passes,
      ),

    maxInternalDegree,

    checks,
  }
}

export function getMaLuCertificate({
  target,
  degree,
  fixedOutdegreeContribution,
  forbiddenSet,
  partition,
  acrossDirection,
}: MaLuCertificateArgs):
  MaLuCertificate {
  if (target === 'G') {
    return getMaLuWholeGraphCertificate({
      degree,

      fixedOutdegreeContribution,

      forbiddenSet,
    })
  }

  return getMaLuPartCertificate({
    target,

    degree,

    fixedOutdegreeContribution,

    forbiddenSet,

    partition,

    acrossDirection,
  })
}