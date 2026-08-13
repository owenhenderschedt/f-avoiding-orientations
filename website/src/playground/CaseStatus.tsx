import Math from '../components/Math'

type CaseStatusProps = {
  degree: number
  forbiddenSet: readonly number[]
  isComplete: boolean
  isValid: boolean
}

export default function CaseStatus({
  degree,
  forbiddenSet,
  isComplete,
  isValid,
}: CaseStatusProps) {
  const forbiddenSetLatex =
    `\\{${forbiddenSet.join(',')}\\}`

  let message

  if (!isComplete) {
    message = (
      <>
        Not yet a complete orientation
      </>
    )
  } else if (!isValid) {
    message = (
      <>
        Not a valid <Math>{'F'}</Math>-avoiding orientation
      </>
    )
  } else {
    message = (
      <>
        Valid <Math>{'F'}</Math>-avoiding orientation
      </>
    )
  }

  const valid = isComplete && isValid

  return (
    <div
      style={{
        maxWidth: '680px',
        margin: '0 auto 34px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          marginBottom: '12px',
          fontSize: '1.08rem',
          color: '#334155',
        }}
      >
        <Math>{`d=${degree}`}</Math>
        {' · '}
        <Math>{`F=${forbiddenSetLatex}`}</Math>
      </div>

      <div
        style={{
          padding: '13px 18px',
          borderRadius: '9px',
          border: valid
            ? '1px solid #16a34a'
            : '1px solid #dc2626',
          backgroundColor: valid
            ? '#f0fdf4'
            : '#fef2f2',
          color: valid
            ? '#166534'
            : '#991b1b',
          fontSize: '1rem',
        }}
      >
        {message}
      </div>
    </div>
  )
}