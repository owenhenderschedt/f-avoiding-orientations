import {
  createStabilizationCertificate,
  type StabilizeOutdegreeClassCertificate,
  type StabilizeTarget,
} from './stabilizeOutdegreeClassMath'

export type StabilizeOutdegreeClassApplication = {
  target:
    StabilizeTarget

  q: number

  degree: number

  startingOutdegrees:
    readonly number[]

  certificate:
    StabilizeOutdegreeClassCertificate
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
}):
  StabilizeOutdegreeClassApplication | null {
  const startingOutdegrees =
    uniqueSorted(
      currentOutdegrees,
    )

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

    degree,

    startingOutdegrees,

    certificate,
  }
}