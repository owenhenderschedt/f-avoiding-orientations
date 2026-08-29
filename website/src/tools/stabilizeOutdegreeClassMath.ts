export type StabilizeTarget =
  | 'G'
  | 'L'
  | 'R'

export type StabilizeOutdegreeClassCertificate = {
  target: StabilizeTarget
  q: number
  conclusion: 'q-class-independent'
  createdOutdegrees: readonly number[]
}

export type StabilizeOutdegreeClassesCertificate = {
  target: StabilizeTarget

  /*
   * TOTAL outdegree classes being stabilized:
   *
   *   P_Q = {v in target : d_D^+(v) in Q}.
   */
  qs: readonly number[]

  conclusion: 'selected-classes-independent'

  /*
   * If x -> y has outdegrees a,b in Q, reversing xy gives
   *
   *   a -> a-1,   b -> b+1.
   *
   * These are the neighboring classes that may be created.
   */
  createdOutdegrees: readonly number[]
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

function validOutdegree({
  q,
  degree,
}: {
  q: number
  degree: number
}) {
  return (
    Number.isInteger(q) &&
    Number.isInteger(degree) &&
    degree >= 0 &&
    q >= 0 &&
    q <= degree
  )
}

export function hasNoConsecutiveOutdegreeClasses(
  qs: readonly number[],
) {
  const normalized =
    uniqueSorted(qs)

  return normalized.every(
    (q, index) =>
      index === 0 ||
      q - normalized[index - 1] > 1,
  )
}

export function getStabilizationCreatedOutdegreesForClasses({
  qs,
  degree,
}: {
  qs: readonly number[]
  degree: number
}) {
  const normalized =
    uniqueSorted(qs)

  if (
    !Number.isInteger(degree) ||
    degree < 0 ||
    normalized.length === 0 ||
    normalized.some(
      (q) =>
        !validOutdegree({
          q,
          degree,
        }),
    )
  ) {
    return []
  }

  /*
   * P_0 and P_d are automatically independent when they are
   * the only selected class. For a genuine union P_Q, however,
   * an extreme class may be adjacent to another selected class,
   * so its inward neighbor must be recorded.
   */
  if (
    normalized.length === 1 &&
    (
      normalized[0] === 0 ||
      normalized[0] === degree
    )
  ) {
    return []
  }

  const created: number[] = []

  for (
    const q of normalized
  ) {
    if (
      q > 0
    ) {
      created.push(
        q - 1,
      )
    }

    if (
      q < degree
    ) {
      created.push(
        q + 1,
      )
    }
  }

  return uniqueSorted(
    created,
  )
}

export function canStabilizeOutdegreeClasses({
  qs,
  degree,
  currentOutdegrees,
}: {
  qs: readonly number[]
  degree: number
  currentOutdegrees: readonly number[]
}) {
  const normalizedQ =
    uniqueSorted(qs)

  const normalizedCurrent =
    uniqueSorted(
      currentOutdegrees,
    )

  if (
    !Number.isInteger(degree) ||
    degree < 0 ||
    normalizedQ.length === 0
  ) {
    return false
  }

  if (
    normalizedQ.some(
      (q) =>
        !validOutdegree({
          q,
          degree,
        }),
    )
  ) {
    return false
  }

  if (
    !normalizedQ.every(
      (q) =>
        normalizedCurrent.includes(
          q,
        ),
    )
  ) {
    return false
  }

  /*
   * Key lemma:
   *
   * If Q has no consecutive integers and x -> y lies inside
   * P_Q, then after reversing xy both endpoint outdegrees leave Q.
   * Hence |P_Q| drops by two. Repeating terminates with P_Q
   * independent.
   */
  return (
    hasNoConsecutiveOutdegreeClasses(
      normalizedQ,
    )
  )
}

export function createStabilizationClassesCertificate({
  target,
  qs,
  degree,
  currentOutdegrees,
}: {
  target: StabilizeTarget
  qs: readonly number[]
  degree: number
  currentOutdegrees: readonly number[]
}):
  StabilizeOutdegreeClassesCertificate | null {
  const normalizedQ =
    uniqueSorted(qs)

  if (
    !canStabilizeOutdegreeClasses({
      qs: normalizedQ,
      degree,
      currentOutdegrees,
    })
  ) {
    return null
  }

  return {
    target,
    qs: normalizedQ,
    conclusion:
      'selected-classes-independent',
    createdOutdegrees:
      getStabilizationCreatedOutdegreesForClasses({
        qs: normalizedQ,
        degree,
      }),
  }
}

/*
 * Backwards-compatible single-q API.
 */

export function getStabilizationCreatedOutdegrees({
  q,
  degree,
}: {
  q: number
  degree: number
}) {
  if (
    !validOutdegree({
      q,
      degree,
    })
  ) {
    return []
  }

  if (
    q === 0 ||
    q === degree
  ) {
    return []
  }

  return [
    q - 1,
    q + 1,
  ]
}

export function canStabilizeOutdegreeClass({
  q,
  degree,
  currentOutdegrees,
}: {
  q: number
  degree: number
  currentOutdegrees: readonly number[]
}) {
  if (
    !validOutdegree({
      q,
      degree,
    })
  ) {
    return false
  }

  return currentOutdegrees.includes(
    q,
  )
}

export function createStabilizationCertificate({
  target,
  q,
  degree,
  currentOutdegrees,
}: {
  target: StabilizeTarget
  q: number
  degree: number
  currentOutdegrees: readonly number[]
}):
  StabilizeOutdegreeClassCertificate | null {
  if (
    !canStabilizeOutdegreeClass({
      q,
      degree,
      currentOutdegrees,
    })
  ) {
    return null
  }

  return {
    target,
    q,
    conclusion:
      'q-class-independent',
    createdOutdegrees:
      getStabilizationCreatedOutdegrees({
        q,
        degree,
      }),
  }
}
