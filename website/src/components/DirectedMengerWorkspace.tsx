import {
  useMemo,
  useState,
} from 'react'
import Math from './Math'
import {
  getDirectedMengerRepairCertificate,
  type MengerCapacityRule,
  type MengerDemandRule,
  type MengerRepairDirection,
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

  onOpenReference?: () => void

  /*
   * Direction is the third argument so
   * the old V1 caller may temporarily
   * ignore it while V2 is wired one
   * file at a time.
   */
  onApply: (
    demandRules:
      readonly MengerDemandRule[],

    capacityRules:
      readonly MengerCapacityRule[],

    direction:
      MengerRepairDirection,
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

function getMaximumSafeCapacity({
  outdegree,
  degree,
  forbiddenSet,
  direction,
}: {
  outdegree: number

  degree: number

  forbiddenSet:
    readonly number[]

  direction:
    MengerRepairDirection
}) {
  if (
    forbiddenSet.includes(
      outdegree,
    )
  ) {
    return 0
  }

  /*
   * Capacity classes move in the
   * opposite direction from bad
   * demand classes.
   *
   * increase repair:
   *
   *   buffer q -> q-j
   *
   * decrease repair:
   *
   *   buffer q -> q+j
   */
  const step =
    direction ===
    'increase'
      ? -1
      : 1

  let capacity = 0

  let nextOutdegree =
    outdegree + step

  while (
    nextOutdegree >= 0 &&
    nextOutdegree <= degree &&
    !forbiddenSet.includes(
      nextOutdegree,
    )
  ) {
    capacity += 1

    nextOutdegree +=
      step
  }

  return capacity
}

function getSafeTargets({
  outdegree,
  degree,
  forbiddenSet,
  direction,
}: {
  outdegree: number

  degree: number

  forbiddenSet:
    readonly number[]

  direction:
    MengerRepairDirection
}) {
  const values:
    number[] = []

  if (
    direction ===
    'increase'
  ) {
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

  for (
    let target =
      outdegree - 1;
    target >= 0;
    target -= 1
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

function DirectionButton({
  direction,
  selected,
  title,
  formula,
  description,
  onClick,
}: {
  direction:
    MengerRepairDirection

  selected: boolean

  title: string

  formula: string

  description: string

  onClick: (
    direction:
      MengerRepairDirection,
  ) => void
}) {
  return (
    <button
      type="button"
      aria-pressed={
        selected
      }
      onClick={() =>
        onClick(
          direction,
        )
      }
      style={{
        font: 'inherit',

        width: '100%',

        padding:
          '13px 14px',

        border:
          selected
            ? '1px solid #64748b'
            : '1px solid #e2e8f0',

        borderRadius:
          '10px',

        background:
          selected
            ? '#f1f5f9'
            : '#ffffff',

        color:
          '#334155',

        cursor:
          'pointer',

        textAlign:
          'left',
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
            '12px',
        }}
      >
        <strong>
          {title}
        </strong>

        <Math>
          {formula}
        </Math>
      </div>

      <div
        style={{
          marginTop:
            '6px',

          color:
            '#64748b',

          fontSize:
            '14px',

          lineHeight:
            1.35,
        }}
      >
        {description}
      </div>
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
    direction,
    setDirection,
  ] =
    useState<
      MengerRepairDirection
    >('increase')

  const [
    repairTargets,
    setRepairTargets,
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
   * The local alpha certificate forces
   * bad demand classes to have positive
   * imbalance in the chosen direction.
   *
   * Increase:
   *
   *   d - 2q > 0,
   *   so q < d/2.
   *
   * Decrease:
   *
   *   2q - d > 0,
   *   so q > d/2.
   */
  const repairableBadClasses =
    badClasses.filter(
      (value) =>
        direction ===
        'increase'
          ? 2 * value <
            degree
          : 2 * value >
            degree,
    )

  const unsupportedBadClasses =
    badClasses.filter(
      (value) =>
        direction ===
        'increase'
          ? 2 * value >=
            degree
          : 2 * value <=
            degree,
    )

  const demandRules:
    MengerDemandRule[] =
    repairableBadClasses
      .filter(
        (outdegree) =>
          repairTargets[
            outdegree
          ] !== undefined,
      )
      .map(
        (outdegree) => {
          const target =
            repairTargets[
              outdegree
            ]

          return {
            outdegree,

            demand:
              direction ===
              'increase'
                ? target -
                  outdegree
                : outdegree -
                  target,
          }
        },
      )

  /*
   * These are precisely the classes
   * that can create the nontrivial
   * upper bound on alpha.
   *
   * Increase:
   *
   *   high classes lose outdegree.
   *
   * Decrease:
   *
   *   low classes gain outdegree.
   *
   * Every omitted safe class still has
   * capacity zero in the theorem.
   */
  const bufferClasses =
    sortedPossibilities.filter(
      (value) =>
        direction ===
        'increase'
          ? 2 * value >
            degree
          : 2 * value <
            degree,
    )

  const capacityRules:
    MengerCapacityRule[] =
    bufferClasses.map(
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

      direction,
    })

  const allRepairTargetsChosen =
    repairableBadClasses.length >
      0 &&
    repairableBadClasses.every(
      (outdegree) =>
        repairTargets[
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

  function chooseDirection(
    nextDirection:
      MengerRepairDirection,
  ) {
    if (
      nextDirection ===
      direction
    ) {
      return
    }

    setDirection(
      nextDirection,
    )

    /*
     * Targets and capacities mean
     * different things in the two
     * directions, so never carry them
     * across a direction change.
     */
    setRepairTargets({})
    setCapacities({})
  }

  function chooseTarget(
    outdegree: number,
    target: number,
  ) {
    setRepairTargets(
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

    bufferClasses.forEach(
      (outdegree) => {
        next[outdegree] =
          getMaximumSafeCapacity({
            outdegree,

            degree,

            forbiddenSet,

            direction,
          })
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
          + ' \\leq '
          + '\\alpha'
          + ' \\leq '
          + `${formatBound(
            upperBound,
          )}`
        }
      </Math>
    )
  }

  const headerStyle = {
    font:
      'inherit',

    fontSize:
      '21px',

    fontWeight:
      600,

    color:
      '#334155',
  }

  const demandRoleLabel =
    direction ===
    'increase'
      ? 'receiver'
      : 'sender'

  const capacityRoleLabel =
    direction ===
    'increase'
      ? 'donor'
      : 'receiver'

  return (
    <div
      style={{
        width:
          '100%',

        maxWidth:
          '640px',

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

            gap:
              '58px',

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

      {/* DIRECTION */}

      <section
        style={{
          padding:
            '18px 22px',

          borderBottom:
            '1px solid #e2e8f0',
        }}
      >
        <div
          style={{
            color:
              '#64748b',

            fontSize:
              '14px',

            marginBottom:
              '10px',

            textAlign:
              'center',
          }}
        >
          Choose which endpoint
          contains the bad
          vertices.
        </div>

        <div
          style={{
            display:
              'grid',

            gridTemplateColumns:
              '1fr 1fr',

            gap:
              '10px',
          }}
        >
          <DirectionButton
            direction="increase"
            selected={
              direction ===
              'increase'
            }
            title="Increase"
            formula={
              'q\\mapsto q+r'
            }
            description={
              'Repair paths end at the bad vertices.'
            }
            onClick={
              chooseDirection
            }
          />

          <DirectionButton
            direction="decrease"
            selected={
              direction ===
              'decrease'
            }
            title="Decrease"
            formula={
              'q\\mapsto q-r'
            }
            description={
              'Repair paths begin at the bad vertices.'
            }
            onClick={
              chooseDirection
            }
          />
        </div>
      </section>

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

            gap:
              '10px',

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
              should be{' '}
              {direction ===
              'increase'
                ? 'raised'
                : 'lowered'}
              .
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
                    getSafeTargets({
                      outdegree,

                      degree,

                      forbiddenSet,

                      direction,
                    })

                  const selected =
                    repairTargets[
                      outdegree
                    ]

                  const demand =
                    selected ===
                    undefined
                      ? null
                      : direction ===
                          'increase'
                        ? selected -
                          outdegree
                        : outdegree -
                          selected

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
                        undefined &&
                        demand !==
                          null && (
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
                              + `\\xrightarrow{${
                                direction ===
                                'increase'
                                  ? '+'
                                  : '-'
                              }${demand}}`
                              + `${selected}`
                            }
                          </Math>

                          {'  '}
                          demand{' '}

                          <Math>
                            {
                              `r=${demand}`
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
                This one-sided{' '}
                {direction ===
                'increase'
                  ? 'increase'
                  : 'decrease'}{' '}
                certificate cannot
                handle the currently
                bad class
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
                not lie{' '}
                {direction ===
                'increase'
                  ? 'below'
                  : 'above'}{' '}
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

            gap:
              '12px',

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
              Buffer capacities
            </strong>
          </div>

          {bufferClasses.length >
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
          {direction ===
          'increase'
            ? (
              <>
                Choose how much
                outdegree each
                high class may
                give away while
                remaining safe.
              </>
            )
            : (
              <>
                Choose how much
                outdegree each
                low class may
                absorb while
                remaining safe.
              </>
            )}
        </div>

        {bufferClasses.length ===
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
            possible class lies{' '}
            {direction ===
            'increase'
              ? 'above'
              : 'below'}{' '}

            <Math>
              {'d/2'}
            </Math>
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
            {bufferClasses.map(
              (outdegree) => {
                const maximum =
                  getMaximumSafeCapacity({
                    outdegree,

                    degree,

                    forbiddenSet,

                    direction,
                  })

                const selected =
                  capacities[
                    outdegree
                  ] ??
                  0

                const selectedLanding =
                  direction ===
                  'increase'
                    ? outdegree -
                      selected
                    : outdegree +
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
                      {direction ===
                      'increase'
                        ? 'may fall to'
                        : 'may rise to'}

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
                            `${selectedLanding}`
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

        {bufferClasses.length >
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

            gap:
              '10px',

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

            <Math>
              {'F'}
            </Math>
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
                    {demandRoleLabel}{' '}

                    <Math>
                      {
                        `d^+=${check.outdegree}`
                      }
                    </Math>
                    :{' '}

                    {check.valid ? (
                      <Math>
                        {
                          '\\alpha'
                          + ' \\geq '
                          + formatBound(
                            check.bound,
                          )
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
                        {` ${demandRoleLabel} `}
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
                      {capacityRoleLabel}{' '}

                      <Math>
                        {
                          `d^+=${check.outdegree}`
                        }
                      </Math>
                      :{' '}

                      {check.valid ? (
                        <Math>
                          {
                            '\\alpha'
                            + ' \\leq '
                            + formatBound(
                              check.bound,
                            )
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
                          {` ${capacityRoleLabel} `}
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
            ✓{' '}
            {direction ===
            'increase'
              ? 'Increase'
              : 'Decrease'}{' '}
            repair certified
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
                direction,
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
            Apply{' '}
            {direction ===
            'increase'
              ? 'increase'
              : 'decrease'}{' '}
            repair
          </button>
        </div>
      </section>
    </div>
  )
}