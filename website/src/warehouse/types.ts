import type {
  AuditProofStep,
} from '../audit/proofRecipes'

export type WarehouseDegree =
  4 | 6 | 8 | 10 | 12

export type WarehouseToolId =
  | 'oriented-two-factor'
  | 'lovasz-partition'
  | 'orient-across'
  | 'balance'
  | 'avoid-c'
  | 'ma-lu'
  | 'hasanvand'
  | 'parity-bounds'
  | 'stabilize-outdegree-class'
  | 'directed-menger-local'
  | 'directed-menger-reservoir'
  | 'lower-degree-certificate'

/*
 * The Warehouse stores proof DATA, not
 * search state.
 *
 * AuditProofStep is reused as the canonical
 * step schema so the audit and warehouse
 * cannot silently disagree about what a
 * proof move means.
 *
 * This is a type-only dependency: importing
 * Warehouse data does NOT run the audit.
 */
export type WarehouseProofStep =
  AuditProofStep

export type WarehouseProofRecipe = {
  id:
    string

  /*
   * "audit" means this recipe was selected
   * directly from a successful audit result.
   *
   * "curated" is reserved for a later human
   * preferred proof that replaces the
   * automatically selected recipe.
   */
  source:
    'audit' | 'curated'

  degree:
    WarehouseDegree

  forbiddenSet:
    readonly number[]

  steps:
    readonly WarehouseProofStep[]

  finalOutdegreesL:
    readonly number[]

  finalOutdegreesR:
    readonly number[]
}

export type WarehouseCaseRecord = {
  id: string

  degree:
    WarehouseDegree

  /*
   * Canonical representative of the
   * reversal class currently displayed.
   */
  forbiddenSet:
    readonly number[]

  /*
   * The other member of the reversal
   * class.  For a self-reversing case this
   * is identical to forbiddenSet.
   */
  reversal:
    readonly number[]

  selfReversing:
    boolean

  preferredRecipeId:
    string | null

  preferredRecipe:
    WarehouseProofRecipe | null
}

export type WarehouseSortMode =
  | 'lexicographic'
  | 'reverse-lexicographic'
