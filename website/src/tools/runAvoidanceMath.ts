export type RunAvoidanceTarget =
  | 'G'
  | 'L'
  | 'R'

export type RunAvoidanceSide =
  | 'low'
  | 'high'

export type RunAvoidanceInterval = {
  lower: number
  upper: number
}

export type RunAvoidanceDegreeCheck = {
  degree: number

  r: number

  /*
   * s_r = r + ceil(r/2).
   */
  shift: number

  side:
    RunAvoidanceSide

  /*
   * The local outdegrees that Run
   * Avoidance is asked to avoid at a
   * vertex of this degree.
   *
   * These are outdegrees INSIDE the
   * graph H to which the theorem is
   * being applied.
   */
  localForbiddenSet:
    number[]

  /*
   * LOW:
   *
   *   {0,...,d_H(v)-s_r-1}
   *
   * HIGH:
   *
   *   {s_r+1,...,d_H(v)}
   *
   * Null means that the corresponding
   * interval is empty.
   */
  allowedInterval:
    RunAvoidanceInterval | null

  /*
   * True exactly when every selected
   * local value lies in the interval
   * required by the theorem.
   *
   * The empty local list always
   * satisfies this condition.
   */
  rangeConditionHolds:
    boolean

  /*
   * Length of the longest block of
   * consecutive integers in the local
   * forbidden set.
   *
   * The theorem requires this to be at
   * most r.
   */
  longestConsecutiveRun:
    number

  runConditionHolds:
    boolean

  passes:
    boolean
}

export function uniqueSortedRunValues(
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
 * The theorem uses
 *
 *   s_r = r + ceil(r/2).
 */
export function getRunAvoidanceShift(
  r: number,
) {
  return (
    r +
    Math.ceil(
      r / 2,
    )
  )
}

/*
 * Return the length of the longest
 * consecutive block in a finite set of
 * integers.
 *
 * Examples:
 *
 *   {}              -> 0
 *   {1,3,5}         -> 1
 *   {1,2,5,6,7,9}   -> 3
 */
export function getLongestConsecutiveRun(
  values:
    readonly number[],
) {
  const normalized =
    uniqueSortedRunValues(
      values,
    )

  if (
    normalized.length ===
    0
  ) {
    return 0
  }

  let longest = 1
  let current = 1

  for (
    let index = 1;
    index <
      normalized.length;
    index += 1
  ) {
    if (
      normalized[index] ===
      normalized[index - 1] +
        1
    ) {
      current += 1
    } else {
      current = 1
    }

    longest =
      Math.max(
        longest,
        current,
      )
  }

  return longest
}

/*
 * Return the interval in which the
 * generalized Run Avoidance theorem
 * permits the local forbidden list.
 *
 * LOW VERSION
 * -----------
 *
 *   F_H(v)
 *     subseteq
 *   {0,...,d_H(v)-s_r-1}.
 *
 *
 * HIGH VERSION
 * ------------
 *
 * This is obtained from the low version
 * by reversing every edge:
 *
 *   F_H(v)
 *     subseteq
 *   {s_r+1,...,d_H(v)}.
 *
 *
 * If the lower endpoint exceeds the
 * upper endpoint, the permitted
 * interval is empty and we return null.
 */
export function getRunAvoidanceAllowedInterval(
  degree: number,

  r: number,

  side:
    RunAvoidanceSide,
): RunAvoidanceInterval | null {
  if (
    !Number.isInteger(
      degree,
    ) ||
    degree < 0 ||
    !Number.isInteger(
      r,
    ) ||
    r < 1
  ) {
    return null
  }

  const shift =
    getRunAvoidanceShift(
      r,
    )

  const lower =
    side === 'low'
      ? 0
      : shift + 1

  const upper =
    side === 'low'
      ? degree -
        shift -
        1
      : degree

  if (
    lower > upper
  ) {
    return null
  }

  return {
    lower,
    upper,
  }
}

/*
 * Check the generalized theorem at one
 * vertex degree.
 *
 * The theorem says that Run Avoidance
 * applies when:
 *
 *   1. every local forbidden value lies
 *      in the permitted low or high
 *      interval; and
 *
 *   2. the local forbidden set contains
 *      no r+1 consecutive integers.
 *
 * Notice that an empty local forbidden
 * set always passes. This is essential
 * on Lovasz parts: low-degree vertices
 * may have no relevant translated
 * targets even though higher-degree
 * vertices do.
 */
export function getRunAvoidanceDegreeCheck({
  degree,
  r,
  side,
  localForbiddenSet,
}: {
  degree: number

  r: number

  side:
    RunAvoidanceSide

  localForbiddenSet:
    readonly number[]
}): RunAvoidanceDegreeCheck {
  const normalized =
    uniqueSortedRunValues(
      localForbiddenSet,
    )

  const validParameters =
    Number.isInteger(
      degree,
    ) &&
    degree >= 0 &&
    Number.isInteger(
      r,
    ) &&
    r >= 1

  const shift =
    validParameters
      ? getRunAvoidanceShift(
          r,
        )
      : 0

  const allowedInterval =
    validParameters
      ? getRunAvoidanceAllowedInterval(
          degree,
          r,
          side,
        )
      : null

  const rangeConditionHolds =
    validParameters &&
    normalized.every(
      (value) =>
        Number.isInteger(
          value,
        ) &&
        allowedInterval !==
          null &&
        value >=
          allowedInterval.lower &&
        value <=
          allowedInterval.upper,
    )

  /*
   * Array.every is intentionally
   * vacuous on the empty set. Thus an
   * empty local list passes the range
   * condition even when the permitted
   * interval itself is empty.
   */
  const correctedRangeCondition =
    normalized.length ===
      0
      ? validParameters
      : rangeConditionHolds

  const longestConsecutiveRun =
    getLongestConsecutiveRun(
      normalized,
    )

  const runConditionHolds =
    validParameters &&
    longestConsecutiveRun <=
      r

  return {
    degree,

    r,

    shift,

    side,

    localForbiddenSet:
      normalized,

    allowedInterval,

    rangeConditionHolds:
      correctedRangeCondition,

    longestConsecutiveRun,

    runConditionHolds,

    passes:
      correctedRangeCondition &&
      runConditionHolds,
  }
}

/*
 * Values of r worth presenting to the
 * user for a graph whose maximum
 * possible degree is maxDegree.
 *
 * We retain precisely those r for which
 * the low/high permitted interval is
 * nonempty at degree maxDegree:
 *
 *   s_r + 1 <= maxDegree.
 *
 * Larger r could certify only empty
 * local lists and therefore cannot
 * eliminate any outdegree.
 */
export function getRunAvoidanceRValues(
  maxDegree: number,
) {
  if (
    !Number.isInteger(
      maxDegree,
    ) ||
    maxDegree < 0
  ) {
    return []
  }

  const values:
    number[] = []

  for (
    let r = 1;
    ;
    r += 1
  ) {
    const shift =
      getRunAvoidanceShift(
        r,
      )

    if (
      shift + 1 >
      maxDegree
    ) {
      break
    }

    values.push(
      r,
    )
  }

  return values
}
