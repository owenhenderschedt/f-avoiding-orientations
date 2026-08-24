import {
  useState,
} from 'react'
import Math from '../components/Math'
import type {
  AuditCaseResult,
} from './proofRecipes'

type AuditCaseResultsProps = {
  cases:
    readonly AuditCaseResult[]
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

export default function AuditCaseResults({
  cases,
}: AuditCaseResultsProps) {
  const unresolved =
    cases.filter(
      (result) =>
        result.status ===
        'unresolved',
    )

  const proved =
    cases.filter(
      (result) =>
        result.status ===
        'proved',
    )

  const [
    unresolvedOpen,
    setUnresolvedOpen,
  ] =
    useState(false)

  const [
    provedOpen,
    setProvedOpen,
  ] =
    useState(false)

  return (
    <div
      style={{
        marginTop:
          '28px',
      }}
    >
      {/* UNRESOLVED */}

      {unresolved.length >
        0 && (
        <section
          style={{
            marginBottom:
              '16px',

            border:
              '1px solid #e3b8b8',

            borderRadius:
              '10px',

            background:
              '#fffafa',

            overflow:
              'hidden',
          }}
        >
          <button
            type="button"
            onClick={() =>
              setUnresolvedOpen(
                (open) =>
                  !open,
              )
            }
            style={{
              width:
                '100%',

              display:
                'flex',

              alignItems:
                'center',

              justifyContent:
                'space-between',

              gap:
                '16px',

              padding:
                '14px 16px',

              border:
                'none',

              background:
                'transparent',

              font:
                'inherit',

              cursor:
                'pointer',

              color:
                '#8b4545',
            }}
          >
            <span
              style={{
                fontSize:
                  '19px',

                fontWeight:
                  600,
              }}
            >
              Unresolved by the current toolkit{' '}

              <span
                style={{
                  color:
                    '#a96a6a',

                  fontWeight:
                    400,
                }}
              >
                ({unresolved.length})
              </span>
            </span>

            <span
              style={{
                color:
                  '#a96a6a',

                fontSize:
                  '18px',
              }}
            >
              {unresolvedOpen
                ? '▾'
                : '▸'}
            </span>
          </button>

          {unresolvedOpen && (
            <div
              style={{
                display:
                  'flex',

                flexWrap:
                  'wrap',

                gap:
                  '9px',

                padding:
                  '2px 16px 16px',
              }}
            >
              {unresolved.map(
                (
                  result,
                ) => (
                  <div
                    key={
                      result
                        .forbiddenSet
                        .join('-')
                    }
                    style={{
                      padding:
                        '8px 12px',

                      border:
                        '1px solid #e3b8b8',

                      borderRadius:
                        '8px',

                      background:
                        '#ffffff',

                      color:
                        '#8b4545',

                      fontSize:
                        '18px',
                    }}
                  >
                    <Math>
                      {
                        latexSet(
                          result
                            .forbiddenSet,
                        )
                      }
                    </Math>
                  </div>
                ),
              )}
            </div>
          )}
        </section>
      )}

      {/* CERTIFIED */}

      {proved.length >
        0 && (
        <section
          style={{
            border:
              '1px solid #bbd7c7',

            borderRadius:
              '10px',

            background:
              '#f7fbf8',

            overflow:
              'hidden',
          }}
        >
          <button
            type="button"
            onClick={() =>
              setProvedOpen(
                (open) =>
                  !open,
              )
            }
            style={{
              width:
                '100%',

              display:
                'flex',

              alignItems:
                'center',

              justifyContent:
                'space-between',

              gap:
                '16px',

              padding:
                '14px 16px',

              border:
                'none',

              background:
                'transparent',

              font:
                'inherit',

              cursor:
                'pointer',

              color:
                '#2f6f4e',
            }}
          >
            <span
              style={{
                fontSize:
                  '19px',

                fontWeight:
                  600,
              }}
            >
              Certified{' '}

              <span
                style={{
                  color:
                    '#6f8f7c',

                  fontWeight:
                    400,
                }}
              >
                ({proved.length})
              </span>
            </span>

            <span
              style={{
                color:
                  '#6f8f7c',

                fontSize:
                  '18px',
              }}
            >
              {provedOpen
                ? '▾'
                : '▸'}
            </span>
          </button>

          {provedOpen && (
            <div
              style={{
                display:
                  'flex',

                flexWrap:
                  'wrap',

                gap:
                  '9px',

                padding:
                  '2px 16px 16px',
              }}
            >
              {proved.map(
                (
                  result,
                ) => (
                  <div
                    key={
                      result
                        .forbiddenSet
                        .join('-')
                    }
                    style={{
                      padding:
                        '8px 12px',

                      border:
                        '1px solid #bbd7c7',

                      borderRadius:
                        '8px',

                      background:
                        '#ffffff',

                      color:
                        '#2f6f4e',

                      fontSize:
                        '18px',
                    }}
                  >
                    <Math>
                      {
                        latexSet(
                          result
                            .forbiddenSet,
                        )
                      }
                    </Math>
                  </div>
                ),
              )}
            </div>
          )}
        </section>
      )}
    </div>
  )
}