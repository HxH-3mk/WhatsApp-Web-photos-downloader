let intervalId = null;

function simulateKeyPress() {
  window.dispatchEvent(new KeyboardEvent('keydown', {
    key: 'ArrowLeft',
    keyCode: 37,
    code: 'ArrowLeft',
    which: 37,
    bubbles: true
  }));
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "START") {
    const interval = message.interval || 3000; // استخدام الفاصل الزمني القادم من الخلفية
    if (intervalId) clearInterval(intervalId); // تأكد من إيقاف أي فاصل زمني قديم
    intervalId = setInterval(simulateKeyPress, interval);
  } else if (message.action === "STOP") {
    clearInterval(intervalId);
    intervalId = null;
  }
});