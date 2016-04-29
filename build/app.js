"use strict";

(function () {
  if (!window.addEventListener) return; // Check for IE9+

  var options = INSTALL_OPTIONS;

  var selectionString = void 0;
  var previousSelectionString = void 0;
  var tooltip = void 0;

  var BIRD = "<svg viewBox=\"0 0 36 36\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\">\n    <path d=\"M25.07,14.374 C25.078,14.53 25.082,14.686 25.082,14.847 C25.082,19.667 21.412,25.226 14.701,25.226 C12.64,25.226 10.724,24.622 9.109,23.587 C9.396,23.62 9.685,23.638 9.978,23.638 C11.689,23.638 13.261,23.056 14.509,22.076 C12.913,22.047 11.566,20.992 11.103,19.543 C11.324,19.584 11.552,19.609 11.789,19.609 C12.121,19.609 12.443,19.562 12.75,19.48 C11.082,19.144 9.822,17.669 9.822,15.904 L9.822,15.857 C10.316,16.13 10.879,16.295 11.476,16.314 C10.497,15.66 9.853,14.543 9.853,13.277 C9.853,12.609 10.033,11.98 10.347,11.443 C12.146,13.65 14.835,15.103 17.867,15.254 C17.805,14.988 17.771,14.711 17.771,14.424 C17.771,12.408 19.406,10.778 21.419,10.778 C22.468,10.778 23.417,11.219 24.083,11.928 C24.913,11.764 25.694,11.461 26.399,11.041 C26.126,11.895 25.547,12.609 24.794,13.061 C25.534,12.973 26.237,12.776 26.89,12.489 C26.402,13.218 25.783,13.86 25.07,14.374 L25.07,14.374 Z\" fill=\"#FEFEFE\"></path>\n  </svg>";

  function clearTooltip() {
    tooltip && tooltip.remove();
  }

  function handleTooltipClick() {
    var message = selectionString;
    var url = void 0;

    if (options.username.enabled && options.username.value) {
      message = options.username.value + " " + message;
    }

    if (options.url.type === "custom") {
      url = options.url.custom;
    } else if (options.url.type === "location") {
      var _Eager$proxy$original = Eager.proxy.originalURL.parsed;
      var host = _Eager$proxy$original.host;
      var path = _Eager$proxy$original.path;
      var scheme = _Eager$proxy$original.scheme;


      url = INSTALL_ID === "preview" ? scheme + "://" + host + path : window.location;
    }

    if (url) message += " - " + url;

    window.open("https://twitter.com/intent/tweet?text=" + encodeURI(message), "_blank");
    clearTooltip();
  }

  function handleMouseUp() {
    var selection = window.getSelection();

    selectionString = selection.toString();

    if (selection.type !== "Range" || previousSelectionString === selectionString) {
      clearTooltip();
      return;
    }

    previousSelectionString = selectionString;

    tooltip = new window.Tooltip({
      target: selection.anchorNode.parentNode,
      position: "top center",
      content: "Tweet " + BIRD,
      openOn: "always"
    });

    tooltip.drop.drop.querySelector(".tooltip-content").addEventListener("mousedown", handleTooltipClick);
  }

  function updateElement() {
    document.addEventListener("mouseup", handleMouseUp);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateElement);
  } else {
    updateElement();
  }

  window.INSTALL_SCOPE = {
    setOptions: function setOptions(nextOptions) {
      options = nextOptions;

      updateElement();
    }
  };
})();