import { useState } from 'react'
import Math from './components/Math'
import BlobLab from './labs/BlobLab'
import ForbiddenSetFilter, {
  emptyForbiddenSetFilter,
  type ForbiddenSetFilterState,
} from './components/ForbiddenSetFilter'
import {
  getCaseGroupsForDegree,
  playgroundDegrees,
  type PlaygroundDegree,
} from './cases/playgroundCases'

type AppScreen =
  | 'home'
  | 'degree'
  | 'cases'
  | 'playground'

type SelectedCase = {
  degree: PlaygroundDegree
  forbiddenSet: readonly number[]
}

function forbiddenSetLatex(
  forbiddenSet: readonly number[],
) {
  return `\\{${forbiddenSet.join(',')}\\}`
}

/*
 * Returns true exactly when F contains
 * two consecutive integers.
 *
 * Thus a list such as {2,6,8} returns
 * false and is a Ma-Lu case, while
 * {2,3,8} returns true.
 */
function hasConsecutiveValues(
  forbiddenSet: readonly number[],
) {
  return forbiddenSet.some(
    (value) =>
      forbiddenSet.includes(
        value + 1,
      ),
  )
}

function forbiddenSetMatchesFilter(
  forbiddenSet: readonly number[],
  filter: ForbiddenSetFilterState,
) {
  const includesEverything =
    filter.mustInclude.every(
      (value) =>
        forbiddenSet.includes(value),
    )

  const excludesEverything =
    filter.mustExclude.every(
      (value) =>
        !forbiddenSet.includes(value),
    )

  const passesMaLuFilter =
    !filter.hideMaLuCases ||
    hasConsecutiveValues(
      forbiddenSet,
    )

  return (
    includesEverything &&
    excludesEverything &&
    passesMaLuFilter
  )
}

function App() {
  const [
    screen,
    setScreen,
  ] = useState<AppScreen>('home')

  const [
    selectedDegree,
    setSelectedDegree,
  ] =
    useState<PlaygroundDegree | null>(
      null,
    )

  const [
    selectedCase,
    setSelectedCase,
  ] =
    useState<SelectedCase | null>(
      null,
    )

  const [
    forbiddenSetFilter,
    setForbiddenSetFilter,
  ] =
    useState<ForbiddenSetFilterState>(
      emptyForbiddenSetFilter(),
    )

  const [
    reversalExplanationOpen,
    setReversalExplanationOpen,
  ] = useState(false)

  function goHome() {
    setScreen('home')
    setSelectedDegree(null)
    setSelectedCase(null)
    setReversalExplanationOpen(false)

    setForbiddenSetFilter(
      emptyForbiddenSetFilter(),
    )
  }

  function chooseDegree(
    degree: PlaygroundDegree,
  ) {
    setSelectedDegree(degree)
    setSelectedCase(null)
    setReversalExplanationOpen(false)

    setForbiddenSetFilter(
      emptyForbiddenSetFilter(),
    )

    setScreen('cases')
  }

  function chooseCase(
    degree: PlaygroundDegree,
    forbiddenSet: readonly number[],
  ) {
    setSelectedCase({
      degree,
      forbiddenSet,
    })

    setScreen('playground')
  }

  if (
    screen === 'playground' &&
    selectedCase !== null
  ) {
    return (
      <BlobLab
        degree={
          selectedCase.degree
        }
        forbiddenSet={
          selectedCase.forbiddenSet
        }
        onBackToCases={() => {
          setScreen('cases')
          setSelectedCase(null)
        }}
        onHome={goHome}
      />
    )
  }

  if (
    screen === 'cases' &&
    selectedDegree !== null
  ) {
    const groups =
      getCaseGroupsForDegree(
        selectedDegree,
      )

    /*
     * Individual-list mode:
     *
     * Keep the reversal class if at
     * least one member satisfies the
     * filter.
     *
     * Entire-pair mode:
     *
     * Keep the reversal class only if
     * every member satisfies the
     * filter.
     */
    const filteredGroups =
      groups.filter(
        (group) => {
          const matches =
            group.options.map(
              (option) =>
                forbiddenSetMatchesFilter(
                  option.forbiddenSet,
                  forbiddenSetFilter,
                ),
            )

          if (
            forbiddenSetFilter
              .matchMode === 'pair'
          ) {
            return matches.every(
              Boolean,
            )
          }

          return matches.some(
            Boolean,
          )
        },
      )

    const hasActiveFilters =
      forbiddenSetFilter
        .mustInclude.length > 0 ||
      forbiddenSetFilter
        .mustExclude.length > 0 ||
      forbiddenSetFilter
        .hideMaLuCases

    return (
      <main
        style={{
          minHeight: '100vh',
          padding:
            '54px 30px 80px',
          background:
            'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
        }}
      >
        <div
          style={{
            maxWidth: '1180px',
            margin: '0 auto',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent:
                'space-between',
              marginBottom: '34px',
            }}
          >
            <button
              type="button"
              onClick={() =>
                setScreen('degree')
              }
              style={{
                font: 'inherit',
                border: 'none',
                background:
                  'transparent',
                color: '#64748b',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              ← Choose another degree
            </button>

            <button
              type="button"
              onClick={goHome}
              style={{
                font: 'inherit',
                border: 'none',
                background:
                  'transparent',
                color: '#64748b',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              ⌂ Home
            </button>
          </div>

          <div
            style={{
              textAlign: 'center',
              marginBottom: '36px',
            }}
          >
            <div
              style={{
                color: '#64748b',
                fontSize: '19px',
                marginBottom: '8px',
              }}
            >
              <Math>
                {`${selectedDegree}`}
              </Math>
              -regular graphs
            </div>

            <h1
              style={{
                margin:
                  '0 0 18px',
                fontSize: '42px',
                fontWeight: 500,
                color: '#1e293b',
              }}
            >
              Choose a forbidden set{' '}
              <Math>{'F'}</Math>
            </h1>

            <button
              type="button"
              aria-expanded={
                reversalExplanationOpen
              }
              onClick={() =>
                setReversalExplanationOpen(
                  (current) =>
                    !current,
                )
              }
              style={{
                font: 'inherit',
                fontSize: '19px',
                color: '#475569',
                background: '#ffffff',
                border:
                  '1px solid #cbd5e1',
                borderRadius: '10px',
                padding: '9px 15px',
                cursor: 'pointer',
                boxShadow:
                  '0 3px 10px rgba(15, 23, 42, 0.04)',
              }}
            >
              Why do forbidden lists
              come in pairs?{' '}
              {reversalExplanationOpen
                ? '▴'
                : '▾'}
            </button>

            {reversalExplanationOpen && (
              <div
                style={{
                  maxWidth: '720px',
                  margin:
                    '22px auto 0',
                  color: '#64748b',
                  lineHeight: 1.6,
                  fontSize: '19px',
                }}
              >
                <p
                  style={{
                    margin:
                      '0 0 12px',
                  }}
                >
                  Forbidden sets occur in
                  reversal pairs. If{' '}
                  <Math>{'O'}</Math> is an{' '}
                  <Math>
                    {
                      'F=\\{x_1,\\ldots,x_k\\}'
                    }
                  </Math>
                  -avoiding orientation of a{' '}
                  <Math>{'d'}</Math>-regular
                  graph and every arc is
                  reversed, the resulting
                  orientation{' '}
                  <Math>{'O\''}</Math>{' '}
                  satisfies
                </p>

                <div
                  style={{
                    margin:
                      '16px 0',
                  }}
                >
                  <Math display>
                    {
                      'd_{O\'}^+(v)'
                      + '='
                      + 'd-d_O^+(v).'
                    }
                  </Math>
                </div>

                <p
                  style={{
                    margin: 0,
                  }}
                >
                  Therefore{' '}
                  <Math>{'O\''}</Math> avoids
                  the reversed forbidden set
                </p>

                <div
                  style={{
                    margin:
                      '16px 0 0',
                  }}
                >
                  <Math display>
                    {
                      'd-F'
                      + '='
                      + '\\{'
                      + 'd-x_1,\\ldots,d-x_k'
                      + '\\}.'
                    }
                  </Math>
                </div>
              </div>
            )}
          </div>

          <ForbiddenSetFilter
            degree={
              selectedDegree
            }
            totalCount={
              groups.length
            }
            filteredCount={
              filteredGroups.length
            }
            value={
              forbiddenSetFilter
            }
            onChange={
              setForbiddenSetFilter
            }
          />

          {filteredGroups.length >
          0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '12px',
                alignItems:
                  'stretch',
              }}
            >
              {filteredGroups.map(
                (group) => (
                  <div
                    key={group.id}
                    style={{
                      minHeight: '68px',
                      padding:
                        '12px 14px',
                      border:
                        '1px solid #dbe3ec',
                      borderRadius:
                        '10px',
                      background:
                        '#ffffff',
                      boxShadow:
                        '0 4px 14px rgba(15, 23, 42, 0.04)',
                      display: 'flex',
                      alignItems:
                        'center',
                      justifyContent:
                        'center',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems:
                          'center',
                        justifyContent:
                          'center',
                        gap: '10px',
                        flexWrap:
                          'nowrap',
                        width: '100%',
                      }}
                    >
                      {group.options.map(
                        (
                          option,
                          index,
                        ) => {
                          const matches =
                            forbiddenSetMatchesFilter(
                              option
                                .forbiddenSet,
                              forbiddenSetFilter,
                            )

                          const muted =
                            forbiddenSetFilter
                              .matchMode ===
                              'individual' &&
                            hasActiveFilters &&
                            !matches

                          return (
                            <div
                              key={
                                option
                                  .forbiddenSet
                                  .join('-')
                              }
                              style={{
                                display:
                                  'flex',
                                alignItems:
                                  'center',
                                gap:
                                  '10px',
                              }}
                            >
                              {index >
                                0 && (
                                <span
                                  style={{
                                    color:
                                      '#94a3b8',
                                    fontSize:
                                      '22px',
                                    lineHeight:
                                      1,
                                  }}
                                >
                                  ↔
                                </span>
                              )}

                              <button
                                type="button"
                                onClick={() =>
                                  chooseCase(
                                    selectedDegree,
                                    option
                                      .forbiddenSet,
                                  )
                                }
                                style={{
                                  font:
                                    'inherit',
                                  fontSize:
                                    '19px',
                                  padding:
                                    '5px 3px',
                                  border:
                                    'none',
                                  background:
                                    'transparent',
                                  color:
                                    muted
                                      ? '#a8b3c1'
                                      : '#334155',
                                  opacity:
                                    muted
                                      ? 0.62
                                      : 1,
                                  cursor:
                                    'pointer',
                                  whiteSpace:
                                    'nowrap',
                                }}
                              >
                                <Math>
                                  {forbiddenSetLatex(
                                    option
                                      .forbiddenSet,
                                  )}
                                </Math>
                              </button>
                            </div>
                          )
                        },
                      )}
                    </div>
                  </div>
                ),
              )}
            </div>
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding:
                  '54px 20px',
                color: '#64748b',
                border:
                  '1px solid #e2e8f0',
                borderRadius:
                  '12px',
                background:
                  '#ffffff',
              }}
            >
              No forbidden sets match
              these filters.
            </div>
          )}

          <div
            style={{
              textAlign: 'center',
              marginTop: '30px',
              color: '#64748b',
              fontSize: '18px',
            }}
          >
            Click any forbidden set to
            open it in the playground.
          </div>
        </div>
      </main>
    )
  }

  if (screen === 'degree') {
    return (
      <main
        style={{
          minHeight: '100vh',
          padding: '70px 30px',
          background:
            'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
        }}
      >
        <div
          style={{
            maxWidth: '820px',
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          <button
            type="button"
            onClick={() =>
              setScreen('home')
            }
            style={{
              display: 'block',
              font: 'inherit',
              border: 'none',
              background:
                'transparent',
              color: '#64748b',
              cursor: 'pointer',
              padding: 0,
              marginBottom: '54px',
            }}
          >
            ⌂ Home
          </button>

          <h1
            style={{
              margin:
                '0 0 14px',
              fontSize: '44px',
              fontWeight: 500,
              color: '#1e293b',
            }}
          >
            Choose the degree
          </h1>

          <p
            style={{
              color: '#64748b',
              margin:
                '0 0 42px',
            }}
          >
            Select the regularity of
            the graph you want to
            explore.
          </p>

          <div
            style={{
              display: 'flex',
              justifyContent:
                'center',
              gap: '18px',
              flexWrap: 'wrap',
            }}
          >
            {playgroundDegrees.map(
              (degree) => (
                <button
                  key={degree}
                  type="button"
                  onClick={() =>
                    chooseDegree(
                      degree,
                    )
                  }
                  style={{
                    font: 'inherit',
                    width: '104px',
                    height: '82px',
                    border:
                      '1px solid #cbd5e1',
                    borderRadius:
                      '13px',
                    background:
                      '#ffffff',
                    color:
                      '#334155',
                    cursor:
                      'pointer',
                    fontSize:
                      '27px',
                    boxShadow:
                      '0 7px 20px rgba(15, 23, 42, 0.06)',
                  }}
                >
                  <Math>
                    {`d=${degree}`}
                  </Math>
                </button>
              ),
            )}
          </div>
        </div>
      </main>
    )
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 28px',
        background:
          'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '900px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            marginBottom: '18px',
            color: '#64748b',
            fontSize: '20px',
          }}
        >
          Orientations avoiding
          forbidden outdegrees
        </div>

        <h1
          style={{
            margin: '0 0 24px',
            fontSize: '58px',
            fontWeight: 500,
            color: '#1e293b',
            letterSpacing:
              '-0.02em',
          }}
        >
          <Math>{'F'}</Math>-Avoiding
          Orientations
        </h1>

        <p
          style={{
            maxWidth: '640px',
            margin:
              '0 auto 50px',
            color: '#64748b',
            lineHeight: 1.6,
            fontSize: '21px',
          }}
        >
          Build an orientation one
          mathematical move at a time
          and watch the possible
          outdegrees evolve.
        </p>

        <button
          type="button"
          onClick={() =>
            setScreen('degree')
          }
          style={{
            font: 'inherit',
            fontSize: '27px',
            padding: '22px 38px',
            border:
              '1px solid #475569',
            borderRadius: '15px',
            background: '#334155',
            color: '#ffffff',
            cursor: 'pointer',
            boxShadow:
              '0 14px 32px rgba(15, 23, 42, 0.16)',
          }}
        >
          <Math>{'d'}</Math>-regular
          playground →
        </button>
      </div>
    </main>
  )
}

export default App