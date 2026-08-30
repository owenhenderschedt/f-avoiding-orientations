import Math from '../../components/Math'
import type {
  WarehouseProofStep,
} from '../types'
import {
  forbiddenSetLatex,
} from '../utils/forbiddenSet'
import {
  warehouseStepSignature,
} from '../utils/proofSignature'

type WarehouseProofStepProps = {
  step:
    WarehouseProofStep

  index:
    number

  onOpenReference:
    () => void
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

export default function WarehouseProofStepView({
  step,
  index,
  onOpenReference,
}: WarehouseProofStepProps) {
  return (
    <div
      style={{
        display:
          'grid',

        gridTemplateColumns:
          '28px minmax(0, 1fr)',

        gap:
          '10px',

        alignItems:
          'start',
      }}
    >
      <div
        style={{
          width:
            '26px',

          height:
            '26px',

          display:
            'flex',

          alignItems:
            'center',

          justifyContent:
            'center',

          border:
            '1px solid #dbe3ec',

          borderRadius:
            '50%',

          background:
            '#f8fafc',

          color:
            '#64748b',

          fontSize:
            '13px',

          lineHeight:
            1,
        }}
      >
        {
          index + 1
        }
      </div>

      <div
        style={{
          minWidth:
            0,
        }}
      >
        <button
          type="button"
          onClick={
            onOpenReference
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
              '#334155',

            cursor:
              'pointer',

            padding:
              '0 1px 2px',

            fontSize:
              '16px',

            lineHeight:
              1.45,

            textAlign:
              'left',
          }}
          title="Open mathematical reference"
        >
          {
            warehouseStepSignature(
              step,
            )
          }
        </button>

        {step.type ===
          'ma-lu' && (
          <div
            style={{
              marginTop:
                '4px',

              color:
                '#64748b',

              fontSize:
                '14px',
            }}
          >
            Selected:{' '}

            <Math>
              {
                numberSetLatex(
                  step.selectedValues,
                )
              }
            </Math>
          </div>
        )}

        {step.type ===
          'stabilize-outdegree-class' && (
          <div
            style={{
              marginTop:
                '4px',

              color:
                '#64748b',

              fontSize:
                '14px',
            }}
          >
            Classes:{' '}

            <Math>
              {
                numberSetLatex(
                  step.qs,
                )
              }
            </Math>
          </div>
        )}

        {step.type ===
          'directed-menger-reservoir' && (
          <div
            style={{
              marginTop:
                '4px',

              color:
                '#64748b',

              fontSize:
                '14px',
            }}
          >
            Repaired outdegrees:{' '}

            <Math>
              {
                numberSetLatex(
                  step.repairedOutdegrees,
                )
              }
            </Math>
          </div>
        )}

        {step.type ===
          'lower-degree-certificate' && (
          <div
            style={{
              marginTop:
                '4px',

              color:
                '#64748b',

              fontSize:
                '14px',

              lineHeight:
                1.45,
            }}
          >
            Residual forbidden set:{' '}

            <Math>
              {
                forbiddenSetLatex(
                  step.residualForbiddenSet,
                )
              }
            </Math>

            {step.reversed
              ? ' (used by reversal)'
              : ''}
          </div>
        )}
      </div>
    </div>
  )
}
