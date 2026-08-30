import type {
  AuditSearchState,
} from './auditState'
import type {
  AuditCaseResult,
  AuditProofRecipe,
} from './proofRecipes'

export type AuditResidualSearchFunction =
  (args: {
    degree:
      number

    forbiddenSet:
      readonly number[]

    maxStates?:
      number
  }) => AuditCaseResult

type ResidualProblem = {
  degree:
    number

  forbiddenSet:
    readonly number[]

  fixedOutdegreeContribution:
    number
}

export type AuditResidualClosureAttempt = {
  applicable:
    boolean

  recipe:
    AuditProofRecipe | null

  expandedStates:
    number

  generatedStates:
    number
}

type CachedSearch = {
  result:
    AuditCaseResult

  chargedExpandedStates:
    number

  chargedGeneratedStates:
    number
}

const residualSearchCache =
  new Map<
    string,
    AuditCaseResult
  >()

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

function sameValues(
  first:
    readonly number[],

  second:
    readonly number[],
) {
  return (
    first.length ===
      second.length &&
    first.every(
      (
        value,
        index,
      ) =>
        value ===
        second[index],
    )
  )
}

/*
 * Residual closure is deliberately allowed
 * only when the current state consists of
 * nothing except one or more cyclically
 * oriented spanning 2-factors.
 *
 * At that point the remaining unoriented
 * graph is a fresh regular graph, so it is
 * mathematically legitimate to invoke a
 * lower-degree certificate on that residual
 * graph.
 */
function isPureTwoFactorState(
  state:
    AuditSearchState,
) {
  return (
    state
      .orientedTwoFactorCount >
      0 &&

    state.workingDegree <
      state.degree &&

    state.steps.length ===
      state
        .orientedTwoFactorCount &&

    state.steps.every(
      (step) =>
        step.type ===
        'oriented-two-factor',
    ) &&

    state.partition ===
      null &&

    state.lovaszApplication ===
      null &&

    state.acrossDirection ===
      null &&

    !state.balancedG &&
    !state.balancedL &&
    !state.balancedR &&

    state.avoidCG ===
      null &&
    state.avoidCL ===
      null &&
    state.avoidCR ===
      null &&

    state.maLuG ===
      null &&
    state.maLuL ===
      null &&
    state.maLuR ===
      null &&

    state.hasanvandG ===
      null &&
    state.hasanvandL ===
      null &&
    state.hasanvandR ===
      null &&

    state.parityBoundsG ===
      null &&

    state.boundedDegreeG ===
      null &&
    state.boundedDegreeL ===
      null &&
    state.boundedDegreeR ===
      null &&

    state.stabilization ===
      null &&

    state.directedMenger ===
      null &&

    state
      .directedMengerReservoir ===
      null
  )
}

/*
 * If r cyclically oriented spanning
 * 2-factors have been removed, every
 * vertex already has r fixed outgoing
 * edges.
 *
 * A total forbidden value f therefore
 * becomes the residual forbidden value
 *
 *     f - r.
 *
 * Values outside [0, d-2r] are impossible
 * in the residual graph and disappear.
 */
export function getAuditResidualProblem(
  state:
    AuditSearchState,
): ResidualProblem | null {
  if (
    !isPureTwoFactorState(
      state,
    )
  ) {
    return null
  }

  const residualDegree =
    state.workingDegree

  if (
    residualDegree <
      0
  ) {
    return null
  }

  const fixed =
    state
      .fixedOutdegreeContribution

  const residualForbiddenSet =
    uniqueSorted(
      state
        .forbiddenSet
        .map(
          (value) =>
            value -
            fixed,
        )
        .filter(
          (value) =>
            value >=
              0 &&
            value <=
              residualDegree,
        ),
    )

  /*
   * We use lower-degree closure only when
   * the residual instance is itself inside
   * the conjectured range.
   *
   * This keeps the step conceptually clean:
   * it is an induction/certification step
   * for another legitimate regular case,
   * not an arbitrary recursive shortcut.
   */
  if (
    residualForbiddenSet.length >=
      residualDegree /
        2
  ) {
    return null
  }

  return {
    degree:
      residualDegree,

    forbiddenSet:
      residualForbiddenSet,

    fixedOutdegreeContribution:
      fixed,
  }
}

function reverseForbiddenSet(
  degree:
    number,

  forbiddenSet:
    readonly number[],
) {
  return uniqueSorted(
    forbiddenSet.map(
      (value) =>
        degree -
        value,
    ),
  )
}

function searchCacheKey({
  degree,
  forbiddenSet,
  maxStates,
}: {
  degree:
    number

  forbiddenSet:
    readonly number[]

  maxStates:
    number
}) {
  return [
    degree,
    forbiddenSet.join(','),
    maxStates,
  ].join('|')
}

function runCachedResidualSearch({
  degree,
  forbiddenSet,
  maxStates,
  searchResidualCase,
}: {
  degree:
    number

  forbiddenSet:
    readonly number[]

  maxStates:
    number

  searchResidualCase:
    AuditResidualSearchFunction
}): CachedSearch {
  const key =
    searchCacheKey({
      degree,
      forbiddenSet,
      maxStates,
    })

  const cached =
    residualSearchCache.get(
      key,
    )

  if (
    cached !==
      undefined
  ) {
    return {
      result:
        cached,

      /*
       * The mathematical result is reused,
       * but a cached lookup does not perform
       * those search expansions again.
       */
      chargedExpandedStates:
        0,

      chargedGeneratedStates:
        0,
    }
  }

  const result =
    searchResidualCase({
      degree,

      forbiddenSet,

      maxStates,
    })

  residualSearchCache.set(
    key,
    result,
  )

  return {
    result,

    chargedExpandedStates:
      result.expandedStates,

    chargedGeneratedStates:
      result.generatedStates,
  }
}

function reverseResidualOutdegrees(
  degree:
    number,

  values:
    readonly number[],
) {
  return uniqueSorted(
    values.map(
      (value) =>
        degree -
        value,
    ),
  )
}

function shiftToOriginalOutdegrees(
  fixed:
    number,

  values:
    readonly number[],
) {
  return uniqueSorted(
    values.map(
      (value) =>
        value +
        fixed,
    ),
  )
}

function buildLiftedRecipe({
  state,
  residualProblem,
  residualRecipe,
  reversed,
}: {
  state:
    AuditSearchState

  residualProblem:
    ResidualProblem

  residualRecipe:
    AuditProofRecipe

  reversed:
    boolean
}): AuditProofRecipe {
  const residualFinalL =
    reversed
      ? reverseResidualOutdegrees(
          residualProblem.degree,
          residualRecipe
            .finalOutdegreesL,
        )
      : [
          ...residualRecipe
            .finalOutdegreesL,
        ]

  const residualFinalR =
    reversed
      ? reverseResidualOutdegrees(
          residualProblem.degree,
          residualRecipe
            .finalOutdegreesR,
        )
      : [
          ...residualRecipe
            .finalOutdegreesR,
        ]

  const finalOutdegreesL =
    shiftToOriginalOutdegrees(
      residualProblem
        .fixedOutdegreeContribution,

      residualFinalL,
    )

  const finalOutdegreesR =
    shiftToOriginalOutdegrees(
      residualProblem
        .fixedOutdegreeContribution,

      residualFinalR,
    )

  return {
    degree:
      state.degree,

    forbiddenSet: [
      ...state
        .forbiddenSet,
    ],

    steps: [
      ...state.steps,

      {
        type:
          'lower-degree-certificate',

        residualDegree:
          residualProblem.degree,

        residualForbiddenSet: [
          ...residualProblem
            .forbiddenSet,
        ],

        fixedOutdegreeContribution:
          residualProblem
            .fixedOutdegreeContribution,

        reversed,

        recipe:
          residualRecipe,
      },
    ],

    finalOutdegreesL,

    finalOutdegreesR,
  }
}

/*
 * Try to close a pure post-2-factor state
 * by auditing the residual regular graph as
 * a fresh lower-degree instance.
 *
 * We first search F' itself.  If that does
 * not certify the case, we also search its
 * reversal
 *
 *     d' - F'.
 *
 * A certificate for the reversed list is
 * converted back by reversing every arc in
 * the residual orientation.
 */
export function tryAuditResidualClosure({
  state,
  maxStates,
  searchResidualCase,
}: {
  state:
    AuditSearchState

  maxStates:
    number

  searchResidualCase:
    AuditResidualSearchFunction
}): AuditResidualClosureAttempt {
  const residualProblem =
    getAuditResidualProblem(
      state,
    )

  if (
    residualProblem ===
      null
  ) {
    return {
      applicable:
        false,

      recipe:
        null,

      expandedStates:
        0,

      generatedStates:
        0,
    }
  }

  let expandedStates =
    0

  let generatedStates =
    0

  const directAttempt =
    runCachedResidualSearch({
      degree:
        residualProblem.degree,

      forbiddenSet:
        residualProblem
          .forbiddenSet,

      maxStates,

      searchResidualCase,
    })

  expandedStates +=
    directAttempt
      .chargedExpandedStates

  generatedStates +=
    directAttempt
      .chargedGeneratedStates

  if (
    directAttempt
      .result
      .status ===
      'proved'
  ) {
    return {
      applicable:
        true,

      recipe:
        buildLiftedRecipe({
          state,

          residualProblem,

          residualRecipe:
            directAttempt
              .result
              .recipe,

          reversed:
            false,
        }),

      expandedStates,

      generatedStates,
    }
  }

  const reversedForbiddenSet =
    reverseForbiddenSet(
      residualProblem.degree,

      residualProblem
        .forbiddenSet,
    )

  if (
    sameValues(
      reversedForbiddenSet,

      residualProblem
        .forbiddenSet,
    )
  ) {
    return {
      applicable:
        true,

      recipe:
        null,

      expandedStates,

      generatedStates,
    }
  }

  const reversedAttempt =
    runCachedResidualSearch({
      degree:
        residualProblem.degree,

      forbiddenSet:
        reversedForbiddenSet,

      maxStates,

      searchResidualCase,
    })

  expandedStates +=
    reversedAttempt
      .chargedExpandedStates

  generatedStates +=
    reversedAttempt
      .chargedGeneratedStates

  if (
    reversedAttempt
      .result
      .status ===
      'proved'
  ) {
    return {
      applicable:
        true,

      recipe:
        buildLiftedRecipe({
          state,

          residualProblem,

          residualRecipe:
            reversedAttempt
              .result
              .recipe,

          reversed:
            true,
        }),

      expandedStates,

      generatedStates,
    }
  }

  return {
    applicable:
      true,

    recipe:
      null,

    expandedStates,

    generatedStates,
  }
}

export default
  tryAuditResidualClosure
