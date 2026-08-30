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

type WarehouseCaseCardProps = {
  warehouseCase:
    WarehouseCaseRecord

  selected:
    boolean

  onSelect:
    (
      warehouseCase:
        WarehouseCaseRecord,
    ) => void
}

export default function WarehouseCaseCard({
  warehouseCase,
  selected,
  onSelect,
}: WarehouseCaseCardProps) {
  const recipe =
    warehouseCase
      .preferredRecipe

  return (
    <button
      type="button"
      onClick={() =>
        onSelect(
          warehouseCase,
        )
      }
      style={{
        width:
          '100%',

        display:
          'block',

        padding:
          '15px',

        border:
          selected
            ? '1px solid #64748b'
            : '1px solid #dbe3ec',

        borderRadius:
          '11px',

        background:
          selected
            ? '#f8fafc'
            : '#ffffff',

        boxShadow:
          selected
            ? '0 5px 14px rgba(15, 23, 42, 0.08)'
            : '0 3px 10px rgba(15, 23, 42, 0.035)',

        font:
          'inherit',

        textAlign:
          'left',

        cursor:
          'pointer',
      }}
    >
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
          display:
            'flex',

          alignItems:
            'baseline',

          justifyContent:
            'space-between',

          gap:
            '12px',

          marginTop:
            '13px',
        }}
      >
        <div
          style={{
            color:
              '#334155',

            fontSize:
              '17px',
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

        {warehouseCase
          .selfReversing && (
          <div
            style={{
              color:
                '#94a3b8',

              fontSize:
                '12px',

              whiteSpace:
                'nowrap',
            }}
          >
            self-reversing
          </div>
        )}
      </div>

      <div
        style={{
          marginTop:
            '10px',

          paddingTop:
            '9px',

          borderTop:
            '1px solid #eef2f6',

          color:
            recipe ===
            null
              ? '#94a3b8'
              : '#526273',

          fontSize:
            '13px',

          lineHeight:
            1.45,
        }}
      >
        {recipe ===
          null
          ? 'Proof recipe not loaded yet'
          : warehouseRecipeSignature(
              recipe,
            )}
      </div>
    </button>
  )
}
