var patt = /(\/\/|http)[^,|\s|>]*\.mp4/g;
var m;
var videoUrls = [];

var iframes = document.getElementsByTagName('iframe');
for (var i in iframes) {
  var iframeHtml = "";
  try {
    iframeHtml = iframes[i].contentWindow.document.body.innerHTML;
  } catch (e) {

  } 
  while (m = patt.exec(iframeHtml)) {
    videoUrls.push(_checkLeadingSlashes(m[0]));
  }
}

while (m = patt.exec(document.documentElement.outerHTML)) {
  videoUrls.push(_checkLeadingSlashes(m[0]));
}

function _checkLeadingSlashes(url){
  if (url.substring(0, 2) === '//') {
    return location.protocol + url;
  }
  return url;
}

browser.runtime.sendMessage({
  parsedUrls: videoUrls
});
