import Math from './Math'
import type {
  StabilizeOutdegreeClassApplication,
} from '../tools/stabilizeOutdegreeClassApplication'

type StabilizeOutdegreeClassBadgeProps = {
  application:
    StabilizeOutdegreeClassApplication

  x: number
  y: number

  onOpen:
    (
      application:
        StabilizeOutdegreeClassApplication,
    ) => void
}

export default function StabilizeOutdegreeClassBadge({
  application,
  x,
  y,
  onOpen,
}: StabilizeOutdegreeClassBadgeProps) {
  return (
    <foreignObject
      x={x}
      y={y}
      width={260}
      height={58}
      style={{
        overflow:
          'visible',
      }}
    >
      <div
        style={{
          width:
            '260px',

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
          onClick={() =>
            onOpen(
              application,
            )
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
          title="Open stabilization certificate"
        >
          <Math>
            {
              `P_{${application.q}}`
              + '\\text{ independent}'
            }
          </Math>
        </button>
      </div>
    </foreignObject>
  )
}