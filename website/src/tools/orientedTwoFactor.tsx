import Math from '../components/Math'

export const orientedTwoFactorTool = {
  id: 'oriented-two-factor',
  name: 'Oriented 2-Factor',
  menuLabel: 'Orient a 2-factor',
} as const

type OrientedTwoFactorReferenceProps = {
  degree: number
}

export function OrientedTwoFactorReference({
  degree,
}: OrientedTwoFactorReferenceProps) {
  const residualDegree = degree - 2

  return (
    <>
      <section style={{ marginBottom: '32px' }}>
        <h3 style={{ marginTop: 0 }}>
          Lemma (Oriented 2-factor)
        </h3>

        <p>
          Let <Math>{'G'}</Math> be a finite{' '}
          <Math>{'2k'}</Math>-regular graph with{' '}
          <Math>{'k\\ge 1'}</Math>. Then{' '}
          <Math>{'G'}</Math> contains a spanning 2-factor{' '}
          <Math>{'C'}</Math>. Moreover, the cycles of{' '}
          <Math>{'C'}</Math> can be oriented so that
        </p>

        <div
          style={{
            textAlign: 'center',
            margin: '18px 0',
          }}
        >
          <Math display>
            {'d_C^+(v)=d_C^-(v)=1'}
          </Math>
        </div>

        <p>
          for every <Math>{'v\\in V(G)'}</Math>.
        </p>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h3>Proof</h3>

        <p>
          Since every vertex of <Math>{'G'}</Math> has even
          degree, orient an Euler tour in each component
          consistently. The resulting orientation has
        </p>

        <div
          style={{
            textAlign: 'center',
            margin: '18px 0',
          }}
        >
          <Math display>
            {'d^+(v)=d^-(v)=k'}
          </Math>
        </div>

        <p>
          at every vertex.
        </p>

        <p>
          Form a bipartite graph <Math>{'B'}</Math> with two
          copies <Math>{'V_L'}</Math> and{' '}
          <Math>{'V_R'}</Math> of <Math>{'V(G)'}</Math>. For
          every directed edge <Math>{'u\\to v'}</Math> of the
          Eulerian orientation, put the edge{' '}
          <Math>{'u_Lv_R'}</Math> in <Math>{'B'}</Math>.
        </p>

        <p>
          Every vertex of <Math>{'B'}</Math> has degree{' '}
          <Math>{'k'}</Math>, so <Math>{'B'}</Math> is a
          regular bipartite graph. By Hall&apos;s theorem it has
          a perfect matching.
        </p>

        <p>
          Take the directed edges of <Math>{'G'}</Math>
          corresponding to the matching edges. Exactly one of
          these edges leaves each vertex and exactly one enters
          each vertex. Hence the chosen edges form a disjoint
          union of directed cycles spanning all vertices.
        </p>

        <p>
          Their underlying edges form the required 2-factor{' '}
          <Math>{'C'}</Math>, and its displayed orientation
          satisfies
        </p>

        <div
          style={{
            textAlign: 'center',
            margin: '18px 0',
          }}
        >
          <Math display>
            {'d_C^+(v)=d_C^-(v)=1.'}
          </Math>
        </div>
      </section>

      <section>
        <h3>Application here</h3>

        <p>
          We apply the lemma to the current{' '}
          <Math>{`${degree}`}</Math>-regular graph. Choose an
          oriented spanning 2-factor <Math>{'C'}</Math>.
          Every vertex receives exactly one outgoing edge from{' '}
          <Math>{'C'}</Math>.
        </p>

        <p>
          After removing <Math>{'C'}</Math>, every vertex loses
          two incident edges. Therefore the residual graph
        </p>

        <div
          style={{
            textAlign: 'center',
            margin: '18px 0',
          }}
        >
          <Math display>
            {'G\\mathbin{-}C'}
          </Math>
        </div>

        <p>
          is <Math>{`${residualDegree}`}</Math>-regular.
          If the residual graph is eventually oriented with
          outdegree <Math>{'r'}</Math> at a vertex, then its
          total outdegree in <Math>{'G'}</Math> is
        </p>

        <div
          style={{
            textAlign: 'center',
            margin: '18px 0',
          }}
        >
          <Math display>
            {'d_G^+(v)=1+r.'}
          </Math>
        </div>
      </section>
    </>
  )
}