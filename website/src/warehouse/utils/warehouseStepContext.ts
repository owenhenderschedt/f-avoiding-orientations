import type {
  LovaszPair,
} from '../../tools/lovaszPartition'
import type {
  AcrossDirection,
} from '../../tools/orientAcrossPartition'
import type {
  WarehouseProofRecipe,
} from '../types'

export type WarehouseStepContext = {
  workingDegree:
    number

  fixedOutdegreeContribution:
    number

  partition:
    LovaszPair | null

  acrossDirection:
    AcrossDirection | null
}

/*
 * Structural information immediately
 * BEFORE one Warehouse proof step.
 *
 * This lets the Warehouse reuse the exact
 * mathematical reference components from
 * the Playground without rerunning the
 * audit search.
 */
export function getWarehouseStepContext(
  recipe:
    WarehouseProofRecipe,

  stepIndex:
    number,
): WarehouseStepContext {
  let workingDegree:
    number =
      recipe.degree

  let fixedOutdegreeContribution =
    0

  let partition:
    LovaszPair | null =
      null

  let acrossDirection:
    AcrossDirection | null =
      null

  for (
    let index = 0;
    index <
      stepIndex;
    index += 1
  ) {
    const step =
      recipe.steps[
        index
      ]

    if (
      step.type ===
        'oriented-two-factor'
    ) {
      workingDegree =
        globalThis.Math.max(
          0,
          workingDegree - 2,
        )

      fixedOutdegreeContribution +=
        1
    }

    if (
      step.type ===
        'lovasz-partition'
    ) {
      partition = {
        s:
          step.s,

        t:
          step.t,
      }
    }

    if (
      step.type ===
        'orient-across'
    ) {
      acrossDirection =
        step.direction
    }
  }

  return {
    workingDegree,

    fixedOutdegreeContribution,

    partition,

    acrossDirection,
  }
}
