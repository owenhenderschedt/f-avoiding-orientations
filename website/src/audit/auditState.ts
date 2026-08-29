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
  ParityBoundsApplication,
} from '../tools/parityBoundsApplication'
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

export type AuditBoundedDegreeKind =
  | 'delta-5-0125'
  | 'delta-6-avoid-356'

export type AuditBoundedDegreeApplication = {
  kind:
    AuditBoundedDegreeKind

  target:
    'G' | 'L' | 'R'

  theoremMaxDegree:
    5 | 6

  targetMaxDegree:
    number

  reversed:
    boolean

  totalOutdegrees:
    readonly number[]
}

/*
 * Non-React mathematical state explored
 * by the completeness audit.
 */
export type AuditSearchState = {
  degree:
    number

  forbiddenSet:
    readonly number[]

  partition:
    LovaszPair | null

  lovaszApplication:
    LovaszApplication | null

  acrossDirection:
    AcrossDirection | null

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
   * Whole-working-graph Parity Bounds
   * constructor.
   */
  parityBoundsG:
    ParityBoundsApplication | null

  /*
   * Legacy audit-only fields.
   *
   * The corresponding bounded-degree
   * transition file remains in the repo
   * for now, but proofSearch no longer
   * exposes it to the completeness audit.
   * These fields therefore remain null in
   * an honest current-toolkit search.
   */
  boundedDegreeG:
    AuditBoundedDegreeApplication | null

  boundedDegreeL:
    AuditBoundedDegreeApplication | null

  boundedDegreeR:
    AuditBoundedDegreeApplication | null

  orientedTwoFactorCount:
    number

  workingDegree:
    number

  fixedOutdegreeContribution:
    number

  /*
   * One LIVE stabilization application
   * now stores the entire selected set Q.
   */
  stabilization:
    StabilizeOutdegreeClassApplication | null

  directedMenger:
    DirectedMengerApplication | null

  /*
   * One LIVE reservoir application stores
   * all simultaneous repairs q -> q+1.
   */
  directedMengerReservoir:
    DirectedMengerReservoirApplication | null

  outdegreePossibilities:
    PartOutdegreePossibilities

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

    parityBoundsG:
      null,

    boundedDegreeG:
      null,

    boundedDegreeL:
      null,

    boundedDegreeR:
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

  const parityBoundsKey =
    state.parityBoundsG ===
      null
      ? '-'
      : [
          state
            .parityBoundsG
            .normalInterval
            .lower,

          state
            .parityBoundsG
            .normalInterval
            .upper,

          state
            .parityBoundsG
            .exceptionalInterval
            .lower,

          state
            .parityBoundsG
            .exceptionalInterval
            .upper,
        ].join(',')

  const boundedKey = (
    application:
      AuditBoundedDegreeApplication | null,
  ) =>
    application ===
      null
      ? '-'
      : [
          application.kind,
          application.target,
          application.reversed
            ? 'rev'
            : 'forward',
          application
            .totalOutdegrees
            .join(','),
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
            .qs
            .join(','),
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
            .qs
            .join(','),

          '->',

          state
            .directedMengerReservoir
            .repairedOutdegrees
            .join(','),
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

    `parity=${parityBoundsKey}`,

    /*
     * These stay "-" in the honest live
     * toolkit search because proofSearch
     * no longer generates bounded-degree
     * transitions.
     */
    `boundedG=${boundedKey(state.boundedDegreeG)}`,

    `boundedL=${boundedKey(state.boundedDegreeL)}`,

    `boundedR=${boundedKey(state.boundedDegreeR)}`,

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
