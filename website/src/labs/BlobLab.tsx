import { useState } from 'react'
import Math from '../components/Math'
import ProofHistory from '../components/ProofHistory'
import ToolReferencePanel from '../components/ToolReferencePanel'
import CaseStatus from '../playground/CaseStatus'
import GraphView from '../playground/GraphView'
import ToolMenu from '../playground/ToolMenu'
import usePlayground from '../playground/usePlayground'
import getOrientationStatus from '../playground/orientationStatus'
import {
  LovaszPartitionReference,
  lovaszPartitionTool,
} from '../tools/lovaszPartition'
import {
  BalancedOrientationReference,
  balancedOrientationTool,
  type BalancedTarget,
} from '../tools/balancedOrientation'
import {
  OrientedTwoFactorReference,
  orientedTwoFactorTool,
} from '../tools/orientedTwoFactor'
import {
  HasanvandCompressionReference,
  hasanvandCompressionTool,
} from '../tools/hasanvandCompression'

type BlobLabProps = {
  degree: number
  forbiddenSet: readonly number[]
  onBackToCases: () => void
  onHome: () => void
}

type ActiveReference =
  | {
      type: 'lovasz'
    }
  | {
      type:
        'balanced-orientation'
      target:
        BalancedTarget
    }
  | {
      type:
        'oriented-two-factor'
    }
  | {
      type:
        'hasanvand-compression'
    }
  | null

export default function BlobLab({
  degree,
  forbiddenSet,
  onBackToCases,
  onHome,
}: BlobLabProps) {
  const [
    activeReference,
    setActiveReference,
  ] = useState<ActiveReference>(
    null,
  )

  const playground =
    usePlayground(degree)

  const orientationStatus =
    getOrientationStatus({
      forbiddenSet,

      outdegreePossibilities:
        playground
          .outdegreePossibilities,

      balancedG:
        playground.balancedG,

      hasanvandG:
        playground.hasanvandG !==
        null,

      acrossOriented:
        playground
          .acrossDirection !==
        null,

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
      : activeReference?.type ===
          'oriented-two-factor'
        ? orientedTwoFactorTool.name
        : activeReference?.type ===
            'hasanvand-compression'
          ? hasanvandCompressionTool.name
          : lovaszPartitionTool.name

  const forbiddenSetMath =
    `\\{${forbiddenSet.join(',')}\\}`

  return (
    <>
      <main
        style={{
          padding:
            '42px 48px 60px',
          maxWidth: '1000px',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent:
              'space-between',
            marginBottom: '28px',
          }}
        >
          <button
            type="button"
            onClick={
              onBackToCases
            }
            style={{
              font: 'inherit',
              border: 'none',
              background:
                'transparent',
              color: '#64748b',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            ← Back to cases
          </button>

          <button
            type="button"
            onClick={onHome}
            style={{
              font: 'inherit',
              border: 'none',
              background:
                'transparent',
              color: '#64748b',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            Home
          </button>
        </div>

        <h1
          style={{
            marginBottom: '10px',
          }}
        >
          <Math>{`${degree}`}</Math>
          -Regular Playground
        </h1>

        <p
          style={{
            marginTop: 0,
            marginBottom: '34px',
            color: '#64748b',
          }}
        >
          Forbidden set{' '}
          <Math>
            {`F=${forbiddenSetMath}`}
          </Math>
        </p>

        <CaseStatus
          degree={degree}
          forbiddenSet={
            forbiddenSet
          }
          isComplete={
            orientationStatus
              .isComplete
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
            degree={degree}
            workingDegree={
              playground
                .workingDegree
            }
            fixedOutdegreeContribution={
              playground
                .fixedOutdegreeContribution
            }
            orientedTwoFactorCount={
              playground
                .orientedTwoFactorCount
            }
            forbiddenSet={
              forbiddenSet
            }
            partition={
              playground.partition
            }
            acrossDirection={
              playground
                .acrossDirection
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
            hasanvandG={
              playground.hasanvandG
            }
            outdegreeGuarantees={
              playground
                .outdegreePossibilities
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
            onOpenTwoFactorReference={() =>
              setActiveReference({
                type:
                  'oriented-two-factor',
              })
            }
            onOpenHasanvandReference={() =>
              setActiveReference({
                type:
                  'hasanvand-compression',
              })
            }
          />

          <div
            style={{
              marginTop: '28px',
              display: 'flex',
              justifyContent:
                'center',
              gap: '14px',
              alignItems:
                'flex-start',
            }}
          >
            <ToolMenu
              workingDegree={
                playground
                  .workingDegree
              }
              partition={
                playground.partition
              }
              acrossDirection={
                playground
                  .acrossDirection
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
              hasanvandG={
                playground.hasanvandG
              }
              onApplyLovasz={
                playground
                  .applyLovaszPartition
              }
              onOrientAcross={
                playground
                  .orientAcross
              }
              onBalanceGraph={
                playground
                  .balanceGraph
              }
              onBalancePart={
                playground
                  .balancePart
              }
              onTakeOrientedTwoFactor={
                playground
                  .takeOrientedTwoFactor
              }
              onApplyHasanvand={
                playground
                  .applyHasanvandCompression
              }
            />

            {playground.canUndo && (
              <button
                type="button"
                onClick={reset}
                style={{
                  font: 'inherit',
                  padding:
                    '10px 18px',
                  border:
                    '1px solid #64748b',
                  borderRadius:
                    '8px',
                  background:
                    '#f8fafc',
                  color:
                    '#334155',
                  cursor:
                    'pointer',
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
                  (
                    move,
                    index,
                  ) => {
                    if (
                      move.type ===
                      'lovasz-partition'
                    ) {
                      return (
                        <span
                          key={index}
                        >
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
                        <span
                          key={index}
                        >
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
                        <span
                          key={index}
                        >
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
                        <span
                          key={index}
                        >
                          Balance{' '}
                          <Math>
                            {'G'}
                          </Math>
                        </span>
                      )
                    }

                    if (
                      move.type ===
                      'oriented-two-factor'
                    ) {
                      return (
                        <span
                          key={index}
                        >
                          Orient a
                          2-factor
                        </span>
                      )
                    }

                    if (
                      move.type ===
                      'hasanvand-compression'
                    ) {
                      return (
                        <span
                          key={index}
                        >
                          Hasanvand{' '}
                          <Math>
                            {`(${move.parameters.p},${move.parameters.q})`}
                          </Math>
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
        title={
          referenceTitle
        }
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
              playground
                .workingDegree
            }
            partition={
              playground.partition
            }
          />
        )}

        {activeReference?.type ===
          'oriented-two-factor' && (
          <OrientedTwoFactorReference
            degree={
              playground
                .workingDegree + 2
            }
          />
        )}

        {activeReference?.type ===
          'hasanvand-compression' &&
          playground.hasanvandG !==
            null && (
            <HasanvandCompressionReference
              target="G"
              parameters={
                playground
                  .hasanvandG
              }
            />
          )}
      </ToolReferencePanel>
    </>
  )
}