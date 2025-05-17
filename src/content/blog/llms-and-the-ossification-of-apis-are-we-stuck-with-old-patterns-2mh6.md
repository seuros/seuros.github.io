---
title: "LLMs and the Ossification of APIs: Are We Stuck with Prehistoric Patterns?"
slug: "llms-and-the-ossification-of-apis-are-we-stuck-with-old-patterns-2mh6"
pubDate: 2025-04-11T12:48:10.831Z
description: "When AI Coding Assistants Influence API Design in Ruby   The Ruby community has always..."
cover_image: "/img/llms-and-the-ossification-of-apis-are-we-stuck-with-old-patterns-2mh6/cover-https-3a-2f-2fdev-to-uploads-s3-amazonaws-com-2fuploads-2farticles-2f0aomnyzt67jidnvrg469.png"
tags: ["ruby", "api", "ai", "opensource"]
---

## When AI Coding Assistants Influence API Design in Ruby

The Ruby community has always valued elegant API design and idiomatic code. But recently, a new factor is subtly influencing how our APIs evolve: AI coding assistants. Tools like GitHub Copilot and ChatGPT have become our AI pair programmers, trained on millions of lines of existing Ruby code. They excel at recognizing and reproducing common coding patterns.

While this speeds up development, it also introduces an unintended side effect: API designs are becoming "fossilized" into their current form, as deviations from the norm are discouraged by the very tools meant to help us.

In this post, I'll explore how Large Language Models (LLMs) and AI code assistants can create inertia around API design. I focus on how these tools reinforce existing patterns, making any novel or unconventional API feel "wrong" or hard to reason about, even if it's technically correct.

The goal isn't to vilify AI helpers (they're incredibly useful! I argue with Grok and Claude on a daily basis) but to raise awareness of this subtle problem and encourage reflection in the Ruby community.

## The Rise of AI Pair Programmers in Ruby

AI-assisted development has quickly gone from novelty to normalcy. GitHub Copilot, ChatGPT, Claude and similar tools are now integrated into editors such as VSCode, Cursor, Zed, Windsurf, JetBrains and Notepad (with a subscription), offering autocomplete or even generating entire blocks of code.

These assistants are trained on vast repositories of open-source code, which means they've learned the dominant patterns and idioms of languages. For Ruby, they know Ruby on Rails conventions, popular gem APIs, style guide preferences, and so on.

This has obvious benefits: they can produce code that looks right at a glance. For standard tasks, the AI's output often adheres to community style and best practices because it's copying from what most developers do. It's like having an encyclopedic junior developer who always codes in a textbook style.

However, this strength is also a weakness. LLMs are inherently conservative in that they regurgitate patterns from training data. When faced with something new—be it a cutting-edge library, a new framework, or an unconventional API design—these tools struggle.

I recently tested [Replit](https://replit.com/~) to see if it supports a UI framework I like, [Flowbite](https://flowbite.com). The LLM acknowledged it was familiar with Flowbite, but then simply aliased [shadcn](https://ui.shadcn.com) in the import statement and proceeded with its previous patterns.

AI code assistants are superb followers of convention. But what happens when we need to break convention or update it? This is where API ossification comes in. Developers might unwittingly start treating the AI's suggestions as the path of least resistance, sticking to familiar patterns to keep the AI (and by extension themselves) comfortable.

## API Ossification: When Patterns Become a Prison

In software, "ossification" refers to something becoming rigid and resistant to change. For APIs, ossification means the design and usage patterns harden such that breaking away from them is very difficult. 

Historically, API ossification is a concern in long-lived protocols (like TCP/IP) where entrenched assumptions make evolution difficult. Now we're seeing a form of it in application-level code, reinforced by AI training.

If we only ever accept what the AI suggests, we risk reinforcing designs that may not be optimal, just common. Our APIs stop evolving; they simply repeat the past. How does this manifest in day-to-day coding?

First, deviations feel "incorrect." When we encounter or attempt a different approach that the AI isn't expecting, it often won't autocomplete it nicely. This lack of affirmation can make a developer second-guess the approach. We've grown used to that little Copilot gray text completing our thoughts. If it doesn't appear (or shows something off-base), we might assume we're doing something wrong. The result? We retreat to a pattern that Copilot recognizes, because its suggestions give a subconscious nod of approval.

Second, tooling feedback reinforces the norm. It's not just the AI autocompletion. Our linters, formatters, and other static analysis tools are built with certain expectations. They might flag code that, while valid, is unusual. When our tools constantly underline something in yellow or throw warnings, it wears on our confidence in that code.

Third, perceived correctness can override actual correctness. We humans are highly visual and context-driven. If code looks like what we're used to, we instinctively trust it more. Conversely, code that looks "odd" is suspect. AI suggestions amplify this—if the AI writes a snippet that looks polished, we assume it's correct. If we write something ourselves that the AI didn't suggest, and especially if it triggers lint warnings, we start to doubt ourselves, maybe even start considering a career in farming or fishing.

The danger is that perceived correctness (following familiar patterns) overrides technical correctness. An API design could be perfectly valid or even superior, but if it doesn't resemble what we've seen before, developers may resist it.

## Case Study: When Official APIs Defy Convention – Anthropic's Ruby SDK

A recent example of new-vs-old style friction comes from the Anthropic API (the company behind Claude). For a while, Ruby developers had access to Anthropic's AI via an unofficial gem by [Alex Rudall](https://github.com/alexrudall).

This community gem, initially called anthropic (later ruby-anthropic), was built in a very Ruby-ish way. It followed conventions that Rubyists expect: configuration via a block, plain old Ruby objects, and using Faraday for HTTP under the hood. Faraday is the de facto standard HTTP client adapter in Ruby, and the gem's documentation explicitly references Faraday::Errors, confirming it uses Faraday for network calls. This choice made sense—Faraday is widely used, integrates with middleware for logging or retries, and any Rubyist using the gem would feel right at home with its behavior.

Fast forward to now: Anthropic released an official Ruby SDK (packaged as the anthropic gem, with Alex Rudall even donating the gem name to them).

Official support is great news, but the API design and implementation of the official SDK took a lot of Rubyists by surprise. Instead of following the patterns set by the unofficial gem (and other Ruby API wrappers), the official SDK introduced a new client API that feels influenced by other languages like Go or Java. It was decided to reduce dependency.

For instance, it doesn't use Faraday at all—it comes with its own HTTP adapter and connection pooling system, more like what you'd see in a Go HTTP client or a Java OkHttp setup, rather than a typical Ruby script that just uses Faraday to allow adapter selection. The README notes that each client manages its own HTTP connection pool for concurrency, a concept more common in lower-level languages or explicitly concurrency-oriented Ruby code.

The surface API also has subtle differences. The unofficial gem had a very idiomatic usage, e.g., using class methods like `Anthropic.messages.create(...)` with hash options, similar to how something like the Stripe Ruby SDK or ActiveRecord might work. The official SDK, by contrast, might require instantiating a client (`Anthropic::Client.new`) and then calling methods on it (e.g., `client.messages.create(...)`). It also introduced a typed interface (using Sorbet RBI/RBS for type checking).

From a purely technical standpoint, there's nothing wrong with the official SDK's approach. In fact, it might offer performance and reliability benefits (like thread safety and fewer GC churn by reusing HTTP connections).

Today, however, such changes come with a new kind of friction: our AI copilots and established habits push back against the unfamiliar design. A developer trying out the official Anthropic SDK might encounter a few pain points:

First, muscle memory & AI suggestions. If they used the older gem (or even the OpenAI Ruby gem, which is similar in style), they might start coding by habit. They type `Anthropic.` and perhaps Copilot suggests `Anthropic.messages.create(...)` because that pattern was common in the unofficial SDK. But in the official SDK, maybe you need to do `client = Anthropic::Client.new` first and use that instance.

Second, deviation from community tools. Not using Faraday means the official SDK might not seamlessly fit into middleware stacks that Ruby devs use (like instrumenting Faraday for logging or metrics). Meanwhile, an AI tool likely has seen tons of Faraday usage and zero of whatever internal HTTP client Anthropic uses, so it won't suggest how to add a logging interceptor or retry logic on this new client.

Third, cognitive dissonance in style. Ruby developers pride themselves on APIs that read naturally. A non-idiomatic style stands out. If the official client has method names or patterns that feel imported from Java/Go, a developer might initially think "am I using this right? It feels clunky."

The end result is that developers may hesitate to adopt the official SDK or fully embrace its new patterns. Some might stick with the older community gem because it's familiar and all their tools support it. Others might use the official one but internally wrap it in something that feels more like Faraday to satisfy their own sense of normalcy—you can see that with 100 implementations around MCP specification in JavaScript with [mcp-framework](http://mcp-framework.com) taking the lead

## Case Study: When AI and Linters Mislead – The `render` Method Confusion

It's not only big SDK designs that face this pattern inertia; even small design choices in a gem can cause confusion when they collide with established meanings. I ran into this firsthand with a gem I authored called `action_mcp`. This gem allows building prompt/response flows and "tools" for LLMs in a Rails application following the MCP spec.

In this domain, it made perfect sense for me to define a method called `render` – because the gem is about rendering AI responses (text, images, audio, resources, etc.) as the output of an LLM tool or prompt. So inside an `ActionMCP::Tool` class or prompt, you might see something like:

```ruby
# inside a tool's perform method
render(text: "Calculating #{a} + #{b}...")
render(text: "The sum is #{sum}")
```

What could be more reasonable? The method name `render` perfectly describes what it does: it takes content (or an error or image) and renders it into the response that will be sent back via the LLM.

However, the moment I started using this in a Rails project with GitHub Copilot enabled and RuboCop linting my code, I realized I'd stepped on a linguistic landmine. Both Copilot and RuboCop seemed to assume `render` meant ActionController's render method.

In Rails, `render` is a heavily used method to render views or JSON, etc., within controller actions. My gem's `render` is something entirely different (it doesn't render a view; it produces an AI message), but the tools don't know that context.

GitHub Copilot's reaction: Whenever I wrote a `render(` call in my tool class, Copilot kept trying to autocomplete it with typical controller options – e.g., it would suggest things like `render json: ...` or `render template: ...` because it's seen thousands of controllers do that. It might even try to close the method with an `end` early, thinking I was in a controller action rendering and done.

RuboCop's reaction: RuboCop also got confused. It might have rules around controllers using `render` properly. I saw warnings about the arguments to `render` or the context of `render` because RuboCop assumed I was calling `ActionController::Base#render` incorrectly.

The combination of Copilot's misguided suggestions and RuboCop's warnings created a strong impression that I was doing something "bad," even though I knew logically that `ActionMCP::Tool#render` was fine. I caught myself momentarily considering, "Should I rename that method to something else, just to avoid these hassles?"

That right there is the ossification pressure in action! The AI and lint tools were nudging me to rename or redesign a perfectly valid API in my gem, purely because it clashed with a more common meaning of `render`.

This demonstrates how LLMs can make correct code feel incorrect. The code looked like something else to the AI, so it kept telling me to change it. If I didn't have confidence in my intent, I might have listened.

## The New Challenge: Balancing Innovation and Expectation

These case studies underline a new challenge for Ruby (and likely all programming ecosystems): How do we continue to innovate in API design under the watchful eye of AI "mentors" that learned from the pre-history? It's a strange question to face. In the past, introducing a new library or pattern required convincing other developers; now, it seems we also have to convince the AIs (indirectly, by retraining or by user feedback) – or work around them. Maybe I should become an AI DEV advocate and spend my days tweeting motivational text until Grok learns it.

Let's break down what's happening:

First, developer expectations are AI-shaped. As developers, our expectations are now partly formed by what AI assistants deem likely. If every time you type code, Copilot suggests a certain completion, you begin to expect that pattern in your code. When an API deviates from that pattern, it's jarring. The Anthropic SDK story is a case in point: the community might have been ready to accept a new approach, but their expectations were anchored by the unofficial gem and similar libraries.

Second, toolchain feedback loops. Linters and other automated feedback tools encode rules – sometimes flexible, sometimes rigid. When those rules collide with a new design, they produce warnings or errors. We have multiple layers of "automated opinions" now: the AI that writes the code and the linter that reviews it. If both are trained on the same corpus of existing code, they'll likely agree on what's normal. So a new API design gets flagged from two sides, doubling the developer's impression that it's wrong.

Third, "looks correct" vs "works correctly." If an API design itself is different, an AI might produce code that looks right but actually targets a different API. For example, had I not known better, I might accept Copilot's suggestion to call `render json: ...` in an ActionMCP tool – which would totally not do what was intended, because my `render` doesn't take a `:json` option.

Fourth, misleading documentation & learning resources. Many of us learn via googling error messages or copying code from StackOverflow. If the community is slow to write about a new API, AI might surface older documentation or Q&A that no longer applies. For instance, developers searching for "Anthropic Ruby API example" might find blog posts or Q&As related to the unofficial gem (with Faraday) and use those, not realizing the official SDK works differently.

The sum of these pressures is that API designers might feel discouraged from deviating too far from established patterns. If you're a Ruby gem author in 2025, you have to wonder: will my target audience be comfortable with this design, or will their AI tools rebel and tag me persona non grata? Do I pick the novel approach that might be better, or do I stick with conventions so that adoption is smoother?

It's almost like we have a new stakeholder in API design, not just the end-user and the maintainer, but the AI intermediary that needs to "get it" for the end-user to have a good experience. For the Ruby community, which historically has embraced DSLs and unconventional but elegant solutions, this is a cultural shift.

Imagine if something as innovative as Rails itself, with all its domain-specific magic, were introduced today. Would Copilot constantly fight DHH while he was typing out `has_many :through => ...` in 2004? Would linters scream about missing class definitions for methods created by `method_missing`? (They often do, even now.) Yet Rails succeeded in part because the community was willing to learn a new paradigm.

## Conclusion

AI assistance in coding is here to stay, and overall, it's a positive development for productivity. But it comes with the subtle side effect of reinforcing the status quo. APIs and coding styles could ossify, not because of technical limitations, but because deviation triggers confusion – in our tools and then in ourselves.

As Ruby developers and library authors, we should be mindful of this dynamic. The next time an official SDK or a new gem comes along with a bold design choice, check if any resistance you feel is due to genuine technical critique or just the discomfort of the unfamiliar amplified by AI-trained expectations.

We should strive to remain critical thinkers: sometimes the "weird" new way might actually be an improvement, and we shouldn't dismiss it outright because our AI buddy hasn't seen it before. On the flip side, when designing APIs, it's worth considering how autodidactic tools perceive your API. It sounds odd, but you might ask, "If a newbie relies on Copilot to use my library, will it help or hinder?"

This doesn't mean never breaking convention, but it means you may need to educate both the community and the AI. That could be through very clear documentation, examples (so that they hopefully get into the training data), or even collaborating with lint tool authors to create custom rules that understand your DSL.

Ultimately, awareness is the first step. The Ruby ecosystem has thrived on expressiveness and innovation. By recognizing the ossification pressure from AI, we can take steps to ensure we don't become stuck in old ways. With conscious effort, we can have the best of both worlds: enjoying AI assistants for the routine stuff, while keeping our minds open to new ideas that break the mold.