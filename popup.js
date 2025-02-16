document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const intervalInput = document.getElementById('intervalInput');
  
    // إرسال رسالة إلى الخلفية عند النقر على الزر "Start"
    startBtn.addEventListener('click', () => {
      const interval = parseInt(intervalInput.value, 10) * 1000; // تحويل الثواني إلى ميلي ثانية
      if (!isNaN(interval) && interval > 0) {
        chrome.runtime.sendMessage({ action: "START", interval });
      } else {
        alert("Please enter a valid interval (minimum 1 second).");
      }
    });
  
    // إرسال رسالة إلى الخلفية عند النقر على الزر "Stop"
    stopBtn.addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: "STOP" });
    });
  
    // تحديث قيمة الفاصل الزمني الافتراضية إذا كانت متاحة في التخزين المحلي
    chrome.storage.sync.get(['interval'], (data) => {
      if (data.interval) {
        intervalInput.value = data.interval / 1000; // تحويل الميلي ثانية إلى ثواني
      }
    });
  });