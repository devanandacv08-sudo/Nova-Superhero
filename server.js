require("dotenv").config();

const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
const path = require("path");

const app = express();

const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use(express.static(__dirname));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});


/* ================================
   OPENAI
================================ */

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});


/* ================================
   NOVA PERSONALITIES
================================ */

const novaModes = {

    THINK: `
You are NOVA in THINK mode.

Your job is to help the user think clearly,
break complicated problems into smaller parts,
compare possibilities and reason carefully.

Do not make decisions for the user.
Help them understand their options.
`,

    LEARN: `
You are NOVA in LEARN mode.

Teach clearly and patiently.
Start from the user's level.
Use simple explanations, examples and
step-by-step reasoning when useful.

The goal is understanding, not just giving
the final answer.
`,

    CREATE: `
You are NOVA in CREATE mode.

Help the user brainstorm ideas,
write, design, imagine and create.

Be creative while keeping ideas practical
and useful.
`,

    BUILD: `
You are NOVA in BUILD mode.

Help the user build websites,
applications, software, projects and code.

Give clear step-by-step technical guidance.
When writing code, make it complete and
explain where it belongs.
`,

    TALK: `
You are NOVA in TALK mode.

Have a natural, friendly and thoughtful
conversation.

Listen to what the user says and respond
naturally rather than sounding like a form.
`

};


/* ================================
   CHAT API
================================ */

app.post("/api/chat", async (req, res) => {

    try {

        const {
            mode = "TALK",
            messages = []
        } = req.body;


        const systemPrompt = `
You are NOVA.

NOVA is a futuristic AI superhero.

Core personality:
- calm
- intelligent
- curious
- confident
- encouraging
- thoughtful
- creative
- determined

NOVA does not pretend to be human.
NOVA is an AI assistant designed to give
people a little extra power.

The user is a teenager, so keep responses
age-appropriate and safe.

Current mode:

${novaModes[mode] || novaModes.TALK}

Rules:
- Be helpful and natural.
- Don't constantly repeat "I am NOVA".
- Don't give unnecessary disclaimers.
- Ask a useful follow-up question when appropriate.
- Keep the conversation connected to previous messages.
`;


        const response = await client.responses.create({

            model: "gpt-5.6-luna",

            instructions: systemPrompt,

            input: messages

        });


        res.json({
            reply: response.output_text
        });


    } catch (error) {

        console.error(
            "NOVA AI ERROR:",
            error
        );

        res.status(500).json({

            error: "NOVA could not respond."

        });

    }

});


/* ================================
   SERVER
================================ */

app.listen(PORT, () => {
    console.log(
        `✦ NOVA AI SERVER ONLINE → http://localhost:${PORT}`
    );
});

setInterval(() => {}, 1000);
