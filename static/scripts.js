const connectBtn = document.getElementById('connectBtn');
  const sendBtn = document.getElementById('sendBtn');
  const nameInput = document.getElementById('username');
  const msgInput = document.getElementById('msg');
  const chat = document.getElementById('chat');

  let ws = null;
  let localName = '';

  function formatTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function scrollToBottom(){
    chat.scrollTop = chat.scrollHeight;
  }

  function addSystem(text){
    const el = document.createElement('div');
    el.className = 'system';
    el.textContent = `[system] ${text}`;
    chat.appendChild(el);
    scrollToBottom();
  }

  function addMessageBubble({user, text, time}, isMe){
    const row = document.createElement('div');
    row.className = 'msg-row' + (isMe ? ' me' : '');

    const bubble = document.createElement('div');
    bubble.className = 'bubble ' + (isMe ? 'me' : 'other');

    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.textContent = user + (isMe ? ' (you)' : '');

    const body = document.createElement('div');
    body.className = 'text';
    body.textContent = text;

    const ts = document.createElement('span');
    ts.className = 'ts';
    ts.textContent = time;

    bubble.appendChild(meta);
    bubble.appendChild(body);
    bubble.appendChild(ts);

    row.appendChild(bubble);
    chat.appendChild(row);
    scrollToBottom();
  }

  connectBtn.onclick = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.close();
      return;
    }

    localName = nameInput.value.trim() || 'guest';
    // use same origin (works when served by FastAPI). If file://, adjust host.
    const uri = (location.protocol === 'https:' ? 'wss://' : 'ws://') + location.host + '/ws/chat';
    ws = new WebSocket(uri);

    ws.addEventListener('open', () => {
      nameInput.disabled = true;
      connectBtn.textContent = 'Disconnect';
      msgInput.disabled = false;
      sendBtn.disabled = false;
      addSystem('Connected as ' + localName);
    });

    ws.addEventListener('message', (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        if (msg.type === 'system') {
          addSystem(msg.text);
          return;
        }
        if (msg.type === 'message') {
          const isMe = msg.user === localName;
          addMessageBubble({ user: msg.user, text: msg.text, time: formatTime() }, isMe);
        }
      } catch (e) {
        addSystem('Non-json message: ' + ev.data);
      }
    });

    ws.addEventListener('close', () => {
      nameInput.disabled = false;
      connectBtn.textContent = 'Connect';
      msgInput.disabled = true;
      sendBtn.disabled = true;
      addSystem('Disconnected');
      ws = null;
    });

    ws.addEventListener('error', () => {
      addSystem('Connection error');
    });
  };

  function sendMessage(){
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    const text = msgInput.value.trim();
    if (!text) return;
    const payload = { type: 'message', user: localName, text };
    ws.send(JSON.stringify(payload));
    msgInput.value = '';
  }

  sendBtn.onclick = sendMessage;

  // Enter to send
  msgInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
  nameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') connectBtn.click();
  });