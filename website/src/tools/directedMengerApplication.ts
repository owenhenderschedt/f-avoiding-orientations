import {
  getDemandFinalOutdegree,
  getDirectedMengerRepairCertificate,
  type DirectedMengerRepairCertificate,
  type MengerCapacityRule,
  type MengerDemandRule,
  type MengerRepairDirection,
} from './directedMengerMath'

export type DirectedMengerApplication = {
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
  startingOutdegrees: number[]

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
  direction = 'increase',
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

  /*
   * Optional for this plumbing stage
   * so the existing V1 callers keep
   * behaving as upward repairs until
   * the workspace is upgraded.
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
    DirectedMengerApplication,
) {
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