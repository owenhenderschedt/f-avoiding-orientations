import Math from '../components/Math'

export const directedMengerRepairTool = {
  id: 'directed-menger-repair',
  name: 'Directed Menger Repair',
  menuLabel: 'Repair by directed paths',
} as const

export function DirectedMengerRepairReference() {
  return (
    <>
      <section style={{ marginBottom: '32px' }}>
        <h3 style={{ marginTop: 0 }}>
          Directed path repair
        </h3>

        <p>
          Suppose <Math>{'D'}</Math> is an orientation of{' '}
          <Math>{'G'}</Math>. If
        </p>

        <div
          style={{
            textAlign: 'center',
            margin: '18px 0',
          }}
        >
          <Math display>
            {'P=v_0v_1\\cdots v_k'}
          </Math>
        </div>

        <p>
          is a directed path, reverse every edge of{' '}
          <Math>{'P'}</Math>. Then
        </p>

        <div
          style={{
            textAlign: 'center',
            margin: '18px 0',
          }}
        >
          <Math display>
            {
              'd^+(v_0)\\mapsto d^+(v_0)-1,'
              + '\\qquad '
              + 'd^+(v_k)\\mapsto d^+(v_k)+1.'
            }
          </Math>
        </div>

        <p>
          The outdegree of every internal vertex of the path
          is unchanged. Thus a directed path transports one
          unit of outdegree from its initial vertex to its
          terminal vertex.
        </p>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h3>Repair theorem</h3>

        <p>
          Let <Math>{'J'}</Math> be a subdigraph of the current
          orientation <Math>{'D'}</Math>, and let{' '}
          <Math>{'B'}</Math> be the set of bad vertices.
        </p>

        <p>
          For each <Math>{'b\\in B'}</Math>, choose a positive
          integer <Math>{'r(b)'}</Math> such that
        </p>

        <div
          style={{
            textAlign: 'center',
            margin: '18px 0',
          }}
        >
          <Math display>
            {
              'd_D^+(b)+r(b)\\notin F(b).'
            }
          </Math>
        </div>

        <p>
          We call <Math>{'r(b)'}</Math> the demand at{' '}
          <Math>{'b'}</Math>. It is the number of units of
          outdegree that must be transported into{' '}
          <Math>{'b'}</Math>.
        </p>

        <p>
          For each safe vertex <Math>{'v\\notin B'}</Math>,
          choose a nonnegative integer <Math>{'c(v)'}</Math>
          such that
        </p>

        <div
          style={{
            textAlign: 'center',
            margin: '18px 0',
          }}
        >
          <Math display>
            {
              'd_D^+(v)-j\\notin F(v)'
              + '\\qquad'
              + '(0\\leq j\\leq c(v)).'
            }
          </Math>
        </div>

        <p>
          Thus <Math>{'c(v)'}</Math> is the amount of
          outdegree that <Math>{'v'}</Math> may give away
          while remaining safe.
        </p>

        <p>
          If for every <Math>{'Y\\subseteq V(G)'}</Math>,
        </p>

        <div
          style={{
            textAlign: 'center',
            margin: '18px 0',
          }}
        >
          <Math display>
            {
              '\\sum_{b\\in B\\cap Y}r(b)'
              + '\\leq '
              + 'e_J(V(G)\\setminus Y,Y)'
              + '+'
              + '\\sum_{v\\in Y\\setminus B}c(v),'
            }
          </Math>
        </div>

        <p>
          then there is a collection of pairwise
          arc-disjoint directed repair paths whose reversal
          produces an <Math>{'F'}</Math>-avoiding orientation.
        </p>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h3>Why the cut condition works</h3>

        <p>
          Let
        </p>

        <div
          style={{
            textAlign: 'center',
            margin: '18px 0',
          }}
        >
          <Math display>
            {'R=\\sum_{b\\in B}r(b).'}
          </Math>
        </div>

        <p>
          Construct an auxiliary directed multigraph{' '}
          <Math>{'N'}</Math> by adding a source{' '}
          <Math>{'s'}</Math> and a sink <Math>{'t'}</Math>.
          Keep every arc of <Math>{'J'}</Math>. For each safe
          vertex <Math>{'v'}</Math>, add{' '}
          <Math>{'c(v)'}</Math> arcs from{' '}
          <Math>{'s'}</Math> to <Math>{'v'}</Math>. For each
          bad vertex <Math>{'b'}</Math>, add{' '}
          <Math>{'r(b)'}</Math> arcs from{' '}
          <Math>{'b'}</Math> to <Math>{'t'}</Math>.
        </p>

        <p>
          Consider an <Math>{'s'}</Math>–
          <Math>{'t'}</Math> cut, and let{' '}
          <Math>{'Y'}</Math> be the original vertices on the
          <Math>{'t'}</Math>-side. Its capacity is
        </p>

        <div
          style={{
            textAlign: 'center',
            margin: '18px 0',
          }}
        >
          <Math display>
            {
              '\\sum_{v\\in Y\\setminus B}c(v)'
              + '+'
              + 'e_J(V(G)\\setminus Y,Y)'
              + '+'
              + '\\sum_{b\\in B\\setminus Y}r(b).'
            }
          </Math>
        </div>

        <p>
          By the repair cut condition this is at least{' '}
          <Math>{'R'}</Math>. Therefore every directed{' '}
          <Math>{'s'}</Math>–
          <Math>{'t'}</Math> cut contains at least{' '}
          <Math>{'R'}</Math> arcs.
        </p>

        <p>
          Directed Menger's theorem gives{' '}
          <Math>{'R'}</Math> pairwise arc-disjoint directed
          <Math>{'s'}</Math>–
          <Math>{'t'}</Math> paths. After deleting their first
          and last auxiliary arcs, we obtain the required
          repair paths in <Math>{'J'}</Math>.
        </p>

        <p>
          Reversing these paths increases each bad vertex by
          exactly its demand, decreases each supplying vertex
          by no more than its capacity, and leaves every
          internal vertex unchanged. Hence every vertex is
          safe.
        </p>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h3>Useful local form</h3>

        <p>
          Extend <Math>{'r'}</Math> by zero outside{' '}
          <Math>{'B'}</Math> and <Math>{'c'}</Math> by zero
          on <Math>{'B'}</Math>. A convenient sufficient
          condition for the cut inequality is the existence
          of <Math>{'\\alpha\\in[0,1]'}</Math> such that
        </p>

        <div
          style={{
            textAlign: 'center',
            margin: '18px 0',
          }}
        >
          <Math display>
            {
              'r(v)-c(v)'
              + '\\leq '
              + '\\alpha'
              + '\\bigl('
              + 'd_J^-(v)-d_J^+(v)'
              + '\\bigr)'
            }
          </Math>
        </div>

        <p>
          for every vertex <Math>{'v'}</Math>.
        </p>

        <p>
          Indeed, summing this inequality over a set{' '}
          <Math>{'Y'}</Math> cancels every arc internal to{' '}
          <Math>{'Y'}</Math>, leaving only the difference
          between arcs entering and leaving the set. This
          yields the required cut condition.
        </p>
      </section>

      <section>
        <h3>References</h3>

        <p>
          G. A. Dirac, <em>Short proof of Menger&apos;s graph
          theorem</em>, Mathematika <strong>13</strong> (1966),
          42–44.
        </p>

        <p style={{ marginBottom: 0 }}>
          L. R. Ford, Jr. and D. R. Fulkerson,{' '}
          <em>Maximal flow through a network</em>, Canadian
          Journal of Mathematics <strong>8</strong> (1956),
          399–404.
        </p>
      </section>
    </>
  )
}