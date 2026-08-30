import {
  d4PreferredRecipes,
} from './d4'
import {
  d6PreferredRecipes,
} from './d6'
import {
  d8PreferredRecipes,
} from './d8'
import {
  d10PreferredRecipes,
} from './d10'
import {
  d12PreferredRecipes,
} from './d12'
import type {
  WarehouseDegree,
  WarehouseProofRecipe,
} from '../../types'

const generatedByDegree:
  Readonly<
    Record<
      WarehouseDegree,
      Readonly<
        Record<
          string,
          WarehouseProofRecipe
        >
      >
    >
  > = {
  4:
    d4PreferredRecipes,

  6:
    d6PreferredRecipes,

  8:
    d8PreferredRecipes,

  10:
    d10PreferredRecipes,

  12:
    d12PreferredRecipes,
}

export function getGeneratedPreferredRecipe({
  degree,
  caseId,
}: {
  degree:
    WarehouseDegree

  caseId:
    string
}) {
  return (
    generatedByDegree[
      degree
    ][
      caseId
    ] ??
    null
  )
}
