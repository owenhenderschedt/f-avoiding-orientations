import Math from '../components/Math'
import type {
  LovaszPair,
} from './lovaszPartition'
import type {
  AcrossDirection,
} from './orientAcrossPartition'
import {
  getMaLuCertificate,
  maLuCrossingEdgesPointOut,
  type MaLuTarget,
} from './maLuMath'

/*
 * Re-export the mathematical API so
 * existing playground files do not
 * need to change during this refactor.
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

type MaLuReferenceProps = {
  target: MaLuTarget

  /*
   * Degree of the current residual
   * regular graph.
   */
  degree: number

  /*
   * Contribution already supplied by
   * removed oriented 2-factors.
   */
  fixedOutdegreeContribution: number

  forbiddenSet:
    readonly number[]

  partition: LovaszPair | null

  acrossDirection:
    AcrossDirection | null
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

export function MaLuReference({
  target,
  degree,
  fixedOutdegreeContribution,
  forbiddenSet,
  partition,
  acrossDirection,
}: MaLuReferenceProps) {
  const certificate =
    getMaLuCertificate({
      target,

      degree,

      fixedOutdegreeContribution,

      forbiddenSet,

      partition,

      acrossDirection,
    })

  const subgraph =
    target === 'G'
      ? 'G'
      : target === 'L'
        ? 'G[L]'
        : 'G[R]'

  const isWholeGraph =
    target === 'G'

  const partPointsOut =
    target !== 'G' &&
    acrossDirection !== null &&
    maLuCrossingEdgesPointOut(
      target,
      acrossDirection,
    )

  return (
    <>
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
          be a connected graph and let{' '}
          <Math>
            {
              'F_H:V(H)\\to 2^{\\mathbb N}'
            }
          </Math>
          . Suppose that for every{' '}
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
          For a disconnected graph we
          apply the theorem separately
          to each nontrivial connected
          component. An isolated vertex
          is handled directly: its only
          possible outdegree is{' '}
          <Math>{'0'}</Math>.
        </p>
      </section>

      <section
        style={{
          marginBottom: '32px',
        }}
      >
        <h3>
          Why these hypotheses?
        </h3>

        <p>
          Ma and Lu formulate their
          result using the allowed sets
        </p>

        <div
          style={{
            textAlign: 'center',
            margin: '18px 0',
          }}
        >
          <Math display>
            {
              'H(v)'
              + '='
              + '[0,d_H(v)]'
              + '\\setminus F_H(v).'
            }
          </Math>
        </div>

        <p>
          Their dense condition says
          that whenever an integer is
          forbidden, the next integer is
          allowed. In the language of
          forbidden lists, this is
          exactly the condition that{' '}
          <Math>
            {'F_H(v)'}
          </Math>{' '}
          contains no two consecutive
          integers.
        </p>

        <p>
          Corollary 3.1 then applies
          under the additional bound
        </p>

        <div
          style={{
            textAlign: 'center',
            margin: '18px 0',
          }}
        >
          <Math display>
            {
              '2|F_H(v)|'
              + '\\leq'
              + 'd_H(v)-1.'
            }
          </Math>
        </div>

        <p>
          The playground checks this
          integer inequality directly
          at every relevant vertex
          degree.
        </p>
      </section>

      <section
        style={{
          marginBottom: '32px',
        }}
      >
        <h3>
          Application here
        </h3>

        {isWholeGraph ? (
          <>
            <p>
              The current residual graph
              is{' '}
              <Math>
                {`${degree}`}
              </Math>
              -regular. The already
              oriented part of the
              construction contributes{' '}
              <Math>
                {
                  fixedOutdegreeContribution ===
                  0
                    ? '0'
                    : `+${fixedOutdegreeContribution}`
                }
              </Math>{' '}
              to every final outdegree.
            </p>

            {certificate.checks.map(
              (check) => (
                <div
                  key={
                    check.internalDegree
                  }
                  style={{
                    margin:
                      '18px 0',
                    padding:
                      '14px 16px',
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
                      marginBottom:
                        '10px',
                    }}
                  >
                    The forbidden list
                    on the residual graph
                    is
                  </div>

                  <div
                    style={{
                      textAlign:
                        'center',
                      marginBottom:
                        '12px',
                    }}
                  >
                    <Math display>
                      {
                        `F'_G=${latexSet(
                          check
                            .localForbiddenSet,
                        )}.`
                      }
                    </Math>
                  </div>

                  {check.internalDegree ===
                  0 ? (
                    <div>
                      <CertificateStatus
                        passes={
                          check.passes
                        }
                      />{' '}
                      isolated vertex:{' '}
                      <Math>
                        {
                          `0${
                            check
                              .isolatedVertexSafe
                              ? '\\notin'
                              : '\\in'
                          }F'_G`
                        }
                      </Math>
                    </div>
                  ) : (
                    <>
                      <div
                        style={{
                          marginBottom:
                            '7px',
                        }}
                      >
                        <CertificateStatus
                          passes={
                            check
                              .hasNoConsecutiveValues
                          }
                        />{' '}
                        no two
                        consecutive
                        forbidden values
                      </div>

                      <div>
                        <CertificateStatus
                          passes={
                            check
                              .sizeBoundHolds ===
                            true
                          }
                        />{' '}
                        <Math>
                          {
                            `2|F'_G|`
                            + `=${2 * check.localForbiddenSet.length}`
                            + `\\leq ${check.internalDegree - 1}`
                          }
                        </Math>
                      </div>
                    </>
                  )}
                </div>
              ),
            )}

            <p>
              Thus the Ma–Lu certificate
              for the current graph{' '}
              <strong>
                {certificate.applicable
                  ? 'passes'
                  : 'fails'}
              </strong>
              .
            </p>
          </>
        ) : !certificate.ready ? (
          <p>
            The local forbidden lists
            are not determined yet.
            Orient the edges between{' '}
            <Math>{'L'}</Math> and{' '}
            <Math>{'R'}</Math> first.
            Then the playground can
            translate the original
            forbidden set into the
            correct lists on{' '}
            <Math>{subgraph}</Math>.
          </p>
        ) : (
          <>
            <p>
              We apply Ma–Lu to the
              internal graph{' '}
              <Math>{subgraph}</Math>.
              Write
            </p>

            <div
              style={{
                textAlign: 'center',
                margin: '18px 0',
              }}
            >
              <Math display>
                {
                  `r=d_{${subgraph}}(v).`
                }
              </Math>
            </div>

            {partPointsOut ? (
              <>
                <p>
                  The crossing edges
                  point out of{' '}
                  <Math>{target}</Math>,
                  so a vertex of internal
                  degree{' '}
                  <Math>{'r'}</Math>{' '}
                  already has{' '}
                  <Math>{'d-r'}</Math>{' '}
                  outgoing crossing
                  edges. Including the
                  previously fixed
                  contribution, its final
                  outdegree is
                </p>

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
                      'd^+(v)'
                      + '='
                      + `${fixedOutdegreeContribution}`
                      + '+(d-r)'
                      + `+d_{${subgraph}}^+(v),`
                      + `\\qquad d=${degree}.`
                    }
                  </Math>
                </div>

                <p>
                  Hence the local
                  forbidden list for a
                  vertex of internal
                  degree{' '}
                  <Math>{'r'}</Math>{' '}
                  is
                </p>

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
                      `F_{${target},r}`
                      + '='
                      + '\\{'
                      + `f-${fixedOutdegreeContribution}-(d-r)`
                      + ':f\\in F'
                      + '\\}'
                      + '\\cap[0,r].'
                    }
                  </Math>
                </div>
              </>
            ) : (
              <>
                <p>
                  The crossing edges
                  point into{' '}
                  <Math>{target}</Math>,
                  so they contribute
                  nothing to the
                  outdegree. Thus
                </p>

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
                      'd^+(v)'
                      + '='
                      + `${fixedOutdegreeContribution}`
                      + `+d_{${subgraph}}^+(v).`
                    }
                  </Math>
                </div>

                <p>
                  Therefore the local
                  forbidden list is
                </p>

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
                      `F_{${target},r}`
                      + '='
                      + '\\{'
                      + `f-${fixedOutdegreeContribution}`
                      + ':f\\in F'
                      + '\\}'
                      + '\\cap[0,r].'
                    }
                  </Math>
                </div>
              </>
            )}

            <p>
              The Lovász partition only
              tells us
            </p>

            <div
              style={{
                textAlign: 'center',
                margin: '18px 0',
              }}
            >
              <Math display>
                {
                  `0\\leq r\\leq ${certificate.maxInternalDegree}.`
                }
              </Math>
            </div>

            <p>
              So the website checks
              every possible value of{' '}
              <Math>{'r'}</Math>, rather
              than incorrectly replacing
              every vertex degree by the
              maximum-degree bound.
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
              {certificate.checks.map(
                (check) => (
                  <div
                    key={
                      check.internalDegree
                    }
                    style={{
                      display: 'grid',

                      gridTemplateColumns:
                        '42px 1fr 32px',

                      gap: '10px',

                      alignItems:
                        'center',

                      padding:
                        '10px 12px',

                      borderBottom:
                        check.internalDegree ===
                        certificate
                          .checks
                          .length -
                          1
                          ? 'none'
                          : '1px solid #e2e8f0',

                      background:
                        '#ffffff',
                    }}
                  >
                    <div>
                      <Math>
                        {
                          `r=${check.internalDegree}`
                        }
                      </Math>
                    </div>

                    <div>
                      <Math>
                        {
                          `F_{${target},${check.internalDegree}}`
                          + '='
                          + latexSet(
                            check
                              .localForbiddenSet,
                          )
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
                        {check.internalDegree ===
                        0
                          ? check
                              .isolatedVertexSafe
                            ? 'isolated vertex is safe'
                            : '0 is forbidden'
                          : check
                                .hasNoConsecutiveValues &&
                              check
                                .sizeBoundHolds
                            ? `no consecutive values; 2|F|=${2 * check.localForbiddenSet.length} ≤ ${check.internalDegree - 1}`
                            : !check
                                .hasNoConsecutiveValues
                              ? 'contains consecutive forbidden values'
                              : `size bound fails: 2|F|=${2 * check.localForbiddenSet.length} > ${check.internalDegree - 1}`}
                      </div>
                    </div>

                    <CertificateStatus
                      passes={
                        check.passes
                      }
                    />
                  </div>
                ),
              )}
            </div>

            <p
              style={{
                marginTop: '18px',
              }}
            >
              Therefore the Ma–Lu
              certificate for{' '}
              <Math>{subgraph}</Math>{' '}
              <strong>
                {certificate.applicable
                  ? 'passes'
                  : 'fails'}
              </strong>
              .
            </p>
          </>
        )}
      </section>

      <section>
        <h3>Reference</h3>

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
          This tool intentionally
          implements Corollary 3.1 as
          stated in the body of the
          paper. In particular, the
          playground checks{' '}
          <Math>
            {
              '2|F(v)|\\leq d(v)-1'
            }
          </Math>
          . It does not use the broader
          bound appearing in the
          abstract.
        </p>
      </section>
    </>
  )
}