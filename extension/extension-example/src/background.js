chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
  chrome.declarativeContent.onPageChanged.addRules([{
    conditions: [
      new chrome.declarativeContent.PageStateMatcher()
    ],
    actions: [new chrome.declarativeContent.ShowPageAction()]
  }]);
});