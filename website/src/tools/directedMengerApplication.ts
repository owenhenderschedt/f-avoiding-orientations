import {
  getDemandFinalOutdegree,
  getDirectedMengerRepairCertificate,
  type DirectedMengerRepairCertificate,
  type MengerCapacityRule,
  type MengerDemandRule,
  type MengerRepairDirection,
} from './directedMengerMath'
import type {
  DirectedMengerReservoirApplication,
} from './directedMengerReservoirApplication'

/*
 * Existing V2 local-alpha application.
 *
 * We keep the exported name
 *
 *   DirectedMengerApplication
 *
 * for backward compatibility while the
 * rest of the playground is upgraded to
 * understand multiple Directed Menger
 * certificate modes.
 */
export type DirectedMengerApplication = {
  /*
   * New explicit mode label.
   *
   * It is optional rather than required
   * so any old in-memory V2 application
   * remains structurally compatible
   * during hot reload.
   *
   * Every newly created application
   * receives mode = 'local-alpha'.
   */
  mode?:
    'local-alpha'

  /*
   * Degree of the regular graph whose
   * orientation is being repaired.
   */
  degree: number

  /*
   * Which one-sided repair is being
   * performed.
   *
   * increase:
   *
   *   bad class q -> q+r
   *
   * decrease:
   *
   *   bad class q -> q-r
   */
  direction:
    MengerRepairDirection

  /*
   * Total outdegree classes that were
   * possible immediately before the
   * repair.
   *
   * Storing this makes the application
   * self-contained and lets the
   * playground verify that it is being
   * applied to the orientation for
   * which it was certified.
   */
  startingOutdegrees:
    number[]

  /*
   * Each bad class receives an exact
   * repair amount.
   *
   * increase:
   *
   *   q -> q + demand
   *
   * decrease:
   *
   *   q -> q - demand
   */
  demandRules:
    MengerDemandRule[]

  /*
   * Each buffer class may be used at
   * most capacity times.
   *
   * increase:
   *
   *   q, q-1, ..., q-capacity
   *
   * decrease:
   *
   *   q, q+1, ..., q+capacity
   *
   * Classes omitted here have capacity
   * zero.
   */
  capacityRules:
    MengerCapacityRule[]

  /*
   * The alpha interval certifying the
   * local directed-Menger condition.
   */
  alphaLowerBound:
    number

  alphaUpperBound:
    number
}

/*
 * Directed Menger V3 has two ways of
 * certifying the SAME path-reversal
 * theorem:
 *
 *   1. local-alpha
 *   2. reservoir
 *
 * Existing files can continue importing
 * DirectedMengerApplication until they
 * are upgraded.
 *
 * New proof-state files should use this
 * union whenever either mode may occur.
 */
export type AnyDirectedMengerApplication =
  | DirectedMengerApplication
  | DirectedMengerReservoirApplication

function uniqueSorted(
  values:
    readonly number[],
) {
  return Array.from(
    new Set(values),
  ).sort(
    (a, b) =>
      a - b,
  )
}

function copyDemandRules(
  rules:
    readonly MengerDemandRule[],
) {
  return rules.map(
    (rule) => ({
      outdegree:
        rule.outdegree,

      demand:
        rule.demand,
    }),
  )
}

function copyCapacityRules(
  rules:
    readonly MengerCapacityRule[],
) {
  return rules.map(
    (rule) => ({
      outdegree:
        rule.outdegree,

      capacity:
        rule.capacity,
    }),
  )
}

/*
 * Type guard for the new reservoir
 * application.
 */
export function isDirectedMengerReservoirApplication(
  application:
    AnyDirectedMengerApplication,
): application is DirectedMengerReservoirApplication {
  return (
    application.mode ===
    'reservoir'
  )
}

/*
 * Type guard for the old local-alpha
 * application.
 *
 * Old V2 objects may have no explicit
 * mode field, so anything that is not a
 * reservoir application is treated as
 * local-alpha.
 */
export function isDirectedMengerLocalApplication(
  application:
    AnyDirectedMengerApplication,
): application is DirectedMengerApplication {
  return (
    application.mode !==
    'reservoir'
  )
}

export function createDirectedMengerApplication({
  degree,
  forbiddenSet,
  currentOutdegrees,
  demandRules,
  capacityRules,
  direction = 'increase',
}: {
  degree:
    number

  forbiddenSet:
    readonly number[]

  currentOutdegrees:
    readonly number[]

  demandRules:
    readonly MengerDemandRule[]

  capacityRules:
    readonly MengerCapacityRule[]

  /*
   * Optional so older V1-style callers
   * still default to upward repairs.
   */
  direction?:
    MengerRepairDirection
}):
  | DirectedMengerApplication
  | null {
  const certificate =
    getDirectedMengerRepairCertificate({
      degree,

      forbiddenSet,

      currentOutdegrees,

      demandRules,

      capacityRules,

      direction,
    })

  if (
    !certificate.applicable
  ) {
    return null
  }

  return {
    mode:
      'local-alpha',

    degree,

    /*
     * Store the direction actually
     * certified by the math engine.
     */
    direction:
      certificate.direction,

    startingOutdegrees:
      uniqueSorted(
        currentOutdegrees,
      ),

    demandRules:
      copyDemandRules(
        demandRules,
      ),

    capacityRules:
      copyCapacityRules(
        capacityRules,
      ),

    alphaLowerBound:
      certificate
        .alphaCertificate
        .lowerBound,

    alphaUpperBound:
      certificate
        .alphaCertificate
        .upperBound,
  }
}

export function getDirectedMengerApplicationCertificate({
  application,
  forbiddenSet,
}: {
  application:
    DirectedMengerApplication

  forbiddenSet:
    readonly number[]
}): DirectedMengerRepairCertificate {
  return (
    getDirectedMengerRepairCertificate({
      degree:
        application.degree,

      forbiddenSet,

      currentOutdegrees:
        application
          .startingOutdegrees,

      demandRules:
        application
          .demandRules,

      capacityRules:
        application
          .capacityRules,

      direction:
        application.direction,
    })
  )
}

export function getDirectedMengerApplicationLabel(
  application:
    AnyDirectedMengerApplication,
) {
  if (
    isDirectedMengerReservoirApplication(
      application,
    )
  ) {
    return (
      `Reservoir Menger `
      + `${application.q}`
      + '→'
      + `${application.repairedOutdegree}`
    )
  }

  const repairs =
    application
      .demandRules
      .map(
        (rule) => {
          const finalOutdegree =
            getDemandFinalOutdegree({
              outdegree:
                rule.outdegree,

              demand:
                rule.demand,

              direction:
                application.direction,
            })

          return (
            `${rule.outdegree}`
            + '→'
            + `${finalOutdegree}`
          )
        },
      )

  if (
    repairs.length ===
    0
  ) {
    return (
      'Menger repair'
    )
  }

  return (
    `Menger repair ${repairs.join(
      ', ',
    )}`
  )
}