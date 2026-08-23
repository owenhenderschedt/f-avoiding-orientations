export type StabilizeTarget =
  | 'G'
  | 'L'
  | 'R'

export type StabilizeOutdegreeClassCertificate = {
  /*
   * The part of the current oriented
   * graph on which the stabilization
   * was performed.
   */
  target: StabilizeTarget

  /*
   * TOTAL outdegree class being
   * stabilized.
   *
   * Thus
   *
   *   P_q =
   *   {v in target : d_D^+(v)=q}.
   *
   * For a Lovasz part this is still
   * the total outdegree in G, not merely
   * the internal outdegree in G[L] or
   * G[R].
   */
  q: number

  /*
   * Structural conclusion obtained
   * after repeatedly reversing arcs
   * whose two endpoints currently lie
   * in the q-class.
   */
  conclusion:
    'q-class-independent'

  /*
   * The only new outdegree classes that
   * can be created by the stabilization
   * process.
   *
   * When x -> y has both endpoints in
   * P_q, reversing the arc gives
   *
   *   q -> q-1 at x,
   *   q -> q+1 at y.
   *
   * At an extreme class q=0 or q=d,
   * the q-class is automatically
   * independent, so there is no need
   * to create neighboring classes.
   */
  createdOutdegrees:
    readonly number[]
}

export function getStabilizationCreatedOutdegrees({
  q,
  degree,
}: {
  q: number
  degree: number
}) {
  if (
    !Number.isInteger(q) ||
    !Number.isInteger(degree) ||
    degree < 0 ||
    q < 0 ||
    q > degree
  ) {
    return []
  }

  /*
   * A 0-outdegree class is already
   * independent:
   *
   * if two such vertices were adjacent,
   * the tail of their oriented edge
   * would have positive outdegree.
   */
  if (
    q === 0
  ) {
    return []
  }

  /*
   * Likewise, a degree-d outdegree
   * class is already independent in a
   * d-regular oriented graph:
   *
   * if two such vertices were adjacent,
   * the head of their oriented edge
   * would have an incoming edge and
   * therefore could not have outdegree
   * d.
   */
  if (
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
  currentOutdegrees:
    readonly number[]
}) {
  if (
    !Number.isInteger(q) ||
    !Number.isInteger(degree) ||
    degree < 0 ||
    q < 0 ||
    q > degree
  ) {
    return false
  }

  /*
   * There is nothing meaningful to
   * stabilize unless q is actually one
   * of the currently possible
   * outdegrees.
   */
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
  target:
    StabilizeTarget

  q: number

  degree: number

  currentOutdegrees:
    readonly number[]
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