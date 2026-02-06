const chatWindow=document.getElementById("chat");
const msgInput=document.getElementById("msg");

const username=localStorage.getItem("chatUser")||"Anonymous";
const avatar=localStorage.getItem("chatAvatar")||"https://via.placeholder.com/40";
const token="token-89325789327509847658658763983937537457309759379676897-9379865937";

const wsUrl="wss://chat.mason4819.workers.dev/chat/main";
const ws=new WebSocket(wsUrl);
ws.onopen=()=>console.log("WebSocket connected");

ws.onmessage=evt=>{
  const data=JSON.parse(evt.data);
  const isSelf=data.user===username;
  const msgEl=document.createElement("div");
  msgEl.className="message"+(isSelf?" self":"");
  msgEl.innerHTML=`<img class="avatar" src="${data.avatar}"><div class="content">${data.user}: ${data.text}</div>`;
  chatWindow.appendChild(msgEl);
  chatWindow.scrollTop=chatWindow.scrollHeight;
};

function sendMessage(){
  const text=msgInput.value;
  if(!text) return;
  ws.send(JSON.stringify({
    user:username,
    text:text,
    avatar:avatar,
    time:new Date().toISOString(),
    token:token
  }));
  msgInput.value="";
}