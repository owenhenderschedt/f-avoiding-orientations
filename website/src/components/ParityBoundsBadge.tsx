import type {
  ParityBoundsApplication,
} from '../tools/parityBoundsApplication'

type ParityBoundsBadgeProps = {
  x:
    number

  y:
    number

  application:
    ParityBoundsApplication

  onOpen:
    () => void
}

export default function ParityBoundsBadge({
  x,
  y,
  application,
  onOpen,
}: ParityBoundsBadgeProps) {
  const normal =
    application
      .normalInterval

  return (
    <foreignObject
      x={
        x
      }
      y={
        y
      }
      width={
        190
      }
      height={
        40
      }
    >
      <button
        type="button"
        onClick={
          onOpen
        }
        title={
          `Ordinary parity interval [${normal.lower}, ${normal.upper}]`
        }
        style={{
          width:
            '100%',

          height:
            '32px',

          border:
            '1px solid #cbd5e1',

          borderRadius:
            '8px',

          background:
            '#ffffff',

          color:
            '#334155',

          font:
            'inherit',

          fontSize:
            '15px',

          cursor:
            'pointer',

          boxShadow:
            '0 3px 8px rgba(15, 23, 42, 0.07)',
        }}
      >
        Parity Bounds
      </button>
    </foreignObject>
  )
}