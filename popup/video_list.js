function videoUrlsRecieved(message) {
  var videoUrls = message.videoUrls;
  var mydiv = document.getElementById("videoDiv");
  for (var i = 0; i < videoUrls.length; i++) {
    var aTag = document.createElement('a');
    aTag.innerHTML = videoUrls[i];
    aTag.setAttribute('href', "#");
    mydiv.appendChild(aTag);
    mydiv.appendChild(document.createElement("br"));
    mydiv.appendChild(document.createElement("br"));

    aTag.onclick = function(elmnt) {
      browser.tabs.create({
        url: elmnt.target.innerHTML,
        active: true
      })
    }
  }
}

chrome.tabs.query({
    currentWindow: true,
    active: true
  },
  function(tabArray) {
    browser.runtime.sendMessage({
      geturls: true,
      tabId: tabArray[0].id
    }).then(videoUrlsRecieved);
  }
)
