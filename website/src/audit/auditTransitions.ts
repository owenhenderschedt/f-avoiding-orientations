import {
  createLovaszApplication,
  getLovaszPairs,
  type LovaszPair,
} from '../tools/lovaszPartition'
import type {
  AcrossDirection,
} from '../tools/orientAcrossPartition'
import type {
  GraphPart,
  PartOutdegreePossibilities,
} from '../playground/outdegreePossibilities'
import deriveOutdegreePossibilities from '../playground/deriveOutdegreePossibilities'
import {
  shiftPartOutdegrees,
} from '../playground/shiftOutdegrees'
import {
  createMaLuInternalApplication,
  createMaLuTotalApplication,
} from '../tools/maLuApplication'
import {
  getMaLuPartSelectionCertificate,
  getMaLuWholeSelectionCertificate,
} from '../tools/maLuMath'
import {
  getMaLuTotalCertificate,
} from '../tools/maLuTargeting'
import type {
  AuditSearchState,
} from './auditState'

/*
 * Symbolic proof transitions used by the
 * completeness audit.
 *
 * Current constructor layer:
 *
 *   - Lovasz partition
 *   - orient L -> R / R -> L
 *   - balanced orientation
 *   - avoid c
 *   - Ma-Lu
 *
 * Separate transition files currently add:
 *
 *   - oriented 2-factor
 *   - local-alpha Directed Menger
 *
 * Later:
 *
 *   - Hasanvand
 *   - stabilization
 *   - reservoir Directed Menger
 */

/*
 * Reuse the same outdegree engine as the
 * playground.
 *
 * deriveOutdegreePossibilities works in the
 * residual graph. We then shift every value
 * by the fixed contribution coming from
 * removed oriented 2-factors.
 */
function getConstructorOutdegreePossibilities(
  state:
    AuditSearchState,
): PartOutdegreePossibilities {
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

/*
 * After a structural fixer or Directed
 * Menger repair has been applied, we do not
 * go backward and modify its starting
 * constructor.
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
      null ||
    state.parityBoundsG !==
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

/*
 * Every nonempty subset.
 *
 * For d <= 12 the forbidden set has size
 * at most 5, so this gives at most
 *
 *     2^5 - 1 = 31
 *
 * possibilities.
 */
function getNonemptySubsets(
  values:
    readonly number[],
) {
  const normalized =
    uniqueSorted(
      values,
    )

  const subsets:
    number[][] = []

  const count =
    1 <<
    normalized.length

  for (
    let mask = 1;
    mask < count;
    mask += 1
  ) {
    const subset:
      number[] = []

    for (
      let index = 0;
      index <
        normalized.length;
      index += 1
    ) {
      if (
        (
          mask &
          (
            1 <<
            index
          )
        ) !==
        0
      ) {
        subset.push(
          normalized[
            index
          ],
        )
      }
    }

    subsets.push(
      subset,
    )
  }

  /*
   * Try larger lists first.
   *
   * If the entire relevant forbidden list
   * is already Ma-Lu admissible, this tends
   * to produce the useful construction
   * immediately.
   */
  subsets.sort(
    (a, b) =>
      b.length -
      a.length,
  )

  return subsets
}

function getAvoidCValues(
  maxDegree:
    number,
) {
  const values:
    number[] = []

  for (
    let c = 2;
    c <= maxDegree;
    c += 1
  ) {
    values.push(
      c,
    )
  }

  return values
}

/*
 * Forbidden TOTAL outdegrees that are still
 * currently possible on the chosen target.
 */
function getRelevantForbiddenValues(
  state:
    AuditSearchState,

  target:
    'G' | GraphPart,
) {
  const possible =
    target === 'G'
      ? uniqueSorted([
          ...state
            .outdegreePossibilities
            .L,

          ...state
            .outdegreePossibilities
            .R,
        ])
      : state
          .outdegreePossibilities[
            target
          ]

  const possibleSet =
    new Set(
      possible,
    )

  return state
    .forbiddenSet
    .filter(
      (value) =>
        possibleSet.has(
          value,
        ),
    )
}

/*
 * LOVASZ PARTITION
 */
export function applyAuditLovaszPartition(
  state:
    AuditSearchState,

  pair:
    LovaszPair,
): AuditSearchState | null {
  if (
    constructorsLocked(
      state,
    ) ||
    state.partition !==
      null ||
    wholeGraphAlreadyOriented(
      state,
    )
  ) {
    return null
  }

  const application =
    createLovaszApplication({
      degree:
        state.workingDegree,

      pair,
    })

  if (
    application ===
    null
  ) {
    return null
  }

  const nextState:
    AuditSearchState = {
    ...state,

    partition:
      application.pair,

    lovaszApplication:
      application,

    steps: [
      ...state.steps,

      {
        type:
          'lovasz-partition',

        s:
          pair.s,

        t:
          pair.t,
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
 * ORIENT THE CUT
 */
export function applyAuditAcrossOrientation(
  state:
    AuditSearchState,

  direction:
    AcrossDirection,
): AuditSearchState | null {
  if (
    constructorsLocked(
      state,
    ) ||
    state.partition ===
      null ||
    state.acrossDirection !==
      null
  ) {
    return null
  }

  const nextState:
    AuditSearchState = {
    ...state,

    acrossDirection:
      direction,

    steps: [
      ...state.steps,

      {
        type:
          'orient-across',

        direction,
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
 * BALANCE G
 */
export function applyAuditBalanceGraph(
  state:
    AuditSearchState,
): AuditSearchState | null {
  if (
    constructorsLocked(
      state,
    ) ||
    state.partition !==
      null ||
    wholeGraphAlreadyOriented(
      state,
    )
  ) {
    return null
  }

  const nextState:
    AuditSearchState = {
    ...state,

    balancedG:
      true,

    steps: [
      ...state.steps,

      {
        type:
          'balance',

        target:
          'G',
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
 * BALANCE L OR R
 */
export function applyAuditBalancePart(
  state:
    AuditSearchState,

  part:
    GraphPart,
): AuditSearchState | null {
  if (
    constructorsLocked(
      state,
    ) ||
    state.partition ===
      null
  ) {
    return null
  }

  if (
    part === 'L' &&
    leftAlreadyOriented(
      state,
    )
  ) {
    return null
  }

  if (
    part === 'R' &&
    rightAlreadyOriented(
      state,
    )
  ) {
    return null
  }

  const nextState:
    AuditSearchState = {
    ...state,

    balancedL:
      part === 'L'
        ? true
        : state.balancedL,

    balancedR:
      part === 'R'
        ? true
        : state.balancedR,

    steps: [
      ...state.steps,

      {
        type:
          'balance',

        target:
          part,
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
 * AVOID c ON G
 */
export function applyAuditAvoidCGraph(
  state:
    AuditSearchState,

  c:
    number,
): AuditSearchState | null {
  if (
    constructorsLocked(
      state,
    ) ||
    state.partition !==
      null ||
    wholeGraphAlreadyOriented(
      state,
    ) ||
    c < 2 ||
    c >
      state.workingDegree
  ) {
    return null
  }

  const nextState:
    AuditSearchState = {
    ...state,

    avoidCG:
      c,

    steps: [
      ...state.steps,

      {
        type:
          'avoid-c',

        target:
          'G',

        c,
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
 * AVOID c ON L OR R
 */
export function applyAuditAvoidCPart(
  state:
    AuditSearchState,

  part:
    GraphPart,

  c:
    number,
): AuditSearchState | null {
  if (
    constructorsLocked(
      state,
    ) ||
    state.partition ===
      null
  ) {
    return null
  }

  const maxDegree =
    part === 'L'
      ? state.partition.s
      : state.partition.t

  if (
    c < 2 ||
    c >
      maxDegree
  ) {
    return null
  }

  if (
    part === 'L' &&
    leftAlreadyOriented(
      state,
    )
  ) {
    return null
  }

  if (
    part === 'R' &&
    rightAlreadyOriented(
      state,
    )
  ) {
    return null
  }

  const nextState:
    AuditSearchState = {
    ...state,

    avoidCL:
      part === 'L'
        ? c
        : state.avoidCL,

    avoidCR:
      part === 'R'
        ? c
        : state.avoidCR,

    steps: [
      ...state.steps,

      {
        type:
          'avoid-c',

        target:
          part,

        c,
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
 * MA-LU ON THE WHOLE GRAPH
 *
 * IMPORTANT:
 *
 * selectedValues are TOTAL outdegrees in
 * the ORIGINAL graph.
 *
 * If k oriented 2-factors have already
 * been removed, every vertex already has
 * k fixed outgoing edges. Hence
 *
 *     d_G^+(v)
 *       =
 *     k + d_H^+(v).
 *
 * Therefore a total forbidden value x is
 * represented in the residual graph by
 *
 *     x - k.
 *
 * This translation is essential after a
 * 2-factor reduction.
 */
export function applyAuditMaLuGraph(
  state:
    AuditSearchState,

  selectedValues:
    readonly number[],
): AuditSearchState | null {
  if (
    constructorsLocked(
      state,
    ) ||
    state.partition !==
      null ||
    wholeGraphAlreadyOriented(
      state,
    ) ||
    selectedValues.length ===
      0
  ) {
    return null
  }

  const internalValues =
    uniqueSorted(
      selectedValues.map(
        (value) =>
          value -
          state
            .fixedOutdegreeContribution,
      ),
    )

  /*
   * Values outside the residual outdegree
   * range do not define a valid residual
   * forbidden list for this application.
   */
  if (
    internalValues.some(
      (value) =>
        value < 0 ||
        value >
          state.workingDegree,
    )
  ) {
    return null
  }

  const certificate =
    getMaLuWholeSelectionCertificate({
      degree:
        state.workingDegree,

      selectedForbiddenSet:
        internalValues,
    })

  if (
    !certificate.applicable
  ) {
    return null
  }

  const application =
    createMaLuInternalApplication(
      'G',

      internalValues,
    )

  const nextState:
    AuditSearchState = {
    ...state,

    maLuG:
      application,

    steps: [
      ...state.steps,

      {
        type:
          'ma-lu',

        target:
          'G',

        mode:
          'internal',

        /*
         * The Ma-Lu application itself is
         * occurring in the residual graph,
         * so the recipe records the actual
         * residual forbidden values used by
         * the theorem.
         */
        selectedValues: [
          ...internalValues,
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
 * MA-LU WITH A UNIFORM INTERNAL LIST
 * ON ONE LOVASZ PART.
 *
 * selectedValues are INTERNAL outdegrees
 * in that part.
 */
export function applyAuditMaLuPartInternal(
  state:
    AuditSearchState,

  part:
    GraphPart,

  selectedValues:
    readonly number[],
): AuditSearchState | null {
  if (
    constructorsLocked(
      state,
    ) ||
    state.partition ===
      null ||
    selectedValues.length ===
      0
  ) {
    return null
  }

  if (
    part === 'L' &&
    leftAlreadyOriented(
      state,
    )
  ) {
    return null
  }

  if (
    part === 'R' &&
    rightAlreadyOriented(
      state,
    )
  ) {
    return null
  }

  const certificate =
    getMaLuPartSelectionCertificate({
      target:
        part,

      partition:
        state.partition,

      selectedForbiddenSet:
        selectedValues,
    })

  if (
    !certificate.applicable
  ) {
    return null
  }

  const application =
    createMaLuInternalApplication(
      part,

      selectedValues,
    )

  const nextState:
    AuditSearchState = {
    ...state,

    maLuL:
      part === 'L'
        ? application
        : state.maLuL,

    maLuR:
      part === 'R'
        ? application
        : state.maLuR,

    steps: [
      ...state.steps,

      {
        type:
          'ma-lu',

        target:
          part,

        mode:
          'internal',

        selectedValues: [
          ...selectedValues,
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
 * MA-LU TARGETING TOTAL OUTDEGREES
 * ON ONE LOVASZ PART.
 *
 * The existing Ma-Lu targeting machinery
 * translates total outdegrees into the
 * correct degree-dependent internal
 * forbidden lists.
 *
 * It also incorporates
 * fixedOutdegreeContribution, so this mode
 * remains correct after oriented 2-factor
 * reductions.
 */
export function applyAuditMaLuPartTotal(
  state:
    AuditSearchState,

  part:
    GraphPart,

  selectedValues:
    readonly number[],
): AuditSearchState | null {
  if (
    constructorsLocked(
      state,
    ) ||
    state.partition ===
      null ||
    selectedValues.length ===
      0
  ) {
    return null
  }

  if (
    part === 'L' &&
    leftAlreadyOriented(
      state,
    )
  ) {
    return null
  }

  if (
    part === 'R' &&
    rightAlreadyOriented(
      state,
    )
  ) {
    return null
  }

  const certificate =
    getMaLuTotalCertificate({
      target:
        part,

      workingDegree:
        state.workingDegree,

      fixedOutdegreeContribution:
        state
          .fixedOutdegreeContribution,

      partition:
        state.partition,

      acrossDirection:
        state.acrossDirection,

      selectedTotalOutdegrees:
        selectedValues,
    })

  if (
    !certificate.ready ||
    !certificate.applicable
  ) {
    return null
  }

  const application =
    createMaLuTotalApplication(
      part,

      selectedValues,

      certificate.checks,
    )

  const nextState:
    AuditSearchState = {
    ...state,

    maLuL:
      part === 'L'
        ? application
        : state.maLuL,

    maLuR:
      part === 'R'
        ? application
        : state.maLuR,

    steps: [
      ...state.steps,

      {
        type:
          'ma-lu',

        target:
          part,

        mode:
          'total',

        selectedValues: [
          ...selectedValues,
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
 * Generate Ma-Lu candidates on one Lovasz
 * part.
 */
function pushMaLuPartCandidates({
  transitions,
  state,
  part,
}: {
  transitions:
    AuditSearchState[]

  state:
    AuditSearchState

  part:
    GraphPart
}) {
  if (
    state.partition ===
    null
  ) {
    return
  }

  const maxInternalDegree =
    part === 'L'
      ? state.partition.s
      : state.partition.t

  /*
   * INTERNAL MODE
   *
   * Here the selected numbers are interpreted
   * literally as internal outdegrees in the
   * chosen part.
   *
   * We currently seed these candidates from
   * the global forbidden set. This is a
   * conservative finite candidate family.
   *
   * TOTAL mode below is the more important
   * mechanism when the global forbidden
   * values need to be translated through
   * cut contributions.
   */
  const internalCandidates =
    state
      .forbiddenSet
      .filter(
        (value) =>
          value >= 0 &&
          value <=
            maxInternalDegree,
      )

  for (
    const selectedValues
    of getNonemptySubsets(
      internalCandidates,
    )
  ) {
    const next =
      applyAuditMaLuPartInternal(
        state,

        part,

        selectedValues,
      )

    if (
      next !==
      null
    ) {
      transitions.push(
        next,
      )
    }
  }

  /*
   * TOTAL MODE
   *
   * Only forbidden total outdegrees that are
   * still possible on this part are worth
   * targeting.
   */
  const totalCandidates =
    getRelevantForbiddenValues(
      state,

      part,
    )

  for (
    const selectedValues
    of getNonemptySubsets(
      totalCandidates,
    )
  ) {
    const next =
      applyAuditMaLuPartTotal(
        state,

        part,

        selectedValues,
      )

    if (
      next !==
      null
    ) {
      transitions.push(
        next,
      )
    }
  }
}

/*
 * Generate all currently encoded
 * constructor transitions.
 *
 * The audit deliberately permits the
 * constructor pieces to be chosen in
 * different orders. A later runtime
 * optimization may impose a canonical
 * search order while leaving the actual
 * playground order-independent.
 */
export function getBasicAuditTransitions(
  state:
    AuditSearchState,
) {
  const transitions:
    AuditSearchState[] = []

  if (
    constructorsLocked(
      state,
    )
  ) {
    return transitions
  }

  /*
   * WHOLE GRAPH
   */
  if (
    state.partition ===
    null
  ) {
    if (
      !wholeGraphAlreadyOriented(
        state,
      )
    ) {
      /*
       * Balance.
       */
      const balanced =
        applyAuditBalanceGraph(
          state,
        )

      if (
        balanced !==
        null
      ) {
        transitions.push(
          balanced,
        )
      }

      /*
       * Avoid c.
       */
      for (
        const c
        of getAvoidCValues(
          state.workingDegree,
        )
      ) {
        const avoidC =
          applyAuditAvoidCGraph(
            state,

            c,
          )

        if (
          avoidC !==
          null
        ) {
          transitions.push(
            avoidC,
          )
        }
      }

      /*
       * Ma-Lu.
       *
       * selectedValues are TOTAL forbidden
       * outdegrees. applyAuditMaLuGraph
       * performs the residual translation
       * when oriented 2-factors have already
       * been removed.
       */
      const maLuCandidates =
        getRelevantForbiddenValues(
          state,

          'G',
        )

      for (
        const selectedValues
        of getNonemptySubsets(
          maLuCandidates,
        )
      ) {
        const maLu =
          applyAuditMaLuGraph(
            state,

            selectedValues,
          )

        if (
          maLu !==
          null
        ) {
          transitions.push(
            maLu,
          )
        }
      }

      /*
       * Every available Lovasz partition.
       */
      for (
        const pair
        of getLovaszPairs(
          state.workingDegree,
        )
      ) {
        const partitioned =
          applyAuditLovaszPartition(
            state,

            pair,
          )

        if (
          partitioned !==
          null
        ) {
          transitions.push(
            partitioned,
          )
        }
      }
    }

    return transitions
  }

  /*
   * PARTITIONED GRAPH
   */

  /*
   * Orient the cut in either direction.
   */
  if (
    state.acrossDirection ===
    null
  ) {
    const leftToRight =
      applyAuditAcrossOrientation(
        state,

        'L-to-R',
      )

    if (
      leftToRight !==
      null
    ) {
      transitions.push(
        leftToRight,
      )
    }

    const rightToLeft =
      applyAuditAcrossOrientation(
        state,

        'R-to-L',
      )

    if (
      rightToLeft !==
      null
    ) {
      transitions.push(
        rightToLeft,
      )
    }
  }

  /*
   * L constructors.
   */
  if (
    !leftAlreadyOriented(
      state,
    )
  ) {
    const balancedL =
      applyAuditBalancePart(
        state,

        'L',
      )

    if (
      balancedL !==
      null
    ) {
      transitions.push(
        balancedL,
      )
    }

    for (
      const c
      of getAvoidCValues(
        state.partition.s,
      )
    ) {
      const avoidC =
        applyAuditAvoidCPart(
          state,

          'L',

          c,
        )

      if (
        avoidC !==
        null
      ) {
        transitions.push(
          avoidC,
        )
      }
    }

    pushMaLuPartCandidates({
      transitions,

      state,

      part:
        'L',
    })
  }

  /*
   * R constructors.
   */
  if (
    !rightAlreadyOriented(
      state,
    )
  ) {
    const balancedR =
      applyAuditBalancePart(
        state,

        'R',
      )

    if (
      balancedR !==
      null
    ) {
      transitions.push(
        balancedR,
      )
    }

    for (
      const c
      of getAvoidCValues(
        state.partition.t,
      )
    ) {
      const avoidC =
        applyAuditAvoidCPart(
          state,

          'R',

          c,
        )

      if (
        avoidC !==
        null
      ) {
        transitions.push(
          avoidC,
        )
      }
    }

    pushMaLuPartCandidates({
      transitions,

      state,

      part:
        'R',
    })
  }

  return transitions
}
