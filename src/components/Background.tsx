import React from "react"

const PATTERN_W = 200
const PATTERN_H = 100
const DEFAULT_OFFSET_X = 0
const DEFAULT_OFFSET_Y = 0

const DEFAULT_WIDTH = '100%'
const DEFAULT_HEIGHT = '100%'
const DEFAULT_ANIMATION_DUR = '45s'

const DEFAULT_ANI_X = 2 
const DEFAULT_ANI_Y = 1

const DEFAULT_OPACITY = '15%'

type OverlayBackgroundProps = {
  animated?: boolean, 
  animationDur?: string, 
  width?: number, 
  height?: number, 
  offsetX?: number
  offsetY?: number
  animationX?: number, 
  animationY?: number,
  opacity?: string,
}

export function OverlayBackground({
  animated, animationDur, 
  width, height, 
  offsetX, offsetY, 
  animationX, animationY, 
  opacity
}: OverlayBackgroundProps) {
  let animation = [] as JSX.Element[]

  const motionX = animationX ?? DEFAULT_ANI_X
  const motionY = animationY ?? DEFAULT_ANI_Y
  const startX = offsetX ?? DEFAULT_OFFSET_X
  const startY = offsetY ?? DEFAULT_OFFSET_Y

  if (animated) {
    animation = [
      <animate 
        key='x' attributeName="x" 
        repeatCount="indefinite" 
        from={startX} to={(DEFAULT_OFFSET_X+PATTERN_W)*motionX} 
        dur={animationDur ?? DEFAULT_ANIMATION_DUR} />,
      <animate 
        key='y' attributeName="y" 
        repeatCount="indefinite" 
        from={startY} to={(DEFAULT_OFFSET_Y+PATTERN_H)*motionY} 
        dur={animationDur ?? DEFAULT_ANIMATION_DUR} />,
    ]
  }

  return (
    <svg id="background" width={width ?? DEFAULT_WIDTH} height={height ?? DEFAULT_HEIGHT} style={{ position: 'fixed', zIndex: '-1000', top: '0px', left: '0px' }}>
      <defs>
        <pattern id="logo-pattern" patternUnits="userSpaceOnUse" width={PATTERN_W} height={PATTERN_H} x={DEFAULT_OFFSET_X} y={DEFAULT_OFFSET_Y}>
          {animation}
          <g viewBox="0 0 100 200" transform="scale(2, 2)">
            <use href="#logo" /> 
            <use href="#logo" x="50" y="-25" />
            <use href="#logo" x="50" y="25" />
          </g>
        </pattern>
        <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#600000', stopOpacity: 1 }}></stop>
          <stop offset="100%" style={{ stopColor: '#000060', stopOpacity: 1 }}></stop>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width={width ?? DEFAULT_WIDTH} height={height ?? DEFAULT_HEIGHT} fill="url(#bg)"></rect>
      <rect x="0" y="0" width={width ?? DEFAULT_WIDTH} height={height ?? DEFAULT_HEIGHT} fill="url(#logo-pattern)" opacity={opacity ?? DEFAULT_OPACITY}></rect>
    </svg>
  )
}