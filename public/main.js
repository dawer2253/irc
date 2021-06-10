const client = {
    name: "",
    color: (Math.round(0xffffff * Math.random())).toString(16)
}
var lastMessage = -1;
let bar = undefined;

function init() {
    client.name = prompt("Podaj imie")
    document.getElementById("messageInput").addEventListener("keyup", (e) => {
        if (e.keyCode == 13) sendMessage();
    })
    bar = new SimpleBar(document.getElementById('chat'), { autoHide: true });
    getMessages()
}

async function getMessages() {
    const res = await fetch(`/chat?last=${lastMessage}`);
    if (res.status == 200) {
        const data = await res.json();
        data.forEach(m => {
            generateMessage(m.message)
        })
        console.log(data.length)
        lastMessage = data[data.length - 1].id
    }
    getMessages()
}

function generateMessage(msg) {
    let d = document.createElement("div")
    d.classList.add("message")
    let sp1 = document.createElement("span")
    sp1.innerText = new Date().toLocaleTimeString().substr(0, 5)
    let sp2 = document.createElement("span")
    sp2.innerText = msg.client.name
    sp2.style.color = `#${msg.client.color}`
    let sp3 = document.createElement("span")
    sp3.innerText = msg.message
    $(sp3).emoticonize()
    d.appendChild(sp1)
    d.appendChild(sp2)
    d.appendChild(sp3)
    const cont = bar.getContentElement();
    cont.appendChild(d)
    const scroll = bar.getScrollElement();
    scroll.scrollTop = scroll.scrollHeight
}

function sendMessage() {
    const msg = document.getElementById("messageInput").value
    document.getElementById("messageInput").value = ""
    if (msg != "") {
        if (msg[0] == "/") {
            const cmd = msg.split(" ")
            switch (cmd[0]) {
                case "/color":
                    client.color = (Math.round(0xffffff * Math.random())).toString(16);
                    let d = document.createElement("div")
                    d.innerText = "Zmieniono kolor"
                    bar.getContentElement().appendChild(d)
                    break;
                case "/nick":
                    let msg = ""
                    if (cmd[1] != undefined) {
                        client.name = cmd[1]
                        msg = "Zmieniono nick na " + cmd[1]
                    } else {
                        msg = "Nie podano nicku"
                    }
                    let d1 = document.createElement("div")
                    d1.innerText = msg
                    bar.getContentElement().appendChild(d1)
                    break;
                case "/help":
                    let d2 = document.createElement("div")
                    d2.innerText = "Komendy:\n/color kolor\n/nick nazwa\n/help"
                    bar.getContentElement().appendChild(d2)
                    break;
                case "/quit":
                    window.location = "/"
            }
        } else {
            fetch("/chat", {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({ client: client, message: msg })
            })
        }
    }
}

window.onload = init