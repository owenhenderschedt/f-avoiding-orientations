import {
  useState,
} from 'react'
import Math from './Math'
import {
  hasNoConsecutiveOutdegreeClasses,
  type StabilizeTarget,
} from '../tools/stabilizeOutdegreeClassMath'

export type StabilizeTargetOption = {
  target:
    StabilizeTarget

  possibleOutdegrees:
    readonly number[]
}

type StabilizeOutdegreeClassSelectorProps = {
  targets:
    readonly StabilizeTargetOption[]

  onApply: (
    target:
      StabilizeTarget,

    qs:
      readonly number[],
  ) => void

  onOpenReference: (
    target:
      StabilizeTarget,
  ) => void

  onBack:
    () => void
}

function getTargetLatex(
  target:
    StabilizeTarget,
) {
  if (
    target === 'L'
  ) {
    return 'G[L]'
  }

  if (
    target === 'R'
  ) {
    return 'G[R]'
  }

  return 'G'
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

function latexSet(
  values:
    readonly number[],
) {
  return (
    '\\{' +
    values.join(',') +
    '\\}'
  )
}

export default function StabilizeOutdegreeClassSelector({
  targets,
  onApply,
  onOpenReference,
  onBack,
}: StabilizeOutdegreeClassSelectorProps) {
  const initialTarget =
    targets.length >
    0
      ? targets[0].target
      : null

  const [
    selectedTarget,
    setSelectedTarget,
  ] =
    useState<
      StabilizeTarget | null
    >(
      initialTarget,
    )

  const [
    selectedQs,
    setSelectedQs,
  ] =
    useState<
      number[]
    >([])

  const selectedTargetOption =
    selectedTarget ===
    null
      ? null
      : targets.find(
          (
            option,
          ) =>
            option.target ===
            selectedTarget,
        ) ??
        null

  const possibleOutdegrees =
    selectedTargetOption ===
    null
      ? []
      : uniqueSorted(
          selectedTargetOption
            .possibleOutdegrees,
        )

  const normalizedQ =
    uniqueSorted(
      selectedQs,
    )

  const selectionValid =
    normalizedQ.length >
      0 &&
    hasNoConsecutiveOutdegreeClasses(
      normalizedQ,
    )

  function chooseTarget(
    target:
      StabilizeTarget,
  ) {
    setSelectedTarget(
      target,
    )

    /*
     * Q belongs to a particular target's
     * current outdegree state. Changing
     * target therefore clears the old Q.
     */
    setSelectedQs([])
  }

  function toggleQ(
    q: number,
  ) {
    if (
      selectedQs.includes(
        q,
      )
    ) {
      setSelectedQs(
        (
          current,
        ) =>
          current.filter(
            (value) =>
              value !== q,
          ),
      )

      return
    }

    const candidate =
      uniqueSorted([
        ...selectedQs,
        q,
      ])

    /*
     * The arc-reversal lemma requires Q
     * to contain no two consecutive
     * integers. Invalid additions are
     * rejected immediately.
     */
    if (
      !hasNoConsecutiveOutdegreeClasses(
        candidate,
      )
    ) {
      return
    }

    setSelectedQs(
      candidate,
    )
  }

  function apply() {
    if (
      selectedTarget ===
        null ||
      !selectionValid
    ) {
      return
    }

    onApply(
      selectedTarget,
      normalizedQ,
    )
  }

  return (
    <div
      style={{
        width:
          '300px',

        padding:
          '16px',

        border:
          '1px solid #cbd5e1',

        borderRadius:
          '10px',

        background:
          '#ffffff',

        textAlign:
          'left',
      }}
    >
      {/* HEADER */}

      <div
        style={{
          display:
            'flex',

          alignItems:
            'center',

          justifyContent:
            'space-between',

          gap:
            '12px',

          marginBottom:
            '16px',
        }}
      >
        <button
          type="button"
          onClick={
            onBack
          }
          style={{
            font:
              'inherit',

            border:
              'none',

            background:
              'transparent',

            color:
              '#64748b',

            cursor:
              'pointer',

            padding: 0,
          }}
        >
          ← Back
        </button>

        <button
          type="button"
          onClick={() => {
            if (
              selectedTarget !==
              null
            ) {
              onOpenReference(
                selectedTarget,
              )
            }
          }}
          disabled={
            selectedTarget ===
            null
          }
          style={{
            font:
              'inherit',

            border:
              'none',

            borderBottom:
              selectedTarget ===
              null
                ? 'none'
                : '1px solid #64748b',

            background:
              'transparent',

            color:
              selectedTarget ===
              null
                ? '#94a3b8'
                : '#334155',

            cursor:
              selectedTarget ===
              null
                ? 'default'
                : 'pointer',

            padding:
              '0 0 1px',
          }}
        >
          Stabilize classes{' '}

          <Math>
            {'Q'}
          </Math>
        </button>
      </div>

      {/* TARGET */}

      <div
        style={{
          marginBottom:
            '18px',
        }}
      >
        <div
          style={{
            marginBottom:
              '8px',

            color:
              '#475569',
          }}
        >
          Target
        </div>

        <div
          style={{
            display:
              'flex',

            gap:
              '8px',

            flexWrap:
              'wrap',
          }}
        >
          {targets.map(
            (
              option,
            ) => {
              const selected =
                option.target ===
                selectedTarget

              return (
                <button
                  key={
                    option.target
                  }
                  type="button"
                  onClick={() =>
                    chooseTarget(
                      option.target,
                    )
                  }
                  style={{
                    font:
                      'inherit',

                    minWidth:
                      '64px',

                    padding:
                      '7px 10px',

                    border:
                      selected
                        ? '1px solid #475569'
                        : '1px solid #cbd5e1',

                    borderRadius:
                      '8px',

                    background:
                      selected
                        ? '#f1f5f9'
                        : '#ffffff',

                    color:
                      '#334155',

                    cursor:
                      'pointer',
                  }}
                >
                  <Math>
                    {
                      getTargetLatex(
                        option.target,
                      )
                    }
                  </Math>
                </button>
              )
            },
          )}
        </div>
      </div>

      {/* Q SELECTION */}

      {selectedTargetOption !==
        null && (
        <div
          style={{
            marginBottom:
              '18px',
          }}
        >
          <div
            style={{
              marginBottom:
                '6px',

              color:
                '#475569',
            }}
          >
            Choose outdegree
            classes{' '}

            <Math>
              {'Q'}
            </Math>
          </div>

          <div
            style={{
              marginBottom:
                '10px',

              fontSize:
                '0.88rem',

              color:
                '#64748b',

              lineHeight:
                1.35,
            }}
          >
            Select one or more currently
            possible total outdegrees on{' '}

            <Math>
              {
                getTargetLatex(
                  selectedTargetOption
                    .target,
                )
              }
            </Math>
            . No two selected values may
            be consecutive.
          </div>

          <div
            style={{
              display:
                'flex',

              gap:
                '7px',

              flexWrap:
                'wrap',
            }}
          >
            {possibleOutdegrees.map(
              (
                q,
              ) => {
                const selected =
                  selectedQs.includes(
                    q,
                  )

                const blocked =
                  !selected &&
                  (
                    selectedQs.includes(
                      q - 1,
                    ) ||
                    selectedQs.includes(
                      q + 1,
                    )
                  )

                return (
                  <button
                    key={
                      q
                    }
                    type="button"
                    onClick={() =>
                      toggleQ(
                        q,
                      )
                    }
                    disabled={
                      blocked
                    }
                    title={
                      blocked
                        ? 'Q cannot contain consecutive outdegree classes.'
                        : undefined
                    }
                    style={{
                      font:
                        'inherit',

                      width:
                        '38px',

                      height:
                        '36px',

                      border:
                        selected
                          ? '1px solid #475569'
                          : '1px solid #cbd5e1',

                      borderRadius:
                        '7px',

                      background:
                        selected
                          ? '#f1f5f9'
                          : '#ffffff',

                      color:
                        blocked
                          ? '#cbd5e1'
                          : '#334155',

                      cursor:
                        blocked
                          ? 'default'
                          : 'pointer',

                      display:
                        'flex',

                      alignItems:
                        'center',

                      justifyContent:
                        'center',
                    }}
                  >
                    <Math>
                      {`${q}`}
                    </Math>
                  </button>
                )
              },
            )}
          </div>
        </div>
      )}

      {/* CONSEQUENCE PREVIEW */}

      {selectedTarget !==
        null &&
        selectionValid && (
          <div
            style={{
              marginBottom:
                '16px',

              padding:
                '10px 11px',

              border:
                '1px solid #e2e8f0',

              borderRadius:
                '8px',

              background:
                '#f8fafc',

              fontSize:
                '0.88rem',

              lineHeight:
                1.4,

              color:
                '#475569',
            }}
          >
            After stabilization,

            <div
              style={{
                textAlign:
                  'center',

                margin:
                  '8px 0',
              }}
            >
              <Math>
                {
                  'Q='
                  + latexSet(
                    normalizedQ,
                  )
                  + ',\\qquad '
                  + 'P_Q='
                  + '\\{'
                  + 'v\\in '
                  + getTargetLatex(
                    selectedTarget,
                  )
                  + ':'
                  + 'd^+(v)\\in Q'
                  + '\\}'
                }
              </Math>
            </div>

            is independent.
          </div>
        )}

      {/* APPLY */}

      <button
        type="button"
        onClick={
          apply
        }
        disabled={
          selectedTarget ===
            null ||
          !selectionValid
        }
        style={{
          width:
            '100%',

          font:
            'inherit',

          padding:
            '9px 12px',

          border:
            '1px solid #64748b',

          borderRadius:
            '8px',

          background:
            selectedTarget !==
              null &&
            selectionValid
              ? '#f8fafc'
              : '#f1f5f9',

          color:
            selectedTarget !==
              null &&
            selectionValid
              ? '#334155'
              : '#94a3b8',

          cursor:
            selectedTarget !==
              null &&
            selectionValid
              ? 'pointer'
              : 'default',
        }}
      >
        Apply stabilization
      </button>
    </div>
  )
}
