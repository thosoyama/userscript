function main() {
  const button = document.querySelector('.a-pagination .a-last:not(:has(>a))')
  if (!button) {
    return
  }

  const currentPageUrl = location.href
  const currentPageNumber = location.href.match(/pg=(\d+)/)?.[1]
  if (!currentPageNumber) {
    return
  }

  const link = document.createElement('a')
  link.href = currentPageUrl.replace(/pg=\d+/, `pg=${Number(currentPageNumber) + 1}`)
  link.innerHTML = button.innerHTML

  button.classList.remove('a-disabled')
  button.innerHTML = ''
  button.append(link)
}

main()
