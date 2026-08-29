import Math from '../components/Math'
import type {
  DirectedMengerReservoirApplication,
} from './directedMengerReservoirApplication'

type DirectedMengerReservoirReferenceProps = {
  application:
    DirectedMengerReservoirApplication | null
}

function PanelFormula({
  children,
}: {
  children:
    string
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

function getRepairLatex(
  application:
    DirectedMengerReservoirApplication,
) {
  return application.qs
    .map(
      (
        q,
        index,
      ) =>
        `${q}`
        + '\\to'
        + `${application.repairedOutdegrees[index]}`,
    )
    .join(',\\ ')
}

export function DirectedMengerReservoirReference({
  application,
}: DirectedMengerReservoirReferenceProps) {
  return (
    <>
      {/* SETUP */}

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
          Reservoir certificate
        </h3>

        <p>
          Reservoir Menger works in the
          current regular working graph,
          even after cyclically oriented
          spanning 2-factors have been
          removed.
        </p>

        <p>
          Suppose the original graph{' '}
          <Math>{'G'}</Math>{' '}
          is{' '}
          <Math>{'d'}</Math>
          -regular.  If{' '}
          <Math>{'r'}</Math>{' '}
          oriented 2-factors have already
          been removed, write{' '}
          <Math>{'H'}</Math>{' '}
          for the residual graph. Then
        </p>

        <PanelFormula>
          {
            'd_H=d-2r,'
            + '\\qquad '
            + 'd_G^+(v)=r+d_H^+(v).'
          }
        </PanelFormula>

        <p>
          Apply the strengthened Lovász
          partition to{' '}
          <Math>{'H'}</Math>:
        </p>

        <PanelFormula>
          {
            'V(H)=L\\cup R,'
            + '\\qquad '
            + '\\Delta(H[L])\\leq s,'
            + '\\qquad '
            + '\\Delta(H[R])\\leq t.'
          }
        </PanelFormula>

        <p>
          Orient every residual cut edge
          from{' '}
          <Math>{'R'}</Math>{' '}
          to{' '}
          <Math>{'L'}</Math>{' '}
          and orient{' '}
          <Math>{'H[R]'}</Math>{' '}
          in a balanced way.
        </p>

        <p>
          If{' '}
          <Math>{'P_Q\\subseteq L'}</Math>{' '}
          is an independent union of bad
          TOTAL outdegree classes and every
          vertex of{' '}
          <Math>{'P_Q'}</Math>{' '}
          needs one unit of increase, the
          repair simultaneously performs
        </p>

        <PanelFormula>
          {
            'q\\to q+1'
            + '\\qquad'
            + '\\text{for every }q\\in Q.'
          }
        </PanelFormula>
      </section>

      {/* TWO INDEPENDENCE SOURCES */}

      <section
        style={{
          marginBottom:
            '32px',
        }}
      >
        <h3>
          Where independence comes from
        </h3>

        <p>
          The live tool recognizes two
          certificates.
        </p>

        <p>
          First, Stabilize classes{' '}
          <Math>{'Q'}</Math>{' '}
          can explicitly certify that{' '}
          <Math>{'P_Q'}</Math>{' '}
          is independent.
        </p>

        <p>
          Second, there is an automatic
          certificate which is especially
          useful after 2-factor removal.
          Because the cut points{' '}
          <Math>{'R\\to L'}</Math>, a vertex
          of{' '}
          <Math>{'L'}</Math>{' '}
          with TOTAL outdegree exactly{' '}
          <Math>{'r'}</Math>{' '}
          has no outgoing residual edge:
        </p>

        <PanelFormula>
          {
            'd_G^+(v)=r'
            + '\\quad\\Longleftrightarrow\\quad'
            + 'd_{H[L]}^+(v)=0.'
          }
        </PanelFormula>

        <p>
          The zero-outdegree vertices in
          any orientation of{' '}
          <Math>{'H[L]'}</Math>{' '}
          form an independent set: an edge
          between two such vertices would
          have to point out of one of them.
          Thus
        </p>

        <PanelFormula>
          {
            'P_r'
            + '='
            + '\\{v\\in L:d_G^+(v)=r\\}'
            + '\\text{ is automatically independent}.'
          }
        </PanelFormula>
      </section>

      {/* RESERVOIR CAPACITY */}

      <section
        style={{
          marginBottom:
            '32px',
        }}
      >
        <h3>
          Reservoir capacities
        </h3>

        <p>
          Put
        </p>

        <PanelFormula>
          {
            'k'
            + '='
            + '\\left\\lceil'
            + '\\frac{t+1}{2}'
            + '\\right\\rceil.'
          }
        </PanelFormula>

        <p>
          If{' '}
          <Math>{'i(b)=d^-_{H[R]}(b)'}</Math>,
          then before repair the TOTAL
          outdegree of{' '}
          <Math>{'b\\in R'}</Math>{' '}
          is
        </p>

        <PanelFormula>
          {
            'd_G^+(b)=r+d_H-i(b).'
          }
        </PanelFormula>

        <p>
          Give{' '}
          <Math>{'b'}</Math>{' '}
          capacity{' '}
          <Math>{'c(b)=k-i(b)'}</Math>.
          Starting at most this many repair
          paths at{' '}
          <Math>{'b'}</Math>{' '}
          leaves its TOTAL outdegree at
          least
        </p>

        <PanelFormula>
          {
            'r+d_H-i(b)-c(b)'
            + '='
            + 'r+d_H-k.'
          }
        </PanelFormula>

        <p>
          Hence the TOTAL reservoir
          interval
        </p>

        <PanelFormula>
          {
            'r+d_H-k,'
            + '\\ldots,'
            + 'r+d_H'
          }
        </PanelFormula>

        <p>
          must be safe.
        </p>
      </section>

      {/* CUT */}

      <section
        style={{
          marginBottom:
            '32px',
        }}
      >
        <h3>
          Why the paths exist
        </h3>

        <p>
          Directed Menger is applied only
          inside the residual graph{' '}
          <Math>{'H'}</Math>; the already
          oriented 2-factors are never
          changed. Every demand vertex has
          demand one.
        </p>

        <p>
          For{' '}
          <Math>{'S\\subseteq R'}</Math>,
          let
        </p>

        <PanelFormula>
          {
            'Q_{P_Q}(S)'
            + '='
            + '\\{'
            + 'p\\in P_Q:'
            + 'N_H(p)\\cap R\\subseteq S'
            + '\\}.'
          }
        </PanelFormula>

        <p>
          The Menger cut condition reduces
          to
        </p>

        <PanelFormula>
          {
            'e_{H[R]}(S)'
            + '+'
            + '|Q_{P_Q}(S)|'
            + '\\leq k|S|.'
          }
        </PanelFormula>

        <p>
          The strengthened Lovász
          certificate gives
        </p>

        <PanelFormula>
          {
            'e_{H[R]}(S)'
            + '+'
            + '|Q_{P_Q}(S)|'
            + '\\leq '
            + '\\frac{t+1}{2}|S|'
            + '\\leq k|S|.'
          }
        </PanelFormula>

        <p>
          Therefore the required
          arc-disjoint repair paths exist.
          Reversing them increases every
          demand vertex by one and keeps
          every reservoir vertex in its
          safe TOTAL interval.
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
          <p>
            Reservoir mode becomes
            available once the current
            proof state supplies a
            strengthened Lovász partition,
            the cut{' '}
            <Math>{'R\\to L'}</Math>,
            a balanced orientation of the
            reservoir, and one of the two
            independence certificates
            above.
          </p>
        ) : (
          <>
            <p>
              The current degree frame is
            </p>

            <PanelFormula>
              {
                `d=${application.originalDegree},`
                + '\\qquad '
                + `d_H=${application.workingDegree},`
                + '\\qquad '
                + `r=${application.fixedOutdegreeContribution}.`
              }
            </PanelFormula>

            {application
              .independenceSource ===
            'zero-internal' ? (
              <>
                <p>
                  No stabilization step is
                  needed. The demand class
                  is the automatic
                  zero-internal class:
                </p>

                <PanelFormula>
                  {
                    `P_{${application.q}}`
                    + '='
                    + '\\{'
                    + 'v\\in L:'
                    + `d_G^+(v)=${application.q}`
                    + '\\}'
                    + '\\text{ is independent}.'
                  }
                </PanelFormula>
              </>
            ) : (
              <>
                <p>
                  The stabilization
                  certificate gives
                </p>

                <PanelFormula>
                  {
                    'Q='
                    + latexSet(
                      application.qs,
                    )
                    + ','
                    + '\\qquad '
                    + 'P_Q'
                    + '\\text{ independent}.'
                  }
                </PanelFormula>
              </>
            )}

            <p>
              Reservoir Menger repairs
            </p>

            <PanelFormula>
              {
                getRepairLatex(
                  application,
                )
                + '.'
              }
            </PanelFormula>

            <p>
              The Lovász parameters and
              reservoir coefficient are
            </p>

            <PanelFormula>
              {
                `(s,t)=(${application.certificate.s},${application.certificate.t}),`
                + '\\qquad '
                + `k=${application.certificate.k}.`
              }
            </PanelFormula>

            <p>
              Every reservoir vertex
              finishes with TOTAL
              outdegree in
            </p>

            <PanelFormula>
              {
                'd_G^+(v)'
                + '\\in '
                + latexSet(
                  application
                    .certificate
                    .reservoirSafeOutdegrees,
                )
                + '.'
              }
            </PanelFormula>

            <p>
              Before repair, the possible
              TOTAL outdegrees were
            </p>

            <PanelFormula>
              {
                'L:'
                + '\\ '
                + latexSet(
                  application
                    .startingOutdegreesL,
                )
                + ','
                + '\\qquad '
                + 'R:'
                + '\\ '
                + latexSet(
                  application
                    .startingOutdegreesR,
                )
                + '.'
              }
            </PanelFormula>

            {application
              .certificate
              .t ===
            1 && (
              <>
                <h3>
                  The{' '}
                  <Math>{'t=1'}</Math>{' '}
                  picture
                </h3>

                <p>
                  Here every component of{' '}
                  <Math>{'H[R]'}</Math>{' '}
                  is a single vertex or a
                  single edge. The same
                  Lovász cut inequality is
                  exactly Hall's condition
                  saying that the
                  independent demand set
                  can be matched to
                  distinct components of{' '}
                  <Math>{'H[R]'}</Math>.
                  Thus the reservoir
                  certificate specializes
                  to the component-matching
                  argument.
                </p>
              </>
            )}
          </>
        )}
      </section>

      {/* RELATION */}

      <section>
        <h3>
          Role of Directed Menger
        </h3>

        <p
          style={{
            marginBottom: 0,
          }}
        >
          Reservoir mode is a specialized
          certificate for the same directed
          path-reversal mechanism as the
          local{' '}
          <Math>{'\\alpha'}</Math>
          -certificate. The difference is
          that the strengthened Lovász
          structure supplies the global cut
          inequalities automatically.
        </p>
      </section>
    </>
  )
}
