import {
  useEffect,
  useMemo,
  useState,
} from 'react'
import MathText from './Math'
import {
  analyzeParityBounds,
} from '../tools/parityBoundsMath'

export type ParityBoundsSelection = {
  normalLower:
    number

  normalUpper:
    number

  exceptionalLower:
    number

  exceptionalUpper:
    number
}

type ParityBoundsSelectorProps = {
  workingDegree:
    number

  fixedOutdegreeContribution:
    number

  forbiddenSet:
    readonly number[]

  canApply:
    boolean

  onApply:
    (
      selection:
        ParityBoundsSelection,
    ) => void

  onOpenReference:
    () => void

  onBack:
    () => void
}

function sameParity(
  a:
    number,

  b:
    number,
) {
  return (
    (
      (
        a - b
      ) % 2
    ) ===
    0
  )
}

function getDefaultSelection(
  degree:
    number,
): ParityBoundsSelection {
  const midpoint =
    degree /
    2

  /*
   * In degree 12 this gives [5,11].
   */
  const normalUpper =
    globalThis.Math.max(
      0,

      degree -
      1,
    )

  let normalLower =
    globalThis.Math.floor(
      midpoint,
    )

  while (
    normalLower >
      0 &&
    !sameParity(
      normalLower,

      normalUpper,
    )
  ) {
    normalLower -=
      1
  }

  /*
   * The exceptional parity must agree
   * with d/2 modulo 2.
   *
   * In degree 12 this gives [10,12].
   */
  let exceptionalUpper =
    degree

  while (
    exceptionalUpper >
      0 &&
    !sameParity(
      exceptionalUpper,

      midpoint,
    )
  ) {
    exceptionalUpper -=
      1
  }

  const exceptionalLower =
    globalThis.Math.max(
      0,

      exceptionalUpper -
      2,
    )

  return {
    normalLower,

    normalUpper,

    exceptionalLower,

    exceptionalUpper,
  }
}

function getValuesThrough(
  degree:
    number,
) {
  return Array.from(
    {
      length:
        degree + 1,
    },

    (
      _,
      value,
    ) =>
      value,
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

function SmallSelect({
  value,
  degree,
  onChange,
}: {
  value:
    number

  degree:
    number

  onChange:
    (
      value:
        number,
    ) => void
}) {
  return (
    <select
      value={
        value
      }
      onChange={
        (
          event,
        ) =>
          onChange(
            Number(
              event
                .target
                .value,
            ),
          )
      }
      style={{
        width:
          '64px',

        padding:
          '7px 6px',

        border:
          '1px solid #cbd5e1',

        borderRadius:
          '7px',

        background:
          '#ffffff',

        color:
          '#334155',

        font:
          'inherit',

        fontSize:
          '16px',

        cursor:
          'pointer',
      }}
    >
      {getValuesThrough(
        degree,
      ).map(
        (
          option,
        ) => (
          <option
            key={
              option
            }
            value={
              option
            }
          >
            {option}
          </option>
        ),
      )}
    </select>
  )
}

export default function ParityBoundsSelector({
  workingDegree,
  fixedOutdegreeContribution,
  forbiddenSet,
  canApply,
  onApply,
  onOpenReference,
  onBack,
}: ParityBoundsSelectorProps) {
  const [
    selection,
    setSelection,
  ] =
    useState<
      ParityBoundsSelection
    >(
      getDefaultSelection(
        workingDegree,
      ),
    )

  useEffect(
    () => {
      setSelection(
        getDefaultSelection(
          workingDegree,
        ),
      )
    },

    [
      workingDegree,
    ],
  )

  const analysis =
    useMemo(
      () =>
        analyzeParityBounds({
          degree:
            workingDegree,

          normalInterval: {
            lower:
              selection
                .normalLower,

            upper:
              selection
                .normalUpper,
          },

          exceptionalInterval: {
            lower:
              selection
                .exceptionalLower,

            upper:
              selection
                .exceptionalUpper,
          },
        }),

      [
        workingDegree,
        selection,
      ],
    )

  const totalOutdegrees =
    useMemo(
      () => {
        if (
          analysis
            .certificate ===
          null
        ) {
          return []
        }

        return uniqueSorted(
          analysis
            .certificate
            .possibleOutdegrees
            .map(
              (
                value,
              ) =>
                value +
                fixedOutdegreeContribution,
            ),
        )
      },

      [
        analysis,
        fixedOutdegreeContribution,
      ],
    )

  const forbidden =
    useMemo(
      () =>
        new Set(
          forbiddenSet,
        ),

      [
        forbiddenSet,
      ],
    )

  const alreadyAvoidsForbidden =
    totalOutdegrees.length >
      0 &&
    totalOutdegrees.every(
      (
        value,
      ) =>
        !forbidden.has(
          value,
        ),
    )

  function update(
    patch:
      Partial<
        ParityBoundsSelection
      >,
  ) {
    setSelection(
      (
        current,
      ) => ({
        ...current,

        ...patch,
      }),
    )
  }

  const canSubmit =
    canApply &&
    analysis.applicable

  return (
    <div
      style={{
        width:
          '100%',

        padding:
          '2px 4px 6px',
      }}
    >
      <div
        style={{
          display:
            'flex',

          alignItems:
            'center',

          justifyContent:
            'space-between',

          gap:
            '10px',

          padding:
            '8px 6px 10px',

          borderBottom:
            '1px solid #e2e8f0',

          marginBottom:
            '10px',
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

            padding:
              0,
          }}
        >
          ← Back
        </button>

        <div
          style={{
            color:
              '#334155',

            fontSize:
              '18px',
          }}
        >
          Parity Bounds
        </div>
      </div>

      <div
        style={{
          color:
            '#64748b',

          fontSize:
            '14px',

          lineHeight:
            1.4,

          padding:
            '0 6px',

          marginBottom:
            '12px',
        }}
      >
        Choose parity intervals for
        ordinary vertices and the one
        exceptional vertex in each
        odd-order component.
      </div>

      <div
        style={{
          padding:
            '11px 9px',

          border:
            '1px solid #e2e8f0',

          borderRadius:
            '8px',

          marginBottom:
            '9px',

          background:
            '#f8fafc',
        }}
      >
        <div
          style={{
            color:
              '#475569',

            fontSize:
              '15px',

            marginBottom:
              '9px',
          }}
        >
          Ordinary vertices
        </div>

        <div
          style={{
            display:
              'flex',

            alignItems:
              'center',

            justifyContent:
              'center',

            gap:
              '7px',
          }}
        >
          <SmallSelect
            value={
              selection
                .normalLower
            }
            degree={
              workingDegree
            }
            onChange={
              (
                value,
              ) =>
                update({
                  normalLower:
                    value,
                })
            }
          />

          <MathText>
            {'\\leq d^+(v)\\leq'}
          </MathText>

          <SmallSelect
            value={
              selection
                .normalUpper
            }
            degree={
              workingDegree
            }
            onChange={
              (
                value,
              ) =>
                update({
                  normalUpper:
                    value,
                })
            }
          />
        </div>
      </div>

      <div
        style={{
          padding:
            '11px 9px',

          border:
            '1px solid #e2e8f0',

          borderRadius:
            '8px',

          marginBottom:
            '11px',

          background:
            '#f8fafc',
        }}
      >
        <div
          style={{
            color:
              '#475569',

            fontSize:
              '15px',

            marginBottom:
              '9px',
          }}
        >
          Exceptional vertex
        </div>

        <div
          style={{
            display:
              'flex',

            alignItems:
              'center',

            justifyContent:
              'center',

            gap:
              '7px',
          }}
        >
          <SmallSelect
            value={
              selection
                .exceptionalLower
            }
            degree={
              workingDegree
            }
            onChange={
              (
                value,
              ) =>
                update({
                  exceptionalLower:
                    value,
                })
            }
          />

          <MathText>
            {'\\leq d^+(r)\\leq'}
          </MathText>

          <SmallSelect
            value={
              selection
                .exceptionalUpper
            }
            degree={
              workingDegree
            }
            onChange={
              (
                value,
              ) =>
                update({
                  exceptionalUpper:
                    value,
                })
            }
          />
        </div>
      </div>

      <div
        style={{
          padding:
            '10px 11px',

          border:
            analysis.applicable
              ? '1px solid #bbd7c7'
              : '1px solid #e3b8b8',

          borderRadius:
            '8px',

          background:
            analysis.applicable
              ? '#f7fbf8'
              : '#fffafa',

          marginBottom:
            '11px',
        }}
      >
        <div
          style={{
            color:
              analysis.applicable
                ? '#2f6f4e'
                : '#8b4545',

            fontSize:
              '15px',

            marginBottom:
              analysis.applicable &&
              totalOutdegrees.length >
                0
                ? '6px'
                : 0,
          }}
        >
          {analysis.applicable
            ? 'Certificate passes.'
            : 'Certificate does not pass.'}
        </div>

        {analysis.applicable &&
          totalOutdegrees.length >
            0 && (
            <>
              <div
                style={{
                  color:
                    '#64748b',

                  fontSize:
                    '13px',

                  marginBottom:
                    '3px',
                }}
              >
                Possible total outdegrees
              </div>

              <div
                style={{
                  color:
                    alreadyAvoidsForbidden
                      ? '#2f6f4e'
                      : '#475569',

                  fontSize:
                    '16px',
                }}
              >
                <MathText>
                  {
                    `d^+(v)\\in${latexSet(
                      totalOutdegrees,
                    )}`
                  }
                </MathText>
              </div>

              {alreadyAvoidsForbidden && (
                <div
                  style={{
                    marginTop:
                      '6px',

                    color:
                      '#2f6f4e',

                    fontSize:
                      '13px',
                  }}
                >
                  This choice already avoids
                  the current forbidden set.
                </div>
              )}
            </>
          )}

        {!analysis.applicable &&
          analysis
            .failureReasons
            .length >
            0 && (
            <div
              style={{
                marginTop:
                  '6px',

                color:
                  '#8b5b5b',

                fontSize:
                  '13px',

                lineHeight:
                  1.35,
              }}
            >
              {
                analysis
                  .failureReasons[0]
              }
            </div>
          )}
      </div>

      <div
        style={{
          display:
            'flex',

          gap:
            '8px',
        }}
      >
        <button
          type="button"
          disabled={
            !canSubmit
          }
          onClick={
            () =>
              onApply(
                selection,
              )
          }
          style={{
            flex:
              1,

            padding:
              '9px 10px',

            border:
              canSubmit
                ? '1px solid #475569'
                : '1px solid #cbd5e1',

            borderRadius:
              '8px',

            background:
              canSubmit
                ? '#334155'
                : '#f1f5f9',

            color:
              canSubmit
                ? '#ffffff'
                : '#94a3b8',

            font:
              'inherit',

            fontSize:
              '15px',

            cursor:
              canSubmit
                ? 'pointer'
                : 'default',
          }}
        >
          Apply
        </button>

        <button
          type="button"
          onClick={
            onOpenReference
          }
          style={{
            padding:
              '9px 11px',

            border:
              '1px solid #cbd5e1',

            borderRadius:
              '8px',

            background:
              '#ffffff',

            color:
              '#475569',

            font:
              'inherit',

            fontSize:
              '14px',

            cursor:
              'pointer',
          }}
        >
          Why?
        </button>
      </div>
    </div>
  )
}