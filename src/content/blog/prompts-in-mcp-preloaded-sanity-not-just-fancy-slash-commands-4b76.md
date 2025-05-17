---
title: "Prompts in MCP: Preloaded Sanity, Not Just Fancy Slash Commands"
slug: "prompts-in-mcp-preloaded-sanity-not-just-fancy-slash-commands-4b76"
pubDate: 2025-05-06T12:52:30.608Z
description: "TL;DR:  MCP Prompts aren’t just templates. They’re server-defined, user-discoverable scripts designed..."
cover_image: "/img/prompts-in-mcp-preloaded-sanity-not-just-fancy-slash-commands-4b76/cover-https-3a-2f-2fdev-to-uploads-s3-amazonaws-com-2fuploads-2farticles-2fahpy4jxyfantv2dauasv.png"
tags: ["ai", "mcp", "prompts", "llm"]
---

**TL;DR:**

MCP Prompts aren’t just templates. They’re server-defined, user-discoverable scripts designed to prevent your AI from doing exactly what it would do if left to its own devices: improvise badly. Prompts let you say, *"Hey AI, do this very specific thing. And please don’t freestyle it into a motivational poem or a crime."*



---



## 🎭 What *Are* Prompts (and Why Should You Care)?



Prompts in MCP are like scene instructions for your AI. Without them, the model shows up like an unpaid improv actor—confident, enthusiastic, and terrifyingly unsupervised.



With prompts:



* You say: "Summarize this changelog."

* It doesn’t: "Rephrase it as a love letter from a tired developer to their codebase."

* You say: "Generate a git commit."

* It doesn’t: "Write a haiku about file deletions."



![Prompt Delivery Console](/img/prompts-in-mcp-preloaded-sanity-not-just-fancy-slash-commands-4b76/dg9esoe4soi44sabctvb.png)



---



## 🧩 Anatomy of a Prompt (or, How to Stop Guessing)



```json

{
  "name": "generate-git-message",
  "description": "Write a concise Git commit message",
  "arguments": [
    {
      "name": "changes",
      "required": true
    }
  ]
}

```



No guessing. No passive-aggressive comments from the model. Just a prompt, an argument, and an obedient response like:



> `"Fix off-by-one error in loop. Stop breaking things, Jerry."`



Okay, maybe still passive-aggressive. But helpful.



---



## 🔎 Prompt Discovery (But Not By the AI, Calm Down)



Prompts aren’t discovered by the LLM. Let’s squash that fantasy right now.



Here’s how it really works:



* The **client** calls `prompts/list` from the MCP server.

* It decides what prompts to surface in the UI (like slash commands, menus, or keyboard shortcuts).

* When a user selects one, the client fetches it via `prompts/get`, fills in the arguments, and passes it along to the AI as pre-structured messages.



The AI doesn’t *decide* which prompts to use. It doesn’t go browsing. It doesn’t have agency. It gets what it’s given—like a helpful chatbot on a tight leash.



The session is maintained by the **client**, not the LLM. The LLM doesn’t even know what a session is unless you tell it. It just lives in the bubble the client builds around it, like a very powerful goldfish.



---



## 📦 Context Injection (a.k.a. Prompts With Homework)



Let’s say you want your AI to analyze logs **and** review a code file. Don’t just paste it all into the text field like a digital junk drawer. Use a structured prompt:



```json

{
  "role": "user",
  "content": {
    "type": "resource",
    "resource": {
      "uri": "file:///main.py",
      "text": "...",
      "mimeType": "text/x-python"
    }
  }
}
```



Then follow up with:



> “Now compare that to this server log that looks like it’s been cursed.”



Your AI will know what’s going on, and for once, it won’t hallucinate that your log is a philosophical riddle.




![Context Injection Station](/img/prompts-in-mcp-preloaded-sanity-not-just-fancy-slash-commands-4b76/6q77pn86w75wr17zedqh.png)


---



## 🤹 Multi-Turn Prompts: When You Want a Conversation, Not a Monologue



A basic prompt says: *“Write a commit message.”*



A **multi-turn** prompt says:



> "What's the bug?"

> "What have you tried?"

> "How many times have you cried about it?"



These interactions guide the user and the model like a therapist gently walking you back from the edge of another systemd rant.



![Multi-Turn Workflow Theater](/img/prompts-in-mcp-preloaded-sanity-not-just-fancy-slash-commands-4b76/deft9qw7rv8i5mpgx5pj.png)

---



## ⚠️ Prompt Security: Protect Users from Themselves (and Your LLM)



Let’s be honest, if a user can pass custom input to a prompt, they will find a way to:



* Inject something malicious

* Break the formatting

* Ask the AI if it's "feeling okay today" and then have a 2,000-token spiral about the nature of free will



**So sanitize. Validate. Rate-limit.**

Just because it's a prompt doesn't mean it's safe. This isn't a spa day—it’s a potential shell command disguised as a “file analysis request.”



![Prompt Security Briefing](/img/prompts-in-mcp-preloaded-sanity-not-just-fancy-slash-commands-4b76/vlzxw6uluzkypkoje9om.png)

---



## 💥 Real Examples (for the Delightfully Deranged)



### 🔹 `debug-error`



```json

{
  "name": "debug-error",
  "arguments": [{ "name": "error", "required": true }]
}

```



> Input: `"Cannot read property 'length' of undefined"`

> Output: `"Ah, JavaScript. Undefined chaos again. Let’s walk through the fire together."`



---



### 🔹 `generate-apology-email`



```json

{
  "name": "generate-apology-email",
  "arguments": [{ "name": "incident", "required": true }]
}

```



> Input: `"Deployed broken code to production on Friday at 4:55pm"`

> Output:

> `"Dear team, I have made choices. None of them good. Here's how I plan to fix the chaos I unleashed..."`



---



### 🔹 `name-my-startup`



```json

{

  "name": "name-my-startup",
  "arguments": [{ "name": "idea", "required": true }]
}

```



> Input: `"AI-powered cat feeder with mood tracking"`

> Output: `"Purrlytics™ — Data-Driven Feline Satisfaction" (You're welcome.)`



---



## ✅ Conclusion: Prompts Keep You Honest



MCP Prompts are the difference between:



* AI that works with context, structure, and sanity

* And AI that responds to "summarize this changelog" with "Here’s a poem about endings"



They let you scale functionality, standardize interactions, and—most importantly—prevent your AI from becoming a dangerously confident improv artist with API keys.



So next time someone says “we don’t need structured prompts,” just remember: that’s how you end up with an AI that flirts with your infrastructure monitor.





![Dumb Prompt Graveyard](/img/prompts-in-mcp-preloaded-sanity-not-just-fancy-slash-commands-4b76/ad4o2xeu11ukuqekq1qs.png)