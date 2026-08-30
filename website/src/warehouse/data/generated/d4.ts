import type {
  WarehouseProofRecipe,
} from '../../types'

/*
 * Degree 4 is the first Warehouse data
 * checkpoint.
 *
 * These are exactly the one-step recipes
 * selected by the current audit search:
 *
 *   {0} <-> {4}: Balance G
 *   {1} <-> {3}: Balance G
 *   {2}:           Avoid c=2 on G
 *
 * The first member listed in each reversal
 * class is the canonical representative
 * stored by playgroundCases.ts.
 */
export const d4PreferredRecipes:
  Readonly<
    Record<
      string,
      WarehouseProofRecipe
    >
  > = {
  '4-0-4': {
    id:
      'audit-d4-0-4',

    source:
      'audit',

    degree:
      4,

    forbiddenSet: [
      0,
    ],

    steps: [
      {
        type:
          'balance',

        target:
          'G',
      },
    ],

    finalOutdegreesL: [
      2,
    ],

    finalOutdegreesR: [
      2,
    ],
  },

  '4-1-3': {
    id:
      'audit-d4-1-3',

    source:
      'audit',

    degree:
      4,

    forbiddenSet: [
      1,
    ],

    steps: [
      {
        type:
          'balance',

        target:
          'G',
      },
    ],

    finalOutdegreesL: [
      2,
    ],

    finalOutdegreesR: [
      2,
    ],
  },

  '4-2': {
    id:
      'audit-d4-2',

    source:
      'audit',

    degree:
      4,

    forbiddenSet: [
      2,
    ],

    steps: [
      {
        type:
          'avoid-c',

        target:
          'G',

        c:
          2,
      },
    ],

    finalOutdegreesL: [
      0,
      1,
      3,
      4,
    ],

    finalOutdegreesR: [
      0,
      1,
      3,
      4,
    ],
  },
}

export default
  d4PreferredRecipes
