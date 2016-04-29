"use strict";

(function () {
  if (!window.addEventListener) return; // Check for IE9+

  var options = INSTALL_OPTIONS;

  var previousSelectionString = void 0;
  var tooltip = void 0;

  // this is good stuff. no matter what, we need a link. let's do it asap
  //
  var link = document.createElement("a");

  link.className = "eager-tweet-this";
  link.innerText = "Tweet this!";
  link.target = "_blank";

  function clearTooltip() {
    tooltip && tooltip.remove();
  }

  function handleMouseUp() {
    var selection = window.getSelection();
    var selectionString = selection.toString();

    if (selection.type !== "Range" || previousSelectionString === selectionString) {
      clearTooltip();
      return;
    }

    previousSelectionString = selectionString;

    link.href = "https://twitter.com/intent/tweet?text=" + encodeURI(selectionString);

    tooltip = new window.Tooltip({
      target: selection.anchorNode.parentNode,
      position: "top center",
      content: link,
      openOn: "always"
    });
  }

  function updateElement() {
    link.addEventListener("click", function (event) {
      console.log('link clicked');
      event.stopPropagation();
      clearTooltip();
    });
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