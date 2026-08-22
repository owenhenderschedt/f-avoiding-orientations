import Math from '../components/Math'
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

function getCapacityLandingValues(
  outdegree: number,
  capacity: number,
) {
  const values:
    number[] = []

  for (
    let used = 0;
    used <= capacity;
    used += 1
  ) {
    values.push(
      outdegree - used,
    )
  }

  return values
}

function getMengerRepairLatex(
  application:
    DirectedMengerApplication,
) {
  return application
    .demandRules
    .map(
      (rule) =>
        `${rule.outdegree}`
        + '\\to'
        + `${
          rule.outdegree +
          rule.demand
        }`,
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
        be a digraph, and let{' '}
        <Math>
          {'B\\subseteq V(D)'}
        </Math>{' '}
        be a set of receiver
        vertices. For each{' '}
        <Math>{'b\\in B'}</Math>,
        prescribe a
        nonnegative integer
        demand{' '}
        <Math>{'r(b)'}</Math>.
        For each{' '}
        <Math>
          {
            'v\\in V(D)\\setminus B'
          }
        </Math>,
        prescribe a
        nonnegative integer
        capacity{' '}
        <Math>{'c(v)'}</Math>.
      </p>

      <p>
        There exists a family
        of pairwise
        arc-disjoint directed
        paths such that exactly{' '}
        <Math>{'r(b)'}</Math>{' '}
        paths end at each{' '}
        <Math>{'b\\in B'}</Math>{' '}
        and at most{' '}
        <Math>{'c(v)'}</Math>{' '}
        paths begin at each{' '}
        <Math>
          {
            'v\\in V(D)\\setminus B'
          }
        </Math>{' '}
        if and only if, for
        every{' '}
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
        This is the
        capacitated directed
        edge-Menger theorem,
        equivalently an
        integral
        max-flow/min-cut
        statement.
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
        Introduce a new source{' '}
        <Math>{'s'}</Math>{' '}
        and a new sink{' '}
        <Math>{'t'}</Math>.
        For each{' '}
        <Math>
          {
            'v\\in V(D)\\setminus B'
          }
        </Math>,
        join{' '}
        <Math>{'s'}</Math>{' '}
        to{' '}
        <Math>{'v'}</Math>{' '}
        with capacity{' '}
        <Math>{'c(v)'}</Math>.
        For each{' '}
        <Math>{'b\\in B'}</Math>,
        join{' '}
        <Math>{'b'}</Math>{' '}
        to{' '}
        <Math>{'t'}</Math>{' '}
        with capacity{' '}
        <Math>{'r(b)'}</Math>.
      </p>

      <p>
        Meeting every demand
        is equivalent to
        obtaining an integral{' '}
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
        The displayed cut
        inequality is exactly
        the max-flow/min-cut
        condition for such a
        flow. Integrality then
        decomposes the flow
        into the required
        arc-disjoint directed
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
        Let{' '}
        <Math>{'D'}</Math>{' '}
        be an orientation of
        a graph, with receiver
        set{' '}
        <Math>{'B'}</Math>.
        Suppose there exists
        a real number
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
        such that every
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
        and every
        nonreceiver{' '}
        <Math>
          {
            'v\\in V(D)\\setminus B'
          }
        </Math>{' '}
        satisfies
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
        Then the cut
        condition in the
        theorem holds.
        Consequently, the
        required family of
        directed repair paths
        exists.
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
        Fix{' '}
        <Math>
          {
            'Y\\subseteq V(D)'
          }
        </Math>.
        Summing the local
        inequalities over
        the vertices of{' '}
        <Math>{'Y'}</Math>{' '}
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
        outdegree, so these
        contributions cancel.
        Therefore
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
        Set
      </p>

      <PanelFormula>
        {
          'a'
          + ' = '
          + 'e_D(V(D)\\setminus Y,Y),'
          + '\\qquad '
          + 'b'
          + ' = '
          + 'e_D(Y,V(D)\\setminus Y).'
        }
      </PanelFormula>

      <p>
        Since{' '}
        <Math>
          {
            '0\\leq\\alpha\\leq1'
          }
        </Math>,
      </p>

      <PanelFormula>
        {
          '\\alpha(a-b)'
          + ' \\leq '
          + 'a.'
        }
      </PanelFormula>

      <p>
        Indeed, if{' '}
        <Math>
          {'a-b\\leq0'}
        </Math>,
        then the left side
        is nonpositive. If{' '}
        <Math>
          {'a-b>0'}
        </Math>,
        then
      </p>

      <PanelFormula>
        {
          '\\alpha(a-b)'
          + ' \\leq '
          + 'a-b'
          + ' \\leq '
          + 'a.'
        }
      </PanelFormula>

      <p>
        Hence
      </p>

      <PanelFormula>
        {
          '\\sum_{b\\in B\\cap Y} r(b)'
          + ' - '
          + '\\sum_{v\\in Y\\setminus B} c(v)'
          + ' \\leq '
          + 'e_D(V(D)\\setminus Y,Y).'
        }
      </PanelFormula>

      <p>
        Rearranging gives
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
        which is exactly the
        cut condition from the
        theorem.
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
        If the underlying
        graph is{' '}
        <Math>{'d'}</Math>
        -regular and a vertex
        currently has
        outdegree{' '}
        <Math>{'q'}</Math>,
        then
      </p>

      <PanelFormula>
        {
          'd_D^-(v)'
          + '-'
          + 'd_D^+(v)'
          + ' = '
          + 'd'
          + '-'
          + '2q.'
        }
      </PanelFormula>

      <p>
        Thus a receiver of
        current outdegree{' '}
        <Math>{'q<d/2'}</Math>{' '}
        and demand{' '}
        <Math>{'r'}</Math>{' '}
        gives the lower bound
      </p>

      <PanelFormula>
        {
          '\\alpha'
          + ' \\geq '
          + '\\frac{r}{d-2q}.'
        }
      </PanelFormula>

      <p>
        A donor of current
        outdegree{' '}
        <Math>{'q>d/2'}</Math>{' '}
        and capacity{' '}
        <Math>{'c'}</Math>{' '}
        gives the upper bound
      </p>

      <PanelFormula>
        {
          '\\alpha'
          + ' \\leq '
          + '\\frac{c}{2q-d}.'
        }
      </PanelFormula>

      <p>
        Therefore the
        playground can reduce
        the global cut
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
            The starting
            orientation has
            possible total
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
            Receiver demands
          </h4>

          {application
            .demandRules
            .map(
              (rule) => {
                const target =
                  rule.outdegree +
                  rule.demand

                const imbalance =
                  effectiveDegree -
                  2 *
                    rule.outdegree

                const bound =
                  rule.demand /
                  imbalance

                return (
                  <div
                    key={
                      `receiver-${rule.outdegree}`
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
                      Demand:{' '}
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
                        + `${effectiveDegree}`
                        + '-'
                        + `2\\cdot${rule.outdegree}`
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
            Donor capacities
          </h4>

          {application
            .capacityRules
            .map(
              (rule) => {
                const landingValues =
                  getCapacityLandingValues(
                    rule.outdegree,
                    rule.capacity,
                  )

                const imbalance =
                  2 *
                    rule.outdegree -
                  effectiveDegree

                const bound =
                  imbalance > 0
                    ? rule.capacity /
                      imbalance
                    : null

                return (
                  <div
                    key={
                      `donor-${rule.outdegree}`
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
                      Capacity:{' '}
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
                            + `${effectiveDegree}`
                            + '-'
                            + `2\\cdot${rule.outdegree}`
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
            condition in the
            theorem, and the
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