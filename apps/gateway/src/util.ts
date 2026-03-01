export function parseShards(shardEnv: string): number[] {
  if (shardEnv.includes('-')) {
    const [start, end] = shardEnv.split('-').map(Number);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }
  return shardEnv.split(',').map(Number);
}
