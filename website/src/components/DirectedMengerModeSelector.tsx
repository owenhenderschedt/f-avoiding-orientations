import Math from './Math'
import type {
  DirectedMengerReservoirApplication,
} from '../tools/directedMengerReservoirApplication'

type DirectedMengerModeSelectorProps = {
  canUseLocalAlpha:
    boolean

  reservoirCandidate:
    DirectedMengerReservoirApplication | null

  onOpenLocalAlpha:
    () => void

  onApplyReservoir:
    () => void

  onOpenReservoirReference:
    (
      application:
        DirectedMengerReservoirApplication,
    ) => void

  onBack:
    () => void
}

export default function DirectedMengerModeSelector({
  canUseLocalAlpha,
  reservoirCandidate,
  onOpenLocalAlpha,
  onApplyReservoir,
  onOpenReservoirReference,
  onBack,
}: DirectedMengerModeSelectorProps) {
  return (
    <div
      style={{
        width:
          '300px',

        padding:
          '12px',

        textAlign:
          'left',
      }}
    >
      {/* HEADER */}

      <div
        style={{
          display:
            'flex',

          alignItems:
            'center',

          justifyContent:
            'space-between',

          gap:
            '12px',

          padding:
            '2px 2px 12px',

          borderBottom:
            '1px solid #e2e8f0',

          marginBottom:
            '12px',
        }}
      >
        <button
          type="button"
          onClick={
            onBack
          }
          style={{
            font:
              'inherit',

            border:
              'none',

            background:
              'transparent',

            color:
              '#64748b',

            cursor:
              'pointer',

            padding: 0,
          }}
        >
          ← Back
        </button>

        <div
          style={{
            color:
              '#334155',
          }}
        >
          Directed Menger
        </div>
      </div>

      {/* LOCAL ALPHA MODE */}

      <div
        style={{
          marginBottom:
            '12px',

          padding:
            '12px',

          border:
            '1px solid #cbd5e1',

          borderRadius:
            '9px',

          background:
            '#ffffff',
        }}
      >
        <div
          style={{
            marginBottom:
              '5px',

            color:
              '#334155',

            fontWeight:
              600,
          }}
        >
          Local{' '}

          <Math>
            {'\\alpha'}
          </Math>
          -certificate
        </div>

        <div
          style={{
            marginBottom:
              '10px',

            color:
              '#64748b',

            fontSize:
              '0.84rem',

            lineHeight:
              1.4,
          }}
        >
          Choose demand and
          capacity classes and
          certify the repair using
          the local imbalance
          inequalities.
        </div>

        <button
          type="button"
          onClick={
            onOpenLocalAlpha
          }
          disabled={
            !canUseLocalAlpha
          }
          style={{
            width:
              '100%',

            font:
              'inherit',

            padding:
              '8px 10px',

            border:
              '1px solid #64748b',

            borderRadius:
              '7px',

            background:
              canUseLocalAlpha
                ? '#f8fafc'
                : '#f1f5f9',

            color:
              canUseLocalAlpha
                ? '#334155'
                : '#94a3b8',

            cursor:
              canUseLocalAlpha
                ? 'pointer'
                : 'default',
          }}
        >
          Open local workspace →
        </button>
      </div>

      {/* RESERVOIR MODE */}

      <div
        style={{
          padding:
            '12px',

          border:
            reservoirCandidate !==
            null
              ? '1px solid #94a3b8'
              : '1px solid #e2e8f0',

          borderRadius:
            '9px',

          background:
            reservoirCandidate !==
            null
              ? '#f8fafc'
              : '#ffffff',
        }}
      >
        <div
          style={{
            marginBottom:
              '5px',

            color:
              reservoirCandidate !==
              null
                ? '#334155'
                : '#64748b',

            fontWeight:
              600,
          }}
        >
          Reservoir certificate
        </div>

        {reservoirCandidate ===
        null ? (
          <div
            style={{
              color:
                '#94a3b8',

              fontSize:
                '0.84rem',

              lineHeight:
                1.4,
            }}
          >
            The current proof state
            does not yet provide all
            reservoir hypotheses.
          </div>
        ) : (
          <>
            <div
              style={{
                marginBottom:
                  '10px',

                color:
                  '#64748b',

                fontSize:
                  '0.84rem',

                lineHeight:
                  1.4,
              }}
            >
              The current Lovász,
              independence, cut
              orientation, and
              balanced-reservoir
              certificates automatically
              certify
            </div>

            <div
              style={{
                textAlign:
                  'center',

                marginBottom:
                  '10px',

                fontSize:
                  '1.05rem',
              }}
            >
              <Math>
                {
                  `${reservoirCandidate.q}`
                  + '\\to'
                  + `${reservoirCandidate.repairedOutdegree}`
                }
              </Math>
            </div>

            <div
              style={{
                textAlign:
                  'center',

                marginBottom:
                  '12px',

                color:
                  '#64748b',

                fontSize:
                  '0.84rem',
              }}
            >
              reservoir floor{' '}

              <Math>
                {
                  `d^+\\geq ${reservoirCandidate.certificate.reservoirSafeFloor}`
                }
              </Math>
            </div>

            <div
              style={{
                display:
                  'grid',

                gridTemplateColumns:
                  '1fr 1fr',

                gap:
                  '8px',
              }}
            >
              <button
                type="button"
                onClick={() =>
                  onOpenReservoirReference(
                    reservoirCandidate,
                  )
                }
                style={{
                  font:
                    'inherit',

                  padding:
                    '8px 8px',

                  border:
                    '1px solid #cbd5e1',

                  borderRadius:
                    '7px',

                  background:
                    '#ffffff',

                  color:
                    '#475569',

                  cursor:
                    'pointer',
                }}
              >
                Why it works
              </button>

              <button
                type="button"
                onClick={
                  onApplyReservoir
                }
                style={{
                  font:
                    'inherit',

                  padding:
                    '8px 8px',

                  border:
                    '1px solid #64748b',

                  borderRadius:
                    '7px',

                  background:
                    '#f8fafc',

                  color:
                    '#334155',

                  cursor:
                    'pointer',
                }}
              >
                Apply repair
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}