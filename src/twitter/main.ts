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
} as const

let isReady = false
let timer: NodeJS.Timeout

/**
 * querySelector
 */
function $(key: keyof typeof selector, target: Document | HTMLElement = window.document) {
  return target.querySelector<HTMLElement>(selector[key])
}

/**
 * querySelectorAll
 */
function $$(key: keyof typeof selector, target: Document | HTMLElement = window.document) {
  return Array.from(target.querySelectorAll<HTMLElement>(selector[key]))
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
      if (scrollPosition > 0) {
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
      background-color: #15202B !important;
      opacity: 0.75;
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
