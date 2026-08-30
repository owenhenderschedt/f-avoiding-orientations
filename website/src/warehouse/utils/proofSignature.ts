import type {
  WarehouseProofRecipe,
  WarehouseProofStep,
} from '../types'

function targetLabel(
  target:
    string,
) {
  if (
    target ===
      'G'
  ) {
    return 'G'
  }

  if (
    target ===
      'L'
  ) {
    return 'L'
  }

  if (
    target ===
      'R'
  ) {
    return 'R'
  }

  return target
}

export function warehouseStepSignature(
  step:
    WarehouseProofStep,
) {
  switch (
    step.type
  ) {
    case 'oriented-two-factor':
      return '2-Factor'

    case 'lovasz-partition':
      return (
        `Lovász(${step.s},${step.t})`
      )

    case 'orient-across':
      return (
        step.direction ===
          'L-to-R'
          ? 'L→R'
          : 'R→L'
      )

    case 'balance':
      return (
        `Balance ${targetLabel(
          step.target,
        )}`
      )

    case 'avoid-c':
      return (
        `Avoid ${step.c} on ${targetLabel(
          step.target,
        )}`
      )

    case 'ma-lu':
      return (
        `Ma–Lu ${targetLabel(
          step.target,
        )}`
      )

    case 'hasanvand':
      return (
        `Hasanvand ${targetLabel(
          step.target,
        )}`
      )

    case 'parity-bounds':
      return (
        `Parity [${step.normalLower},${step.normalUpper}], `
        +
        `[${step.exceptionalLower},${step.exceptionalUpper}]`
      )

    case 'stabilize-outdegree-class':
      return (
        `Stabilize ${targetLabel(
          step.target,
        )}`
      )

    case 'directed-menger-local':
      return 'Menger repair'

    case 'directed-menger-reservoir':
      return 'Menger reservoir'

    case 'lower-degree-certificate':
      return (
        `d=${step.residualDegree} certificate`
      )

    case 'bounded-degree-constructor':
      return (
        `Bounded degree ${targetLabel(
          step.target,
        )}`
      )

    case 'interval-reduction':
      return (
        `Interval ${step.mode}=${step.parameter}`
      )
  }
}

export function warehouseRecipeSignature(
  recipe:
    WarehouseProofRecipe,
) {
  return recipe.steps
    .map(
      warehouseStepSignature,
    )
    .join(' → ')
}

export function warehouseRecipeLength(
  recipe:
    WarehouseProofRecipe,
) {
  return recipe.steps.length
}
