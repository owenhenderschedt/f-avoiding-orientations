import { useState } from 'react'
import Math from '../components/Math'
import ProofHistory from '../components/ProofHistory'
import ToolReferencePanel from '../components/ToolReferencePanel'
import GraphView from '../playground/GraphView'
import ToolMenu from '../playground/ToolMenu'
import usePlayground from '../playground/usePlayground'
import {
  LovaszPartitionReference,
  lovaszPartitionTool,
} from '../tools/lovaszPartition'

export default function BlobLab() {
  const [referenceOpen, setReferenceOpen] = useState(false)

  const playground = usePlayground()

  function undo() {
    playground.undo()
    setReferenceOpen(false)
  }

  function reset() {
    playground.reset()
    setReferenceOpen(false)
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
          <GraphView
            partition={playground.partition}
            acrossDirection={playground.acrossDirection}
            onOpenLovaszReference={() => setReferenceOpen(true)}
          />

          <div
            style={{
              marginTop: '28px',
              display: 'flex',
              justifyContent: 'center',
              gap: '14px',
              alignItems: 'flex-start',
            }}
          >
            <ToolMenu
              partition={playground.partition}
              acrossDirection={playground.acrossDirection}
              onApplyLovasz={playground.applyLovaszPartition}
              onOrientAcross={playground.orientAcross}
            />

            {playground.canUndo && (
              <button
                type="button"
                onClick={reset}
                style={{
                  font: 'inherit',
                  padding: '10px 18px',
                  border: '1px solid #64748b',
                  borderRadius: '8px',
                  background: '#f8fafc',
                  color: '#334155',
                  cursor: 'pointer',
                }}
              >
                Reset
              </button>
            )}
          </div>

          <div style={{ marginTop: '24px' }}>
            <ProofHistory
              steps={playground.moves.map((move, index) => {
                if (move.type === 'lovasz-partition') {
                  return (
                    <span key={index}>
                      Lovász{' '}
                      <Math>
                        {`(${move.pair.s},${move.pair.t})`}
                      </Math>
                    </span>
                  )
                }

                if (move.type === 'orient-across') {
                  return (
                    <span key={index}>
                      Orient{' '}
                      <Math>
                        {move.direction === 'L-to-R'
                          ? 'L\\to R'
                          : 'R\\to L'}
                      </Math>
                    </span>
                  )
                }

                return null
              })}
              canUndo={playground.canUndo}
              onUndo={undo}
            />
          </div>
        </div>
      </main>

      <ToolReferencePanel
        open={referenceOpen}
        title={lovaszPartitionTool.name}
        onClose={() => setReferenceOpen(false)}
      >
        <LovaszPartitionReference
          partition={playground.partition}
        />
      </ToolReferencePanel>
    </>
  )
}