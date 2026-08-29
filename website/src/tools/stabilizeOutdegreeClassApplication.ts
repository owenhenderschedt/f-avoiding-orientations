import {
  createStabilizationCertificate,
  createStabilizationClassesCertificate,
  type StabilizeOutdegreeClassCertificate,
  type StabilizeOutdegreeClassesCertificate,
  type StabilizeTarget,
} from './stabilizeOutdegreeClassMath'

export type StabilizeOutdegreeClassApplication = {
  target:
    StabilizeTarget

  /*
   * Compatibility representative.
   *
   * For a singleton selection Q={q}, this
   * is exactly the old q field.  For a
   * genuine multi-class selection it is
   * simply the first element of Q and must
   * not be used to describe the full
   * stabilization certificate.
   *
   * Keeping this field lets the existing
   * single-q reservoir mode continue to
   * recognize singleton applications while
   * the generalized reservoir UI is wired
   * in the next stage.
   */
  q: number

  /*
   * The selected TOTAL outdegree classes.
   *
   *   P_Q = {v in target : d_D^+(v) in Q}.
   */
  qs:
    readonly number[]

  degree: number

  startingOutdegrees:
    readonly number[]

  certificate:
    | StabilizeOutdegreeClassCertificate
    | StabilizeOutdegreeClassesCertificate
}

/*
 * The generalized name is an alias for the
 * live application type.  This keeps the
 * new Q-class reservoir core compatible
 * with the existing single-q plumbing.
 */
export type StabilizeOutdegreeClassesApplication =
  StabilizeOutdegreeClassApplication

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

export function createStabilizeOutdegreeClassesApplication({
  target,
  qs,
  degree,
  currentOutdegrees,
}: {
  target:
    StabilizeTarget

  qs:
    readonly number[]

  degree:
    number

  currentOutdegrees:
    readonly number[]
}): StabilizeOutdegreeClassApplication | null {
  const startingOutdegrees =
    uniqueSorted(
      currentOutdegrees,
    )

  const normalizedQ =
    uniqueSorted(qs)

  if (
    normalizedQ.length ===
    0
  ) {
    return null
  }

  /*
   * Preserve the old certificate for a
   * singleton selection.  Consequently the
   * current single-q reservoir mode still
   * works exactly as before when |Q|=1.
   */
  if (
    normalizedQ.length ===
    1
  ) {
    const q =
      normalizedQ[0]

    const certificate =
      createStabilizationCertificate({
        target,

        q,

        degree,

        currentOutdegrees:
          startingOutdegrees,
      })

    if (
      certificate ===
      null
    ) {
      return null
    }

    return {
      target,

      q,

      qs:
        normalizedQ,

      degree,

      startingOutdegrees,

      certificate,
    }
  }

  const certificate =
    createStabilizationClassesCertificate({
      target,

      qs:
        normalizedQ,

      degree,

      currentOutdegrees:
        startingOutdegrees,
    })

  if (
    certificate ===
    null
  ) {
    return null
  }

  return {
    target,

    q:
      normalizedQ[0],

    qs:
      normalizedQ,

    degree,

    startingOutdegrees,

    certificate,
  }
}

/*
 * Backwards-compatible single-q creator.
 */
export function createStabilizeOutdegreeClassApplication({
  target,
  q,
  degree,
  currentOutdegrees,
}: {
  target:
    StabilizeTarget

  q: number

  degree: number

  currentOutdegrees:
    readonly number[]
}): StabilizeOutdegreeClassApplication | null {
  return (
    createStabilizeOutdegreeClassesApplication({
      target,

      qs: [q],

      degree,

      currentOutdegrees,
    })
  )
}
