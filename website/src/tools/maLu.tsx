import Math from '../components/Math'
import type {
  LovaszPair,
} from './lovaszPartition'
import type {
  AcrossDirection,
} from './orientAcrossPartition'
import type {
  MaLuApplication,
} from './maLuApplication'
import {
  getMaLuSelectionCertificate,
  getMaLuSelectableValues,
  getMaLuSelectionDegreeCheck,
  maLuCrossingEdgesPointOut,
  type MaLuTarget,
} from './maLuMath'

/*
 * Keep these re-exports for compatibility
 * with any existing playground code.
 */
export {
  getMaLuCertificate,
  getMaLuDegreeCheck,
  getMaLuPartCertificate,
  getMaLuWholeGraphCertificate,
  hasConsecutiveForbiddenValues,
  maLuCrossingEdgesPointOut,
  translateForbiddenSet,
} from './maLuMath'

export type {
  MaLuCertificate,
  MaLuCertificateArgs,
  MaLuDegreeCheck,
  MaLuPartCertificateArgs,
  MaLuPartTarget,
  MaLuTarget,
  MaLuWholeGraphCertificateArgs,
} from './maLuMath'

export const maLuTool = {
  id: 'ma-lu',
  name: 'Ma–Lu',
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
  target: MaLuTarget,
) {
  if (target === 'G') {
    return 'G'
  }

  return `G[${target}]`
}

type MaLuReferenceProps = {
  target: MaLuTarget

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
   * Null when the user opens the
   * theorem from the selector before
   * applying Ma-Lu.
   *
   * Non-null when the user clicks an
   * applied Ma-Lu badge in the graph.
   */
  application:
    MaLuApplication | null
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

function DegreeCheckRow({
  degree,
  forbiddenSet,
}: {
  degree: number
  forbiddenSet:
    readonly number[]
}) {
  const check =
    getMaLuSelectionDegreeCheck(
      degree,
      forbiddenSet,
    )

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns:
          '54px 1fr 32px',
        gap: '10px',
        alignItems: 'center',
        padding: '10px 12px',
        borderBottom:
          '1px solid #e2e8f0',
      }}
    >
      <div>
        <Math>
          {`r=${degree}`}
        </Math>
      </div>

      <div>
        <Math>
          {
            `F_r=${latexSet(
              check
                .relevantForbiddenSet,
            )}`
          }
        </Math>

        <div
          style={{
            marginTop: '4px',
            color: '#64748b',
            fontSize: '15px',
          }}
        >
          {degree === 0
            ? check
                .isolatedVertexSafe
              ? 'isolated vertex is safe'
              : '0 is forbidden'
            : !check
                .hasNoConsecutiveValues
              ? 'contains consecutive forbidden values'
              : check
                    .sizeBoundHolds
                ? `no consecutive values; 2|F_r|=${2 * check.relevantForbiddenSet.length} ≤ ${degree - 1}`
                : `size bound fails: 2|F_r|=${2 * check.relevantForbiddenSet.length} > ${degree - 1}`}
        </div>
      </div>

      <CertificateStatus
        passes={
          check.passes
        }
      />
    </div>
  )
}

export function MaLuReference({
  target,
  degree,
  fixedOutdegreeContribution,
  partition,
  acrossDirection,
  application,
}: MaLuReferenceProps) {
  const subgraph =
    targetGraphLatex(
      target,
    )

  const partPointsOut =
    target !== 'G' &&
    acrossDirection !== null &&
    maLuCrossingEdgesPointOut(
      target,
      acrossDirection,
    )

  /*
   * For an applied internal-mode move,
   * reconstruct the degree-by-degree
   * certificate from the current
   * structural information.
   */
  let internalPossibleDegrees:
    number[] = []

  if (
    application !== null &&
    application.mode ===
      'internal'
  ) {
    if (target === 'G') {
      internalPossibleDegrees = [
        degree,
      ]
    } else if (
      partition !== null
    ) {
      const maxDegree =
        target === 'L'
          ? partition.s
          : partition.t

      internalPossibleDegrees =
        getMaLuSelectableValues(
          maxDegree,
        )
    }
  }

  const internalCertificate =
    application !== null &&
    application.mode ===
      'internal'
      ? getMaLuSelectionCertificate({
          target,

          selectedForbiddenSet:
            application
              .selectedValues,

          possibleDegrees:
            internalPossibleDegrees,
        })
      : null

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
          Theorem (Ma–Lu)
        </h3>

        <p>
          Let <Math>{'H'}</Math>{' '}
          be a graph and let{' '}
          <Math>
            {
              'F_H:V(H)\\to 2^{\\mathbb N}'
            }
          </Math>{' '}
          be a forbidden
          outdegree-list assignment.
          Suppose that for every{' '}
          <Math>
            {'v\\in V(H)'}
          </Math>
          , the set{' '}
          <Math>
            {'F_H(v)'}
          </Math>{' '}
          contains no two consecutive
          integers and
        </p>

        <div
          style={{
            textAlign: 'center',
            margin: '18px 0',
          }}
        >
          <Math display>
            {
              '|F_H(v)|'
              + '\\leq'
              + '\\frac{d_H(v)-1}{2}.'
            }
          </Math>
        </div>

        <p>
          Then <Math>{'H'}</Math>{' '}
          has an{' '}
          <Math>{'F_H'}</Math>
          -avoiding orientation.
        </p>

        <p
          style={{
            color: '#64748b',
            fontSize: '16px',
          }}
        >
          The playground uses the
          equivalent integer test{' '}
          <Math>
            {
              '2|F_H(v)|\\leq d_H(v)-1'
            }
          </Math>{' '}
          at every positive vertex
          degree. Isolated vertices are
          handled directly.
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
              Ma–Lu will be applied to
              the internal graph{' '}
              <Math>
                {subgraph}
              </Math>
              .
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
                    2-factors already
                    contribute{' '}
                    <Math>
                      {
                        `+${fixedOutdegreeContribution}`
                      }
                    </Math>{' '}
                    to every final
                    outdegree.
                  </p>
                )}

                <p>
                  In{' '}
                  <strong>
                    Target totals
                  </strong>{' '}
                  mode, the selected
                  final outdegrees are
                  translated to the
                  corresponding
                  outdegrees in this
                  residual graph.
                </p>

                <p>
                  In{' '}
                  <strong>
                    Internal
                  </strong>{' '}
                  mode, the selected
                  values are directly
                  forbidden as
                  outdegrees in{' '}
                  <Math>
                    {subgraph}
                  </Math>
                  .
                </p>
              </>
            ) : (
              <>
                {partition !== null && (
                  <p>
                    The Lovász
                    partition gives
                  </p>
                )}

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
                        target ===
                        'L'
                          ? `\\Delta(G[L])\\leq ${partition.s}.`
                          : `\\Delta(G[R])\\leq ${partition.t}.`
                      }
                    </Math>
                  </div>
                )}

                <p>
                  In{' '}
                  <strong>
                    Internal
                  </strong>{' '}
                  mode, the user
                  directly chooses
                  outdegrees to avoid
                  inside{' '}
                  <Math>
                    {subgraph}
                  </Math>
                  . The Ma–Lu
                  hypothesis is checked
                  for every internal
                  degree currently
                  allowed by the
                  structural
                  information.
                </p>

                {acrossDirection ===
                null ? (
                  <p>
                    The crossing edges
                    have not yet been
                    oriented, so{' '}
                    <strong>
                      Target totals
                    </strong>{' '}
                    mode is not yet
                    available. Ma–Lu can
                    still be applied in
                    Internal mode.
                  </p>
                ) : (
                  <>
                    <p>
                      Since the crossing
                      direction is
                      known, the
                      playground can
                      also translate a
                      desired final
                      outdegree into a
                      degree-dependent
                      internal forbidden
                      list.
                    </p>

                    {partPointsOut ? (
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
                            'd_G^+(v)'
                            + '='
                            + `${fixedOutdegreeContribution}`
                            + '+(d-r)'
                            + `+d_{${subgraph}}^+(v),`
                            + `\\qquad d=${degree}.`
                          }
                        </Math>
                      </div>
                    ) : (
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
                            'd_G^+(v)'
                            + '='
                            + `${fixedOutdegreeContribution}`
                            + `+d_{${subgraph}}^+(v).`
                          }
                        </Math>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </>
        ) : application.mode ===
          'internal' ? (
          <>
            <p>
              Ma–Lu was applied to{' '}
              <Math>
                {subgraph}
              </Math>{' '}
              with the internal
              forbidden set
            </p>

            <div
              style={{
                textAlign: 'center',
                margin: '18px 0',
              }}
            >
              <Math display>
                {
                  `S=${latexSet(
                    application
                      .selectedValues,
                  )}.`
                }
              </Math>
            </div>

            <p>
              Thus the chosen
              orientation satisfies
            </p>

            <div
              style={{
                textAlign: 'center',
                margin: '18px 0',
              }}
            >
              <Math display>
                {
                  `d^+_{${subgraph}}(v)`
                  + `\\notin ${latexSet(
                    application
                      .selectedValues,
                  )}.`
                }
              </Math>
            </div>

            {target !== 'G' && (
              <p>
                Because the Lovász
                partition supplies only
                a maximum-degree bound,
                the theorem is checked
                separately at every
                possible internal
                degree.
              </p>
            )}

            <div
              style={{
                marginTop: '18px',
                border:
                  '1px solid #e2e8f0',
                borderRadius: '10px',
                overflow: 'hidden',
              }}
            >
              {internalPossibleDegrees.map(
                (r) => (
                  <DegreeCheckRow
                    key={r}
                    degree={r}
                    forbiddenSet={
                      application
                        .selectedValues
                    }
                  />
                ),
              )}
            </div>

            {internalCertificate !==
              null && (
              <p
                style={{
                  marginTop:
                    '18px',
                }}
              >
                Every relevant degree
                check{' '}
                <strong>
                  {internalCertificate
                    .applicable
                    ? 'passes'
                    : 'fails'}
                </strong>
                .
              </p>
            )}
          </>
        ) : (
          <>
            <p>
              Ma–Lu was used to
              eliminate the final total
              outdegree
              {application
                .selectedValues
                .length > 1
                ? 's'
                : ''}{' '}
              <Math>
                {
                  latexSet(
                    application
                      .selectedValues,
                  )
                }
              </Math>{' '}
              on{' '}
              <Math>
                {subgraph}
              </Math>
              .
            </p>

            <p>
              For a vertex whose
              internal degree is{' '}
              <Math>{'r'}</Math>, the
              already forced edges
              contribute some amount{' '}
              <Math>{'a_r'}</Math>{' '}
              to its final outdegree.
              A targeted total value{' '}
              <Math>{'q'}</Math>{' '}
              therefore corresponds to
              the internal value
            </p>

            <div
              style={{
                textAlign: 'center',
                margin: '18px 0',
              }}
            >
              <Math display>
                {
                  'q-a_r.'
                }
              </Math>
            </div>

            <p>
              The degree-dependent
              lists certified in this
              application are:
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
              {application.degreeRules?.map(
                (
                  rule,
                  index,
                ) => {
                  const check =
                    getMaLuSelectionDegreeCheck(
                      rule.degree,
                      rule
                        .localForbiddenSet,
                    )

                  const isLast =
                    index ===
                    (
                      application
                        .degreeRules
                        ?.length ??
                      0
                    ) -
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
                          '48px 72px 1fr 28px',
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
                            `r=${rule.degree}`
                          }
                        </Math>
                      </div>

                      <div>
                        <Math>
                          {
                            `a_r=${rule.outsideContribution}`
                          }
                        </Math>
                      </div>

                      <div>
                        <Math>
                          {
                            `F_r=${latexSet(
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
                          {rule.degree ===
                          0
                            ? check
                                .passes
                              ? 'isolated vertex is safe'
                              : '0 cannot be avoided'
                            : !check
                                .hasNoConsecutiveValues
                              ? 'contains consecutive forbidden values'
                              : `2|F_r|=${2 * rule.localForbiddenSet.length} ≤ ${rule.degree - 1}`}
                        </div>
                      </div>

                      <CertificateStatus
                        passes={
                          check.passes
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
              Every row satisfies the
              Ma–Lu hypotheses, so the
              resulting internal
              orientation eliminates
              the selected total
              outdegree
              {application
                .selectedValues
                .length > 1
                ? 's'
                : ''}{' '}
              <Math>
                {
                  latexSet(
                    application
                      .selectedValues,
                  )
                }
              </Math>
              .
            </p>
          </>
        )}
      </section>

      {/* REFERENCE */}
      <section>
        <h3>
          Reference
        </h3>

        <p>
          Xinxin Ma and Hongliang Lu,
          <em>
            {' '}
            A characterization on
            orientations of graphs
            avoiding given lists on
            out-degrees
          </em>
          , Corollary 3.1,
          arXiv:2310.15650v1,
          24 October 2023.
        </p>

        <p>
          <a
            href="https://arxiv.org/abs/2310.15650v1"
            target="_blank"
            rel="noreferrer"
            style={{
              color: '#475569',
            }}
          >
            arXiv paper
          </a>
        </p>

        <p
          style={{
            color: '#64748b',
            fontSize: '16px',
          }}
        >
          This playground implements
          Corollary 3.1 as stated in the
          body of the paper. In
          particular, it checks{' '}
          <Math>
            {
              '2|F_H(v)|\\leq d_H(v)-1'
            }
          </Math>
          .
        </p>
      </section>
    </>
  )
}