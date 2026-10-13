# Build, inspect, and improve

Build within the current project when one exists. Preserve its framework and conventions. For a new page, use a small, maintainable implementation that supports the requested interactions. A static page with a verified merchant link may be enough; a real form needs a real destination.

## Design from the brand record

Use the actual logo, type, palette, product photography, and component conventions established during research. Check the real header and footer before recreating them. Do not substitute a typed logo or guessed typeface without noting the choice.

Develop one coherent visual system. Make the product and the argument prominent through hierarchy, spacing, and useful imagery. A distinctive hero can sit above calm, readable supporting sections. Avoid filling the page with unrelated badges, pills, gradients, cards, or decorative motion.

A reference can help with a particular problem, such as comparison clarity or proof placement. Borrow its structure where useful while preserving this brand's identity, wording, assets, and actual offer.

Apply these page styling rules when building or adapting a reference:

- Number visible sequences as 1, 2, 3. Remove leading-zero formatting from step, reason, and section labels, including CSS counters. Preserve meaningful dates and quantities.
- Remove decorative up-right arrows from buttons, links, and headings, whether text glyphs, icon assets, or CSS-generated content.
- Omit tiny subtext and eyebrow labels above headlines.

## Write copy a customer can use

Make it clear what is being sold. Turn a verified attribute into a relevant implication without inventing an outcome.

For example, a fictional coffee machine with one preset brew button may support "Fewer settings between you and your morning coffee." That fact does not establish "Perfect coffee in 30 seconds." Show the real button and explain the steps instead of filling the gap with a larger promise.

Keep specific proof near the statement it supports. Preserve the meaning and attribution of quotations. Avoid vague praise, invented expert endorsements, unsupported review totals, and generic "science-backed" labels. A customer experience does not establish a typical result.

Read the copy aloud. Replace stiff phrasing, forced groups of three, elaborate contrasts, and repeated claims with concrete language. Keep the brand's voice. Remove strategy labels such as "pain-point module" or "conversion optimized" from the consumer page.

## Build the actual interaction

Use semantic headings and real buttons or links for their intended roles. Provide clear labels, visible keyboard focus, readable contrast, useful image descriptions, and appropriate form errors. Respect reduced-motion settings. Avoid a sticky CTA that covers controls, terms, or the final section.

Use accurate product assets and sensible image sizes. Preserve aspect ratio and crop intentionally. Reserve space for loading images, avoid loading heavy decorative media before the product story, and check missing-asset behavior.

When the page hands off to a merchant, use the verified destination and describe it accurately. Preserve the intended product, option, quantity, and purchase type. If the integration cannot set a subscription or variant reliably, explain the limitation and use an honest selection step. Never silently send a one-time purchase when the offer says subscription.

Forms must show understandable pending, success, and error states. A mock form should be visibly identified as a draft and must not claim a successful signup. Repeated clicks should not create accidental duplicate requests.

## Critique the rendered page

Inspect around 1280×720, 390×844, and 375×667. These are useful starting sizes; check nearby widths and enlarged text when layout is tight.

Compare the result with the official brand reference and incoming ad. Record specific issues you can see or reproduce:

- The product or promise is hidden below oversized decoration.
- The first screen has no clear next action.
- A headline could describe any product in the category.
- A sequence label has leading zeroes, a decorative up-right arrow appears, or a tiny subtext/eyebrow label sits above a headline.
- Two sections make the same argument.
- A claim has no relevant evidence nearby.
- Text, buttons, images, or selected states are clipped or inconsistent.
- Proof is too large to scan or too small to read.
- A subscription selection, price, CTA label, or destination disagrees with another.
- The footer, form, empty state, or error message uses a different visual style.

Fix the observed problems. Re-render changed viewports and retest affected controls. Do not stop after listing criticism when the user asked for a build or revision. Avoid endless polishing: finish once material issues are resolved and remaining launch gaps are explicit.

Record the pages, viewports, and interactions actually tested. Source inspection, a passing build, and an HTTP 200 response cannot establish visual quality or a working customer journey. If a browser is unavailable, say the visual or interaction checks remain unverified.
