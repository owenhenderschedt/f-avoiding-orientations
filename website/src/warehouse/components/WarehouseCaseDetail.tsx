import Math from '../../components/Math'
import type {
  WarehouseCaseRecord,
} from '../types'
import {
  forbiddenSetLatex,
} from '../utils/forbiddenSet'
import {
  warehouseRecipeSignature,
} from '../utils/proofSignature'
import ForbiddenProfile from './ForbiddenProfile'
import WarehouseProofStepView from './WarehouseProofStep'

type WarehouseCaseDetailProps = {
  warehouseCase:
    WarehouseCaseRecord

  onClose:
    () => void

  onOpenStepReference:
    (
      recipe:
        NonNullable<
          WarehouseCaseRecord[
            'preferredRecipe'
          ]
        >,

      stepIndex:
        number,
    ) => void
}

function numberSetLatex(
  values:
    readonly number[],
) {
  return (
    '\\{' +
    values.join(',') +
    '\\}'
  )
}

function sameNumbers(
  first:
    readonly number[],

  second:
    readonly number[],
) {
  return (
    first.length ===
      second.length &&
    first.every(
      (
        value,
        index,
      ) =>
        value ===
        second[index],
    )
  )
}

export default function WarehouseCaseDetail({
  warehouseCase,
  onClose,
  onOpenStepReference,
}: WarehouseCaseDetailProps) {
  const recipe =
    warehouseCase
      .preferredRecipe

  const sameFinalOutdegrees =
    recipe !==
      null &&
    sameNumbers(
      recipe
        .finalOutdegreesL,

      recipe
        .finalOutdegreesR,
    )

  return (
    <aside
      style={{
        position:
          'sticky',

        top:
          '24px',

        alignSelf:
          'start',

        border:
          '1px solid #dbe3ec',

        borderRadius:
          '14px',

        background:
          '#ffffff',

        boxShadow:
          '0 7px 22px rgba(15, 23, 42, 0.06)',

        padding:
          '22px',
      }}
    >
      <div
        style={{
          display:
            'flex',

          justifyContent:
            'space-between',

          alignItems:
            'center',

          gap:
            '12px',

          marginBottom:
            '18px',
        }}
      >
        <div
          style={{
            color:
              '#334155',

            fontSize:
              '21px',

            fontWeight:
              600,
          }}
        >
          Case
        </div>

        <button
          type="button"
          onClick={
            onClose
          }
          style={{
            border:
              'none',

            background:
              'transparent',

            color:
              '#94a3b8',

            cursor:
              'pointer',

            font:
              'inherit',

            fontSize:
              '20px',

            padding:
              '2px 4px',
          }}
          aria-label="Close case detail"
        >
          ×
        </button>
      </div>

      <ForbiddenProfile
        degree={
          warehouseCase.degree
        }
        forbiddenSet={
          warehouseCase
            .forbiddenSet
        }
      />

      <div
        style={{
          marginTop:
            '18px',

          color:
            '#334155',

          fontSize:
            '20px',
        }}
      >
        <Math>
          {
            `d=${warehouseCase.degree}`
          }
        </Math>
      </div>

      <div
        style={{
          marginTop:
            '8px',

          color:
            '#334155',

          fontSize:
            '18px',
        }}
      >
        <Math>
          {
            `F=${forbiddenSetLatex(
              warehouseCase
                .forbiddenSet,
            )}`
          }
        </Math>
      </div>

      {!warehouseCase
        .selfReversing && (
        <div
          style={{
            marginTop:
              '8px',

            color:
              '#64748b',

            fontSize:
              '16px',
          }}
        >
          Reversal:{' '}

          <Math>
            {
              forbiddenSetLatex(
                warehouseCase
                  .reversal,
              )
            }
          </Math>
        </div>
      )}

      <div
        style={{
          marginTop:
            '24px',

          paddingTop:
            '20px',

          borderTop:
            '1px solid #e2e8f0',
        }}
      >
        <div
          style={{
            color:
              '#475569',

            fontSize:
              '17px',

            fontWeight:
              600,

            marginBottom:
              '8px',
          }}
        >
          Preferred proof
        </div>

        {recipe ===
          null ? (
          <div
            style={{
              color:
                '#94a3b8',

              fontSize:
                '15px',

              lineHeight:
                1.55,
            }}
          >
            Verified recipe data has not
            been loaded for this degree yet.
          </div>
        ) : (
          <>
            <div
              style={{
                color:
                  '#64748b',

                fontSize:
                  '14px',

                lineHeight:
                  1.5,

                marginBottom:
                  '18px',
              }}
            >
              {
                warehouseRecipeSignature(
                  recipe,
                )
              }
            </div>

            <div
              style={{
                display:
                  'grid',

                gap:
                  '14px',
              }}
            >
              {recipe.steps.map(
                (
                  step,
                  index,
                ) => (
                  <WarehouseProofStepView
                    key={
                      `${recipe.id}-${index}`
                    }
                    step={
                      step
                    }
                    index={
                      index
                    }
                    onOpenReference={() =>
                      onOpenStepReference(
                        recipe,
                        index,
                      )
                    }
                  />
                ),
              )}
            </div>

            <div
              style={{
                marginTop:
                  '22px',

                padding:
                  '14px 15px',

                border:
                  '1px solid #dbe3ec',

                borderRadius:
                  '10px',

                background:
                  '#f8fafc',
              }}
            >
              <div
                style={{
                  color:
                    '#475569',

                  fontSize:
                    '14px',

                  fontWeight:
                    600,

                  marginBottom:
                    '7px',
                }}
              >
                Final possible outdegrees
              </div>

              {sameFinalOutdegrees ? (
                <div
                  style={{
                    color:
                      '#334155',

                    fontSize:
                      '16px',
                  }}
                >
                  <Math>
                    {
                      numberSetLatex(
                        recipe
                          .finalOutdegreesL,
                      )
                    }
                  </Math>
                </div>
              ) : (
                <div
                  style={{
                    display:
                      'grid',

                    gap:
                      '5px',

                    color:
                      '#334155',

                    fontSize:
                      '15px',
                  }}
                >
                  <div>
                    <Math>
                      {
                        `L:\\ ${numberSetLatex(
                          recipe
                            .finalOutdegreesL,
                        )}`
                      }
                    </Math>
                  </div>

                  <div>
                    <Math>
                      {
                        `R:\\ ${numberSetLatex(
                          recipe
                            .finalOutdegreesR,
                        )}`
                      }
                    </Math>
                  </div>
                </div>
              )}
            </div>

            <div
              style={{
                marginTop:
                  '10px',

                color:
                  '#94a3b8',

                fontSize:
                  '12px',
              }}
            >
              Source: verified audit recipe
            </div>
          </>
        )}
      </div>
    </aside>
  )
}
