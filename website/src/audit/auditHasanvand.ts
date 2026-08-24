import {
  createHasanvandApplication,
} from '../tools/hasanvandApplication'
import type {
  HasanvandDegreeRule,
  HasanvandTarget,
} from '../tools/hasanvandMath'
import deriveOutdegreePossibilities from '../playground/deriveOutdegreePossibilities'
import {
  shiftPartOutdegrees,
} from '../playground/shiftOutdegrees'
import type {
  AuditSearchState,
} from './auditState'

/*
 * Hasanvand audit layer, V1.
 *
 * This first version exhaustively checks
 * every CONSTANT pair (p,q) supported by
 * the current working graph:
 *
 *   - on G;
 *   - on L;
 *   - on R.
 *
 * The degree-dependent "Hasanvand by
 * degree" mode will be added next. Keeping
 * it separate makes the d=10 benchmark
 * especially clean.
 */

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

function getTargetInformation(
  state:
    AuditSearchState,

  target:
    HasanvandTarget,
) {
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
     * A Lovasz part is only known to
     * have maximum degree at most s or t.
     *
     * Thus every exact degree
     *
     *     0,1,...,maxDegree
     *
     * must be allowed by the certificate.
     */
    possibleDegrees:
      getAllDegreesThrough(
        maxDegree,
      ),
  }
}

function setHasanvandApplication(
  state:
    AuditSearchState,

  target:
    HasanvandTarget,

  application:
    NonNullable<
      AuditSearchState[
        'hasanvandG'
      ]
    >,

  rules:
    readonly HasanvandDegreeRule[],
): AuditSearchState {
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

        mode:
          'uniform',

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
 * Try one constant Hasanvand pair.
 *
 * The AUDIT does not duplicate
 * Hasanvand's hypotheses here.
 *
 * It proposes (p,q), then asks the exact
 * existing playground validator:
 *
 *     createHasanvandApplication(...)
 *
 * Invalid choices simply return null.
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

  return setHasanvandApplication(
    state,

    target,

    application,

    [rule],
  )
}

function possibilitiesKey(
  state:
    AuditSearchState,
) {
  return (
    state
      .outdegreePossibilities
      .L
      .join(',') +
    '|' +
    state
      .outdegreePossibilities
      .R
      .join(',')
  )
}

/*
 * Exhaustively enumerate every natural
 * constant pair
 *
 *     0 <= p < q <= maxDegree.
 *
 * createHasanvandApplication is still the
 * final mathematical gatekeeper.
 *
 * Several different pairs can occasionally
 * produce the same abstract outdegree state.
 * Future proof moves only see that state, so
 * we retain the first representative and
 * discard duplicate outputs.
 */
function getTargetTransitions(
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
    null ||
    information.maxDegree <=
      0
  ) {
    return []
  }

  const transitions:
    AuditSearchState[] = []

  const seenPossibilities =
    new Set<string>()

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
        information.maxDegree;
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
 * All constant-parameter Hasanvand moves
 * presently available from this state.
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

  return [
    ...getTargetTransitions(
      state,
      'G',
    ),

    ...getTargetTransitions(
      state,
      'L',
    ),

    ...getTargetTransitions(
      state,
      'R',
    ),
  ]
}