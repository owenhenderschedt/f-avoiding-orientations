import Math from '../components/Math'
import BalancedBadge from '../components/BalancedBadge'
import AvoidCBadge from '../components/AvoidCBadge'
import PossibleOutdegrees from './PossibleOutdegrees'
import type {
  BalancedTarget,
} from '../tools/balancedOrientation'
import type {
  AvoidCTarget,
} from '../tools/avoidC'
import type {
  HasanvandParameters,
} from '../tools/hasanvandCompression'
import type {
  OutdegreeSet,
} from './outdegreePossibilities'

type InitialGraphViewProps = {
  degree: number
  workingDegree: number
  fixedOutdegreeContribution: number
  orientedTwoFactorCount: number

  forbiddenSet: readonly number[]
  possibleOutdegrees: OutdegreeSet

  balancedG: boolean
  avoidCG: number | null

  hasanvandG:
    HasanvandParameters | null

  onOpenBalancedReference: (
    target: BalancedTarget,
  ) => void

  onOpenAvoidCReference: (
    target: AvoidCTarget,
    c: number,
  ) => void

  onOpenTwoFactorReference: () => void

  onOpenHasanvandReference: () => void
}

function HasanvandBadge({
  parameters,
  onOpen,
}: {
  parameters: HasanvandParameters
  onOpen: () => void
}) {
  return (
    <foreignObject
      x="175"
      y="320"
      width="250"
      height="70"
    >
      <div
        style={{
          width: '100%',
          textAlign: 'center',
        }}
      >
        <button
          type="button"
          onClick={onOpen}
          style={{
            font: 'inherit',
            fontSize: '20px',
            color: '#475569',
            background: 'transparent',
            border: 'none',
            borderBottom:
              '1px solid #64748b',
            padding: '0 2px 2px',
            cursor: 'pointer',
          }}
        >
          Hasanvand{' '}
          <Math>
            {`(${parameters.p},${parameters.q})`}
          </Math>
        </button>
      </div>
    </foreignObject>
  )
}

function TwoFactorNote({
  count,
  onOpen,
}: {
  count: number
  onOpen: () => void
}) {
  return (
    <div
      style={{
        margin: '4px auto 20px',
        textAlign: 'center',
        color: '#64748b',
        fontSize: '20px',
      }}
    >
      {count === 1 ? (
        <>
          removed:{' '}
          <button
            type="button"
            onClick={onOpen}
            style={{
              font: 'inherit',
              color: '#475569',
              background: 'transparent',
              border: 'none',
              borderBottom:
                '1px solid #64748b',
              padding: '0 1px 2px',
              cursor: 'pointer',
            }}
          >
            oriented 2-factor{' '}
            <Math>{'C'}</Math>
          </button>
        </>
      ) : (
        <>
          removed:{' '}
          <button
            type="button"
            onClick={onOpen}
            style={{
              font: 'inherit',
              color: '#475569',
              background: 'transparent',
              border: 'none',
              borderBottom:
                '1px solid #64748b',
              padding: '0 1px 2px',
              cursor: 'pointer',
            }}
          >
            <Math>{`${count}`}</Math>{' '}
            oriented 2-factors
          </button>
        </>
      )}
    </div>
  )
}

export default function InitialGraphView({
  degree,
  workingDegree,
  fixedOutdegreeContribution,
  orientedTwoFactorCount,
  forbiddenSet,
  possibleOutdegrees,
  balancedG,
  avoidCG,
  hasanvandG,
  onOpenBalancedReference,
  onOpenAvoidCReference,
  onOpenTwoFactorReference,
  onOpenHasanvandReference,
}: InitialGraphViewProps) {
  const hasResidualGraph =
    orientedTwoFactorCount > 0

  return (
    <>
      <div
        style={{
          fontSize: '1.15rem',
          marginBottom: '16px',
        }}
      >
        {hasResidualGraph ? (
          <>
            a{' '}
            <Math>
              {`${workingDegree}`}
            </Math>
            -regular residual graph
          </>
        ) : (
          <>
            a{' '}
            <Math>
              {`${degree}`}
            </Math>
            -regular graph{' '}
            <Math>{'G'}</Math>
          </>
        )}
      </div>

      {hasResidualGraph && (
        <TwoFactorNote
          count={
            orientedTwoFactorCount
          }
          onOpen={
            onOpenTwoFactorReference
          }
        />
      )}

      <svg
        viewBox="0 0 600 600"
        width="100%"
        role="img"
        aria-label={
          hasResidualGraph
            ? `The ${workingDegree}-regular residual graph after removing oriented 2-factors`
            : `A ${degree}-regular graph G represented symbolically as a circle`
        }
        style={{
          display: 'block',
          maxWidth: '420px',
          margin: '0 auto',
        }}
      >
        <defs>
          <filter
            id="soft-shadow-circle"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feDropShadow
              dx="0"
              dy="8"
              stdDeviation="12"
              floodColor="#000000"
              floodOpacity="0.10"
            />
          </filter>
        </defs>

        <circle
          cx="300"
          cy="300"
          r="200"
          fill="#f8fafc"
          stroke="#64748b"
          strokeWidth="3"
          filter="url(#soft-shadow-circle)"
        />

        <foreignObject
          x="150"
          y="245"
          width="300"
          height="110"
        >
          <div
            style={{
              width: '100%',
              textAlign: 'center',
              fontSize: '44px',
              color: '#334155',
            }}
          >
            {hasResidualGraph ? (
              <Math>{'G-C'}</Math>
            ) : (
              <Math>{'G'}</Math>
            )}
          </div>
        </foreignObject>

        {balancedG && (
          <BalancedBadge
            target="G"
            x={235}
            y={320}
            onOpen={
              onOpenBalancedReference
            }
          />
        )}

        {avoidCG !== null && (
          <AvoidCBadge
            target="G"
            c={avoidCG}
            x={225}
            y={320}
            onOpen={
              onOpenAvoidCReference
            }
          />
        )}

        {hasanvandG !== null && (
          <HasanvandBadge
            parameters={
              hasanvandG
            }
            onOpen={
              onOpenHasanvandReference
            }
          />
        )}
      </svg>

      {hasResidualGraph && (
        <div
          style={{
            maxWidth: '620px',
            margin:
              '-4px auto 18px',
            color: '#64748b',
            fontSize: '19px',
          }}
        >
          fixed contribution:{' '}
          <Math>
            {`+${fixedOutdegreeContribution}`}
          </Math>{' '}
          to every outdegree
        </div>
      )}

      <div
        style={{
          maxWidth: '620px',
          margin: '8px auto 0',
        }}
      >
        <PossibleOutdegrees
          values={
            possibleOutdegrees
          }
          forbiddenSet={
            forbiddenSet
          }
        />
      </div>
    </>
  )
}