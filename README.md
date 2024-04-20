## 创建右键菜单 

```js
const tldLocales = {
  'com.au': 'Australia',
  'com.br': 'Brazil',
  ...
}

chrome.runtime.onInstalled.addListener(async () => {
  for (let [tld, locale] of Object.entries(tldLocales)) {
    chrome.contextMenus.create({
      id: tld,
      title: locale,
      type: 'normal',
      contexts: ['selection'],
    });
  }
});
```

## 插入 移除css

```js
await chrome.scripting.insertCSS({
    files: ["focus-mode.css"],
    target: { tabId: tab.id },
  });
  await chrome.scripting.removeCSS({
    files: ["focus-mode.css"],
    target: { tabId: tab.id },
  });
```


## js打开options

```js
if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL('options.html'));
  }
```


## 创建通知

```js
 chrome.action.setBadgeText({ text: '' });
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'stay_hydrated.png',
    title: 'Time to Hydrate',
    message: "Everyday I'm Guzzlin'!",
    buttons: [{ title: 'Keep it Flowing.' }],
    priority: 0
  });
```


## 注册快捷键

manifest.json

```json
"commands": {
   "open-tab": {
     "suggested_key": {
       "default": "Ctrl+Shift+Z",
       "mac": "Command+Shift+Z"
     },
     "description": "Open developer.chrome.com"
   }
}
```

background.js

```js
chrome.commands.onCommand.addListener((command) => {
  if (command !== "open-tab") return;
  chrome.tabs.create({ url: "https://developer.chrome.com" });
});
```


## 内容脚本

dom
i18n
storage
runtime.connect()
runtime.getManifest()
runtime.getURL()
runtime.id
runtime.onConnect
runtime.onMessage
runtime.sendMessage()


动态注入

```js
chrome.scripting
  .registerContentScripts([{
    id: "session-script",
    js: ["content.js"],
    persistAcrossSessions: false,
    matches: ["*://example.com/*"],
    runAt: "document_start",
  }])
  .then(() => console.log("registration complete"))
  .catch((err) => console.warn("unexpected error", err))


  chrome.scripting
  .updateContentScripts([{
    id: "session-script",
    excludeMatches: ["*://admin.example.com/*"],
  }])
  .then(() => console.log("registration updated"));



  chrome.scripting
  .getRegisteredContentScripts()
  .then(scripts => console.log("registered content scripts", scripts));

  chrome.scripting
  .unregisterContentScripts({ ids: ["session-script"] })
  .then(() => console.log("un-registration complete"));


  chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content-script.js"]
  });
});



ffunction injectedFunction(color) {
  document.body.style.backgroundColor = color;
}

chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target : {tabId : tab.id},
    func : injectedFunction,
    args : [ "orange" ],
  });
});
```

## 消息传递

```js
const response = await chrome.runtime.sendMessage({greeting: "hello"});
  // do something with response here, not outside the function
  console.log(response);


const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
  const response = await chrome.tabs.sendMessage(tab.id, {greeting: "hello"});
  // do something with response here, not outside the function
  console.log(response);


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.greeting === "hello")
      sendResponse({farewell: "goodbye"});
  }
);
```


长链接

```js
var port = chrome.runtime.connect({name: "knockknock"});
port.postMessage({joke: "Knock knock"});
port.onMessage.addListener(function(msg) {
  if (msg.question === "Who's there?")
    port.postMessage({answer: "Madame"});
  else if (msg.question === "Madame who?")
    port.postMessage({answer: "Madame... Bovary"});
});


chrome.runtime.onConnect.addListener(function(port) {
  console.assert(port.name === "knockknock");
  port.onMessage.addListener(function(msg) {
    if (msg.joke === "Knock knock")
      port.postMessage({question: "Who's there?"});
    else if (msg.answer === "Madame")
      port.postMessage({question: "Madame who?"});
    else if (msg.answer === "Madame... Bovary")
      port.postMessage({question: "I don't get it."});
  });
});
```

## 常见事件
扩展 Service Worker 支持特定 API 中的事件。下面介绍了几种常见的错误。请注意，其中一些 API 需要权限才能使用，而其他 API 可能具有并非在所有版本的 Chrome 中都提供的事件、方法或属性。如需了解详情，请参阅链接的 API 文档，尤其是您要使用的事件、方法或属性。

chrome.action
当有用户与扩展程序的工具栏图标互动时触发，无论该操作是针对特定网页（标签页）还是整个扩展程序。
chrome.management
提供与安装、卸载、启用和停用扩展程序相关的事件。
chrome.notifications
提供与用户与扩展程序生成的系统通知互动相关的事件。
chrome.permissions
指示用户何时授予或撤消扩展程序权限。
chrome.runtime
提供与扩展程序生命周期相关的事件、扩展程序的其他部分发送的消息，以及可用扩展程序或 Chrome 更新的通知。
chrome.storage.onChanged
每当任何 StorageArea 对象被清除或某个键的值被更改或设置时触发。请注意，每个 StorageArea 实例都有自己的 onChanged 事件。
chrome.webNavigation
提供有关飞行中导航请求状态的信息。