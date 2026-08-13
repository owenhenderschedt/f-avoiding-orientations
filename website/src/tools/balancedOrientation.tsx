import Math from '../components/Math'
import type { GraphPart } from '../playground/outdegreePossibilities'
import type { LovaszPair } from './lovaszPartition'

export const balancedOrientationTool = {
  id: 'balanced-orientation',
  name: 'Balanced Orientation',
} as const

type BalancedOrientationReferenceProps = {
  part: GraphPart
  partition: LovaszPair
}

export function BalancedOrientationReference({
  part,
  partition,
}: BalancedOrientationReferenceProps) {
  const subgraph =
    part === 'L' ? 'G[L]' : 'G[R]'

  const maxInternalDegree =
    part === 'L' ? partition.s : partition.t

  return (
    <>
      <section style={{ marginBottom: '32px' }}>
        <h3 style={{ marginTop: 0 }}>
          Lemma (Balanced orientation)
        </h3>

        <p>
          Every finite graph <Math>{'H'}</Math> has an orientation{' '}
          <Math>{'D'}</Math> such that, for every{' '}
          <Math>{'v\\in V(H)'}</Math>,
        </p>

        <div style={{ textAlign: 'center', margin: '18px 0' }}>
          <Math display>
            {
              'd_D^+(v)\\in'
              + '\\left\\{'
              + '\\left\\lfloor\\frac{d_H(v)}{2}\\right\\rfloor,'
              + '\\left\\lceil\\frac{d_H(v)}{2}\\right\\rceil'
              + '\\right\\}.'
            }
          </Math>
        </div>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h3>Proof</h3>

        <p>
          Let <Math>{'O'}</Math> be the set of odd-degree vertices of{' '}
          <Math>{'H'}</Math>. Add a new vertex <Math>{'x'}</Math> and
          join <Math>{'x'}</Math> to every vertex of{' '}
          <Math>{'O'}</Math>.
        </p>

        <p>
          By the Handshaking Lemma, <Math>{'|O|'}</Math> is even.
          Hence every vertex of the resulting graph has even degree:
          each vertex of <Math>{'O'}</Math> has gained one edge,
          every other vertex of <Math>{'H'}</Math> already had even
          degree, and <Math>{'x'}</Math> has degree{' '}
          <Math>{'|O|'}</Math>.
        </p>

        <p>
          Orient an Euler tour of each nontrivial component consistently
          around the tour. Every vertex then has equal indegree and
          outdegree in the augmented graph.
        </p>

        <p>
          Now delete the edges incident with <Math>{'x'}</Math>. If{' '}
          <Math>{'d_H(v)'}</Math> is even, then no added edge was
          incident with <Math>{'v'}</Math>, so
        </p>

        <div style={{ textAlign: 'center', margin: '18px 0' }}>
          <Math display>
            {'d_D^+(v)=\\frac{d_H(v)}{2}.'}
          </Math>
        </div>

        <p>
          If <Math>{'d_H(v)'}</Math> is odd, exactly one added edge is
          deleted at <Math>{'v'}</Math>. Therefore
        </p>

        <div style={{ textAlign: 'center', margin: '18px 0' }}>
          <Math display>
            {
              'd_D^+(v)\\in'
              + '\\left\\{'
              + '\\frac{d_H(v)-1}{2},'
              + '\\frac{d_H(v)+1}{2}'
              + '\\right\\}.'
            }
          </Math>
        </div>

        <p>
          Thus <Math>{'D'}</Math> is a balanced orientation of{' '}
          <Math>{'H'}</Math>.
        </p>
      </section>

      <section>
        <h3>Application here</h3>

        <p>
          We apply the lemma to <Math>{subgraph}</Math>. The Lovász
          partition gives
        </p>

        <div style={{ textAlign: 'center', margin: '18px 0' }}>
          <Math display>
            {`\\Delta(${subgraph})\\le ${maxInternalDegree}.`}
          </Math>
        </div>

        <p>
          Thus we may orient every edge of <Math>{subgraph}</Math> so
          that each vertex <Math>{`v\\in ${part}`}</Math> has internal
          outdegree
        </p>

        <div style={{ textAlign: 'center', margin: '18px 0' }}>
          <Math display>
            {
              'd_{'
              + subgraph
              + '}^+(v)\\in'
              + '\\left\\{'
              + '\\left\\lfloor\\frac{d_{'
              + subgraph
              + '}(v)}{2}\\right\\rfloor,'
              + '\\left\\lceil\\frac{d_{'
              + subgraph
              + '}(v)}{2}\\right\\rceil'
              + '\\right\\}.'
            }
          </Math>
        </div>

        <p>
          This move orients only the edges inside{' '}
          <Math>{subgraph}</Math>. It does not orient or alter any edge
          between <Math>{'L'}</Math> and <Math>{'R'}</Math>.
        </p>
      </section>
    </>
  )
}