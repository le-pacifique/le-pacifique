export function deterministicRandom(...seeds: Array<number | string>) {
  let hash = 2166136261

  for (const seed of seeds) {
    const value = String(seed)
    for (let index = 0; index < value.length; index += 1) {
      hash ^= value.charCodeAt(index)
      hash = Math.imul(hash, 16777619)
    }
  }

  return (hash >>> 0) / 4294967295
}

export function deterministicRange(
  min: number,
  max: number,
  ...seeds: Array<number | string>
) {
  return min + deterministicRandom(...seeds) * (max - min)
}
