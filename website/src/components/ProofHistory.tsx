import type { ReactNode } from 'react'

type ProofHistoryProps = {
  steps: ReactNode[]
  canUndo: boolean
  onUndo: () => void
}

export default function ProofHistory({
  steps,
  canUndo,
  onUndo,
}: ProofHistoryProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '10px',
        marginBottom: '30px',
        color: '#475569',
        fontSize: '0.95rem',
      }}
    >
      <span>Start</span>

      {steps.map((step, index) => (
        <span
          key={index}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <span
            aria-hidden="true"
            style={{
              color: '#94a3b8',
            }}
          >
            →
          </span>

          <span>{step}</span>
        </span>
      ))}

      {canUndo && (
        <button
          type="button"
          onClick={onUndo}
          style={{
            font: 'inherit',
            marginLeft: '8px',
            padding: '5px 10px',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            background: '#ffffff',
            color: '#475569',
            cursor: 'pointer',
          }}
        >
          Undo
        </button>
      )}
    </div>
  )
}