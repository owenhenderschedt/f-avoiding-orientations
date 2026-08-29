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

function CaseChip({
  result,
  border,
  color,
}: {
  result:
    AuditCaseResult

  border:
    string

  color:
    string
}) {
  return (
    <div
      style={{
        padding:
          '8px 12px',

        border,

        borderRadius:
          '8px',

        background:
          '#ffffff',

        color,

        fontSize:
          '18px',
      }}
      title={
        `${result.expandedStates.toLocaleString()} expanded, `
        + `${result.generatedStates.toLocaleString()} generated`
      }
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
  )
}

export default function AuditCaseResults({
  cases,
}: AuditCaseResultsProps) {
  const unresolved =
    cases.filter(
      (result) =>
        result.status ===
          'unresolved' &&
        result.reason ===
          'exhausted',
    )

  const searchLimited =
    cases.filter(
      (result) =>
        result.status ===
          'unresolved' &&
        result.reason ===
          'search-limit',
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
    searchLimitedOpen,
    setSearchLimitedOpen,
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
      {/* SEARCH-LIMITED */}

      {searchLimited.length >
        0 && (
        <section
          style={{
            marginBottom:
              '16px',

            border:
              '1px solid #e7c98d',

            borderRadius:
              '10px',

            background:
              '#fffdf7',

            overflow:
              'hidden',
          }}
        >
          <button
            type="button"
            onClick={() =>
              setSearchLimitedOpen(
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
                '#8a6723',
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
              Search limit reached{' '}

              <span
                style={{
                  color:
                    '#a28448',

                  fontWeight:
                    400,
                }}
              >
                ({searchLimited.length})
              </span>
            </span>

            <span
              style={{
                color:
                  '#a28448',

                fontSize:
                  '18px',
              }}
            >
              {searchLimitedOpen
                ? '▾'
                : '▸'}
            </span>
          </button>

          {searchLimitedOpen && (
            <>
              <div
                style={{
                  padding:
                    '0 16px 12px',

                  color:
                    '#8a7448',

                  fontSize:
                    '15px',

                  lineHeight:
                    1.45,
                }}
              >
                These are not mathematical
                failures. Their search
                frontiers were still nonempty
                when the per-case expansion
                budget was reached.
              </div>

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
                {searchLimited.map(
                  (
                    result,
                  ) => (
                    <CaseChip
                      key={
                        result
                          .forbiddenSet
                          .join('-')
                      }
                      result={
                        result
                      }
                      border={
                        '1px solid #e7c98d'
                      }
                      color={
                        '#8a6723'
                      }
                    />
                  ),
                )}
              </div>
            </>
          )}
        </section>
      )}

      {/* GENUINELY EXHAUSTED */}

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
              Unresolved after exhaustive search{' '}

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
                  <CaseChip
                    key={
                      result
                        .forbiddenSet
                        .join('-')
                    }
                    result={
                      result
                    }
                    border={
                      '1px solid #e3b8b8'
                    }
                    color={
                      '#8b4545'
                    }
                  />
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
                  <CaseChip
                    key={
                      result
                        .forbiddenSet
                        .join('-')
                    }
                    result={
                      result
                    }
                    border={
                      '1px solid #bbd7c7'
                    }
                    color={
                      '#2f6f4e'
                    }
                  />
                ),
              )}
            </div>
          )}
        </section>
      )}
    </div>
  )
}
