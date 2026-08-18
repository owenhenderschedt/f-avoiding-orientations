import { useState } from 'react'
import Math from '../components/Math'
import {
  getLovaszPairs,
  lovaszPartitionTool,
  type LovaszPair,
} from '../tools/lovaszPartition'
import {
  orientedTwoFactorTool,
} from '../tools/orientedTwoFactor'
import {
  getHasanvandParameterPairs,
  hasanvandCompressionTool,
  type HasanvandParameters,
} from '../tools/hasanvandCompression'
import type {
  AcrossDirection,
} from '../tools/orientAcrossPartition'
import type {
  AvoidCTarget,
} from '../tools/avoidC'
import type {
  GraphPart,
} from './outdegreePossibilities'

type ToolMenuProps = {
  workingDegree: number

  partition: LovaszPair | null
  acrossDirection: AcrossDirection | null

  balancedG: boolean
  balancedL: boolean
  balancedR: boolean

  avoidCG: number | null
  avoidCL: number | null
  avoidCR: number | null

  hasanvandG:
    HasanvandParameters | null

  onApplyLovasz:
    (pair: LovaszPair) => void

  onOrientAcross:
    (direction: AcrossDirection) => void

  onBalanceGraph: () => void

  onBalancePart:
    (part: GraphPart) => void

  onAvoidCGraph:
    (c: number) => void

  onAvoidCPart:
    (
      part: GraphPart,
      c: number,
    ) => void

  onTakeOrientedTwoFactor:
    () => void

  onApplyHasanvand:
    (
      parameters: HasanvandParameters,
    ) => void
}

function getAvoidCValues(
  maxDegree: number,
) {
  const values: number[] = []

  for (
    let c = 2;
    c <= maxDegree;
    c += 1
  ) {
    values.push(c)
  }

  return values
}

export default function ToolMenu({
  workingDegree,
  partition,
  acrossDirection,
  balancedG,
  balancedL,
  balancedR,
  avoidCG,
  avoidCL,
  avoidCR,
  hasanvandG,
  onApplyLovasz,
  onOrientAcross,
  onBalanceGraph,
  onBalancePart,
  onAvoidCGraph,
  onAvoidCPart,
  onTakeOrientedTwoFactor,
  onApplyHasanvand,
}: ToolMenuProps) {
  const [
    toolsOpen,
    setToolsOpen,
  ] = useState(false)

  const [
    lovaszOpen,
    setLovaszOpen,
  ] = useState(false)

  const [
    hasanvandOpen,
    setHasanvandOpen,
  ] = useState(false)

  const [
    avoidCTarget,
    setAvoidCTarget,
  ] =
    useState<AvoidCTarget | null>(
      null,
    )

  const lovaszPairs =
    getLovaszPairs(
      workingDegree,
    )

  const hasanvandPairs =
    getHasanvandParameterPairs(
      workingDegree,
    )

  /*
   * Avoid c is only useful for
   * 2 <= c <= the relevant maximum
   * degree.
   *
   * For the whole graph, that is the
   * current working degree.
   *
   * After a Lovasz partition,
   * Delta(G[L]) <= s and
   * Delta(G[R]) <= t, so the useful
   * ranges are 2,...,s and 2,...,t.
   */
  let avoidCMaxDegree = 0

  if (avoidCTarget === 'G') {
    avoidCMaxDegree =
      workingDegree
  }

  if (
    avoidCTarget === 'L' &&
    partition !== null
  ) {
    avoidCMaxDegree =
      partition.s
  }

  if (
    avoidCTarget === 'R' &&
    partition !== null
  ) {
    avoidCMaxDegree =
      partition.t
  }

  const avoidCValues =
    getAvoidCValues(
      avoidCMaxDegree,
    )

  function closeSubmenus() {
    setLovaszOpen(false)
    setHasanvandOpen(false)
    setAvoidCTarget(null)
  }

  function toggleTools() {
    setToolsOpen(
      (current) => !current,
    )

    closeSubmenus()
  }

  function openLovaszMenu() {
    setLovaszOpen(true)
    setHasanvandOpen(false)
    setAvoidCTarget(null)
  }

  function openHasanvandMenu() {
    setHasanvandOpen(true)
    setLovaszOpen(false)
    setAvoidCTarget(null)
  }

  function openAvoidCMenu(
    target: AvoidCTarget,
  ) {
    setAvoidCTarget(target)
    setLovaszOpen(false)
    setHasanvandOpen(false)
  }

  function applyLovasz(
    pair: LovaszPair,
  ) {
    onApplyLovasz(pair)

    setToolsOpen(false)
    closeSubmenus()
  }

  function applyAcrossOrientation(
    direction: AcrossDirection,
  ) {
    onOrientAcross(direction)

    setToolsOpen(false)
    closeSubmenus()
  }

  function applyBalanceGraph() {
    onBalanceGraph()

    setToolsOpen(false)
    closeSubmenus()
  }

  function applyBalancedOrientation(
    part: GraphPart,
  ) {
    onBalancePart(part)

    setToolsOpen(false)
    closeSubmenus()
  }

  function applyAvoidC(
    c: number,
  ) {
    if (avoidCTarget === 'G') {
      onAvoidCGraph(c)
    }

    if (
      avoidCTarget === 'L' ||
      avoidCTarget === 'R'
    ) {
      onAvoidCPart(
        avoidCTarget,
        c,
      )
    }

    setToolsOpen(false)
    closeSubmenus()
  }

  function takeOrientedTwoFactor() {
    onTakeOrientedTwoFactor()

    setToolsOpen(false)
    closeSubmenus()
  }

  function applyHasanvand(
    parameters:
      HasanvandParameters,
  ) {
    onApplyHasanvand(
      parameters,
    )

    setToolsOpen(false)
    closeSubmenus()
  }

  const controlButtonStyle = {
    font: 'inherit',
    padding: '10px 18px',
    border:
      '1px solid #64748b',
    borderRadius: '8px',
    background: '#f8fafc',
    color: '#334155',
    cursor: 'pointer',
  }

  const menuButtonStyle = {
    font: 'inherit',
    width: '100%',
    padding: '10px 14px',
    border: 'none',
    borderRadius: '6px',
    background: 'transparent',
    color: '#334155',
    cursor: 'pointer',
    textAlign: 'left' as const,
  }

  const orientationFinished =
    balancedG ||
    avoidCG !== null ||
    hasanvandG !== null

  const leftInternallyOriented =
    balancedL ||
    avoidCL !== null

  const rightInternallyOriented =
    balancedR ||
    avoidCR !== null

  const canTakeTwoFactor =
    partition === null &&
    !orientationFinished &&
    workingDegree >= 2 &&
    workingDegree % 2 === 0

  const canApplyHasanvand =
    partition === null &&
    !orientationFinished &&
    workingDegree > 0 &&
    hasanvandPairs.length > 0

  const canAvoidCInG =
    partition === null &&
    !orientationFinished &&
    workingDegree >= 2

  const canAvoidCInL =
    partition !== null &&
    !leftInternallyOriented &&
    partition.s >= 2

  const canAvoidCInR =
    partition !== null &&
    !rightInternallyOriented &&
    partition.t >= 2

  const hasAvailablePartitionTool =
    acrossDirection === null ||
    !leftInternallyOriented ||
    !rightInternallyOriented

  return (
    <div
      style={{
        position: 'relative',
        width: '300px',
      }}
    >
      <button
        type="button"
        onClick={toggleTools}
        style={{
          ...controlButtonStyle,
          width: '100%',
        }}
      >
        Tools{' '}
        {toolsOpen
          ? '▴'
          : '▾'}
      </button>

      {toolsOpen && (
        <div
          style={{
            marginTop: '8px',
            padding: '6px',
            border:
              '1px solid #cbd5e1',
            borderRadius: '10px',
            background: '#ffffff',
            boxShadow:
              '0 8px 24px rgba(0, 0, 0, 0.08)',
            textAlign: 'left',
          }}
        >
          {avoidCTarget !== null ? (
            <>
              <div
                style={{
                  padding:
                    '8px 10px 10px',
                  borderBottom:
                    '1px solid #e2e8f0',
                  marginBottom:
                    '4px',
                  textAlign:
                    'center',
                }}
              >
                Avoid{' '}
                <Math>{'c'}</Math>{' '}
                in{' '}
                <Math>
                  {avoidCTarget}
                </Math>

                <div
                  style={{
                    marginTop:
                      '5px',
                    color:
                      '#64748b',
                    fontSize:
                      '16px',
                  }}
                >
                  Choose{' '}
                  <Math>
                    {`2\\leq c\\leq ${avoidCMaxDegree}`}
                  </Math>
                </div>
              </div>

              <div
                style={{
                  maxHeight:
                    '300px',
                  overflowY:
                    'auto',
                }}
              >
                {avoidCValues.map(
                  (c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() =>
                        applyAvoidC(
                          c,
                        )
                      }
                      style={{
                        ...menuButtonStyle,
                        textAlign:
                          'center',
                      }}
                    >
                      <Math>
                        {`c=${c}`}
                      </Math>
                    </button>
                  ),
                )}
              </div>

              <button
                type="button"
                onClick={() =>
                  setAvoidCTarget(
                    null,
                  )
                }
                style={{
                  ...menuButtonStyle,
                  marginTop:
                    '4px',
                  borderTop:
                    '1px solid #e2e8f0',
                  textAlign:
                    'center',
                }}
              >
                ← Back
              </button>
            </>
          ) : orientationFinished ? (
            <div
              style={{
                padding:
                  '10px 14px',
                color: '#64748b',
              }}
            >
              No additional tools yet.
            </div>
          ) : partition === null ? (
            <>
              {!lovaszOpen &&
              !hasanvandOpen ? (
                <>
                  {workingDegree >
                    0 && (
                    <button
                      type="button"
                      onClick={
                        openLovaszMenu
                      }
                      style={
                        menuButtonStyle
                      }
                    >
                      {
                        lovaszPartitionTool
                          .menuLabel
                      }{' '}
                      →
                    </button>
                  )}

                  {workingDegree >
                    0 && (
                    <button
                      type="button"
                      onClick={
                        applyBalanceGraph
                      }
                      style={
                        menuButtonStyle
                      }
                    >
                      Balance{' '}
                      <Math>
                        {'G'}
                      </Math>
                    </button>
                  )}

                  {canAvoidCInG && (
                    <button
                      type="button"
                      onClick={() =>
                        openAvoidCMenu(
                          'G',
                        )
                      }
                      style={
                        menuButtonStyle
                      }
                    >
                      Avoid{' '}
                      <Math>
                        {'c'}
                      </Math>{' '}
                      in{' '}
                      <Math>
                        {'G'}
                      </Math>{' '}
                      →
                    </button>
                  )}

                  {canTakeTwoFactor && (
                    <button
                      type="button"
                      onClick={
                        takeOrientedTwoFactor
                      }
                      style={
                        menuButtonStyle
                      }
                    >
                      {
                        orientedTwoFactorTool
                          .menuLabel
                      }
                    </button>
                  )}

                  {canApplyHasanvand && (
                    <button
                      type="button"
                      onClick={
                        openHasanvandMenu
                      }
                      style={
                        menuButtonStyle
                      }
                    >
                      {
                        hasanvandCompressionTool
                          .menuLabel
                      }{' '}
                      →
                    </button>
                  )}
                </>
              ) : lovaszOpen ? (
                <>
                  <div
                    style={{
                      padding:
                        '8px 10px 10px',
                      borderBottom:
                        '1px solid #e2e8f0',
                      marginBottom:
                        '4px',
                    }}
                  >
                    Choose{' '}
                    <Math>
                      {'(s,t)'}
                    </Math>
                  </div>

                  {lovaszPairs.map(
                    (pair) => (
                      <button
                        key={
                          `${pair.s}-${pair.t}`
                        }
                        type="button"
                        onClick={() =>
                          applyLovasz(
                            pair,
                          )
                        }
                        style={{
                          ...menuButtonStyle,
                          textAlign:
                            'center',
                        }}
                      >
                        <Math>
                          {`(${pair.s},${pair.t})`}
                        </Math>
                      </button>
                    ),
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      setLovaszOpen(
                        false,
                      )
                    }
                    style={{
                      ...menuButtonStyle,
                      marginTop:
                        '4px',
                      borderTop:
                        '1px solid #e2e8f0',
                      textAlign:
                        'center',
                    }}
                  >
                    ← Back
                  </button>
                </>
              ) : (
                <>
                  <div
                    style={{
                      padding:
                        '8px 10px 10px',
                      borderBottom:
                        '1px solid #e2e8f0',
                      marginBottom:
                        '4px',
                    }}
                  >
                    Choose{' '}
                    <Math>
                      {'(p,q)'}
                    </Math>
                  </div>

                  <div
                    style={{
                      maxHeight:
                        '300px',
                      overflowY:
                        'auto',
                    }}
                  >
                    {hasanvandPairs.map(
                      (pair) => (
                        <button
                          key={
                            `${pair.p}-${pair.q}`
                          }
                          type="button"
                          onClick={() =>
                            applyHasanvand(
                              pair,
                            )
                          }
                          style={{
                            ...menuButtonStyle,
                            textAlign:
                              'center',
                          }}
                        >
                          <Math>
                            {`(${pair.p},${pair.q})`}
                          </Math>
                        </button>
                      ),
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setHasanvandOpen(
                        false,
                      )
                    }
                    style={{
                      ...menuButtonStyle,
                      marginTop:
                        '4px',
                      borderTop:
                        '1px solid #e2e8f0',
                      textAlign:
                        'center',
                    }}
                  >
                    ← Back
                  </button>
                </>
              )}
            </>
          ) : hasAvailablePartitionTool ? (
            <>
              {acrossDirection ===
                null && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      applyAcrossOrientation(
                        'L-to-R',
                      )
                    }
                    style={
                      menuButtonStyle
                    }
                  >
                    Orient{' '}
                    <Math>
                      {'L\\to R'}
                    </Math>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      applyAcrossOrientation(
                        'R-to-L',
                      )
                    }
                    style={
                      menuButtonStyle
                    }
                  >
                    Orient{' '}
                    <Math>
                      {'R\\to L'}
                    </Math>
                  </button>
                </>
              )}

              {!leftInternallyOriented && (
                <button
                  type="button"
                  onClick={() =>
                    applyBalancedOrientation(
                      'L',
                    )
                  }
                  style={
                    menuButtonStyle
                  }
                >
                  Balance{' '}
                  <Math>
                    {'L'}
                  </Math>
                </button>
              )}

              {!rightInternallyOriented && (
                <button
                  type="button"
                  onClick={() =>
                    applyBalancedOrientation(
                      'R',
                    )
                  }
                  style={
                    menuButtonStyle
                  }
                >
                  Balance{' '}
                  <Math>
                    {'R'}
                  </Math>
                </button>
              )}

              {canAvoidCInL && (
                <button
                  type="button"
                  onClick={() =>
                    openAvoidCMenu(
                      'L',
                    )
                  }
                  style={
                    menuButtonStyle
                  }
                >
                  Avoid{' '}
                  <Math>
                    {'c'}
                  </Math>{' '}
                  in{' '}
                  <Math>
                    {'L'}
                  </Math>{' '}
                  →
                </button>
              )}

              {canAvoidCInR && (
                <button
                  type="button"
                  onClick={() =>
                    openAvoidCMenu(
                      'R',
                    )
                  }
                  style={
                    menuButtonStyle
                  }
                >
                  Avoid{' '}
                  <Math>
                    {'c'}
                  </Math>{' '}
                  in{' '}
                  <Math>
                    {'R'}
                  </Math>{' '}
                  →
                </button>
              )}
            </>
          ) : (
            <div
              style={{
                padding:
                  '10px 14px',
                color: '#64748b',
              }}
            >
              No additional tools yet.
            </div>
          )}
        </div>
      )}
    </div>
  )
}