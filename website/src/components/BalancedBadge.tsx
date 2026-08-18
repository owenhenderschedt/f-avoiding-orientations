import type {
  BalancedTarget,
} from '../tools/balancedOrientation'

type BalancedBadgeProps = {
  target: BalancedTarget
  x: number
  y: number

  onOpen: (
    target: BalancedTarget,
  ) => void
}

export default function BalancedBadge({
  target,
  x,
  y,
  onOpen,
}: BalancedBadgeProps) {
  return (
    <foreignObject
      x={x}
      y={y}
      width="130"
      height="82"
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
            onOpen(target)
          }
          aria-label={`Balanced orientation of ${target}`}
          style={{
            font: 'inherit',
            color: '#64748b',
            background: 'transparent',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              display: 'inline-block',
              fontSize: '20px',
              lineHeight: 1.1,
              borderBottom:
                '1px solid #94a3b8',
              paddingBottom: '2px',
            }}
          >
            balanced
          </div>

          <svg
            viewBox="0 0 70 25"
            width="70"
            height="25"
            aria-hidden="true"
            style={{
              display: 'block',
              margin: '7px auto 0',
            }}
          >
            <g
              stroke="#64748b"
              strokeWidth="1.8"
              strokeLinecap="round"
              fill="#64748b"
            >
              <line
                x1="10"
                y1="5"
                x2="54"
                y2="5"
              />

              <polygon
                points="54,5 47,1.5 47,8.5"
              />

              <line
                x1="58"
                y1="12.5"
                x2="14"
                y2="12.5"
              />

              <polygon
                points="14,12.5 21,9 21,16"
              />

              <line
                x1="10"
                y1="20"
                x2="54"
                y2="20"
              />

              <polygon
                points="54,20 47,16.5 47,23.5"
              />
            </g>
          </svg>
        </button>
      </div>
    </foreignObject>
  )
}