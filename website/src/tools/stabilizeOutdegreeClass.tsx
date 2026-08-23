import Math from '../components/Math'
import type {
  StabilizeTarget,
} from './stabilizeOutdegreeClassMath'
import type {
  StabilizeOutdegreeClassApplication,
} from './stabilizeOutdegreeClassApplication'

export const stabilizeOutdegreeClassTool = {
  id:
    'stabilize-outdegree-class',

  name:
    'Stabilize Outdegree Class',

  menuLabel:
    'Stabilize q-class',
} as const

type StabilizeOutdegreeClassReferenceProps = {
  target:
    StabilizeTarget

  application:
    StabilizeOutdegreeClassApplication | null
}

function PanelFormula({
  children,
}: {
  children: string
}) {
  return (
    <div
      style={{
        textAlign:
          'center',

        margin:
          '18px 0',

        padding:
          '10px 12px',

        border:
          '1px solid #e2e8f0',

        borderRadius:
          '8px',

        background:
          '#f8fafc',

        overflowX:
          'auto',
      }}
    >
      <Math display>
        {children}
      </Math>
    </div>
  )
}

function getTargetLatex(
  target:
    StabilizeTarget,
) {
  if (
    target === 'L'
  ) {
    return 'G[L]'
  }

  if (
    target === 'R'
  ) {
    return 'G[R]'
  }

  return 'G'
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

export function StabilizeOutdegreeClassReference({
  target,
  application,
}: StabilizeOutdegreeClassReferenceProps) {
  const targetLatex =
    getTargetLatex(
      target,
    )

  return (
    <>
      {/* LEMMA */}

      <section
        style={{
          marginBottom:
            '32px',
        }}
      >
        <h3
          style={{
            marginTop: 0,
          }}
        >
          Lemma
        </h3>

        <p>
          Let{' '}
          <Math>{'D'}</Math>{' '}
          be an orientation of a
          graph, and let{' '}
          <Math>{'X'}</Math>{' '}
          be a set of vertices.
          Fix an integer{' '}
          <Math>{'q'}</Math>{' '}
          and define
        </p>

        <PanelFormula>
          {
            'P_q'
            + '='
            + '\\{'
            + 'v\\in X:'
            + 'd_D^+(v)=q'
            + '\\}.'
          }
        </PanelFormula>

        <p>
          By repeatedly reversing
          arcs whose two endpoints
          lie in{' '}
          <Math>{'P_q'}</Math>,
          we may obtain an
          orientation in which{' '}
          <Math>{'P_q'}</Math>{' '}
          is independent.
        </p>

        <p>
          During this process,
          vertices outside the
          current{' '}
          <Math>{'q'}</Math>
          -class are never used as
          endpoints of a reversal.
          Consequently, the only
          new outdegrees that can
          be created are
        </p>

        <PanelFormula>
          {
            'q-1'
            + '\\qquad\\text{and}\\qquad '
            + 'q+1.'
          }
        </PanelFormula>
      </section>

      {/* PROOF */}

      <section
        style={{
          marginBottom:
            '32px',
        }}
      >
        <h3>
          Proof
        </h3>

        <p>
          If{' '}
          <Math>{'P_q'}</Math>{' '}
          is already independent,
          there is nothing to do.
          Otherwise there are
          adjacent vertices{' '}
          <Math>{'x,y\\in P_q'}</Math>.
          Their edge has one of
          the two orientations;
          say
        </p>

        <PanelFormula>
          {
            'x\\to y.'
          }
        </PanelFormula>

        <p>
          Reverse this arc. The
          outdegree of{' '}
          <Math>{'x'}</Math>{' '}
          decreases by one and the
          outdegree of{' '}
          <Math>{'y'}</Math>{' '}
          increases by one:
        </p>

        <PanelFormula>
          {
            'd_D^+(x):'
            + 'q\\to q-1,'
            + '\\qquad '
            + 'd_D^+(y):'
            + 'q\\to q+1.'
          }
        </PanelFormula>

        <p>
          Thus both{' '}
          <Math>{'x'}</Math>{' '}
          and{' '}
          <Math>{'y'}</Math>{' '}
          leave the{' '}
          <Math>{'q'}</Math>
          -class.
        </p>

        <p>
          Moreover, no vertex
          outside the current{' '}
          <Math>{'q'}</Math>
          -class changes
          outdegree. Hence the
          reversal creates no new
          vertex of outdegree{' '}
          <Math>{'q'}</Math>.
          Therefore
        </p>

        <PanelFormula>
          {
            '|P_q|'
            + '\\text{ decreases by }'
            + '2.'
          }
        </PanelFormula>

        <p>
          Repeating this operation
          must terminate. At
          termination there is no
          edge with both endpoints
          in the remaining{' '}
          <Math>{'q'}</Math>
          -class, so
        </p>

        <PanelFormula>
          {
            'P_q'
            + '\\text{ is independent}.'
          }
        </PanelFormula>
      </section>

      {/* WHY THIS IS A FIXER */}

      <section
        style={{
          marginBottom:
            '32px',
        }}
      >
        <h3>
          What this fixer changes
        </h3>

        <p>
          Stabilization does{' '}
          <strong>not</strong>{' '}
          eliminate the outdegree{' '}
          <Math>{'q'}</Math>.
          Some vertices may remain
          in the{' '}
          <Math>{'q'}</Math>
          -class.
        </p>

        <p>
          Its conclusion is
          structural:
        </p>

        <PanelFormula>
          {
            'P_q'
            + '='
            + '\\{'
            + 'v\\in X:'
            + 'd_D^+(v)=q'
            + '\\}'
            + '\\text{ is independent}.'
          }
        </PanelFormula>

        <p>
          The orientation may now
          contain the additional
          outdegrees{' '}
          <Math>{'q-1'}</Math>{' '}
          and{' '}
          <Math>{'q+1'}</Math>.
          Whether those values are
          useful or forbidden is a
          separate question.
        </p>

        <p>
          This is why the operation
          belongs among the
          <strong> fixers</strong>,
          rather than among the
          starting-orientation
          constructors.
        </p>
      </section>

      {/* APPLICATION */}

      <section
        style={{
          marginBottom:
            '32px',
        }}
      >
        <h3>
          Application here
        </h3>

        {application ===
        null ? (
          <>
            <p>
              The target is{' '}

              <Math>
                {targetLatex}
              </Math>
              .
            </p>

            <p>
              Choose a currently
              possible total
              outdegree{' '}

              <Math>{'q'}</Math>
              . The fixer will
              reverse arcs between
              pairs of current{' '}

              <Math>{'q'}</Math>
              -vertices until the
              remaining{' '}

              <Math>{'q'}</Math>
              -class is independent.
            </p>
          </>
        ) : (
          <>
            <p>
              The fixer was applied
              to{' '}

              <Math>
                {
                  getTargetLatex(
                    application
                      .target,
                  )
                }
              </Math>{' '}

              with
            </p>

            <PanelFormula>
              {
                `q=${application.q}.`
              }
            </PanelFormula>

            <p>
              Before stabilization,
              the possible total
              outdegrees on this
              target were
            </p>

            <PanelFormula>
              {
                'd_D^+(v)'
                + '\\in '
                + latexSet(
                  application
                    .startingOutdegrees,
                )
                + '.'
              }
            </PanelFormula>

            <p>
              After the arc
              reversals, the
              remaining class
            </p>

            <PanelFormula>
              {
                `P_{${application.q}}`
                + '='
                + '\\{'
                + 'v:'
                + `d_D^+(v)=${application.q}`
                + '\\}'
              }
            </PanelFormula>

            <p>
              is independent.
            </p>

            {application
              .certificate
              .createdOutdegrees
              .length >
            0 ? (
              <>
                <p>
                  The reversals may
                  additionally create
                  the outdegrees
                </p>

                <PanelFormula>
                  {
                    latexSet(
                      application
                        .certificate
                        .createdOutdegrees,
                    )
                    + '.'
                  }
                </PanelFormula>
              </>
            ) : (
              <p>
                This extreme
                outdegree class is
                already independent,
                so no neighboring
                outdegrees need to
                be created.
              </p>
            )}
          </>
        )}
      </section>

      {/* ROLE IN RESERVOIR REPAIR */}

      <section
        style={{
          marginBottom:
            '32px',
        }}
      >
        <h3>
          Why the certificate
          matters
        </h3>

        <p>
          Later repair arguments
          may need an independent
          set of bad vertices.
          Stabilization provides
          exactly that certificate.
        </p>

        <p>
          In particular, when the
          target is{' '}

          <Math>{'G[L]'}</Math>{' '}

          after a strengthened
          Lovász partition, the
          independent set{' '}

          <Math>{'P_q\\subseteq L'}</Math>{' '}

          can be inserted into the
          Lovász reservoir
          inequality through
        </p>

        <PanelFormula>
          {
            'Q_{P_q}(S)'
            + '='
            + '\\{'
            + 'p\\in P_q:'
            + 'N(p)\\cap R'
            + '\\subseteq S'
            + '\\}.'
          }
        </PanelFormula>

        <p>
          Thus stabilization is
          the bridge between a
          starting orientation and
          the later reservoir
          Menger repair.
        </p>
      </section>

      {/* REFERENCE */}

      <section>
        <h3>
          Reference
        </h3>

        <p
          style={{
            marginBottom: 0,
          }}
        >
          This is the elementary
          arc-reversal lemma used
          in the current proof
          framework. Its proof is
          included above.
        </p>
      </section>
    </>
  )
}