import type {
  WarehouseProofRecipe,
} from '../types'

/*
 * Human-curated preferred proofs live here.
 *
 * Generated audit recipes are NEVER edited
 * by hand.  If we later find a shorter or
 * more illuminating proof for a case, add
 * that recipe here under the case id and it
 * will take precedence over data/generated.
 *
 * Phase 3 starts with no overrides.
 */
const preferredOverrides:
  Readonly<
    Record<
      string,
      WarehouseProofRecipe
    >
  > = {}

export function getPreferredOverride(
  caseId:
    string,
) {
  return (
    preferredOverrides[
      caseId
    ] ??
    null
  )
}

export default
  preferredOverrides
