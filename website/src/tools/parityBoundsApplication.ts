import {
  analyzeParityBounds,
  type ParityBoundsCertificate,
  type ParityBoundsChecks,
  type ParityBoundsInterval,
} from './parityBoundsMath'

export type ParityBoundsApplication = {
  target:
    'G'

  /*
   * Degree of the current residual regular
   * graph after any oriented 2-factors have
   * been removed.
   */
  workingDegree:
    number

  /*
   * Every removed cyclically oriented
   * 2-factor contributes one fixed outgoing
   * edge at every vertex.
   */
  fixedOutdegreeContribution:
    number

  normalInterval:
    ParityBoundsInterval

  exceptionalInterval:
    ParityBoundsInterval

  checks:
    ParityBoundsChecks

  certificate:
    ParityBoundsCertificate

  /*
   * Possible outdegrees inside the current
   * working regular graph.
   */
  residualOutdegrees:
    readonly number[]

  /*
   * Possible TOTAL outdegrees back in the
   * original graph.
   */
  totalOutdegrees:
    readonly number[]
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

export function createParityBoundsApplication({
  workingDegree,
  fixedOutdegreeContribution,
  normalLower,
  normalUpper,
  exceptionalLower,
  exceptionalUpper,
}: {
  workingDegree:
    number

  fixedOutdegreeContribution:
    number

  normalLower:
    number

  normalUpper:
    number

  exceptionalLower:
    number

  exceptionalUpper:
    number
}): ParityBoundsApplication | null {
  const normalInterval:
    ParityBoundsInterval = {
    lower:
      normalLower,

    upper:
      normalUpper,
  }

  const exceptionalInterval:
    ParityBoundsInterval = {
    lower:
      exceptionalLower,

    upper:
      exceptionalUpper,
  }

  const analysis =
    analyzeParityBounds({
      degree:
        workingDegree,

      normalInterval,

      exceptionalInterval,
    })

  if (
    !analysis.applicable ||
    analysis.certificate ===
      null
  ) {
    return null
  }

  const residualOutdegrees =
    uniqueSorted(
      analysis
        .certificate
        .possibleOutdegrees,
    )

  const totalOutdegrees =
    uniqueSorted(
      residualOutdegrees.map(
        (value) =>
          value +
          fixedOutdegreeContribution,
      ),
    )

  return {
    target:
      'G',

    workingDegree,

    fixedOutdegreeContribution,

    normalInterval,

    exceptionalInterval,

    checks:
      analysis.checks,

    certificate:
      analysis.certificate,

    residualOutdegrees,

    totalOutdegrees,
  }
}

export default
  createParityBoundsApplication