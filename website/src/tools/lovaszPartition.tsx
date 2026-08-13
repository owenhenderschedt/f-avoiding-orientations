import Math from '../components/Math'

export type LovaszPair = {
  s: number
  t: number
}

export const lovaszPartitionTool = {
  id: 'lovasz-partition',
  name: 'Lovász Partition',
  menuLabel: 'Lovász partition',
} as const

export const lovaszPairs: LovaszPair[] = [
  { s: 11, t: 0 },
  { s: 10, t: 1 },
  { s: 9, t: 2 },
  { s: 8, t: 3 },
  { s: 7, t: 4 },
  { s: 6, t: 5 },
]

type LovaszPartitionReferenceProps = {
  partition: LovaszPair | null
}

export function LovaszPartitionReference({
  partition,
}: LovaszPartitionReferenceProps) {
  return (
    <>
      <section style={{ marginBottom: '32px' }}>
        <h3 style={{ marginTop: 0 }}>
          Theorem (Lovász)
        </h3>

        <p>
          Let <Math>{'G'}</Math> be a finite graph, and let{' '}
          <Math>{'s,t\\ge 0'}</Math> be integers satisfying
        </p>

        <div style={{ textAlign: 'center', margin: '18px 0' }}>
          <Math display>
            {'s+t\\ge \\Delta(G)-1.'}
          </Math>
        </div>

        <p>
          Then there is a partition{' '}
          <Math>{'V(G)=L\\cup R'}</Math> such that
        </p>

        <div style={{ textAlign: 'center', margin: '18px 0' }}>
          <Math display>
            {
              '\\Delta(G[L])\\le s'
              + '\\qquad\\text{and}\\qquad'
              + '\\Delta(G[R])\\le t.'
            }
          </Math>
        </div>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h3>Proof</h3>

        <p>
          Among all partitions <Math>{'V(G)=L\\cup R'}</Math>, choose one
          minimizing
        </p>

        <div style={{ textAlign: 'center', margin: '18px 0' }}>
          <Math display>
            {
              '\\Phi(L,R)'
              + '=\\frac{e(G[L])}{s+1}'
              + '+\\frac{e(G[R])}{t+1}.'
            }
          </Math>
        </div>

        <p>
          Suppose that some <Math>{'v\\in L'}</Math> satisfies{' '}
          <Math>{'d_L(v)\\ge s+1'}</Math>. Since
        </p>

        <div style={{ textAlign: 'center', margin: '18px 0' }}>
          <Math display>
            {'d_G(v)\\le \\Delta(G)\\le s+t+1,'}
          </Math>
        </div>

        <p>we have</p>

        <div style={{ textAlign: 'center', margin: '18px 0' }}>
          <Math display>
            {'d_R(v)=d_G(v)-d_L(v)\\le t.'}
          </Math>
        </div>

        <p>
          Moving <Math>{'v'}</Math> from <Math>{'L'}</Math> to{' '}
          <Math>{'R'}</Math> changes <Math>{'\\Phi'}</Math> by
        </p>

        <div style={{ textAlign: 'center', margin: '18px 0' }}>
          <Math display>
            {
              '\\begin{aligned}'
              + '-\\frac{d_L(v)}{s+1}'
              + '+\\frac{d_R(v)}{t+1}'
              + '&\\le -1+\\frac{t}{t+1}\\\\'
              + '&<0.'
              + '\\end{aligned}'
            }
          </Math>
        </div>

        <p>
          This contradicts the minimality of <Math>{'\\Phi'}</Math>.
          Hence <Math>{'\\Delta(G[L])\\le s'}</Math>. By symmetry,{' '}
          <Math>{'\\Delta(G[R])\\le t'}</Math>.
        </p>
      </section>

      {partition !== null && (
        <section style={{ marginBottom: '32px' }}>
          <h3>Application here</h3>

          <p>
            <Math>{'G'}</Math> is{' '}
            <Math>{'12'}</Math>-regular, so{' '}
            <Math>{'\\Delta(G)=12'}</Math>. The chosen parameters are{' '}
            <Math>{`(${partition.s},${partition.t})`}</Math>, and
          </p>

          <div style={{ textAlign: 'center', margin: '18px 0' }}>
            <Math display>
              {
                `${partition.s}+${partition.t}`
                + '=11=12-1=\\Delta(G)-1.'
              }
            </Math>
          </div>

          <p>
            Therefore, the theorem gives a partition{' '}
            <Math>{'V(G)=L\\cup R'}</Math> satisfying
          </p>

          <div style={{ textAlign: 'center', margin: '18px 0' }}>
            <Math display>
              {
                `\\Delta(G[L])\\le ${partition.s}`
                + '\\qquad\\text{and}\\qquad'
                + `\\Delta(G[R])\\le ${partition.t}.`
              }
            </Math>
          </div>
        </section>
      )}

      <section>
        <h3>Reference</h3>

        <p style={{ marginBottom: 0 }}>
          L. Lovász, <em>On decomposition of graphs</em>, Studia
          Scientiarum Mathematicarum Hungarica <strong>1</strong> (1966),
          237–238.
        </p>
      </section>
    </>
  )
}