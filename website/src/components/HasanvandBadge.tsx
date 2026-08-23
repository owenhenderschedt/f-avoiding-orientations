import Math from './Math'
import type {
  HasanvandApplication,
} from '../tools/hasanvandApplication'
import {
  getUniformHasanvandRule,
} from '../tools/hasanvandApplication'

type HasanvandBadgeProps = {
  application:
    HasanvandApplication

  x: number
  y: number

  onOpen: (
    application:
      HasanvandApplication,
  ) => void
}

export default function HasanvandBadge({
  application,
  x,
  y,
  onOpen,
}: HasanvandBadgeProps) {
  const uniformRule =
    getUniformHasanvandRule(
      application,
    )

  return (
    <foreignObject
      x={x}
      y={y}
      width="260"
      height="70"
    >
      <div
        style={{
          width:
            '100%',

          textAlign:
            'center',
        }}
      >
        <button
          type="button"
          onClick={() =>
            onOpen(
              application,
            )
          }
          style={{
            font:
              'inherit',

            fontSize:
              '19px',

            color:
              '#475569',

            background:
              'transparent',

            border:
              'none',

            borderBottom:
              '1px solid #64748b',

            padding:
              '0 2px 2px',

            cursor:
              'pointer',
          }}
        >
          Hasanvand{' '}

          {uniformRule !==
          null ? (
            <Math>
              {
                `(${uniformRule.p},${uniformRule.q})`
              }
            </Math>
          ) : (
            <>by degree</>
          )}
        </button>
      </div>
    </foreignObject>
  )
}