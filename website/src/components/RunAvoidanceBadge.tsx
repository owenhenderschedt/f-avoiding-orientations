import Math from './Math'
import type {
  RunAvoidanceApplication,
} from '../tools/runAvoidanceApplication'

type RunAvoidanceBadgeProps = {
  application:
    RunAvoidanceApplication

  x: number
  y: number

  onOpen: (
    application:
      RunAvoidanceApplication,
  ) => void
}

export default function RunAvoidanceBadge({
  application,
  x,
  y,
  onOpen,
}: RunAvoidanceBadgeProps) {
  const sideLabel =
    application.side ===
      'low'
      ? 'low'
      : 'high'

  return (
    <foreignObject
      x={x}
      y={y}
      width="220"
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
            onOpen(
              application,
            )
          }
          aria-label={`Run Avoidance orientation of ${application.target}`}
          style={{
            font: 'inherit',
            color: '#64748b',
            background:
              'transparent',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              display:
                'inline-block',
              fontSize: '19px',
              lineHeight: 1.15,
              borderBottom:
                '1px solid #94a3b8',
              paddingBottom:
                '2px',
            }}
          >
            Run Avoidance{' '}
            <Math>
              {`r=${application.r}`}
            </Math>
            {' · '}
            {sideLabel}
          </div>
        </button>
      </div>
    </foreignObject>
  )
}
