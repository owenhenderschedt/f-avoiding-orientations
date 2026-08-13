import { useState } from 'react'
import Math from '../components/Math'
import {
  lovaszPairs,
  lovaszPartitionTool,
  type LovaszPair,
} from '../tools/lovaszPartition'
import {
  getAcrossDirectionLabel,
  type AcrossDirection,
} from '../tools/orientAcrossPartition'

type ToolMenuProps = {
  partition: LovaszPair | null
  acrossDirection: AcrossDirection | null
  onApplyLovasz: (pair: LovaszPair) => void
  onOrientAcross: (direction: AcrossDirection) => void
}

export default function ToolMenu({
  partition,
  acrossDirection,
  onApplyLovasz,
  onOrientAcross,
}: ToolMenuProps) {
  const [toolsOpen, setToolsOpen] = useState(false)
  const [lovaszOpen, setLovaszOpen] = useState(false)

  function toggleTools() {
    setToolsOpen((current) => !current)
    setLovaszOpen(false)
  }

  function applyLovasz(pair: LovaszPair) {
    onApplyLovasz(pair)
    setToolsOpen(false)
    setLovaszOpen(false)
  }

  function applyAcrossOrientation(direction: AcrossDirection) {
    onOrientAcross(direction)
    setToolsOpen(false)
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
    <div
      style={{
        position: 'relative',
        width: '230px',
      }}
    >
      <button
        type="button"
        onClick={toggleTools}
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
          {partition === null ? (
            <>
              {!lovaszOpen ? (
                <button
                  type="button"
                  onClick={() => setLovaszOpen(true)}
                  style={menuButtonStyle}
                >
                  {lovaszPartitionTool.menuLabel} →
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
                      onClick={() => applyLovasz(pair)}
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
            </>
          ) : acrossDirection === null ? (
            <>
              <button
                type="button"
                onClick={() => applyAcrossOrientation('L-to-R')}
                style={menuButtonStyle}
              >
                <>
  Orient <Math>{'L\\to R'}</Math>
</>
              </button>

              <button
                type="button"
                onClick={() => applyAcrossOrientation('R-to-L')}
                style={menuButtonStyle}
              >
                <>
  Orient <Math>{'R\\to L'}</Math>
</>
              </button>
            </>
          ) : (
            <div
              style={{
                padding: '10px 14px',
                color: '#64748b',
              }}
            >
              No additional tools yet.
            </div>
          )}
        </div>
      )}
    </div>
  )
}