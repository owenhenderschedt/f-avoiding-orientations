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

/*
 * Use performance.now() in the browser
 * because it gives substantially finer
 * timing resolution than Date.now().
 */
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

/*
 * Audit every canonical reversal class
 * for one degree.
 *
 * At this stage each reversal class is
 * represented by its first stored option.
 *
 * Thus, for d=12, this audits the same
 * 651 canonical classes displayed by the
 * playground rather than counting both F
 * and d-F separately.
 */
export function runAuditForDegree({
  degree,
  maxStatesPerCase,
}: {
  degree:
    PlaygroundDegree

  maxStatesPerCase?:
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

    const result =
      searchAuditCase({
        degree,

        forbiddenSet:
          representative
            .forbiddenSet,

        maxStates:
          maxStatesPerCase,
      })

    cases.push(
      result,
    )
  }

  const provedCases =
    cases.filter(
      (result) =>
        result.status ===
        'proved',
    ).length

  const unresolvedCases =
    cases.length -
    provedCases

  const elapsedMs =
    getNow() -
    start

  return {
    degree,

    totalCases:
      cases.length,

    provedCases,

    unresolvedCases,

    elapsedMs,

    cases,
  }
}

/*
 * Formatting helper for the UI.
 *
 * Very fast audits are clearer in
 * milliseconds; longer ones are clearer
 * in seconds.
 */
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