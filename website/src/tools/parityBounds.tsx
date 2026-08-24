import MathText from '../components/Math'
import type {
  ParityBoundsApplication,
} from './parityBoundsApplication'

type ParityBoundsReferenceProps = {
  application?:
    ParityBoundsApplication | null
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

export function ParityBoundsReference({
  application =
    null,
}: ParityBoundsReferenceProps) {
  return (
    <>
      <section>
        <h3>
          Parity Bounds
        </h3>

        <p>
          This tool combines a prescribed
          outdegree parity with lower and
          upper outdegree bounds.
        </p>

        <p>
          Its underlying orientation theorem
          is the bounded parity-orientation
          criterion of Frank, Tardos, and
          Sebő. The playground uses a
          regular-graph corollary tailored
          to the orientation constructions
          here.
        </p>
      </section>

      <section>
        <h3>
          Automatic regular-graph form
        </h3>

        <p>
          Let{' '}

          <MathText>
            {'H'}
          </MathText>{' '}

          be a simple even{' '}

          <MathText>
            {'d'}
          </MathText>
          -regular graph with{' '}

          <MathText>
            {'d\\geq4'}
          </MathText>
          .
        </p>

        <p>
          Ordinary vertices are assigned
          an interval
        </p>

        <div
          style={{
            textAlign:
              'center',

            margin:
              '14px 0',
          }}
        >
          <MathText>
            {
              '\\ell\\leq d_H^+(v)\\leq u'
            }
          </MathText>
        </div>

        <p>
          with{' '}

          <MathText>
            {
              '\\ell\\equiv u\\pmod 2'
            }
          </MathText>
          . Thus their possible outdegrees
          are
        </p>

        <div
          style={{
            textAlign:
              'center',

            margin:
              '14px 0',
          }}
        >
          <MathText>
            {
              '\\{\\ell,\\ell+2,\\ldots,u\\}.'
            }
          </MathText>
        </div>

        <p>
          In every odd-order component, one
          exceptional vertex{' '}

          <MathText>
            {'r'}
          </MathText>{' '}

          is permitted to use a second
          parity interval
        </p>

        <div
          style={{
            textAlign:
              'center',

            margin:
              '14px 0',
          }}
        >
          <MathText>
            {
              '\\ell_*\\leq d_H^+(r)\\leq u_*.'
            }
          </MathText>
        </div>

        <p>
          The exceptional parity is chosen
          so that the global parity identity
        </p>

        <div
          style={{
            textAlign:
              'center',

            margin:
              '14px 0',
          }}
        >
          <MathText>
            {
              '\\sum_{v\\in V(H)}d_H^+(v)=|E(H)|'
            }
          </MathText>
        </div>

        <p>
          is satisfied in both even- and
          odd-order components.
        </p>
      </section>

      <section>
        <h3>
          Certificate
        </h3>

        <p>
          Put
        </p>

        <div
          style={{
            textAlign:
              'center',

            margin:
              '14px 0',
          }}
        >
          <MathText>
            {
              '\\alpha=u-\\frac d2,\\qquad'
              +
              '\\beta=\\frac d2-\\ell.'
            }
          </MathText>
        </div>

        <p>
          The automatic version requires
        </p>

        <div
          style={{
            textAlign:
              'center',

            margin:
              '14px 0',
          }}
        >
          <MathText>
            {
              '\\ell\\leq\\frac d2\\leq u,'
              +
              '\\qquad'
              +
              '\\alpha,\\beta\\geq0.'
            }
          </MathText>
        </div>

        <p>
          For a set of size{' '}

          <MathText>
            {'s'}
          </MathText>
          , define
        </p>

        <div
          style={{
            textAlign:
              'center',

            margin:
              '14px 0',
          }}
        >
          <MathText>
            {
              '\\sigma_d(s)'
              +
              '='
              +
              '\\left\\lceil'
              +
              '\\frac{\\max\\{0,d-s+1\\}}{4}'
              +
              '\\right\\rceil.'
            }
          </MathText>
        </div>

        <p>
          This is the extra cut capacity
          obtained by choosing the
          exceptional vertex so that it is
          incident with no 2-edge-cut.
        </p>

        <p>
          The playground checks the two
          numerical inequalities arising
          from the bounded parity criterion,
          according to whether the
          exceptional vertex lies on the
          lower-bound or upper-bound side
          of the cut.
        </p>

        <p>
          Since{' '}

          <MathText>
            {'\\alpha,\\beta\\geq0'}
          </MathText>{' '}

          and{' '}

          <MathText>
            {
              '\\sigma_d(s)=0'
            }
          </MathText>{' '}

          once{' '}

          <MathText>
            {'s>d+1'}
          </MathText>
          , only finitely many numerical
          checks are required.
        </p>
      </section>

      {application !==
        null && (
        <section>
          <h3>
            Current application
          </h3>

          <p>
            The working graph is{' '}

            <MathText>
              {
                `${application.workingDegree}`
              }
            </MathText>
            -regular.
          </p>

          {application
            .fixedOutdegreeContribution >
            0 && (
            <p>
              Previously oriented
              2-factors contribute{' '}

              <MathText>
                {
                  `${application.fixedOutdegreeContribution}`
                }
              </MathText>{' '}

              fixed outgoing edge
              {application
                .fixedOutdegreeContribution ===
              1
                ? ''
                : 's'}{' '}
              at every vertex.
            </p>
          )}

          <p>
            Ordinary vertices use
          </p>

          <div
            style={{
              textAlign:
                'center',

              margin:
                '14px 0',
            }}
          >
            <MathText>
              {
                `${application.normalInterval.lower}`
                +
                '\\leq d^+(v)\\leq'
                +
                `${application.normalInterval.upper}`
              }
            </MathText>
          </div>

          <p>
            and the exceptional vertex uses
          </p>

          <div
            style={{
              textAlign:
                'center',

              margin:
                '14px 0',
            }}
          >
            <MathText>
              {
                `${application.exceptionalInterval.lower}`
                +
                '\\leq d^+(r)\\leq'
                +
                `${application.exceptionalInterval.upper}.`
              }
            </MathText>
          </div>

          <p>
            Therefore the possible total
            outdegrees are
          </p>

          <div
            style={{
              textAlign:
                'center',

              margin:
                '14px 0',
            }}
          >
            <MathText>
              {
                `d^+(v)\\in${latexSet(
                  application
                    .totalOutdegrees,
                )}.`
              }
            </MathText>
          </div>

          <p>
            The minimum certified cut margins
            are
          </p>

          <div
            style={{
              textAlign:
                'center',

              margin:
                '14px 0',
            }}
          >
            <MathText>
              {
                `m_A=${application.certificate.minimumExceptionalInAMargin},`
                +
                '\\qquad '
                +
                `m_B=${application.certificate.minimumExceptionalInBMargin}.`
              }
            </MathText>
          </div>
        </section>
      )}

      <section>
        <h3>
          Application to
          {' '}
          <MathText>
            {
              'F=\\{1,3,4,6,8\\}'
            }
          </MathText>
        </h3>

        <p>
          In a 12-regular graph, choose
        </p>

        <div
          style={{
            textAlign:
              'center',

            margin:
              '14px 0',
          }}
        >
          <MathText>
            {
              '[\\ell,u]=[5,11],'
              +
              '\\qquad '
              +
              '[\\ell_*,u_*]=[10,12].'
            }
          </MathText>
        </div>

        <p>
          The resulting possible outdegrees
          are
        </p>

        <div
          style={{
            textAlign:
              'center',

            margin:
              '14px 0',
          }}
        >
          <MathText>
            {
              '\\{5,7,9,10,11,12\\},'
            }
          </MathText>
        </div>

        <p>
          none of which belongs to
          {' '}

          <MathText>
            {
              '\\{1,3,4,6,8\\}.'
            }
          </MathText>
        </p>
      </section>

      <section>
        <h3>
          Reference
        </h3>

        <p>
          Morteza Hasanvand,
          <em>
            {' '}
            Modulo orientations with bounded
            out-degrees
          </em>
          , Discrete Mathematics 347
          (2024), no. 1, Article 113634.
        </p>

        <p>
          Section 2 treats orientations
          modulo 2 using a theorem that is a
          special case of the bounded parity
          result of Frank, Tardos, and Sebő.
        </p>

        <p>
          <a
            href="https://arxiv.org/abs/1702.07039"
            target="_blank"
            rel="noreferrer"
            style={{
              color:
                '#475569',
            }}
          >
            arXiv paper
          </a>
        </p>

        <p
          style={{
            color:
              '#64748b',

            fontSize:
              '16px',
          }}
        >
          The automatic playground tool uses
          the regular-graph corollary proved
          for this project rather than
          claiming that every arbitrary
          bounded-parity instance satisfies
          the general theorem automatically.
        </p>
      </section>
    </>
  )
}

export default
  ParityBoundsReference