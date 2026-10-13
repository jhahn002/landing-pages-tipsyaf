# Prompts to use

Paste prompts into your AI conversation, not your terminal. Replace bracketed fields with your details where shown.

## Set up with one prompt

Open a local project in Codex or Claude Code. On the [setup page](https://lp-skill.nik.co/#setup), choose your tool, copy a fresh setup prompt, and paste it into that project's AI conversation.

The prompt includes a one-hour download link for the skill ZIP and its expected checksum. Your agent downloads and verifies the package, installs the complete skill in this project, reads it, and asks for your product URL. If the link expires, return to the setup page and copy a fresh prompt.

Already installed in this project? Skip setup and use the first-build prompt below. The setup prompt preserves an existing installation and shows differences before replacing it.

## Manual install in Codex

Use this fallback if your agent cannot download the package. Download and unzip it from the site, put the complete `nik-landing-page` folder inside the project you have open, then paste:

```text
Install the nik-landing-page skill from the unzipped folder in this project.
Copy the entire folder, including references and agents, to
.agents/skills/nik-landing-page/. Keep the source folder intact. If that
destination already matches, reuse it. If it differs, leave it untouched and
show me the differences before replacing anything. SKILL.md must sit directly
inside the installed nik-landing-page folder, with no extra nested folder.
Verify every installed file and linked local reference. Tell me the installed
path, read SKILL.md, and follow it in this conversation. Ask for my product URL
unless I already supplied it. Do not change other skills or account settings.
```

## Manual install in Claude Code

Use this fallback if your agent cannot download the package. Download and unzip it from the site, put the complete `nik-landing-page` folder inside the project you have open, then paste:

```text
Install the nik-landing-page skill from the unzipped folder in this project.
Copy the entire folder, including references and agents, to
.claude/skills/nik-landing-page/. Keep the source folder intact. If that
destination already matches, reuse it. If it differs, leave it untouched and
show me the differences before replacing anything. SKILL.md must sit directly
inside the installed nik-landing-page folder, with no extra nested folder.
Verify every installed file and linked local reference. Tell me the installed
path, read SKILL.md, and follow it in this conversation. Ask for my product URL
unless I already supplied it. Do not change other skills or account settings.
```

## Build your first page

Select the skill in your app, or begin with `$nik-landing-page` in Codex CLI/IDE or `/nik-landing-page` in Claude Code. Then use this prompt:

```text
Use the nik-landing-page skill to build a landing page for this product:
[product URL]

Visitors are coming from: [paid social, search, email, or "not decided"]
The action I want them to take: [buy this product, shop the collection, sign up]
Offer: [exact offer and terms, or "use the verified current product offer"]
Brand assets or ad reference: [files/links, or "use the official site"]

Research the product and accessible buyer reviews or discussions. Inspect the
real brand before designing. Keep sources for facts and separate assumptions
from evidence. Recommend an angle and explain it briefly, then build a working
responsive page in this project. Use the sections the argument needs.

Open the result at desktop and mobile widths, critique it, and fix the concrete
problems you find. Check the primary CTA and its destination. If you cannot
research or test something, tell me exactly what remains unverified.

Give me a preview, the source, and simple edit/run instructions. Prepare it for
review; do not publish, spend money, or place an order.
```

## Refine a draft

```text
Use the nik-landing-page skill to improve this page: [preview or file].
Keep: [the accepted angle, offer, sections, or visual choices].
Change: [the specific problem and where it appears].

Compare the rendered page with the official brand and the incoming message.
Check whether each section adds a useful reason, evidence, or answer. Make the
changes, inspect the result at desktop and short-phone widths, and retest any
affected interaction. List remaining factual or functional gaps plainly.
```

## Check before launch

```text
Use the nik-landing-page skill to check this page before I send traffic:
[preview or URL].

Follow a customer's visit through the main CTA. Verify product, variant,
quantity, price, subscription terms if applicable, and the actual destination.
Check mobile layout, keyboard use, missing assets, and consent/tracking where
access allows. Do not place a paid order or change account settings. Fix issues
within this project and give me a tested / unverified checklist for launch.
```
