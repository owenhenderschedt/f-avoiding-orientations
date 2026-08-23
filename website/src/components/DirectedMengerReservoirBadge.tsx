import Math from './Math'
import type {
  DirectedMengerReservoirApplication,
} from '../tools/directedMengerReservoirApplication'

type DirectedMengerReservoirBadgeProps = {
  application:
    DirectedMengerReservoirApplication

  x: number

  y: number

  onOpenReference:
    (
      application:
        DirectedMengerReservoirApplication,
    ) => void
}

export default function DirectedMengerReservoirBadge({
  application,
  x,
  y,
  onOpenReference,
}: DirectedMengerReservoirBadgeProps) {
  return (
    <foreignObject
      x={x}
      y={y}
      width="280"
      height="58"
    >
      <div
        style={{
          width:
            '100%',

          height:
            '100%',

          display:
            'flex',

          alignItems:
            'center',

          justifyContent:
            'center',
        }}
      >
        <button
          type="button"
          onClick={() =>
            onOpenReference(
              application,
            )
          }
          style={{
            font:
              'inherit',

            border:
              '1px solid #cbd5e1',

            borderRadius:
              '8px',

            background:
              '#f8fafc',

            padding:
              '7px 12px',

            color:
              '#475569',

            cursor:
              'pointer',

            textDecoration:
              'underline',

            textDecorationColor:
              '#cbd5e1',

            textUnderlineOffset:
              '3px',

            whiteSpace:
              'nowrap',
          }}
        >
          Reservoir Menger{' '}

          <Math>
            {
              `${application.q}`
              + '\\to'
              + `${application.repairedOutdegree}`
            }
          </Math>
        </button>
      </div>
    </foreignObject>
  )
}