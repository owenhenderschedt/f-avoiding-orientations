import {
  createHasanvandApplication,
  type HasanvandApplication,
} from '../tools/hasanvandApplication'
import type {
  HasanvandDegreeRule,
  HasanvandMode,
  HasanvandTarget,
} from '../tools/hasanvandMath'
import deriveOutdegreePossibilities from '../playground/deriveOutdegreePossibilities'
import {
  shiftPartOutdegrees,
} from '../playground/shiftOutdegrees'
import type {
  AcrossDirection,
} from '../tools/orientAcrossPartition'
import type {
  AuditSearchState,
} from './auditState'

/*
 * Hasanvand audit layer.
 *
 * We now search BOTH:
 *
 *   1. uniform Hasanvand parameters;
 *
 *   2. degree-dependent Hasanvand
 *      parameters.
 *
 * Nothing here is specific to d=12.
 *
 * The same search is intended to be used
 * later for d=14 and beyond.
 */

/*
 * Cache degree-dependent rule systems.
 *
 * The valid Hasanvand systems depend on
 * the structural degree data, but NOT on
 * the forbidden set F.
 *
 * During a degree census hundreds or
 * thousands of different forbidden sets
 * encounter the same Lovasz structures.
 * There is no reason to regenerate the
 * same Hasanvand rule systems each time.
 */
const byDegreeRuleSystemCache =
  new Map<
    string,
    HasanvandDegreeRule[][]
  >()

const exactDegreeRuleCache =
  new Map<
    string,
    HasanvandDegreeRule[]
  >()

function constructorsLocked(
  state:
    AuditSearchState,
) {
  return (
    state.stabilization !==
      null ||
    state.directedMenger !==
      null ||
    state
      .directedMengerReservoir !==
      null
  )
}

function wholeGraphAlreadyOriented(
  state:
    AuditSearchState,
) {
  return (
    state.balancedG ||
    state.avoidCG !==
      null ||
    state.maLuG !==
      null ||
    state.hasanvandG !==
      null
  )
}

function leftAlreadyOriented(
  state:
    AuditSearchState,
) {
  return (
    state.balancedL ||
    state.avoidCL !==
      null ||
    state.maLuL !==
      null ||
    state.hasanvandL !==
      null
  )
}

function rightAlreadyOriented(
  state:
    AuditSearchState,
) {
  return (
    state.balancedR ||
    state.avoidCR !==
      null ||
    state.maLuR !==
      null ||
    state.hasanvandR !==
      null
  )
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

function getAllDegreesThrough(
  maxDegree:
    number,
) {
  return Array.from(
    {
      length:
        maxDegree + 1,
    },
    (
      _,
      degree,
    ) =>
      degree,
  )
}

function getConstructorOutdegreePossibilities(
  state:
    AuditSearchState,
) {
  const residualPossibilities =
    deriveOutdegreePossibilities({
      degree:
        state.workingDegree,

      partition:
        state.partition,

      acrossDirection:
        state.acrossDirection,

      balancedG:
        state.balancedG,

      balancedL:
        state.balancedL,

      balancedR:
        state.balancedR,

      avoidCG:
        state.avoidCG,

      avoidCL:
        state.avoidCL,

      avoidCR:
        state.avoidCR,

      maLuG:
        state.maLuG,

      maLuL:
        state.maLuL,

      maLuR:
        state.maLuR,

      hasanvandG:
        state.hasanvandG,

      hasanvandL:
        state.hasanvandL,

      hasanvandR:
        state.hasanvandR,
    })

  return shiftPartOutdegrees(
    residualPossibilities,

    state
      .fixedOutdegreeContribution,
  )
}

type TargetInformation = {
  maxDegree:
    number

  possibleDegrees:
    number[]
}

function getTargetInformation(
  state:
    AuditSearchState,

  target:
    HasanvandTarget,
): TargetInformation | null {
  if (
    target ===
    'G'
  ) {
    if (
      state.partition !==
        null ||
      wholeGraphAlreadyOriented(
        state,
      )
    ) {
      return null
    }

    return {
      maxDegree:
        state.workingDegree,

      possibleDegrees: [
        state.workingDegree,
      ],
    }
  }

  if (
    state.partition ===
    null
  ) {
    return null
  }

  if (
    target ===
      'L' &&
    leftAlreadyOriented(
      state,
    )
  ) {
    return null
  }

  if (
    target ===
      'R' &&
    rightAlreadyOriented(
      state,
    )
  ) {
    return null
  }

  const maxDegree =
    target ===
    'L'
      ? state.partition.s
      : state.partition.t

  return {
    maxDegree,

    /*
     * From the Lovasz certificate we
     * know only
     *
     *     Delta(G[L]) <= s
     *
     * or
     *
     *     Delta(G[R]) <= t.
     *
     * Therefore every exact internal
     * degree from 0 through the maximum
     * must be handled.
     */
    possibleDegrees:
      getAllDegreesThrough(
        maxDegree,
      ),
  }
}

function setHasanvandApplication({
  state,
  target,
  mode,
  application,
  rules,
}: {
  state:
    AuditSearchState

  target:
    HasanvandTarget

  mode:
    HasanvandMode

  application:
    HasanvandApplication

  rules:
    readonly HasanvandDegreeRule[]
}): AuditSearchState {
  const nextState:
    AuditSearchState = {
    ...state,

    hasanvandG:
      target === 'G'
        ? application
        : state.hasanvandG,

    hasanvandL:
      target === 'L'
        ? application
        : state.hasanvandL,

    hasanvandR:
      target === 'R'
        ? application
        : state.hasanvandR,

    steps: [
      ...state.steps,

      {
        type:
          'hasanvand',

        target,

        mode,

        rules: [
          ...rules,
        ],
      },
    ],
  }

  return {
    ...nextState,

    outdegreePossibilities:
      getConstructorOutdegreePossibilities(
        nextState,
      ),
  }
}

/*
 * =========================================================
 * UNIFORM HASANVAND
 * =========================================================
 */

export function applyAuditHasanvandUniform({
  state,
  target,
  p,
  q,
}: {
  state:
    AuditSearchState

  target:
    HasanvandTarget

  p:
    number

  q:
    number
}): AuditSearchState | null {
  if (
    constructorsLocked(
      state,
    )
  ) {
    return null
  }

  const information =
    getTargetInformation(
      state,
      target,
    )

  if (
    information ===
    null
  ) {
    return null
  }

  const rule:
    HasanvandDegreeRule = {
    minDegree:
      target ===
      'G'
        ? state.workingDegree
        : 0,

    maxDegree:
      information
        .maxDegree,

    p,

    q,
  }

  /*
   * The existing playground validator
   * remains the mathematical source of
   * truth.
   */
  const application =
    createHasanvandApplication({
      target,

      mode:
        'uniform',

      maxDegree:
        information
          .maxDegree,

      possibleDegrees:
        information
          .possibleDegrees,

      rules: [
        rule,
      ],
    })

  if (
    application ===
    null
  ) {
    return null
  }

  return setHasanvandApplication({
    state,

    target,

    mode:
      'uniform',

    application,

    rules: [
      rule,
    ],
  })
}

function possibilitiesKey(
  state:
    AuditSearchState,
) {
  return [
    state
      .outdegreePossibilities
      .L
      .join(','),

    state
      .outdegreePossibilities
      .R
      .join(','),
  ].join('|')
}

function getUniformTargetTransitions(
  state:
    AuditSearchState,

  target:
    HasanvandTarget,
) {
  const information =
    getTargetInformation(
      state,
      target,
    )

  if (
    information ===
    null
  ) {
    return []
  }

  const transitions:
    AuditSearchState[] = []

  const seenPossibilities =
    new Set<string>()

  /*
   * Why q only needs to be searched
   * through maxDegree + 4:
   *
   * our Hasanvand applications use a
   * balanced orientation as the
   * (p,q)-orientation witness.
   *
   * For an exact degree r,
   *
   *     p <= floor(r/2)
   *
   * while Hasanvand requires
   *
   *     p >= q/2 - 2.
   *
   * Hence
   *
   *     q <= 2p + 4
   *       <= r + 4
   *       <= maxDegree + 4.
   *
   * Thus this is a genuine finite bound,
   * not an arbitrary search cutoff.
   */
  const maximumQ =
    information
      .maxDegree +
    4

  for (
    let p = 0;
    p <=
      information.maxDegree;
    p += 1
  ) {
    for (
      let q =
        p + 1;
      q <=
        maximumQ;
      q += 1
    ) {
      const next =
        applyAuditHasanvandUniform({
          state,
          target,
          p,
          q,
        })

      if (
        next ===
        null
      ) {
        continue
      }

      const key =
        possibilitiesKey(
          next,
        )

      /*
       * Different parameter choices can
       * produce exactly the same abstract
       * outdegree state.
       *
       * Future proof tools only need one
       * certified representative.
       */
      if (
        seenPossibilities.has(
          key,
        )
      ) {
        continue
      }

      seenPossibilities.add(
        key,
      )

      transitions.push(
        next,
      )
    }
  }

  return transitions
}

/*
 * =========================================================
 * DEGREE-DEPENDENT HASANVAND
 * =========================================================
 */

/*
 * Return every (p,q) rule that the
 * EXISTING Hasanvand validator accepts
 * for one exact internal degree.
 *
 * We deliberately do not reproduce all
 * Hasanvand inequalities here.
 *
 * We enumerate a finite parameter range
 * and let createHasanvandApplication
 * decide mathematical validity.
 */
function getValidExactDegreeRules({
  target,
  maxDegree,
  exactDegree,
}: {
  target:
    HasanvandTarget

  maxDegree:
    number

  exactDegree:
    number
}) {
  const cacheKey =
    [
      target,
      maxDegree,
      exactDegree,
    ].join('|')

  const cached =
    exactDegreeRuleCache.get(
      cacheKey,
    )

  if (
    cached !==
    undefined
  ) {
    return cached
  }

  const valid:
    HasanvandDegreeRule[] = []

  /*
   * p<0 cannot give us a useful new
   * feasible outdegree below zero, so
   * p=0,...,r is sufficient.
   *
   * As above, q<=r+4 follows from the
   * balanced-witness inequalities.
   */
  for (
    let p = 0;
    p <= exactDegree;
    p += 1
  ) {
    for (
      let q =
        p + 1;
      q <=
        exactDegree + 4;
      q += 1
    ) {
      const rule:
        HasanvandDegreeRule = {
        minDegree:
          exactDegree,

        maxDegree:
          exactDegree,

        p,

        q,
      }

      const application =
        createHasanvandApplication({
          target,

          mode:
            'by-degree',

          maxDegree,

          possibleDegrees: [
            exactDegree,
          ],

          rules: [
            rule,
          ],
        })

      if (
        application !==
        null
      ) {
        valid.push(
          rule,
        )
      }
    }
  }

  exactDegreeRuleCache.set(
    cacheKey,
    valid,
  )

  return valid
}

function getInternalCompressedValues(
  exactDegree:
    number,

  rule:
    HasanvandDegreeRule,
) {
  return uniqueSorted([
    rule.p,

    rule.p + 1,

    rule.q - 1,

    rule.q,
  ].filter(
    (value) =>
      value >= 0 &&
      value <=
        exactDegree,
  ))
}

function crossingEdgesPointOut(
  target:
    HasanvandTarget,

  direction:
    AcrossDirection,
) {
  return (
    (
      target ===
        'L' &&
      direction ===
        'L-to-R'
    ) ||
    (
      target ===
        'R' &&
      direction ===
        'R-to-L'
    )
  )
}

/*
 * Translate the compressed INTERNAL
 * outdegrees at one exact internal degree
 * into TOTAL outdegrees in the original
 * graph.
 *
 * This preserves the important correlation
 *
 *     exact internal degree
 *       <-->
 *     number of crossing edges.
 *
 * That correlation is precisely why the
 * degree-dependent Hasanvand version is
 * stronger than merely taking the union
 * of all internal compressed levels.
 */
function getTotalValuesForExactRule({
  state,
  target,
  exactDegree,
  rule,
}: {
  state:
    AuditSearchState

  target:
    HasanvandTarget

  exactDegree:
    number

  rule:
    HasanvandDegreeRule
}) {
  const internal =
    getInternalCompressedValues(
      exactDegree,

      rule,
    )

  let crossingContribution =
    0

  if (
    target !==
    'G'
  ) {
    if (
      state.acrossDirection ===
      null
    ) {
      return []
    }

    if (
      crossingEdgesPointOut(
        target,

        state
          .acrossDirection,
      )
    ) {
      crossingContribution =
        state.workingDegree -
        exactDegree
    }
  }

  const fixed =
    state
      .fixedOutdegreeContribution +
    crossingContribution

  return internal.map(
    (value) =>
      fixed +
      value,
  )
}

type PartialRuleSystem = {
  rules:
    HasanvandDegreeRule[]

  /*
   * Union of TOTAL outdegrees generated
   * so far.
   *
   * We use this as the dynamic-programming
   * signature.
   */
  totalValues:
    number[]
}

function mergeAdjacentRules(
  rules:
    readonly HasanvandDegreeRule[],
) {
  if (
    rules.length ===
    0
  ) {
    return []
  }

  const merged:
    HasanvandDegreeRule[] = []

  for (
    const rule
    of rules
  ) {
    const previous =
      merged[
        merged.length -
        1
      ]

    if (
      previous !==
        undefined &&
      previous.p ===
        rule.p &&
      previous.q ===
        rule.q &&
      previous.maxDegree +
        1 ===
        rule.minDegree
    ) {
      merged[
        merged.length -
        1
      ] = {
        ...previous,

        maxDegree:
          rule.maxDegree,
      }

      continue
    }

    merged.push({
      ...rule,
    })
  }

  return merged
}

function getByDegreeSystemCacheKey(
  state:
    AuditSearchState,

  target:
    HasanvandTarget,

  maxDegree:
    number,
) {
  return [
    target,

    `max=${maxDegree}`,

    `working=${state.workingDegree}`,

    `fixed=${state.fixedOutdegreeContribution}`,

    `cut=${state.acrossDirection ?? '-'}`,
  ].join('|')
}

/*
 * Generate all degree-dependent systems,
 * but use dynamic programming to collapse
 * systems that produce the same abstract
 * TOTAL-outdegree set.
 *
 * Naively, choosing a different valid
 * (p,q) at every exact degree would create
 * an enormous Cartesian product.
 *
 * Instead:
 *
 * after processing degrees 0,...,r,
 * two partial rule systems are equivalent
 * for our symbolic audit whenever they
 * produce the same union of possible total
 * outdegrees.
 *
 * We keep one certified representative.
 */
function getByDegreeRuleSystems(
  state:
    AuditSearchState,

  target:
    HasanvandTarget,

  maxDegree:
    number,
) {
  const cacheKey =
    getByDegreeSystemCacheKey(
      state,
      target,
      maxDegree,
    )

  const cached =
    byDegreeRuleSystemCache.get(
      cacheKey,
    )

  if (
    cached !==
    undefined
  ) {
    return cached
  }

  let partialSystems:
    PartialRuleSystem[] = [
      {
        rules: [],

        totalValues: [],
      },
    ]

  for (
    let exactDegree = 0;
    exactDegree <=
      maxDegree;
    exactDegree += 1
  ) {
    const validRules =
      getValidExactDegreeRules({
        target,

        maxDegree,

        exactDegree,
      })

    if (
      validRules.length ===
      0
    ) {
      byDegreeRuleSystemCache.set(
        cacheKey,
        [],
      )

      return []
    }

    const nextBySignature =
      new Map<
        string,
        PartialRuleSystem
      >()

    for (
      const partial
      of partialSystems
    ) {
      for (
        const rule
        of validRules
      ) {
        const exactTotals =
          getTotalValuesForExactRule({
            state,

            target,

            exactDegree,

            rule,
          })

        const totalValues =
          uniqueSorted([
            ...partial
              .totalValues,

            ...exactTotals,
          ])

        const signature =
          totalValues.join(',')

        /*
         * Same total-outdegree information:
         * keep the first representative.
         */
        if (
          nextBySignature.has(
            signature,
          )
        ) {
          continue
        }

        nextBySignature.set(
          signature,

          {
            rules: [
              ...partial.rules,

              rule,
            ],

            totalValues,
          },
        )
      }
    }

    partialSystems =
      Array.from(
        nextBySignature
          .values(),
      )
  }

  const systems =
    partialSystems.map(
      (partial) =>
        mergeAdjacentRules(
          partial.rules,
        ),
    )

  byDegreeRuleSystemCache.set(
    cacheKey,
    systems,
  )

  return systems
}

/*
 * Degree-dependent rules on a Lovasz part
 * are only generated after the cut has been
 * oriented.
 *
 * This is an AUDIT search-order
 * canonicalization, not a mathematical
 * restriction.
 *
 * Orienting the cut and orienting the
 * induced part commute, so any proof that
 * chooses Hasanvand first has an equivalent
 * recipe with the cut chosen first.
 *
 * Requiring this order also lets us retain
 * the exact internal-degree / crossing-edge
 * correlation when deduplicating candidates.
 */
function getByDegreeTargetTransitions(
  state:
    AuditSearchState,

  target:
    'L' | 'R',
) {
  if (
    state.partition ===
      null ||
    state.acrossDirection ===
      null
  ) {
    return []
  }

  const information =
    getTargetInformation(
      state,
      target,
    )

  if (
    information ===
    null
  ) {
    return []
  }

  const ruleSystems =
    getByDegreeRuleSystems(
      state,

      target,

      information
        .maxDegree,
    )

  const transitions:
    AuditSearchState[] = []

  const seenPossibilities =
    new Set<string>()

  for (
    const rules
    of ruleSystems
  ) {
    const application =
      createHasanvandApplication({
        target,

        mode:
          'by-degree',

        maxDegree:
          information
            .maxDegree,

        possibleDegrees:
          information
            .possibleDegrees,

        rules,
      })

    /*
     * The complete rule system is checked
     * again by the actual playground
     * validator.
     */
    if (
      application ===
      null
    ) {
      continue
    }

    const next =
      setHasanvandApplication({
        state,

        target,

        mode:
          'by-degree',

        application,

        rules,
      })

    const key =
      possibilitiesKey(
        next,
      )

    if (
      seenPossibilities.has(
        key,
      )
    ) {
      continue
    }

    seenPossibilities.add(
      key,
    )

    transitions.push(
      next,
    )
  }

  return transitions
}

/*
 * =========================================================
 * PUBLIC TRANSITION GENERATOR
 * =========================================================
 */

export function getAuditHasanvandTransitions(
  state:
    AuditSearchState,
) {
  if (
    constructorsLocked(
      state,
    )
  ) {
    return []
  }

  const transitions:
    AuditSearchState[] = []

  /*
   * Uniform Hasanvand remains available
   * on G, L, and R.
   */
  transitions.push(
    ...getUniformTargetTransitions(
      state,

      'G',
    ),
  )

  transitions.push(
    ...getUniformTargetTransitions(
      state,

      'L',
    ),
  )

  transitions.push(
    ...getUniformTargetTransitions(
      state,

      'R',
    ),
  )

  /*
   * On the whole regular graph there is
   * only one possible exact degree.
   *
   * Therefore "by degree" gives nothing
   * beyond uniform Hasanvand there.
   *
   * The genuinely new search occurs on
   * Lovasz parts.
   */
  transitions.push(
    ...getByDegreeTargetTransitions(
      state,

      'L',
    ),
  )

  transitions.push(
    ...getByDegreeTargetTransitions(
      state,

      'R',
    ),
  )

  return transitions
}