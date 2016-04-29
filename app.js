(function () {
  if (!window.addEventListener) return // Check for IE9+

  let options = INSTALL_OPTIONS

  let previousSelectionString
  let tooltip

  // this is good stuff. no matter what, we need a link. let's do it asap
  // 
  const link = document.createElement("a")

  link.className = "eager-tweet-this"
  link.innerText = "Tweet this!"
  link.target = "_blank"

  function clearTooltip() {
    tooltip && tooltip.remove()
  }

  function handleMouseUp() {
    const selection = window.getSelection()
    const selectionString = selection.toString()

    if (selection.type !== "Range" || previousSelectionString === selectionString) {
      clearTooltip()
      return
    }

    previousSelectionString = selectionString

    link.href = `https://twitter.com/intent/tweet?text=${encodeURI(selectionString)}`

    tooltip = new window.Tooltip({
      target: selection.anchorNode.parentNode,
      position: "top center",
      content: link,
      openOn: "always"
    })
  }

  function updateElement() {
    link.addEventListener("click", event => {
      console.log('link clicked')
      event.stopPropagation()
      clearTooltip()
    })
    document.addEventListener("mouseup", handleMouseUp)
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateElement)
  }
  else {
    updateElement()
  }

  window.INSTALL_SCOPE = {
    setOptions(nextOptions) {
      options = nextOptions

      updateElement()
    }
  }
}())
