import {
  useState,
} from 'react'
import Math from '../components/Math'
import {
  getCaseGroupsForDegree,
  playgroundDegrees,
  type PlaygroundDegree,
} from '../cases/playgroundCases'
import {
  formatAuditTime,
  runAuditForDegree,
} from './auditRunner'
import AuditCaseResults from './AuditCaseResults'
import type {
  AuditDegreeResult,
} from './proofRecipes'

type CompletenessAuditProps = {
  onHome: () => void
}

export default function CompletenessAudit({
  onHome,
}: CompletenessAuditProps) {
  const [
    selectedDegree,
    setSelectedDegree,
  ] =
    useState<PlaygroundDegree | null>(
      null,
    )

  const [
    auditResult,
    setAuditResult,
  ] =
    useState<AuditDegreeResult | null>(
      null,
    )

  const caseGroups =
    selectedDegree ===
    null
      ? []
      : getCaseGroupsForDegree(
          selectedDegree,
        )

  function chooseDegree(
    degree:
      PlaygroundDegree,
  ) {
    setSelectedDegree(
      degree,
    )

    setAuditResult(
      null,
    )
  }

  function runAudit() {
    if (
      selectedDegree ===
      null
    ) {
      return
    }

    const result =
      runAuditForDegree({
        degree:
          selectedDegree,
      })

    setAuditResult(
      result,
    )
  }

  const auditComplete =
    auditResult !==
      null &&
    auditResult
      .unresolvedCases ===
      0 &&
    auditResult
      .searchLimitedCases ===
      0

  return (
    <main
      style={{
        minHeight:
          '100vh',

        padding:
          '54px 30px 80px',

        background:
          'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
      }}
    >
      <div
        style={{
          maxWidth:
            '1000px',

          margin:
            '0 auto',
        }}
      >
        <button
          type="button"
          onClick={
            onHome
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

            marginBottom:
              '54px',
          }}
        >
          ⌂ Home
        </button>

        <div
          style={{
            textAlign:
              'center',
          }}
        >
          <div
            style={{
              marginBottom:
                '10px',

              color:
                '#64748b',

              fontSize:
                '19px',
            }}
          >
            Proof census for regular graphs
          </div>

          <h1
            style={{
              margin:
                '0 0 18px',

              fontSize:
                '46px',

              fontWeight:
                500,

              color:
                '#1e293b',
            }}
          >
            Completeness Audit
          </h1>

          <p
            style={{
              maxWidth:
                '720px',

              margin:
                '0 auto',

              color:
                '#64748b',

              fontSize:
                '20px',

              lineHeight:
                1.6,
            }}
          >
            Determine which forbidden sets{' '}

            <Math>
              {'F'}
            </Math>{' '}

            are certified by the current
            orientation toolkit for regular
            graphs with{' '}

            <Math>
              {'d\\leq 14'}
            </Math>
            . Search-limited cases are kept
            separate from genuinely
            exhausted cases.
          </p>
        </div>

        <div
          style={{
            marginTop:
              '48px',

            textAlign:
              'center',
          }}
        >
          <div
            style={{
              marginBottom:
                '18px',

              color:
                '#475569',

              fontSize:
                '20px',
            }}
          >
            Choose the degree
          </div>

          <div
            style={{
              display:
                'flex',

              justifyContent:
                'center',

              gap:
                '14px',

              flexWrap:
                'wrap',
            }}
          >
            {playgroundDegrees.map(
              (
                degree,
              ) => {
                const selected =
                  degree ===
                  selectedDegree

                return (
                  <button
                    key={
                      degree
                    }
                    type="button"
                    onClick={() =>
                      chooseDegree(
                        degree,
                      )
                    }
                    style={{
                      font:
                        'inherit',

                      width:
                        '92px',

                      height:
                        '66px',

                      border:
                        selected
                          ? '1px solid #475569'
                          : '1px solid #cbd5e1',

                      borderRadius:
                        '11px',

                      background:
                        selected
                          ? '#334155'
                          : '#ffffff',

                      color:
                        selected
                          ? '#ffffff'
                          : '#334155',

                      cursor:
                        'pointer',

                      fontSize:
                        '23px',

                      boxShadow:
                        selected
                          ? '0 7px 18px rgba(15, 23, 42, 0.13)'
                          : '0 4px 12px rgba(15, 23, 42, 0.04)',
                    }}
                  >
                    <Math>
                      {
                        `d=${degree}`
                      }
                    </Math>
                  </button>
                )
              },
            )}
          </div>
        </div>

        {selectedDegree !==
          null && (
          <div
            style={{
              maxWidth:
                '820px',

              margin:
                '42px auto 0',

              padding:
                '30px 34px',

              border:
                '1px solid #dbe3ec',

              borderRadius:
                '14px',

              background:
                '#ffffff',

              boxShadow:
                '0 6px 20px rgba(15, 23, 42, 0.05)',
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
                    '#334155',

                  fontSize:
                    '25px',

                  marginBottom:
                    '8px',
                }}
              >
                <Math>
                  {
                    `${selectedDegree}`
                  }
                </Math>
                -regular audit
              </div>

              <div
                style={{
                  color:
                    '#64748b',

                  fontSize:
                    '18px',
                }}
              >
                <Math>
                  {
                    `${caseGroups.length}`
                  }
                </Math>{' '}

                reversal classes to audit
              </div>
            </div>

            {auditResult ===
              null && (
              <div
                style={{
                  marginTop:
                    '28px',

                  paddingTop:
                    '24px',

                  borderTop:
                    '1px solid #e2e8f0',

                  textAlign:
                    'center',
                }}
              >
                <button
                  type="button"
                  onClick={
                    runAudit
                  }
                  style={{
                    font:
                      'inherit',

                    fontSize:
                      '20px',

                    padding:
                      '12px 24px',

                    border:
                      '1px solid #475569',

                    borderRadius:
                      '10px',

                    background:
                      '#334155',

                    color:
                      '#ffffff',

                    cursor:
                      'pointer',

                    boxShadow:
                      '0 7px 18px rgba(15, 23, 42, 0.12)',
                  }}
                >
                  Run audit →
                </button>

                <div
                  style={{
                    marginTop:
                      '13px',

                    color:
                      '#94a3b8',

                    fontSize:
                      '16px',
                  }}
                >
                  Best-first search through
                  the current encoded proof
                  toolkit.
                </div>
              </div>
            )}

            {auditResult !==
              null && (
              <div
                style={{
                  marginTop:
                    '28px',

                  paddingTop:
                    '26px',

                  borderTop:
                    '1px solid #e2e8f0',
                }}
              >
                <div
                  style={{
                    display:
                      'grid',

                    gridTemplateColumns:
                      'repeat(4, 1fr)',

                    gap:
                      '12px',

                    marginBottom:
                      '24px',
                  }}
                >
                  <div
                    style={{
                      padding:
                        '16px 10px',

                      border:
                        '1px solid #bbd7c7',

                      borderRadius:
                        '10px',

                      background:
                        '#f7fbf8',

                      textAlign:
                        'center',
                    }}
                  >
                    <div
                      style={{
                        fontSize:
                          '28px',

                        color:
                          '#2f6f4e',

                        marginBottom:
                          '4px',
                      }}
                    >
                      {
                        auditResult
                          .provedCases
                      }
                    </div>

                    <div
                      style={{
                        color:
                          '#52705f',

                        fontSize:
                          '16px',
                      }}
                    >
                      Proved
                    </div>
                  </div>

                  <div
                    style={{
                      padding:
                        '16px 10px',

                      border:
                        auditResult
                          .unresolvedCases >
                        0
                          ? '1px solid #e3b8b8'
                          : '1px solid #bbd7c7',

                      borderRadius:
                        '10px',

                      background:
                        auditResult
                          .unresolvedCases >
                        0
                          ? '#fffafa'
                          : '#f7fbf8',

                      textAlign:
                        'center',
                    }}
                  >
                    <div
                      style={{
                        fontSize:
                          '28px',

                        color:
                          auditResult
                            .unresolvedCases >
                          0
                            ? '#9f4444'
                            : '#2f6f4e',

                        marginBottom:
                          '4px',
                      }}
                    >
                      {
                        auditResult
                          .unresolvedCases
                      }
                    </div>

                    <div
                      style={{
                        color:
                          auditResult
                            .unresolvedCases >
                          0
                            ? '#885858'
                            : '#52705f',

                        fontSize:
                          '16px',
                      }}
                    >
                      Exhausted
                    </div>
                  </div>

                  <div
                    style={{
                      padding:
                        '16px 10px',

                      border:
                        auditResult
                          .searchLimitedCases >
                        0
                          ? '1px solid #e7c98d'
                          : '1px solid #bbd7c7',

                      borderRadius:
                        '10px',

                      background:
                        auditResult
                          .searchLimitedCases >
                        0
                          ? '#fffdf7'
                          : '#f7fbf8',

                      textAlign:
                        'center',
                    }}
                  >
                    <div
                      style={{
                        fontSize:
                          '28px',

                        color:
                          auditResult
                            .searchLimitedCases >
                          0
                            ? '#8a6723'
                            : '#2f6f4e',

                        marginBottom:
                          '4px',
                      }}
                    >
                      {
                        auditResult
                          .searchLimitedCases
                      }
                    </div>

                    <div
                      style={{
                        color:
                          auditResult
                            .searchLimitedCases >
                          0
                            ? '#8a7448'
                            : '#52705f',

                        fontSize:
                          '16px',
                      }}
                    >
                      Search-limited
                    </div>
                  </div>

                  <div
                    style={{
                      padding:
                        '16px 10px',

                      border:
                        '1px solid #dbe3ec',

                      borderRadius:
                        '10px',

                      background:
                        '#f8fafc',

                      textAlign:
                        'center',
                    }}
                  >
                    <div
                      style={{
                        fontSize:
                          '23px',

                        color:
                          '#334155',

                        marginBottom:
                          '4px',
                      }}
                    >
                      {
                        formatAuditTime(
                          auditResult
                            .elapsedMs,
                        )
                      }
                    </div>

                    <div
                      style={{
                        color:
                          '#64748b',

                        fontSize:
                          '16px',
                      }}
                    >
                      Runtime
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    padding:
                      '18px 20px',

                    border:
                      auditComplete
                        ? '1px solid #9fc7af'
                        : auditResult
                            .searchLimitedCases >
                          0
                          ? '1px solid #e7c98d'
                          : '1px solid #e0b2b2',

                    borderRadius:
                      '10px',

                    background:
                      auditComplete
                        ? '#f5faf7'
                        : auditResult
                            .searchLimitedCases >
                          0
                          ? '#fffdf7'
                          : '#fffafa',

                    textAlign:
                      'center',

                    color:
                      auditComplete
                        ? '#2f6f4e'
                        : auditResult
                            .searchLimitedCases >
                          0
                          ? '#8a6723'
                          : '#8b4545',

                    fontSize:
                      '20px',

                    lineHeight:
                      1.5,
                  }}
                >
                  {auditComplete ? (
                    <>
                      All{' '}

                      <Math>
                        {
                          `${auditResult.totalCases}`
                        }
                      </Math>{' '}

                      reversal classes are
                      certified by the current
                      toolkit.
                    </>
                  ) : auditResult
                      .searchLimitedCases >
                    0 ? (
                    <>
                      <Math>
                        {
                          `${auditResult.provedCases}`
                        }
                      </Math>{' '}

                      of{' '}

                      <Math>
                        {
                          `${auditResult.totalCases}`
                        }
                      </Math>{' '}

                      classes are certified.
                      The remaining search-limited
                      cases are not being called
                      mathematically unresolved.
                    </>
                  ) : (
                    <>
                      <Math>
                        {
                          `${auditResult.provedCases}`
                        }
                      </Math>{' '}

                      of{' '}

                      <Math>
                        {
                          `${auditResult.totalCases}`
                        }
                      </Math>{' '}

                      reversal classes are
                      certified; the remaining{' '}

                      <Math>
                        {
                          `${auditResult.unresolvedCases}`
                        }
                      </Math>{' '}

                      were exhaustively searched
                      by the current encoded
                      toolkit.
                    </>
                  )}
                </div>

                <AuditCaseResults
                  cases={
                    auditResult.cases
                  }
                />

                <div
                  style={{
                    marginTop:
                      '26px',

                    paddingTop:
                      '20px',

                    borderTop:
                      '1px solid #e2e8f0',

                    textAlign:
                      'center',
                  }}
                >
                  <button
                    type="button"
                    onClick={
                      runAudit
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

                      cursor:
                        'pointer',

                      padding:
                        '0 1px 2px',
                    }}
                  >
                    Run again
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
