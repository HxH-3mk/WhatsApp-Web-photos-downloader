let isActive = false;
let currentInterval = 3000;

// تحميل الإعدادات المحفوظة عند بدء التشغيل
chrome.storage.sync.get(['isActive', 'interval'], (result) => {
  if (result.isActive !== undefined) {
    isActive = result.isActive;
  }
  if (result.interval !== undefined) {
    currentInterval = result.interval;
  }
  updateIcon();
});

function updateIcon() {
  const iconPath = isActive ? "active-icon.png" : "icon16.png";
  chrome.action.setIcon({ path: iconPath });
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === "START") {
    isActive = true;
    currentInterval = message.interval || 3000;
    updateIcon();
    
    // حفظ الإعدادات في التخزين
    chrome.storage.sync.set({ 
      interval: currentInterval,
      isActive: true 
    });

    const [tab] = await chrome.tabs.query({ 
      active: true, 
      currentWindow: true 
    });
    
    if (tab && tab.id && !tab.url.startsWith('chrome://')) {
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['contentScript.js']
        });
        
        chrome.tabs.sendMessage(
          tab.id, 
          { action: "START", interval: currentInterval },
          (response) => {
            if (chrome.runtime.lastError) {
              console.error('Error sending message:', chrome.runtime.lastError);
            }
          }
        );
      } catch (error) {
        console.error('Error injecting script:', error);
      }
    }
    
  } else if (message.action === "STOP") {
    isActive = false;
    updateIcon();
    chrome.storage.sync.set({ isActive: false });

    const [tab] = await chrome.tabs.query({ 
      active: true, 
      currentWindow: true 
    });
    
    if (tab && tab.id && !tab.url.startsWith('chrome://')) {
      chrome.tabs.sendMessage(
        tab.id, 
        { action: "STOP" },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error('Error sending message:', chrome.runtime.lastError);
          }
        }
      );
    }
  }
});