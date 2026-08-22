import {
  useMemo,
  useState,
} from 'react'
import Math from './Math'
import {
  getDirectedMengerRepairCertificate,
  type MengerCapacityRule,
  type MengerDemandRule,
} from '../tools/directedMengerMath'

type DirectedMengerWorkspaceProps = {
  degree: number

  forbiddenSet:
    readonly number[]

  /*
   * Total outdegree classes currently
   * possible in the starting
   * orientation.
   */
  possibleOutdegrees:
    readonly number[]

  /*
   * Optional until the right-panel
   * reference is wired.
   */
  onOpenReference?: () => void

  onApply: (
    demandRules:
      readonly MengerDemandRule[],

    capacityRules:
      readonly MengerCapacityRule[],
  ) => void

  onBack: () => void
}

function latexSet(
  values: readonly number[],
) {
  if (values.length === 0) {
    return '\\varnothing'
  }

  return (
    '\\{' +
    values.join(',') +
    '\\}'
  )
}

function formatBound(
  value: number,
) {
  if (
    !Number.isFinite(
      value,
    )
  ) {
    return '—'
  }

  for (
    let denominator = 1;
    denominator <= 40;
    denominator += 1
  ) {
    const numerator =
      globalThis.Math.round(
        value *
          denominator,
      )

    if (
      globalThis.Math.abs(
        value -
          numerator /
            denominator,
      ) <
      1e-9
    ) {
      if (
        denominator === 1
      ) {
        return `${numerator}`
      }

      return (
        `\\frac{${numerator}}`
        + `{${denominator}}`
      )
    }
  }

  return value.toFixed(3)
}

function getMaximumSafeCapacity(
  outdegree: number,

  forbiddenSet:
    readonly number[],
) {
  if (
    forbiddenSet.includes(
      outdegree,
    )
  ) {
    return 0
  }

  let capacity = 0

  let nextOutdegree =
    outdegree - 1

  while (
    nextOutdegree >= 0 &&
    !forbiddenSet.includes(
      nextOutdegree,
    )
  ) {
    capacity += 1
    nextOutdegree -= 1
  }

  return capacity
}

function getSafeTargets(
  outdegree: number,
  degree: number,
  forbiddenSet:
    readonly number[],
) {
  const values:
    number[] = []

  for (
    let target =
      outdegree + 1;
    target <= degree;
    target += 1
  ) {
    if (
      !forbiddenSet.includes(
        target,
      )
    ) {
      values.push(
        target,
      )
    }
  }

  return values
}

function Chip({
  value,
  selected,
  forbidden,
  onClick,
}: {
  value: number

  selected: boolean

  forbidden: boolean

  onClick: () => void
}) {
  let border =
    '1px solid #cbd5e1'

  let background =
    '#ffffff'

  let color =
    '#334155'

  if (forbidden) {
    border =
      '1px solid #fca5a5'

    color =
      '#b91c1c'
  }

  if (selected) {
    border =
      forbidden
        ? '1px solid #b91c1c'
        : '1px solid #475569'

    background =
      forbidden
        ? '#fee2e2'
        : '#e2e8f0'

    color =
      forbidden
        ? '#991b1b'
        : '#1e293b'
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={
        selected
      }
      style={{
        font: 'inherit',
        minWidth: '42px',
        height: '38px',
        padding: '4px 10px',
        border,
        borderRadius: '8px',
        background,
        color,
        cursor: 'pointer',
      }}
    >
      <Math>
        {`${value}`}
      </Math>
    </button>
  )
}

export default function DirectedMengerWorkspace({
  degree,
  forbiddenSet,
  possibleOutdegrees,
  onOpenReference,
  onApply,
  onBack,
}: DirectedMengerWorkspaceProps) {
  const [
    receiverTargets,
    setReceiverTargets,
  ] =
    useState<
      Record<
        number,
        number
      >
    >({})

  const [
    capacities,
    setCapacities,
  ] =
    useState<
      Record<
        number,
        number
      >
    >({})

  const sortedPossibilities =
    useMemo(
      () =>
        Array.from(
          new Set(
            possibleOutdegrees,
          ),
        ).sort(
          (a, b) =>
            a - b,
        ),
      [
        possibleOutdegrees,
      ],
    )

  const badClasses =
    sortedPossibilities.filter(
      (value) =>
        forbiddenSet.includes(
          value,
        ),
    )

  /*
   * V1 uses the regular-graph local
   * certificate in the upward-repair
   * direction.
   *
   * Therefore bad receiver classes
   * must lie below d/2.
   */
  const repairableBadClasses =
    badClasses.filter(
      (value) =>
        2 * value <
        degree,
    )

  const unsupportedBadClasses =
    badClasses.filter(
      (value) =>
        2 * value >=
        degree,
    )

  const demandRules:
    MengerDemandRule[] =
    repairableBadClasses
      .filter(
        (outdegree) =>
          receiverTargets[
            outdegree
          ] !== undefined,
      )
      .map(
        (outdegree) => ({
          outdegree,

          demand:
            receiverTargets[
              outdegree
            ] -
            outdegree,
        }),
      )

  /*
   * Only high classes can impose an
   * upper bound on alpha, so these are
   * the capacities that are useful to
   * expose interactively in V1.
   *
   * All omitted safe classes have
   * capacity zero automatically.
   */
  const donorClasses =
    sortedPossibilities.filter(
      (value) =>
        2 * value >
        degree,
    )

  const capacityRules:
    MengerCapacityRule[] =
    donorClasses.map(
      (outdegree) => ({
        outdegree,

        capacity:
          capacities[
            outdegree
          ] ??
          0,
      }),
    )

  const certificate =
    getDirectedMengerRepairCertificate({
      degree,

      forbiddenSet,

      currentOutdegrees:
        sortedPossibilities,

      demandRules,

      capacityRules,
    })

  const allRepairTargetsChosen =
    repairableBadClasses.length >
      0 &&
    repairableBadClasses.every(
      (outdegree) =>
        receiverTargets[
          outdegree
        ] !== undefined,
    )

  const coverageReady =
    allRepairTargetsChosen &&
    unsupportedBadClasses.length ===
      0 &&
    certificate
      .coversAllBadClasses &&
    certificate.rolesValid

  const endpointSafe =
    coverageReady &&
    certificate.endpointSafe

  const alphaCertified =
    coverageReady &&
    certificate
      .alphaCertificate
      .applicable

  const canApply =
    certificate.applicable

  const lowerBound =
    certificate
      .alphaCertificate
      .lowerBound

  const upperBound =
    certificate
      .alphaCertificate
      .upperBound

  function chooseTarget(
    outdegree: number,
    target: number,
  ) {
    setReceiverTargets(
      (current) => ({
        ...current,

        [outdegree]:
          target,
      }),
    )
  }

  function setCapacity(
    outdegree: number,
    capacity: number,
  ) {
    setCapacities(
      (current) => ({
        ...current,

        [outdegree]:
          capacity,
      }),
    )
  }

  function useMaximumCapacities() {
    const next:
      Record<
        number,
        number
      > = {}

    donorClasses.forEach(
      (outdegree) => {
        next[outdegree] =
          getMaximumSafeCapacity(
            outdegree,
            forbiddenSet,
          )
      },
    )

    setCapacities(
      next,
    )
  }

  function clearCapacities() {
    setCapacities({})
  }

  function renderAlphaInterval() {
    if (
      !Number.isFinite(
        lowerBound,
      ) ||
      !Number.isFinite(
        upperBound,
      )
    ) {
      return (
        <>
          No feasible{' '}
          <Math>
            {'\\alpha'}
          </Math>{' '}
          interval.
        </>
      )
    }

    return (
      <Math>
        {
          `${formatBound(
            lowerBound,
          )}`
          + '\\leq\\alpha\\leq'
          + `${formatBound(
            upperBound,
          )}`
        }
      </Math>
    )
  }

  const headerStyle = {
    font: 'inherit',
    fontSize:
      '21px',
    fontWeight:
      600,
    color:
      '#334155',
  }

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '640px',
        margin:
          '18px auto 0',
        border:
          '1px solid #cbd5e1',
        borderRadius:
          '14px',
        background:
          '#ffffff',
        boxShadow:
          '0 10px 30px rgba(0, 0, 0, 0.07)',
        overflow:
          'hidden',
        textAlign:
          'left',
      }}
    >
      {/* HEADER */}
      <div
        style={{
          padding:
            '18px 22px 16px',
          borderBottom:
            '1px solid #e2e8f0',
          textAlign:
            'center',
        }}
      >
        {onOpenReference !==
        undefined ? (
          <button
            type="button"
            onClick={
              onOpenReference
            }
            style={{
              ...headerStyle,

              background:
                'transparent',

              border:
                'none',

              borderBottom:
                '1px solid #64748b',

              padding:
                '0 2px 2px',

              cursor:
                'pointer',
            }}
          >
            Directed Menger
            repair
          </button>
        ) : (
          <div
            style={
              headerStyle
            }
          >
            Directed Menger
            repair
          </div>
        )}

        <div
          style={{
            marginTop:
              '7px',
            color:
              '#64748b',
            fontSize:
              '15px',
          }}
        >
          Transfer outdegree
          along directed paths.
        </div>
      </div>

      {/* CURRENT ORIENTATION */}
      <div
        style={{
          padding:
            '16px 22px',
          borderBottom:
            '1px solid #e2e8f0',
          background:
            '#ffffff',
          textAlign:
            'center',
        }}
      >
        <div
          style={{
            color:
              '#64748b',
            fontSize:
              '14px',
            marginBottom:
              '9px',
          }}
        >
          Current possible
          total outdegrees
        </div>

        <div
          style={{
            display:
              'flex',
            flexWrap:
              'wrap',
            justifyContent:
              'center',
            gap:
              '7px',
          }}
        >
          {sortedPossibilities.map(
            (value) => (
              <div
                key={
                  value
                }
                style={{
                  minWidth:
                    '38px',
                  padding:
                    '6px 9px',

                  border:
                    forbiddenSet.includes(
                      value,
                    )
                      ? '1px solid #fca5a5'
                      : '1px solid #e2e8f0',

                  borderRadius:
                    '8px',

                  color:
                    forbiddenSet.includes(
                      value,
                    )
                      ? '#b91c1c'
                      : '#475569',

                  background:
                    forbiddenSet.includes(
                      value,
                    )
                      ? '#fff7f7'
                      : '#f8fafc',
                }}
              >
                <Math>
                  {`${value}`}
                </Math>
              </div>
            ),
          )}
        </div>
      </div>

      {/* PATH REVERSAL */}
      <div
        style={{
          padding:
            '18px 22px',
          borderBottom:
            '1px solid #e2e8f0',
          background:
            '#f8fafc',
          textAlign:
            'center',
        }}
      >
        <div
          style={{
            fontSize:
              '15px',
            color:
              '#64748b',
            marginBottom:
              '9px',
          }}
        >
          Reverse a directed
          repair path
        </div>

        <div
          style={{
            fontSize:
              '20px',
            color:
              '#334155',
          }}
        >
          <Math>
            {
              'x\\longrightarrow\\cdots\\longrightarrow y'
            }
          </Math>
        </div>

        <div
          style={{
            display:
              'flex',
            justifyContent:
              'center',
            gap: '58px',
            marginTop:
              '10px',
            color:
              '#475569',
          }}
        >
          <Math>
            {
              'd^+(x)-1'
            }
          </Math>

          <Math>
            {
              'd^+(y)+1'
            }
          </Math>
        </div>

        <div
          style={{
            marginTop:
              '8px',
            color:
              '#64748b',
            fontSize:
              '14px',
          }}
        >
          Internal vertices
          are unchanged.
        </div>
      </div>

      {/* STAGE 1 */}
      <section
        style={{
          padding:
            '20px 22px',
          borderBottom:
            '1px solid #e2e8f0',
        }}
      >
        <div
          style={{
            display:
              'flex',
            alignItems:
              'center',
            gap: '10px',
            marginBottom:
              '13px',
          }}
        >
          <div
            style={{
              width:
                '25px',
              height:
                '25px',
              border:
                '1px solid #94a3b8',
              borderRadius:
                '50%',
              display:
                'flex',
              alignItems:
                'center',
              justifyContent:
                'center',
              color:
                '#475569',
              fontSize:
                '14px',
              flexShrink: 0,
            }}
          >
            1
          </div>

          <strong>
            Repair demands
          </strong>
        </div>

        {badClasses.length ===
        0 ? (
          <div
            style={{
              color:
                '#64748b',
              fontSize:
                '15px',
            }}
          >
            The current
            orientation already
            avoids every value
            in{' '}
            <Math>{'F'}</Math>.
          </div>
        ) : (
          <>
            <div
              style={{
                color:
                  '#64748b',
                fontSize:
                  '15px',
                marginBottom:
                  '14px',
              }}
            >
              Choose the safe
              outdegree to which
              each bad class
              should be raised.
            </div>

            <div
              style={{
                display:
                  'grid',
                gap:
                  '12px',
              }}
            >
              {repairableBadClasses.map(
                (outdegree) => {
                  const targets =
                    getSafeTargets(
                      outdegree,
                      degree,
                      forbiddenSet,
                    )

                  const selected =
                    receiverTargets[
                      outdegree
                    ]

                  return (
                    <div
                      key={
                        outdegree
                      }
                      style={{
                        padding:
                          '12px 14px',
                        border:
                          '1px solid #e2e8f0',
                        borderRadius:
                          '10px',
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
                          gap:
                            '10px',
                          marginBottom:
                            '10px',
                        }}
                      >
                        <div
                          style={{
                            color:
                              '#b91c1c',
                          }}
                        >
                          <Math>
                            {
                              `d^+=${outdegree}`
                            }
                          </Math>
                        </div>

                        <div
                          style={{
                            color:
                              '#64748b',
                            fontSize:
                              '14px',
                          }}
                        >
                          move to
                        </div>
                      </div>

                      <div
                        style={{
                          display:
                            'flex',
                          flexWrap:
                            'wrap',
                          gap:
                            '7px',
                        }}
                      >
                        {targets.map(
                          (target) => (
                            <Chip
                              key={
                                target
                              }
                              value={
                                target
                              }
                              selected={
                                selected ===
                                target
                              }
                              forbidden={
                                false
                              }
                              onClick={() =>
                                chooseTarget(
                                  outdegree,
                                  target,
                                )
                              }
                            />
                          ),
                        )}
                      </div>

                      {selected !==
                        undefined && (
                        <div
                          style={{
                            marginTop:
                              '10px',
                            color:
                              '#475569',
                            fontSize:
                              '15px',
                          }}
                        >
                          <Math>
                            {
                              `${outdegree}`
                              + `\\xrightarrow{\\ +${selected - outdegree}\\ }`
                              + `${selected}`
                            }
                          </Math>
                          {'  '}
                          demand{' '}
                          <Math>
                            {
                              `r=${selected - outdegree}`
                            }
                          </Math>
                        </div>
                      )}
                    </div>
                  )
                },
              )}
            </div>

            {unsupportedBadClasses.length >
              0 && (
              <div
                style={{
                  marginTop:
                    '13px',
                  padding:
                    '11px 13px',
                  border:
                    '1px solid #fecaca',
                  borderRadius:
                    '9px',
                  background:
                    '#fef2f2',
                  color:
                    '#991b1b',
                  fontSize:
                    '15px',
                  lineHeight:
                    1.4,
                }}
              >
                This V1 upward
                repair certificate
                cannot handle the
                currently bad
                class
                {unsupportedBadClasses.length >
                1
                  ? 'es '
                  : ' '}

                <Math>
                  {
                    latexSet(
                      unsupportedBadClasses,
                    )
                  }
                </Math>

                {' '}because
                {unsupportedBadClasses.length >
                1
                  ? ' they do'
                  : ' it does'}{' '}
                not lie below{' '}
                <Math>
                  {'d/2'}
                </Math>
                .
              </div>
            )}
          </>
        )}
      </section>

      {/* STAGE 2 */}
      <section
        style={{
          padding:
            '20px 22px',
          borderBottom:
            '1px solid #e2e8f0',
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
            gap: '12px',
            marginBottom:
              '14px',
          }}
        >
          <div
            style={{
              display:
                'flex',
              alignItems:
                'center',
              gap:
                '10px',
            }}
          >
            <div
              style={{
                width:
                  '25px',
                height:
                  '25px',
                border:
                  '1px solid #94a3b8',
                borderRadius:
                  '50%',
                display:
                  'flex',
                alignItems:
                  'center',
                justifyContent:
                  'center',
                color:
                  '#475569',
                fontSize:
                  '14px',
                flexShrink: 0,
              }}
            >
              2
            </div>

            <strong>
              Donor capacities
            </strong>
          </div>

          {donorClasses.length >
            0 && (
            <button
              type="button"
              onClick={
                useMaximumCapacities
              }
              style={{
                font:
                  'inherit',
                border:
                  'none',
                borderBottom:
                  '1px solid #94a3b8',
                background:
                  'transparent',
                color:
                  '#64748b',
                padding:
                  '0 1px 2px',
                cursor:
                  'pointer',
                fontSize:
                  '14px',
              }}
            >
              use maximum
            </button>
          )}
        </div>

        <div
          style={{
            color:
              '#64748b',
            fontSize:
              '15px',
            marginBottom:
              '15px',
          }}
        >
          Choose how much
          outdegree each high
          class may give away
          while remaining safe.
        </div>

        {donorClasses.length ===
        0 ? (
          <div
            style={{
              color:
                '#64748b',
              fontSize:
                '15px',
            }}
          >
            No currently
            possible class lies
            above{' '}
            <Math>{'d/2'}</Math>
            .
          </div>
        ) : (
          <div
            style={{
              display:
                'grid',
              gap:
                '13px',
            }}
          >
            {donorClasses.map(
              (outdegree) => {
                const maximum =
                  getMaximumSafeCapacity(
                    outdegree,
                    forbiddenSet,
                  )

                const selected =
                  capacities[
                    outdegree
                  ] ??
                  0

                const selectedFloor =
                  outdegree -
                  selected

                return (
                  <div
                    key={
                      outdegree
                    }
                    style={{
                      display:
                        'grid',
                      gridTemplateColumns:
                        '64px 1fr 90px',
                      alignItems:
                        'center',
                      gap:
                        '12px',
                      padding:
                        '11px 12px',
                      border:
                        '1px solid #e2e8f0',
                      borderRadius:
                        '10px',
                      background:
                        '#f8fafc',
                    }}
                  >
                    <div
                      style={{
                        textAlign:
                          'center',
                      }}
                    >
                      <div
                        style={{
                          color:
                            '#64748b',
                          fontSize:
                            '13px',
                          marginBottom:
                            '2px',
                        }}
                      >
                        current
                      </div>

                      <Math>
                        {
                          `${outdegree}`
                        }
                      </Math>
                    </div>

                    <div
                      style={{
                        display:
                          'flex',
                        flexWrap:
                          'wrap',
                        gap:
                          '6px',
                      }}
                    >
                      {Array.from(
                        {
                          length:
                            maximum +
                            1,
                        },

                        (
                          _,
                          capacity,
                        ) => (
                          <Chip
                            key={
                              capacity
                            }
                            value={
                              capacity
                            }
                            selected={
                              selected ===
                              capacity
                            }
                            forbidden={
                              false
                            }
                            onClick={() =>
                              setCapacity(
                                outdegree,
                                capacity,
                              )
                            }
                          />
                        ),
                      )}
                    </div>

                    <div
                      style={{
                        textAlign:
                          'center',
                        color:
                          '#64748b',
                        fontSize:
                          '13px',
                      }}
                    >
                      may fall to

                      <div
                        style={{
                          marginTop:
                            '2px',
                          color:
                            '#334155',
                          fontSize:
                            '17px',
                        }}
                      >
                        <Math>
                          {
                            `${selectedFloor}`
                          }
                        </Math>
                      </div>
                    </div>
                  </div>
                )
              },
            )}
          </div>
        )}

        {donorClasses.length >
          0 && (
          <div
            style={{
              marginTop:
                '10px',
              textAlign:
                'right',
            }}
          >
            <button
              type="button"
              onClick={
                clearCapacities
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
                fontSize:
                  '14px',
                padding:
                  '2px 0',
              }}
            >
              reset capacities
            </button>
          </div>
        )}
      </section>

      {/* STAGE 3 */}
      <section
        style={{
          padding:
            '20px 22px',
        }}
      >
        <div
          style={{
            display:
              'flex',
            alignItems:
              'center',
            gap: '10px',
            marginBottom:
              '16px',
          }}
        >
          <div
            style={{
              width:
                '25px',
              height:
                '25px',
              border:
                '1px solid #94a3b8',
              borderRadius:
                '50%',
              display:
                'flex',
              alignItems:
                'center',
              justifyContent:
                'center',
              color:
                '#475569',
              fontSize:
                '14px',
              flexShrink: 0,
            }}
          >
            3
          </div>

          <strong>
            Repair certificate
          </strong>
        </div>

        <div
          style={{
            display:
              'grid',
            gap:
              '10px',
          }}
        >
          <div
            style={{
              padding:
                '12px 14px',

              border:
                coverageReady
                  ? '1px solid #bbf7d0'
                  : '1px solid #e2e8f0',

              borderRadius:
                '9px',

              background:
                coverageReady
                  ? '#f0fdf4'
                  : '#f8fafc',

              color:
                coverageReady
                  ? '#166534'
                  : '#64748b',
            }}
          >
            {coverageReady
              ? '✓ '
              : ''}
            Every currently
            bad class has a
            repair demand
          </div>

          <div
            style={{
              padding:
                '12px 14px',

              border:
                !coverageReady
                  ? '1px solid #e2e8f0'
                  : endpointSafe
                    ? '1px solid #bbf7d0'
                    : '1px solid #fecaca',

              borderRadius:
                '9px',

              background:
                !coverageReady
                  ? '#f8fafc'
                  : endpointSafe
                    ? '#f0fdf4'
                    : '#fef2f2',

              color:
                !coverageReady
                  ? '#64748b'
                  : endpointSafe
                    ? '#166534'
                    : '#991b1b',
            }}
          >
            {endpointSafe
              ? '✓ '
              : coverageReady
                ? '✕ '
                : ''}
            Endpoint changes
            are{' '}
            <Math>{'F'}</Math>
            -safe
          </div>

          <div
            style={{
              padding:
                '12px 14px',

              border:
                !coverageReady
                  ? '1px solid #e2e8f0'
                  : alphaCertified
                    ? '1px solid #bbf7d0'
                    : '1px solid #fecaca',

              borderRadius:
                '9px',

              background:
                !coverageReady
                  ? '#f8fafc'
                  : alphaCertified
                    ? '#f0fdf4'
                    : '#fef2f2',

              color:
                !coverageReady
                  ? '#64748b'
                  : alphaCertified
                    ? '#166534'
                    : '#991b1b',
            }}
          >
            {alphaCertified
              ? '✓ '
              : coverageReady
                ? '✕ '
                : ''}
            Directed-Menger
            cut condition

            {coverageReady && (
              <div
                style={{
                  marginTop:
                    '8px',
                  textAlign:
                    'center',
                }}
              >
                {renderAlphaInterval()}
              </div>
            )}
          </div>
        </div>

        {coverageReady && (
          <div
            style={{
              marginTop:
                '15px',
              border:
                '1px solid #e2e8f0',
              borderRadius:
                '10px',
              overflow:
                'hidden',
            }}
          >
            {certificate
              .alphaCertificate
              .demandBounds
              .map(
                (check) => (
                  <div
                    key={
                      `demand-${check.outdegree}`
                    }
                    style={{
                      padding:
                        '9px 12px',
                      borderBottom:
                        '1px solid #e2e8f0',
                      fontSize:
                        '15px',
                    }}
                  >
                    receiver{' '}
                    <Math>
                      {
                        `d^+=${check.outdegree}`
                      }
                    </Math>
                    :{' '}

                    {check.valid ? (
                      <Math>
                        {
                          `\\alpha\\geq ${formatBound(
                            check.bound,
                          )}`
                        }
                      </Math>
                    ) : (
                      <span
                        style={{
                          color:
                            '#b91c1c',
                        }}
                      >
                        incompatible
                        receiver
                        imbalance
                      </span>
                    )}
                  </div>
                ),
              )}

            {certificate
              .alphaCertificate
              .capacityBounds
              .map(
                (
                  check,
                  index,
                ) => {
                  const isLast =
                    index ===
                    certificate
                      .alphaCertificate
                      .capacityBounds
                      .length -
                      1

                  return (
                    <div
                      key={
                        `capacity-${check.outdegree}`
                      }
                      style={{
                        padding:
                          '9px 12px',

                        borderBottom:
                          isLast
                            ? 'none'
                            : '1px solid #e2e8f0',

                        fontSize:
                          '15px',
                      }}
                    >
                      donor{' '}
                      <Math>
                        {
                          `d^+=${check.outdegree}`
                        }
                      </Math>
                      :{' '}

                      {check.valid ? (
                        <Math>
                          {
                            `\\alpha\\leq ${formatBound(
                              check.bound,
                            )}`
                          }
                        </Math>
                      ) : (
                        <span
                          style={{
                            color:
                              '#b91c1c',
                          }}
                        >
                          incompatible
                          donor
                          imbalance
                        </span>
                      )}
                    </div>
                  )
                },
              )}
          </div>
        )}

        {canApply && (
          <div
            style={{
              marginTop:
                '16px',
              padding:
                '12px 14px',
              border:
                '1px solid #bbf7d0',
              borderRadius:
                '9px',
              background:
                '#f0fdf4',
              color:
                '#166534',
              textAlign:
                'center',
              fontWeight:
                600,
            }}
          >
            ✓ Repair
            certified
          </div>
        )}

        <div
          style={{
            display:
              'grid',
            gridTemplateColumns:
              '1fr 1fr',
            gap:
              '9px',
            marginTop:
              '18px',
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
              padding:
                '10px 14px',
              border:
                '1px solid #cbd5e1',
              borderRadius:
                '8px',
              background:
                '#ffffff',
              color:
                '#475569',
              cursor:
                'pointer',
            }}
          >
            ← Back
          </button>

          <button
            type="button"
            disabled={
              !canApply
            }
            onClick={() =>
              onApply(
                demandRules,
                capacityRules,
              )
            }
            style={{
              font:
                'inherit',
              padding:
                '10px 14px',

              border:
                canApply
                  ? '1px solid #15803d'
                  : '1px solid #cbd5e1',

              borderRadius:
                '8px',

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
            Apply repair
          </button>
        </div>
      </section>
    </div>
  )
}