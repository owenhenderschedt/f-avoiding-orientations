import type { ReactNode } from 'react'

type ToolReferencePanelProps = {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}

export default function ToolReferencePanel({
  open,
  title,
  onClose,
  children,
}: ToolReferencePanelProps) {
  if (!open) {
    return null
  }

  return (
    <aside
      aria-label={`${title} reference`}
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: 'min(440px, 92vw)',
        height: '100vh',
        background: '#ffffff',
        borderLeft: '1px solid #cbd5e1',
        boxShadow: '-8px 0 30px rgba(0, 0, 0, 0.08)',
        zIndex: 1000,
        overflowY: 'auto',
        padding: '34px 34px 48px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
          paddingBottom: '18px',
          marginBottom: '26px',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: '1.35rem',
            fontWeight: 600,
          }}
        >
          {title}
        </h2>

        <button
          type="button"
          onClick={onClose}
          aria-label={`Close ${title} reference`}
          style={{
            font: 'inherit',
            fontSize: '1.35rem',
            lineHeight: 1,
            border: 'none',
            background: 'transparent',
            color: '#475569',
            cursor: 'pointer',
            padding: '6px',
          }}
        >
          ×
        </button>
      </div>

      <div
        style={{
          fontSize: '1rem',
          lineHeight: 1.65,
        }}
      >
        {children}
      </div>
    </aside>
  )
}