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
  GraphPart,
} from './outdegreePossibilities'

type ToolMenuProps = {
  workingDegree: number

  partition: LovaszPair | null
  acrossDirection: AcrossDirection | null

  balancedG: boolean
  balancedL: boolean
  balancedR: boolean

  hasanvandG:
    HasanvandParameters | null

  onApplyLovasz:
    (pair: LovaszPair) => void

  onOrientAcross:
    (direction: AcrossDirection) => void

  onBalanceGraph: () => void

  onBalancePart:
    (part: GraphPart) => void

  onTakeOrientedTwoFactor:
    () => void

  onApplyHasanvand:
    (
      parameters: HasanvandParameters,
    ) => void
}

export default function ToolMenu({
  workingDegree,
  partition,
  acrossDirection,
  balancedG,
  balancedL,
  balancedR,
  hasanvandG,
  onApplyLovasz,
  onOrientAcross,
  onBalanceGraph,
  onBalancePart,
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

  const lovaszPairs =
    getLovaszPairs(
      workingDegree,
    )

  const hasanvandPairs =
    getHasanvandParameterPairs(
      workingDegree,
    )

  function toggleTools() {
    setToolsOpen(
      (current) => !current,
    )

    setLovaszOpen(false)
    setHasanvandOpen(false)
  }

  function openLovaszMenu() {
    setLovaszOpen(true)
    setHasanvandOpen(false)
  }

  function openHasanvandMenu() {
    setHasanvandOpen(true)
    setLovaszOpen(false)
  }

  function applyLovasz(
    pair: LovaszPair,
  ) {
    onApplyLovasz(pair)

    setToolsOpen(false)
    setLovaszOpen(false)
    setHasanvandOpen(false)
  }

  function applyAcrossOrientation(
    direction: AcrossDirection,
  ) {
    onOrientAcross(direction)

    setToolsOpen(false)
  }

  function applyBalanceGraph() {
    onBalanceGraph()

    setToolsOpen(false)
  }

  function applyBalancedOrientation(
    part: GraphPart,
  ) {
    onBalancePart(part)

    setToolsOpen(false)
  }

  function takeOrientedTwoFactor() {
    onTakeOrientedTwoFactor()

    setToolsOpen(false)
  }

  function applyHasanvand(
    parameters:
      HasanvandParameters,
  ) {
    onApplyHasanvand(
      parameters,
    )

    setToolsOpen(false)
    setHasanvandOpen(false)
    setLovaszOpen(false)
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
    hasanvandG !== null

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

  const hasAvailablePartitionTool =
    acrossDirection === null ||
    !balancedL ||
    !balancedR

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
          {orientationFinished ? (
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

              {!balancedL && (
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

              {!balancedR && (
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