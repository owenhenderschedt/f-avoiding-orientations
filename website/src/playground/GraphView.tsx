import Math from '../components/Math'
import {
  lovaszPartitionTool,
  type LovaszPair,
} from '../tools/lovaszPartition'
import {
  getAcrossOutdegreeGuarantees,
  type AcrossDirection,
  type OutdegreeRange,
} from '../tools/orientAcrossPartition'

type GraphViewProps = {
  partition: LovaszPair | null
  acrossDirection: AcrossDirection | null
  onOpenLovaszReference: () => void
}

function outdegreeRangeLatex(range: OutdegreeRange) {
  if (range.min === range.max) {
    return `d^+(v)=${range.min}`
  }

  return `d^+(v)\\in\\{${range.min},\\ldots,${range.max}\\}`
}

export default function GraphView({
  partition,
  acrossDirection,
  onOpenLovaszReference,
}: GraphViewProps) {
  const degree = 12

  if (partition === null) {
    return (
      <>
        <div
          style={{
            fontSize: '1.15rem',
            marginBottom: '20px',
          }}
        >
          a <Math>{`${degree}`}</Math>-regular graph <Math>G</Math>
        </div>

        <svg
          viewBox="0 0 600 600"
          width="100%"
          role="img"
          aria-label={`A ${degree}-regular graph G represented symbolically as a circle`}
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

          <text
            x="300"
            y="315"
            textAnchor="middle"
            fontSize="54"
            fill="#334155"
            fontFamily="KaTeX_Math, KaTeX_Main, serif"
            fontStyle="italic"
          >
            G
          </text>
        </svg>
      </>
    )
  }

  const guarantees =
    acrossDirection === null
      ? null
      : getAcrossOutdegreeGuarantees(
          degree,
          partition,
          acrossDirection,
        )

  return (
    <>
      <div
        style={{
          fontSize: '1.15rem',
          marginBottom: '20px',
        }}
      >
        an <Math>{`(${partition.s},${partition.t})`}</Math>
        -
        <button
          type="button"
          onClick={onOpenLovaszReference}
          style={{
            font: 'inherit',
            color: '#334155',
            background: 'transparent',
            border: 'none',
            borderBottom: '1px solid #64748b',
            padding: 0,
            cursor: 'pointer',
          }}
        >
          {lovaszPartitionTool.menuLabel}
        </button>{' '}
        of <Math>G</Math>
      </div>

      <svg
        viewBox="0 0 800 500"
        width="100%"
        role="img"
        aria-label={
          acrossDirection === null
            ? `A ${partition.s},${partition.t} Lovasz partition of G into parts L and R`
            : `A ${partition.s},${partition.t} Lovasz partition with crossing edges oriented ${acrossDirection}`
        }
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
          y="235"
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
          y="235"
          textAnchor="middle"
          fontSize="48"
          fill="#334155"
          fontFamily="KaTeX_Math, KaTeX_Main, serif"
          fontStyle="italic"
        >
          R
        </text>

        {acrossDirection !== null && (
          <g
            stroke="#475569"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          >
            {[175, 205, 235, 265].map((y) => (
              <line
                key={y}
                x1={acrossDirection === 'L-to-R' ? 360 : 440}
                y1={y}
                x2={acrossDirection === 'L-to-R' ? 440 : 360}
                y2={y}
                markerEnd="url(#filled-arrowhead)"
              />
            ))}
          </g>
        )}

        <foreignObject
          x="90"
          y="405"
          width="280"
          height="70"
        >
          <div
            style={{
              width: '100%',
              textAlign: 'center',
              fontSize: '24px',
              color: '#334155',
            }}
          >
            {guarantees === null ? (
              <Math>
                {`\\Delta(G[L])\\le ${partition.s}`}
              </Math>
            ) : (
              <Math>
                {outdegreeRangeLatex(guarantees.L)}
              </Math>
            )}
          </div>
        </foreignObject>

        <foreignObject
          x="430"
          y="405"
          width="280"
          height="70"
        >
          <div
            style={{
              width: '100%',
              textAlign: 'center',
              fontSize: '24px',
              color: '#334155',
            }}
          >
            {guarantees === null ? (
              <Math>
                {`\\Delta(G[R])\\le ${partition.t}`}
              </Math>
            ) : (
              <Math>
                {outdegreeRangeLatex(guarantees.R)}
              </Math>
            )}
          </div>
        </foreignObject>
      </svg>
    </>
  )
}