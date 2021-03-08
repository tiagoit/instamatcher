'use strict';

document.getElementById('revealSemantics').onclick = function (element) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.executeScript(
      tabs[0].id,
      { file: 'semantic-viewer.js' });
  });
};
