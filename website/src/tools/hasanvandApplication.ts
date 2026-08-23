import {
  getHasanvandCertificate,
  type HasanvandCertificate,
  type HasanvandDegreeRule,
  type HasanvandMode,
  type HasanvandTarget,
} from './hasanvandMath'

export type HasanvandApplication = {
  target: HasanvandTarget

  mode: HasanvandMode

  /*
   * Maximum degree that the playground
   * knows the target graph H can have.
   *
   * For G this is its regular degree.
   *
   * For a Lovasz part this is the
   * corresponding maximum-degree bound.
   */
  maxDegree: number

  /*
   * Degrees that may actually occur in
   * the abstract target graph.
   *
   * For a regular whole graph:
   *
   *   {d}.
   *
   * For a Lovasz part with
   *
   *   Delta(H) <= s,
   *
   * the playground conservatively uses
   *
   *   {0,...,s}.
   */
  possibleDegrees:
    readonly number[]

  /*
   * Degree-dependent definitions of
   * p(v) and q(v).
   */
  rules:
    readonly HasanvandDegreeRule[]

  /*
   * Save the exact certificate used at
   * application time.
   *
   * This lets the reference panel later
   * explain precisely why the chosen
   * Hasanvand application was valid.
   */
  certificate:
    HasanvandCertificate
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

function rulesAreWellFormed(
  rules:
    readonly HasanvandDegreeRule[],

  maxDegree: number,
) {
  if (
    rules.length === 0
  ) {
    return false
  }

  return rules.every(
    (rule) =>
      Number.isInteger(
        rule.minDegree,
      ) &&
      Number.isInteger(
        rule.maxDegree,
      ) &&
      Number.isInteger(
        rule.p,
      ) &&
      Number.isInteger(
        rule.q,
      ) &&
      rule.minDegree >= 0 &&
      rule.maxDegree >=
        rule.minDegree &&
      rule.maxDegree <=
        maxDegree,
  )
}

function possibleDegreesAreWellFormed(
  possibleDegrees:
    readonly number[],

  maxDegree: number,
) {
  if (
    possibleDegrees.length ===
    0
  ) {
    return false
  }

  return possibleDegrees.every(
    (degree) =>
      Number.isInteger(
        degree,
      ) &&
      degree >= 0 &&
      degree <= maxDegree,
  )
}

function normalizeRules(
  rules:
    readonly HasanvandDegreeRule[],
) {
  return rules
    .map(
      (rule) => ({
        minDegree:
          rule.minDegree,

        maxDegree:
          rule.maxDegree,

        p:
          rule.p,

        q:
          rule.q,
      }),
    )
    .sort(
      (a, b) =>
        a.minDegree -
          b.minDegree ||
        a.maxDegree -
          b.maxDegree ||
        a.p -
          b.p ||
        a.q -
          b.q,
    )
}

/*
 * Create a permanent Hasanvand
 * application only after the entire
 * degree-rule system has been
 * certified.
 *
 * Returning null means the proposed
 * application must not be added to
 * playground state.
 */
export function createHasanvandApplication({
  target,
  mode,
  maxDegree,
  possibleDegrees,
  rules,
}: {
  target: HasanvandTarget

  mode: HasanvandMode

  maxDegree: number

  possibleDegrees:
    readonly number[]

  rules:
    readonly HasanvandDegreeRule[]
}): HasanvandApplication | null {
  if (
    !Number.isInteger(
      maxDegree,
    ) ||
    maxDegree < 0
  ) {
    return null
  }

  if (
    !possibleDegreesAreWellFormed(
      possibleDegrees,
      maxDegree,
    )
  ) {
    return null
  }

  if (
    !rulesAreWellFormed(
      rules,
      maxDegree,
    )
  ) {
    return null
  }

  if (
    mode === 'uniform' &&
    rules.length !== 1
  ) {
    return null
  }

  const normalizedDegrees =
    uniqueSorted(
      possibleDegrees,
    )

  const normalizedRules =
    normalizeRules(
      rules,
    )

  const certificate =
    getHasanvandCertificate({
      possibleDegrees:
        normalizedDegrees,

      rules:
        normalizedRules,
    })

  if (
    !certificate.applicable
  ) {
    return null
  }

  return {
    target,

    mode,

    maxDegree,

    possibleDegrees:
      normalizedDegrees,

    rules:
      normalizedRules,

    certificate,
  }
}

/*
 * Recompute the certificate attached
 * to an application.
 *
 * This is useful as a defensive check
 * when later playground code needs to
 * verify that a saved application still
 * matches its mathematical data.
 */
export function getHasanvandApplicationCertificate(
  application:
    HasanvandApplication,
) {
  return getHasanvandCertificate({
    possibleDegrees:
      application
        .possibleDegrees,

    rules:
      application.rules,
  })
}

/*
 * Convenient test for displaying the
 * simple constant-parameter form.
 *
 * A uniform application always has one
 * rule, but keeping this helper here
 * prevents presentation components from
 * depending on that implementation
 * detail.
 */
export function getUniformHasanvandRule(
  application:
    HasanvandApplication,
) {
  if (
    application.mode !==
    'uniform' ||
    application.rules.length !==
    1
  ) {
    return null
  }

  return application.rules[0]
}