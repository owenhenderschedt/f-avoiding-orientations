import {
  useMemo,
  useState,
} from 'react'
import Math from '../components/Math'
import ForbiddenSetFilter, {
  emptyForbiddenSetFilter,
  type ForbiddenSetFilterState,
} from '../components/ForbiddenSetFilter'
import {
  getWarehouseCasesForDegree,
} from './data'
import {
  warehouseSubtitle,
  warehouseTitle,
} from './config'
import type {
  WarehouseCaseRecord,
  WarehouseDegree,
} from './types'
import {
  compareForbiddenSets,
} from './utils/forbiddenSet'
import {
  filterWarehouseCases,
} from './utils/warehouseFilters'
import WarehouseDegreeSelector from './components/WarehouseDegreeSelector'
import WarehouseCaseCard from './components/WarehouseCaseCard'
import WarehouseCaseDetail from './components/WarehouseCaseDetail'
import WarehouseToolReferencePanel, {
  type WarehouseActiveReference,
} from './components/WarehouseToolReferencePanel'

type ProofWarehouseProps = {
  onHome:
    () => void
}

export default function ProofWarehouse({
  onHome,
}: ProofWarehouseProps) {
  const [
    selectedDegree,
    setSelectedDegree,
  ] =
    useState<WarehouseDegree | null>(
      12,
    )

  const [
    selectedCase,
    setSelectedCase,
  ] =
    useState<WarehouseCaseRecord | null>(
      null,
    )

  const [
    activeReference,
    setActiveReference,
  ] =
    useState<WarehouseActiveReference>(
      null,
    )

  const [
    forbiddenSetFilter,
    setForbiddenSetFilter,
  ] =
    useState<ForbiddenSetFilterState>(
      emptyForbiddenSetFilter(),
    )

  const allCases =
    useMemo(
      () => {
        if (
          selectedDegree ===
          null
        ) {
          return []
        }

        return [
          ...getWarehouseCasesForDegree(
            selectedDegree,
          ),
        ].sort(
          (
            first,
            second,
          ) =>
            compareForbiddenSets(
              first.forbiddenSet,
              second.forbiddenSet,
            ),
        )
      },
      [
        selectedDegree,
      ],
    )

  const filteredCases =
    useMemo(
      () =>
        filterWarehouseCases(
          allCases,
          forbiddenSetFilter,
        ),
      [
        allCases,
        forbiddenSetFilter,
      ],
    )

  function chooseDegree(
    degree:
      WarehouseDegree,
  ) {
    setSelectedDegree(
      degree,
    )

    setSelectedCase(
      null,
    )

    setActiveReference(
      null,
    )

    setForbiddenSetFilter(
      emptyForbiddenSetFilter(),
    )
  }

  function changeFilter(
    nextFilter:
      ForbiddenSetFilterState,
  ) {
    setForbiddenSetFilter(
      nextFilter,
    )

    /*
     * Once the visible atlas changes, close
     * the detail panel rather than leaving a
     * previously selected case stranded
     * beside an unrelated filtered list.
     */
    setSelectedCase(
      null,
    )

    setActiveReference(
      null,
    )
  }

  function openStepReference(
    recipe:
      NonNullable<
        WarehouseCaseRecord[
          'preferredRecipe'
        ]
      >,

    stepIndex:
      number,
  ) {
    const step =
      recipe.steps[
        stepIndex
      ]

    if (
      step ===
        undefined
    ) {
      return
    }

    setActiveReference({
      recipe,

      step,

      stepIndex,
    })
  }

  return (
    <>
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
            '1260px',

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

            padding:
              0,

            marginBottom:
              '48px',
          }}
        >
          ⌂ Home
        </button>

        <header
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
            Proof atlas for regular graphs
          </div>

          <h1
            style={{
              margin:
                '0 0 18px',

              color:
                '#1e293b',

              fontSize:
                '46px',

              fontWeight:
                500,
            }}
          >
            {
              warehouseTitle
            }
          </h1>

          <p
            style={{
              maxWidth:
                '760px',

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
            {
              warehouseSubtitle
            }
          </p>
        </header>

        <section
          style={{
            marginTop:
              '44px',
          }}
        >
          <div
            style={{
              marginBottom:
                '17px',

              textAlign:
                'center',

              color:
                '#475569',

              fontSize:
                '19px',
            }}
          >
            Choose the degree
          </div>

          <WarehouseDegreeSelector
            selectedDegree={
              selectedDegree
            }
            onSelect={
              chooseDegree
            }
          />
        </section>

        {selectedDegree !==
          null && (
          <section
            style={{
              marginTop:
                '34px',
            }}
          >
            <ForbiddenSetFilter
              degree={
                selectedDegree
              }
              totalCount={
                allCases.length
              }
              filteredCount={
                filteredCases.length
              }
              value={
                forbiddenSetFilter
              }
              onChange={
                changeFilter
              }
            />

            <div
              style={{
                display:
                  'flex',

                alignItems:
                  'baseline',

                justifyContent:
                  'space-between',

                gap:
                  '20px',

                marginTop:
                  '34px',

                marginBottom:
                  '18px',
              }}
            >
              <div>
                <div
                  style={{
                    color:
                      '#334155',

                    fontSize:
                      '25px',

                    fontWeight:
                      500,
                  }}
                >
                  <Math>
                    {
                      `d=${selectedDegree}`
                    }
                  </Math>{' '}

                  atlas
                </div>

                <div
                  style={{
                    marginTop:
                      '5px',

                    color:
                      '#64748b',

                    fontSize:
                      '16px',
                  }}
                >
                  {
                    filteredCases.length
                  }{' '}

                  of{' '}

                  {
                    allCases.length
                  }{' '}

                  reversal classes shown
                </div>
              </div>

              <div
                style={{
                  color:
                    '#94a3b8',

                  fontSize:
                    '14px',

                  textAlign:
                    'right',
                }}
              >
                Filled cells are forbidden
                outdegrees.
              </div>
            </div>

            {filteredCases.length >
              0 ? (
              <div
                style={{
                  display:
                    'grid',

                  gridTemplateColumns:
                    selectedCase ===
                    null
                      ? '1fr'
                      : 'minmax(0, 1fr) 330px',

                  gap:
                    '24px',

                  alignItems:
                    'start',
                }}
              >
                <div
                  style={{
                    display:
                      'grid',

                    gridTemplateColumns:
                      'repeat(auto-fill, minmax(255px, 1fr))',

                    gap:
                      '14px',
                  }}
                >
                  {filteredCases.map(
                    (
                      warehouseCase,
                    ) => (
                      <WarehouseCaseCard
                        key={
                          warehouseCase.id
                        }
                        warehouseCase={
                          warehouseCase
                        }
                        selected={
                          selectedCase
                            ?.id ===
                          warehouseCase.id
                        }
                        onSelect={
                          setSelectedCase
                        }
                      />
                    ),
                  )}
                </div>

                {selectedCase !==
                  null && (
                  <WarehouseCaseDetail
                    warehouseCase={
                      selectedCase
                    }
                    onClose={() => {
                      setSelectedCase(
                        null,
                      )

                      setActiveReference(
                        null,
                      )
                    }}
                    onOpenStepReference={
                      openStepReference
                    }
                  />
                )}
              </div>
            ) : (
              <div
                style={{
                  padding:
                    '54px 20px',

                  border:
                    '1px solid #e2e8f0',

                  borderRadius:
                    '12px',

                  background:
                    '#ffffff',

                  color:
                    '#64748b',

                  textAlign:
                    'center',
                }}
              >
                No warehouse cases match
                these filters.
              </div>
            )}
          </section>
        )}
      </div>
      </main>

      <WarehouseToolReferencePanel
        activeReference={
          activeReference
        }
        onClose={() =>
          setActiveReference(
            null,
          )
        }
      />
    </>
  )
}
