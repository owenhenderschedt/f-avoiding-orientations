import Math from '../components/Math'

export default function BlobLab() {
  return (
    <main
      style={{
        padding: '48px',
        maxWidth: '1000px',
        margin: '0 auto',
      }}
    >
      <h1 style={{ marginBottom: '12px' }}>Blob Lab</h1>

      <p style={{ marginTop: 0, marginBottom: '40px' }}>
        Visual experiments for the symbolic graph representation.
      </p>

      <section style={{ marginBottom: '72px' }}>
        <h2
          style={{
            fontSize: '1.1rem',
            fontWeight: 600,
            marginBottom: '20px',
          }}
        >
          State 0: Unpartitioned graph
        </h2>

        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: '1.15rem',
              marginBottom: '20px',
            }}
          >
            a <Math>12</Math>-regular graph <Math>G</Math>
          </div>

          <svg
            viewBox="0 0 600 600"
            width="100%"
            role="img"
            aria-label="A 12-regular graph G represented symbolically as a circle"
            style={{
              display: 'block',
              maxWidth: '420px',
              margin: '0 auto',
            }}
          >
            <defs>
              <filter
                id="soft-shadow-circle"
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
              r="200"
              fill="#f8fafc"
              stroke="#64748b"
              strokeWidth="3"
              filter="url(#soft-shadow-circle)"
            />

            <text
              x="300"
              y="315"
              textAnchor="middle"
              fontSize="54"
              fill="#334155"
              fontFamily="KaTeX_Math, KaTeX_Main, serif"
              fontStyle="italic"
            >
              G
            </text>
          </svg>
        </div>
      </section>

      <section>
        <h2
          style={{
            fontSize: '1.1rem',
            fontWeight: 600,
            marginBottom: '20px',
          }}
        >
          State 1: First partition view
        </h2>

        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: '1.15rem',
              marginBottom: '20px',
            }}
          >
            a partition of <Math>G</Math> into parts <Math>L</Math> and{' '}
            <Math>R</Math>
          </div>

          <svg
            viewBox="0 0 800 500"
            width="100%"
            role="img"
            aria-label="A partition of G into parts L and R represented by two vertical ellipses"
            style={{
              display: 'block',
              maxWidth: '620px',
              margin: '0 auto',
            }}
          >
            <defs>
              <filter
                id="soft-shadow-ellipse"
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

            <ellipse
              cx="260"
              cy="250"
              rx="120"
              ry="165"
              fill="#f8fafc"
              stroke="#64748b"
              strokeWidth="3"
              filter="url(#soft-shadow-ellipse)"
            />

            <ellipse
              cx="540"
              cy="250"
              rx="120"
              ry="165"
              fill="#f8fafc"
              stroke="#64748b"
              strokeWidth="3"
              filter="url(#soft-shadow-ellipse)"
            />

            <text
              x="260"
              y="263"
              textAnchor="middle"
              fontSize="42"
              fill="#334155"
              fontFamily="KaTeX_Math, KaTeX_Main, serif"
              fontStyle="italic"
            >
              L
            </text>

            <text
              x="540"
              y="263"
              textAnchor="middle"
              fontSize="42"
              fill="#334155"
              fontFamily="KaTeX_Math, KaTeX_Main, serif"
              fontStyle="italic"
            >
              R
            </text>
          </svg>
        </div>
      </section>
    </main>
  )
}