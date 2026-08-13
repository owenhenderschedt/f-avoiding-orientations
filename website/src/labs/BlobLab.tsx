import { useState } from 'react'
import Math from '../components/Math'
import ToolReferencePanel from '../components/ToolReferencePanel'

type LovaszPair = {
  s: number
  t: number
}

const lovaszPairs: LovaszPair[] = [
  { s: 11, t: 0 },
  { s: 10, t: 1 },
  { s: 9, t: 2 },
  { s: 8, t: 3 },
  { s: 7, t: 4 },
  { s: 6, t: 5 },
]

export default function BlobLab() {
  const [toolsOpen, setToolsOpen] = useState(false)
  const [lovaszOpen, setLovaszOpen] = useState(false)
  const [partition, setPartition] = useState<LovaszPair | null>(null)
  const [referenceOpen, setReferenceOpen] = useState(false)

  function openTools() {
    setToolsOpen((current) => !current)
    setLovaszOpen(false)
  }

  function openLovaszMenu() {
    setLovaszOpen(true)
  }

  function applyLovaszPartition(pair: LovaszPair) {
    setPartition(pair)
    setToolsOpen(false)
    setLovaszOpen(false)
  }

  function resetPlayground() {
    setPartition(null)
    setToolsOpen(false)
    setLovaszOpen(false)
    setReferenceOpen(false)
  }

  const controlButtonStyle = {
    font: 'inherit',
    padding: '10px 18px',
    border: '1px solid #64748b',
    borderRadius: '8px',
    background: '#f8fafc',
    color: '#334155',
    cursor: 'pointer',
  }

  const menuButtonStyle = {
    font: 'inherit',
    width: '100%',
    padding: '10px 14px',
    border: 'none',
    borderRadius: '6px',
    background: 'transparent',
    color: '#334155',
    cursor: 'pointer',
    textAlign: 'left' as const,
  }

  return (
    <>
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

        <div style={{ textAlign: 'center' }}>
          {partition === null ? (
            <>
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
            </>
          ) : (
            <>
              <div
                style={{
                  fontSize: '1.15rem',
                  marginBottom: '20px',
                }}
              >
                an <Math>{`(${partition.s},${partition.t})`}</Math>
                -
                <button
                  type="button"
                  onClick={() => setReferenceOpen(true)}
                  style={{
                    font: 'inherit',
                    color: '#334155',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid #64748b',
                    padding: 0,
                    cursor: 'pointer',
                  }}
                >
                  Lovász partition
                </button>{' '}
                of <Math>G</Math>
              </div>

              <svg
                viewBox="0 0 800 500"
                width="100%"
                role="img"
                aria-label={`A ${partition.s},${partition.t} Lovasz partition of G into parts L and R`}
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
                  cy="220"
                  rx="120"
                  ry="165"
                  fill="#f8fafc"
                  stroke="#64748b"
                  strokeWidth="3"
                  filter="url(#soft-shadow-ellipse)"
                />

                <ellipse
                  cx="540"
                  cy="220"
                  rx="120"
                  ry="165"
                  fill="#f8fafc"
                  stroke="#64748b"
                  strokeWidth="3"
                  filter="url(#soft-shadow-ellipse)"
                />

                <text
                  x="260"
                  y="235"
                  textAnchor="middle"
                  fontSize="48"
                  fill="#334155"
                  fontFamily="KaTeX_Math, KaTeX_Main, serif"
                  fontStyle="italic"
                >
                  L
                </text>

                <text
                  x="540"
                  y="235"
                  textAnchor="middle"
                  fontSize="48"
                  fill="#334155"
                  fontFamily="KaTeX_Math, KaTeX_Main, serif"
                  fontStyle="italic"
                >
                  R
                </text>

                <foreignObject
                  x="140"
                  y="405"
                  width="240"
                  height="60"
                >
                  <div
                    style={{
                      width: '100%',
                      textAlign: 'center',
                      fontSize: '24px',
                      color: '#334155',
                    }}
                  >
                    <Math>
                      {`\\Delta(G[L])\\le ${partition.s}`}
                    </Math>
                  </div>
                </foreignObject>

                <foreignObject
                  x="420"
                  y="405"
                  width="240"
                  height="60"
                >
                  <div
                    style={{
                      width: '100%',
                      textAlign: 'center',
                      fontSize: '24px',
                      color: '#334155',
                    }}
                  >
                    <Math>
                      {`\\Delta(G[R])\\le ${partition.t}`}
                    </Math>
                  </div>
                </foreignObject>
              </svg>
            </>
          )}

          <div
            style={{
              marginTop: '28px',
              display: 'flex',
              justifyContent: 'center',
              gap: '14px',
              alignItems: 'flex-start',
            }}
          >
            {partition === null ? (
              <div
                style={{
                  position: 'relative',
                  width: '230px',
                }}
              >
                <button
                  type="button"
                  onClick={openTools}
                  style={{
                    ...controlButtonStyle,
                    width: '100%',
                  }}
                >
                  Tools {toolsOpen ? '▴' : '▾'}
                </button>

                {toolsOpen && (
                  <div
                    style={{
                      marginTop: '8px',
                      padding: '6px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '10px',
                      background: '#ffffff',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
                      textAlign: 'left',
                    }}
                  >
                    {!lovaszOpen ? (
                      <button
                        type="button"
                        onClick={openLovaszMenu}
                        style={menuButtonStyle}
                      >
                        Lovász partition →
                      </button>
                    ) : (
                      <>
                        <div
                          style={{
                            padding: '8px 10px 10px',
                            borderBottom: '1px solid #e2e8f0',
                            marginBottom: '4px',
                          }}
                        >
                          Choose <Math>(s,t)</Math>
                        </div>

                        {lovaszPairs.map((pair) => (
                          <button
                            key={`${pair.s}-${pair.t}`}
                            type="button"
                            onClick={() => applyLovaszPartition(pair)}
                            style={{
                              ...menuButtonStyle,
                              textAlign: 'center',
                            }}
                          >
                            <Math>{`(${pair.s},${pair.t})`}</Math>
                          </button>
                        ))}

                        <button
                          type="button"
                          onClick={() => setLovaszOpen(false)}
                          style={{
                            ...menuButtonStyle,
                            marginTop: '4px',
                            borderTop: '1px solid #e2e8f0',
                            textAlign: 'center',
                          }}
                        >
                          ← Back
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={resetPlayground}
                style={controlButtonStyle}
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </main>

<ToolReferencePanel
  open={referenceOpen}
  title="Lovász Partition"
  onClose={() => setReferenceOpen(false)}
>
  <section style={{ marginBottom: '32px' }}>
    <h3 style={{ marginTop: 0 }}>
      Theorem (Lovász)
    </h3>

    <p>
      Let <Math>{'G'}</Math> be a finite graph, and let{' '}
      <Math>{'s,t\\ge 0'}</Math> be integers satisfying
    </p>

    <div style={{ textAlign: 'center', margin: '18px 0' }}>
      <Math display>
        {'s+t\\ge \\Delta(G)-1.'}
      </Math>
    </div>

    <p>
      Then there is a partition{' '}
      <Math>{'V(G)=L\\cup R'}</Math> such that
    </p>

    <div style={{ textAlign: 'center', margin: '18px 0' }}>
      <Math display>
        {
          '\\Delta(G[L])\\le s'
          + '\\qquad\\text{and}\\qquad'
          + '\\Delta(G[R])\\le t.'
        }
      </Math>
    </div>
  </section>

  <section style={{ marginBottom: '32px' }}>
    <h3>Proof</h3>

    <p>
      Among all partitions <Math>{'V(G)=L\\cup R'}</Math>, choose one
      minimizing
    </p>

    <div style={{ textAlign: 'center', margin: '18px 0' }}>
      <Math display>
        {
          '\\Phi(L,R)'
          + '=\\frac{e(G[L])}{s+1}'
          + '+\\frac{e(G[R])}{t+1}.'
        }
      </Math>
    </div>

    <p>
      Suppose that some <Math>{'v\\in L'}</Math> satisfies{' '}
      <Math>{'d_L(v)\\ge s+1'}</Math>. Since
    </p>

    <div style={{ textAlign: 'center', margin: '18px 0' }}>
      <Math display>
        {
          'd_G(v)\\le \\Delta(G)\\le s+t+1,'
        }
      </Math>
    </div>

    <p>we have</p>

    <div style={{ textAlign: 'center', margin: '18px 0' }}>
      <Math display>
        {
          'd_R(v)=d_G(v)-d_L(v)\\le t.'
        }
      </Math>
    </div>

    <p>
      Moving <Math>{'v'}</Math> from <Math>{'L'}</Math> to{' '}
      <Math>{'R'}</Math> changes <Math>{'\\Phi'}</Math> by
    </p>

<div style={{ textAlign: 'center', margin: '18px 0' }}>
  <Math display>
    {
      '\\begin{aligned}'
      + '-\\frac{d_L(v)}{s+1}'
      + '+\\frac{d_R(v)}{t+1}'
      + '&\\le -1+\\frac{t}{t+1}\\\\'
      + '&<0.'
      + '\\end{aligned}'
    }
  </Math>
</div>

    <p>
      This contradicts the minimality of <Math>{'\\Phi'}</Math>.
      Hence <Math>{'\\Delta(G[L])\\le s'}</Math>. By symmetry,{' '}
      <Math>{'\\Delta(G[R])\\le t'}</Math>.
    </p>
  </section>

  {partition !== null && (
    <section style={{ marginBottom: '32px' }}>
      <h3>Application here</h3>

      <p>
        <Math>{'G'}</Math> is{' '}
        <Math>{'12'}</Math>-regular, so{' '}
        <Math>{'\\Delta(G)=12'}</Math>. The chosen parameters are{' '}
        <Math>{`(${partition.s},${partition.t})`}</Math>, and
      </p>

      <div style={{ textAlign: 'center', margin: '18px 0' }}>
        <Math display>
          {
            `${partition.s}+${partition.t}`
            + '=11=12-1=\\Delta(G)-1.'
          }
        </Math>
      </div>

      <p>
        Therefore, the theorem gives a partition{' '}
        <Math>{'V(G)=L\\cup R'}</Math> satisfying
      </p>

      <div style={{ textAlign: 'center', margin: '18px 0' }}>
        <Math display>
          {
            `\\Delta(G[L])\\le ${partition.s}`
            + '\\qquad\\text{and}\\qquad'
            + `\\Delta(G[R])\\le ${partition.t}.`
          }
        </Math>
      </div>
    </section>
  )}

  <section>
    <h3>Reference</h3>

    <p style={{ marginBottom: 0 }}>
      L. Lovász, <em>On decomposition of graphs</em>, Studia
      Scientiarum Mathematicarum Hungarica <strong>1</strong> (1966),
      237–238.
    </p>
  </section>
</ToolReferencePanel>
    </>
  )
}