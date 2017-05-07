document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);


function saveOptions(e) {
  e.preventDefault();
  browser.storage.local.set({
    settings: {
      host_to_intercept: document.querySelector("#host_to_intercept").value,
      hosts_to_show_list: document.querySelector("#hosts_to_show_list").value,
      hosts_to_parse_html: document.querySelector("#hosts_to_parse_html").value
    }
  });
}

function restoreOptions() {

  function setCurrentChoice(result) {
    document.querySelector("#host_to_intercept").value = result.settings.host_to_intercept || "oloadcdn.net";
    document.querySelector("#hosts_to_show_list").value = result.settings.hosts_to_show_list || "dailymotion.com,openload.co";
    document.querySelector("#hosts_to_parse_html").value = result.settings.hosts_to_parse_html || "dailymotion.com";

  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  var getting = browser.storage.local.get("settings");
  getting.then(setCurrentChoice, onError);
}
