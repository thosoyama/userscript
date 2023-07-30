/**
 * 指定ミリ秒待機
 */
export function timeout(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}
