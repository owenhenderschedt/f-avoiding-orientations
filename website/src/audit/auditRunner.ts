import {
  getCaseGroupsForDegree,
  type PlaygroundDegree,
} from '../cases/playgroundCases'
import {
  searchAuditCase,
} from './proofSearch'
import type {
  AuditCaseResult,
  AuditDegreeResult,
} from './proofRecipes'

const DEFAULT_DEEP_MAX_STATES_PER_CASE =
  300000

function getNow() {
  if (
    typeof performance !==
      'undefined' &&
    typeof performance.now ===
      'function'
  ) {
    return performance.now()
  }

  return Date.now()
}

function sameForbiddenSet(
  a:
    readonly number[],

  b:
    readonly number[],
) {
  if (
    a.length !==
    b.length
  ) {
    return false
  }

  return a.every(
    (
      value,
      index,
    ) =>
      value ===
      b[index],
  )
}

type ProvedAuditCaseResult =
  Extract<
    AuditCaseResult,
    {
      status:
        'proved'
    }
  >

type SearchAttempt = {
  forbiddenSet:
    readonly number[]

  result:
    AuditCaseResult
}

function getDeepBudget({
  maxStatesPerCase,
  deepMaxStatesPerCase,
}: {
  maxStatesPerCase?:
    number

  deepMaxStatesPerCase?:
    number
}) {
  if (
    deepMaxStatesPerCase !==
    undefined
  ) {
    return deepMaxStatesPerCase
  }

  if (
    maxStatesPerCase ===
    undefined
  ) {
    return (
      DEFAULT_DEEP_MAX_STATES_PER_CASE
    )
  }

  /*
   * If a caller explicitly raises the
   * ordinary budget, make the deep pass
   * meaningfully deeper as well.
   */
  return globalThis.Math.max(
    DEFAULT_DEEP_MAX_STATES_PER_CASE,

    6 *
      maxStatesPerCase,
  )
}

/*
 * Audit one REVERSAL CLASS with an
 * adaptive two-pass search.
 *
 * Pass 1:
 *   Search every stored orientation of
 *   the reversal class using the ordinary
 *   budget.
 *
 * Pass 2:
 *   Only if the class is still uncertified,
 *   rerun the orientations that actually
 *   hit the search limit using the deeper
 *   budget.
 *
 * This order is important.  We first give
 * BOTH F and d-F a cheap chance to prove
 * the class before spending a large search
 * budget on either one.
 */
function searchReversalClass({
  degree,
  optionForbiddenSets,
  maxStatesPerCase,
  deepMaxStatesPerCase,
}: {
  degree:
    PlaygroundDegree

  optionForbiddenSets:
    readonly (
      readonly number[]
    )[]

  maxStatesPerCase?:
    number

  deepMaxStatesPerCase?:
    number
}) {
  let expandedStates =
    0

  let generatedStates =
    0

  const shallowAttempts:
    SearchAttempt[] = []

  /*
   * SHALLOW PASS
   */
  for (
    const forbiddenSet
    of optionForbiddenSets
  ) {
    const result =
      searchAuditCase({
        degree,

        forbiddenSet,

        maxStates:
          maxStatesPerCase,
      })

    expandedStates +=
      result.expandedStates

    generatedStates +=
      result.generatedStates

    shallowAttempts.push({
      forbiddenSet,

      result,
    })

    if (
      result.status ===
      'proved'
    ) {
      return {
        provedResult:
          result as ProvedAuditCaseResult,

        reason:
          null,

        expandedStates,

        generatedStates,
      }
    }
  }

  const searchLimitedAttempts =
    shallowAttempts.filter(
      (
        attempt,
      ) =>
        attempt.result.status ===
          'unresolved' &&
        attempt.result.reason ===
          'search-limit',
    )

  /*
   * If every orientation exhausted in the
   * shallow pass, the whole reversal class
   * has genuinely been exhausted.
   */
  if (
    searchLimitedAttempts.length ===
    0
  ) {
    return {
      provedResult:
        null,

      reason:
        'exhausted' as const,

      expandedStates,

      generatedStates,
    }
  }

  const deepBudget =
    getDeepBudget({
      maxStatesPerCase,

      deepMaxStatesPerCase,
    })

  let deepSearchStillLimited =
    false

  /*
   * DEEP PASS
   *
   * Only rerun orientations whose shallow
   * frontier was still nonempty.
   */
  for (
    const attempt
    of searchLimitedAttempts
  ) {
    const result =
      searchAuditCase({
        degree,

        forbiddenSet:
          attempt
            .forbiddenSet,

        maxStates:
          deepBudget,
      })

    expandedStates +=
      result.expandedStates

    generatedStates +=
      result.generatedStates

    if (
      result.status ===
      'proved'
    ) {
      return {
        provedResult:
          result as ProvedAuditCaseResult,

        reason:
          null,

        expandedStates,

        generatedStates,
      }
    }

    if (
      result.reason ===
      'search-limit'
    ) {
      deepSearchStillLimited =
        true
    }
  }

  return {
    provedResult:
      null,

    reason:
      deepSearchStillLimited
        ? 'search-limit' as const
        : 'exhausted' as const,

    expandedStates,

    generatedStates,
  }
}

/*
 * Audit every canonical REVERSAL CLASS.
 *
 * We search every distinct stored
 * orientation of the class because the
 * live toolbox is directional even though
 * the underlying existence statement is
 * reversal-symmetric.
 *
 * Search-limited classes are then
 * automatically given a deeper second pass.
 */
export function runAuditForDegree({
  degree,
  maxStatesPerCase,
  deepMaxStatesPerCase,
}: {
  degree:
    PlaygroundDegree

  /*
   * Ordinary per-orientation search budget.
   *
   * When omitted, searchAuditCase uses its
   * default 50,000 expanded states.
   */
  maxStatesPerCase?:
    number

  /*
   * Adaptive second-pass budget.
   *
   * When omitted, the default is 300,000
   * expanded states per still-limited
   * orientation.
   */
  deepMaxStatesPerCase?:
    number
}): AuditDegreeResult {
  const start =
    getNow()

  const groups =
    getCaseGroupsForDegree(
      degree,
    )

  const cases:
    AuditCaseResult[] = []

  for (
    const group
    of groups
  ) {
    const representative =
      group.options[0]

    if (
      representative ===
      undefined
    ) {
      continue
    }

    const canonicalForbiddenSet =
      [
        ...representative
          .forbiddenSet,
      ]

    const optionForbiddenSets:
      number[][] = []

    for (
      const option
      of group.options
    ) {
      const forbiddenSet =
        [
          ...option
            .forbiddenSet,
        ]

      if (
        optionForbiddenSets.some(
          (alreadyIncluded) =>
            sameForbiddenSet(
              alreadyIncluded,

              forbiddenSet,
            ),
        )
      ) {
        continue
      }

      optionForbiddenSets.push(
        forbiddenSet,
      )
    }

    const classSearch =
      searchReversalClass({
        degree,

        optionForbiddenSets,

        maxStatesPerCase,

        deepMaxStatesPerCase,
      })

    if (
      classSearch.provedResult !==
      null
    ) {
      /*
       * Keep the canonical class label in
       * the census.  The recipe itself
       * still records the actual F or d-F
       * on which the proof was found.
       */
      cases.push({
        ...classSearch
          .provedResult,

        forbiddenSet:
          canonicalForbiddenSet,

        expandedStates:
          classSearch
            .expandedStates,

        generatedStates:
          classSearch
            .generatedStates,
      })

      continue
    }

    cases.push({
      status:
        'unresolved',

      reason:
        classSearch.reason ??
        'search-limit',

      degree,

      forbiddenSet:
        canonicalForbiddenSet,

      expandedStates:
        classSearch
          .expandedStates,

      generatedStates:
        classSearch
          .generatedStates,
    })
  }

  const provedCases =
    cases.filter(
      (result) =>
        result.status ===
        'proved',
    ).length

  const unresolvedCases =
    cases.filter(
      (result) =>
        result.status ===
          'unresolved' &&
        result.reason ===
          'exhausted',
    ).length

  const searchLimitedCases =
    cases.filter(
      (result) =>
        result.status ===
          'unresolved' &&
        result.reason ===
          'search-limit',
    ).length

  const uncertifiedCases =
    unresolvedCases +
    searchLimitedCases

  const elapsedMs =
    getNow() -
    start

  return {
    degree,

    totalCases:
      cases.length,

    provedCases,

    unresolvedCases,

    searchLimitedCases,

    uncertifiedCases,

    elapsedMs,

    cases,
  }
}

export function formatAuditTime(
  elapsedMs:
    number,
) {
  if (
    elapsedMs <
    1000
  ) {
    if (
      elapsedMs <
      10
    ) {
      return (
        `${elapsedMs.toFixed(2)} ms`
      )
    }

    return (
      `${elapsedMs.toFixed(0)} ms`
    )
  }

  return (
    `${(
      elapsedMs /
      1000
    ).toFixed(2)} s`
  )
}

export default
  runAuditForDegree
