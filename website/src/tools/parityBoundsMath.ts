/*
 * PARITY BOUNDS
 *
 * Automatic regular-graph certificate for
 * a bounded parity orientation.
 *
 * We apply the tool to a simple even
 * d-regular graph H.
 *
 * Ordinary vertices use one parity interval
 *
 *      lower <= d_H^+(v) <= upper
 *
 * and one exceptional vertex in each
 * odd-order component uses
 *
 *      exceptionalLower
 *          <= d_H^+(r)
 *          <= exceptionalUpper.
 *
 * In each interval, the outdegree has the
 * parity of the lower endpoint.
 *
 * The finite numerical certificate below
 * is the regular-graph corollary proved for
 * this tool from the bounded parity
 * orientation criterion.
 */

export type ParityBoundsInterval = {
  lower:
    number

  upper:
    number
}

export type ParityBoundsChecks = {
  evenDegree:
    boolean

  degreeAtLeastFour:
    boolean

  normalRangeValid:
    boolean

  exceptionalRangeValid:
    boolean

  normalEndpointsSameParity:
    boolean

  exceptionalEndpointsSameParity:
    boolean

  midpointCovered:
    boolean

  exceptionalParityCompatible:
    boolean

  exceptionalInACutCheck:
    boolean

  exceptionalInBCutCheck:
    boolean
}

export type ParityBoundsCutWitness = {
  location:
    'A' | 'B'

  a:
    number

  b:
    number

  sigma:
    number

  margin:
    number
}

export type ParityBoundsCertificate = {
  degree:
    number

  midpoint:
    number

  normalInterval:
    ParityBoundsInterval

  exceptionalInterval:
    ParityBoundsInterval

  normalOutdegrees:
    readonly number[]

  exceptionalOutdegrees:
    readonly number[]

  possibleOutdegrees:
    readonly number[]

  alpha:
    number

  beta:
    number

  minimumExceptionalInAMargin:
    number

  minimumExceptionalInBMargin:
    number

  worstExceptionalInACase:
    ParityBoundsCutWitness

  worstExceptionalInBCase:
    ParityBoundsCutWitness
}

export type ParityBoundsAnalysis = {
  applicable:
    boolean

  checks:
    ParityBoundsChecks

  certificate:
    ParityBoundsCertificate | null

  failureReasons:
    readonly string[]
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

function mod2(
  value:
    number,
) {
  return (
    (
      value % 2
    ) +
    2
  ) % 2
}

function sameParity(
  a:
    number,

  b:
    number,
) {
  return (
    mod2(a) ===
    mod2(b)
  )
}

function intervalIsInsideDegreeRange(
  interval:
    ParityBoundsInterval,

  degree:
    number,
) {
  return (
    Number.isInteger(
      interval.lower,
    ) &&
    Number.isInteger(
      interval.upper,
    ) &&
    interval.lower >=
      0 &&
    interval.lower <=
      interval.upper &&
    interval.upper <=
      degree
  )
}

export function getParityIntervalOutdegrees(
  interval:
    ParityBoundsInterval,
) {
  if (
    interval.lower >
    interval.upper
  ) {
    return []
  }

  const values:
    number[] = []

  for (
    let value =
      interval.lower;
    value <=
      interval.upper;
    value += 2
  ) {
    values.push(
      value,
    )
  }

  return values
}

/*
 * Let S=A union B contain the exceptional
 * vertex r and let s=|S|.
 *
 * Because the graph is simple,
 *
 *      d(r,V-S) >= d-s+1.
 *
 * We choose r incident with no 2-edge-cut.
 * Every component of H-S touched by r
 * therefore has boundary at least 4 rather
 * than merely 2.
 *
 * The resulting improvement over the
 * ordinary 2-edge-connected component bound
 * is at least
 *
 *      sigma_d(s)
 *        =
 *      ceil(max(0,d-s+1)/4).
 */
export function getParityBoundsSigma(
  degree:
    number,

  setSize:
    number,
) {
  return Math.ceil(
    Math.max(
      0,

      degree -
      setSize +
      1,
    ) /
      4,
  )
}

function exceptionalInAMargin({
  degree,
  normal,
  exceptional,
  a,
  b,
}: {
  degree:
    number

  normal:
    ParityBoundsInterval

  exceptional:
    ParityBoundsInterval

  a:
    number

  b:
    number
}) {
  const midpoint =
    degree / 2

  const alpha =
    normal.upper -
    midpoint

  const beta =
    midpoint -
    normal.lower

  const sigma =
    getParityBoundsSigma(
      degree,

      a + b,
    )

  /*
   * After comparing the bounded-parity
   * condition with the strengthened
   * component bound, the remaining margin
   * is at least
   *
   *  1
   *  + alpha a
   *  + beta b
   *  + (u_* - u)
   *  + sigma_d(a+b).
   *
   * We discard the additional nonnegative
   * term e(A,B).
   */
  return {
    sigma,

    margin:
      1 +
      alpha * a +
      beta * b +
      (
        exceptional.upper -
        normal.upper
      ) +
      sigma,
  }
}

function exceptionalInBMargin({
  degree,
  normal,
  exceptional,
  a,
  b,
}: {
  degree:
    number

  normal:
    ParityBoundsInterval

  exceptional:
    ParityBoundsInterval

  a:
    number

  b:
    number
}) {
  const midpoint =
    degree / 2

  const alpha =
    normal.upper -
    midpoint

  const beta =
    midpoint -
    normal.lower

  const sigma =
    getParityBoundsSigma(
      degree,

      a + b,
    )

  /*
   * When r lies in B, the exceptional
   * adjustment is
   *
   *      lower - exceptionalLower.
   */
  return {
    sigma,

    margin:
      1 +
      alpha * a +
      beta * b +
      (
        normal.lower -
        exceptional.lower
      ) +
      sigma,
  }
}

/*
 * We only need finitely many numerical
 * checks.
 *
 * Once a+b > d+1, sigma is zero.
 *
 * Since
 *
 *      alpha >= 0
 *      and
 *      beta  >= 0,
 *
 * the remaining expression is
 * coordinatewise nondecreasing.
 *
 * Checking through d+2 in each coordinate
 * therefore also captures the boundary
 * immediately after sigma disappears.
 */
function getFiniteCheckLimit(
  degree:
    number,
) {
  return (
    degree +
    2
  )
}

function analyzeExceptionalInA({
  degree,
  normal,
  exceptional,
}: {
  degree:
    number

  normal:
    ParityBoundsInterval

  exceptional:
    ParityBoundsInterval
}) {
  const limit =
    getFiniteCheckLimit(
      degree,
    )

  let worst:
    ParityBoundsCutWitness = {
    location:
      'A',

    a:
      1,

    b:
      0,

    sigma:
      0,

    margin:
      Number.POSITIVE_INFINITY,
  }

  /*
   * r in A, so a >= 1.
   */
  for (
    let a = 1;
    a <= limit;
    a += 1
  ) {
    for (
      let b = 0;
      b <= limit;
      b += 1
    ) {
      const result =
        exceptionalInAMargin({
          degree,

          normal,

          exceptional,

          a,

          b,
        })

      if (
        result.margin <
        worst.margin
      ) {
        worst = {
          location:
            'A',

          a,

          b,

          sigma:
            result.sigma,

          margin:
            result.margin,
        }
      }
    }
  }

  return worst
}

function analyzeExceptionalInB({
  degree,
  normal,
  exceptional,
}: {
  degree:
    number

  normal:
    ParityBoundsInterval

  exceptional:
    ParityBoundsInterval
}) {
  const limit =
    getFiniteCheckLimit(
      degree,
    )

  let worst:
    ParityBoundsCutWitness = {
    location:
      'B',

    a:
      0,

    b:
      1,

    sigma:
      0,

    margin:
      Number.POSITIVE_INFINITY,
  }

  /*
   * r in B, so b >= 1.
   */
  for (
    let a = 0;
    a <= limit;
    a += 1
  ) {
    for (
      let b = 1;
      b <= limit;
      b += 1
    ) {
      const result =
        exceptionalInBMargin({
          degree,

          normal,

          exceptional,

          a,

          b,
        })

      if (
        result.margin <
        worst.margin
      ) {
        worst = {
          location:
            'B',

          a,

          b,

          sigma:
            result.sigma,

          margin:
            result.margin,
        }
      }
    }
  }

  return worst
}

export function analyzeParityBounds({
  degree,
  normalInterval,
  exceptionalInterval,
}: {
  degree:
    number

  normalInterval:
    ParityBoundsInterval

  exceptionalInterval:
    ParityBoundsInterval
}): ParityBoundsAnalysis {
  const evenDegree =
    Number.isInteger(
      degree,
    ) &&
    degree % 2 ===
      0

  /*
   * Our automatic regular-graph proof uses
   * the existence of a vertex incident with
   * no 2-edge-cut.
   *
   * We currently certify this for simple
   * even-regular graphs of degree at least 4.
   */
  const degreeAtLeastFour =
    degree >=
      4

  const normalRangeValid =
    intervalIsInsideDegreeRange(
      normalInterval,

      degree,
    )

  const exceptionalRangeValid =
    intervalIsInsideDegreeRange(
      exceptionalInterval,

      degree,
    )

  const normalEndpointsSameParity =
    sameParity(
      normalInterval.lower,

      normalInterval.upper,
    )

  const exceptionalEndpointsSameParity =
    sameParity(
      exceptionalInterval.lower,

      exceptionalInterval.upper,
    )

  const midpoint =
    degree /
    2

  /*
   * This guarantees
   *
   *      alpha = upper-d/2 >= 0
   *
   * and
   *
   *      beta = d/2-lower >= 0,
   *
   * which is what makes the global cut
   * inequalities collapse to finitely many
   * numerical checks.
   */
  const midpointCovered =
    normalInterval.lower <=
      midpoint &&
    midpoint <=
      normalInterval.upper

  /*
   * In an odd-order d-regular component,
   *
   *      |E|
   *        =
   *      d|V|/2
   *
   * has parity d/2.
   *
   * All nonexceptional vertices occur an
   * even number of times, so the exceptional
   * parity must equal d/2 mod 2.
   */
  const exceptionalParityCompatible =
    sameParity(
      exceptionalInterval.lower,

      midpoint,
    )

  const basicChecksPass =
    evenDegree &&
    degreeAtLeastFour &&
    normalRangeValid &&
    exceptionalRangeValid &&
    normalEndpointsSameParity &&
    exceptionalEndpointsSameParity &&
    midpointCovered &&
    exceptionalParityCompatible

  const worstA =
    basicChecksPass
      ? analyzeExceptionalInA({
          degree,

          normal:
            normalInterval,

          exceptional:
            exceptionalInterval,
        })
      : null

  const worstB =
    basicChecksPass
      ? analyzeExceptionalInB({
          degree,

          normal:
            normalInterval,

          exceptional:
            exceptionalInterval,
        })
      : null

  const exceptionalInACutCheck =
    worstA !==
      null &&
    worstA.margin >=
      0

  const exceptionalInBCutCheck =
    worstB !==
      null &&
    worstB.margin >=
      0

  const checks:
    ParityBoundsChecks = {
    evenDegree,

    degreeAtLeastFour,

    normalRangeValid,

    exceptionalRangeValid,

    normalEndpointsSameParity,

    exceptionalEndpointsSameParity,

    midpointCovered,

    exceptionalParityCompatible,

    exceptionalInACutCheck,

    exceptionalInBCutCheck,
  }

  const applicable =
    Object
      .values(
        checks,
      )
      .every(
        Boolean,
      )

  const failureReasons:
    string[] = []

  if (
    !evenDegree
  ) {
    failureReasons.push(
      'The working graph must have even regular degree.',
    )
  }

  if (
    !degreeAtLeastFour
  ) {
    failureReasons.push(
      'The automatic regular-graph certificate is currently implemented for degree at least 4.',
    )
  }

  if (
    !normalRangeValid
  ) {
    failureReasons.push(
      'The ordinary interval must lie inside the outdegree range.',
    )
  }

  if (
    !exceptionalRangeValid
  ) {
    failureReasons.push(
      'The exceptional interval must lie inside the outdegree range.',
    )
  }

  if (
    !normalEndpointsSameParity
  ) {
    failureReasons.push(
      'The ordinary lower and upper bounds must have the same parity.',
    )
  }

  if (
    !exceptionalEndpointsSameParity
  ) {
    failureReasons.push(
      'The exceptional lower and upper bounds must have the same parity.',
    )
  }

  if (
    !midpointCovered
  ) {
    failureReasons.push(
      'The ordinary interval must contain d/2 for this automatic certificate.',
    )
  }

  if (
    !exceptionalParityCompatible
  ) {
    failureReasons.push(
      'The exceptional parity must agree with d/2 modulo 2.',
    )
  }

  if (
    basicChecksPass &&
    !exceptionalInACutCheck
  ) {
    failureReasons.push(
      'The exceptional-in-A cut inequality is not certified.',
    )
  }

  if (
    basicChecksPass &&
    !exceptionalInBCutCheck
  ) {
    failureReasons.push(
      'The exceptional-in-B cut inequality is not certified.',
    )
  }

  if (
    !applicable ||
    worstA ===
      null ||
    worstB ===
      null
  ) {
    return {
      applicable:
        false,

      checks,

      certificate:
        null,

      failureReasons,
    }
  }

  const normalOutdegrees =
    getParityIntervalOutdegrees(
      normalInterval,
    )

  const exceptionalOutdegrees =
    getParityIntervalOutdegrees(
      exceptionalInterval,
    )

  const certificate:
    ParityBoundsCertificate = {
    degree,

    midpoint,

    normalInterval: {
      ...normalInterval,
    },

    exceptionalInterval: {
      ...exceptionalInterval,
    },

    normalOutdegrees,

    exceptionalOutdegrees,

    possibleOutdegrees:
      uniqueSorted([
        ...normalOutdegrees,

        ...exceptionalOutdegrees,
      ]),

    alpha:
      normalInterval.upper -
      midpoint,

    beta:
      midpoint -
      normalInterval.lower,

    minimumExceptionalInAMargin:
      worstA.margin,

    minimumExceptionalInBMargin:
      worstB.margin,

    worstExceptionalInACase:
      worstA,

    worstExceptionalInBCase:
      worstB,
  }

  return {
    applicable:
      true,

    checks,

    certificate,

    failureReasons: [],
  }
}

export default
  analyzeParityBounds