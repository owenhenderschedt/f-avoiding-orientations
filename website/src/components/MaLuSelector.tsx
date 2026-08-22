import {
  useState,
} from 'react'
import Math from './Math'
import {
  getMaLuSelectionCertificate,
  getMaLuSelectableValues,
  type MaLuTarget,
} from '../tools/maLuMath'
import {
  getMaLuTotalCertificate,
} from '../tools/maLuTargeting'
import type {
  MaLuApplicationMode,
} from '../tools/maLuApplication'
import type {
  LovaszPair,
} from '../tools/lovaszPartition'
import type {
  AcrossDirection,
} from '../tools/orientAcrossPartition'

type MaLuSelectorProps = {
  target: MaLuTarget

  maxSelectableDegree: number

  possibleDegrees:
    readonly number[]

  globalForbiddenSet:
    readonly number[]

  /*
   * Every currently possible TOTAL
   * outdegree for this target.
   *
   * Values in F are highlighted red,
   * but every value remains selectable.
   */
  totalCandidateOutdegrees:
    readonly number[]

  workingDegree: number

  fixedOutdegreeContribution:
    number

  partition:
    LovaszPair | null

  acrossDirection:
    AcrossDirection | null

  onApply:
    (
      mode:
        MaLuApplicationMode,

      selectedValues:
        readonly number[],
    ) => void

  /*
   * Opens the Ma-Lu theorem/reference
   * panel without changing the current
   * selector state.
   */
  onOpenReference: () => void

  onBack: () => void
}

function latexSet(
  values: readonly number[],
) {
  if (
    values.length === 0
  ) {
    return '\\varnothing'
  }

  return (
    '\\{' +
    values.join(',') +
    '\\}'
  )
}

function targetGraphLatex(
  target: MaLuTarget,
) {
  if (
    target === 'G'
  ) {
    return 'G'
  }

  return `G[${target}]`
}

function degreeInformationLatex(
  possibleDegrees:
    readonly number[],
) {
  if (
    possibleDegrees.length ===
    0
  ) {
    return (
      '\\text{no degree information}'
    )
  }

  if (
    possibleDegrees.length ===
    1
  ) {
    return (
      'd_H(v)=' +
      possibleDegrees[0]
    )
  }

  const first =
    possibleDegrees[0]

  const last =
    possibleDegrees[
      possibleDegrees.length - 1
    ]

  const isConsecutiveRange =
    possibleDegrees.every(
      (
        degree,
        index,
      ) =>
        degree ===
        first + index,
    )

  if (
    isConsecutiveRange
  ) {
    return (
      `${first}\\leq d_H(v)`
      + `\\leq ${last}`
    )
  }

  return (
    'd_H(v)\\in'
    + latexSet(
      possibleDegrees,
    )
  )
}

export default function MaLuSelector({
  target,
  maxSelectableDegree,
  possibleDegrees,
  globalForbiddenSet,
  totalCandidateOutdegrees,
  workingDegree,
  fixedOutdegreeContribution,
  partition,
  acrossDirection,
  onApply,
  onOpenReference,
  onBack,
}: MaLuSelectorProps) {
  const totalModeAvailable =
    target === 'G' ||
    (
      partition !== null &&
      acrossDirection !== null
    )

  const [
    mode,
    setMode,
  ] =
    useState<
      MaLuApplicationMode
    >(
      totalModeAvailable
        ? 'total'
        : 'internal',
    )

  const [
    selectedValues,
    setSelectedValues,
  ] =
    useState<number[]>([])

  const internalSelectableValues =
    getMaLuSelectableValues(
      maxSelectableDegree,
    )

  const selectableValues =
    mode === 'total'
      ? [
          ...totalCandidateOutdegrees,
        ]
      : internalSelectableValues

  const internalCertificate =
    getMaLuSelectionCertificate({
      target,

      selectedForbiddenSet:
        selectedValues,

      possibleDegrees,
    })

  const totalCertificate =
    getMaLuTotalCertificate({
      target,

      workingDegree,

      fixedOutdegreeContribution,

      partition,

      acrossDirection,

      selectedTotalOutdegrees:
        selectedValues,
    })

  const activeApplicable =
    mode === 'total'
      ? (
          totalCertificate.ready &&
          totalCertificate.applicable
        )
      : internalCertificate.applicable

  const firstFailure =
    mode === 'total'
      ? totalCertificate
          .firstFailingCheck
      : internalCertificate
          .firstFailingCheck

  const hasSelection =
    selectedValues.length > 0

  const canApply =
    hasSelection &&
    activeApplicable

  const targetGraph =
    targetGraphLatex(
      target,
    )

  const selectedSetLatex =
    latexSet(
      selectedValues,
    )

  function changeMode(
    newMode:
      MaLuApplicationMode,
  ) {
    if (
      newMode === 'total' &&
      !totalModeAvailable
    ) {
      return
    }

    setMode(
      newMode,
    )

    setSelectedValues([])
  }

  function toggleValue(
    value: number,
  ) {
    setSelectedValues(
      (current) => {
        if (
          current.includes(
            value,
          )
        ) {
          return current.filter(
            (entry) =>
              entry !==
              value,
          )
        }

        return [
          ...current,
          value,
        ].sort(
          (a, b) =>
            a - b,
        )
      },
    )
  }

  function clearSelection() {
    setSelectedValues([])
  }

  function applySelection() {
    if (
      !canApply
    ) {
      return
    }

    onApply(
      mode,
      selectedValues,
    )
  }

  const panelBorderColor =
    !hasSelection
      ? '#e2e8f0'
      : activeApplicable
        ? '#bbf7d0'
        : '#fecaca'

  const panelBackground =
    !hasSelection
      ? '#f8fafc'
      : activeApplicable
        ? '#f0fdf4'
        : '#fef2f2'

  const panelTextColor =
    !hasSelection
      ? '#64748b'
      : activeApplicable
        ? '#166534'
        : '#991b1b'

  return (
    <>
      <div
        style={{
          padding:
            '8px 10px 10px',
          borderBottom:
            '1px solid #e2e8f0',
          marginBottom:
            '9px',
          textAlign:
            'center',
        }}
      >
        <button
          type="button"
          onClick={
            onOpenReference
          }
          style={{
            font: 'inherit',
            color:
              '#334155',
            fontWeight:
              600,
            background:
              'transparent',
            border: 'none',
            borderBottom:
              '1px solid #64748b',
            padding:
              '0 1px 2px',
            cursor:
              'pointer',
          }}
        >
          Ma–Lu on{' '}
          <Math>
            {targetGraph}
          </Math>
        </button>
      </div>

      <div
        style={{
          display:
            'grid',
          gridTemplateColumns:
            '1fr 1fr',
          gap: '6px',
          margin:
            '0 8px 11px',
          padding: '3px',
          border:
            '1px solid #e2e8f0',
          borderRadius:
            '9px',
          background:
            '#f8fafc',
        }}
      >
        <button
          type="button"
          onClick={() =>
            changeMode(
              'total',
            )
          }
          disabled={
            !totalModeAvailable
          }
          style={{
            font: 'inherit',
            padding:
              '7px 5px',
            border:
              mode === 'total'
                ? '1px solid #cbd5e1'
                : '1px solid transparent',
            borderRadius:
              '7px',
            background:
              mode === 'total'
                ? '#ffffff'
                : 'transparent',
            color:
              !totalModeAvailable
                ? '#94a3b8'
                : '#334155',
            cursor:
              totalModeAvailable
                ? 'pointer'
                : 'default',
            fontSize:
              '14px',
            boxShadow:
              mode === 'total'
                ? '0 1px 3px rgba(0, 0, 0, 0.06)'
                : 'none',
          }}
        >
          Target totals
        </button>

        <button
          type="button"
          onClick={() =>
            changeMode(
              'internal',
            )
          }
          style={{
            font: 'inherit',
            padding:
              '7px 5px',
            border:
              mode ===
              'internal'
                ? '1px solid #cbd5e1'
                : '1px solid transparent',
            borderRadius:
              '7px',
            background:
              mode ===
              'internal'
                ? '#ffffff'
                : 'transparent',
            color:
              '#334155',
            cursor:
              'pointer',
            fontSize:
              '14px',
            boxShadow:
              mode ===
              'internal'
                ? '0 1px 3px rgba(0, 0, 0, 0.06)'
                : 'none',
          }}
        >
          Internal
        </button>
      </div>

      <div
        style={{
          padding:
            '0 10px 8px',
          color:
            '#64748b',
          fontSize:
            '15px',
          lineHeight:
            1.35,
          textAlign:
            'center',
        }}
      >
        {mode ===
        'total' ? (
          <>
            Choose total
            outdegrees to
            eliminate.
          </>
        ) : (
          <>
            Choose internal
            outdegrees to
            avoid.
          </>
        )}
      </div>

      {mode ===
        'total' &&
        !totalModeAvailable && (
          <div
            style={{
              margin:
                '0 8px 10px',
              padding:
                '9px 10px',
              border:
                '1px solid #e2e8f0',
              borderRadius:
                '8px',
              background:
                '#f8fafc',
              color:
                '#64748b',
              fontSize:
                '14px',
              lineHeight:
                1.4,
              textAlign:
                'center',
            }}
          >
            Orient the
            crossing edges
            first so total
            outdegrees can
            be translated
            into internal
            Ma–Lu
            constraints.
          </div>
        )}

      {mode ===
        'total' &&
      totalModeAvailable &&
      selectableValues.length ===
        0 ? (
        <div
          style={{
            margin:
              '2px 8px 10px',
            padding:
              '11px 10px',
            border:
              '1px solid #e2e8f0',
            borderRadius:
              '8px',
            background:
              '#f8fafc',
            color:
              '#64748b',
            textAlign:
              'center',
            fontSize:
              '14px',
            lineHeight:
              1.4,
          }}
        >
          No total
          outdegrees are
          currently
          available to
          target.
        </div>
      ) : (
        <div
          style={{
            padding:
              '2px 8px',
          }}
        >
          <div
            style={{
              display:
                'flex',
              flexWrap:
                'wrap',
              justifyContent:
                'center',
              gap: '7px',
            }}
          >
            {selectableValues.map(
              (value) => {
                const selected =
                  selectedValues.includes(
                    value,
                  )

                const appearsInGlobalF =
                  globalForbiddenSet.includes(
                    value,
                  )

                let border =
                  '1px solid #cbd5e1'

                let background =
                  '#ffffff'

                let color =
                  '#334155'

                if (
                  appearsInGlobalF
                ) {
                  border =
                    '1px solid #fca5a5'

                  color =
                    '#b91c1c'
                }

                if (
                  selected
                ) {
                  border =
                    appearsInGlobalF
                      ? '1px solid #b91c1c'
                      : '1px solid #475569'

                  background =
                    appearsInGlobalF
                      ? '#fee2e2'
                      : '#e2e8f0'

                  color =
                    appearsInGlobalF
                      ? '#991b1b'
                      : '#1e293b'
                }

                return (
                  <button
                    key={
                      value
                    }
                    type="button"
                    onClick={() =>
                      toggleValue(
                        value,
                      )
                    }
                    aria-pressed={
                      selected
                    }
                    style={{
                      font:
                        'inherit',
                      minWidth:
                        '38px',
                      height:
                        '36px',
                      padding:
                        '4px 9px',
                      border,
                      borderRadius:
                        '8px',
                      background,
                      color,
                      cursor:
                        'pointer',
                    }}
                  >
                    <Math>
                      {`${value}`}
                    </Math>
                  </button>
                )
              },
            )}
          </div>

          <div
            style={{
              marginTop:
                '9px',
              textAlign:
                'center',
              color:
                '#64748b',
              fontSize:
                '14px',
              lineHeight:
                1.35,
            }}
          >
            {mode ===
            'total' ? (
              <>
                Red outline =
                this total
                outdegree is in
                the current{' '}
                <Math>
                  {'F'}
                </Math>
                .
              </>
            ) : (
              <>
                Red outline =
                the same
                numerical value
                also appears in
                the current
                global{' '}
                <Math>
                  {'F'}
                </Math>
                .
              </>
            )}
          </div>
        </div>
      )}

      <div
        style={{
          margin:
            '12px 8px 0',
          padding:
            '11px 12px',
          border:
            `1px solid ${panelBorderColor}`,
          borderRadius:
            '9px',
          background:
            panelBackground,
          color:
            panelTextColor,
          fontSize:
            '15px',
          lineHeight:
            1.4,
        }}
      >
        {!hasSelection ? (
          <>
            {mode ===
            'total'
              ? 'Select a total outdegree.'
              : 'Select at least one internal outdegree.'}
          </>
        ) : activeApplicable ? (
          <>
            <div
              style={{
                fontWeight:
                  600,
                marginBottom:
                  '5px',
              }}
            >
              ✓ Ma–Lu
              applies
            </div>

            {mode ===
            'total' ? (
              <div>
                Ma–Lu can
                eliminate total
                outdegree
                {selectedValues.length >
                1
                  ? 's '
                  : ' '}
                <Math>
                  {
                    selectedSetLatex
                  }
                </Math>{' '}
                from this
                target.
              </div>
            ) : (
              <div>
                Selected set{' '}
                <Math>
                  {
                    `S=${selectedSetLatex}`
                  }
                </Math>{' '}
                satisfies the
                Ma–Lu
                hypotheses for
                every degree
                currently
                possible in{' '}
                <Math>
                  {
                    targetGraph
                  }
                </Math>
                .
              </div>
            )}
          </>
        ) : firstFailure !==
          null ? (
          <>
            <div
              style={{
                fontWeight:
                  600,
                marginBottom:
                  '6px',
              }}
            >
              ✕ Cannot
              certify
            </div>

            {mode ===
            'total' ? (
              <>
                <div>
                  A vertex in{' '}
                  <Math>
                    {
                      targetGraph
                    }
                  </Math>{' '}
                  may have
                  internal degree{' '}
                  <Math>
                    {
                      `${firstFailure.degree}`
                    }
                  </Math>
                  .
                </div>

                <div
                  style={{
                    marginTop:
                      '6px',
                  }}
                >
                  At that
                  degree,
                  eliminating{' '}
                  <Math>
                    {
                      selectedSetLatex
                    }
                  </Math>{' '}
                  requires
                  Ma–Lu to avoid
                  the internal
                  set{' '}
                  <Math>
                    {
                      latexSet(
                        firstFailure
                          .relevantForbiddenSet,
                      )
                    }
                  </Math>
                  .
                </div>

                {firstFailure.degree ===
                0 ? (
                  <div
                    style={{
                      marginTop:
                        '6px',
                    }}
                  >
                    An isolated
                    vertex has
                    only internal
                    outdegree{' '}
                    <Math>
                      {'0'}
                    </Math>
                    , so this
                    cannot be
                    avoided.
                  </div>
                ) : !firstFailure
                    .hasNoConsecutiveValues ? (
                  <div
                    style={{
                      marginTop:
                        '6px',
                    }}
                  >
                    That local
                    set contains
                    consecutive
                    integers, so
                    the Ma–Lu
                    hypothesis
                    fails.
                  </div>
                ) : (
                  <div
                    style={{
                      marginTop:
                        '6px',
                    }}
                  >
                    The Ma–Lu
                    size condition
                    fails:
                    <div
                      style={{
                        marginTop:
                          '5px',
                        textAlign:
                          'center',
                      }}
                    >
                      <Math>
                        {
                          `2|S_${firstFailure.degree}|`
                          + `=${2 * firstFailure.relevantForbiddenSet.length}`
                          + `>${firstFailure.degree - 1}.`
                        }
                      </Math>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                {firstFailure.degree ===
                0 ? (
                  <>
                    A degree-
                    <Math>
                      {'0'}
                    </Math>{' '}
                    vertex may
                    occur, but{' '}
                    <Math>
                      {'0'}
                    </Math>{' '}
                    is selected.
                    An isolated
                    vertex cannot
                    avoid internal
                    outdegree{' '}
                    <Math>
                      {'0'}
                    </Math>
                    .
                  </>
                ) : !firstFailure
                    .hasNoConsecutiveValues ? (
                  <>
                    At degree{' '}
                    <Math>
                      {
                        `${firstFailure.degree}`
                      }
                    </Math>
                    , the relevant
                    forbidden set
                    is{' '}
                    <Math>
                      {
                        latexSet(
                          firstFailure
                            .relevantForbiddenSet,
                        )
                      }
                    </Math>
                    , which
                    contains
                    consecutive
                    integers.
                  </>
                ) : (
                  <>
                    At degree{' '}
                    <Math>
                      {
                        `${firstFailure.degree}`
                      }
                    </Math>
                    , the relevant
                    forbidden set
                    is{' '}
                    <Math>
                      {
                        latexSet(
                          firstFailure
                            .relevantForbiddenSet,
                        )
                      }
                    </Math>
                    .
                    <div
                      style={{
                        marginTop:
                          '6px',
                        textAlign:
                          'center',
                      }}
                    >
                      <Math>
                        {
                          `2|S_${firstFailure.degree}|`
                          + `=${2 * firstFailure.relevantForbiddenSet.length}`
                          + `>${firstFailure.degree - 1}.`
                        }
                      </Math>
                    </div>
                  </>
                )}
              </>
            )}
          </>
        ) : (
          <>
            Ma–Lu cannot
            currently certify
            this selection.
          </>
        )}
      </div>

      {mode ===
        'internal' && (
        <div
          style={{
            margin:
              '10px 8px 0',
            color:
              '#64748b',
            fontSize:
              '14px',
            lineHeight:
              1.35,
            textAlign:
              'center',
          }}
        >
          Known degree
          information:{' '}
          <Math>
            {
              degreeInformationLatex(
                possibleDegrees,
              )
            }
          </Math>
        </div>
      )}

      {hasSelection &&
        mode ===
          'internal' && (
          <div
            style={{
              margin:
                '8px 8px 0',
              textAlign:
                'center',
              color:
                '#475569',
              fontSize:
                '15px',
            }}
          >
            Requested:{' '}
            <Math>
              {
                `d^+_{${targetGraph}}(v)`
                + `\\notin ${selectedSetLatex}`
              }
            </Math>
          </div>
        )}

      <div
        style={{
          display:
            'grid',
          gridTemplateColumns:
            '1fr 1fr',
          gap: '8px',
          margin:
            '14px 8px 0',
        }}
      >
        <button
          type="button"
          onClick={
            clearSelection
          }
          disabled={
            !hasSelection
          }
          style={{
            font: 'inherit',
            padding:
              '9px 10px',
            border:
              '1px solid #cbd5e1',
            borderRadius:
              '7px',
            background:
              '#ffffff',
            color:
              hasSelection
                ? '#475569'
                : '#94a3b8',
            cursor:
              hasSelection
                ? 'pointer'
                : 'default',
          }}
        >
          Clear
        </button>

        <button
          type="button"
          onClick={
            applySelection
          }
          disabled={
            !canApply
          }
          style={{
            font: 'inherit',
            padding:
              '9px 10px',
            border:
              canApply
                ? '1px solid #15803d'
                : '1px solid #cbd5e1',
            borderRadius:
              '7px',
            background:
              canApply
                ? '#f0fdf4'
                : '#f8fafc',
            color:
              canApply
                ? '#166534'
                : '#94a3b8',
            cursor:
              canApply
                ? 'pointer'
                : 'default',
            fontWeight:
              canApply
                ? 600
                : 400,
          }}
        >
          Apply Ma–Lu
        </button>
      </div>

      <button
        type="button"
        onClick={
          onBack
        }
        style={{
          font: 'inherit',
          width: '100%',
          padding:
            '10px 14px',
          marginTop:
            '8px',
          border: 'none',
          borderTop:
            '1px solid #e2e8f0',
          borderRadius: 0,
          background:
            'transparent',
          color:
            '#334155',
          cursor:
            'pointer',
          textAlign:
            'center',
        }}
      >
        ← Back
      </button>
    </>
  )
}