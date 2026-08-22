import Math from '../components/Math'
import {
  getCapacityVisitedOutdegrees,
  getDemandFinalOutdegree,
} from './directedMengerMath'
import type {
  DirectedMengerApplication,
} from './directedMengerApplication'

export const directedMengerRepairTool = {
  name:
    'Directed Menger repair',

  menuLabel:
    'Directed Menger repair',
}

function latexSet(
  values:
    readonly number[],
) {
  return (
    '\\{' +
    values.join(',') +
    '\\}'
  )
}

function getMengerRepairLatex(
  application:
    DirectedMengerApplication,
) {
  return application
    .demandRules
    .map(
      (rule) => {
        const target =
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
          + '\\to'
          + `${target}`
        )
      },
    )
    .join(',\\ ')
}

function formatBound(
  value: number,
) {
  if (
    !Number.isFinite(
      value,
    )
  ) {
    return '—'
  }

  for (
    let denominator = 1;
    denominator <= 40;
    denominator += 1
  ) {
    const numerator =
      globalThis.Math.round(
        value *
          denominator,
      )

    if (
      globalThis.Math.abs(
        value -
          numerator /
            denominator,
      ) <
      1e-9
    ) {
      if (
        denominator === 1
      ) {
        return `${numerator}`
      }

      return (
        `\\frac{${numerator}}`
        + `{${denominator}}`
      )
    }
  }

  return value.toFixed(3)
}

function PanelFormula({
  children,
}: {
  children: string
}) {
  return (
    <div
      style={{
        margin:
          '13px 0',

        padding:
          '11px 12px',

        border:
          '1px solid #e2e8f0',

        borderRadius:
          '8px',

        background:
          '#f8fafc',

        textAlign:
          'center',

        overflowX:
          'auto',
      }}
    >
      <Math>
        {children}
      </Math>
    </div>
  )
}

export function DirectedMengerRepairReference({
  degree,
  forbiddenSet,
  application,
}: {
  degree: number

  forbiddenSet:
    readonly number[]

  application:
    DirectedMengerApplication | null
}) {
  const effectiveDegree =
    application?.degree ??
    degree

  const applicationDirection =
    application?.direction ??
    'increase'

  const applicationIsIncrease =
    applicationDirection ===
    'increase'

  const demandRole =
    applicationIsIncrease
      ? 'receiver'
      : 'sender'

  const capacityRole =
    applicationIsIncrease
      ? 'donor'
      : 'receiver'

  return (
    <div
      style={{
        color:
          '#334155',

        lineHeight:
          1.58,
      }}
    >
      {/* THEOREM */}

      <h3
        style={{
          marginTop: 0,

          marginBottom:
            '10px',
        }}
      >
        Theorem
      </h3>

      <p>
        Let{' '}
        <Math>{'D'}</Math>{' '}
        be a digraph and let{' '}
        <Math>
          {'B\\subseteq V(D)'}
        </Math>{' '}
        be the set of bad
        vertices. For each{' '}
        <Math>{'b\\in B'}</Math>,
        prescribe a positive
        integer demand{' '}
        <Math>{'r(b)'}</Math>,
        and for every{' '}
        <Math>
          {
            'v\\in V(D)\\setminus B'
          }
        </Math>{' '}
        prescribe a
        nonnegative capacity{' '}
        <Math>{'c(v)'}</Math>.
      </p>

      <p>
        There are two
        symmetric one-sided
        versions of the
        directed Menger
        repair.
      </p>

      <h4
        style={{
          marginTop:
            '18px',

          marginBottom:
            '8px',
        }}
      >
        Increase the bad
        outdegrees
      </h4>

      <p>
        Here each bad vertex{' '}
        <Math>{'b\\in B'}</Math>{' '}
        is a receiver. We seek
        exactly{' '}
        <Math>{'r(b)'}</Math>{' '}
        directed paths ending
        at{' '}
        <Math>{'b'}</Math>,
        while at most{' '}
        <Math>{'c(v)'}</Math>{' '}
        paths may begin at each
        nonbad vertex{' '}
        <Math>{'v'}</Math>.
      </p>

      <p>
        Such a pairwise
        arc-disjoint path
        family exists if and
        only if, for every{' '}
        <Math>
          {
            'Y\\subseteq V(D)'
          }
        </Math>,
      </p>

      <PanelFormula>
        {
          '\\sum_{b\\in B\\cap Y} r(b)'
          + ' \\leq '
          + 'e_D(V(D)\\setminus Y,Y)'
          + ' + '
          + '\\sum_{v\\in Y\\setminus B} c(v).'
        }
      </PanelFormula>

      <h4
        style={{
          marginTop:
            '20px',

          marginBottom:
            '8px',
        }}
      >
        Decrease the bad
        outdegrees
      </h4>

      <p>
        Here each bad vertex{' '}
        <Math>{'b\\in B'}</Math>{' '}
        is a sender. We seek
        exactly{' '}
        <Math>{'r(b)'}</Math>{' '}
        directed paths
        beginning at{' '}
        <Math>{'b'}</Math>,
        while at most{' '}
        <Math>{'c(v)'}</Math>{' '}
        paths may end at each
        nonbad vertex{' '}
        <Math>{'v'}</Math>.
      </p>

      <p>
        Such a pairwise
        arc-disjoint path
        family exists if and
        only if, for every{' '}
        <Math>
          {
            'Y\\subseteq V(D)'
          }
        </Math>,
      </p>

      <PanelFormula>
        {
          '\\sum_{b\\in B\\cap Y} r(b)'
          + ' \\leq '
          + 'e_D(Y,V(D)\\setminus Y)'
          + ' + '
          + '\\sum_{v\\in Y\\setminus B} c(v).'
        }
      </PanelFormula>

      <p>
        Here{' '}
        <Math>{'e_D(X,Y)'}</Math>{' '}
        denotes the number of
        arcs directed from{' '}
        <Math>{'X'}</Math>{' '}
        to{' '}
        <Math>{'Y'}</Math>.
      </p>

      <div
        style={{
          margin:
            '14px 0 22px',

          padding:
            '12px 14px',

          borderLeft:
            '3px solid #94a3b8',

          background:
            '#f8fafc',

          color:
            '#475569',
        }}
      >
        The decrease version
        is exactly the
        increase theorem
        applied to the
        reversed digraph.
        Both are capacitated
        directed edge-Menger
        statements,
        equivalently integral
        max-flow/min-cut
        statements.
      </div>

      {/* FLOW INTERPRETATION */}

      <h3
        style={{
          marginBottom:
            '10px',
        }}
      >
        Flow interpretation
      </h3>

      <p>
        For the increase
        version, introduce a
        source{' '}
        <Math>{'s'}</Math>{' '}
        and sink{' '}
        <Math>{'t'}</Math>.
        Add an arc from{' '}
        <Math>{'s'}</Math>{' '}
        to every nonbad
        vertex{' '}
        <Math>{'v'}</Math>{' '}
        with capacity{' '}
        <Math>{'c(v)'}</Math>,
        and an arc from every
        bad vertex{' '}
        <Math>{'b'}</Math>{' '}
        to{' '}
        <Math>{'t'}</Math>{' '}
        with capacity{' '}
        <Math>{'r(b)'}</Math>.
      </p>

      <p>
        For the decrease
        version, reverse these
        roles: add an arc from{' '}
        <Math>{'s'}</Math>{' '}
        to each bad vertex{' '}
        <Math>{'b'}</Math>{' '}
        with capacity{' '}
        <Math>{'r(b)'}</Math>,
        and an arc from each
        nonbad vertex{' '}
        <Math>{'v'}</Math>{' '}
        to{' '}
        <Math>{'t'}</Math>{' '}
        with capacity{' '}
        <Math>{'c(v)'}</Math>.
      </p>

      <p>
        In either case,
        meeting every demand
        is equivalent to an
        integral{' '}
        <Math>{'s'}</Math>-
        <Math>{'t'}</Math>{' '}
        flow of value
      </p>

      <PanelFormula>
        {
          'R'
          + ' = '
          + '\\sum_{b\\in B} r(b).'
        }
      </PanelFormula>

      <p>
        Max-flow/min-cut gives
        exactly the
        corresponding cut
        inequality above, and
        integrality decomposes
        the flow into the
        required directed
        paths.
      </p>

      {/* COROLLARY */}

      <h3
        style={{
          marginTop:
            '25px',

          marginBottom:
            '10px',
        }}
      >
        Corollary:
        the{' '}
        <Math>{'\\alpha'}</Math>
        -certificate
      </h3>

      <p>
        The global cut
        conditions admit a
        simple local
        sufficient condition.
      </p>

      <p>
        For an increase
        repair, suppose there
        is a real number
      </p>

      <PanelFormula>
        {
          '0'
          + ' \\leq '
          + '\\alpha'
          + ' \\leq '
          + '1'
        }
      </PanelFormula>

      <p>
        such that every bad
        receiver{' '}
        <Math>{'b\\in B'}</Math>{' '}
        satisfies
      </p>

      <PanelFormula>
        {
          'r(b)'
          + ' \\leq '
          + '\\alpha'
          + '\\bigl('
          + 'd_D^-(b)'
          + '-'
          + 'd_D^+(b)'
          + '\\bigr),'
        }
      </PanelFormula>

      <p>
        and every nonbad
        vertex satisfies
      </p>

      <PanelFormula>
        {
          '-c(v)'
          + ' \\leq '
          + '\\alpha'
          + '\\bigl('
          + 'd_D^-(v)'
          + '-'
          + 'd_D^+(v)'
          + '\\bigr).'
        }
      </PanelFormula>

      <p>
        Then the increase cut
        condition holds.
      </p>

      <p>
        Symmetrically, for a
        decrease repair it is
        enough that every bad
        sender satisfies
      </p>

      <PanelFormula>
        {
          'r(b)'
          + ' \\leq '
          + '\\alpha'
          + '\\bigl('
          + 'd_D^+(b)'
          + '-'
          + 'd_D^-(b)'
          + '\\bigr),'
        }
      </PanelFormula>

      <p>
        while every nonbad
        vertex satisfies
      </p>

      <PanelFormula>
        {
          '-c(v)'
          + ' \\leq '
          + '\\alpha'
          + '\\bigl('
          + 'd_D^+(v)'
          + '-'
          + 'd_D^-(v)'
          + '\\bigr).'
        }
      </PanelFormula>

      <p>
        Then the decrease cut
        condition holds.
      </p>

      {/* PROOF OF COROLLARY */}

      <h3
        style={{
          marginTop:
            '25px',

          marginBottom:
            '10px',
        }}
      >
        Proof of the
        corollary
      </h3>

      <p>
        The two proofs are the
        same after reversing
        every arc, so consider
        the increase version.
        Fix{' '}
        <Math>
          {
            'Y\\subseteq V(D)'
          }
        </Math>.
        Summing the local
        inequalities over
        <Math>{'\\ Y'}</Math>{' '}
        gives
      </p>

      <PanelFormula>
        {
          '\\sum_{b\\in B\\cap Y} r(b)'
          + ' - '
          + '\\sum_{v\\in Y\\setminus B} c(v)'
          + ' \\leq '
          + '\\alpha'
          + '\\sum_{v\\in Y}'
          + '\\bigl('
          + 'd_D^-(v)'
          + '-'
          + 'd_D^+(v)'
          + '\\bigr).'
        }
      </PanelFormula>

      <p>
        Every arc internal to{' '}
        <Math>{'D[Y]'}</Math>{' '}
        contributes once to
        indegree and once to
        outdegree, so the
        internal contributions
        cancel. Hence
      </p>

      <PanelFormula>
        {
          '\\sum_{v\\in Y}'
          + '\\bigl('
          + 'd_D^-(v)'
          + '-'
          + 'd_D^+(v)'
          + '\\bigr)'
          + ' = '
          + 'e_D(V(D)\\setminus Y,Y)'
          + ' - '
          + 'e_D(Y,V(D)\\setminus Y).'
        }
      </PanelFormula>

      <p>
        Write
      </p>

      <PanelFormula>
        {
          'a'
          + ' = '
          + 'e_D(V(D)\\setminus Y,Y),'
          + '\\qquad '
          + 'h'
          + ' = '
          + 'e_D(Y,V(D)\\setminus Y).'
        }
      </PanelFormula>

      <p>
        Because{' '}
        <Math>
          {
            '0\\leq\\alpha\\leq1'
          }
        </Math>,
      </p>

      <PanelFormula>
        {
          '\\alpha(a-h)'
          + ' \\leq '
          + 'a.'
        }
      </PanelFormula>

      <p>
        Indeed, if{' '}
        <Math>{'a-h\\leq0'}</Math>,
        the left side is
        nonpositive, while if{' '}
        <Math>{'a-h>0'}</Math>,
        then
      </p>

      <PanelFormula>
        {
          '\\alpha(a-h)'
          + ' \\leq '
          + 'a-h'
          + ' \\leq '
          + 'a.'
        }
      </PanelFormula>

      <p>
        Therefore
      </p>

      <PanelFormula>
        {
          '\\sum_{b\\in B\\cap Y} r(b)'
          + ' \\leq '
          + 'e_D(V(D)\\setminus Y,Y)'
          + ' + '
          + '\\sum_{v\\in Y\\setminus B} c(v),'
        }
      </PanelFormula>

      <p>
        which is the increase
        cut condition. Applying
        the same argument to
        the reversed digraph
        proves the decrease
        version.
      </p>

      {/* REGULAR GRAPH SPECIALIZATION */}

      <h3
        style={{
          marginTop:
            '25px',

          marginBottom:
            '10px',
        }}
      >
        Regular-graph
        specialization
      </h3>

      <p>
        Suppose the underlying
        graph is{' '}
        <Math>{'d'}</Math>
        -regular and a vertex
        currently has
        outdegree{' '}
        <Math>{'q'}</Math>.
        Then
      </p>

      <PanelFormula>
        {
          'd_D^-(v)'
          + '-'
          + 'd_D^+(v)'
          + ' = '
          + 'd'
          + '-'
          + '2q'
        }
      </PanelFormula>

      <PanelFormula>
        {
          'd_D^+(v)'
          + '-'
          + 'd_D^-(v)'
          + ' = '
          + '2q'
          + '-'
          + 'd.'
        }
      </PanelFormula>

      <h4
        style={{
          marginTop:
            '19px',

          marginBottom:
            '8px',
        }}
      >
        Increase
      </h4>

      <p>
        A bad receiver of
        outdegree{' '}
        <Math>{'q<d/2'}</Math>{' '}
        and demand{' '}
        <Math>{'r'}</Math>{' '}
        gives
      </p>

      <PanelFormula>
        {
          '\\alpha'
          + ' \\geq '
          + '\\frac{r}{d-2q}.'
        }
      </PanelFormula>

      <p>
        A buffer vertex of
        outdegree{' '}
        <Math>{'q>d/2'}</Math>{' '}
        that may donate at
        most{' '}
        <Math>{'c'}</Math>{' '}
        units gives
      </p>

      <PanelFormula>
        {
          '\\alpha'
          + ' \\leq '
          + '\\frac{c}{2q-d}.'
        }
      </PanelFormula>

      <h4
        style={{
          marginTop:
            '19px',

          marginBottom:
            '8px',
        }}
      >
        Decrease
      </h4>

      <p>
        A bad sender of
        outdegree{' '}
        <Math>{'q>d/2'}</Math>{' '}
        and demand{' '}
        <Math>{'r'}</Math>{' '}
        gives
      </p>

      <PanelFormula>
        {
          '\\alpha'
          + ' \\geq '
          + '\\frac{r}{2q-d}.'
        }
      </PanelFormula>

      <p>
        A buffer vertex of
        outdegree{' '}
        <Math>{'q<d/2'}</Math>{' '}
        that may absorb at
        most{' '}
        <Math>{'c'}</Math>{' '}
        units gives
      </p>

      <PanelFormula>
        {
          '\\alpha'
          + ' \\leq '
          + '\\frac{c}{d-2q}.'
        }
      </PanelFormula>

      <div
        style={{
          margin:
            '16px 0 22px',

          padding:
            '12px 14px',

          borderLeft:
            '3px solid #94a3b8',

          background:
            '#f8fafc',

          color:
            '#475569',
        }}
      >
        If{' '}
        <Math>{'q=d/2'}</Math>,
        then the local
        imbalance is zero.
        Therefore this{' '}
        <Math>{'\\alpha'}</Math>
        -certificate cannot
        certify a positive
        repair demand at that
        class. This does not
        say that a directed
        Menger repair is
        impossible; it only
        says that this local
        sufficient condition
        gives no certificate.
      </div>

      <p>
        Thus in the regular
        setting the playground
        reduces the global cut
        condition to a simple
        interval test for{' '}
        <Math>{'\\alpha'}</Math>.
      </p>

      {/* CURRENT APPLICATION */}

      {application !==
        null && (
        <>
          <div
            style={{
              margin:
                '28px 0 0',

              borderTop:
                '1px solid #cbd5e1',

              paddingTop:
                '24px',
            }}
          />

          <h3
            style={{
              marginTop: 0,

              marginBottom:
                '10px',
            }}
          >
            Current
            application
          </h3>

          <p>
            This is a{' '}
            <strong>
              {applicationIsIncrease
                ? 'increase'
                : 'decrease'}
            </strong>{' '}
            repair. The
            starting orientation
            has possible total
            outdegrees
          </p>

          <PanelFormula>
            {
              latexSet(
                application
                  .startingOutdegrees,
              )
            }
          </PanelFormula>

          <p>
            with forbidden set
          </p>

          <PanelFormula>
            {
              'F'
              + ' = '
              + latexSet(
                forbiddenSet,
              )
            }
          </PanelFormula>

          <h4
            style={{
              marginTop:
                '20px',

              marginBottom:
                '8px',
            }}
          >
            {applicationIsIncrease
              ? 'Receiver demands'
              : 'Sender demands'}
          </h4>

          {application
            .demandRules
            .map(
              (rule) => {
                const target =
                  getDemandFinalOutdegree({
                    outdegree:
                      rule.outdegree,

                    demand:
                      rule.demand,

                    direction:
                      application.direction,
                  })

                const signedImbalance =
                  applicationIsIncrease
                    ? effectiveDegree -
                      2 *
                        rule.outdegree
                    : 2 *
                        rule.outdegree -
                      effectiveDegree

                const bound =
                  rule.demand /
                  signedImbalance

                const localExpression =
                  applicationIsIncrease
                    ? `${effectiveDegree}`
                      + '-'
                      + `2\\cdot${rule.outdegree}`
                    : `2\\cdot${rule.outdegree}`
                      + '-'
                      + `${effectiveDegree}`

                return (
                  <div
                    key={
                      `demand-${rule.outdegree}`
                    }
                    style={{
                      marginBottom:
                        '10px',

                      padding:
                        '11px 13px',

                      border:
                        '1px solid #e2e8f0',

                      borderRadius:
                        '8px',

                      background:
                        '#f8fafc',
                    }}
                  >
                    <div>
                      Repair{' '}
                      <Math>
                        {
                          `${rule.outdegree}`
                          + '\\to'
                          + `${target}`
                        }
                      </Math>
                      .
                    </div>

                    <div
                      style={{
                        marginTop:
                          '6px',
                      }}
                    >
                      {demandRole
                        .charAt(0)
                        .toUpperCase()
                        + demandRole.slice(
                          1,
                        )}{' '}
                      demand:{' '}

                      <Math>
                        {
                          `r=${rule.demand}`
                        }
                      </Math>
                    </div>

                    <div
                      style={{
                        marginTop:
                          '6px',
                      }}
                    >
                      Local
                      inequality:
                    </div>

                    <PanelFormula>
                      {
                        `${rule.demand}`
                        + ' \\leq '
                        + '\\alpha'
                        + '\\bigl('
                        + localExpression
                        + '\\bigr).'
                      }
                    </PanelFormula>

                    <div>
                      Hence{' '}
                      <Math>
                        {
                          '\\alpha'
                          + ' \\geq '
                          + formatBound(
                            bound,
                          )
                        }
                      </Math>
                      .
                    </div>
                  </div>
                )
              },
            )}

          <h4
            style={{
              marginTop:
                '20px',

              marginBottom:
                '8px',
            }}
          >
            {applicationIsIncrease
              ? 'Donor capacities'
              : 'Receiver capacities'}
          </h4>

          {application
            .capacityRules
            .map(
              (rule) => {
                const landingValues =
                  getCapacityVisitedOutdegrees(
                    rule.outdegree,

                    rule.capacity,

                    application.direction,
                  )

                /*
                 * The local capacity
                 * inequality uses the
                 * same signed imbalance
                 * as the chosen repair
                 * direction.
                 *
                 * For the classes
                 * exposed by the V2
                 * workspace this value
                 * is negative, giving
                 * the displayed upper
                 * bound.
                 */
                const signedImbalance =
                  applicationIsIncrease
                    ? effectiveDegree -
                      2 *
                        rule.outdegree
                    : 2 *
                        rule.outdegree -
                      effectiveDegree

                const opposingImbalance =
                  -signedImbalance

                const bound =
                  opposingImbalance >
                  0
                    ? rule.capacity /
                      opposingImbalance
                    : null

                const localExpression =
                  applicationIsIncrease
                    ? `${effectiveDegree}`
                      + '-'
                      + `2\\cdot${rule.outdegree}`
                    : `2\\cdot${rule.outdegree}`
                      + '-'
                      + `${effectiveDegree}`

                return (
                  <div
                    key={
                      `capacity-${rule.outdegree}`
                    }
                    style={{
                      marginBottom:
                        '10px',

                      padding:
                        '11px 13px',

                      border:
                        '1px solid #e2e8f0',

                      borderRadius:
                        '8px',

                      background:
                        '#f8fafc',
                    }}
                  >
                    <div>
                      Current
                      outdegree:{' '}
                      <Math>
                        {
                          `${rule.outdegree}`
                        }
                      </Math>
                    </div>

                    <div
                      style={{
                        marginTop:
                          '6px',
                      }}
                    >
                      {capacityRole
                        .charAt(0)
                        .toUpperCase()
                        + capacityRole.slice(
                          1,
                        )}{' '}
                      capacity:{' '}

                      <Math>
                        {
                          `c=${rule.capacity}`
                        }
                      </Math>
                    </div>

                    {bound !==
                      null && (
                      <>
                        <div
                          style={{
                            marginTop:
                              '6px',
                          }}
                        >
                          Local
                          inequality:
                        </div>

                        <PanelFormula>
                          {
                            `-${rule.capacity}`
                            + ' \\leq '
                            + '\\alpha'
                            + '\\bigl('
                            + localExpression
                            + '\\bigr).'
                          }
                        </PanelFormula>

                        <div>
                          Hence{' '}
                          <Math>
                            {
                              '\\alpha'
                              + ' \\leq '
                              + formatBound(
                                bound,
                              )
                            }
                          </Math>
                          .
                        </div>
                      </>
                    )}

                    <div
                      style={{
                        marginTop:
                          '8px',
                      }}
                    >
                      Possible
                      resulting
                      outdegrees:{' '}

                      <Math>
                        {
                          latexSet(
                            landingValues,
                          )
                        }
                      </Math>
                    </div>
                  </div>
                )
              },
            )}

          <h4
            style={{
              marginTop:
                '22px',

              marginBottom:
                '8px',
            }}
          >
            Feasible{' '}
            <Math>
              {'\\alpha'}
            </Math>
          </h4>

          <div
            style={{
              margin:
                '12px 0 18px',

              padding:
                '13px',

              border:
                '1px solid #bbf7d0',

              borderRadius:
                '9px',

              background:
                '#f0fdf4',

              color:
                '#166534',

              textAlign:
                'center',

              fontSize:
                '1.08rem',

              fontWeight:
                600,
            }}
          >
            <Math>
              {
                formatBound(
                  application
                    .alphaLowerBound,
                )
                + ' \\leq '
                + '\\alpha'
                + ' \\leq '
                + formatBound(
                  application
                    .alphaUpperBound,
                )
              }
            </Math>
          </div>

          <p>
            Hence one value of{' '}
            <Math>{'\\alpha'}</Math>{' '}
            satisfies all of
            the local
            inequalities. The
            corollary therefore
            verifies every cut
            condition for this{' '}
            {applicationIsIncrease
              ? 'increase'
              : 'decrease'}{' '}
            repair, so the
            required directed
            path family exists.
          </p>

          <div
            style={{
              marginTop:
                '16px',

              padding:
                '12px 14px',

              border:
                '1px solid #bbf7d0',

              borderRadius:
                '9px',

              background:
                '#f0fdf4',

              color:
                '#166534',
            }}
          >
            <strong>
              Certified
              repair:{' '}
            </strong>

            <Math>
              {
                getMengerRepairLatex(
                  application,
                )
              }
            </Math>
          </div>
        </>
      )}
    </div>
  )
}