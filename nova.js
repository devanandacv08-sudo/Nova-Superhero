const powerCards = document.querySelectorAll(".power-card");

const modes = {
    "THINK": "Think Mode",
    "LEARN": "Learn Mode",
    "CREATE": "Create Mode",
    "BUILD": "Build Mode",
    "TALK TO NOVA": "NOVA Chat"
};

powerCards.forEach(function(card) {

    card.addEventListener("click", function() {

        const title =
            card.querySelector("strong").textContent.trim();

        openNovaChat(modes[title]);

    });

});


function openNovaChat(mode) {

    const existingChat =
        document.getElementById("novaChat");

    if (existingChat) {
        existingChat.remove();
    }


    const chat = document.createElement("div");

    chat.id = "novaChat";

    chat.innerHTML = `

        <div class="chat-window">

            <div class="chat-header">

                <div>

                    <strong>✦ NOVA</strong>

                    <span>${mode}</span>

                </div>

                <button id="closeChat">
                    ×
                </button>

            </div>


            <div class="messages" id="messages">

                <div class="nova-message">

                    ✦ NOVA ONLINE

                    <br><br>

                    I'm ready.

                    <br>

                    Tell me what you're working on.

                </div>

            </div>


            <div class="suggestions">

                <button>Help me understand something</button>

                <button>Give me an idea</button>

                <button>Help me solve a problem</button>

            </div>


            <div class="chat-input">

                <input
                    id="userInput"
                    type="text"
                    placeholder="Ask NOVA anything..."
                    autocomplete="off"
                >

                <button id="sendMessage">
                    ➤
                </button>

            </div>

        </div>

    `;


    document.body.appendChild(chat);


    document
        .getElementById("closeChat")
        .addEventListener("click", function() {

            chat.remove();

        });


    const input =
        document.getElementById("userInput");

    const send =
        document.getElementById("sendMessage");


    function sendUserMessage() {

        const text =
            input.value.trim();

        if (!text) return;


        addMessage(text, "user");

        input.value = "";


        setTimeout(function() {

            addMessage(
                "I'm connected to the NOVA interface. The AI engine will be connected next. ⚡",
                "nova"
            );

        }, 700);

    }


    send.addEventListener(
        "click",
        sendUserMessage
    );


    input.addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Enter") {

                sendUserMessage();

            }

        }
    );


    document
        .querySelectorAll(".suggestions button")
        .forEach(function(button) {

            button.addEventListener(
                "click",
                function() {

                    input.value =
                        button.textContent;

                    input.focus();

                }
            );

        });

}


function addMessage(text, type) {

    const messages =
        document.getElementById("messages");

    const message =
        document.createElement("div");


    message.className =
        type === "user"
            ? "user-message"
            : "nova-message";


    message.textContent = text;


    messages.appendChild(message);


    messages.scrollTop =
        messages.scrollHeight;

}