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

function getRepairLatex(
  application:
    DirectedMengerReservoirApplication,
) {
  return application.qs
    .map(
      (
        q,
        index,
      ) =>
        `${q}`
        + '\\to'
        + `${application.repairedOutdegrees[index]}`,
    )
    .join(',\\ ')
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
      width="320"
      height="58"
      style={{
        overflow:
          'visible',
      }}
    >
      <div
        style={{
          width:
            '320px',

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
              getRepairLatex(
                application,
              )
            }
          </Math>
        </button>
      </div>
    </foreignObject>
  )
}
