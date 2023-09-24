import { timeout } from '../lib/timeout'

const exId = 'ex-tw-reloader'

const selector = {
  ex: `#${exId}`,
  timeline: 'div[aria-label="ホームタイムライン"]',
  column: 'div[aria-label="ホームタイムライン"] > div > div > div > div > div > div > div',
  header: 'header',
  headerInner: 'header > div',
  headerMenuWrapper: 'header > div > div',
  headerMenu: 'header > div > div > div',
  linksInHeader: 'header >div > div > div > div',
  mainHeader: 'main h2',
  sidebar: 'div[data-testid="sidebarColumn"]',
  hasNotSidebar: 'div:not(:has(div[data-testid="sidebarColumn"]))',
  headerIsMin: 'header > div:is()',
  metaThemeColor: 'meta[name="theme-color"]',
} as const

let isReady = false
let timer: NodeJS.Timeout

/**
 * querySelector
 */
function $<T extends HTMLElement>(
  key: keyof typeof selector,
  target: Document | T = window.document
) {
  return target.querySelector<T>(selector[key])
}

/**
 * querySelectorAll
 */
function $$<T extends HTMLElement>(
  key: keyof typeof selector,
  target: Document | T = window.document
) {
  return Array.from(target.querySelectorAll<T>(selector[key]))
}

/**
 * 16進カラーコードからrgbaに変換
 */
export const hex2rgb = (hex: string, alpha?: number) => {
  // 先頭のハッシュ記号を削る
  if (hex.startsWith('#')) {
    hex = hex.slice(1)
  }

  // 正しいhexフォーマットか確認
  if (![3, 6].includes(hex.length) || /^[\dA-Fa-f]+}$/.test(hex)) {
    throw new Error(`Invalid hex ${hex}`)
  }

  // アルファ値の確認
  if (alpha !== undefined && (alpha > 1 || alpha < 0)) {
    throw new Error(`Invalid alpha ${alpha}`)
  }

  // 3桁指定の場合は6桁に直す
  if (hex.length === 3) {
    hex = Array.from(hex)
      .flatMap((s) => [s, s])
      .join('')
  }

  // rgbに変換
  const rgb = [hex.slice(0, 2), hex.slice(2, 4), hex.slice(4, 6)]
    .map((str: string) => Number.parseInt(str, 16))
    .join(',')

  return alpha === undefined ? `rgb(${rgb})` : `rgba(${rgb},${alpha})`
}

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
  const $timeline = $('timeline')
  if ($timeline === null) {
    return
  }

  $timeline.style.transition = 'opacity 250ms ease-out'
  $timeline.style.opacity = '0'

  $('mainHeader')?.parentElement?.parentElement?.click()

  await timeout(500)
  scrollTo(0, 0)

  $timeline.style.transition = 'opacity 250ms ease-in'
  $timeline.style.opacity = '1'
}

/**
 * ホーム以外でリロード
 */
async function reloadTimelineForOther() {
  const $timeline = $('timeline')
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
 * リロード
 */
async function reloadTimeline(e: Event | PointerEvent) {
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
  const $timeline = $('timeline')
  if ($timeline === null) {
    console.info('Skip: no such timeline element.')
    return
  }

  // クリックの場合
  if (e.type === 'click' && e.target !== null) {
    // ヘッダー内クリック？
    const $headerInner = $('headerMenu')
    if (!$headerInner?.contains(e.target as Node)) {
      console.info('Skip: not header clicked.')
      return
    }

    // ヘッダー内リンクのクリック？
    const $headerLinks = $$('linksInHeader')
    if ($headerLinks.some(($el) => $el.contains(e.target as Node))) {
      console.info('Skip: invalid header click.')
      return
    }
  }

  console.info('Start reloading.')

  // 準備して
  standby()

  // リロード
  const reload = location.pathname === '/home' ? reloadTimelineForHome : reloadTimelineForOther
  reload()
}

/**
 * イベントハンドラ
 */
function handleEvent(e: Event | PointerEvent) {
  console.group(e.type)
  reloadTimeline(e).finally(console.groupEnd)
}

/**
 * マウスイベントハンドラ
 */
function handleMouseEvent(e: MouseEvent) {
  const ev = e
  const height = ev.type === 'mouseenter' || $('sidebar') ? '100%' : '53px'
  $('headerMenuWrapper')?.style.setProperty('height', height, 'important')

  // 1秒マウスオーバーでリロード
  clearTimeout(timer)
  if (ev.type === 'mouseenter') {
    timer = setTimeout(() => {
      const scrollPosition = window.scrollY
      if (scrollPosition === 0) {
        console.group(ev.type)
        reloadTimeline(ev).finally(console.groupEnd)
      }
    }, 1000)
  }
}

/**
 * スタイル定義
 */
function installStyles() {
  const id = 'ex-tw-reloader'
  if ($('ex') !== null) {
    return
  }

  const themeColor = $<HTMLMetaElement>('metaThemeColor')?.content ?? '#15202B'
  const style = document.createElement('style')
  style.id = id
  style.textContent = `
    ${selector.hasNotSidebar} ${selector.header} {
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
    }
    ${selector.hasNotSidebar} ${selector.headerMenuWrapper} {
      height: 53px !important;
    }
    ${selector.hasNotSidebar} ${selector.headerMenu} {
      background-color: ${hex2rgb(themeColor, 0.75)} !important;
    }
    ${selector.hasNotSidebar} ${selector.column} {
      padding-left: 95px !important;
      @media (max-width: 599px) {
        padding-left: 75px !important;
      }
    }
  `
  document.head.append(style)
}

/**
 * イベントハンドラ登録
 */
function installEventHandler() {
  window.addEventListener('focus', handleEvent)
  window.addEventListener('click', handleEvent)
  window.addEventListener('visibilitychange', handleEvent)
  document.addEventListener('mouseenter', handleMouseEvent)
  document.addEventListener('mouseleave', handleMouseEvent)
}

installStyles()
installEventHandler()
standby()
