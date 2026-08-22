import Math from './Math'
import type {
  MaLuApplication,
} from '../tools/maLuApplication'

type MaLuBadgeProps = {
  application: MaLuApplication
  x: number
  y: number

  onOpen: (
    application: MaLuApplication,
  ) => void
}

function latexSet(
  values: readonly number[],
) {
  if (values.length === 0) {
    return '\\varnothing'
  }

  return (
    '\\{' +
    values.join(',') +
    '\\}'
  )
}

export default function MaLuBadge({
  application,
  x,
  y,
  onOpen,
}: MaLuBadgeProps) {
  return (
    <foreignObject
      x={x}
      y={y}
      width="180"
      height="55"
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
            onOpen(application)
          }
          aria-label={`Ma-Lu orientation of ${application.target}`}
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
            Ma–Lu{' '}
            <Math>
              {latexSet(
                application
                  .selectedValues,
              )}
            </Math>
          </div>
        </button>
      </div>
    </foreignObject>
  )
}