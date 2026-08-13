import Math from '../components/Math'
import type { OutdegreeSet } from './outdegreePossibilities'

type PossibleOutdegreesProps = {
  values: OutdegreeSet
  forbiddenSet: readonly number[]
}

export default function PossibleOutdegrees({
  values,
  forbiddenSet,
}: PossibleOutdegreesProps) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div
        style={{
          marginBottom: '12px',
          fontSize: '20px',
          color: '#475569',
        }}
      >
        possible outdegrees
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '7px',
        }}
      >
        {values.map((value) => {
          const forbidden = forbiddenSet.includes(value)

          return (
            <span
              key={value}
              title={
                forbidden
                  ? `${value} belongs to F`
                  : `${value} does not belong to F`
              }
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '36px',
                height: '36px',
                padding: '0 8px',
                borderRadius: '7px',
                border: forbidden
                  ? '2px solid #dc2626'
                  : '1px solid #cbd5e1',
                backgroundColor: forbidden
                  ? '#fecaca'
                  : '#ffffff',
                color: forbidden
                  ? '#991b1b'
                  : '#334155',
                boxShadow: forbidden
                  ? 'inset 0 0 0 1px #ef4444'
                  : 'none',
                fontWeight: forbidden ? 700 : 400,
              }}
            >
              <span
                style={{
                  color: forbidden
                    ? '#991b1b'
                    : '#334155',
                }}
              >
                <Math>{`${value}`}</Math>
              </span>
            </span>
          )
        })}
      </div>
    </div>
  )
}