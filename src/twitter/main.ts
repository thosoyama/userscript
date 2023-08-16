import { timeout } from '../lib/timeout'

const selector = {
  timeline: 'div[aria-label="ホームタイムライン"]',
  header: 'header >div > div > div',
  linksInHeader: 'header >div > div > div > div',
  mainHeader: 'main h2',
} as const

let isReady = false

/**
 * 次回実行可能状態まで待機
 */
function standby(ms = 20000) {
  isReady = false
  return new Promise<void>((resolve) =>
    setTimeout(() => {
      isReady = true
      resolve()
    }, ms)
  )
}

/**
 * ホームでリロード
 */
async function reloadTimelineForHome() {
  const $timeline = document.querySelector<HTMLDivElement>(selector.timeline)
  if ($timeline === null) {
    return
  }

  $timeline.style.transition = 'opacity 250ms ease-out'
  $timeline.style.opacity = '0'

  document.querySelector(selector.mainHeader)?.parentElement?.parentElement?.click()

  await timeout(500)

  $timeline.style.transition = 'opacity 250ms ease-in'
  $timeline.style.opacity = '1'
}

/**
 * ホーム以外でリロード
 */
async function reloadTimeline() {
  const $timeline = document.querySelector<HTMLDivElement>(selector.timeline)
  if ($timeline === null) {
    return
  }

  $timeline.style.transition = 'opacity 250ms ease-out'
  $timeline.style.opacity = '0'

  await timeout(450)

  scrollTo(0, 500)

  await timeout(50)

  scrollTo(0, 0)

  $timeline.style.transition = 'opacity 250ms ease-in'
  $timeline.style.opacity = '1'
}

/**
 * イベントハンドラ
 */
async function handleEventAsync(e: Event | PointerEvent) {
  // 準備中？
  if (!isReady) {
    console.info('Skip: not ready.')
    return
  }

  // 非表示になった
  if (e.type === 'visibilitychange' && document.visibilityState === 'hidden') {
    console.info('Skip: visibility hidden.')
    return
  }

  // スクロール位置が一番上？
  const scrollPosition = window.scrollY
  if (scrollPosition > 0) {
    console.info('Skip: scrolled by user.')
    return
  }

  // タイムライン要素がある？
  const $timeline = document.querySelector<HTMLElement>(selector.timeline)
  if ($timeline === null) {
    console.info('Skip: no such timeline element.')
    return
  }

  // クリックの場合
  if (e.type === 'click' && e.target !== null) {
    // ヘッダー内クリック？
    const $headerInner = document.querySelector<HTMLDivElement>(selector.header)
    if (!$headerInner?.contains(e.target as Node)) {
      console.info('Skip: not header clicked.')
      return
    }

    // ヘッダー内リンクのクリック？
    const $headerLinks = Array.from(document.querySelectorAll(selector.linksInHeader))
    if ($headerLinks.some(($el) => $el.contains(e.target as Node))) {
      console.info('Skip: invalid header click.')
      return
    }
  }

  console.info('Start reloading.')

  // 準備して
  standby()

  // リロード
  const reload = location.pathname === '/home' ? reloadTimelineForHome : reloadTimeline
  reload()
}

/**
 * イベントハンドラ
 */
function handleEvent(e: Event | PointerEvent) {
  console.group(e.type)
  handleEventAsync(e).finally(console.groupEnd)
}

window.addEventListener('focus', handleEvent)
window.addEventListener('click', handleEvent)
window.addEventListener('visibilitychange', handleEvent)

standby()
