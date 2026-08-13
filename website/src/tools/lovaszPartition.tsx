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

export function getLovaszPairs(
  degree: number,
): LovaszPair[] {
  const pairs: LovaszPair[] = []

  /*
   * For a d-regular graph we use the tight Lovász condition
   *
   *     s + t = d - 1,
   *
   * and list only one representative from each symmetric pair.
   */
  for (
    let t = 0;
    t <= globalThis.Math.floor((degree - 1) / 2);
    t += 1
  ) {
    pairs.push({
      s: degree - 1 - t,
      t,
    })
  }

  return pairs
}

/*
 * Kept for compatibility with any older code that still imports the
 * original 12-regular menu.
 */
export const lovaszPairs =
  getLovaszPairs(12)

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
          <Math>{'s,t\\geq 0'}</Math> be integers satisfying
        </p>

        <div
          style={{
            textAlign: 'center',
            margin: '18px 0',
          }}
        >
          <Math display>
            {'s+t\\geq \\Delta(G)-1.'}
          </Math>
        </div>

        <p>
          Then <Math>{'V(G)'}</Math> can be partitioned into{' '}
          <Math>{'L\\cup R'}</Math> so that
        </p>

        <div
          style={{
            textAlign: 'center',
            margin: '18px 0',
          }}
        >
          <Math display>
            {
              '\\Delta(G[L])\\leq s,'
              + '\\qquad '
              + '\\Delta(G[R])\\leq t.'
            }
          </Math>
        </div>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h3>Proof</h3>

        <p>
          Among all partitions <Math>{'V(G)=L\\cup R'}</Math>,
          choose one minimizing
        </p>

        <div
          style={{
            textAlign: 'center',
            margin: '18px 0',
          }}
        >
          <Math display>
            {
              '\\Phi(L,R)'
              + '='
              + '\\frac{e(G[L])}{s+1}'
              + '+'
              + '\\frac{e(G[R])}{t+1}.'
            }
          </Math>
        </div>

        <p>
          Suppose some <Math>{'v\\in L'}</Math> has{' '}
          <Math>{'d_L(v)\\geq s+1'}</Math>. Since
        </p>

        <div
          style={{
            textAlign: 'center',
            margin: '18px 0',
          }}
        >
          <Math display>
            {
              'd_L(v)+d_R(v)'
              + '\\leq '
              + '\\Delta(G)'
              + '\\leq '
              + 's+t+1,'
            }
          </Math>
        </div>

        <p>
          we have <Math>{'d_R(v)\\leq t'}</Math>. Moving{' '}
          <Math>{'v'}</Math> from <Math>{'L'}</Math> to{' '}
          <Math>{'R'}</Math> changes the potential by
        </p>

        <div
          style={{
            textAlign: 'center',
            margin: '18px 0',
          }}
        >
          <Math display>
            {
              '-\\frac{d_L(v)}{s+1}'
              + '+'
              + '\\frac{d_R(v)}{t+1}'
              + '\\leq '
              + '-1+\\frac{t}{t+1}'
              + '<0,'
            }
          </Math>
        </div>

        <p>
          contradicting the minimality of the partition.
          Therefore <Math>{'\\Delta(G[L])\\leq s'}</Math>.
          The same argument gives{' '}
          <Math>{'\\Delta(G[R])\\leq t'}</Math>.
        </p>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h3>Application here</h3>

        {partition === null ? (
          <p>
            Choose integers <Math>{'s,t'}</Math> satisfying the
            Lovász condition. The theorem then partitions the current
            graph into parts <Math>{'L'}</Math> and{' '}
            <Math>{'R'}</Math> with the corresponding internal
            maximum-degree bounds.
          </p>
        ) : (
          <>
            <p>
              Here we use
            </p>

            <div
              style={{
                textAlign: 'center',
                margin: '18px 0',
              }}
            >
              <Math display>
                {`(s,t)=(${partition.s},${partition.t}).`}
              </Math>
            </div>

            <p>
              Hence we obtain a partition{' '}
              <Math>{'V(G)=L\\cup R'}</Math> satisfying
            </p>

            <div
              style={{
                textAlign: 'center',
                margin: '18px 0',
              }}
            >
              <Math display>
                {
                  `\\Delta(G[L])\\leq ${partition.s},`
                  + '\\qquad '
                  + `\\Delta(G[R])\\leq ${partition.t}.`
                }
              </Math>
            </div>
          </>
        )}
      </section>

      <section>
        <h3>Reference</h3>

        <p style={{ marginBottom: 0 }}>
          L. Lovász, <em>On decomposition of graphs</em>,
          Studia Scientiarum Mathematicarum Hungarica{' '}
          <strong>1</strong> (1966), 237–238.
        </p>
      </section>
    </>
  )
}