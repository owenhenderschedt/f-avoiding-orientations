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
        <p
          style={{
            marginTop: 0,
          }}
        >
          Let <Math>{'G'}</Math> be a{' '}
          <Math>{'d'}</Math>-regular graph,
          and let
          {' '}
          <Math>
            {
              'F\\subseteq\\{0,1,\\ldots,d\\}'
            }
          </Math>
          {' '}
          satisfy
        </p>

        <div
          style={{
            margin:
              '22px 0',
            textAlign:
              'center',
            fontSize:
              '21px',
          }}
        >
          <Math>
            {
              '|F|<\\frac d2.'
            }
          </Math>
        </div>

        <p>
          Then there exists an orientation
          {' '}
          <Math>{'D'}</Math>
          {' '}
          of
          {' '}
          <Math>{'G'}</Math>
          {' '}
          such that
        </p>

        <div
          style={{
            margin:
              '22px 0',
            textAlign:
              'center',
            fontSize:
              '21px',
          }}
        >
          <Math>
            {
              'd_D^+(v)\\notin F'
            }
          </Math>
        </div>

        <p>
          for every
          {' '}
          <Math>{'v\\in V(G)'}</Math>.
        </p>

        <div
          style={{
            marginTop:
              '26px',
            paddingTop:
              '22px',
            borderTop:
              '1px solid #e2e8f0',
            color:
              '#64748b',
          }}
        >
          The same forbidden set
          {' '}
          <Math>{'F'}</Math>
          {' '}
          is used at every vertex. Thus the
          conjecture asks whether fewer than
          half of the possible outdegrees can
          always be avoided simultaneously
          throughout a regular graph.
        </div>
      </div>
    </ToolReferencePanel>
  )
}
