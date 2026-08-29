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
    'Stabilize Outdegree Classes',

  menuLabel:
    'Stabilize classes Q',
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
          graph, let{' '}
          <Math>{'X'}</Math>{' '}
          be a set of vertices, and
          let{' '}
          <Math>{'Q'}</Math>{' '}
          be a nonempty set of
          outdegrees containing no
          two consecutive integers.
          Define
        </p>

        <PanelFormula>
          {
            'P_Q'
            + '='
            + '\\{'
            + 'v\\in X:'
            + 'd_D^+(v)\\in Q'
            + '\\}.'
          }
        </PanelFormula>

        <p>
          By repeatedly reversing
          arcs whose two endpoints
          currently lie in{' '}
          <Math>{'P_Q'}</Math>,
          we may obtain an
          orientation in which{' '}
          <Math>{'P_Q'}</Math>{' '}
          is independent.
        </p>
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
          <Math>{'P_Q'}</Math>{' '}
          is already independent,
          there is nothing to do.
          Otherwise choose an arc
        </p>

        <PanelFormula>
          {
            'x\\to y'
            + '\\qquad '
            + 'x,y\\in P_Q.'
          }
        </PanelFormula>

        <p>
          Write
        </p>

        <PanelFormula>
          {
            'd_D^+(x)=a\\in Q,'
            + '\\qquad '
            + 'd_D^+(y)=b\\in Q.'
          }
        </PanelFormula>

        <p>
          Reverse the arc. Then
        </p>

        <PanelFormula>
          {
            'a\\to a-1'
            + '\\qquad\\text{and}\\qquad '
            + 'b\\to b+1.'
          }
        </PanelFormula>

        <p>
          Since{' '}
          <Math>{'Q'}</Math>{' '}
          contains no consecutive
          integers,
        </p>

        <PanelFormula>
          {
            'a-1\\notin Q'
            + '\\qquad\\text{and}\\qquad '
            + 'b+1\\notin Q.'
          }
        </PanelFormula>

        <p>
          Thus both endpoints leave
          the current set{' '}
          <Math>{'P_Q'}</Math>.
          No other vertex changes
          outdegree, so no new
          vertex enters{' '}
          <Math>{'P_Q'}</Math>.
          Therefore
        </p>

        <PanelFormula>
          {
            '|P_Q|'
            + '\\text{ decreases by }2.'
          }
        </PanelFormula>

        <p>
          Repeating must terminate,
          and at termination no edge
          has both endpoints in the
          remaining{' '}
          <Math>{'P_Q'}</Math>.
          Hence{' '}
          <Math>{'P_Q'}</Math>{' '}
          is independent.
        </p>
      </section>

      {/* WHAT CHANGES */}

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
          eliminate the selected
          outdegree classes. Some
          vertices may remain in{' '}
          <Math>{'P_Q'}</Math>.
          Its conclusion is
          structural:
        </p>

        <PanelFormula>
          {
            'P_Q'
            + '='
            + '\\{'
            + 'v\\in X:'
            + 'd_D^+(v)\\in Q'
            + '\\}'
            + '\\text{ is independent}.'
          }
        </PanelFormula>

        <p>
          A reversal may create the
          neighboring outdegrees{' '}
          <Math>{'q-1'}</Math>{' '}
          and{' '}
          <Math>{'q+1'}</Math>{' '}
          for selected values{' '}
          <Math>{'q\\in Q'}</Math>.
          The application records all
          such possible new classes.
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
              . Choose one or more
              currently possible total
              outdegrees forming a set{' '}
              <Math>{'Q'}</Math>{' '}
              with no two consecutive
              values.
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
                'Q='
                + latexSet(
                  application.qs,
                )
                + '.'
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
              reversals,
            </p>

            <PanelFormula>
              {
                'P_Q'
                + '='
                + '\\{'
                + 'v:'
                + 'd_D^+(v)\\in '
                + latexSet(
                  application.qs,
                )
                + '\\}'
                + '\\text{ is independent}.'
              }
            </PanelFormula>

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
                No neighboring
                outdegree class needs
                to be added in this
                application.
              </p>
            )}
          </>
        )}
      </section>

      {/* RESERVOIR ROLE */}

      <section
        style={{
          marginBottom:
            '32px',
        }}
      >
        <h3>
          Why the certificate matters
        </h3>

        <p>
          The strengthened Lovász
          reservoir inequality works
          for an arbitrary independent
          set{' '}
          <Math>{'P\\subseteq L'}</Math>,
          not merely for one outdegree
          class. Thus after stabilizing
        </p>

        <PanelFormula>
          {
            'P_Q'
            + '='
            + '\\{'
            + 'v\\in L:'
            + 'd_D^+(v)\\in Q'
            + '\\},'
          }
        </PanelFormula>

        <p>
          the whole union{' '}
          <Math>{'P_Q'}</Math>{' '}
          may be used as the demand set
          in a reservoir Menger repair.
          In particular, when every
          selected bad class can be
          repaired upward by one, the
          same cut argument can repair
        </p>

        <PanelFormula>
          {
            'q\\to q+1'
            + '\\qquad(q\\in Q)'
          }
        </PanelFormula>

        <p>
          simultaneously.
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
          arc-reversal lemma used in
          the current proof framework.
          Its proof is included above.
        </p>
      </section>
    </>
  )
}
