// Slightly uneven spacing and pen pressure keep the spiral hand-drawn.
export function getLoadingSpiralPath(turns: number) {
  const end = turns * Math.PI * 2
  const steps = Math.ceil(end / 0.08)
  const sides: Array<Array<[number, number]>> = [[], []]

  for (let index = 0; index <= steps; index++) {
    const angle = (index / steps) * end
    const radius = 8 + (angle / end) * 140
    const wobble = 2.2 * Math.sin(angle * 3.1) + 1.3 * Math.sin(angle * 7.3)
    const halfWidth =
      Math.min(6.5, 36 / turns) *
      (1 + 0.17 * Math.sin(angle * 2.7) + 0.09 * Math.sin(angle * 9.1))
    const taper = Math.min(1, index / 3, (steps - index) / 3)

    for (let side = 0; side < 2; side++) {
      const edge = radius + wobble + (side === 0 ? 1 : -1) * halfWidth * taper
      sides[side].push([
        Math.cos(angle - Math.PI / 2) * edge,
        Math.sin(angle - Math.PI / 2) * edge * 0.94,
      ])
    }
  }

  return (
    [...sides[0], ...sides[1].reverse()]
      .map(
        ([x, y], index) =>
          `${index === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`,
      )
      .join(' ') + ' Z'
  )
}

export function getLoadingSpiralTurns(elapsedMs: number) {
  // Add coils continuously, slowing over time so long waits stay legible.
  return 2.7 + Math.log1p(Math.max(0, elapsedMs) / 400) * 1.5
}
