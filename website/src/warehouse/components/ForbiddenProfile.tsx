type ForbiddenProfileProps = {
  degree:
    number

  forbiddenSet:
    readonly number[]
}

export default function ForbiddenProfile({
  degree,
  forbiddenSet,
}: ForbiddenProfileProps) {
  const forbidden =
    new Set(
      forbiddenSet,
    )

  const values =
    Array.from(
      {
        length:
          degree + 1,
      },
      (
        _,
        value,
      ) =>
        value,
    )

  return (
    <div
      aria-label={`Forbidden outdegree profile ${forbiddenSet.join(', ')}`}
      style={{
        display:
          'grid',

        gridTemplateColumns:
          `repeat(${degree + 1}, minmax(18px, 1fr))`,

        gap:
          '3px',

        alignItems:
          'end',
      }}
    >
      {values.map(
        (value) => {
          const isForbidden =
            forbidden.has(
              value,
            )

          return (
            <div
              key={
                value
              }
              style={{
                minWidth:
                  0,

                textAlign:
                  'center',
              }}
            >
              <div
                style={{
                  height:
                    '22px',

                  border:
                    isForbidden
                      ? '1px solid #b86a6a'
                      : '1px solid #d6dee8',

                  borderRadius:
                    '4px',

                  background:
                    isForbidden
                      ? '#f6dddd'
                      : '#f8fafc',

                  boxShadow:
                    isForbidden
                      ? 'inset 0 0 0 1px rgba(159, 68, 68, 0.04)'
                      : 'none',
                }}
              />

              <div
                style={{
                  marginTop:
                    '4px',

                  color:
                    isForbidden
                      ? '#8b4545'
                      : '#94a3b8',

                  fontSize:
                    degree >=
                    12
                      ? '10px'
                      : '11px',

                  lineHeight:
                    1,
                }}
              >
                {
                  value
                }
              </div>
            </div>
          )
        },
      )}
    </div>
  )
}
