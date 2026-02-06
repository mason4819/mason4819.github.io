const username = localStorage.getItem("chatUser") || "Anonymous";
const avatar = localStorage.getItem("chatAvatar") || "https://via.placeholder.com/40";
const token = "REPLACE_WITH_YOUR_LONG_RANDOM_STRING";
const wsUrl = `wss://chat.mason4819.workers.dev/?token=${encodeURIComponent(token)}`;

const chatWindow = document.getElementById("chat");
const msgInput = document.getElementById("msg");
const sendBtn = document.getElementById("send");

const ws = new WebSocket(wsUrl);

ws.onopen = () => console.log("WebSocket connected");
ws.onerror = () => alert("WebSocket error. Check Worker domain and token.");
ws.onclose = (evt) => console.log("WebSocket closed:", evt.code, evt.reason);

ws.onmessage = (evt) => {
  const data = JSON.parse(evt.data);
  const isSelf = data.user === username;
  const msgEl = document.createElement("div");
  msgEl.className = "message" + (isSelf ? " self" : "");
  msgEl.innerHTML = `<img class="avatar" src="${data.avatar}"><div class="content"><strong>${escapeHtml(data.user)}:</strong> ${escapeHtml(data.text)}</div>`;
  chatWindow.appendChild(msgEl);
  chatWindow.scrollTop = chatWindow.scrollHeight;
};

function sendMessage() {
  const text = msgInput.value.trim();
  if (!text) return;
  ws.send(JSON.stringify({ user: username, text: text, avatar: avatar }));
  msgInput.value = "";
}

msgInput.addEventListener("keydown", (e) => { if (e.key === "Enter") sendMessage(); });
sendBtn.addEventListener("click", sendMessage);

function escapeHtml(str) {
  return str.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}