import Math from './Math'
import type {
  AvoidCTarget,
} from '../tools/avoidC'

type AvoidCBadgeProps = {
  target: AvoidCTarget
  c: number
  x: number
  y: number

  onOpen: (
    target: AvoidCTarget,
    c: number,
  ) => void
}

export default function AvoidCBadge({
  target,
  c,
  x,
  y,
  onOpen,
}: AvoidCBadgeProps) {
  return (
    <foreignObject
      x={x}
      y={y}
      width="150"
      height="60"
    >
      <div
        style={{
          width: '100%',
          textAlign: 'center',
        }}
      >
        <button
          type="button"
          onClick={() =>
            onOpen(target, c)
          }
          aria-label={`Avoid ${c} in ${target}`}
          style={{
            font: 'inherit',
            fontSize: '20px',
            color: '#475569',
            background: 'transparent',
            border: 'none',
            borderBottom:
              '1px solid #64748b',
            padding: '0 2px 2px',
            cursor: 'pointer',
          }}
        >
          avoid{' '}
          <Math>
            {`c=${c}`}
          </Math>
        </button>
      </div>
    </foreignObject>
  )
}