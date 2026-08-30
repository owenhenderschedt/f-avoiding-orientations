import type {
  WarehouseDegree,
  WarehouseProofRecipe,
} from '../../types'
import {
  d4PreferredRecipes,
} from './d4'

const emptyRecipes:
  Readonly<
    Record<
      string,
      WarehouseProofRecipe
    >
  > = {}

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
    emptyRecipes,

  8:
    emptyRecipes,

  10:
    emptyRecipes,

  12:
    emptyRecipes,
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
