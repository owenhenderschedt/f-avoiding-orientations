import Math from '../components/Math'
import type {
  LovaszPair,
} from './lovaszPartition'
import type {
  AcrossDirection,
} from './orientAcrossPartition'
import type {
  RunAvoidanceApplication,
} from './runAvoidanceApplication'
import {
  getRunAvoidanceDegreeCheck,
  getRunAvoidanceShift,
  type RunAvoidanceTarget,
} from './runAvoidanceMath'

export const runAvoidanceTool = {
  id: 'run-avoidance',
  name: 'Run Avoidance',
} as const

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

function targetGraphLatex(
  target: RunAvoidanceTarget,
) {
  if (target === 'G') {
    return 'G'
  }

  return `G[${target}]`
}

function intervalLatex(
  interval:
    | {
        lower: number
        upper: number
      }
    | null,
) {
  if (interval === null) {
    return '\\varnothing'
  }

  return (
    `\\{${interval.lower},` +
    `\\ldots,${interval.upper}\\}`
  )
}

function CertificateStatus({
  passes,
}: {
  passes: boolean
}) {
  return (
    <span
      style={{
        color: passes
          ? '#15803d'
          : '#b91c1c',
        fontWeight: 600,
      }}
    >
      {passes ? '✓' : '✕'}
    </span>
  )
}

type RunAvoidanceReferenceProps = {
  target: RunAvoidanceTarget

  /*
   * Degree of the current residual
   * regular graph.
   */
  degree: number

  /*
   * Contribution already supplied by
   * previously oriented 2-factors.
   */
  fixedOutdegreeContribution: number

  partition: LovaszPair | null

  acrossDirection:
    AcrossDirection | null

  /*
   * Null when opened from the selector.
   * Non-null when opened from an
   * applied Run Avoidance badge.
   */
  application:
    RunAvoidanceApplication | null
}

export function RunAvoidanceReference({
  target,
  degree,
  fixedOutdegreeContribution,
  partition,
  acrossDirection,
  application,
}: RunAvoidanceReferenceProps) {
  const subgraph =
    targetGraphLatex(
      target,
    )

  const shift =
    application === null
      ? null
      : getRunAvoidanceShift(
          application.r,
        )

  return (
    <>
      {/* THEOREM */}
      <section
        style={{
          marginBottom: '32px',
        }}
      >
        <h3
          style={{
            marginTop: 0,
          }}
        >
          Run Avoidance Theorem
        </h3>

        <p>
          Let <Math>{'H'}</Math>{' '}
          be a finite graph, let{' '}
          <Math>{'r\\geq 1'}</Math>,
          and put
        </p>

        <div
          style={{
            textAlign: 'center',
            margin: '18px 0',
          }}
        >
          <Math display>
            {
              's_r=r+\\left\\lceil\\frac r2\\right\\rceil.'
            }
          </Math>
        </div>

        <p>
          Suppose each vertex{' '}
          <Math>{'v'}</Math>{' '}
          has a forbidden
          outdegree list{' '}
          <Math>{'F(v)'}</Math>.
          If
        </p>

        <div
          style={{
            textAlign: 'center',
            margin: '18px 0',
          }}
        >
          <Math display>
            {
              'F(v)\\subseteq'
              + '\\{0,1,\\ldots,'
              + 'd_H(v)-s_r-1\\}'
            }
          </Math>
        </div>

        <p>
          for every vertex, and no{' '}
          <Math>{'F(v)'}</Math>{' '}
          contains{' '}
          <Math>{'r+1'}</Math>{' '}
          consecutive integers, then{' '}
          <Math>{'H'}</Math>{' '}
          has an{' '}
          <Math>{'F'}</Math>
          -avoiding orientation.
        </p>

        <p>
          Reversing every edge gives
          the symmetric high form:
          the same conclusion holds if
        </p>

        <div
          style={{
            textAlign: 'center',
            margin: '18px 0',
          }}
        >
          <Math display>
            {
              'F(v)\\subseteq'
              + '\\{s_r+1,'
              + '\\ldots,d_H(v)\\}'
            }
          </Math>
        </div>

        <p>
          and again no list contains{' '}
          <Math>{'r+1'}</Math>{' '}
          consecutive integers.
        </p>

        <p
          style={{
            color: '#64748b',
            fontSize: '16px',
          }}
        >
          The lists may depend on the
          vertex. This is what allows
          Run Avoidance to be used
          inside a Lovász part after
          the crossing edges have
          already been oriented.
        </p>
      </section>

      {/* PROOF */}
      <section
        style={{
          marginBottom: '32px',
        }}
      >
        <h3>
          Why the theorem works
        </h3>

        <p>
          We describe the low form.
          The high form follows by
          reversing every edge.
        </p>

        <p>
          Choose a partition
          <Math>{'V(H)=X\\cup Y'}</Math>{' '}
          for which
        </p>

        <div
          style={{
            textAlign: 'center',
            margin: '18px 0',
          }}
        >
          <Math display>
            {
              'r|Y|-e_H(Y)'
            }
          </Math>
        </div>

        <p>
          is as large as possible.
          Removing one vertex from{' '}
          <Math>{'Y'}</Math>{' '}
          shows immediately that
        </p>

        <div
          style={{
            textAlign: 'center',
            margin: '18px 0',
          }}
        >
          <Math display>
            {
              '\\Delta(H[Y])\\leq r.'
            }
          </Math>
        </div>

        <p>
          Comparing this maximizing
          set with{' '}
          <Math>
            {
              '(Y\\setminus R)\\cup U'
            }
          </Math>{' '}
          gives, for every{' '}
          <Math>{'U\\subseteq X'}</Math>{' '}
          and{' '}
          <Math>{'R\\subseteq Y'}</Math>,
        </p>

        <div
          style={{
            textAlign: 'center',
            margin: '18px 0',
          }}
        >
          <Math display>
            {
              'r|U|-e_H(U)'
              + '\\leq '
              + 'e_H(U,Y\\setminus R)'
              + '+r|R|.'
            }
          </Math>
        </div>

        <p>
          Now orient{' '}
          <Math>{'H[X]'}</Math>{' '}
          so that the number of
          vertices whose present
          outdegree lies in their
          forbidden list is as small
          as possible. Let{' '}
          <Math>{'P'}</Math>{' '}
          be this set of bad vertices.
        </p>

        <p>
          For{' '}
          <Math>{'x\\in P'}</Math>,
          let <Math>{'q_x'}</Math>{' '}
          be the number of arcs from{' '}
          <Math>{'x'}</Math>{' '}
          to another vertex of{' '}
          <Math>{'P'}</Math>. Let{' '}
          <Math>{'\\rho_x'}</Math>{' '}
          be the smallest positive
          integer for which increasing
          the current outdegree of{' '}
          <Math>{'x'}</Math>{' '}
          by <Math>{'\\rho_x'}</Math>{' '}
          leaves its forbidden list.
        </p>

        <p>
          Minimality implies that
          decreasing the outdegree of{' '}
          <Math>{'x'}</Math>{' '}
          by any of
          <Math>
            {
              '1,\\ldots,q_x'
            }
          </Math>{' '}
          is still forbidden.
          Otherwise we could reverse
          that many outgoing arcs from{' '}
          <Math>{'x'}</Math>{' '}
          inside <Math>{'P'}</Math>,
          make <Math>{'x'}</Math>{' '}
          good, and create no new bad
          vertex outside{' '}
          <Math>{'P'}</Math>.
        </p>

        <p>
          Consequently the forbidden
          list of <Math>{'x'}</Math>{' '}
          contains one consecutive
          block of length{' '}
          <Math>{'q_x+\\rho_x'}</Math>.
          Since no forbidden list has
          a run of length{' '}
          <Math>{'r+1'}</Math>,
        </p>

        <div
          style={{
            textAlign: 'center',
            margin: '18px 0',
          }}
        >
          <Math display>
            {
              'q_x+\\rho_x\\leq r.'
            }
          </Math>
        </div>

        <p>
          Thus, for every{' '}
          <Math>{'U\\subseteq P'}</Math>,
        </p>

        <div
          style={{
            textAlign: 'center',
            margin: '18px 0',
          }}
        >
          <Math display>
            {
              '\\sum_{x\\in U}\\rho_x'
              + '\\leq '
              + 'r|U|-e_H(U)'
              + '\\leq '
              + 'e_H(U,Y\\setminus R)'
              + '+r|R|'
            }
          </Math>
        </div>

        <p>
          for every{' '}
          <Math>{'R\\subseteq Y'}</Math>.
          These are the cut
          inequalities needed to
          complete the orientation:
          each bad vertex in{' '}
          <Math>{'X'}</Math>{' '}
          receives exactly enough new
          outgoing edges toward{' '}
          <Math>{'Y'}</Math>{' '}
          to leave its forbidden run,
          while vertices already good
          remain at a safe outdegree.
        </p>

        <p>
          On the <Math>{'Y'}</Math>{' '}
          side we require final
          outdegree at least
        </p>

        <div
          style={{
            textAlign: 'center',
            margin: '18px 0',
          }}
        >
          <Math display>
            {
              'd_H(y)-s_r.'
            }
          </Math>
        </div>

        <p>
          The bound{' '}
          <Math>
            {
              '\\Delta(H[Y])\\leq r'
            }
          </Math>{' '}
          together with{' '}
          <Math>
            {
              's_r=r+\\lceil r/2\\rceil'
            }
          </Math>{' '}
          verifies the remaining
          lower- and upper-outdegree
          inequalities in the standard
          <Math>{'(f,g)'}</Math>
          -orientation criterion.
          Hence the partial orientation
          extends to all of{' '}
          <Math>{'H'}</Math>.
          Every vertex of{' '}
          <Math>{'X'}</Math>{' '}
          finishes outside its
          forbidden list, while every
          vertex of{' '}
          <Math>{'Y'}</Math>{' '}
          finishes above the entire
          low forbidden range.
        </p>
      </section>

      {/* APPLICATION */}
      <section
        style={{
          marginBottom: '32px',
        }}
      >
        <h3>
          Application
        </h3>

        {application === null ? (
          <>
            <p>
              Run Avoidance will be
              applied to{' '}
              <Math>{subgraph}</Math>.
              The user first chooses
              the run parameter{' '}
              <Math>{'r'}</Math>{' '}
              and whether to use the
              low or high form of the
              theorem.
            </p>

            <p>
              The selected numbers are
              <strong>
                {' '}final total
                outdegrees
              </strong>
              . They need not all
              belong to the original
              forbidden set. A safe
              outdegree may be selected
              deliberately when doing
              so makes the Run
              Avoidance theorem
              applicable.
            </p>

            <p>
              For a vertex of internal
              degree{' '}
              <Math>{'h'}</Math>,
              suppose previously
              oriented edges already
              contribute{' '}
              <Math>{'a_h'}</Math>{' '}
              to its final outdegree.
              A selected total value{' '}
              <Math>{'q'}</Math>{' '}
              is translated to the
              local value
            </p>

            <div
              style={{
                textAlign: 'center',
                margin: '18px 0',
              }}
            >
              <Math display>
                {'q-a_h.'}
              </Math>
            </div>

            <p>
              The theorem is then
              checked separately at
              every possible internal
              degree.
            </p>

            {target === 'G' ? (
              <>
                <p>
                  The current residual
                  graph is{' '}
                  <Math>
                    {`${degree}`}
                  </Math>
                  -regular.
                </p>

                {fixedOutdegreeContribution >
                  0 && (
                  <p>
                    Previously oriented
                    2-factors contribute{' '}
                    <Math>
                      {
                        `+${fixedOutdegreeContribution}`
                      }
                    </Math>{' '}
                    to every final
                    outdegree.
                  </p>
                )}
              </>
            ) : (
              <>
                {partition !== null && (
                  <div
                    style={{
                      textAlign:
                        'center',
                      margin:
                        '18px 0',
                    }}
                  >
                    <Math display>
                      {
                        target === 'L'
                          ? `\\Delta(G[L])\\leq ${partition.s}.`
                          : `\\Delta(G[R])\\leq ${partition.t}.`
                      }
                    </Math>
                  </div>
                )}

                {acrossDirection ===
                null ? (
                  <p>
                    The crossing edges
                    must first be
                    oriented before
                    final total
                    outdegrees can be
                    translated into
                    local Run Avoidance
                    lists.
                  </p>
                ) : (
                  <p>
                    The crossing
                    direction is fixed,
                    so its contribution
                    is known for every
                    possible internal
                    degree.
                  </p>
                )}
              </>
            )}
          </>
        ) : (
          <>
            <p>
              Run Avoidance was applied
              to{' '}
              <Math>{subgraph}</Math>{' '}
              with
            </p>

            <div
              style={{
                textAlign: 'center',
                margin: '18px 0',
              }}
            >
              <Math display>
                {
                  `r=${application.r},`
                  + `\\qquad`
                  + `s_r=${shift}.`
                }
              </Math>
            </div>

            <p>
              The{' '}
              <strong>
                {application.side ===
                'low'
                  ? 'low'
                  : 'high'}
              </strong>{' '}
              form was used to
              eliminate the final
              total outdegrees
            </p>

            <div
              style={{
                textAlign: 'center',
                margin: '18px 0',
              }}
            >
              <Math display>
                {
                  `Q=${latexSet(
                    application
                      .selectedTotalOutdegrees,
                  )}.`
                }
              </Math>
            </div>

            <p>
              At each possible internal
              degree <Math>{'h'}</Math>,
              the fixed contribution{' '}
              <Math>{'a_h'}</Math>{' '}
              translates these total
              values into a local list.
              The certificate is:
            </p>

            <div
              style={{
                marginTop: '18px',
                border:
                  '1px solid #e2e8f0',
                borderRadius: '10px',
                overflow: 'hidden',
              }}
            >
              {application
                .degreeRules
                .map(
                  (
                    rule,
                    index,
                  ) => {
                    const check =
                      getRunAvoidanceDegreeCheck({
                        degree:
                          rule.degree,

                        r:
                          application.r,

                        side:
                          application.side,

                        localForbiddenSet:
                          rule
                            .localForbiddenSet,
                      })

                    const isLast =
                      index ===
                      application
                        .degreeRules
                        .length -
                        1

                    return (
                      <div
                        key={
                          rule.degree
                        }
                        style={{
                          display:
                            'grid',
                          gridTemplateColumns:
                            '46px 62px 1fr 28px',
                          gap: '8px',
                          alignItems:
                            'center',
                          padding:
                            '10px 12px',
                          borderBottom:
                            isLast
                              ? 'none'
                              : '1px solid #e2e8f0',
                        }}
                      >
                        <div>
                          <Math>
                            {
                              `h=${rule.degree}`
                            }
                          </Math>
                        </div>

                        <div>
                          <Math>
                            {
                              `a_h=${rule.outsideContribution}`
                            }
                          </Math>
                        </div>

                        <div>
                          <Math>
                            {
                              `F_h=${latexSet(
                                rule
                                  .localForbiddenSet,
                              )}`
                            }
                          </Math>

                          <div
                            style={{
                              marginTop:
                                '4px',
                              color:
                                '#64748b',
                              fontSize:
                                '15px',
                            }}
                          >
                            <Math>
                              {
                                `F_h\\subseteq ${intervalLatex(
                                  check
                                    .allowedInterval,
                                )}`
                              }
                            </Math>
                            {'; '}
                            longest run{' '}
                            <Math>
                              {
                                `${check.longestConsecutiveRun}\\leq ${application.r}`
                              }
                            </Math>
                          </div>
                        </div>

                        <CertificateStatus
                          passes={
                            check
                              .passes
                          }
                        />
                      </div>
                    )
                  },
                )}
            </div>

            <p
              style={{
                marginTop: '18px',
              }}
            >
              Every degree check{' '}
              <strong>
                {application
                  .certificate
                  .applicable
                  ? 'passes'
                  : 'fails'}
              </strong>
              . Therefore the selected
              final outdegrees in{' '}
              <Math>
                {
                  latexSet(
                    application
                      .selectedTotalOutdegrees,
                  )
                }
              </Math>{' '}
              are eliminated on{' '}
              <Math>{subgraph}</Math>.
            </p>
          </>
        )}
      </section>

      {/* PLAYGROUND NOTE */}
      <section>
        <h3>
          Playground convention
        </h3>

        <p>
          Run Avoidance is an
          orientation
          <strong> constructor</strong>,
          not merely a terminal test.
          Once its hypotheses are
          certified, the resulting
          orientation may be combined
          with the other orientation
          tools available in the
          playground.
        </p>

        <p
          style={{
            color: '#64748b',
            fontSize: '16px',
          }}
        >
          A single application uses
          either the low theorem or
          the high theorem. The two
          sides are not combined in
          one Run Avoidance
          application.
        </p>
      </section>
    </>
  )
}
