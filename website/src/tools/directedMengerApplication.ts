import {
  getDirectedMengerRepairCertificate,
  type DirectedMengerRepairCertificate,
  type MengerCapacityRule,
  type MengerDemandRule,
} from './directedMengerMath'

export type DirectedMengerApplication = {
  /*
   * Degree of the regular graph whose
   * orientation is being repaired.
   */
  degree: number

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
  startingOutdegrees: number[]

  /*
   * A receiver of current outdegree q
   * with demand r finishes at q+r.
   */
  demandRules:
    MengerDemandRule[]

  /*
   * A donor of current outdegree q
   * with capacity c may finish at any
   * value
   *
   *   q, q-1, ..., q-c.
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
  alphaLowerBound: number

  alphaUpperBound: number
}

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

export function createDirectedMengerApplication({
  degree,
  forbiddenSet,
  currentOutdegrees,
  demandRules,
  capacityRules,
}: {
  degree: number

  forbiddenSet:
    readonly number[]

  currentOutdegrees:
    readonly number[]

  demandRules:
    readonly MengerDemandRule[]

  capacityRules:
    readonly MengerCapacityRule[]
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
    })

  if (
    !certificate.applicable
  ) {
    return null
  }

  return {
    degree,

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
    })
  )
}

export function getDirectedMengerApplicationLabel(
  application:
    DirectedMengerApplication,
) {
  const repairs =
    application
      .demandRules
      .map(
        (rule) =>
          `${rule.outdegree}→${
            rule.outdegree +
            rule.demand
          }`,
      )

  if (
    repairs.length === 0
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