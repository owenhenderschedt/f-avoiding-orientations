import Math from '../components/Math'

type CaseStatusProps = {
  degree: number
  forbiddenSet: readonly number[]
  isValid: boolean
}

export default function CaseStatus({
  degree,
  forbiddenSet,
  isValid,
}: CaseStatusProps) {
  const forbiddenSetLatex = `\\{${forbiddenSet.join(',')}\\}`

  return (
    <div
      style={{
        marginBottom: '34px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontSize: '1.15rem',
          marginBottom: '12px',
        }}
      >
        <Math>{`d=${degree}`}</Math>
        <span style={{ margin: '0 14px' }}>·</span>
        <Math>{`F=${forbiddenSetLatex}`}</Math>
      </div>

      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '9px',
          padding: '7px 13px',
          borderRadius: '8px',
          background: isValid ? '#f0fdf4' : '#fef2f2',
          border: isValid
            ? '1px solid #bbf7d0'
            : '1px solid #fecaca',
          color: isValid ? '#166534' : '#991b1b',
          fontSize: '0.95rem',
        }}
      >
        <span
          aria-hidden="true"
          style={{
            width: '9px',
            height: '9px',
            borderRadius: '50%',
            background: isValid ? '#16a34a' : '#dc2626',
            flexShrink: 0,
          }}
        />

        <span>
  {isValid ? (
    <>
      Valid <Math>{'F'}</Math>-avoiding orientation
    </>
  ) : (
    <>
      Not yet a valid <Math>{'F'}</Math>-avoiding orientation
    </>
  )}
</span>
      </div>
    </div>
  )
}