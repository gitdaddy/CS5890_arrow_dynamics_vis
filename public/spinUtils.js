"using strict";

let spinner = undefined;

let opts = {
  lines: 11, // The number of lines to draw
  length: 38, // The length of each line
  width: 13, // The line thickness
  radius: 7, // The radius of the inner circle
  scale: 1.6, // Scales overall size of the spinner
  corners: 0.8, // Corner roundness (0..1)
  color: '#5b2100', // CSS color or array of colors
  fadeColor: 'transparent', // CSS color or array of colors
  speed: 1, // Rounds per second
  rotate: 12, // The rotation offset
  animation: 'spinner-line-shrink', // The CSS animation name for the lines
  direction: 1, // 1: clockwise, -1: counterclockwise
  zIndex: 2e9, // The z-index (defaults to 2000000000)
  className: 'spinner', // The CSS class to assign to the spinner
  top: '70%', // Top position relative to parent
  left: '45%', // Left position relative to parent
  shadow: '0 0 1px transparent', // Box-shadow for the lines
  position: 'absolute' // Element positioning
};

function startSpinner(elementId) {
  var target = document.getElementById(elementId);
  spinner = new Spinner(opts).spin(target);
}

function stopSpinner() {
  if (spinner) {
    spinner.stop();
  }
}