import Math from '../components/Math'

export type HasanvandTarget =
  | 'G'
  | 'L'
  | 'R'

export type HasanvandParameters = {
  p: number
  q: number
}

export const hasanvandCompressionTool = {
  id: 'hasanvand-compression',
  name: 'Hasanvand Compression',
  menuLabel: 'Hasanvand compression',
} as const

export function getHasanvandValues(
  p: number,
  q: number,
) {
  return Array.from(
    new Set([
      p,
      p + 1,
      q - 1,
      q,
    ]),
  ).sort((a, b) => a - b)
}

/*
 * For an r-regular graph, a balanced orientation gives
 *
 *   floor(r/2) <= d^+(v) <= ceil(r/2).
 *
 * Hence it certifies the existence of a (p,q)-orientation
 * whenever
 *
 *   p <= floor(r/2)
 *   and
 *   q >= ceil(r/2).
 *
 * We then impose Hasanvand's additional hypotheses
 *
 *   q >= r/2
 *   and
 *   p >= q/2 - 2.
 *
 * The first is automatic from q >= ceil(r/2), but we keep
 * the logic conceptually explicit here.
 */
export function getHasanvandParameterPairs(
  degree: number,
): HasanvandParameters[] {
  const pairs: HasanvandParameters[] = []

  const balancedLow =
    globalThis.Math.floor(degree / 2)

  const balancedHigh =
    globalThis.Math.ceil(degree / 2)

  for (
    let q = 0;
    q <= degree;
    q += 1
  ) {
    for (
      let p = 0;
      p < q;
      p += 1
    ) {
      const balancedIntervalFits =
        p <= balancedLow &&
        q >= balancedHigh

      const qCondition =
        2 * q >= degree

      const pCondition =
        2 * p >= q - 4

      if (
        balancedIntervalFits &&
        qCondition &&
        pCondition
      ) {
        pairs.push({
          p,
          q,
        })
      }
    }
  }

  return pairs
}

type HasanvandCompressionReferenceProps = {
  target: HasanvandTarget
  parameters: HasanvandParameters
}

function getTargetMath(
  target: HasanvandTarget,
) {
  if (target === 'L') {
    return 'G[L]'
  }

  if (target === 'R') {
    return 'G[R]'
  }

  return 'G'
}

export function HasanvandCompressionReference({
  target,
  parameters,
}: HasanvandCompressionReferenceProps) {
  const targetMath =
    getTargetMath(target)

  const values =
    getHasanvandValues(
      parameters.p,
      parameters.q,
    )

  return (
    <>
      <section
        style={{
          marginBottom: '32px',
        }}
      >
        <h3
          style={{
            marginTop: 0,
          }}
        >
          Theorem (Hasanvand)
        </h3>

        <p>
          Let <Math>{'H'}</Math> be a simple graph, and let{' '}
          <Math>
            {'p,q:V(H)\\to\\mathbb Z'}
          </Math>{' '}
          satisfy{' '}
          <Math>{'p(v)<q(v)'}</Math>{' '}
          for every vertex. Suppose also that
        </p>

        <div
          style={{
            textAlign: 'center',
            margin: '18px 0',
          }}
        >
          <Math display>
            {
              'q(v)\\geq \\frac{1}{2}d_H(v)'
              + '\\qquad\\text{and}\\qquad '
              + 'p(v)\\geq \\frac{1}{2}q(v)-2'
            }
          </Math>
        </div>

        <p>
          for every{' '}
          <Math>{'v\\in V(H)'}</Math>.
          Then the following are equivalent.
        </p>

        <div
          style={{
            margin:
              '18px 0 18px 18px',
          }}
        >
          <p>
            1. <Math>{'H'}</Math> has an
            orientation satisfying
          </p>

          <div
            style={{
              textAlign: 'center',
              margin: '14px 0',
            }}
          >
            <Math display>
              {
                'p(v)\\leq d_H^+(v)\\leq q(v)'
              }
            </Math>
          </div>

          <p>
            for every vertex.
          </p>

          <p>
            2. <Math>{'H'}</Math> has an
            orientation satisfying
          </p>

          <div
            style={{
              textAlign: 'center',
              margin: '14px 0',
            }}
          >
            <Math display>
              {
                'd_H^+(v)'
                + '\\in '
                + '\\{'
                + 'p(v),'
                + 'p(v)+1,'
                + 'q(v)-1,'
                + 'q(v)'
                + '\\}'
              }
            </Math>
          </div>

          <p>
            for every vertex.
          </p>
        </div>
      </section>

      <section
        style={{
          marginBottom: '32px',
        }}
      >
        <h3>How we use it</h3>

        <p>
          The theorem is a compression
          principle. We first certify the
          existence of an orientation whose
          outdegrees lie in the interval
        </p>

        <div
          style={{
            textAlign: 'center',
            margin: '18px 0',
          }}
        >
          <Math display>
            {
              'p(v)\\leq d_H^+(v)\\leq q(v).'
            }
          </Math>
        </div>

        <p>
          Hasanvand then replaces that entire
          interval by only four possible
          levels:
        </p>

        <div
          style={{
            textAlign: 'center',
            margin: '18px 0',
          }}
        >
          <Math display>
            {
              '\\{'
              + 'p(v),'
              + 'p(v)+1,'
              + 'q(v)-1,'
              + 'q(v)'
              + '\\}.'
            }
          </Math>
        </div>

        <p>
          Thus we do not think of Hasanvand
          as modifying one particular
          previously chosen orientation.
          Instead, an interval orientation
          serves as a certificate that a new
          four-level orientation exists.
        </p>
      </section>

      <section
        style={{
          marginBottom: '32px',
        }}
      >
        <h3>Balanced certificate</h3>

        <p>
          When <Math>{'H'}</Math> is
          regular, a balanced orientation
          gives
        </p>

        <div
          style={{
            textAlign: 'center',
            margin: '18px 0',
          }}
        >
          <Math display>
            {
              'd_H^+(v)'
              + '\\in '
              + '\\left\\{'
              + '\\left\\lfloor'
              + '\\frac{d_H(v)}{2}'
              + '\\right\\rfloor,'
              + '\\left\\lceil'
              + '\\frac{d_H(v)}{2}'
              + '\\right\\rceil'
              + '\\right\\}.'
            }
          </Math>
        </div>

        <p>
          Therefore, if these balanced
          outdegrees lie inside{' '}
          <Math>{'[p,q]'}</Math>, the
          interval-orientation hypothesis is
          automatically satisfied.
        </p>

        <p>
          The playground uses this fact to
          determine which constant pairs{' '}
          <Math>{'(p,q)'}</Math> are
          available on the current regular
          graph.
        </p>
      </section>

      <section
        style={{
          marginBottom: '32px',
        }}
      >
        <h3>Application here</h3>

        <p>
          We apply the theorem to{' '}
          <Math>{targetMath}</Math> with
          constant parameters
        </p>

        <div
          style={{
            textAlign: 'center',
            margin: '18px 0',
          }}
        >
          <Math display>
            {
              `p=${parameters.p},`
              + '\\qquad '
              + `q=${parameters.q}.`
            }
          </Math>
        </div>

        <p>
          Once the interval-orientation
          hypothesis and Hasanvand&apos;s
          inequalities are certified, the
          resulting orientation has possible
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
              '\\{'
              + values.join(',')
              + '\\}.'
            }
          </Math>
        </div>
      </section>

      <section>
        <h3>Reference</h3>

        <p
          style={{
            marginBottom: 0,
          }}
        >
          M. Hasanvand,{' '}
          <em>
            A necessary and sufficient
            condition for the existence of{' '}
            {'{'}p,p+1,q-1,q{'}'}
            -orientations in simple graphs
          </em>
          , arXiv:2205.10883 (2022).
        </p>
      </section>
    </>
  )
}