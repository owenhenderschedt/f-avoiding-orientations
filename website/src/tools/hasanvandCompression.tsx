import Math from '../components/Math'
import type {
  HasanvandApplication,
} from './hasanvandApplication'
import {
  getHasanvandValuesForDegree,
  type HasanvandDegreeRule,
  type HasanvandTarget,
} from './hasanvandMath'

export const hasanvandCompressionTool = {
  id: 'hasanvand-compression',
  name: 'Hasanvand Compression',
  menuLabel: 'Hasanvand',
} as const

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

function getDegreeRangeLatex(
  rule:
    HasanvandDegreeRule,
) {
  if (
    rule.minDegree ===
    rule.maxDegree
  ) {
    return (
      `d_H(v)=${rule.minDegree}`
    )
  }

  return (
    `${rule.minDegree}`
    + '\\leq  d_H(v)'
    + `\\leq${rule.maxDegree}`
  )
}

function getRuleLatex(
  rule:
    HasanvandDegreeRule,
) {
  return (
    '('
    + `p(v),q(v)`
    + ')'
    + '='
    + `(${rule.p},${rule.q})`
  )
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
          '16px 0',

        padding:
          '11px 12px',

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

function RuleCard({
  rule,
}: {
  rule:
    HasanvandDegreeRule
}) {
  return (
    <div
      style={{
        marginBottom:
          '10px',

        padding:
          '11px 13px',

        border:
          '1px solid #e2e8f0',

        borderRadius:
          '8px',

        background:
          '#f8fafc',
      }}
    >
      <Math>
        {
          getDegreeRangeLatex(
            rule,
          )
        }
      </Math>

      {' '}⇒{' '}

      <Math>
        {
          getRuleLatex(
            rule,
          )
        }
      </Math>
    </div>
  )
}

type HasanvandCompressionReferenceProps = {
  target: HasanvandTarget

  application:
    HasanvandApplication | null
}

export function HasanvandCompressionReference({
  target,
  application,
}: HasanvandCompressionReferenceProps) {
  const effectiveTarget =
    application?.target ??
    target

  const targetMath =
    getTargetMath(
      effectiveTarget,
    )

  return (
    <>
      {/* THEOREM */}

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
          Theorem
          (Hasanvand)
        </h3>

        <p>
          Let{' '}
          <Math>{'H'}</Math>{' '}
          be a simple graph,
          and let
        </p>

        <PanelFormula>
          {
            'p,q:V(H)'
            + '\\to\\mathbb Z'
          }
        </PanelFormula>

        <p>
          satisfy, for every
          vertex{' '}
          <Math>{'v'}</Math>,
        </p>

        <PanelFormula>
          {
            'p(v)<q(v),'
            + '\\qquad '
            + 'q(v)'
            + '\\geq'
            + '\\frac12 d_H(v),'
            + '\\qquad '
            + 'p(v)'
            + '\\geq'
            + '\\frac12 q(v)-2.'
          }
        </PanelFormula>

        <p>
          Then the following
          two statements are
          equivalent.
        </p>

        <div
          style={{
            margin:
              '18px 0 18px 18px',
          }}
        >
          <p>
            1.{' '}
            <Math>{'H'}</Math>{' '}
            has an orientation
            satisfying
          </p>

          <PanelFormula>
            {
              'p(v)'
              + '\\leq '
              + 'd_H^+(v)'
              + '\\leq '
              + 'q(v)'
            }
          </PanelFormula>

          <p>
            for every vertex.
          </p>

          <p>
            2.{' '}
            <Math>{'H'}</Math>{' '}
            has an orientation
            satisfying
          </p>

          <PanelFormula>
            {
              'd_H^+(v)'
              + '\\in'
              + '\\{'
              + 'p(v),'
              + 'p(v)+1,'
              + 'q(v)-1,'
              + 'q(v)'
              + '\\}'
            }
          </PanelFormula>

          <p>
            for every vertex.
          </p>
        </div>
      </section>

      {/* HOW WE USE IT */}

      <section
        style={{
          marginBottom:
            '32px',
        }}
      >
        <h3>
          How we use it
        </h3>

        <p>
          Hasanvand is a
          compression theorem.
          We first certify the
          existence of an
          orientation whose
          outdegrees lie in the
          vertex-dependent
          interval
        </p>

        <PanelFormula>
          {
            'p(v)'
            + '\\leq '
            + 'd_H^+(v)'
            + '\\leq '
            + 'q(v).'
          }
        </PanelFormula>

        <p>
          Hasanvand then says
          that another
          orientation exists
          in which each vertex
          uses only the four
          boundary levels
        </p>

        <PanelFormula>
          {
            '\\{'
            + 'p(v),'
            + 'p(v)+1,'
            + 'q(v)-1,'
            + 'q(v)'
            + '\\}.'
          }
        </PanelFormula>

        <p>
          Thus the tool does
          not modify a
          previously chosen
          orientation. The
          interval orientation
          acts as a certificate
          for the existence of
          a new compressed
          orientation.
        </p>
      </section>

      {/* BALANCED CERTIFICATE */}

      <section
        style={{
          marginBottom:
            '32px',
        }}
      >
        <h3>
          Balanced
          certificate
        </h3>

        <p>
          Every graph has a
          balanced orientation.
          At a vertex of degree{' '}
          <Math>{'r'}</Math>,
          such an orientation
          has
        </p>

        <PanelFormula>
          {
            'd_H^+(v)'
            + '\\in'
            + '\\left\\{'
            + '\\left\\lfloor'
            + '\\frac r2'
            + '\\right\\rfloor,'
            + '\\left\\lceil'
            + '\\frac r2'
            + '\\right\\rceil'
            + '\\right\\}.'
          }
        </PanelFormula>

        <p>
          Therefore the
          balanced orientation
          certifies the
          required interval
          orientation whenever
        </p>

        <PanelFormula>
          {
            'p(v)'
            + '\\leq'
            + '\\left\\lfloor'
            + '\\frac{d_H(v)}2'
            + '\\right\\rfloor'
            + '\\qquad\\text{and}\\qquad '
            + 'q(v)'
            + '\\geq'
            + '\\left\\lceil'
            + '\\frac{d_H(v)}2'
            + '\\right\\rceil.'
          }
        </PanelFormula>

        <p>
          The playground checks
          these inequalities
          separately for every
          degree that may occur
          in the target graph.
          It also checks
          Hasanvand&apos;s own
          hypotheses at every
          such degree.
        </p>
      </section>

      {/* TARGET */}

      <section
        style={{
          marginBottom:
            application ===
            null
              ? '32px'
              : '28px',
        }}
      >
        <h3>
          Target
        </h3>

        <p>
          The current target
          is
        </p>

        <PanelFormula>
          {targetMath}
        </PanelFormula>

        {application ===
          null && (
          <p>
            Choose either a
            uniform pair{' '}
            <Math>{'(p,q)'}</Math>{' '}
            or a collection of
            degree ranges with
            different pairs.
            The application can
            be used only after
            every possible
            degree has been
            certified.
          </p>
        )}
      </section>

      {/* CURRENT APPLICATION */}

      {application !==
        null && (
        <>
          <div
            style={{
              margin:
                '28px 0 0',

              borderTop:
                '1px solid #cbd5e1',

              paddingTop:
                '24px',
            }}
          />

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
              Current
              application
            </h3>

            <p>
              Mode:{' '}
              <strong>
                {application.mode ===
                'uniform'
                  ? 'uniform'
                  : 'by degree'}
              </strong>
              .
            </p>

            <p>
              The possible
              degrees in{' '}
              <Math>
                {targetMath}
              </Math>{' '}
              are
            </p>

            <PanelFormula>
              {
                latexSet(
                  application
                    .possibleDegrees,
                )
              }
            </PanelFormula>

            <h4
              style={{
                marginTop:
                  '20px',

                marginBottom:
                  '9px',
              }}
            >
              Degree rules
            </h4>

            {application
              .rules
              .map(
                (
                  rule,
                  index,
                ) => (
                  <RuleCard
                    key={
                      [
                        rule.minDegree,
                        rule.maxDegree,
                        rule.p,
                        rule.q,
                        index,
                      ].join('-')
                    }
                    rule={
                      rule
                    }
                  />
                ),
              )}
          </section>

          {/* DEGREE-BY-DEGREE CERTIFICATE */}

          <section
            style={{
              marginBottom:
                '32px',
            }}
          >
            <h3>
              Certification
            </h3>

            <p>
              For each possible
              degree{' '}
              <Math>{'r'}</Math>,
              the playground
              checks both
              Hasanvand&apos;s
              hypotheses and
              the balanced
              interval
              certificate.
            </p>

            {application
              .certificate
              .checks
              .map(
                (check) => {
                  const rule =
                    check.rule

                  if (
                    rule ===
                    null
                  ) {
                    return null
                  }

                  const values =
                    getHasanvandValuesForDegree(
                      check.degree,
                      rule.p,
                      rule.q,
                    )

                  return (
                    <div
                      key={
                        check.degree
                      }
                      style={{
                        marginBottom:
                          '12px',

                        padding:
                          '12px 14px',

                        border:
                          '1px solid #e2e8f0',

                        borderRadius:
                          '8px',

                        background:
                          '#f8fafc',
                      }}
                    >
                      <div
                        style={{
                          marginBottom:
                            '8px',

                          fontWeight:
                            600,
                        }}
                      >
                        Degree{' '}
                        <Math>
                          {
                            `r=${check.degree}`
                          }
                        </Math>
                      </div>

                      <div
                        style={{
                          marginBottom:
                            '6px',
                        }}
                      >
                        Rule:{' '}
                        <Math>
                          {
                            `(p,q)=(${rule.p},${rule.q})`
                          }
                        </Math>
                      </div>

                      <div
                        style={{
                          marginBottom:
                            '6px',
                        }}
                      >
                        Hasanvand
                        conditions:{' '}
                        <span
                          style={{
                            color:
                              check
                                .theoremConditionsHold
                                ? '#166534'
                                : '#b91c1c',
                          }}
                        >
                          {check
                            .theoremConditionsHold
                            ? '✓ certified'
                            : '✗ failed'}
                        </span>
                      </div>

                      <div
                        style={{
                          marginBottom:
                            '6px',
                        }}
                      >
                        Balanced
                        interval
                        certificate:{' '}
                        <span
                          style={{
                            color:
                              check
                                .balancedCertificateHolds
                                ? '#166534'
                                : '#b91c1c',
                          }}
                        >
                          {check
                            .balancedCertificateHolds
                            ? '✓ certified'
                            : '✗ failed'}
                        </span>
                      </div>

                      <div>
                        Resulting
                        internal
                        outdegrees:{' '}

                        <Math>
                          {
                            latexSet(
                              values,
                            )
                          }
                        </Math>
                      </div>
                    </div>
                  )
                },
              )}

            <div
              style={{
                marginTop:
                  '16px',

                padding:
                  '12px 14px',

                border:
                  '1px solid #bbf7d0',

                borderRadius:
                  '9px',

                background:
                  '#f0fdf4',

                color:
                  '#166534',
              }}
            >
              <strong>
                Certified.
              </strong>{' '}
              Every possible
              degree is covered
              by exactly one
              rule, Hasanvand&apos;s
              hypotheses hold,
              and the balanced
              orientation
              certifies the
              required interval
              orientation.
            </div>
          </section>
        </>
      )}

      {/* REFERENCE */}

      <section>
        <h3>
          Reference
        </h3>

        <p
          style={{
            marginBottom: 0,
          }}
        >
          M. Hasanvand,{' '}
          <em>
            A necessary and
            sufficient condition
            for the existence of{' '}
            {'{'}p,p+1,q-1,q{'}'}
            -orientations in
            simple graphs
          </em>
          , arXiv:2205.10883
          (2022).
        </p>
      </section>
    </>
  )
}