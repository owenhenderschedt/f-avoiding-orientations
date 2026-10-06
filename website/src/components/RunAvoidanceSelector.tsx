import {
  useEffect,
  useState,
} from 'react'
import Math from './Math'
import {
  getRunAvoidanceRValues,
  type RunAvoidanceSide,
  type RunAvoidanceTarget,
} from '../tools/runAvoidanceMath'
import {
  getRunAvoidanceTotalCertificate,
} from '../tools/runAvoidanceTargeting'
import type {
  LovaszPair,
} from '../tools/lovaszPartition'
import type {
  AcrossDirection,
} from '../tools/orientAcrossPartition'

type RunAvoidanceSelectorProps = {
  target:
    RunAvoidanceTarget

  maxInternalDegree: number

  globalForbiddenSet:
    readonly number[]

  /*
   * FINAL total outdegrees that are
   * currently possible for this target.
   *
   * Every one is selectable. Values
   * lying in the current global F are
   * highlighted red.
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
      r: number,

      side:
        RunAvoidanceSide,

      selectedTotalOutdegrees:
        readonly number[],
    ) => void

  onOpenReference:
    () => void

  onBack:
    () => void
}

function latexSet(
  values:
    readonly number[],
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
  target:
    RunAvoidanceTarget,
) {
  if (
    target === 'G'
  ) {
    return 'G'
  }

  return `G[${target}]`
}

export default function RunAvoidanceSelector({
  target,
  maxInternalDegree,
  globalForbiddenSet,
  totalCandidateOutdegrees,
  workingDegree,
  fixedOutdegreeContribution,
  partition,
  acrossDirection,
  onApply,
  onOpenReference,
  onBack,
}: RunAvoidanceSelectorProps) {
  const rValues =
    getRunAvoidanceRValues(
      maxInternalDegree,
    )

  const [
    r,
    setR,
  ] =
    useState<number>(
      rValues[0] ?? 1,
    )

  const [
    side,
    setSide,
  ] =
    useState<
      RunAvoidanceSide
    >('low')

  const [
    selectedValues,
    setSelectedValues,
  ] =
    useState<number[]>([])

  /*
   * If the target changes to a graph
   * with a smaller degree range, keep r
   * on an actually available value.
   */
  useEffect(() => {
    if (
      rValues.length ===
      0
    ) {
      setR(1)
      setSelectedValues([])
      return
    }

    if (
      !rValues.includes(
        r,
      )
    ) {
      setR(
        rValues[0],
      )

      setSelectedValues([])
    }
  }, [
    maxInternalDegree,
    r,
    rValues,
  ])

  const certificate =
    getRunAvoidanceTotalCertificate({
      target,

      workingDegree,

      fixedOutdegreeContribution,

      partition,

      acrossDirection,

      r,

      side,

      selectedTotalOutdegrees:
        selectedValues,
    })

  const hasSelection =
    selectedValues.length >
      0

  const canApply =
    hasSelection &&
    certificate.ready &&
    certificate.applicable

  const firstFailure =
    certificate
      .firstFailingCheck

  const targetGraph =
    targetGraphLatex(
      target,
    )

  const selectedSetLatex =
    latexSet(
      selectedValues,
    )

  function chooseR(
    value: number,
  ) {
    setR(
      value,
    )

    /*
     * A different r changes both the
     * legal interval and the maximum
     * permitted run length. Clearing is
     * less surprising than silently
     * carrying an old invalid choice.
     */
    setSelectedValues([])
  }

  function chooseSide(
    value:
      RunAvoidanceSide,
  ) {
    setSide(
      value,
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
      r,
      side,
      selectedValues,
    )
  }

  const panelBorderColor =
    !hasSelection
      ? '#e2e8f0'
      : canApply
        ? '#bbf7d0'
        : '#fecaca'

  const panelBackground =
    !hasSelection
      ? '#f8fafc'
      : canApply
        ? '#f0fdf4'
        : '#fef2f2'

  const panelTextColor =
    !hasSelection
      ? '#64748b'
      : canApply
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
            font:
              'inherit',
            color:
              '#334155',
            fontWeight:
              600,
            background:
              'transparent',
            border:
              'none',
            borderBottom:
              '1px solid #64748b',
            padding:
              '0 1px 2px',
            cursor:
              'pointer',
          }}
        >
          Run Avoidance on{' '}
          <Math>
            {targetGraph}
          </Math>
        </button>
      </div>

      <div
        style={{
          padding:
            '0 10px 6px',
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
        Choose{' '}
        <Math>
          {'r'}
        </Math>{' '}
        and a side of the
        outdegree range.
      </div>

      {rValues.length ===
      0 ? (
        <div
          style={{
            margin:
              '4px 8px 10px',
            padding:
              '10px',
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
          This target has
          no degree large
          enough for a
          nonempty Run
          Avoidance range.
        </div>
      ) : (
        <>
          <div
            style={{
              display:
                'flex',
              flexWrap:
                'wrap',
              justifyContent:
                'center',
              gap: '6px',
              margin:
                '2px 8px 9px',
            }}
          >
            {rValues.map(
              (value) => (
                <button
                  key={
                    value
                  }
                  type="button"
                  onClick={() =>
                    chooseR(
                      value,
                    )
                  }
                  aria-pressed={
                    r ===
                    value
                  }
                  style={{
                    font:
                      'inherit',
                    minWidth:
                      '38px',
                    height:
                      '34px',
                    padding:
                      '3px 8px',
                    border:
                      r ===
                      value
                        ? '1px solid #475569'
                        : '1px solid #cbd5e1',
                    borderRadius:
                      '8px',
                    background:
                      r ===
                      value
                        ? '#e2e8f0'
                        : '#ffffff',
                    color:
                      '#334155',
                    cursor:
                      'pointer',
                  }}
                >
                  <Math>
                    {`r=${value}`}
                  </Math>
                </button>
              ),
            )}
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
              padding:
                '3px',
              border:
                '1px solid #e2e8f0',
              borderRadius:
                '9px',
              background:
                '#f8fafc',
            }}
          >
            {(
              [
                [
                  'low',
                  'Low',
                ],
                [
                  'high',
                  'High',
                ],
              ] as const
            ).map(
              ([
                value,
                label,
              ]) => (
                <button
                  key={
                    value
                  }
                  type="button"
                  onClick={() =>
                    chooseSide(
                      value,
                    )
                  }
                  style={{
                    font:
                      'inherit',
                    padding:
                      '7px 5px',
                    border:
                      side ===
                      value
                        ? '1px solid #cbd5e1'
                        : '1px solid transparent',
                    borderRadius:
                      '7px',
                    background:
                      side ===
                      value
                        ? '#ffffff'
                        : 'transparent',
                    color:
                      '#334155',
                    cursor:
                      'pointer',
                    fontSize:
                      '14px',
                    boxShadow:
                      side ===
                      value
                        ? '0 1px 3px rgba(0, 0, 0, 0.06)'
                        : 'none',
                  }}
                >
                  {label}
                </button>
              ),
            )}
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
            Choose total
            outdegrees to
            eliminate. Safe
            classes may also
            be selected.
          </div>

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
              {totalCandidateOutdegrees.map(
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
              Red outline =
              this total
              outdegree is in
              the current{' '}
              <Math>
                {'F'}
              </Math>
              .
            </div>
          </div>

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
                Select at
                least one total
                outdegree.
              </>
            ) : canApply ? (
              <>
                <div
                  style={{
                    fontWeight:
                      600,
                    marginBottom:
                      '5px',
                  }}
                >
                  ✓ Run
                  Avoidance
                  applies
                </div>

                <div>
                  With{' '}
                  <Math>
                    {
                      `r=${r}`
                    }
                  </Math>
                  , the{' '}
                  {side}{' '}
                  theorem can
                  eliminate total
                  outdegrees{' '}
                  <Math>
                    {
                      selectedSetLatex
                    }
                  </Math>{' '}
                  from{' '}
                  <Math>
                    {
                      targetGraph
                    }
                  </Math>
                  .
                </div>
              </>
            ) : !certificate.ready ? (
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
                  translate yet
                </div>

                <div>
                  Orient the
                  crossing edges
                  first so total
                  outdegrees can
                  be translated
                  into internal
                  Run Avoidance
                  constraints.
                </div>
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
                  degree, the
                  selected totals
                  translate to
                  the local set{' '}
                  <Math>
                    {
                      latexSet(
                        firstFailure
                          .localForbiddenSet,
                      )
                    }
                  </Math>
                  .
                </div>

                {!firstFailure
                    .rangeConditionHolds ? (
                  <div
                    style={{
                      marginTop:
                        '6px',
                    }}
                  >
                    That local
                    set is not
                    contained in
                    the permitted{' '}
                    {side}{' '}
                    interval{' '}
                    <Math>
                      {
                        firstFailure
                          .allowedInterval ===
                        null
                          ? '\\varnothing'
                          : (
                              `\\{${firstFailure.allowedInterval.lower},`
                              + `\\ldots,${firstFailure.allowedInterval.upper}\\}`
                            )
                      }
                    </Math>
                    .
                  </div>
                ) : !firstFailure
                    .runConditionHolds ? (
                  <div
                    style={{
                      marginTop:
                        '6px',
                    }}
                  >
                    Its longest
                    consecutive
                    run has length{' '}
                    <Math>
                      {
                        `${firstFailure.longestConsecutiveRun}`
                      }
                    </Math>
                    , but Run
                    Avoidance
                    permits at
                    most{' '}
                    <Math>
                      {`${r}`}
                    </Math>
                    .
                  </div>
                ) : null}
              </>
            ) : (
              <>Cannot certify.</>
            )}
          </div>

          <div
            style={{
              display:
                'flex',
              gap: '8px',
              margin:
                '10px 8px 0',
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
                font:
                  'inherit',
                flex: 1,
                padding:
                  '8px 10px',
                border:
                  '1px solid #cbd5e1',
                borderRadius:
                  '8px',
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
                font:
                  'inherit',
                flex: 1,
                padding:
                  '8px 10px',
                border:
                  canApply
                    ? '1px solid #475569'
                    : '1px solid #cbd5e1',
                borderRadius:
                  '8px',
                background:
                  canApply
                    ? '#334155'
                    : '#f8fafc',
                color:
                  canApply
                    ? '#ffffff'
                    : '#94a3b8',
                cursor:
                  canApply
                    ? 'pointer'
                    : 'default',
              }}
            >
              Apply
            </button>
          </div>
        </>
      )}

      <button
        type="button"
        onClick={
          onBack
        }
        style={{
          font:
            'inherit',
          width:
            'calc(100% - 16px)',
          margin:
            '10px 8px 2px',
          padding:
            '8px 10px',
          border:
            'none',
          borderTop:
            '1px solid #e2e8f0',
          background:
            'transparent',
          color:
            '#64748b',
          cursor:
            'pointer',
        }}
      >
        ← Back
      </button>
    </>
  )
}
