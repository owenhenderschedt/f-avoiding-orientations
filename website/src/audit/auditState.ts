import type {
  LovaszApplication,
  LovaszPair,
} from '../tools/lovaszPartition'
import type {
  AcrossDirection,
} from '../tools/orientAcrossPartition'
import type {
  MaLuApplication,
} from '../tools/maLuApplication'
import type {
  HasanvandApplication,
} from '../tools/hasanvandApplication'
import type {
  StabilizeOutdegreeClassApplication,
} from '../tools/stabilizeOutdegreeClassApplication'
import type {
  DirectedMengerApplication,
} from '../tools/directedMengerApplication'
import type {
  DirectedMengerReservoirApplication,
} from '../tools/directedMengerReservoirApplication'
import {
  allOutdegrees,
  type PartOutdegreePossibilities,
} from '../playground/outdegreePossibilities'
import type {
  AuditProofStep,
} from './proofRecipes'

/*
 * This is the non-React state explored by
 * the completeness audit.
 *
 * It intentionally mirrors the important
 * mathematical information in the
 * playground, but it has no UI state,
 * menus, panels, or callbacks.
 */
export type AuditSearchState = {
  degree:
    number

  forbiddenSet:
    readonly number[]

  /*
   * Lovasz / cut structure.
   */
  partition:
    LovaszPair | null

  lovaszApplication:
    LovaszApplication | null

  acrossDirection:
    AcrossDirection | null

  /*
   * Constructor state.
   */
  balancedG:
    boolean

  balancedL:
    boolean

  balancedR:
    boolean

  avoidCG:
    number | null

  avoidCL:
    number | null

  avoidCR:
    number | null

  maLuG:
    MaLuApplication | null

  maLuL:
    MaLuApplication | null

  maLuR:
    MaLuApplication | null

  hasanvandG:
    HasanvandApplication | null

  hasanvandL:
    HasanvandApplication | null

  hasanvandR:
    HasanvandApplication | null

  /*
   * Reduction state.
   */
  orientedTwoFactorCount:
    number

  workingDegree:
    number

  fixedOutdegreeContribution:
    number

  /*
   * Structural / repair state.
   */
  stabilization:
    StabilizeOutdegreeClassApplication | null

  directedMenger:
    DirectedMengerApplication | null

  directedMengerReservoir:
    DirectedMengerReservoirApplication | null

  /*
   * CURRENT possible TOTAL outdegrees.
   *
   * These are the values against which F
   * is tested.
   */
  outdegreePossibilities:
    PartOutdegreePossibilities

  /*
   * Compact proof recipe accumulated by
   * the audit.
   */
  steps:
    readonly AuditProofStep[]
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

function sameValues(
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

/*
 * Initial audit state.
 *
 * Before any construction is chosen, every
 * total outdegree from 0 through d is
 * possible.
 *
 * We store that same set in L and R. This
 * matches the playground representation of
 * an unpartitioned graph.
 */
export function createInitialAuditState({
  degree,
  forbiddenSet,
}: {
  degree:
    number

  forbiddenSet:
    readonly number[]
}): AuditSearchState {
  const initialOutdegrees =
    allOutdegrees(
      degree,
    )

  return {
    degree,

    forbiddenSet:
      uniqueSorted(
        forbiddenSet,
      ),

    partition:
      null,

    lovaszApplication:
      null,

    acrossDirection:
      null,

    balancedG:
      false,

    balancedL:
      false,

    balancedR:
      false,

    avoidCG:
      null,

    avoidCL:
      null,

    avoidCR:
      null,

    maLuG:
      null,

    maLuL:
      null,

    maLuR:
      null,

    hasanvandG:
      null,

    hasanvandL:
      null,

    hasanvandR:
      null,

    orientedTwoFactorCount:
      0,

    workingDegree:
      degree,

    fixedOutdegreeContribution:
      0,

    stabilization:
      null,

    directedMenger:
      null,

    directedMengerReservoir:
      null,

    outdegreePossibilities: {
      L:
        [...initialOutdegrees],

      R:
        [...initialOutdegrees],
    },

    steps: [],
  }
}

/*
 * A state is solved exactly when every
 * currently possible total outdegree avoids
 * F.
 *
 * We test both L and R even when they are
 * identical, which keeps this function
 * independent of whether a Lovasz partition
 * has already been introduced.
 */
export function isAuditStateSolved(
  state:
    AuditSearchState,
) {
  const forbidden =
    new Set(
      state.forbiddenSet,
    )

  return (
    state
      .outdegreePossibilities
      .L
      .every(
        (value) =>
          !forbidden.has(
            value,
          ),
      ) &&
    state
      .outdegreePossibilities
      .R
      .every(
        (value) =>
          !forbidden.has(
            value,
          ),
      )
  )
}

/*
 * A convenient helper for the search and
 * eventual audit UI.
 */
export function getAuditStateBadOutdegrees(
  state:
    AuditSearchState,
) {
  const forbidden =
    new Set(
      state.forbiddenSet,
    )

  return uniqueSorted([
    ...state
      .outdegreePossibilities
      .L
      .filter(
        (value) =>
          forbidden.has(
            value,
          ),
      ),

    ...state
      .outdegreePossibilities
      .R
      .filter(
        (value) =>
          forbidden.has(
            value,
          ),
      ),
  ])
}

/*
 * Breadth-first proof search will encounter
 * the same mathematical state by different
 * sequences of moves.
 *
 * This key lets us keep only the first
 * occurrence. With BFS, the first occurrence
 * is also a shortest recipe in number of
 * proof steps.
 *
 * We include the theorem-application details
 * that materially affect what moves can be
 * performed later.
 */
export function getAuditStateKey(
  state:
    AuditSearchState,
) {
  const partitionKey =
    state.partition ===
      null
      ? '-'
      : `${state.partition.s},${state.partition.t}`

  const maLuKey = (
    application:
      MaLuApplication | null,
  ) =>
    application ===
      null
      ? '-'
      : [
          application.target,
          application.mode,
          ...application
            .selectedValues,
        ].join(':')

  const hasanvandKey = (
    application:
      HasanvandApplication | null,
  ) =>
    application ===
      null
      ? '-'
      : [
          application.target,
          application.mode,
          ...application.rules.map(
            (rule) =>
              [
                rule.minDegree,
                rule.maxDegree,
                rule.p,
                rule.q,
              ].join(','),
          ),
        ].join(':')

  const stabilizationKey =
    state.stabilization ===
      null
      ? '-'
      : [
          state
            .stabilization
            .target,

          state
            .stabilization
            .q,
        ].join(':')

  const localMengerKey =
    state.directedMenger ===
      null
      ? '-'
      : [
          state
            .directedMenger
            .direction,

          ...state
            .directedMenger
            .demandRules
            .map(
              (rule) =>
                `${rule.outdegree},${rule.demand}`,
            ),

          '|',

          ...state
            .directedMenger
            .capacityRules
            .map(
              (rule) =>
                `${rule.outdegree},${rule.capacity}`,
            ),
        ].join(':')

  const reservoirMengerKey =
    state
      .directedMengerReservoir ===
      null
      ? '-'
      : [
          state
            .directedMengerReservoir
            .q,

          state
            .directedMengerReservoir
            .repairedOutdegree,
        ].join(':')

  return [
    `d=${state.degree}`,

    `wd=${state.workingDegree}`,

    `fixed=${state.fixedOutdegreeContribution}`,

    `twofactor=${state.orientedTwoFactorCount}`,

    `partition=${partitionKey}`,

    `cut=${state.acrossDirection ?? '-'}`,

    `balanced=${Number(state.balancedG)}${Number(state.balancedL)}${Number(state.balancedR)}`,

    `avoid=${state.avoidCG ?? '-'},${state.avoidCL ?? '-'},${state.avoidCR ?? '-'}`,

    `maluG=${maLuKey(state.maLuG)}`,

    `maluL=${maLuKey(state.maLuL)}`,

    `maluR=${maLuKey(state.maLuR)}`,

    `hasG=${hasanvandKey(state.hasanvandG)}`,

    `hasL=${hasanvandKey(state.hasanvandL)}`,

    `hasR=${hasanvandKey(state.hasanvandR)}`,

    `stab=${stabilizationKey}`,

    `localMenger=${localMengerKey}`,

    `reservoirMenger=${reservoirMengerKey}`,

    `L=${uniqueSorted(
      state
        .outdegreePossibilities
        .L,
    ).join(',')}`,

    `R=${uniqueSorted(
      state
        .outdegreePossibilities
        .R,
    ).join(',')}`,
  ].join('|')
}

/*
 * Useful later when turning a solved search
 * state into an AuditProofRecipe.
 */
export function getAuditFinalOutdegrees(
  state:
    AuditSearchState,
) {
  return {
    L:
      uniqueSorted(
        state
          .outdegreePossibilities
          .L,
      ),

    R:
      uniqueSorted(
        state
          .outdegreePossibilities
          .R,
      ),
  }
}

/*
 * Mainly useful for debugging the search:
 * before partitioning, L and R should carry
 * the same abstract possibility set.
 */
export function auditStateHasSharedOutdegrees(
  state:
    AuditSearchState,
) {
  return sameValues(
    state
      .outdegreePossibilities
      .L,

    state
      .outdegreePossibilities
      .R,
  )
}