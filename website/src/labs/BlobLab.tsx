export default function BlobLab() {
  return (
    <main
      style={{
        padding: '48px',
        maxWidth: '900px',
        margin: '0 auto',
      }}
    >
      <h1>Blob Lab</h1>

      <p>
        Shape experiment only. No final colors, labels, or interactions yet.
      </p>

      <svg
        viewBox="0 0 600 600"
        width="100%"
        role="img"
        aria-label="Symbolic graph"
        style={{
          display: 'block',
          maxWidth: '560px',
          margin: '40px auto 0',
        }}
      >
        <defs>
          <filter
            id="soft-shadow"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feDropShadow
              dx="0"
              dy="8"
              stdDeviation="12"
              floodColor="#000000"
              floodOpacity="0.10"
            />
          </filter>
        </defs>

        <circle
          cx="300"
          cy="300"
          r="210"
          fill="#f8fafc"
          stroke="#64748b"
          strokeWidth="3"
          filter="url(#soft-shadow)"
        />
      </svg>
    </main>
  )
}