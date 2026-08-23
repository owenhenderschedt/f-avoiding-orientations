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
          Suppose{' '}
          <Math>{'G'}</Math>{' '}
          is{' '}
          <Math>{'d'}</Math>
          -regular and we have a
          strengthened Lovász
          partition
        </p>

        <PanelFormula>
          {
            'V(G)=L\\cup R,'
            + '\\qquad '
            + '\\Delta(G[L])\\leq s,'
            + '\\qquad '
            + '\\Delta(G[R])\\leq t,'
          }
        </PanelFormula>

        <p>
          with the cut oriented
        </p>

        <PanelFormula>
          {
            'R\\to L.'
          }
        </PanelFormula>

        <p>
          Let
        </p>

        <PanelFormula>
          {
            'P_q'
            + '='
            + '\\{'
            + 'v\\in L:'
            + 'd_D^+(v)=q'
            + '\\}'
          }
        </PanelFormula>

        <p>
          be an independent
          outdegree class.
          We want to increase
          every vertex of{' '}
          <Math>{'P_q'}</Math>{' '}
          by one:
        </p>

        <PanelFormula>
          {
            'q\\to q+1.'
          }
        </PanelFormula>
      </section>

      {/* RESERVOIR CAPACITIES */}

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
          Orient{' '}
          <Math>{'G[R]'}</Math>{' '}
          in a balanced way and put
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
          For{' '}
          <Math>{'b\\in R'}</Math>,
          let
        </p>

        <PanelFormula>
          {
            'i(b)'
            + '='
            + 'd^-_{D[R]}(b).'
          }
        </PanelFormula>

        <p>
          Since{' '}
          <Math>{'D[R]'}</Math>{' '}
          is balanced and{' '}
          <Math>{'d_{G[R]}(b)\\leq t'}</Math>,
          we have
        </p>

        <PanelFormula>
          {
            'i(b)'
            + '\\leq '
            + '\\left\\lceil'
            + '\\frac{t}{2}'
            + '\\right\\rceil'
            + '\\leq k.'
          }
        </PanelFormula>

        <p>
          Give{' '}
          <Math>{'b'}</Math>{' '}
          capacity
        </p>

        <PanelFormula>
          {
            'c(b)=k-i(b).'
          }
        </PanelFormula>

        <p>
          Because every cut edge
          points from{' '}
          <Math>{'R'}</Math>{' '}
          to{' '}
          <Math>{'L'}</Math>,
          the total outdegree of{' '}
          <Math>{'b'}</Math>{' '}
          before repair is
        </p>

        <PanelFormula>
          {
            'd_D^+(b)=d-i(b).'
          }
        </PanelFormula>

        <p>
          If at most{' '}
          <Math>{'c(b)'}</Math>{' '}
          repair paths begin at{' '}
          <Math>{'b'}</Math>,
          then its final outdegree
          is at least
        </p>

        <PanelFormula>
          {
            'd-i(b)-c(b)'
            + '='
            + 'd-k.'
          }
        </PanelFormula>

        <p>
          Thus it is enough that
          every outdegree in the
          reservoir interval
        </p>

        <PanelFormula>
          {
            'd-k,'
            + 'd-k+1,'
            + '\\ldots,'
            + 'd'
          }
        </PanelFormula>

        <p>
          is safe.
        </p>
      </section>

      {/* CUT ARGUMENT */}

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
          Apply the directed
          Menger repair theorem to
          the digraph induced by
        </p>

        <PanelFormula>
          {
            'R\\cup P_q.'
          }
        </PanelFormula>

        <p>
          Each vertex of{' '}
          <Math>{'P_q'}</Math>{' '}
          has demand{' '}
          <Math>{'1'}</Math>,
          while vertices of{' '}
          <Math>{'R'}</Math>{' '}
          have the capacities
          above.
        </p>

        <p>
          Fix a cut and let{' '}
          <Math>{'S'}</Math>{' '}
          be its vertices in{' '}
          <Math>{'R'}</Math>.
          The only bad vertices
          not automatically reached
          by a crossing arc from{' '}
          <Math>{'R\\setminus S'}</Math>{' '}
          are those in
        </p>

        <PanelFormula>
          {
            'Q_{P_q}(S)'
            + '='
            + '\\{'
            + 'p\\in P_q:'
            + 'N_G(p)\\cap R'
            + '\\subseteq S'
            + '\\}.'
          }
        </PanelFormula>

        <p>
          Therefore the remaining
          cut condition reduces to
        </p>

        <PanelFormula>
          {
            '|Q_{P_q}(S)|'
            + '\\leq '
            + 'e_D(R\\setminus S,S)'
            + '+'
            + '\\sum_{b\\in S}'
            + 'c(b).'
          }
        </PanelFormula>

        <p>
          But
        </p>

        <PanelFormula>
          {
            '\\sum_{b\\in S}i(b)'
            + '='
            + 'e_D(R\\setminus S,S)'
            + '+'
            + 'e_{G[R]}(S).'
          }
        </PanelFormula>

        <p>
          Hence the right-hand
          side becomes
        </p>

        <PanelFormula>
          {
            'k|S|-e_{G[R]}(S).'
          }
        </PanelFormula>

        <p>
          So it remains only to
          prove
        </p>

        <PanelFormula>
          {
            'e_{G[R]}(S)'
            + '+'
            + '|Q_{P_q}(S)|'
            + '\\leq '
            + 'k|S|.'
          }
        </PanelFormula>

        <p>
          This is exactly what the
          strengthened Lovász
          certificate provides,
          since
        </p>

        <PanelFormula>
          {
            'e_{G[R]}(S)'
            + '+'
            + '|Q_{P_q}(S)|'
            + '\\leq '
            + '\\frac{t+1}{2}|S|'
            + '\\leq '
            + 'k|S|.'
          }
        </PanelFormula>

        <p>
          Therefore the required
          directed paths exist.
          Reversing them increases
          every vertex of{' '}
          <Math>{'P_q'}</Math>{' '}
          by one while keeping all
          reservoir vertices inside
          the certified safe
          interval.
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
            Reservoir mode is
            available when the
            current proof state
            supplies a strengthened
            Lovász partition, an
            independent{' '}

            <Math>{'q'}</Math>
            -class in{' '}

            <Math>{'L'}</Math>,
            the orientation{' '}

            <Math>{'R\\to L'}</Math>,
            and a balanced
            orientation of{' '}

            <Math>{'G[R]'}</Math>.
          </p>
        ) : (
          <>
            <p>
              Here the independent
              bad class is
            </p>

            <PanelFormula>
              {
                `P_{${application.q}}`
                + '='
                + '\\{'
                + 'v\\in L:'
                + `d_D^+(v)=${application.q}`
                + '\\}.'
              }
            </PanelFormula>

            <p>
              Reservoir Menger
              repairs
            </p>

            <PanelFormula>
              {
                `${application.q}`
                + '\\to'
                + `${application.repairedOutdegree}.`
              }
            </PanelFormula>

            <p>
              The Lovász parameters
              are
            </p>

            <PanelFormula>
              {
                `(s,t)=(${application.certificate.s},${application.certificate.t}),`
                + '\\qquad '
                + `k=${application.certificate.k}.`
              }
            </PanelFormula>

            <p>
              Thus every reservoir
              vertex remains in
            </p>

            <PanelFormula>
              {
                'd_D^+(v)'
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
              Before the repair,
              the possible total
              outdegrees were
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
          </>
        )}
      </section>

      {/* RELATION TO DIRECTED MENGER */}

      <section>
        <h3>
          Role of Directed Menger
        </h3>

        <p
          style={{
            marginBottom: 0,
          }}
        >
          Reservoir mode is not a
          different repair theorem.
          It is a specialized
          certificate for the same
          directed Menger path
          reversal mechanism. The
          strengthened Lovász
          partition supplies the
          cut inequality
          automatically, so the
          user does not need to
          enter demands, capacities,
          or an{' '}

          <Math>{'\\alpha'}</Math>
          -certificate by hand.
        </p>
      </section>
    </>
  )
}