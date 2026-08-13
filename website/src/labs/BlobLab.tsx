import { useState } from 'react'
import Math from '../components/Math'
import ProofHistory from '../components/ProofHistory'
import ToolReferencePanel from '../components/ToolReferencePanel'
import CaseStatus from '../playground/CaseStatus'
import GraphView from '../playground/GraphView'
import ToolMenu from '../playground/ToolMenu'
import usePlayground from '../playground/usePlayground'
import getOrientationStatus from '../playground/orientationStatus'
import { prototypeCase } from '../cases/prototypeCase'
import {
  LovaszPartitionReference,
  lovaszPartitionTool,
} from '../tools/lovaszPartition'
import {
  BalancedOrientationReference,
  balancedOrientationTool,
  type BalancedTarget,
} from '../tools/balancedOrientation'

type ActiveReference =
  | {
      type: 'lovasz'
    }
  | {
      type: 'balanced-orientation'
      target: BalancedTarget
    }
  | null

export default function BlobLab() {
  const [
    activeReference,
    setActiveReference,
  ] = useState<ActiveReference>(null)

  const playground =
    usePlayground(prototypeCase.degree)

  const orientationStatus =
    getOrientationStatus({
      forbiddenSet:
        prototypeCase.forbiddenSet,

      outdegreePossibilities:
        playground.outdegreePossibilities,

      balancedG:
        playground.balancedG,

      acrossOriented:
        playground.acrossDirection !== null,

      balancedL:
        playground.balancedL,

      balancedR:
        playground.balancedR,
    })

  function undo() {
    playground.undo()
    setActiveReference(null)
  }

  function reset() {
    playground.reset()
    setActiveReference(null)
  }

  const referenceTitle =
    activeReference?.type ===
    'balanced-orientation'
      ? balancedOrientationTool.name
      : lovaszPartitionTool.name

  return (
    <>
      <main
        style={{
          padding: '48px',
          maxWidth: '1000px',
          margin: '0 auto',
        }}
      >
        <h1 style={{ marginBottom: '12px' }}>
          Blob Lab
        </h1>

        <p
          style={{
            marginTop: 0,
            marginBottom: '40px',
          }}
        >
          Visual experiments for the symbolic graph
          representation.
        </p>

        <CaseStatus
          degree={
            prototypeCase.degree
          }
          forbiddenSet={
            prototypeCase.forbiddenSet
          }
          isComplete={
            orientationStatus.isComplete
          }
          isValid={
            orientationStatus
              .isValidFAvoiding
          }
        />

        <div
          style={{
            textAlign: 'center',
          }}
        >
          <GraphView
            degree={
              prototypeCase.degree
            }
            forbiddenSet={
              prototypeCase.forbiddenSet
            }
            partition={
              playground.partition
            }
            acrossDirection={
              playground.acrossDirection
            }
            balancedG={
              playground.balancedG
            }
            balancedL={
              playground.balancedL
            }
            balancedR={
              playground.balancedR
            }
            outdegreeGuarantees={
              playground.outdegreePossibilities
            }
            onOpenLovaszReference={() =>
              setActiveReference({
                type: 'lovasz',
              })
            }
            onOpenBalancedReference={(
              target,
            ) =>
              setActiveReference({
                type:
                  'balanced-orientation',
                target,
              })
            }
          />

          <div
            style={{
              marginTop: '28px',
              display: 'flex',
              justifyContent: 'center',
              gap: '14px',
              alignItems:
                'flex-start',
            }}
          >
            <ToolMenu
              partition={
                playground.partition
              }
              acrossDirection={
                playground.acrossDirection
              }
              balancedG={
                playground.balancedG
              }
              balancedL={
                playground.balancedL
              }
              balancedR={
                playground.balancedR
              }
              onApplyLovasz={
                playground
                  .applyLovaszPartition
              }
              onOrientAcross={
                playground.orientAcross
              }
              onBalanceGraph={
                playground.balanceGraph
              }
              onBalancePart={
                playground.balancePart
              }
            />

            {playground.canUndo && (
              <button
                type="button"
                onClick={reset}
                style={{
                  font: 'inherit',
                  padding: '10px 18px',
                  border:
                    '1px solid #64748b',
                  borderRadius: '8px',
                  background:
                    '#f8fafc',
                  color: '#334155',
                  cursor: 'pointer',
                }}
              >
                Reset
              </button>
            )}
          </div>

          <div
            style={{
              marginTop: '24px',
            }}
          >
            <ProofHistory
              steps={
                playground.moves.map(
                  (move, index) => {
                    if (
                      move.type ===
                      'lovasz-partition'
                    ) {
                      return (
                        <span key={index}>
                          Lovász{' '}
                          <Math>
                            {`(${move.pair.s},${move.pair.t})`}
                          </Math>
                        </span>
                      )
                    }

                    if (
                      move.type ===
                      'orient-across'
                    ) {
                      return (
                        <span key={index}>
                          Orient{' '}
                          <Math>
                            {move.direction ===
                            'L-to-R'
                              ? 'L\\to R'
                              : 'R\\to L'}
                          </Math>
                        </span>
                      )
                    }

                    if (
                      move.type ===
                      'balanced-orientation'
                    ) {
                      return (
                        <span key={index}>
                          Balance{' '}
                          <Math>
                            {move.part}
                          </Math>
                        </span>
                      )
                    }

                    if (
                      move.type ===
                      'balanced-whole-graph'
                    ) {
                      return (
                        <span key={index}>
                          Balance{' '}
                          <Math>{'G'}</Math>
                        </span>
                      )
                    }

                    return null
                  },
                )
              }
              canUndo={
                playground.canUndo
              }
              onUndo={undo}
            />
          </div>
        </div>
      </main>

      <ToolReferencePanel
        open={
          activeReference !== null
        }
        title={referenceTitle}
        onClose={() =>
          setActiveReference(null)
        }
      >
        {activeReference?.type ===
          'lovasz' && (
          <LovaszPartitionReference
            partition={
              playground.partition
            }
          />
        )}

        {activeReference?.type ===
          'balanced-orientation' && (
          <BalancedOrientationReference
            target={
              activeReference.target
            }
            degree={
              prototypeCase.degree
            }
            partition={
              playground.partition
            }
          />
        )}
      </ToolReferencePanel>
    </>
  )
}