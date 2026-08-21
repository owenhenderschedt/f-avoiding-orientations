import type {
  MaLuTarget,
} from './maLuMath'
import type {
  MaLuTotalDegreeCheck,
} from './maLuTargeting'

export type MaLuApplicationMode =
  | 'internal'
  | 'total'

/*
 * For a total-outdegree application,
 * this records exactly what Ma-Lu had
 * to avoid at vertices of each
 * possible degree.
 *
 * Example:
 *
 *   target L,
 *   final outdegree 4,
 *   d = 8,
 *   L -> R,
 *   Delta(G[L]) <= 4
 *
 * gives rules
 *
 *   r=0 : empty
 *   r=1 : empty
 *   r=2 : empty
 *   r=3 : empty
 *   r=4 : {0}.
 *
 * Storing these rules makes the
 * completed move itself carry its
 * mathematical certificate.
 */
export type MaLuApplicationDegreeRule = {
  degree: number

  outsideContribution: number

  localForbiddenSet:
    number[]
}

/*
 * A completed Ma-Lu move.
 *
 * selectedValues must always be read
 * together with mode.
 *
 * mode = 'internal'
 * -----------------
 *
 * selectedValues are outdegrees INSIDE
 * the graph on which Ma-Lu is applied.
 *
 * Example:
 *
 *   target = L
 *   selectedValues = [3]
 *
 * means
 *
 *   d^+_{G[L]}(v) != 3.
 *
 *
 * mode = 'total'
 * --------------
 *
 * selectedValues are FINAL total
 * outdegrees that the user asked
 * Ma-Lu to eliminate.
 *
 * Example:
 *
 *   target = L
 *   selectedValues = [4]
 *
 * means that the degree-dependent
 * internal forbidden lists stored in
 * degreeRules were chosen so that the
 * resulting orientation has
 *
 *   d_G^+(v) != 4
 *
 * for every v in L.
 */
export type MaLuApplication = {
  target: MaLuTarget

  mode:
    MaLuApplicationMode

  selectedValues:
    number[]

  /*
   * Temporary compatibility alias.
   *
   * The current playground code still
   * reads selectedForbiddenSet while we
   * migrate it to selectedValues.
   *
   * In internal mode this has exactly
   * its old meaning.
   *
   * We will remove this alias once all
   * consumers have moved to the new
   * mode-aware model.
   */
  selectedForbiddenSet:
    number[]

  /*
   * Null for the simple uniform
   * internal mode.
   *
   * In total mode this stores the
   * degree-dependent internal lists
   * certified by Ma-Lu.
   */
  degreeRules:
    MaLuApplicationDegreeRule[] | null
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

/*
 * New explicit constructor for the
 * internal-constraint mode.
 */
export function createMaLuInternalApplication(
  target: MaLuTarget,

  selectedInternalOutdegrees:
    readonly number[],
): MaLuApplication {
  const selectedValues =
    uniqueSorted(
      selectedInternalOutdegrees,
    )

  return {
    target,

    mode: 'internal',

    selectedValues,

    /*
     * Compatibility with the current
     * playground during migration.
     */
    selectedForbiddenSet:
      selectedValues,

    degreeRules: null,
  }
}

/*
 * Backward-compatible constructor.
 *
 * Existing code currently calls
 *
 *   createMaLuApplication(...)
 *
 * for the internal selector. Keep that
 * behavior unchanged until the next
 * migration step.
 */
export function createMaLuApplication(
  target: MaLuTarget,

  selectedForbiddenSet:
    readonly number[],
): MaLuApplication {
  return createMaLuInternalApplication(
    target,
    selectedForbiddenSet,
  )
}

/*
 * Constructor for the new
 * total-outdegree targeting mode.
 *
 * The certificate checks are copied
 * into the application so that we
 * remember the exact degree-by-degree
 * Ma-Lu assignment that justified the
 * move.
 */
export function createMaLuTotalApplication(
  target: MaLuTarget,

  selectedTotalOutdegrees:
    readonly number[],

  checks:
    readonly MaLuTotalDegreeCheck[],
): MaLuApplication {
  const selectedValues =
    uniqueSorted(
      selectedTotalOutdegrees,
    )

  const degreeRules:
    MaLuApplicationDegreeRule[] =
      checks.map(
        (check) => ({
          degree:
            check.degree,

          outsideContribution:
            check
              .outsideContribution,

          localForbiddenSet:
            [...check
              .relevantForbiddenSet],
        }),
      )

  return {
    target,

    mode: 'total',

    selectedValues,

    /*
     * Temporary compatibility alias.
     * Do not use this field to infer
     * semantics; mode determines what
     * selectedValues means.
     */
    selectedForbiddenSet:
      selectedValues,

    degreeRules,
  }
}

export function getMaLuApplicationLabel(
  application:
    MaLuApplication,
) {
  const values =
    application
      .selectedValues
      .join(',')

  if (
    application.mode ===
    'total'
  ) {
    if (
      application.target ===
      'G'
    ) {
      return (
        'Ma–Lu on G: '
        + `eliminate total {${values}}`
      )
    }

    return (
      `Ma–Lu on ${application.target}: `
      + `eliminate total {${values}}`
    )
  }

  if (
    application.target ===
    'G'
  ) {
    return (
      'Ma–Lu on G: '
      + `avoid {${values}}`
    )
  }

  return (
    `Ma–Lu on ${application.target}: `
    + `avoid {${values}} internally`
  )
}