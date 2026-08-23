import { useState } from 'react'
import Math from '../components/Math'
import ProofHistory from '../components/ProofHistory'
import ToolReferencePanel from '../components/ToolReferencePanel'
import DirectedMengerWorkspace from '../components/DirectedMengerWorkspace'
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
import type {
  HasanvandApplication,
} from '../tools/hasanvandApplication'
import type {
  HasanvandTarget,
} from '../tools/hasanvandMath'
import {
  AvoidCReference,
  avoidCTool,
  type AvoidCTarget,
} from '../tools/avoidC'
import {
  MaLuReference,
  maLuTool,
} from '../tools/maLu'
import type {
  MaLuApplication,
} from '../tools/maLuApplication'
import type {
  MaLuTarget,
} from '../tools/maLuMath'
import {
  StabilizeOutdegreeClassReference,
  stabilizeOutdegreeClassTool,
} from '../tools/stabilizeOutdegreeClass'
import type {
  StabilizeOutdegreeClassApplication,
} from '../tools/stabilizeOutdegreeClassApplication'
import type {
  StabilizeTarget,
} from '../tools/stabilizeOutdegreeClassMath'
import {
  DirectedMengerRepairReference,
  directedMengerRepairTool,
} from '../tools/directedMengerRepair'
import {
  DirectedMengerReservoirReference,
} from '../tools/directedMengerReservoir'
import type {
  DirectedMengerReservoirApplication,
} from '../tools/directedMengerReservoirApplication'
import {
  createDirectedMengerApplication,
  type DirectedMengerApplication,
} from '../tools/directedMengerApplication'
import type {
  MengerCapacityRule,
  MengerDemandRule,
  MengerRepairDirection,
} from '../tools/directedMengerMath'

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
      type: 'balanced-orientation'
      target: BalancedTarget
    }
  | {
      type: 'oriented-two-factor'
    }
  | {
      type: 'hasanvand-compression'
      target: HasanvandTarget
      application:
        HasanvandApplication | null
    }
  | {
      type: 'avoid-c'
      target: AvoidCTarget
      c: number
    }
  | {
      type: 'ma-lu'
      target: MaLuTarget
      application:
        MaLuApplication | null
    }
  | {
      type:
        'stabilize-outdegree-class'
      target:
        StabilizeTarget
      application:
        StabilizeOutdegreeClassApplication | null
    }
  | {
      type: 'directed-menger'
      application:
        DirectedMengerApplication | null
    }
  | {
      type:
        'directed-menger-reservoir'
      application:
        DirectedMengerReservoirApplication | null
    }
  | null

function latexSet(
  values: readonly number[],
) {
  return (
    '\\{' +
    values.join(',') +
    '\\}'
  )
}

function uniqueSorted(
  values: readonly number[],
) {
  return Array.from(
    new Set(values),
  ).sort(
    (a, b) =>
      a - b,
  )
}

function getCombinedOutdegrees({
  L,
  R,
}: {
  L: readonly number[]
  R: readonly number[]
}) {
  return uniqueSorted([
    ...L,
    ...R,
  ])
}

function getMengerRepairLatex(
  application:
    DirectedMengerApplication,
) {
  return application
    .demandRules
    .map(
      (rule) => {
        const finalOutdegree =
          application.direction ===
          'increase'
            ? rule.outdegree +
              rule.demand
            : rule.outdegree -
              rule.demand

        return (
          `${rule.outdegree}`
          + '\\to'
          + `${finalOutdegree}`
        )
      },
    )
    .join(',\\ ')
}

function getHasanvandTargetLatex(
  target: HasanvandTarget,
) {
  if (
    target === 'L'
  ) {
    return 'G[L]'
  }

  if (
    target === 'R'
  ) {
    return 'G[R]'
  }

  return 'G'
}

function getHasanvandRuleLatex(
  application:
    HasanvandApplication,
) {
  return application.rules
    .map(
      (rule) => {
        const degreeRange =
          rule.minDegree ===
          rule.maxDegree
            ? `d=${rule.minDegree}`
            : `${rule.minDegree}\\text{--}${rule.maxDegree}`

        return (
          `${degreeRange}`
          + '\\mapsto'
          + `(${rule.p},${rule.q})`
        )
      },
    )
    .join(',\\ ')
}

function getStabilizeTargetLatex(
  target:
    StabilizeTarget,
) {
  if (
    target === 'L'
  ) {
    return 'G[L]'
  }

  if (
    target === 'R'
  ) {
    return 'G[R]'
  }

  return 'G'
}

export default function BlobLab({
  degree,
  forbiddenSet,
  onBackToCases,
  onHome,
}: BlobLabProps) {
  const [
    activeReference,
    setActiveReference,
  ] =
    useState<ActiveReference>(
      null,
    )

  const [
    directedMengerWorkspaceOpen,
    setDirectedMengerWorkspaceOpen,
  ] =
    useState(false)

  /*
   * Reservoir Menger needs to know the
   * actual forbidden set in order to
   * verify q+1 and the reservoir
   * interval are safe.
   */
  const playground =
    usePlayground(
      degree,
      forbiddenSet,
    )

  const wholeGraphOriented =
    playground.balancedG ||
    playground.avoidCG !==
      null ||
    playground.maLuG ||
    playground.hasanvandG !==
      null

  const leftInternallyOriented =
    playground.balancedL ||
    playground.avoidCL !==
      null ||
    playground.maLuL ||
    playground.hasanvandL !==
      null

  const rightInternallyOriented =
    playground.balancedR ||
    playground.avoidCR !==
      null ||
    playground.maLuR ||
    playground.hasanvandR !==
      null

  const orientationStatus =
    getOrientationStatus({
      forbiddenSet,

      outdegreePossibilities:
        playground
          .outdegreePossibilities,

      wholeGraphOriented,

      acrossOriented:
        playground
          .acrossDirection !==
        null,

      leftInternallyOriented,

      rightInternallyOriented,
    })

  const preRepairTotalOutdegrees =
    getCombinedOutdegrees(
      playground
        .preRepairOutdegreePossibilities,
    )

  function undo() {
    playground.undo()

    setActiveReference(
      null,
    )

    setDirectedMengerWorkspaceOpen(
      false,
    )
  }

  function reset() {
    playground.reset()

    setActiveReference(
      null,
    )

    setDirectedMengerWorkspaceOpen(
      false,
    )
  }

  function openMaLuSelectorReference(
    target: MaLuTarget,
  ) {
    setActiveReference({
      type: 'ma-lu',

      target,

      application:
        null,
    })
  }

  function openAppliedMaLuReference(
    application:
      MaLuApplication,
  ) {
    setActiveReference({
      type: 'ma-lu',

      target:
        application.target,

      application,
    })
  }

  function openHasanvandSelectorReference(
    target:
      HasanvandTarget,
  ) {
    setActiveReference({
      type:
        'hasanvand-compression',

      target,

      application:
        null,
    })
  }

  function openAppliedHasanvandReference(
    application:
      HasanvandApplication,
  ) {
    setActiveReference({
      type:
        'hasanvand-compression',

      target:
        application.target,

      application,
    })
  }

  function openStabilizeSelectorReference(
    target:
      StabilizeTarget,
  ) {
    setActiveReference({
      type:
        'stabilize-outdegree-class',

      target,

      application:
        null,
    })
  }

  function openAppliedStabilizeReference(
    application:
      StabilizeOutdegreeClassApplication,
  ) {
    setActiveReference({
      type:
        'stabilize-outdegree-class',

      target:
        application.target,

      application,
    })
  }

  function openDirectedMengerTheorem() {
    setActiveReference({
      type:
        'directed-menger',

      application:
        null,
    })
  }

  function openAppliedDirectedMengerReference(
    application:
      DirectedMengerApplication,
  ) {
    setActiveReference({
      type:
        'directed-menger',

      application,
    })
  }

  function openDirectedMengerReservoirReference(
    application:
      DirectedMengerReservoirApplication,
  ) {
    setActiveReference({
      type:
        'directed-menger-reservoir',

      application,
    })
  }

  function openDirectedMengerWorkspace() {
    setActiveReference(
      null,
    )

    setDirectedMengerWorkspaceOpen(
      true,
    )
  }

  function closeDirectedMengerWorkspace() {
    setDirectedMengerWorkspaceOpen(
      false,
    )
  }

  function applyDirectedMengerRepair(
    demandRules:
      readonly MengerDemandRule[],

    capacityRules:
      readonly MengerCapacityRule[],

    direction:
      MengerRepairDirection,
  ) {
    const application =
      createDirectedMengerApplication({
        degree,

        forbiddenSet,

        currentOutdegrees:
          preRepairTotalOutdegrees,

        demandRules,

        capacityRules,

        direction,
      })

    if (
      application === null
    ) {
      return
    }

    playground
      .applyDirectedMengerRepair(
        application,
      )

    setDirectedMengerWorkspaceOpen(
      false,
    )
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
          : activeReference?.type ===
              'avoid-c'
            ? avoidCTool.name
            : activeReference?.type ===
                'ma-lu'
              ? maLuTool.name
              : activeReference?.type ===
                  'stabilize-outdegree-class'
                ? stabilizeOutdegreeClassTool.name
                : activeReference?.type ===
                    'directed-menger-reservoir'
                  ? 'Directed Menger — Reservoir certificate'
                  : activeReference?.type ===
                      'directed-menger'
                    ? directedMengerRepairTool.name
                    : lovaszPartitionTool.name

  const forbiddenSetMath =
    `\\{${forbiddenSet.join(
      ',',
    )}\\}`

  return (
    <>
      <main
        style={{
          padding:
            '42px 48px 60px',

          maxWidth:
            '1000px',

          margin:
            '0 auto',
        }}
      >
        <div
          style={{
            display:
              'flex',

            alignItems:
              'center',

            justifyContent:
              'space-between',

            marginBottom:
              '28px',
          }}
        >
          <button
            type="button"
            onClick={
              onBackToCases
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
            ← Back to cases
          </button>

          <button
            type="button"
            onClick={
              onHome
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
            Home
          </button>
        </div>

        <h1
          style={{
            marginBottom:
              '10px',
          }}
        >
          <Math>
            {`${degree}`}
          </Math>
          -Regular Playground
        </h1>

        <p
          style={{
            marginTop: 0,

            marginBottom:
              '34px',

            color:
              '#64748b',
          }}
        >
          Forbidden set{' '}

          <Math>
            {
              `F=${forbiddenSetMath}`
            }
          </Math>
        </p>

        <CaseStatus
          degree={
            degree
          }
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
            textAlign:
              'center',
          }}
        >
          <GraphView
            degree={
              degree
            }
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
              playground
                .partition
            }
            acrossDirection={
              playground
                .acrossDirection
            }
            balancedG={
              playground
                .balancedG
            }
            balancedL={
              playground
                .balancedL
            }
            balancedR={
              playground
                .balancedR
            }
            avoidCG={
              playground
                .avoidCG
            }
            avoidCL={
              playground
                .avoidCL
            }
            avoidCR={
              playground
                .avoidCR
            }
            maLuApplicationG={
              playground
                .maLuApplicationG
            }
            maLuApplicationL={
              playground
                .maLuApplicationL
            }
            maLuApplicationR={
              playground
                .maLuApplicationR
            }
            hasanvandApplicationG={
              playground
                .hasanvandApplicationG
            }
            hasanvandApplicationL={
              playground
                .hasanvandApplicationL
            }
            hasanvandApplicationR={
              playground
                .hasanvandApplicationR
            }
            stabilizeOutdegreeClassApplication={
              playground
                .stabilizeOutdegreeClassApplication
            }
            directedMengerApplication={
              playground
                .directedMengerApplication
            }
            directedMengerReservoirApplication={
              playground
                .directedMengerReservoirApplication
            }
            outdegreeGuarantees={
              playground
                .outdegreePossibilities
            }
            onOpenLovaszReference={() =>
              setActiveReference({
                type:
                  'lovasz',
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
            onOpenAvoidCReference={(
              target,
              c,
            ) =>
              setActiveReference({
                type:
                  'avoid-c',

                target,

                c,
              })
            }
            onOpenMaLuReference={
              openAppliedMaLuReference
            }
            onOpenHasanvandReference={
              openAppliedHasanvandReference
            }
            onOpenStabilizeOutdegreeClassReference={
              openAppliedStabilizeReference
            }
            onOpenDirectedMengerReference={
              openAppliedDirectedMengerReference
            }
            onOpenDirectedMengerReservoirReference={
              openDirectedMengerReservoirReference
            }
            onOpenTwoFactorReference={() =>
              setActiveReference({
                type:
                  'oriented-two-factor',
              })
            }
          />

          <div
            style={{
              marginTop:
                '28px',

              display:
                'flex',

              justifyContent:
                'center',

              gap:
                '14px',

              alignItems:
                'flex-start',
            }}
          >
            <ToolMenu
              workingDegree={
                playground
                  .workingDegree
              }
              fixedOutdegreeContribution={
                playground
                  .fixedOutdegreeContribution
              }
              globalForbiddenSet={
                forbiddenSet
              }
              partition={
                playground
                  .partition
              }
              acrossDirection={
                playground
                  .acrossDirection
              }
              balancedG={
                playground
                  .balancedG
              }
              balancedL={
                playground
                  .balancedL
              }
              balancedR={
                playground
                  .balancedR
              }
              avoidCG={
                playground
                  .avoidCG
              }
              avoidCL={
                playground
                  .avoidCL
              }
              avoidCR={
                playground
                  .avoidCR
              }
              maLuG={
                playground
                  .maLuG
              }
              maLuL={
                playground
                  .maLuL
              }
              maLuR={
                playground
                  .maLuR
              }
              hasanvandG={
                playground
                  .hasanvandG
              }
              hasanvandL={
                playground
                  .hasanvandL
              }
              hasanvandR={
                playground
                  .hasanvandR
              }
              stabilizeOutdegreeClassApplied={
                playground
                  .stabilizeOutdegreeClassApplied
              }
              canStabilizeG={
                playground
                  .canStabilizeG
              }
              canStabilizeL={
                playground
                  .canStabilizeL
              }
              canStabilizeR={
                playground
                  .canStabilizeR
              }
              preStabilizationOutdegreePossibilities={
                playground
                  .preStabilizationOutdegreePossibilities
              }
              onApplyStabilizeOutdegreeClass={
                playground
                  .applyStabilizeOutdegreeClass
              }
              onOpenStabilizeOutdegreeClassReference={
                openStabilizeSelectorReference
              }
              directedMengerApplied={
                playground
                  .directedMengerApplied
              }
              canApplyDirectedMengerRepair={
                playground
                  .canApplyDirectedMengerRepair
              }
              onOpenDirectedMengerWorkspace={
                openDirectedMengerWorkspace
              }
              directedMengerReservoirCandidate={
                playground
                  .directedMengerReservoirCandidate
              }
              onApplyDirectedMengerReservoirRepair={
                playground
                  .applyDirectedMengerReservoirRepair
              }
              onOpenDirectedMengerReservoirReference={
                openDirectedMengerReservoirReference
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
              onAvoidCGraph={
                playground
                  .avoidCGraph
              }
              onAvoidCPart={
                playground
                  .avoidCPart
              }
              onApplyMaLuGraph={
                playground
                  .applyMaLuGraph
              }
              onApplyMaLuPart={
                playground
                  .applyMaLuPart
              }
              onOpenMaLuReference={
                openMaLuSelectorReference
              }
              onTakeOrientedTwoFactor={
                playground
                  .takeOrientedTwoFactor
              }
              onApplyHasanvand={
                playground
                  .applyHasanvandCompression
              }
              onOpenHasanvandReference={
                openHasanvandSelectorReference
              }
            />

            {playground.canUndo && (
              <button
                type="button"
                onClick={
                  reset
                }
                style={{
                  font:
                    'inherit',

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

          {directedMengerWorkspaceOpen &&
            playground
              .canApplyDirectedMengerRepair && (
              <DirectedMengerWorkspace
                degree={
                  degree
                }
                forbiddenSet={
                  forbiddenSet
                }
                possibleOutdegrees={
                  preRepairTotalOutdegrees
                }
                onOpenReference={
                  openDirectedMengerTheorem
                }
                onApply={
                  applyDirectedMengerRepair
                }
                onBack={
                  closeDirectedMengerWorkspace
                }
              />
            )}

          <div
            style={{
              marginTop:
                '24px',
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
                          key={
                            index
                          }
                        >
                          Lovász{' '}

                          <Math>
                            {
                              `(${move.application.pair.s},${move.application.pair.t})`
                            }
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
                          key={
                            index
                          }
                        >
                          Orient{' '}

                          <Math>
                            {
                              move.direction ===
                              'L-to-R'
                                ? 'L\\to R'
                                : 'R\\to L'
                            }
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
                          key={
                            index
                          }
                        >
                          Balance{' '}

                          <Math>
                            {
                              move.part
                            }
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
                          key={
                            index
                          }
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
                      'avoid-c-whole-graph'
                    ) {
                      return (
                        <span
                          key={
                            index
                          }
                        >
                          Avoid{' '}

                          <Math>
                            {
                              `c=${move.c}`
                            }
                          </Math>{' '}

                          in{' '}

                          <Math>
                            {'G'}
                          </Math>
                        </span>
                      )
                    }

                    if (
                      move.type ===
                      'avoid-c-part'
                    ) {
                      return (
                        <span
                          key={
                            index
                          }
                        >
                          Avoid{' '}

                          <Math>
                            {
                              `c=${move.c}`
                            }
                          </Math>{' '}

                          in{' '}

                          <Math>
                            {
                              move.part
                            }
                          </Math>
                        </span>
                      )
                    }

                    if (
                      move.type ===
                      'ma-lu-whole-graph'
                    ) {
                      return (
                        <span
                          key={
                            index
                          }
                        >
                          Ma–Lu on{' '}

                          <Math>
                            {'G'}
                          </Math>

                          {move
                            .application
                            .mode ===
                          'total' ? (
                            <>
                              , eliminate
                              total{' '}

                              <Math>
                                {
                                  latexSet(
                                    move
                                      .application
                                      .selectedValues,
                                  )
                                }
                              </Math>
                            </>
                          ) : (
                            <>
                              , avoid{' '}

                              <Math>
                                {
                                  latexSet(
                                    move
                                      .application
                                      .selectedValues,
                                  )
                                }
                              </Math>
                            </>
                          )}
                        </span>
                      )
                    }

                    if (
                      move.type ===
                      'ma-lu-part'
                    ) {
                      return (
                        <span
                          key={
                            index
                          }
                        >
                          Ma–Lu on{' '}

                          <Math>
                            {
                              move
                                .application
                                .target
                            }
                          </Math>

                          {move
                            .application
                            .mode ===
                          'total' ? (
                            <>
                              , eliminate
                              total{' '}

                              <Math>
                                {
                                  latexSet(
                                    move
                                      .application
                                      .selectedValues,
                                  )
                                }
                              </Math>
                            </>
                          ) : (
                            <>
                              , avoid{' '}

                              <Math>
                                {
                                  latexSet(
                                    move
                                      .application
                                      .selectedValues,
                                  )
                                }
                              </Math>{' '}

                              internally
                            </>
                          )}
                        </span>
                      )
                    }

                    if (
                      move.type ===
                      'oriented-two-factor'
                    ) {
                      return (
                        <span
                          key={
                            index
                          }
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
                      const application =
                        move.application

                      return (
                        <span
                          key={
                            index
                          }
                        >
                          Hasanvand on{' '}

                          <Math>
                            {
                              getHasanvandTargetLatex(
                                application
                                  .target,
                              )
                            }
                          </Math>
                          ,{' '}

                          <Math>
                            {
                              getHasanvandRuleLatex(
                                application,
                              )
                            }
                          </Math>
                        </span>
                      )
                    }

                    if (
                      move.type ===
                      'stabilize-outdegree-class'
                    ) {
                      return (
                        <span
                          key={
                            index
                          }
                        >
                          Stabilize{' '}

                          <Math>
                            {
                              `${move.application.q}`
                            }
                          </Math>
                          -class in{' '}

                          <Math>
                            {
                              getStabilizeTargetLatex(
                                move
                                  .application
                                  .target,
                              )
                            }
                          </Math>
                        </span>
                      )
                    }

                    if (
                      move.type ===
                      'directed-menger-repair'
                    ) {
                      return (
                        <span
                          key={
                            index
                          }
                        >
                          Directed
                          Menger repair{' '}

                          <Math>
                            {
                              getMengerRepairLatex(
                                move
                                  .application,
                              )
                            }
                          </Math>
                        </span>
                      )
                    }

                    if (
                      move.type ===
                      'directed-menger-reservoir-repair'
                    ) {
                      return (
                        <span
                          key={
                            index
                          }
                        >
                          Reservoir
                          Menger repair{' '}

                          <Math>
                            {
                              `${move.application.q}`
                              + '\\to'
                              + `${move.application.repairedOutdegree}`
                            }
                          </Math>
                        </span>
                      )
                    }

                    return null
                  },
                )
              }
              canUndo={
                playground
                  .canUndo
              }
              onUndo={
                undo
              }
            />
          </div>
        </div>
      </main>

      <ToolReferencePanel
        open={
          activeReference !==
          null
        }
        title={
          referenceTitle
        }
        onClose={() =>
          setActiveReference(
            null,
          )
        }
      >
        {activeReference?.type ===
          'lovasz' && (
          <LovaszPartitionReference
            partition={
              playground
                .partition
            }
            application={
              playground
                .lovaszApplication
            }
          />
        )}

        {activeReference?.type ===
          'balanced-orientation' && (
          <BalancedOrientationReference
            target={
              activeReference
                .target
            }
            degree={
              playground
                .workingDegree
            }
            partition={
              playground
                .partition
            }
          />
        )}

        {activeReference?.type ===
          'oriented-two-factor' && (
          <OrientedTwoFactorReference
            degree={
              playground
                .workingDegree +
              2
            }
          />
        )}

        {activeReference?.type ===
          'hasanvand-compression' && (
          <HasanvandCompressionReference
            target={
              activeReference
                .target
            }
            application={
              activeReference
                .application
            }
          />
        )}

        {activeReference?.type ===
          'avoid-c' && (
          <AvoidCReference
            target={
              activeReference
                .target
            }
            c={
              activeReference.c
            }
            degree={
              playground
                .workingDegree
            }
            partition={
              playground
                .partition
            }
          />
        )}

        {activeReference?.type ===
          'ma-lu' && (
          <MaLuReference
            target={
              activeReference
                .target
            }
            degree={
              playground
                .workingDegree
            }
            fixedOutdegreeContribution={
              playground
                .fixedOutdegreeContribution
            }
            partition={
              playground
                .partition
            }
            acrossDirection={
              playground
                .acrossDirection
            }
            application={
              activeReference
                .application
            }
          />
        )}

        {activeReference?.type ===
          'stabilize-outdegree-class' && (
          <StabilizeOutdegreeClassReference
            target={
              activeReference
                .target
            }
            application={
              activeReference
                .application
            }
          />
        )}

        {activeReference?.type ===
          'directed-menger' && (
          <DirectedMengerRepairReference
            degree={
              degree
            }
            forbiddenSet={
              forbiddenSet
            }
            application={
              activeReference
                .application
            }
          />
        )}

        {activeReference?.type ===
          'directed-menger-reservoir' && (
          <DirectedMengerReservoirReference
            application={
              activeReference
                .application
            }
          />
        )}
      </ToolReferencePanel>
    </>
  )
}