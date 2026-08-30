import Math from '../../components/Math'
import {
  warehouseDegrees,
} from '../config'
import type {
  WarehouseDegree,
} from '../types'

type WarehouseDegreeSelectorProps = {
  selectedDegree:
    WarehouseDegree | null

  onSelect:
    (
      degree:
        WarehouseDegree,
    ) => void
}

export default function WarehouseDegreeSelector({
  selectedDegree,
  onSelect,
}: WarehouseDegreeSelectorProps) {
  return (
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
      {warehouseDegrees.map(
        (degree) => {
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
                onSelect(
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
  )
}
