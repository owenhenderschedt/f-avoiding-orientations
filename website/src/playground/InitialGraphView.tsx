import Math from '../components/Math'
import BalancedBadge from '../components/BalancedBadge'
import AvoidCBadge from '../components/AvoidCBadge'
import MaLuBadge from '../components/MaLuBadge'
import HasanvandBadge from '../components/HasanvandBadge'
import ParityBoundsBadge from '../components/ParityBoundsBadge'
import StabilizeOutdegreeClassBadge from '../components/StabilizeOutdegreeClassBadge'
import PossibleOutdegrees from './PossibleOutdegrees'
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
  HasanvandApplication,
} from '../tools/hasanvandApplication'
import type {
  ParityBoundsApplication,
} from '../tools/parityBoundsApplication'
import type {
  StabilizeOutdegreeClassApplication,
} from '../tools/stabilizeOutdegreeClassApplication'
import type {
  DirectedMengerApplication,
} from '../tools/directedMengerApplication'
import type {
  OutdegreeSet,
} from './outdegreePossibilities'

type InitialGraphViewProps = {
  degree:
    number

  workingDegree:
    number

  fixedOutdegreeContribution:
    number

  orientedTwoFactorCount:
    number

  forbiddenSet:
    readonly number[]

  balancedG:
    boolean

  avoidCG:
    number | null

  maLuApplicationG:
    MaLuApplication | null

  hasanvandApplicationG:
    HasanvandApplication | null

  parityBoundsApplicationG?:
    ParityBoundsApplication | null

  stabilizeOutdegreeClassApplication:
    StabilizeOutdegreeClassApplication | null

  directedMengerApplication:
    DirectedMengerApplication | null

  possibleOutdegrees:
    OutdegreeSet

  onOpenBalancedReference:
    (
      target:
        BalancedTarget,
    ) => void

  onOpenAvoidCReference:
    (
      target:
        AvoidCTarget,

      c:
        number,
    ) => void

  onOpenMaLuReference:
    (
      application:
        MaLuApplication,
    ) => void

  onOpenHasanvandReference:
    (
      application:
        HasanvandApplication,
    ) => void

  onOpenParityBoundsReference?:
    (
      application:
        ParityBoundsApplication,
    ) => void

  onOpenStabilizeOutdegreeClassReference:
    (
      application:
        StabilizeOutdegreeClassApplication,
    ) => void

  onOpenDirectedMengerReference:
    (
      application:
        DirectedMengerApplication,
    ) => void

  onOpenTwoFactorReference:
    () => void
}

function TwoFactorNote({
  count,
  onOpen,
}: {
  count:
    number

  onOpen:
    () => void
}) {
  return (
    <div
      style={{
        margin:
          '4px auto 20px',

        textAlign:
          'center',

        color:
          '#64748b',

        fontSize:
          '20px',
      }}
    >
      {count ===
      1 ? (
        <>
          removed:{' '}

          <button
            type="button"
            onClick={
              onOpen
            }
            style={{
              font:
                'inherit',

              color:
                '#475569',

              background:
                'transparent',

              border:
                'none',

              borderBottom:
                '1px solid #64748b',

              padding:
                '0 1px 2px',

              cursor:
                'pointer',
            }}
          >
            oriented
            2-factor{' '}

            <Math>
              {'C'}
            </Math>
          </button>
        </>
      ) : (
        <>
          removed:{' '}

          <button
            type="button"
            onClick={
              onOpen
            }
            style={{
              font:
                'inherit',

              color:
                '#475569',

              background:
                'transparent',

              border:
                'none',

              borderBottom:
                '1px solid #64748b',

              padding:
                '0 1px 2px',

              cursor:
                'pointer',
            }}
          >
            <Math>
              {`${count}`}
            </Math>{' '}

            oriented
            2-factors
          </button>
        </>
      )}
    </div>
  )
}

function getMengerRepairLatex(
  application:
    DirectedMengerApplication,
) {
  return application
    .demandRules
    .map(
      (
        rule,
      ) => {
        const finalOutdegree =
          application.direction ===
          'increase'
            ? rule.outdegree +
              rule.demand
            : rule.outdegree -
              rule.demand

        return (
          `${rule.outdegree}`
          + '\\to'
          + `${finalOutdegree}`
        )
      },
    )
    .join(',\\ ')
}

export default function InitialGraphView({
  degree,
  workingDegree,
  fixedOutdegreeContribution,
  orientedTwoFactorCount,
  forbiddenSet,
  balancedG,
  avoidCG,
  maLuApplicationG,
  hasanvandApplicationG,
  parityBoundsApplicationG = null,
  stabilizeOutdegreeClassApplication,
  directedMengerApplication,
  possibleOutdegrees,
  onOpenBalancedReference,
  onOpenAvoidCReference,
  onOpenMaLuReference,
  onOpenHasanvandReference,
  onOpenParityBoundsReference,
  onOpenStabilizeOutdegreeClassReference,
  onOpenDirectedMengerReference,
  onOpenTwoFactorReference,
}: InitialGraphViewProps) {
  const hasResidualGraph =
    orientedTwoFactorCount >
    0

  /*
   * A whole-graph stabilization should
   * only appear here when its target is
   * genuinely G.
   */
  const stabilizationOnG =
    stabilizeOutdegreeClassApplication !==
      null &&
    stabilizeOutdegreeClassApplication
      .target ===
      'G'
      ? stabilizeOutdegreeClassApplication
      : null

  return (
    <>
      <div
        style={{
          fontSize:
            '1.15rem',

          marginBottom:
            '16px',
        }}
      >
        {hasResidualGraph ? (
          <>
            a{' '}

            <Math>
              {
                `${workingDegree}`
              }
            </Math>
            -regular residual
            graph
          </>
        ) : (
          <>
            a{' '}

            <Math>
              {`${degree}`}
            </Math>
            -regular graph{' '}

            <Math>
              {'G'}
            </Math>
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

      {directedMengerApplication !==
        null && (
        <div
          style={{
            margin:
              '0 auto 8px',

            textAlign:
              'center',
          }}
        >
          <button
            type="button"
            onClick={() =>
              onOpenDirectedMengerReference(
                directedMengerApplication,
              )
            }
            style={{
              font:
                'inherit',

              color:
                '#2f6f4e',

              background:
                'transparent',

              border:
                'none',

              borderBottom:
                '1px solid #4f7f65',

              padding:
                '0 1px 2px',

              cursor:
                'pointer',
            }}
          >
            Directed Menger{' '}

            <Math>
              {
                getMengerRepairLatex(
                  directedMengerApplication,
                )
              }
            </Math>
          </button>
        </div>
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
          display:
            'block',

          maxWidth:
            '420px',

          margin:
            '0 auto',
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
          y="225"
          width="300"
          height="100"
        >
          <div
            style={{
              width:
                '100%',

              textAlign:
                'center',

              fontSize:
                '44px',

              color:
                '#334155',
            }}
          >
            {hasResidualGraph ? (
              <Math>
                {'G-C'}
              </Math>
            ) : (
              <Math>
                {'G'}
              </Math>
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

        {avoidCG !==
          null && (
          <AvoidCBadge
            target="G"
            c={
              avoidCG
            }
            x={225}
            y={325}
            onOpen={
              onOpenAvoidCReference
            }
          />
        )}

        {maLuApplicationG !==
          null && (
          <MaLuBadge
            application={
              maLuApplicationG
            }
            x={210}
            y={325}
            onOpen={
              onOpenMaLuReference
            }
          />
        )}

        {hasanvandApplicationG !==
          null && (
          <HasanvandBadge
            application={
              hasanvandApplicationG
            }
            x={170}
            y={320}
            onOpen={
              onOpenHasanvandReference
            }
          />
        )}

        {parityBoundsApplicationG !==
          null &&
          onOpenParityBoundsReference !==
            undefined && (
          <ParityBoundsBadge
            application={
              parityBoundsApplicationG
            }
            x={205}
            y={320}
            onOpen={() =>
              onOpenParityBoundsReference(
                parityBoundsApplicationG,
              )
            }
          />
        )}

        {stabilizationOnG !==
          null && (
          <StabilizeOutdegreeClassBadge
            application={
              stabilizationOnG
            }
            x={170}
            y={390}
            onOpen={
              onOpenStabilizeOutdegreeClassReference
            }
          />
        )}
      </svg>

      {hasResidualGraph && (
        <div
          style={{
            maxWidth:
              '620px',

            margin:
              '-4px auto 18px',

            color:
              '#64748b',

            fontSize:
              '19px',
          }}
        >
          fixed contribution:{' '}

          <Math>
            {
              `+${fixedOutdegreeContribution}`
            }
          </Math>{' '}

          to every outdegree
        </div>
      )}

      <div
        style={{
          maxWidth:
            '620px',

          margin:
            '8px auto 0',
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