import { timeout } from '../lib/timeout'

const selector = {
  timeline: 'div[aria-label="ホームタイムライン"]',
  column: 'div[aria-label="ホームタイムライン"] > div > div > div > div > div > div > div',
  header: 'header',
  headerInner: 'header > div',
  headerMenuWrapper: 'header > div > div',
  headerMenu: 'header > div > div > div',
  linksInHeader: 'header >div > div > div > div',
  mainHeader: 'main h2',
  hasNotSidebar: 'div:not(:has(div[data-testid="sidebarColumn"]))',
  headerIsMin: 'header > div:is()',
} as const

let isReady = false

/**
 * querySelector
 */
function $(selector: string, target: Document | HTMLElement = window.document) {
  return target.querySelector(selector) as HTMLElement
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
  const $timeline = document.querySelector<HTMLDivElement>(selector.timeline)
  if ($timeline === null) {
    return
  }

  $timeline.style.transition = 'opacity 250ms ease-out'
  $timeline.style.opacity = '0'

  document.querySelector(selector.mainHeader)?.parentElement?.parentElement?.click()

  await timeout(500)
  scrollTo(0, 0)

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
    const $headerInner = document.querySelector<HTMLDivElement>(selector.headerMenu)
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

/**
 * install styles
 */
function installStyles() {
  const id = 'ex-tw-reloader'
  if ($(`#${id}`) !== null) {
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
 * メニューの表示切替
 */
function handleHeaderMouseEvent(e: MouseEvent) {
  if (!(e.target instanceof Node)) {
    return
  }

  const $header = $(selector.header)
  const $menuWrapper = $(selector.headerMenuWrapper)

  if ($header.contains(e.target) && $menuWrapper.clientHeight === 53) {
    console.log('over', $menuWrapper.clientHeight)
    $menuWrapper.style.setProperty('height', '100%', 'important')
    return
  }

  if (!$header.contains(e.target) && $menuWrapper.clientHeight !== 53) {
    console.log('out', $menuWrapper.clientHeight)
    $(selector.headerMenuWrapper).style.setProperty('height', '53px', 'important')
  }
}

/**
 * イベントリスナ登録
 */
function installScript() {
  window.addEventListener('focus', handleEvent)
  window.addEventListener('click', handleEvent)
  window.addEventListener('visibilitychange', handleEvent)

  window.addEventListener('mouseover', handleHeaderMouseEvent)
  window.addEventListener('mouseout', handleHeaderMouseEvent)
}

installStyles()
installScript()

standby()
