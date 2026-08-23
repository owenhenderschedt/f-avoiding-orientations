export type HasanvandTarget =
  | 'G'
  | 'L'
  | 'R'

export type HasanvandMode =
  | 'uniform'
  | 'by-degree'

export type HasanvandDegreeRule = {
  minDegree: number
  maxDegree: number
  p: number
  q: number
}

export type HasanvandDegreeCheck = {
  degree: number

  rule:
    HasanvandDegreeRule | null

  exactlyOneRule: boolean

  pLessThanQ: boolean

  qCondition: boolean

  pCondition: boolean

  balancedLowerFits: boolean

  balancedUpperFits: boolean

  theoremConditionsHold: boolean

  balancedCertificateHolds: boolean

  applicable: boolean
}

export type HasanvandCertificate = {
  possibleDegrees:
    readonly number[]

  checks:
    readonly HasanvandDegreeCheck[]

  allDegreesCovered: boolean

  rulesAreDisjoint: boolean

  theoremConditionsHold: boolean

  balancedCertificateHolds: boolean

  applicable: boolean
}

export function uniqueSorted(
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

export function getHasanvandValues(
  p: number,
  q: number,
) {
  return uniqueSorted([
    p,
    p + 1,
    q - 1,
    q,
  ])
}

/*
 * Hasanvand formally gives
 *
 *   {p, p+1, q-1, q}.
 *
 * A vertex of degree r can of course
 * only realize outdegrees in
 *
 *   {0,...,r}.
 *
 * We therefore intersect the four
 * formal levels with the actually
 * possible outdegree range.
 */
export function getHasanvandValuesForDegree(
  degree: number,

  p: number,
  q: number,
) {
  return getHasanvandValues(
    p,
    q,
  ).filter(
    (value) =>
      value >= 0 &&
      value <= degree,
  )
}

/*
 * Return every rule whose degree range
 * contains the given degree.
 *
 * A valid application must have
 * exactly one such rule for every
 * possible degree.
 */
export function getHasanvandRulesForDegree(
  rules:
    readonly HasanvandDegreeRule[],

  degree: number,
) {
  return rules.filter(
    (rule) =>
      degree >=
        rule.minDegree &&
      degree <=
        rule.maxDegree,
  )
}

export function getHasanvandRuleForDegree(
  rules:
    readonly HasanvandDegreeRule[],

  degree: number,
) {
  const matches =
    getHasanvandRulesForDegree(
      rules,
      degree,
    )

  if (
    matches.length !==
    1
  ) {
    return null
  }

  return matches[0]
}

/*
 * Hasanvand's theorem requires
 *
 *   p(v) < q(v),
 *
 *   q(v) >= d(v)/2,
 *
 *   p(v) >= q(v)/2 - 2.
 *
 * To certify the interval-orientation
 * hypothesis automatically, we use a
 * balanced orientation.
 *
 * At a vertex of degree r, balance gives
 *
 *   floor(r/2)
 *   or
 *   ceil(r/2).
 *
 * Hence that balanced orientation lies
 * inside [p,q] whenever
 *
 *   p <= floor(r/2)
 *
 * and
 *
 *   q >= ceil(r/2).
 */
export function getHasanvandDegreeCheck({
  degree,
  rules,
}: {
  degree: number

  rules:
    readonly HasanvandDegreeRule[]
}): HasanvandDegreeCheck {
  const matchingRules =
    getHasanvandRulesForDegree(
      rules,
      degree,
    )

  const exactlyOneRule =
    matchingRules.length ===
    1

  const rule =
    exactlyOneRule
      ? matchingRules[0]
      : null

  if (
    rule === null
  ) {
    return {
      degree,

      rule: null,

      exactlyOneRule:
        false,

      pLessThanQ:
        false,

      qCondition:
        false,

      pCondition:
        false,

      balancedLowerFits:
        false,

      balancedUpperFits:
        false,

      theoremConditionsHold:
        false,

      balancedCertificateHolds:
        false,

      applicable:
        false,
    }
  }

  const pLessThanQ =
    rule.p < rule.q

  const qCondition =
    2 * rule.q >=
    degree

  const pCondition =
    2 * rule.p >=
    rule.q - 4

  const balancedLow =
    globalThis.Math.floor(
      degree / 2,
    )

  const balancedHigh =
    globalThis.Math.ceil(
      degree / 2,
    )

  const balancedLowerFits =
    rule.p <=
    balancedLow

  const balancedUpperFits =
    rule.q >=
    balancedHigh

  const theoremConditionsHold =
    pLessThanQ &&
    qCondition &&
    pCondition

  const balancedCertificateHolds =
    balancedLowerFits &&
    balancedUpperFits

  return {
    degree,

    rule,

    exactlyOneRule,

    pLessThanQ,

    qCondition,

    pCondition,

    balancedLowerFits,

    balancedUpperFits,

    theoremConditionsHold,

    balancedCertificateHolds,

    applicable:
      theoremConditionsHold &&
      balancedCertificateHolds,
  }
}

/*
 * Check an entire degree-rule system.
 *
 * possibleDegrees contains the degrees
 * that may actually occur in the target
 * graph represented by the playground.
 *
 * For G this will usually be one degree.
 *
 * For a Lovasz part with
 *
 *   Delta(H) <= s,
 *
 * the playground conservatively takes
 *
 *   possibleDegrees = {0,...,s}.
 */
export function getHasanvandCertificate({
  possibleDegrees,
  rules,
}: {
  possibleDegrees:
    readonly number[]

  rules:
    readonly HasanvandDegreeRule[]
}): HasanvandCertificate {
  const degrees =
    uniqueSorted(
      possibleDegrees,
    )

  const checks =
    degrees.map(
      (degree) =>
        getHasanvandDegreeCheck({
          degree,
          rules,
        }),
    )

  const allDegreesCovered =
    checks.every(
      (check) =>
        check.exactlyOneRule,
    )

  /*
   * Since every possible degree must
   * lie in exactly one rule, overlap on
   * a possible degree is automatically
   * detected here as well.
   */
  const rulesAreDisjoint =
    degrees.every(
      (degree) =>
        getHasanvandRulesForDegree(
          rules,
          degree,
        ).length <=
        1,
    )

  const theoremConditionsHold =
    checks.every(
      (check) =>
        check
          .theoremConditionsHold,
    )

  const balancedCertificateHolds =
    checks.every(
      (check) =>
        check
          .balancedCertificateHolds,
    )

  return {
    possibleDegrees:
      degrees,

    checks,

    allDegreesCovered,

    rulesAreDisjoint,

    theoremConditionsHold,

    balancedCertificateHolds,

    applicable:
      allDegreesCovered &&
      rulesAreDisjoint &&
      theoremConditionsHold &&
      balancedCertificateHolds,
  }
}

/*
 * Convenient rule for the uniform mode.
 *
 * We do not assume the graph is regular:
 * this simply assigns the same pair
 * (p,q) to every degree in the supplied
 * range.
 */
export function createUniformHasanvandRule({
  minDegree,
  maxDegree,
  p,
  q,
}: {
  minDegree: number
  maxDegree: number
  p: number
  q: number
}): HasanvandDegreeRule {
  return {
    minDegree,
    maxDegree,
    p,
    q,
  }
}