(function () {
  if (!window.addEventListener) return // Check for IE9+

  const {max} = Math
  const CHARACTER_LIMIT = 140
  const URL_LENGTH = 23
  const TRUNCATE_CHARACTER = "...”"
  const URL_DELIMITER = " — "

  let options = INSTALL_OPTIONS
  let selectionString
  let previousSelectionString
  let tooltip

  const BIRD = `<svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" role="img">
    <path d="M25.07,14.374 C25.078,14.53 25.082,14.686 25.082,14.847 C25.082,19.667 21.412,25.226 14.701,25.226 C12.64,25.226 10.724,24.622 9.109,23.587 C9.396,23.62 9.685,23.638 9.978,23.638 C11.689,23.638 13.261,23.056 14.509,22.076 C12.913,22.047 11.566,20.992 11.103,19.543 C11.324,19.584 11.552,19.609 11.789,19.609 C12.121,19.609 12.443,19.562 12.75,19.48 C11.082,19.144 9.822,17.669 9.822,15.904 L9.822,15.857 C10.316,16.13 10.879,16.295 11.476,16.314 C10.497,15.66 9.853,14.543 9.853,13.277 C9.853,12.609 10.033,11.98 10.347,11.443 C12.146,13.65 14.835,15.103 17.867,15.254 C17.805,14.988 17.771,14.711 17.771,14.424 C17.771,12.408 19.406,10.778 21.419,10.778 C22.468,10.778 23.417,11.219 24.083,11.928 C24.913,11.764 25.694,11.461 26.399,11.041 C26.126,11.895 25.547,12.609 24.794,13.061 C25.534,12.973 26.237,12.776 26.89,12.489 C26.402,13.218 25.783,13.86 25.07,14.374 L25.07,14.374 Z" fill="#FEFEFE"></path>
  </svg>`

  function clearTooltip() {
    previousSelectionString = ""

    tooltip && tooltip.remove()
  }

  function openModal(text = "") {
    const w = window
    const config = {
      scrollbars: "yes",
      pda: "yes",
      toolbar: "no",
      location: "yes",
      width: 670,
      height: 472
    }

    config.left = Math.max(w.screenX + Math.round(w.outerWidth / 2 - config.width / 2), 0)
    config.top = Math.max(w.screenY + Math.round(w.outerHeight / 2 - config.height / 2), 0)

    const features = Object
      .keys(config)
      .map(key => `${key}=${config[key]}`)
      .join(", ")

    window.open(`https://twitter.com/intent/tweet?text=${encodeURI(text.trim())}`, "_blank", features)
  }

  function handleTooltipClick() {
    const selection = window.getSelection()
    let username = options.username.enabled && options.username.value.trim() || ""
    let message = `“${selectionString.trim()}”`
    let url = ""

    if (username) username = ` ${options.username.value}`

    if (options.url.type === "custom") {
      url = options.url.custom
    }
    else if (options.url.type === "location") {
      const {host, path, scheme} = Eager.proxy.originalURL.parsed

      url = INSTALL_ID === "preview" ? `${scheme}://${host}${path}` : window.location
    }

    if (url) url = URL_DELIMITER + url

    const restLength = username.length + (url ? URL_DELIMITER.length + URL_LENGTH : 0)
    const limit = max(CHARACTER_LIMIT - restLength, 0)

    if (message.length > limit) {
      message = message.substr(0, max(limit - TRUNCATE_CHARACTER.length, 0)).trim()
      message += TRUNCATE_CHARACTER
    }

    message += username + url

    openModal(message)

    clearTooltip()
    selection.removeAllRanges()
  }

  function updateTooltip(forceVisibility = false) {
    const text = options.text.trim()
    const selection = window.getSelection()

    selectionString = selection.toString()

    const selectionHasChanged = previousSelectionString !== selectionString

    if ((selection.isCollapsed || !selectionHasChanged) && !forceVisibility) {
      clearTooltip()
    }
    else if (!selection.isCollapsed && (selectionHasChanged || forceVisibility)) {
      clearTooltip()

      previousSelectionString = selectionString

      tooltip = new window.Tooltip({
        classes: "eager-tweet-this",
        content: text ? `${text} ${BIRD}` : BIRD,
        openOn: "always",
        position: "top center",
        target: selection.anchorNode.parentNode
      })

      tooltip
        .drop
        .drop
        .querySelector(".eager-tt-content")
        .addEventListener("mousedown", handleTooltipClick)
    }
  }

  function bootstrap() {
    document.addEventListener("mouseup", () => updateTooltip())
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrap)
  }
  else {
    bootstrap()
  }

  window.INSTALL_SCOPE = {
    setOptionsCommon(nextOptions) {
      options = nextOptions
    },
    setOptionsRerender(nextOptions) {
      options = nextOptions

      updateTooltip(true)
    }
  }
}())
