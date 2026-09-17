/* =====================================================
   NOVA NAVIGATION
===================================================== */

function goTo(id) {

    const section = document.getElementById(id);

    if (!section) {
        console.error("NOVA: Section not found:", id);
        return;
    }

    section.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


/* =====================================================
   ENTER NOVA
   ONLY SCROLLS TO NOVA EXPERIENCE
===================================================== */

function enterNova() {

    const experience = document.getElementById("experience");

    if (!experience) {
        console.error("NOVA: #experience section not found.");
        return;
    }

    experience.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


/* =====================================================
   NOVA REAL AI CHAT
===================================================== */

let currentNovaMode = "TALK";

let novaConversation = [];


/* =====================================================
   OPEN NOVA CHAT
===================================================== */

function openNovaChat(mode = "TALK") {

    currentNovaMode = mode;

    /* Remove old chat if already open */

    const oldChat = document.getElementById("novaChat");

    if (oldChat) {
        oldChat.remove();
    }


    /* Mode greetings */

    const greetings = {

        THINK:
            "Tell me what you're trying to figure out. We'll think through it together.",

        LEARN:
            "What would you like to learn? I'll explain it step by step.",

        CREATE:
            "Let's create something amazing. Tell me your idea.",

        BUILD:
            "Let's build it. Tell me what you're trying to make.",

        TALK:
            "I'm here. You don't need a perfect question. Just talk to me."

    };


    /* Create chat */

    const chat = document.createElement("div");

    chat.id = "novaChat";


    chat.innerHTML = `

        <div class="chat-window">

            <div class="chat-header">

                <div class="chat-title">

                    <span class="nova-status"></span>

                    <strong>✦ NOVA</strong>

                    <small id="novaMode">
                        ${mode} MODE
                    </small>

                </div>


                <button
                    class="close-chat"
                    onclick="closeNovaChat()"
                >
                    ✕
                </button>

            </div>


            <div
                class="messages"
                id="novaMessages"
            >

                <div class="nova-message">

                    ${greetings[mode]}

                </div>

            </div>


            <div
                id="novaTyping"
                class="nova-message"
                style="
                    display:none;
                    margin:10px 20px;
                "
            >

                ✦ NOVA is thinking...

            </div>


            <div class="chat-input">

                <input
                    id="novaInput"
                    type="text"
                    placeholder="Message NOVA..."
                    autocomplete="off"
                >


                <button
                    id="novaSendButton"
                    onclick="sendNovaMessage()"
                >
                    ➤
                </button>

            </div>

        </div>

    `;


    document.body.appendChild(chat);


    /* Focus input */

    const input =
        document.getElementById("novaInput");


    if (input) {

        input.focus();


        /* Enter key */

        input.addEventListener(
            "keydown",
            function(event) {

                if (
                    event.key === "Enter" &&
                    !event.shiftKey
                ) {

                    event.preventDefault();

                    sendNovaMessage();

                }

            }
        );

    }

}


/* =====================================================
   SEND MESSAGE TO REAL NOVA AI
===================================================== */

async function sendNovaMessage() {

    const input =
        document.getElementById("novaInput");

    const messages =
        document.getElementById("novaMessages");

    const sendButton =
        document.getElementById("novaSendButton");

    const typing =
        document.getElementById("novaTyping");


    if (!input || !messages) {
        return;
    }


    const text =
        input.value.trim();


    if (!text) {
        return;
    }


    /* USER MESSAGE */

    addNovaMessage(
        text,
        "user"
    );


    input.value = "";

    input.disabled = true;

    if (sendButton) {
        sendButton.disabled = true;
    }

    if (typing) {
        typing.style.display = "block";
    }


    scrollNovaMessages();


    /* SAVE USER MESSAGE */

    novaConversation.push({

        role: "user",

        content: text

    });


    try {

        const response = await fetch(
            "http://localhost:3000/api/chat",
            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body: JSON.stringify({

                    mode:
                        currentNovaMode,

                    messages:
                        novaConversation

                })

            }
        );


        if (!response.ok) {

            throw new Error(
                "Server error: " +
                response.status
            );

        }


        const data =
            await response.json();


        if (!data.reply) {

            throw new Error(
                "NOVA did not return a response."
            );

        }


        /* SAVE NOVA RESPONSE */

        novaConversation.push({

            role: "assistant",

            content: data.reply

        });


        if (typing) {
            typing.style.display = "none";
        }


        /* SHOW NOVA RESPONSE */

        addNovaMessage(
            data.reply,
            "nova"
        );


    } catch (error) {

        console.error(
            "NOVA CONNECTION ERROR:",
            error
        );


        if (typing) {
            typing.style.display = "none";
        }


        addNovaMessage(

            "⚠️ I can't reach my AI brain right now. Please make sure the NOVA server is running.",

            "nova"

        );

    }


    input.disabled = false;


    if (sendButton) {
        sendButton.disabled = false;
    }


    input.focus();


    scrollNovaMessages();

}


/* =====================================================
   ADD CHAT MESSAGE
===================================================== */

function addNovaMessage(
    text,
    type
) {

    const messages =
        document.getElementById(
            "novaMessages"
        );


    if (!messages) {
        return;
    }


    const message =
        document.createElement("div");


    if (type === "user") {

        message.className =
            "user-message";

    } else {

        message.className =
            "nova-message";

    }


    message.textContent = text;


    messages.appendChild(
        message
    );

}


/* =====================================================
   CHAT SCROLL
===================================================== */

function scrollNovaMessages() {

    const messages =
        document.getElementById(
            "novaMessages"
        );


    if (!messages) {
        return;
    }


    messages.scrollTop =
        messages.scrollHeight;

}


/* =====================================================
   CLOSE NOVA CHAT
===================================================== */

function closeNovaChat() {

    const chat =
        document.getElementById(
            "novaChat"
        );


    if (chat) {

        chat.remove();

    }


    novaConversation = [];

}


/* =====================================================
   SHARE SOMETHING
===================================================== */

function saveThought() {

    const input =
        document.getElementById(
            "shareText"
        );

    const response =
        document.getElementById(
            "shareResponse"
        );


    if (!input || !response) {
        return;
    }


    const text =
        input.value.trim();


    if (!text) {

        response.textContent =
            "You can write anything here — even just one sentence.";

        return;

    }


    response.textContent =
        "✦ Thank you for sharing that. Your words matter.";

}


/* =====================================================
   STAR CATCH GAME
===================================================== */

let starScore = 0;


function startStarGame() {

    starScore = 0;


    const score =
        document.getElementById(
            "starScore"
        );


    const game =
        document.getElementById(
            "starGame"
        );


    if (score) {
        score.textContent =
            starScore;
    }


    if (game) {
        game.style.display =
            "block";
    }

}


function catchStar() {

    starScore++;


    const score =
        document.getElementById(
            "starScore"
        );


    if (score) {

        score.textContent =
            starScore;

    }


    const button =
        document.getElementById(
            "starButton"
        );


    if (button) {

        button.style.transform =
            `translate(
                ${Math.random() * 100 - 50}px,
                ${Math.random() * 80 - 40}px
            )`;

    }

}


/* =====================================================
   MEMORY SPARK
===================================================== */

let memoryAnswer = "";


function startMemoryGame() {

    const sequence =
        Math.floor(
            1000 +
            Math.random() * 9000
        ).toString();


    memoryAnswer =
        sequence;


    const display =
        document.getElementById(
            "memorySequence"
        );


    const game =
        document.getElementById(
            "memoryGame"
        );


    const input =
        document.getElementById(
            "memoryInput"
        );


    if (display) {

        display.textContent =
            "Remember: " +
            sequence;

    }


    if (game) {

        game.style.display =
            "block";

    }


    if (input) {

        input.value = "";

    }


    setTimeout(
        function() {

            if (display) {

                display.textContent =
                    "The sequence disappeared ✦";

            }

        },
        2500
    );

}


function checkMemory() {

    const input =
        document.getElementById(
            "memoryInput"
        );

    const display =
        document.getElementById(
            "memorySequence"
        );


    if (!input || !display) {
        return;
    }


    const answer =
        input.value.trim();


    if (answer === memoryAnswer) {

        display.textContent =
            "✦ You remembered it!";

    } else {

        display.textContent =
            "Not quite — try again!";

    }

}


/* =====================================================
   GALAXY BREATH
===================================================== */

function startGalaxy() {

    const game =
        document.getElementById(
            "galaxyGame"
        );

    const text =
        document.getElementById(
            "breathText"
        );


    if (!game || !text) {
        return;
    }


    game.style.display =
        "block";


    text.textContent =
        "Breathe in...";


    setTimeout(
        function() {

            text.textContent =
                "Hold...";

        },
        3500
    );


    setTimeout(
        function() {

            text.textContent =
                "Breathe out...";

        },
        5500
    );


    setTimeout(
        function() {

            text.textContent =
                "✦ You made it through.";

        },
        9000
    );

}


/* =====================================================
   NOVA SYSTEM CHECK
===================================================== */

console.log(
    "✦ NOVA SYSTEM ONLINE"
);

console.log(
    "enterNova:",
    typeof enterNova
);

console.log(
    "openNovaChat:",
    typeof openNovaChat
);