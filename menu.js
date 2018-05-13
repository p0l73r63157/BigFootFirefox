
var urlMap = {};

browser.menus.onClicked.addListener(onClickHandler);

// Set up context menu tree at install time.
(function() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'db.json');
  xhr.onload = function() {
      if (xhr.status === 200) {
          var data = JSON.parse(xhr.responseText);
          if (data.tabs) {
            for (var i = 0; i < data.tabs.length; i++) {
              data.tabs[i];
              browser.menus.create(data.tabs[i]);
            }
          }
          if (data.items) {
            for (var id in data.items) {
              browser.menus.create(data.items[id].definition);
              urlMap[id] = data.items[id].link;
            }
          }
      }
      else {
          console.error('Request failed.  Returned status of ' + xhr.status);
      }
  };
  xhr.send();

})();



// The onClicked callback function.
function onClickHandler(info, tab) {
  switch (true) {
    case info.menuItemId === 'show-all': 
      for (var i in urlMap) {

        var url = urlMap[i].replace(new RegExp('{url}', 'gi'), getHostName(tab.url));
        console.log(url);

        browser.tabs.create({url: url});
      }
      break;
    case !!urlMap[info.menuItemId]:
      var target = info.menuItemId === 'tineye' ? encodeURIComponent(info.srcUrl) : info.selectionText ? info.selectionText : getHostName(tab.url)  
      var url = urlMap[info.menuItemId].replace(new RegExp('{url}', 'gi'), target);
      console.log(url);

      browser.tabs.create({url: url});
      break;      
    default:
      break;
  }
};


function getHostName(url) {
    var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
    if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
      return match[2];
    } else {
        return null;
    }
}