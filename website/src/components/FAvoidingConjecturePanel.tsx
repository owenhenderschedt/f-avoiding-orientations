import Math from './Math'
import ToolReferencePanel from './ToolReferencePanel'

type FAvoidingConjecturePanelProps = {
  open: boolean
  onClose: () => void
}

export default function FAvoidingConjecturePanel({
  open,
  onClose,
}: FAvoidingConjecturePanelProps) {
  return (
    <ToolReferencePanel
      open={open}
      title="F-avoiding conjecture"
      onClose={onClose}
    >
      <div
        style={{
          fontSize: '17px',
          lineHeight: 1.65,
          color: '#334155',
        }}
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: '18px',
            color: '#0f172a',
            marginBottom: '10px',
          }}
        >
          Definition
        </div>

        <p style={{ marginTop: 0 }}>
          Let <Math>{'G'}</Math> be a graph and let
          {' '}
          <Math>
            {'F:V(G)\\to 2^{\\mathbb N}'}
          </Math>
          {' '}
          assign a set of forbidden outdegrees to each
          vertex. An orientation
          {' '}
          <Math>{'D'}</Math>
          {' '}
          of
          {' '}
          <Math>{'G'}</Math>
          {' '}
          is <Math>{'F'}</Math>-avoiding if
        </p>

        <div
          style={{
            margin: '20px 0',
            textAlign: 'center',
            fontSize: '21px',
          }}
        >
          <Math>
            {'d_D^+(v)\\notin F(v)\\qquad\\text{for every }v\\in V(G).'}
          </Math>
        </div>

        <div
          style={{
            marginTop: '30px',
            paddingTop: '24px',
            borderTop: '1px solid #e2e8f0',
            fontWeight: 700,
            fontSize: '18px',
            color: '#0f172a',
            marginBottom: '10px',
          }}
        >
          The conjecture
        </div>

        <p>
          Akbari, Dalirrooyfard, Ehsani, Ozeki, and
          Sherkati conjectured that every graph
          {' '}
          <Math>{'G'}</Math>
          {' '}
          is <Math>{'F'}</Math>-avoiding whenever
        </p>

        <div
          style={{
            margin: '20px 0',
            textAlign: 'center',
            fontSize: '21px',
          }}
        >
          <Math>
            {
              '|F(v)|\\leq \\frac{d_G(v)-1}{2}\\qquad\\text{for every }v\\in V(G).'
            }
          </Math>
        </div>

        <div
          style={{
            marginTop: '30px',
            paddingTop: '24px',
            borderTop: '1px solid #e2e8f0',
            fontWeight: 700,
            fontSize: '18px',
            color: '#0f172a',
            marginBottom: '10px',
          }}
        >
          Regular constant-list case
        </div>

        <p>
          This website focuses on the specialization in
          which <Math>{'G'}</Math> is
          {' '}
          <Math>{'d'}</Math>-regular and the same
          forbidden set
          {' '}
          <Math>{'F\\subseteq\\{0,1,\\ldots,d\\}'}</Math>
          {' '}
          is assigned to every vertex.
        </p>

        <p>
          In this setting, the conjecture says that if
        </p>

        <div
          style={{
            margin: '20px 0',
            textAlign: 'center',
            fontSize: '21px',
          }}
        >
          <Math>{'|F|<\\frac d2,'}</Math>
        </div>

        <p>
          then there exists an orientation
          {' '}
          <Math>{'D'}</Math>
          {' '}
          of <Math>{'G'}</Math> such that
        </p>

        <div
          style={{
            margin: '20px 0',
            textAlign: 'center',
            fontSize: '21px',
          }}
        >
          <Math>
            {'d_D^+(v)\\notin F\\qquad\\text{for every }v\\in V(G).'}
          </Math>
        </div>

        <div
          style={{
            marginTop: '30px',
            paddingTop: '24px',
            borderTop: '1px solid #e2e8f0',
          }}
        >
          <div
            style={{
              fontWeight: 700,
              fontSize: '18px',
              color: '#0f172a',
              marginBottom: '10px',
            }}
          >
            Reference
          </div>

          <p style={{ margin: 0 }}>
            S. Akbari, M. Dalirrooyfard, K. Ehsani,
            K. Ozeki, and R. Sherkati,
            {' '}
            <a
              href="https://onlinelibrary.wiley.com/doi/10.1002/jgt.22498"
              target="_blank"
              rel="noreferrer"
              style={{
                color: '#2563eb',
                textDecoration: 'underline',
                textUnderlineOffset: '3px',
              }}
            >
              Orientations of graphs avoiding given lists
              on out-degrees
            </a>
            , <em>Journal of Graph Theory</em>{' '}
            <strong>93</strong> (2020), 483–502.
          </p>
        </div>
      </div>
    </ToolReferencePanel>
  )
}
