import Math from '../components/Math'
import PartitionGraphView from './PartitionGraphView'
import PossibleOutdegrees from './PossibleOutdegrees'
import {
  allOutdegrees,
} from './outdegreePossibilities'
import type {
  LovaszPair,
} from '../tools/lovaszPartition'
import type {
  BalancedTarget,
} from '../tools/balancedOrientation'
import type {
  HasanvandParameters,
} from '../tools/hasanvandCompression'
import type {
  AcrossDirection,
  AcrossOutdegreeGuarantees,
} from '../tools/orientAcrossPartition'

type GraphViewProps = {
  degree: number
  workingDegree: number
  fixedOutdegreeContribution: number
  orientedTwoFactorCount: number

  forbiddenSet: readonly number[]
  partition: LovaszPair | null
  acrossDirection: AcrossDirection | null

  balancedG: boolean
  balancedL: boolean
  balancedR: boolean

  hasanvandG:
    HasanvandParameters | null

  outdegreeGuarantees:
    AcrossOutdegreeGuarantees | null

  onOpenLovaszReference: () => void

  onOpenBalancedReference: (
    target: BalancedTarget,
  ) => void

  onOpenTwoFactorReference: () => void

  onOpenHasanvandReference: () => void
}

type BalancedBadgeProps = {
  target: BalancedTarget
  x: number
  y: number

  onOpen: (
    target: BalancedTarget,
  ) => void
}

function BalancedBadge({
  target,
  x,
  y,
  onOpen,
}: BalancedBadgeProps) {
  return (
    <foreignObject
      x={x}
      y={y}
      width="130"
      height="82"
    >
      <div
        style={{
          width: '100%',
          textAlign: 'center',
        }}
      >
        <button
          type="button"
          onClick={() =>
            onOpen(target)
          }
          aria-label={`Balanced orientation of ${target}`}
          style={{
            font: 'inherit',
            color: '#64748b',
            background: 'transparent',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              display: 'inline-block',
              fontSize: '20px',
              lineHeight: 1.1,
              borderBottom:
                '1px solid #94a3b8',
              paddingBottom: '2px',
            }}
          >
            balanced
          </div>

          <svg
            viewBox="0 0 70 25"
            width="70"
            height="25"
            aria-hidden="true"
            style={{
              display: 'block',
              margin: '7px auto 0',
            }}
          >
            <g
              stroke="#64748b"
              strokeWidth="1.8"
              strokeLinecap="round"
              fill="#64748b"
            >
              <line
                x1="10"
                y1="5"
                x2="54"
                y2="5"
              />

              <polygon
                points="54,5 47,1.5 47,8.5"
              />

              <line
                x1="58"
                y1="12.5"
                x2="14"
                y2="12.5"
              />

              <polygon
                points="14,12.5 21,9 21,16"
              />

              <line
                x1="10"
                y1="20"
                x2="54"
                y2="20"
              />

              <polygon
                points="54,20 47,16.5 47,23.5"
              />
            </g>
          </svg>
        </button>
      </div>
    </foreignObject>
  )
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

export default function GraphView({
  degree,
  workingDegree,
  fixedOutdegreeContribution,
  orientedTwoFactorCount,
  forbiddenSet,
  partition,
  acrossDirection,
  balancedG,
  balancedL,
  balancedR,
  hasanvandG,
  outdegreeGuarantees,
  onOpenLovaszReference,
  onOpenBalancedReference,
  onOpenTwoFactorReference,
  onOpenHasanvandReference,
}: GraphViewProps) {
  const allPossible =
    allOutdegrees(degree)

  const possibleOutdegreesL =
    outdegreeGuarantees?.L ??
    allPossible

  const possibleOutdegreesR =
    outdegreeGuarantees?.R ??
    allPossible

  const hasResidualGraph =
    orientedTwoFactorCount > 0

  if (partition !== null) {
    return (
      <PartitionGraphView
        workingDegree={
          workingDegree
        }
        fixedOutdegreeContribution={
          fixedOutdegreeContribution
        }
        orientedTwoFactorCount={
          orientedTwoFactorCount
        }
        forbiddenSet={
          forbiddenSet
        }
        partition={
          partition
        }
        acrossDirection={
          acrossDirection
        }
        balancedL={
          balancedL
        }
        balancedR={
          balancedR
        }
        possibleOutdegreesL={
          possibleOutdegreesL
        }
        possibleOutdegreesR={
          possibleOutdegreesR
        }
        onOpenLovaszReference={
          onOpenLovaszReference
        }
        onOpenBalancedReference={
          onOpenBalancedReference
        }
        onOpenTwoFactorReference={
          onOpenTwoFactorReference
        }
      />
    )
  }

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
            possibleOutdegreesL
          }
          forbiddenSet={
            forbiddenSet
          }
        />
      </div>
    </>
  )
}