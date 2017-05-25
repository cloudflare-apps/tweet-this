import * as icons from './icons'

(function () {
  if (!window.addEventListener) return // Check for IE9+

  const {max} = Math
  const CHARACTER_LIMIT = 140
  const URL_LENGTH = 23
  const TRUNCATE_CHARACTER = '...”'
  const URL_DELIMITER = ' — '

  const modalConfig = {
    scrollbars: 'yes',
    toolbar: 'no',
    location: 'yes',
    width: 670,
    height: 472
  }

  const isPreview = INSTALL_ID === 'preview'
  const open = isPreview && INSTALL.preview.open ? INSTALL.preview.open.direct : window.open

  let options = INSTALL_OPTIONS
  let selectionString
  let previousSelectionString
  let tooltip

  function clearTooltip () {
    previousSelectionString = ''

    tooltip && tooltip.remove()
  }

  function getMessage () {
    let username = options.username.enabled ? options.username.value.trim() : ''
    let message = `“${selectionString.trim()}”`
    let url = ''

    if (username) username = ` ${options.username.value}`

    if (options.url.type === 'custom') {
      url = options.url.custom
    } else if (options.url.type === 'location') {
      if (isPreview) {
        const {host, path, scheme} = INSTALL.proxy.originalURL.parsed

        url = `${scheme}://${host}${path}`
      } else {
        url = window.location
      }
    }

    if (url) url = URL_DELIMITER + url

    const restLength = username.length + (url ? URL_DELIMITER.length + URL_LENGTH : 0)
    const limit = max(CHARACTER_LIMIT - restLength, 0)

    if (message.length > limit) {
      message = message.substr(0, max(limit - TRUNCATE_CHARACTER.length, 0)).trim()
      message += TRUNCATE_CHARACTER
    }

    message += username + url

    return message.trim()
  }

  // Setting this method on the global fixes several cross-browser pop-up issues.
  window.openTweetThisPopup = function openTweetThisPopup () {
    const w = window
    const selection = window.getSelection()
    const message = getMessage()

    clearTooltip()
    selection.removeAllRanges()

    if (!message) return

    modalConfig.left = Math.max(w.screenX + Math.round(w.outerWidth / 2 - modalConfig.width / 2), 0)
    modalConfig.top = Math.max(w.screenY + Math.round(w.outerHeight / 2 - modalConfig.height / 2), 0)

    const features = Object
      .keys(modalConfig)
      .map(key => `${key}=${modalConfig[key]}`)
      .join(',')

    open(`https://twitter.com/intent/tweet?text=${encodeURI(message)}`, '_blank', features)
  }

  function updateTooltip (forceVisibility = false) {
    const text = options.text.trim()
    const selection = window.getSelection()

    selectionString = selection.toString()

    const selectionHasChanged = previousSelectionString !== selectionString

    if ((selection.isCollapsed || !selectionHasChanged) && !forceVisibility) {
      clearTooltip()
    } else if (!selection.isCollapsed && (selectionHasChanged || forceVisibility)) {
      clearTooltip()

      previousSelectionString = selectionString

      const innerLink = document.createElement('a')

      innerLink.innerHTML = text ? `${text} ${icons.BIRD}` : icons.BIRD
      innerLink.href = 'javascript:openTweetThisPopup()'
      innerLink.className = 'cf-tt-content'

      tooltip = new window.Tooltip({
        classes: 'cf-tweet-this',
        content: document.createElement('div'),
        openOn: 'always',
        position: 'top center',
        target: selection.anchorNode.parentNode
      })

      const {drop} = tooltip.drop
      const vendorContent = drop.querySelector('.cf-tt-content')

      drop.removeChild(vendorContent)
      drop.appendChild(innerLink)
    }
  }

  function bootstrap () {
    document.addEventListener('click', () => updateTooltip())
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap)
  } else {
    bootstrap()
  }

  window.INSTALL_SCOPE = {
    setOptionsCommon (nextOptions) {
      options = nextOptions
    },
    setOptionsRerender (nextOptions) {
      options = nextOptions

      updateTooltip(true)
    }
  }
}())
