import { useState } from 'react'
import Math from './Math'

export type FilterMatchMode =
  | 'individual'
  | 'pair'

export type ForbiddenSetFilterState = {
  mustInclude: readonly number[]
  mustExclude: readonly number[]
  matchMode: FilterMatchMode
}

type ForbiddenSetFilterProps = {
  degree: number
  totalCount: number
  filteredCount: number
  value: ForbiddenSetFilterState
  onChange: (
    value: ForbiddenSetFilterState,
  ) => void
}

export function emptyForbiddenSetFilter():
  ForbiddenSetFilterState {
  return {
    mustInclude: [],
    mustExclude: [],
    matchMode: 'individual',
  }
}

export default function ForbiddenSetFilter({
  degree,
  totalCount,
  filteredCount,
  value,
  onChange,
}: ForbiddenSetFilterProps) {
  const [
    open,
    setOpen,
  ] = useState(false)

  const outdegrees =
    Array.from(
      {
        length: degree + 1,
      },
      (_, index) => index,
    )

  const activeFilterCount =
    value.mustInclude.length +
    value.mustExclude.length

  const hasFilters =
    activeFilterCount > 0

  function setMatchMode(
    matchMode: FilterMatchMode,
  ) {
    onChange({
      ...value,
      matchMode,
    })
  }

  function toggleMustInclude(
    number: number,
  ) {
    const alreadyIncluded =
      value.mustInclude.includes(
        number,
      )

    if (alreadyIncluded) {
      onChange({
        ...value,

        mustInclude:
          value.mustInclude.filter(
            (item) =>
              item !== number,
          ),
      })

      return
    }

    onChange({
      ...value,

      mustInclude: [
        ...value.mustInclude,
        number,
      ].sort(
        (a, b) => a - b,
      ),

      /*
       * A number cannot simultaneously
       * be required to lie in F and
       * required to lie outside F.
       */
      mustExclude:
        value.mustExclude.filter(
          (item) =>
            item !== number,
        ),
    })
  }

  function toggleMustExclude(
    number: number,
  ) {
    const alreadyExcluded =
      value.mustExclude.includes(
        number,
      )

    if (alreadyExcluded) {
      onChange({
        ...value,

        mustExclude:
          value.mustExclude.filter(
            (item) =>
              item !== number,
          ),
      })

      return
    }

    onChange({
      ...value,

      /*
       * A number cannot simultaneously
       * be required to lie in F and
       * required to lie outside F.
       */
      mustInclude:
        value.mustInclude.filter(
          (item) =>
            item !== number,
        ),

      mustExclude: [
        ...value.mustExclude,
        number,
      ].sort(
        (a, b) => a - b,
      ),
    })
  }

  function clearFilters() {
    onChange({
      mustInclude: [],
      mustExclude: [],
      matchMode:
        value.matchMode,
    })
  }

  const chipBaseStyle = {
    font: 'inherit',
    width: '38px',
    height: '36px',
    padding: 0,
    borderRadius: '7px',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  }

  const matchButtonStyle = {
    font: 'inherit',
    padding: '7px 12px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
  }

  return (
    <div
      style={{
        position: 'sticky',
        top: '12px',
        zIndex: 20,
        marginBottom: '18px',
      }}
    >
      <div
        style={{
          border:
            '1px solid #dbe3ec',
          borderRadius: '12px',
          background:
            'rgba(255, 255, 255, 0.97)',
          boxShadow:
            '0 6px 20px rgba(15, 23, 42, 0.07)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            minHeight: '58px',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent:
              'space-between',
            gap: '18px',
          }}
        >
          <div
            style={{
              color: '#64748b',
              fontSize: '17px',
              whiteSpace: 'nowrap',
            }}
          >
            {hasFilters ? (
              <>
                showing{' '}
                <strong
                  style={{
                    color:
                      '#334155',
                    fontWeight: 500,
                  }}
                >
                  {filteredCount}
                </strong>{' '}
                of {totalCount} cases
                up to reversal
              </>
            ) : (
              <>
                {totalCount} cases up
                to reversal
              </>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            {hasFilters && (
              <button
                type="button"
                onClick={
                  clearFilters
                }
                style={{
                  font: 'inherit',
                  border: 'none',
                  background:
                    'transparent',
                  color: '#64748b',
                  cursor: 'pointer',
                  padding: '6px 4px',
                  fontSize: '16px',
                }}
              >
                Clear filters
              </button>
            )}

            <button
              type="button"
              onClick={() =>
                setOpen(
                  (current) =>
                    !current,
                )
              }
              style={{
                font: 'inherit',
                border:
                  '1px solid #94a3b8',
                borderRadius: '8px',
                background:
                  '#f8fafc',
                color: '#334155',
                cursor: 'pointer',
                padding:
                  '8px 14px',
                whiteSpace: 'nowrap',
              }}
            >
              Filter cases
              {hasFilters
                ? ` (${activeFilterCount})`
                : ''}{' '}
              {open ? '▴' : '▾'}
            </button>
          </div>
        </div>

        {open && (
          <div
            style={{
              borderTop:
                '1px solid #e2e8f0',
              padding:
                '18px 18px 20px',
            }}
          >
            <div
              style={{
                display: 'grid',
                gap: '18px',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    '145px 1fr',
                  alignItems:
                    'center',
                  gap: '14px',
                }}
              >
                <div
                  style={{
                    color: '#475569',
                    fontSize: '17px',
                  }}
                >
                  Match
                </div>

                <div
                  style={{
                    display:
                      'inline-flex',
                    justifySelf:
                      'start',
                    border:
                      '1px solid #cbd5e1',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background:
                      '#ffffff',
                  }}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setMatchMode(
                        'individual',
                      )
                    }
                    style={{
                      ...matchButtonStyle,

                      background:
                        value.matchMode ===
                        'individual'
                          ? '#e2e8f0'
                          : '#ffffff',

                      color:
                        value.matchMode ===
                        'individual'
                          ? '#1e293b'
                          : '#64748b',

                      fontWeight:
                        value.matchMode ===
                        'individual'
                          ? 600
                          : 400,

                      borderRight:
                        '1px solid #cbd5e1',
                    }}
                  >
                    Individual lists
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setMatchMode(
                        'pair',
                      )
                    }
                    style={{
                      ...matchButtonStyle,

                      background:
                        value.matchMode ===
                        'pair'
                          ? '#e2e8f0'
                          : '#ffffff',

                      color:
                        value.matchMode ===
                        'pair'
                          ? '#1e293b'
                          : '#64748b',

                      fontWeight:
                        value.matchMode ===
                        'pair'
                          ? 600
                          : 400,
                    }}
                  >
                    Entire reversal pair
                  </button>
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    '145px 1fr',
                  alignItems:
                    'center',
                  gap: '14px',
                }}
              >
                <div
                  style={{
                    color: '#475569',
                    fontSize: '17px',
                  }}
                >
                  Must be in{' '}
                  <Math>{'F'}</Math>
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '7px',
                  }}
                >
                  {outdegrees.map(
                    (number) => {
                      const selected =
                        value.mustInclude
                          .includes(
                            number,
                          )

                      return (
                        <button
                          key={
                            `include-${number}`
                          }
                          type="button"
                          onClick={() =>
                            toggleMustInclude(
                              number,
                            )
                          }
                          aria-pressed={
                            selected
                          }
                          title={
                            selected
                              ? `Remove the requirement ${number} ∈ F`
                              : `Require ${number} ∈ F`
                          }
                          style={{
                            ...chipBaseStyle,

                            border:
                              selected
                                ? '2px solid #dc2626'
                                : '1px solid #cbd5e1',

                            background:
                              selected
                                ? '#fee2e2'
                                : '#ffffff',

                            color:
                              selected
                                ? '#991b1b'
                                : '#475569',

                            fontWeight:
                              selected
                                ? 600
                                : 400,
                          }}
                        >
                          <Math>
                            {`${number}`}
                          </Math>
                        </button>
                      )
                    },
                  )}
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    '145px 1fr',
                  alignItems:
                    'center',
                  gap: '14px',
                }}
              >
                <div
                  style={{
                    color: '#475569',
                    fontSize: '17px',
                  }}
                >
                  Must be out of{' '}
                  <Math>{'F'}</Math>
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '7px',
                  }}
                >
                  {outdegrees.map(
                    (number) => {
                      const selected =
                        value.mustExclude
                          .includes(
                            number,
                          )

                      return (
                        <button
                          key={
                            `exclude-${number}`
                          }
                          type="button"
                          onClick={() =>
                            toggleMustExclude(
                              number,
                            )
                          }
                          aria-pressed={
                            selected
                          }
                          title={
                            selected
                              ? `Remove the requirement ${number} ∉ F`
                              : `Require ${number} ∉ F`
                          }
                          style={{
                            ...chipBaseStyle,

                            border:
                              selected
                                ? '2px solid #64748b'
                                : '1px solid #cbd5e1',

                            background:
                              selected
                                ? '#e2e8f0'
                                : '#ffffff',

                            color:
                              selected
                                ? '#334155'
                                : '#475569',

                            fontWeight:
                              selected
                                ? 600
                                : 400,
                          }}
                        >
                          <Math>
                            {`${number}`}
                          </Math>
                        </button>
                      )
                    },
                  )}
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: '16px',
                paddingTop: '14px',
                borderTop:
                  '1px solid #f1f5f9',
                color: '#94a3b8',
                fontSize: '15px',
              }}
            >
              Individual lists keeps a
              card when either member
              matches. Entire reversal
              pair requires both members
              to match.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}