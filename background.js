var videoUrls = {};

function checkIfVideoUrl(requestDetails) {
  videoUrls[requestDetails.tabId] = [requestDetails.url];
  return {
    cancel: true
  };
}

function messageRecieved(request, sender, sendResponse) {
  if (request.parsedUrls) {
    if (videoUrls[sender.tab.id].length > 0) {
      videoUrls[sender.tab.id] = videoUrls[sender.tab.id].concat(request.parsedUrls);
    }
    else{
      videoUrls[sender.tab.id] = request.parsedUrls;
    }
  } else if (request.geturls) {
    sendResponse({
      videoUrls: videoUrls[request.tabId]
    });
  }
}



function callPageToParseForVideos(tabId, changeInfo, tab) {

  browser.storage.local.get("settings").then(function(result) {
    var settings = result.settings;
    if (settings.host_to_intercept) {
      var host_to_intercept = settings.host_to_intercept.split(',');
      var host_to_intercept_matches = [];
      for (var i = 0; i < host_to_intercept.length; i++) {
        host_to_intercept_matches.push("*://*." + host_to_intercept[i] + "/*");
      }

      browser.webRequest.onBeforeRequest.addListener(
        checkIfVideoUrl, {
          urls: host_to_intercept_matches,
          types: ["media"]
        }, ["blocking"]
      );
    }
    if (settings.hosts_to_parse_html) {
      _callPageToParseForVideos(tabId, changeInfo, tab);
    }
    if (settings.hosts_to_show_list) {
      _checkToShowPageAction(tab.url, tabId);
    }

    function _checkToShowPageAction(url, tabId) {
      var hosts_to_show_list = settings.hosts_to_show_list.split(',').join("|");
      var re = new RegExp(hosts_to_show_list, "i");
      if (url.match(re) != null) {
        browser.pageAction.show(tabId);
      } else {
        browser.pageAction.hide(tabId);
      }
    }

    function _callPageToParseForVideos(tabId, changeInfo, tab) {
      var hosts_to_parse_html = settings.hosts_to_parse_html.split(',').join("|");
      var re = new RegExp(hosts_to_parse_html, "i");
      if (tab.url.match(re) != null) {
        browser.tabs.executeScript(tabId, {
          file: "/parseHtmlForVideo.js"
        });
      }
    }
  });
}

browser.tabs.onUpdated.addListener(callPageToParseForVideos);
browser.runtime.onMessage.addListener(messageRecieved);
