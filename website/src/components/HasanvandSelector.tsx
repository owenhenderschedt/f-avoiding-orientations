import {
  useEffect,
  useState,
} from 'react'
import Math from './Math'
import {
  getHasanvandCertificate,
  getHasanvandRuleForDegree,
  getHasanvandValuesForDegree,
  uniqueSorted,
  type HasanvandDegreeRule,
  type HasanvandMode,
  type HasanvandTarget,
} from '../tools/hasanvandMath'

type HasanvandSelectorProps = {
  target: HasanvandTarget

  maxDegree: number

  possibleDegrees:
    readonly number[]

  onApply: (
    mode: HasanvandMode,
    rules:
      readonly HasanvandDegreeRule[],
  ) => void

  onOpenReference:
    () => void

  onBack:
    () => void
}

function getTargetMath(
  target: HasanvandTarget,
) {
  if (target === 'L') {
    return 'G[L]'
  }

  if (target === 'R') {
    return 'G[R]'
  }

  return 'G'
}

function getMinimumDegree(
  degrees:
    readonly number[],
) {
  if (
    degrees.length === 0
  ) {
    return 0
  }

  return degrees.reduce(
    (minimum, degree) =>
      degree < minimum
        ? degree
        : minimum,
    degrees[0],
  )
}

function getMaximumDegree(
  degrees:
    readonly number[],
) {
  if (
    degrees.length === 0
  ) {
    return 0
  }

  return degrees.reduce(
    (maximum, degree) =>
      degree > maximum
        ? degree
        : maximum,
    degrees[0],
  )
}

/*
 * Find a simple balanced-certified pair
 * to use as the initial suggestion.
 *
 * We choose the smallest q that contains
 * every balanced upper value, and then
 * the smallest nonnegative p satisfying
 * Hasanvand's p-condition.
 *
 * This gives familiar defaults:
 *
 *   degrees 0,...,8  -> (0,4)
 *
 *   degree 12        -> (1,6).
 *
 * If no uniform pair can work across
 * the supplied degree set, this still
 * gives a natural starting pair and the
 * live certificate will explain that it
 * is not applicable.
 */
function getDefaultPair(
  degrees:
    readonly number[],
) {
  if (
    degrees.length === 0
  ) {
    return {
      p: 0,
      q: 1,
    }
  }

  let requiredQ = 1

  for (
    const degree
    of degrees
  ) {
    const balancedHigh =
      globalThis.Math.ceil(
        degree / 2,
      )

    if (
      balancedHigh >
      requiredQ
    ) {
      requiredQ =
        balancedHigh
    }
  }

  const minimumP =
    globalThis.Math.ceil(
      (
        requiredQ - 4
      ) / 2,
    )

  return {
    p:
      minimumP > 0
        ? minimumP
        : 0,

    q:
      requiredQ,
  }
}

function makeUniformRule(
  degrees:
    readonly number[],
): HasanvandDegreeRule {
  const pair =
    getDefaultPair(
      degrees,
    )

  return {
    minDegree:
      getMinimumDegree(
        degrees,
      ),

    maxDegree:
      getMaximumDegree(
        degrees,
      ),

    p: pair.p,

    q: pair.q,
  }
}

function getRulesAreStructurallyValid(
  rules:
    readonly HasanvandDegreeRule[],

  maxDegree: number,
) {
  if (
    rules.length === 0
  ) {
    return false
  }

  return rules.every(
    (rule) =>
      Number.isInteger(
        rule.minDegree,
      ) &&
      Number.isInteger(
        rule.maxDegree,
      ) &&
      Number.isInteger(
        rule.p,
      ) &&
      Number.isInteger(
        rule.q,
      ) &&
      rule.minDegree >= 0 &&
      rule.maxDegree >=
        rule.minDegree &&
      rule.maxDegree <=
        maxDegree,
  )
}

function getFirstUncoveredBlock(
  possibleDegrees:
    readonly number[],

  rules:
    readonly HasanvandDegreeRule[],
) {
  const uncovered =
    uniqueSorted(
      possibleDegrees,
    ).filter(
      (degree) =>
        !rules.some(
          (rule) =>
            degree >=
              rule.minDegree &&
            degree <=
              rule.maxDegree,
        ),
    )

  if (
    uncovered.length === 0
  ) {
    return null
  }

  const block:
    number[] = [
      uncovered[0],
    ]

  for (
    let index = 1;
    index <
    uncovered.length;
    index += 1
  ) {
    if (
      uncovered[index] ===
      block[
        block.length - 1
      ] +
        1
    ) {
      block.push(
        uncovered[index],
      )
    } else {
      break
    }
  }

  return block
}

function getResultingInternalValues(
  possibleDegrees:
    readonly number[],

  rules:
    readonly HasanvandDegreeRule[],
) {
  const values:
    number[] = []

  for (
    const degree
    of possibleDegrees
  ) {
    const rule =
      getHasanvandRuleForDegree(
        rules,
        degree,
      )

    if (
      rule === null
    ) {
      continue
    }

    values.push(
      ...getHasanvandValuesForDegree(
        degree,
        rule.p,
        rule.q,
      ),
    )
  }

  return uniqueSorted(
    values,
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

function CertificationLine({
  valid,
  children,
}: {
  valid: boolean
  children:
    React.ReactNode
}) {
  return (
    <div
      style={{
        display:
          'flex',

        alignItems:
          'flex-start',

        gap:
          '7px',

        marginBottom:
          '6px',

        color:
          valid
            ? '#166534'
            : '#b91c1c',

        fontSize:
          '14px',

        lineHeight:
          1.35,
      }}
    >
      <span
        style={{
          flex:
            '0 0 auto',

          fontWeight:
            700,
        }}
      >
        {valid
          ? '✓'
          : '✗'}
      </span>

      <span>
        {children}
      </span>
    </div>
  )
}

export default function HasanvandSelector({
  target,
  maxDegree,
  possibleDegrees,
  onApply,
  onOpenReference,
  onBack,
}: HasanvandSelectorProps) {
  const degreeSignature =
    possibleDegrees.join(',')

  const initialRule =
    makeUniformRule(
      possibleDegrees,
    )

  const [
    mode,
    setMode,
  ] =
    useState<
      HasanvandMode
    >('uniform')

  const [
    uniformP,
    setUniformP,
  ] =
    useState(
      initialRule.p,
    )

  const [
    uniformQ,
    setUniformQ,
  ] =
    useState(
      initialRule.q,
    )

  const [
    degreeRules,
    setDegreeRules,
  ] =
    useState<
      HasanvandDegreeRule[]
    >([
      initialRule,
    ])

  /*
   * A selector may later be reused for
   * a different target without being
   * unmounted. Reset its local choices
   * whenever the target degree data
   * changes.
   */
  useEffect(
    () => {
      const newRule =
        makeUniformRule(
          possibleDegrees,
        )

      setMode(
        'uniform',
      )

      setUniformP(
        newRule.p,
      )

      setUniformQ(
        newRule.q,
      )

      setDegreeRules([
        newRule,
      ])
    },
    [
      target,
      maxDegree,
      degreeSignature,
    ],
  )

  const minimumDegree =
    getMinimumDegree(
      possibleDegrees,
    )

  const maximumDegree =
    getMaximumDegree(
      possibleDegrees,
    )

  const uniformRule:
    HasanvandDegreeRule = {
    minDegree:
      minimumDegree,

    maxDegree:
      maximumDegree,

    p:
      uniformP,

    q:
      uniformQ,
  }

  const selectedRules =
    mode === 'uniform'
      ? [uniformRule]
      : degreeRules

  const structuralValidity =
    getRulesAreStructurallyValid(
      selectedRules,
      maxDegree,
    )

  const certificate =
    getHasanvandCertificate({
      possibleDegrees,

      rules:
        selectedRules,
    })

  const exactCoverage =
    certificate
      .allDegreesCovered &&
    certificate
      .rulesAreDisjoint

  const canApply =
    structuralValidity &&
    certificate.applicable

  const resultingValues =
    canApply
      ? getResultingInternalValues(
          possibleDegrees,
          selectedRules,
        )
      : []

  const uncoveredBlock =
    mode === 'by-degree'
      ? getFirstUncoveredBlock(
          possibleDegrees,
          degreeRules,
        )
      : null

  const canAddRule =
    uncoveredBlock !==
    null

  const targetMath =
    getTargetMath(
      target,
    )

  function updateRule(
    index: number,

    field:
      keyof HasanvandDegreeRule,

    value: number,
  ) {
    setDegreeRules(
      (current) =>
        current.map(
          (
            rule,
            ruleIndex,
          ) =>
            ruleIndex ===
            index
              ? {
                  ...rule,

                  [field]:
                    value,
                }
              : rule,
        ),
    )
  }

  function removeRule(
    index: number,
  ) {
    setDegreeRules(
      (current) =>
        current.filter(
          (
            _,
            ruleIndex,
          ) =>
            ruleIndex !==
            index,
        ),
    )
  }

  function addRule() {
    const block =
      getFirstUncoveredBlock(
        possibleDegrees,
        degreeRules,
      )

    if (
      block === null
    ) {
      return
    }

    const pair =
      getDefaultPair(
        block,
      )

    setDegreeRules(
      (current) => [
        ...current,

        {
          minDegree:
            block[0],

          maxDegree:
            block[
              block.length -
              1
            ],

          p:
            pair.p,

          q:
            pair.q,
        },
      ],
    )
  }

  function apply() {
    if (
      !canApply
    ) {
      return
    }

    onApply(
      mode,
      selectedRules,
    )
  }

  const menuButtonStyle = {
    font:
      'inherit',

    width:
      '100%',

    padding:
      '9px 12px',

    border:
      'none',

    borderRadius:
      '6px',

    background:
      'transparent',

    color:
      '#334155',

    cursor:
      'pointer',

    textAlign:
      'left' as const,
  }

  const modeButtonStyle = {
    font:
      'inherit',

    flex: 1,

    padding:
      '8px 7px',

    border:
      '1px solid #cbd5e1',

    borderRadius:
      '7px',

    cursor:
      'pointer',
  }

  const numberInputStyle = {
    font:
      'inherit',

    width:
      '54px',

    padding:
      '5px 5px',

    border:
      '1px solid #cbd5e1',

    borderRadius:
      '6px',

    background:
      '#ffffff',

    color:
      '#334155',

    textAlign:
      'center' as const,
  }

  return (
    <>
      {/* HEADER */}

      <div
        style={{
          padding:
            '8px 10px 10px',

          borderBottom:
            '1px solid #e2e8f0',

          marginBottom:
            '8px',

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
          Hasanvand on{' '}
          <Math>
            {targetMath}
          </Math>
        </button>

        <div
          style={{
            marginTop:
              '6px',

            color:
              '#64748b',

            fontSize:
              '14px',

            lineHeight:
              1.3,
          }}
        >
          possible degrees{' '}
          <Math>
            {
              latexSet(
                uniqueSorted(
                  possibleDegrees,
                ),
              )
            }
          </Math>
        </div>
      </div>

      {/* MODE */}

      <div
        style={{
          padding:
            '0 8px',
        }}
      >
        <div
          style={{
            display:
              'flex',

            gap:
              '7px',

            marginBottom:
              '10px',
          }}
        >
          <button
            type="button"
            onClick={() =>
              setMode(
                'uniform',
              )
            }
            style={{
              ...modeButtonStyle,

              background:
                mode ===
                'uniform'
                  ? '#f1f5f9'
                  : '#ffffff',

              color:
                mode ===
                'uniform'
                  ? '#334155'
                  : '#64748b',

              fontWeight:
                mode ===
                'uniform'
                  ? 600
                  : 400,
            }}
          >
            Uniform
          </button>

          {possibleDegrees.length >
            1 && (
            <button
              type="button"
              onClick={() =>
                setMode(
                  'by-degree',
                )
              }
              style={{
                ...modeButtonStyle,

                background:
                  mode ===
                  'by-degree'
                    ? '#f1f5f9'
                    : '#ffffff',

                color:
                  mode ===
                  'by-degree'
                    ? '#334155'
                    : '#64748b',

                fontWeight:
                  mode ===
                  'by-degree'
                    ? 600
                    : 400,
              }}
            >
              By degree
            </button>
          )}
        </div>

        {/* UNIFORM */}

        {mode ===
          'uniform' && (
          <div
            style={{
              padding:
                '10px 10px 11px',

              border:
                '1px solid #e2e8f0',

              borderRadius:
                '8px',

              background:
                '#f8fafc',

              marginBottom:
                '11px',
            }}
          >
            <div
              style={{
                marginBottom:
                  '8px',

                color:
                  '#475569',

                fontSize:
                  '14px',
              }}
            >
              Use one pair for
              every possible
              degree.
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
              <Math>
                {'p='}
              </Math>

              <input
                type="number"
                step="1"
                value={
                  uniformP
                }
                onChange={(
                  event,
                ) =>
                  setUniformP(
                    Number.parseInt(
                      event
                        .target
                        .value,
                      10,
                    ) || 0,
                  )
                }
                style={
                  numberInputStyle
                }
              />

              <Math>
                {'q='}
              </Math>

              <input
                type="number"
                step="1"
                value={
                  uniformQ
                }
                onChange={(
                  event,
                ) =>
                  setUniformQ(
                    Number.parseInt(
                      event
                        .target
                        .value,
                      10,
                    ) || 0,
                  )
                }
                style={
                  numberInputStyle
                }
              />
            </div>
          </div>
        )}

        {/* BY DEGREE */}

        {mode ===
          'by-degree' && (
          <>
            <div
              style={{
                marginBottom:
                  '8px',

                color:
                  '#64748b',

                fontSize:
                  '14px',

                lineHeight:
                  1.35,
              }}
            >
              Assign one{' '}
              <Math>
                {'(p,q)'}
              </Math>{' '}
              pair to each
              degree range.
            </div>

            <div
              style={{
                maxHeight:
                  '255px',

                overflowY:
                  'auto',

                paddingRight:
                  '2px',
              }}
            >
              {degreeRules.map(
                (
                  rule,
                  index,
                ) => (
                  <div
                    key={
                      index
                    }
                    style={{
                      marginBottom:
                        '8px',

                      padding:
                        '9px',

                      border:
                        '1px solid #e2e8f0',

                      borderRadius:
                        '8px',

                      background:
                        '#f8fafc',
                    }}
                  >
                    <div
                      style={{
                        display:
                          'flex',

                        alignItems:
                          'center',

                        justifyContent:
                          'center',

                        gap:
                          '5px',

                        marginBottom:
                          '7px',

                        fontSize:
                          '14px',
                      }}
                    >
                      <span>
                        degrees
                      </span>

                      <input
                        type="number"
                        step="1"
                        min="0"
                        max={
                          maxDegree
                        }
                        value={
                          rule
                            .minDegree
                        }
                        onChange={(
                          event,
                        ) =>
                          updateRule(
                            index,
                            'minDegree',
                            Number.parseInt(
                              event
                                .target
                                .value,
                              10,
                            ) || 0,
                          )
                        }
                        style={{
                          ...numberInputStyle,
                          width:
                            '45px',
                        }}
                      />

                      <span>
                        –
                      </span>

                      <input
                        type="number"
                        step="1"
                        min="0"
                        max={
                          maxDegree
                        }
                        value={
                          rule
                            .maxDegree
                        }
                        onChange={(
                          event,
                        ) =>
                          updateRule(
                            index,
                            'maxDegree',
                            Number.parseInt(
                              event
                                .target
                                .value,
                              10,
                            ) || 0,
                          )
                        }
                        style={{
                          ...numberInputStyle,
                          width:
                            '45px',
                        }}
                      />
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
                          '6px',
                      }}
                    >
                      <Math>
                        {'p='}
                      </Math>

                      <input
                        type="number"
                        step="1"
                        value={
                          rule.p
                        }
                        onChange={(
                          event,
                        ) =>
                          updateRule(
                            index,
                            'p',
                            Number.parseInt(
                              event
                                .target
                                .value,
                              10,
                            ) || 0,
                          )
                        }
                        style={{
                          ...numberInputStyle,
                          width:
                            '45px',
                        }}
                      />

                      <Math>
                        {'q='}
                      </Math>

                      <input
                        type="number"
                        step="1"
                        value={
                          rule.q
                        }
                        onChange={(
                          event,
                        ) =>
                          updateRule(
                            index,
                            'q',
                            Number.parseInt(
                              event
                                .target
                                .value,
                              10,
                            ) || 0,
                          )
                        }
                        style={{
                          ...numberInputStyle,
                          width:
                            '45px',
                        }}
                      />

                      {degreeRules.length >
                        1 && (
                        <button
                          type="button"
                          onClick={() =>
                            removeRule(
                              index,
                            )
                          }
                          aria-label={
                            `Remove degree rule ${index + 1}`
                          }
                          style={{
                            font:
                              'inherit',

                            border:
                              'none',

                            background:
                              'transparent',

                            color:
                              '#94a3b8',

                            cursor:
                              'pointer',

                            padding:
                              '2px 3px',

                            fontSize:
                              '16px',
                          }}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </div>
                ),
              )}
            </div>

            <button
              type="button"
              onClick={
                addRule
              }
              disabled={
                !canAddRule
              }
              style={{
                ...menuButtonStyle,

                marginBottom:
                  '9px',

                textAlign:
                  'center',

                color:
                  canAddRule
                    ? '#475569'
                    : '#94a3b8',

                cursor:
                  canAddRule
                    ? 'pointer'
                    : 'default',
              }}
            >
              + Add degree rule
            </button>

            {!canAddRule && (
              <div
                style={{
                  margin:
                    '-5px 8px 10px',

                  color:
                    '#94a3b8',

                  fontSize:
                    '12px',

                  lineHeight:
                    1.3,

                  textAlign:
                    'center',
                }}
              >
                Shorten an
                existing range
                first to create
                uncovered
                degrees.
              </div>
            )}
          </>
        )}

        {/* LIVE CERTIFICATE */}

        <div
          style={{
            borderTop:
              '1px solid #e2e8f0',

            paddingTop:
              '10px',

            marginTop:
              '3px',

            textAlign:
              'left',
          }}
        >
          <CertificationLine
            valid={
              structuralValidity
            }
          >
            Degree ranges are
            valid integer
            ranges.
          </CertificationLine>

          <CertificationLine
            valid={
              exactCoverage
            }
          >
            Every possible
            degree is covered
            exactly once.
          </CertificationLine>

          <CertificationLine
            valid={
              certificate
                .theoremConditionsHold
            }
          >
            Hasanvand&apos;s
            inequalities hold.
          </CertificationLine>

          <CertificationLine
            valid={
              certificate
                .balancedCertificateHolds
            }
          >
            Balance certifies
            the required
            intervals.
          </CertificationLine>
        </div>

        {canApply && (
          <div
            style={{
              margin:
                '10px 0',

              padding:
                '9px 10px',

              border:
                '1px solid #bbf7d0',

              borderRadius:
                '8px',

              background:
                '#f0fdf4',

              color:
                '#166534',

              textAlign:
                'center',

              fontSize:
                '14px',

              lineHeight:
                1.4,
            }}
          >
            Internal
            outdegrees:{' '}

            <Math>
              {
                latexSet(
                  resultingValues,
                )
              }
            </Math>
          </div>
        )}

        {/* APPLY */}

        <button
          type="button"
          onClick={
            apply
          }
          disabled={
            !canApply
          }
          style={{
            font:
              'inherit',

            width:
              '100%',

            marginTop:
              '3px',

            padding:
              '10px 12px',

            border:
              canApply
                ? '1px solid #64748b'
                : '1px solid #cbd5e1',

            borderRadius:
              '8px',

            background:
              canApply
                ? '#f8fafc'
                : '#f1f5f9',

            color:
              canApply
                ? '#334155'
                : '#94a3b8',

            cursor:
              canApply
                ? 'pointer'
                : 'default',

            fontWeight:
              600,
          }}
        >
          Apply Hasanvand
        </button>
      </div>

      {/* BACK */}

      <button
        type="button"
        onClick={
          onBack
        }
        style={{
          ...menuButtonStyle,

          marginTop:
            '8px',

          borderTop:
            '1px solid #e2e8f0',

          borderRadius: 0,

          textAlign:
            'center',
        }}
      >
        ← Back
      </button>
    </>
  )
}