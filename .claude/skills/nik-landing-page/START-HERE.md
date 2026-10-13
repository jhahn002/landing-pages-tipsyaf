# Build your next landing page

Nik Sharma · Q4 Summit · Conference edition 1.1.2

Give your AI a product URL and this skill. It will work through brand research, buyer questions, the page argument, design, implementation, and checks before launch. You get a working draft you can review and improve.

## 1. Open a project

Use a local project in Codex or Claude Code. An empty folder is fine for a new page. You need a working account for your chosen tool. Its usual usage charges and limits apply.

## 2. Install the skill

Go to the [setup page](https://lp-skill.nik.co/#setup), choose Codex or Claude Code, and copy a fresh setup prompt. Paste it into the AI conversation in your open local project. Your agent will download the package, verify its checksum, install the complete skill, and ask for your product URL.

The prompt's download link lasts one hour and grants access only to the skill ZIP. If it expires before the download, copy a fresh prompt from the setup page. No manual download or dragging files is needed for this flow.

If the skill is already installed in this project, skip installation and continue to step 3. The setup prompt preserves an existing installation and shows differences before replacing it.

### Manual installation fallback

If your agent cannot download the package, download and unzip it from the site yourself. Keep the complete `nik-landing-page` folder together, including `references` and `agents`. Copying only `SKILL.md` leaves out the research guidance and module library.

Put the unzipped folder inside your project and use the matching manual install prompt in [PROMPTS.md](PROMPTS.md), or copy the complete folder to the location below. Preserve an existing installation until you have reviewed any differences.


| Tool | Your finished folder path | Invoke it |
| --- | --- | --- |
| Codex | `.agents/skills/nik-landing-page/` | `$nik-landing-page` in the CLI or IDE; select the skill in the app |
| Claude Code | `.claude/skills/nik-landing-page/` | `/nik-landing-page` |

Open the project in the tool. If the skill does not appear, restart the tool and check that `SKILL.md` is directly inside `nik-landing-page`, with no extra nested folder. You can also ask it to read that exact file and follow its linked references.

These are project-local instructions. They do not install the skill into other projects or a cloud session. See the current [OpenAI skill documentation](https://learn.chatgpt.com/docs/build-skills) and [Claude Code skill documentation](https://code.claude.com/docs/en/skills) for other setups.

## 3. Give it a real starting point

After setup, reply with your product URL, where visitors will come from, and what you want them to do. If you already installed the skill, use the first-build prompt in [PROMPTS.md](PROMPTS.md) and replace the bracketed fields.

If you have them, add the incoming ad, approved product photos, reviews you can use, and the exact offer. The AI can make a more informed page when it knows what brought the visitor there.

You should receive:

- A short explanation of the chosen angle, with sources and assumptions.
- A responsive page you can open and edit.
- A record of checks and anything still needed before launch.

## 4. Review it like a customer

Open the page on your phone. Can you tell what the product is? Does the reason to buy make sense? Can you find the price and understand the terms? Does the main button take you to the right product and purchase option?

Use the refinement prompt in [PROMPTS.md](PROMPTS.md) for specific changes. Give the agent a screenshot or describe the exact section when useful. Keep the parts you like explicit so revisions preserve them.

## What is included

The package contains the skill, a research and brand guide, 29 page modules, design and copy checks, launch and measurement guidance, a fictional worked example, and these setup prompts.

The skill uses the tools and permissions your AI already has. It cannot enable web browsing, retrieve blocked reviews, generate images, or publish a site by itself. If a capability is unavailable, the agent should explain the limit and work from the material you provide. A build without browser testing should be labeled unverified.

This package contains readable instructions and no executable scripts, account connections, or tracking code. Your own AI provider handles the inputs you give it. Review claims, assets, and purchase terms before publishing; the skill does not guarantee conversion results.
