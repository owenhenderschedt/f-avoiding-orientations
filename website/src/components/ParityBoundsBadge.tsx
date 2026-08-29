import Math from './Math'
import type {
  ParityBoundsApplication,
} from '../tools/parityBoundsApplication'

type ParityBoundsBadgeProps = {
  application:
    ParityBoundsApplication

  x: number
  y: number

  onOpen:
    () => void
}

export default function ParityBoundsBadge({
  application,
  x,
  y,
  onOpen,
}: ParityBoundsBadgeProps) {
  const normal =
    application.normalInterval

  const exceptional =
    application.exceptionalInterval

  return (
    <foreignObject
      x={x}
      y={y}
      width={280}
      height={58}
      style={{
        overflow:
          'visible',
      }}
    >
      <div
        style={{
          width:
            '280px',

          display:
            'flex',

          justifyContent:
            'center',

          alignItems:
            'center',
        }}
      >
        <button
          type="button"
          onClick={
            onOpen
          }
          style={{
            font:
              'inherit',

            border:
              'none',

            background:
              'transparent',

            color:
              '#475569',

            cursor:
              'pointer',

            padding:
              '3px 5px',

            borderBottom:
              '1px solid #94a3b8',

            lineHeight:
              1.2,
          }}
          title="Open Parity Bounds certificate"
        >
          Parity{' '}

          <Math>
            {
              `[${normal.lower},${normal.upper}],`
              +
              `\ [${exceptional.lower},${exceptional.upper}]`
            }
          </Math>
        </button>
      </div>
    </foreignObject>
  )
}
