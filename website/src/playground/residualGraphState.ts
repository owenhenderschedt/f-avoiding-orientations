export type ResidualGraphState = {
  orientedTwoFactorCount: number
  workingDegree: number
  fixedOutdegreeContribution: number
}

export function getResidualGraphState(
  originalDegree: number,
  orientedTwoFactorCount: number,
): ResidualGraphState {
  return {
    orientedTwoFactorCount,

    /*
     * Every spanning 2-factor uses exactly two incident edges
     * at every vertex.
     */
    workingDegree:
      originalDegree -
      2 * orientedTwoFactorCount,

    /*
     * When each removed 2-factor is oriented cyclically,
     * it contributes exactly one outgoing edge at every vertex.
     */
    fixedOutdegreeContribution:
      orientedTwoFactorCount,
  }
}