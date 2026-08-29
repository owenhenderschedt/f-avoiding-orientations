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
            + '\\Delta(G[R])\\leq t.'
          }
        </PanelFormula>

        <p>
          Orient every cut edge from{' '}
          <Math>{'R'}</Math>{' '}
          to{' '}
          <Math>{'L'}</Math>{' '}
          and orient{' '}
          <Math>{'G[R]'}</Math>{' '}
          in a balanced way.
        </p>

        <p>
          Let{' '}
          <Math>{'Q'}</Math>{' '}
          be a set of bad total
          outdegree classes in{' '}
          <Math>{'L'}</Math>, and define
        </p>

        <PanelFormula>
          {
            'P_Q'
            + '='
            + '\\{'
            + 'v\\in L:'
            + 'd_D^+(v)\\in Q'
            + '\\}.'
          }
        </PanelFormula>

        <p>
          Assume that{' '}
          <Math>{'P_Q'}</Math>{' '}
          is independent.  The reservoir
          repair increases every vertex of{' '}
          <Math>{'P_Q'}</Math>{' '}
          by exactly one, so every selected
          class is repaired simultaneously:
        </p>

        <PanelFormula>
          {
            'q\\to q+1'
            + '\\qquad'
            + '\\text{for every }q\\in Q.'
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
          Because every cut edge points
          from{' '}
          <Math>{'R'}</Math>{' '}
          to{' '}
          <Math>{'L'}</Math>, the total
          outdegree of{' '}
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
          <Math>{'b'}</Math>, its final
          outdegree is at least
        </p>

        <PanelFormula>
          {
            'd-i(b)-c(b)'
            + '='
            + 'd-k.'
          }
        </PanelFormula>

        <p>
          Therefore the whole reservoir
          interval
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
          must be safe.
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
          Apply the directed Menger repair
          theorem to the digraph induced by
        </p>

        <PanelFormula>
          {
            'R\\cup P_Q.'
          }
        </PanelFormula>

        <p>
          Every vertex of{' '}
          <Math>{'P_Q'}</Math>{' '}
          has demand one.  Notice that the
          cut argument uses only the fact
          that{' '}
          <Math>{'P_Q'}</Math>{' '}
          is independent; its vertices do
          not need to have the same
          outdegree.
        </p>

        <p>
          For{' '}
          <Math>{'S\\subseteq R'}</Math>, put
        </p>

        <PanelFormula>
          {
            'Q_{P_Q}(S)'
            + '='
            + '\\{'
            + 'p\\in P_Q:'
            + 'N_G(p)\\cap R'
            + '\\subseteq S'
            + '\\}.'
          }
        </PanelFormula>

        <p>
          The directed cut condition reduces
          to
        </p>

        <PanelFormula>
          {
            '|Q_{P_Q}(S)|'
            + '\\leq '
            + 'e_D(R\\setminus S,S)'
            + '+'
            + '\\sum_{b\\in S}'
            + 'c(b).'
          }
        </PanelFormula>

        <p>
          Since
        </p>

        <PanelFormula>
          {
            '\\sum_{b\\in S}i(b)'
            + '='
            + 'e_D(R\\setminus S,S)'
            + '+'
            + 'e_{G[R]}(S),'
          }
        </PanelFormula>

        <p>
          the right-hand side is
        </p>

        <PanelFormula>
          {
            'k|S|-e_{G[R]}(S).'
          }
        </PanelFormula>

        <p>
          Thus it is enough to have
        </p>

        <PanelFormula>
          {
            'e_{G[R]}(S)'
            + '+'
            + '|Q_{P_Q}(S)|'
            + '\\leq '
            + 'k|S|.'
          }
        </PanelFormula>

        <p>
          The strengthened Lovász
          certificate gives the stronger
          inequality
        </p>

        <PanelFormula>
          {
            'e_{G[R]}(S)'
            + '+'
            + '|Q_{P_Q}(S)|'
            + '\\leq '
            + '\\frac{t+1}{2}|S|'
            + '\\leq '
            + 'k|S|.'
          }
        </PanelFormula>

        <p>
          Therefore the required directed
          paths exist.  Reversing them
          raises every demand vertex by one,
          while every reservoir vertex stays
          inside the certified safe interval.
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
            Reservoir mode is available when
            the current proof state supplies
            a strengthened Lovász partition,
            an independent set{' '}
            <Math>{'P_Q\\subseteq L'}</Math>,
            the cut orientation{' '}
            <Math>{'R\\to L'}</Math>, and a
            balanced orientation of{' '}
            <Math>{'G[R]'}</Math>.
          </p>
        ) : (
          <>
            <p>
              Here the selected bad classes
              are
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
              The stabilization certificate
              says that
            </p>

            <PanelFormula>
              {
                'P_Q'
                + '='
                + '\\{'
                + 'v\\in L:'
                + 'd_D^+(v)\\in Q'
                + '\\}'
                + '\\text{ is independent}.'
              }
            </PanelFormula>

            <p>
              Reservoir Menger repairs all
              selected classes at once:
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
              The Lovász parameters are
            </p>

            <PanelFormula>
              {
                `(s,t)=(${application.certificate.s},${application.certificate.t}),`
                + '\\qquad '
                + `k=${application.certificate.k}.`
              }
            </PanelFormula>

            <p>
              Thus every reservoir vertex
              remains in
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
              Before the repair, the possible
              total outdegrees were
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
          Reservoir mode is a specialized
          certificate for the same directed
          Menger path-reversal mechanism as
          the local{' '}
          <Math>{'\\alpha'}</Math>
          -certificate mode.  The
          strengthened Lovász partition
          supplies the cut inequality
          automatically, so the user does
          not need to enter demands or
          capacities by hand.
        </p>
      </section>
    </>
  )
}
