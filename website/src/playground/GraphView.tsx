import Math from '../components/Math'
import {
  lovaszPartitionTool,
  type LovaszPair,
} from '../tools/lovaszPartition'
import type { AcrossDirection } from '../tools/orientAcrossPartition'

type GraphViewProps = {
  partition: LovaszPair | null
  acrossDirection: AcrossDirection | null
  onOpenLovaszReference: () => void
}

export default function GraphView({
  partition,
  acrossDirection,
  onOpenLovaszReference,
}: GraphViewProps) {
  if (partition === null) {
    return (
      <>
        <div
          style={{
            fontSize: '1.15rem',
            marginBottom: '20px',
          }}
        >
          a <Math>12</Math>-regular graph <Math>G</Math>
        </div>

        <svg
          viewBox="0 0 600 600"
          width="100%"
          role="img"
          aria-label="A 12-regular graph G represented symbolically as a circle"
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
        </defs>

        <ellipse
          cx="260"
          cy="220"
          rx="120"
          ry="165"
          fill="#f8fafc"
          stroke="#64748b"
          strokeWidth="3"
          filter="url(#soft-shadow-ellipse)"
        />

        <ellipse
          cx="540"
          cy="220"
          rx="120"
          ry="165"
          fill="#f8fafc"
          stroke="#64748b"
          strokeWidth="3"
          filter="url(#soft-shadow-ellipse)"
        />

        <text
          x="260"
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
          x="540"
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
          <text
            x="400"
            y="235"
            textAnchor="middle"
            fontSize="48"
            fill="#475569"
            fontFamily="KaTeX_Main, serif"
          >
            {acrossDirection === 'L-to-R' ? '→' : '←'}
          </text>
        )}

        <foreignObject
          x="140"
          y="405"
          width="240"
          height="60"
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
              {`\\Delta(G[L])\\le ${partition.s}`}
            </Math>
          </div>
        </foreignObject>

        <foreignObject
          x="420"
          y="405"
          width="240"
          height="60"
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
              {`\\Delta(G[R])\\le ${partition.t}`}
            </Math>
          </div>
        </foreignObject>
      </svg>
    </>
  )
}