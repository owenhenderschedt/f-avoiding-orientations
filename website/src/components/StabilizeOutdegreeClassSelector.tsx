import {
  useState,
} from 'react'
import Math from './Math'
import type {
  StabilizeTarget,
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

    q: number,
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
    selectedQ,
    setSelectedQ,
  ] =
    useState<
      number | null
    >(
      null,
    )

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

  function chooseTarget(
    target:
      StabilizeTarget,
  ) {
    setSelectedTarget(
      target,
    )

    /*
     * q belongs to a particular
     * target's current outdegree state.
     * Changing target therefore clears
     * the previous choice.
     */
    setSelectedQ(
      null,
    )
  }

  function apply() {
    if (
      selectedTarget ===
        null ||
      selectedQ ===
        null
    ) {
      return
    }

    onApply(
      selectedTarget,
      selectedQ,
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
          Stabilize{' '}

          <Math>
            {'q'}
          </Math>
          -class
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

      {/* q SELECTION */}

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
            Choose the outdegree
            class{' '}

            <Math>
              {'q'}
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
            These are the currently
            possible total outdegrees
            on{' '}

            <Math>
              {
                getTargetLatex(
                  selectedTargetOption
                    .target,
                )
              }
            </Math>
            .
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
                  q ===
                  selectedQ

                return (
                  <button
                    key={
                      q
                    }
                    type="button"
                    onClick={() =>
                      setSelectedQ(
                        q,
                      )
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
                        '#334155',

                      cursor:
                        'pointer',

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
        selectedQ !==
          null && (
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
                  `P_{${selectedQ}}`
                  + '='
                  + '\\{'
                  + 'v\\in '
                  + getTargetLatex(
                    selectedTarget,
                  )
                  + ':'
                  + `d^+(v)=${selectedQ}`
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
          selectedQ ===
            null
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
            selectedQ !==
              null
              ? '#f8fafc'
              : '#f1f5f9',

          color:
            selectedTarget !==
              null &&
            selectedQ !==
              null
              ? '#334155'
              : '#94a3b8',

          cursor:
            selectedTarget !==
              null &&
            selectedQ !==
              null
              ? 'pointer'
              : 'default',
        }}
      >
        Apply stabilization
      </button>
    </div>
  )
}