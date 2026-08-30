import Math from '../../components/Math'
import ToolReferencePanel from '../../components/ToolReferencePanel'
import {
  BalancedOrientationReference,
  balancedOrientationTool,
} from '../../tools/balancedOrientation'
import {
  AvoidCReference,
  avoidCTool,
} from '../../tools/avoidC'
import {
  LovaszPartitionReference,
  lovaszPartitionTool,
} from '../../tools/lovaszPartition'
import {
  OrientedTwoFactorReference,
  orientedTwoFactorTool,
} from '../../tools/orientedTwoFactor'
import {
  getAcrossOutdegreeGuarantees,
  orientAcrossPartitionTool,
} from '../../tools/orientAcrossPartition'
import {
  MaLuReference,
  maLuTool,
} from '../../tools/maLu'
import {
  createMaLuInternalApplication,
  createMaLuTotalApplication,
} from '../../tools/maLuApplication'
import {
  getMaLuTotalCertificate,
} from '../../tools/maLuTargeting'
import {
  HasanvandCompressionReference,
  hasanvandCompressionTool,
} from '../../tools/hasanvandCompression'
import {
  createHasanvandApplication,
} from '../../tools/hasanvandApplication'
import {
  ParityBoundsReference,
} from '../../tools/parityBounds'
import {
  createParityBoundsApplication,
} from '../../tools/parityBoundsApplication'
import type {
  WarehouseProofRecipe,
  WarehouseProofStep,
} from '../types'
import {
  warehouseStepSignature,
} from '../utils/proofSignature'
import {
  getWarehouseStepContext,
} from '../utils/warehouseStepContext'

export type WarehouseActiveReference = {
  recipe:
    WarehouseProofRecipe

  step:
    WarehouseProofStep

  stepIndex:
    number
} | null

type WarehouseToolReferencePanelProps = {
  activeReference:
    WarehouseActiveReference

  onClose:
    () => void
}

function integerRange(
  maximum:
    number,
) {
  return Array.from(
    {
      length:
        maximum + 1,
    },
    (
      _,
      value,
    ) =>
      value,
  )
}

function numberSetLatex(
  values:
    readonly number[],
) {
  return (
    '\\{' +
    values.join(',') +
    '\\}'
  )
}

export default function WarehouseToolReferencePanel({
  activeReference,
  onClose,
}: WarehouseToolReferencePanelProps) {
  const recipe =
    activeReference
      ?.recipe ??
    null

  const step =
    activeReference
      ?.step ??
    null

  const context =
    recipe !==
      null &&
    activeReference !==
      null
      ? getWarehouseStepContext(
          recipe,
          activeReference
            .stepIndex,
        )
      : null

  let title =
    step ===
      null
      ? 'Proof move'
      : warehouseStepSignature(
          step,
        )

  if (
    step?.type ===
      'balance'
  ) {
    title =
      balancedOrientationTool.name
  } else if (
    step?.type ===
      'avoid-c'
  ) {
    title =
      avoidCTool.name
  } else if (
    step?.type ===
      'lovasz-partition'
  ) {
    title =
      lovaszPartitionTool.name
  } else if (
    step?.type ===
      'oriented-two-factor'
  ) {
    title =
      orientedTwoFactorTool.name
  } else if (
    step?.type ===
      'orient-across'
  ) {
    title =
      orientAcrossPartitionTool.name
  } else if (
    step?.type ===
      'ma-lu'
  ) {
    title =
      maLuTool.name
  } else if (
    step?.type ===
      'hasanvand'
  ) {
    title =
      hasanvandCompressionTool.name
  } else if (
    step?.type ===
      'parity-bounds'
  ) {
    title =
      'Parity Bounds'
  }

  let maLuApplication =
    null

  if (
    step?.type ===
      'ma-lu' &&
    context !==
      null
  ) {
    if (
      step.mode ===
        'internal'
    ) {
      maLuApplication =
        createMaLuInternalApplication(
          step.target,
          step.selectedValues,
        )
    } else {
      const certificate =
        getMaLuTotalCertificate({
          target:
            step.target,

          workingDegree:
            context
              .workingDegree,

          fixedOutdegreeContribution:
            context
              .fixedOutdegreeContribution,

          partition:
            context.partition,

          acrossDirection:
            context
              .acrossDirection,

          selectedTotalOutdegrees:
            step.selectedValues,
        })

      if (
        certificate.ready &&
        certificate.applicable
      ) {
        maLuApplication =
          createMaLuTotalApplication(
            step.target,
            step.selectedValues,
            certificate.checks,
          )
      }
    }
  }

  let hasanvandApplication =
    null

  if (
    step?.type ===
      'hasanvand' &&
    context !==
      null
  ) {
    const maxDegree =
      step.target ===
        'G'
        ? context
            .workingDegree
        : step.target ===
            'L'
          ? context
              .partition
              ?.s ??
            0
          : context
              .partition
              ?.t ??
            0

    const possibleDegrees =
      step.target ===
        'G'
        ? [
            context
              .workingDegree,
          ]
        : integerRange(
            maxDegree,
          )

    hasanvandApplication =
      createHasanvandApplication({
        target:
          step.target,

        mode:
          step.mode,

        maxDegree,

        possibleDegrees,

        rules:
          step.rules,
      })
  }

  let parityApplication =
    null

  if (
    step?.type ===
      'parity-bounds' &&
    context !==
      null
  ) {
    parityApplication =
      createParityBoundsApplication({
        workingDegree:
          context
            .workingDegree,

        fixedOutdegreeContribution:
          context
            .fixedOutdegreeContribution,

        normalLower:
          step.normalLower,

        normalUpper:
          step.normalUpper,

        exceptionalLower:
          step.exceptionalLower,

        exceptionalUpper:
          step.exceptionalUpper,
      })
  }

  const lovaszPair =
    step?.type ===
      'lovasz-partition'
      ? {
          s:
            step.s,

          t:
            step.t,
        }
      : context
          ?.partition ??
        null

  const acrossGuarantees =
    step?.type ===
      'orient-across' &&
    context !==
      null &&
    context.partition !==
      null
      ? getAcrossOutdegreeGuarantees(
          context
            .workingDegree,

          context
            .partition,

          step.direction,
        )
      : null

  return (
    <ToolReferencePanel
      open={
        activeReference !==
        null
      }
      title={
        title
      }
      onClose={
        onClose
      }
    >
      {step?.type ===
        'balance' &&
        context !==
          null && (
        <BalancedOrientationReference
          target={
            step.target
          }
          degree={
            context
              .workingDegree
          }
          partition={
            context.partition
          }
        />
      )}

      {step?.type ===
        'avoid-c' &&
        context !==
          null && (
        <AvoidCReference
          target={
            step.target
          }
          c={
            step.c
          }
          degree={
            context
              .workingDegree
          }
          partition={
            context.partition
          }
        />
      )}

      {step?.type ===
        'lovasz-partition' && (
        <LovaszPartitionReference
          partition={
            lovaszPair
          }
        />
      )}

      {step?.type ===
        'oriented-two-factor' &&
        context !==
          null && (
        <OrientedTwoFactorReference
          degree={
            context
              .workingDegree
          }
        />
      )}

      {step?.type ===
        'orient-across' &&
        context !==
          null && (
        <>
          <section
            style={{
              marginBottom:
                '30px',
            }}
          >
            <h3
              style={{
                marginTop:
                  0,
              }}
            >
              Applied cut orientation
            </h3>

            <p>
              Orient every edge between{' '}
              <Math>{'L'}</Math>{' '}
              and{' '}
              <Math>{'R'}</Math>{' '}
              in the direction{' '}

              <Math>
                {
                  step.direction ===
                    'L-to-R'
                    ? 'L\\to R'
                    : 'R\\to L'
                }
              </Math>
              .
            </p>

            {context.partition !==
              null && (
              <p>
                The current Lovász bounds are{' '}

                <Math>
                  {
                    `\\Delta(G[L])\\le ${context.partition.s}`
                  }
                </Math>{' '}

                and{' '}

                <Math>
                  {
                    `\\Delta(G[R])\\le ${context.partition.t}.`
                  }
                </Math>
              </p>
            )}
          </section>

          {acrossGuarantees !==
            null && (
            <section>
              <h3>
                Outdegree ranges from the cut
              </h3>

              <p>
                On{' '}
                <Math>{'L'}</Math>:{' '}

                <Math>
                  {
                    numberSetLatex(
                      acrossGuarantees.L,
                    )
                  }
                </Math>
              </p>

              <p>
                On{' '}
                <Math>{'R'}</Math>:{' '}

                <Math>
                  {
                    numberSetLatex(
                      acrossGuarantees.R,
                    )
                  }
                </Math>
              </p>
            </section>
          )}
        </>
      )}

      {step?.type ===
        'ma-lu' &&
        context !==
          null && (
        <MaLuReference
          target={
            step.target
          }
          degree={
            context
              .workingDegree
          }
          fixedOutdegreeContribution={
            context
              .fixedOutdegreeContribution
          }
          partition={
            context.partition
          }
          acrossDirection={
            context
              .acrossDirection
          }
          application={
            maLuApplication
          }
        />
      )}

      {step?.type ===
        'hasanvand' && (
        <HasanvandCompressionReference
          target={
            step.target
          }
          application={
            hasanvandApplication
          }
        />
      )}

      {step?.type ===
        'parity-bounds' && (
        <ParityBoundsReference
          application={
            parityApplication
          }
        />
      )}

      {step !==
        null &&
        (
          step.type ===
            'stabilize-outdegree-class' ||
          step.type ===
            'directed-menger-local' ||
          step.type ===
            'directed-menger-reservoir' ||
          step.type ===
            'lower-degree-certificate' ||
          step.type ===
            'bounded-degree-constructor' ||
          step.type ===
            'interval-reduction'
        ) && (
        <section>
          <h3
            style={{
              marginTop:
                0,
            }}
          >
            Applied proof move
          </h3>

          <p>
            This move is recorded in the
            Warehouse recipe. Its exact
            applied-certificate reconstruction
            will be wired before recipes using
            this move are loaded.
          </p>
        </section>
      )}
    </ToolReferencePanel>
  )
}
