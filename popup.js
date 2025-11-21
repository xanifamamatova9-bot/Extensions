document.addEventListener("DOMContentLoaded", () => {
  loadSchedule();
});

function loadSchedule() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, "getSchedule", (response) => {

      // Agar hemisdan olinmasa
      if (!response || !response.ok) {
        const saved = localStorage.getItem("schedule");

        if (saved) {
          render(JSON.parse(saved), true);
        } else {
          document.getElementById("schedule").innerHTML =
            "<p style='color:red;'>❌ Hemisdan maʼlumot olinmadi va saqlangan jadval ham yo‘q!</p>";
        }
        return;
      }

      // Jadvalni saqlaymiz
      localStorage.setItem("schedule", JSON.stringify(response.data));

      render(response.data, false);
    });
  });
}

function render(data, fromCache) {
  let html = "";

  if (fromCache) {
    html += "<p style='color:#888;'>📦 Saqlangan jadval ko‘rsatildi</p>";
  } else {
    html += "<p style='color:#4CAF50;'>✅ Hemisdan yuklandi</p>";
  }

  data.forEach(day => {
    html += `
      <div class="day-box">
        <h3>${day.dayName} <span>${day.date}</span></h3>
        ${day.lessons.map(lesson => `
          <div class="lesson-card">
            <div class="lesson-name">${lesson.name}</div>

            <div class="lesson-meta">
              <span><b>Xona:</b> ${lesson.room}</span>
              <span><b>Turi:</b> ${lesson.type}</span>
              <span><b>O‘qituvchi:</b> ${lesson.teacher}</span>
            </div>

            <div class="lesson-time">⏰ ${lesson.time}</div>
          </div>
        `).join("")}
      </div>
    `;
  });

  document.getElementById("schedule").innerHTML = html;
}
