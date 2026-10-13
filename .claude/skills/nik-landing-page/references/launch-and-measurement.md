# Rehearsal Dinner: check before traffic

Follow the customer journey before calling the page ready. Inspect the existing commerce, analytics, consent, and hosting setup. Use the user's authorized systems and current official documentation for that implementation.

## Follow the purchase path

Open the page directly and through a tagged test visit. Check the intended product or variant, quantity, price, discount eligibility, subscription terms, and destination. Inspect the merchant's rendered cart or selection state. A supply duration and a billing interval are separate facts.

Confirm that approved campaign parameters, ad-click identifiers, discounts, and selections survive the intended redirects. Do not include personal data or secrets in URLs. A subdomain alone does not solve consent or measurement across sites.

Test the main CTA, repeated CTAs, selectors, forms, policy links, reloads, and relevant error states. Use previews or sanctioned test modes when available. Do not place a paid order or change an account without authorization covering that action.

## Keep event meanings accurate

| Event | What it can report |
| --- | --- |
| Page view | The page loaded, subject to the configured consent rules |
| Product view | The relevant product was viewed, with its correct identifier |
| CTA click | Someone clicked the named action |
| Add to cart | The commerce system confirmed a cart addition |
| Begin checkout | The shopper actually began checkout |
| Purchase | The commerce system confirmed an order, value, currency, and items |

A click is not evidence of a cart addition or purchase. Do not fire success events on failed requests or invent an order event from a thank-you-looking URL.

Inspect existing integrations before adding tags. Use only the approved active channels and one defined owner for each event. Where browser and server events represent the same action, use the integration's deduplication mechanism and verify it. Keep server tokens out of page code and delivery notes.

Test the applicable consent acceptance and rejection paths, including the merchant handoff. A visible banner does not prove the choice is respected. Use available test/debug tools to observe behavior. Missing account access is a configuration gap, not a passed check.

## Record what was checked

Keep a short QA table with the tested URL, date, viewport or action, observed result, and status: passed, failed, or unverified. Include:

- Desktop, standard phone, short phone, keyboard, and form checks.
- Verified offer and actual CTA destination.
- Product, variant, quantity, purchase type, and material terms.
- Campaign handoff, consent behavior, event ownership, and duplicate reporting where accessible.
- Any order-event step that could not be tested.

Fix failures inside the authorized project. Name remaining gaps and what is needed to resolve them. Do not report a check as passed because its script exists.

## Release and evaluate

Use the authorized host and domain. When publishing is not authorized, deliver the working preview and a concrete next step. After publication, repeat the journey on the exact final hostname. Check direct visits, reloads, assets, forms, CTA handoff, and configured tracking. Preserve a practical rollback path.

For a challenger page, choose a specific hypothesis and define the control, comparison method, primary outcome, guardrails, and evaluation window before interpreting results. Check measurement and buying-path problems before blaming the old page. Keep audience, offer, and traffic differences visible. A handful of conversions or an unverified dashboard cannot establish a winner.
