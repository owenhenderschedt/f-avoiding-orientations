import Math from '../components/Math'
import BalancedBadge from '../components/BalancedBadge'
import AvoidCBadge from '../components/AvoidCBadge'
import MaLuBadge from '../components/MaLuBadge'
import PossibleOutdegrees from './PossibleOutdegrees'
import {
  lovaszPartitionTool,
  type LovaszPair,
} from '../tools/lovaszPartition'
import type {
  BalancedTarget,
} from '../tools/balancedOrientation'
import type {
  AvoidCTarget,
} from '../tools/avoidC'
import type {
  MaLuApplication,
} from '../tools/maLuApplication'
import type {
  AcrossDirection,
} from '../tools/orientAcrossPartition'
import type {
  OutdegreeSet,
} from './outdegreePossibilities'

type PartitionGraphViewProps = {
  workingDegree: number
  fixedOutdegreeContribution: number
  orientedTwoFactorCount: number

  forbiddenSet: readonly number[]
  partition: LovaszPair
  acrossDirection: AcrossDirection | null

  balancedL: boolean
  balancedR: boolean

  avoidCL: number | null
  avoidCR: number | null

  maLuApplicationL:
    MaLuApplication | null

  maLuApplicationR:
    MaLuApplication | null

  possibleOutdegreesL: OutdegreeSet
  possibleOutdegreesR: OutdegreeSet

  onOpenLovaszReference: () => void

  onOpenBalancedReference: (
    target: BalancedTarget,
  ) => void

  onOpenAvoidCReference: (
    target: AvoidCTarget,
    c: number,
  ) => void

  onOpenMaLuReference: (
    application: MaLuApplication,
  ) => void

  onOpenTwoFactorReference: () => void
}

function sameValues(
  a: readonly number[],
  b: readonly number[],
) {
  if (a.length !== b.length) {
    return false
  }

  return a.every(
    (value, index) =>
      value === b[index],
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

export default function PartitionGraphView({
  workingDegree,
  fixedOutdegreeContribution,
  orientedTwoFactorCount,
  forbiddenSet,
  partition,
  acrossDirection,
  balancedL,
  balancedR,
  avoidCL,
  avoidCR,
  maLuApplicationL,
  maLuApplicationR,
  possibleOutdegreesL,
  possibleOutdegreesR,
  onOpenLovaszReference,
  onOpenBalancedReference,
  onOpenAvoidCReference,
  onOpenMaLuReference,
  onOpenTwoFactorReference,
}: PartitionGraphViewProps) {
  const hasResidualGraph =
    orientedTwoFactorCount > 0

  const sharedPossibilities =
    sameValues(
      possibleOutdegreesL,
      possibleOutdegreesR,
    )

  return (
    <>
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

      <div
        style={{
          fontSize: '1.15rem',
          marginBottom: '20px',
        }}
      >
        an{' '}
        <Math>
          {`(${partition.s},${partition.t})`}
        </Math>
        -
        <button
          type="button"
          onClick={
            onOpenLovaszReference
          }
          style={{
            font: 'inherit',
            color: '#334155',
            background: 'transparent',
            border: 'none',
            borderBottom:
              '1px solid #64748b',
            padding: 0,
            cursor: 'pointer',
          }}
        >
          {
            lovaszPartitionTool
              .menuLabel
          }
        </button>{' '}
        of the{' '}
        <Math>
          {`${workingDegree}`}
        </Math>
        -regular residual graph
      </div>

      <svg
        viewBox="0 0 800 500"
        width="100%"
        role="img"
        style={{
          display: 'block',
          maxWidth: '620px',
          margin: '0 auto',
        }}
      >
        <defs>
          <filter
            id="soft-shadow-ellipse"
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

          <marker
            id="filled-arrowhead"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path
              d="M 0 0 L 10 5 L 0 10 z"
              fill="#475569"
            />
          </marker>
        </defs>

        <ellipse
          cx="230"
          cy="220"
          rx="120"
          ry="165"
          fill="#f8fafc"
          stroke="#64748b"
          strokeWidth="3"
          filter="url(#soft-shadow-ellipse)"
        />

        <ellipse
          cx="570"
          cy="220"
          rx="120"
          ry="165"
          fill="#f8fafc"
          stroke="#64748b"
          strokeWidth="3"
          filter="url(#soft-shadow-ellipse)"
        />

        <text
          x="230"
          y="225"
          textAnchor="middle"
          fontSize="48"
          fill="#334155"
          fontFamily="KaTeX_Math, KaTeX_Main, serif"
          fontStyle="italic"
        >
          L
        </text>

        <text
          x="570"
          y="225"
          textAnchor="middle"
          fontSize="48"
          fill="#334155"
          fontFamily="KaTeX_Math, KaTeX_Main, serif"
          fontStyle="italic"
        >
          R
        </text>

        {balancedL && (
          <BalancedBadge
            target="L"
            x={165}
            y={245}
            onOpen={
              onOpenBalancedReference
            }
          />
        )}

        {avoidCL !== null && (
          <AvoidCBadge
            target="L"
            c={avoidCL}
            x={155}
            y={250}
            onOpen={
              onOpenAvoidCReference
            }
          />
        )}

        {maLuApplicationL !== null && (
          <MaLuBadge
            application={
              maLuApplicationL
            }
            x={140}
            y={250}
            onOpen={
              onOpenMaLuReference
            }
          />
        )}

        {balancedR && (
          <BalancedBadge
            target="R"
            x={505}
            y={245}
            onOpen={
              onOpenBalancedReference
            }
          />
        )}

        {avoidCR !== null && (
          <AvoidCBadge
            target="R"
            c={avoidCR}
            x={495}
            y={250}
            onOpen={
              onOpenAvoidCReference
            }
          />
        )}

        {maLuApplicationR !== null && (
          <MaLuBadge
            application={
              maLuApplicationR
            }
            x={480}
            y={250}
            onOpen={
              onOpenMaLuReference
            }
          />
        )}

        {acrossDirection !== null && (
          <g
            stroke="#475569"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          >
            {[175, 205, 235, 265].map(
              (y) => (
                <line
                  key={y}
                  x1={
                    acrossDirection ===
                    'L-to-R'
                      ? 360
                      : 440
                  }
                  y1={y}
                  x2={
                    acrossDirection ===
                    'L-to-R'
                      ? 440
                      : 360
                  }
                  y2={y}
                  markerEnd="url(#filled-arrowhead)"
                />
              ),
            )}
          </g>
        )}

        <foreignObject
          x="90"
          y="405"
          width="280"
          height="55"
        >
          <div
            style={{
              width: '100%',
              textAlign: 'center',
              fontSize: '24px',
              color: '#334155',
            }}
          >
            <Math>
              {`\\Delta(G[L])\\leq ${partition.s}`}
            </Math>
          </div>
        </foreignObject>

        <foreignObject
          x="430"
          y="405"
          width="280"
          height="55"
        >
          <div
            style={{
              width: '100%',
              textAlign: 'center',
              fontSize: '24px',
              color: '#334155',
            }}
          >
            <Math>
              {`\\Delta(G[R])\\leq ${partition.t}`}
            </Math>
          </div>
        </foreignObject>
      </svg>

      {hasResidualGraph && (
        <div
          style={{
            maxWidth: '620px',
            margin: '0 auto 18px',
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

      {sharedPossibilities ? (
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
      ) : (
        <div
          style={{
            maxWidth: '620px',
            margin: '8px auto 0',
            display: 'grid',
            gridTemplateColumns:
              '1fr 1fr',
            gap: '30px',
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

          <PossibleOutdegrees
            values={
              possibleOutdegreesR
            }
            forbiddenSet={
              forbiddenSet
            }
          />
        </div>
      )}
    </>
  )
}