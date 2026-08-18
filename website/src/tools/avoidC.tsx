import Math from '../components/Math'
import type {
  LovaszPair,
} from './lovaszPartition'

export type AvoidCTarget =
  | 'G'
  | 'L'
  | 'R'

export const avoidCTool = {
  id: 'avoid-c',
  name: 'Avoid c',
} as const

export function getAvoidCChoices(
  degree: number,
  c: number,
) {
  const values: number[] = []

  for (
    let outdegree = 0;
    outdegree <= degree;
    outdegree += 1
  ) {
    if (outdegree !== c) {
      values.push(outdegree)
    }
  }

  return values
}

export function getAvoidCLabel(
  target: AvoidCTarget,
  c: number,
) {
  if (target === 'G') {
    return `Avoid ${c} in G`
  }

  return `Avoid ${c} in ${target}`
}

type AvoidCReferenceProps = {
  target: AvoidCTarget
  c: number
  degree: number
  partition: LovaszPair | null
}

export function AvoidCReference({
  target,
  c,
  degree,
  partition,
}: AvoidCReferenceProps) {
  const isWholeGraph =
    target === 'G'

  const subgraph =
    target === 'G'
      ? 'G'
      : target === 'L'
        ? 'G[L]'
        : 'G[R]'

  const maxInternalDegree =
    target === 'L'
      ? partition?.s
      : target === 'R'
        ? partition?.t
        : null

  return (
    <>
      <section
        style={{
          marginBottom: '32px',
        }}
      >
        <h3 style={{ marginTop: 0 }}>
          Theorem (
          <Math>{'c'}</Math>-avoiding)
        </h3>

        <p>
          Let <Math>{'H'}</Math> be a
          finite graph and let{' '}
          <Math>{'c>1'}</Math> be an
          integer. Then{' '}
          <Math>{'H'}</Math> has an
          orientation <Math>{'D'}</Math>{' '}
          such that, for every{' '}
          <Math>{'v\\in V(H)'}</Math>,
        </p>

        <div
          style={{
            textAlign: 'center',
            margin: '18px 0',
          }}
        >
          <Math display>
            {'d_D^+(v)\\neq c.'}
          </Math>
        </div>
      </section>

      <section
        style={{
          marginBottom: '32px',
        }}
      >
        <h3>Proof</h3>

        <p>
          It is enough to orient each
          connected component separately.
          An isolated vertex has
          outdegree <Math>{'0'}</Math>,
          so suppose that the component
          has at least one edge.
        </p>

        <p>
          Choose a spanning tree{' '}
          <Math>{'T'}</Math> and let{' '}
          <Math>{'r'}</Math> be a leaf
          of <Math>{'T'}</Math>. Root{' '}
          <Math>{'T'}</Math> at{' '}
          <Math>{'r'}</Math>. First
          orient every non-tree edge
          incident with{' '}
          <Math>{'r'}</Math> toward{' '}
          <Math>{'r'}</Math>, and orient
          all other non-tree edges
          arbitrarily.
        </p>

        <p>
          Now process the vertices of{' '}
          <Math>{'T'}</Math> from the
          leaves toward the root. When a
          vertex <Math>{'v\\neq r'}</Math>{' '}
          is processed, every edge
          incident with <Math>{'v'}</Math>{' '}
          has already been oriented except
          the unique tree edge joining{' '}
          <Math>{'v'}</Math> to its
          parent.
        </p>

        <p>
          Suppose that exactly{' '}
          <Math>{'a'}</Math> of the
          already oriented edges leave{' '}
          <Math>{'v'}</Math>. The two
          possible orientations of the
          parent edge give final
          outdegrees
        </p>

        <div
          style={{
            textAlign: 'center',
            margin: '18px 0',
          }}
        >
          <Math display>
            {
              'a\\qquad\\text{or}\\qquad a+1.'
            }
          </Math>
        </div>

        <p>
          At most one of these two
          consecutive integers equals{' '}
          <Math>{'c'}</Math>. Choose the
          orientation of the parent edge
          giving the other value. Once{' '}
          <Math>{'v'}</Math> is
          processed, none of its incident
          edges is changed again.
        </p>

        <p>
          Finally consider the root{' '}
          <Math>{'r'}</Math>. Since{' '}
          <Math>{'r'}</Math> is a leaf
          of the spanning tree, it is
          incident with exactly one tree
          edge, while every non-tree edge
          incident with <Math>{'r'}</Math>{' '}
          was oriented toward it.
          Therefore
        </p>

        <div
          style={{
            textAlign: 'center',
            margin: '18px 0',
          }}
        >
          <Math display>
            {
              'd_D^+(r)\\in\\{0,1\\}.'
            }
          </Math>
        </div>

        <p>
          Since <Math>{'c>1'}</Math>,
          the root also avoids{' '}
          <Math>{'c'}</Math>. Thus every
          vertex avoids{' '}
          <Math>{'c'}</Math>.
        </p>
      </section>

      <section
        style={{
          marginBottom: '32px',
        }}
      >
        <h3>Application here</h3>

        {isWholeGraph ? (
          <>
            <p>
              We apply the theorem
              directly to the current{' '}
              <Math>
                {`${degree}`}
              </Math>
              -regular graph{' '}
              <Math>{'G'}</Math>. Hence
              its edges can be oriented
              so that
            </p>

            <div
              style={{
                textAlign: 'center',
                margin: '18px 0',
              }}
            >
              <Math display>
                {
                  `d_D^+(v)\\neq ${c}`
                  + '\\qquad'
                  + '\\text{for every }v\\in V(G).'
                }
              </Math>
            </div>
          </>
        ) : (
          <>
            <p>
              We apply the theorem to{' '}
              <Math>{subgraph}</Math>. The
              Lovász partition gives
            </p>

            <div
              style={{
                textAlign: 'center',
                margin: '18px 0',
              }}
            >
              <Math display>
                {
                  `\\Delta(${subgraph})`
                  + `\\leq ${maxInternalDegree}.`
                }
              </Math>
            </div>

            <p>
              We may therefore orient the
              edges inside{' '}
              <Math>{subgraph}</Math> so
              that every vertex{' '}
              <Math>
                {`v\\in ${target}`}
              </Math>{' '}
              has internal outdegree
            </p>

            <div
              style={{
                textAlign: 'center',
                margin: '18px 0',
              }}
            >
              <Math display>
                {
                  'd_{'
                  + subgraph
                  + `}^+(v)\\neq ${c}.`
                }
              </Math>
            </div>

            <p>
              This move orients only the
              edges inside{' '}
              <Math>{subgraph}</Math>. It
              does not orient or alter
              any edge between{' '}
              <Math>{'L'}</Math> and{' '}
              <Math>{'R'}</Math>.
            </p>
          </>
        )}
      </section>

      <section>
        <h3>Reference</h3>

        <p>
          This theorem and spanning-tree
          proof are due to S. Akbari,
          M. Dalirrooyfarda, K. Ehsani,
          K. Ozeki, and R. Sherkati,
          <em>
            {' '}
            Orientations of Graphs
            Avoiding Given Lists on
            Out-degrees
          </em>
          , Theorem 3 in the manuscript
          version.
        </p>

        <p>
          <a
            href="https://tgt.ynu.ac.jp/ozeki/2016ADEOS.pdf"
            target="_blank"
            rel="noreferrer"
            style={{
              color: '#475569',
            }}
          >
            Manuscript PDF
          </a>
        </p>

        <p
          style={{
            color: '#64748b',
            fontSize: '16px',
          }}
        >
          The manuscript states the
          theorem for connected graphs.
          The finite-graph formulation
          above follows by applying it
          separately to each connected
          component.
        </p>
      </section>
    </>
  )
}