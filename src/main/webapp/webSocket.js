var socket;
var myUsername = "";

function enterChat() {
    var user = document.getElementById("username").value.trim();
    var room = document.getElementById("room").value.trim();

    if (!user || !room) { alert("Inserisci nome e stanza!"); return; }

    myUsername = user; // Salviamo il nome per riconoscere i nostri messaggi

    // COSTRUZIONE URL DINAMICO
    var protocol = window.location.protocol === "https:" ? "wss://" : "ws://";
    var host = window.location.host;
    var path = window.location.pathname.substring(0, window.location.pathname.indexOf("/", 1)); // /lupus

    // URL Finale: ws://localhost:8080/lupus/chat/villaggio/nicola
    var wsUrl = protocol + host + path + "/chat/" + room + "/" + user;
    console.log(wsUrl)

    socket = new WebSocket(wsUrl);

    socket.onopen = function() {
        // Nascondi login, mostra chat
        document.getElementById("login-screen").style.display = "none";
        document.getElementById("chat-screen").style.display = "flex";
        document.getElementById("room-display").textContent = "Stanza: " + room;
    };

    socket.onmessage = function(event) {
        const msg = event.data.split(":");
        var sender = msg[0];
        var content = msg[1];
        addMessageToScreen(sender, content);
    };

    socket.onclose = function() {
        alert("Connessione persa!");
        location.reload();
    };
}

function sendMessage() {
    var input = document.getElementById("msg-input");
    var msg = input.value;
    if (msg && socket.readyState === WebSocket.OPEN) {
        socket.send(msg); // Inviamo solo il testo, il server sa chi siamo
        input.value = "";
    }
}

function leaveChat() {
    if(socket) socket.close();
    location.reload();
}

function addMessageToScreen(sender, message) {
    var chatBox = document.getElementById("chat-box");
    var div = document.createElement("div");
    div.classList.add("message");

    if (sender === "Sistema") {
        div.classList.add("system-msg");
        div.innerHTML = "<i>" + message + "</i>";
    } else if (sender === myUsername) {
        div.classList.add("my-msg");
        div.textContent = message; // Niente nome per i miei messaggi
    } else {
        div.classList.add("other-msg");
        div.innerHTML = "<b>" + sender + "</b><br>" + message;
    }

    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll in basso
}