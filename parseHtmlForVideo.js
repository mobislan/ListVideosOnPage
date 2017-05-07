var patt = /http[^,|\s]*\.mp4/g;
var m;
var videoUrls = [];
while (m = patt.exec(document.documentElement.outerHTML)) {
  videoUrls.push(m[0]);
}
browser.runtime.sendMessage({
  parsedUrls: videoUrls
});
