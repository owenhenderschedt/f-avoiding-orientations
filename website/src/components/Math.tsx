import katex from 'katex'

type MathProps = {
  children: string
  display?: boolean
}

export default function Math({
  children,
  display = false,
}: MathProps) {
  const html = katex.renderToString(children, {
    throwOnError: false,
    displayMode: display,
  })

  return (
    <span
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}