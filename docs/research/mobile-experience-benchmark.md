# Pendilo — Premium Mobile Experience Research

**Status:** Research only. No dependencies installed, no application code touched. Everything below is a proposal pending approval.

**Scope:** 10 reference apps, a technical-investigation pass, an opportunity matrix, five design concepts, and full implementation specs for the three strongest ideas.

---

## 0. Grounding notes (read before the rest)

Two things in the codebase change how this research should be read, relative to the original brief:

1. **Mascot identity has moved on from "Mojón."** The brief describes the mascot as "Mojón, a friendly character made of three stacked stones." The current codebase (`components/PoliMascot.tsx`, `components/PoliMascotRive.tsx`, `theme/tokens.ts`, and the last four commits — "add poli the new agent," "apply the first version of mocko," "Animation and identity polish... Poli, onboarding," "Scaffold Rive integration for a redesigned, higher-fidelity Poli") shows the mascot has been redesigned as **Poli (la Polymita)**, a snail with a five-striped shell. The stripe order never changes; what varies is how many stripes are filled (progress) and the face/antennae (mood: `listening`, `thinking`, `organizing`, `celebrating`, etc. — `listening` and `organizing` share the same "content" face). A Rive-based version is already scaffolded for higher fidelity. This document treats **Poli**, not Mojón, as the mascot throughout, and flags every mascot-related recommendation against the current component API.

2. **`DESIGN.md` already rules out a large share of the patterns competitors use for engagement.** Verbatim: *"Nada de rachas, contadores de racha rota, ni lenguaje de castigo. Se premia lo hecho, nunca se señala lo pendiente"* (no streaks, no broken-streak counters, no punishment language; reward what's done, never flag what's pending), plus a strict motion contract (transform/opacity only, gesture→spring, no-gesture→timing, three named springs, haptics as confirmation only, mandatory reduced-motion handling with `cancelAnimation` cleanup). This matters directly for Phase 1–3 below: **Duolingo's streak/loss-aversion mechanics, Forest's guilt-tripping dead tree, and Opal's "shock" lifetime-loss onboarding are explicitly incompatible with Pendilo's identity**, not just generically "to be used with restraint." They're included below as research (the brief asked for 10 apps including Duolingo), but every recommendation sourced from them is reframed or rejected rather than imported.

All animation timing figures below that are not sourced from an explicit citation are marked **(estimated)** and given as a typical range, per the brief's instruction never to invent exact numbers as fact.

---

## Phase 1 — Research: 10 apps

### 1. Things 3 (Cultured Code) — task manager
- **App Store:** https://apps.apple.com/us/app/things-3/id904237743
- **Visual design & typography:** Reviewers consistently describe the app as content-first — generous white space, a restrained type scale, sparing color, to-dos rendered close to "text on a page" rather than boxed cards. ([MacStories review](https://www.macstories.net/reviews/things-3-beauty-and-delight-in-a-task-manager/), [MacRumors](https://www.macrumors.com/2000/))
- **Gestures:** Drag-and-drop reordering, swipe actions, tap-to-expand detail fields.
- **Haptics:** A haptic pulse fires when a task is checked off; *un*-checking a completed task requires a confirmation step, explicitly framed by one critique as slip-prevention (protecting against an accidental undo of a satisfying action). ([Design Critique: Things 3, Pratt](https://ixd.prattsi.org/2020/02/design-critique-things-3-ios-app/))
- **Discoverability:** Editable fields are signposted with grey icon affordances revealed via a `+` button rather than shown all the time — progressive disclosure over a cluttered form.
- **Caveat:** the Pratt source is a student design critique, not a usability study; MacStories' piece is a single reviewer's opinion from the app's launch era. Treat both as informed commentary, not measured data.

### 2. Finch — Self-Care Pet
- **App Store:** https://apps.apple.com/us/app/finch-self-care-pet/id1528595748
- **Mascot as mechanic, not decoration:** A teardown argues a virtual-pet mascot only works if it clarifies a real behavior loop — feed/nurture the pet by doing real self-care actions — and warns that a pet or reward currency bolted onto a UI with no credible loop reads as manipulative decoration. ([screensdesign.com](https://screensdesign.com/articles/finch-app-onboarding-design/))
- **Onboarding sequencing:** A Pratt critique ([2025](https://ixd.prattsi.org/2025/09/design-critique-finch-ios-app-2/)) praises the pet metaphor (most users already know "feed and nurture something to help it thrive") but flags that the app front-loads customization (color, traits, naming) before the user has even met the pet — a progressive-disclosure violation. A second critique ([2026](https://ixd.prattsi.org/2026/02/design-critique-finch-self-care-pet-ios-app/)) praises consistent button treatment and a progress bar that gives continuous feedback through a long onboarding.
- **Flow detail:** A third-party annotated flow lists a ~46-step onboarding, including a "Hatch a new pet" welcome CTA, an egg-selection step, and a phone-number step with a visible Skip. ([lazyweb.com](https://lazyweb.com/canvas/flows/finch/onboarding))
- **Caveat:** download/revenue figures cited by some sources (e.g., a $1M revenue claim) are unverified third-party estimates — excluded from this report's claims.

### 3. Structured — daily planner
- **App Store:** https://apps.apple.com/app/structured-daily-planner/id1499198946
- **Timeline as the core object:** A vertical timeline where block height encodes task duration, making free time visually obvious at a glance — repeatedly singled out across reviews as the app's defining idea. ([saner.ai review](https://blog.saner.ai/structured-review/))
- **Gestures:** A documented "Replan" action reschedules a task via a quick swipe; drag-and-drop repositioning on the timeline is a listed feature. (App Store listing; [saner.ai](https://www.saner.ai/blogs/structured-review))
- **Known weak spot:** Sync reliability (particularly iCloud) is a recurring complaint serious enough that the developers built a proprietary alternative, "Structured Cloud" — a caution that a beautiful timeline doesn't substitute for a complete, reliable planning system. ([coolcuration.com](https://coolcuration.com/structured-app-review-uk))

### 4. Duolingo — language learning
- **App Store:** https://apps.apple.com/us/app/duolingo-language-lessons/id570060128
- **Streak as the retention lever:** Analyses describe the streak counter as the center of Duolingo's retention design — losing a long streak is framed as feeling worse than skipping a lesson feels easy, which is a loss-aversion mechanic by design. ([UX Planet](https://uxplanet.org/ux-and-gamification-in-duolingo-40d55ee09359), [Desirability Lab](https://desirabilitylab.com/backfill/backfill-2025-353-duolingo-streak-system))
- **Mascot tone as a lever too:** The owl mascot's push notifications range from encouraging to guilt-tripping — an explicit, named design choice.
- **XP/progress feedback:** Each lesson awards XP against a visible progress bar.
- **Critical reads:** A Desirability Lab piece argues the streak mechanic optimizes for daily app opens rather than actual proficiency; a UX Design piece raises outright ethical concerns, comparing the daily-habit pressure to addictive design patterns. ([uxdesign.cc](https://uxdesign.cc/the-good-the-bad-and-the-ugly-of-duolingo-gamification-3a12f0e80dc7))
- **Gap:** no source found documents Duolingo's haptic pattern specifically (only color/sound: green=correct, red=incorrect, a reward chime vs. a softer error tone). Any haptic claim beyond that is unverified — excluded.
- **Verdict for Pendilo:** this is the clearest **anti-pattern** of the ten. Its core mechanic directly contradicts `DESIGN.md`'s explicit "no streaks, no broken-streak counters, no punishment language" rule. Logged here for completeness, not as a source to borrow from.

### 5. Streaks — habit tracker
- **App Store (listing used for ID):** https://apps.appfollow.io/ios/streaks/963034692
- **Core interaction:** Up to 24 daily habits shown as circles; tapping completes one. ([2026 review summary](https://lifestack.ai/blog/streaks-app))
- **Longstanding reputation:** A 2018 review called the main view "very simple... easy to parse at a glance" while also describing some interaction choices as "maddening in places" without detailing which. ([Dr. Drang, leancrew.com](https://leancrew.com/all-this/2018/10/a-few-weeks-with-streaks/))
- **General completion-celebration guidance (not Streaks-specific, but relevant):** one design guide explicitly warns against triggering a fireworks-style celebration after a single tap, since that implies a long-term habit has formed when none has — it recommends showing progress toward *today's* requirement before celebrating completion, and keeping celebration from occluding the task itself. ([screensdesign.com](https://screensdesign.com/articles/mobile-app-streak-design-examples/))
- **Gap:** no source documents the specific completion animation (timing, easing, haptic pattern) in enough detail to cite as fact — excluded rather than guessed.

### 6. Headspace — meditation & sleep
- **App Store:** https://apps.apple.com/gb/app/headspace-meditation-sleep/id493145008
- **Onboarding friction, measured:** A Raw Studio write-up of a Headspace design talk cites a **38% drop-off** between the start and end of onboarding, found via screen-recording the whole flow; the team's stated goal was cutting onboarding time from roughly 6 minutes to roughly 3. ([Raw Studio](https://raw.studio/blog/how-headspace-designs-for-mindfulness/))
- **Iteration example:** the team tested replacing an instructional video with GIFs conveying the same idea, and found that ads interrupting onboarding broke the calming flow the app is built around.
- **Gap:** no primary source on Headspace's specific sound-design choices was found in this pass; secondary summaries mention "color, animation, and sound" working together but without specifics. The strongest lead for a follow-up is the original Vicki Tan / Christine Cha "Design for Change" talk, which the secondary sources draw from — not independently verified here.

### 7. Fantastical (Flexibits) — calendar
- **App Store:** https://apps.apple.com/us/app/fantastical/id718043190 (note: a second ID, 975937182, also resolves for this app across regional/Mac storefronts — Flexibits' own site is the authoritative link if precision matters)
- **Natural-language input as the headline feature:** typing a plain sentence (e.g., "golf outing Saturday 9am") creates a full event without opening a detailed editor. ([9to5Mac](https://9to5mac.com/?p=314407))
- **Gestures:** swipe down to switch between week-strip and month-grid, swipe left/right to change months/days, swipe across an event to reveal delete — described as easy to pick up. ([iPhoneJD](https://www.iphonejd.com/?p=1703))
- **Contact-aware parsing:** the text parser recognizes names from contacts, pulling in invitee details from a phrase like "meet with Cody." ([MacStories](https://www.macstories.net/reviews/fantastical-your-personal-ical-assistant/))
- **Caveat:** the most detailed reviews found date to the app's early iPhone/iPad/Mac launches — no recent (post-2024) teardown of the current gesture set was found in this pass.

### 8. Opal — screen time control
- **App Store (ID via third-party listing):** https://apps.apple.com/app/id1497465230
- **Quiz-driven "shock" reveal:** onboarding runs a personalized quiz that produces a "Focus Report" projecting lifetime hours/years lost to phone use, then a "benefit" screen reframing that loss as reclaimable time (e.g., "10 years+ regained"). ([screensdesign.com](https://screensdesign.com/apps/opal-screen-time-control/), annotated flow at [lazyweb.com](https://lazyweb.com/canvas/flows/opal/onboarding))
- **Paywall threading:** many onboarding screens are tagged "Unlock Pro" in the captured flow, suggesting the paywall is woven through onboarding rather than placed only at the end.
- **Company-stated iteration:** Opal's own blog describes simplifying its home screen to a plain hourly bar chart after internal testing. ([opal.so blog](https://opal.so/blog/introducing-the-new-opal-home-screen-track-your-screen-time-and-improve-your-focus))
- **Verdict for Pendilo:** the onboarding mechanic (quantified-loss framing, "shock then relief") is a well-executed example of **fear-based motivation** — effective by the numbers these third-party sources report, but a second direct conflict with `DESIGN.md`'s "no punishment language" rule. Logged as an anti-pattern to consciously avoid, not a technique to adapt.

### 9. Day One — journaling
- **App Store:** https://apps.apple.com/us/app/day-one/id1055511498 (a second ID, 1044867788, surfaces for an iPhone-labeled variant in some storefronts; the above is the one consistently described as the current cross-platform app)
- **Affordance clarity:** a 2026 Pratt critique of the current iOS version describes clear, hierarchical affordances on the Today screen, with instant visual feedback (darkening) on tap and immediate navigation to the next screen — no perceptible loading delay between tap and response. ([Pratt](https://ixd.prattsi.org/2026/09/design-critique-day-one-iphone-app/))
- **Widgets:** two lock-screen widgets — "Streak" and "Suggestions" (the latter, added in a 2024 update, launches a new entry directly from the lock screen). ([Day One help center](https://help.dayoneapp.com/articles/1694292-day-one-widgets-for-ios))
- **Reputation:** long-running praise for combining simplicity with depth of feature, better than competitors reviewers tested. ([The Sweet Setup](https://thesweetsetup.com/weve-given-our-review-of-the-best-journaling-app-a-quick-update/))
- **Note:** Day One's own lock-screen widget is literally named "Streak" — worth noting as a counter-example to the idea that all streak-shaped UI is manipulative; it depends entirely on framing (a private, personal record vs. a public-feeling loss-aversion mechanic). Still, given `DESIGN.md`'s explicit rule, Pendilo should not adopt even this low-pressure version without deliberately deciding to break that rule.
- **Gap:** no source covered specific screen-transition timing or easing — excluded rather than invented.

### 10. Forest — focus timer
- **App Store:** https://apps.apple.com/au/app/forest-focus-for-productivity/id866450515
- **Mechanic:** start a timed session (roughly 10 minutes–2 hours via a slider); a tree grows while the user stays off their phone, and dies — visibly, permanently logged in the user's forest — if they leave the app early. ([ClickUp review](https://clickup.com/learn/topic/productivity/tools/forest/), [Common Sense Media](https://www.commonsensemedia.org/app-reviews/forest-stay-focused-be-present))
- **Real-world tie-in:** in-app currency earned can fund real tree planting via a partnership with Trees for the Future — a rare example of a reward with external, prosocial stakes rather than pure in-app vanity.
- **Explicit critique found in sources:** one reviewer calls out the design as "rewarding you with a small gift, but also guilt-tripping you if you fail, because the dead tree remains in your forest" — i.e., the mechanic's loss-aversion side is visible and named even by positive reviewers. ([Gearbrain](https://www.gearbrain.com/forest-productivity-smartphone-app-2622588862.html))
- **Verdict for Pendilo:** the *growth* half of the metaphor (visible, cumulative, calm progress tied to real effort) is a strong, reusable idea and maps directly onto Poli's five-stripe fill mechanic already in the codebase. The *death/guilt* half is, again, incompatible with `DESIGN.md` and should be dropped entirely — Poli should never visibly "lose" progress as punishment.

---

## Phase 2 — Technical investigation (evidence-based, not reverse-engineered)

Per scope: the REA toolchain is for authorized reverse engineering of specific lawfully-accessible binaries, not for inferring implementations from App Store screenshots. Nothing below was reverse-engineered — it's inference from public engineering commentary, demonstrated RN/Reanimated/Gesture Handler capabilities, and the patterns already present in this codebase. Every concrete number is labeled **(estimated)**.

| Interaction | What's actually evidenced | Plausible RN implementation (inferred) | Confidence |
|---|---|---|---|
| Things 3 checkbox haptic + confirm-on-uncheck | Confirmed by a design critique as deliberate slip-prevention | `expo-haptics` `notificationAsync(Success)` on check; a `Pressable`-gated confirm (not a native OS dialog, which would be heavier) on uncheck | High — matches a documented pattern, simple mechanism |
| Finch onboarding progress bar | Confirmed present, drives perceived momentum through a long flow | Reanimated `useSharedValue` driving a width-less bar (opacity/scale-based fill to respect the "transform/opacity only" motion rule) stepped per screen | High |
| Structured timeline block height ∝ duration | Confirmed as the app's core device | A scroll view of absolutely positioned blocks, height computed from duration × px-per-minute, likely virtualized only if the day view can exceed typical screen counts | Medium — virtualization specifics not evidenced |
| Structured swipe-to-replan | Confirmed as a feature, exact gesture physics not evidenced | React Native Gesture Handler `Pan` gesture + Reanimated spring snapping to the nearest time slot on release | Medium |
| Fantastical swipe between week/month views | Confirmed as a described gesture, timing/easing not evidenced | Gesture Handler `Pan`/`Fling` driving a Reanimated `withSpring` transform between two pre-measured layouts | Medium |
| Headspace onboarding GIF-over-video swap | Confirmed as a tested change, outcome data not public | N/A — this is a content/asset decision (static-friendly media vs. autoplay video), not a technical pattern to port | N/A |
| Duolingo correct/incorrect color+sound pairing | Confirmed (color data), sound/haptic pairing is inferred from secondary commentary, not primary-sourced | `expo-av`/`expo-haptics` paired trigger on answer submit | Low on the haptic specifics — flagged as unverified above |
| Forest's "tree grows over session duration" | Confirmed as the core mechanic, animation frame data not evidenced | A Reanimated-driven SVG/Lottie/Rive scrub tied to a `withTiming` progress value over session length; Poli's existing five-stripe fill already does the structurally equivalent thing | High on the general pattern, since the codebase already implements its structural equivalent |

**Honest gap:** none of the ten apps' actual source, bundle, or compiled assets were inspected. Every implementation column above is a plausible-pattern inference grounded in what React Native/Reanimated/Gesture Handler can do and in engineering commentary that exists publicly — not a decompilation finding.

---

## Phase 3 — Pendilo opportunity matrix

Ranked by (user value × visual differentiation) against (implementation effort), filtered first through the `DESIGN.md` constraints — anything that fails the "no punishment, no streak-shaped pressure" test is marked **Rejected** rather than scored.

| # | Source | Observed pattern | Why it helps | Where it fits Pendilo | RN approach | Complexity | Trade-offs | Reference |
|---|---|---|---|---|---|---|---|---|
| 1 | Things 3 | Haptic-confirmed, content-first checkbox with confirm-on-undo | Makes the single most frequent action in the app (completing a task) feel certain and satisfying without adding UI chrome | Hoy task rows, Semana task rows | `haptics.success()` (already exists) on check; a brief inline "tap again to undo" affordance instead of a native confirm dialog, to stay within the "transform/opacity only," no-dialog-interruption feel | Low | None significant — this is close to what the app likely already does; verify consistency across Hoy/Semana | [Pratt critique](https://ixd.prattsi.org/2020/02/design-critique-things-3-ios-app/) |
| 2 | Forest (growth half only) | Continuous, cumulative visible growth tied to real effort, no loss state | Reinforces progress as additive, matching "se premia lo hecho, nunca se señala lo pendiente" | Poli's existing 5-stripe fill (`filled` prop) — extend to a smooth fill animation rather than a snap | `withTiming`/`withSpring` opacity+scale reveal per stripe using `spring.bouncy` only when it follows a user gesture (a completed task), `easing.easeOut` otherwise, matching `DESIGN.md`'s gesture→spring / no-gesture→timing rule | Low | Must never visibly "unfill" a stripe as punishment — any correction should fade, not animate backwards with emphasis | [Gearbrain](https://www.gearbrain.com/forest-productivity-smartphone-app-2622588862.html) |
| 3 | Structured | Timeline where visual size encodes a real quantity (duration) | Gives Semana a legible, scannable sense of "how full is my week" without numbers | Semana view, as a secondary density visualization alongside (not replacing) the current list | Virtualized/absolute-positioned day column, block height ∝ scheduled duration; Gesture Handler `Pan` for reschedule | Medium | Needs careful empty-state and overflow handling (many short tasks); accessibility requires an equivalent non-visual list, not just the timeline | [saner.ai](https://blog.saner.ai/structured-review/) |
| 4 | Fantastical | Swipe between two calendar granularities (week ↔ month) | A direct template for a smooth Hoy ↔ Semana transition gesture, reducing reliance on tab taps alone | Hoy/Semana navigation | Gesture Handler horizontal `Pan`, Reanimated shared transform (position/opacity only, per `DESIGN.md`), spring-settle (`spring.snappy`) on release past a velocity/distance threshold, else snap back | Medium | Must coexist with Expo Router's tab navigation rather than fight it; needs a reduced-motion fallback that's a plain cut, not a slowed slide | [iPhoneJD](https://www.iphonejd.com/?p=1703) |
| 5 | Finch | Mascot reacts with calibrated, non-overwhelming motion tied to real user action, introduced progressively (not all at once) | Validates that Poli's mood system (already built) is the right shape — the fix is sequencing/restraint, not more states | Onboarding; make sure Poli's mood states are introduced one at a time rather than demoed all at once | No new component — audit existing onboarding flow against the "introduce after the pet exists" critique | Low | None | [Pratt critique #1](https://ixd.prattsi.org/2025/09/design-critique-finch-ios-app-2/) |
| 6 | Headspace | Screen-recording the full onboarding to find exact drop-off and friction points | A measurement practice, not a UI pattern — directly actionable for Pendilo's own onboarding before/after any redesign | Process recommendation for whoever ships onboarding changes | N/A (methodology, not code) | Low | Requires analytics instrumentation Pendilo may not have yet | [Raw Studio](https://raw.studio/blog/how-headspace-designs-for-mindfulness/) |
| 7 | Day One | Zero perceptible delay between tap and next-screen response, achieved via instant optimistic UI rather than animation | A reminder that "feels fast" often beats "looks impressive" — relevant to voice capture → confirmation handoff | Voice capture confirmation screen transition | Navigate on intent, show content as it streams in, rather than gating navigation on a response | Low | None | [Pratt critique](https://ixd.prattsi.org/2026/09/design-critique-day-one-iphone-app/) |
| 8 | Things 3 | Progressive disclosure of edit fields via a single `+` entry point rather than an always-visible form | Keeps voice-capture confirmation calm (one primary action) per `DESIGN.md`'s "una cosa a la vez" | Task confirmation screen — keep edit affordances tucked behind a single control | Standard conditional render + layout animation on reveal (`LayoutAnimation` or Reanimated `Layout` transition), opacity/transform only | Low | None | [MacRumors](https://www.macrumors.com/2000/) |
| 9 | Duolingo | Streak counter, loss-aversion push notifications | — | **Rejected outright.** Directly violates `DESIGN.md`. Included only so the research record shows it was considered and consciously declined. | — | — | Ethical/identity conflict, not a technical trade-off | [UX Planet](https://uxplanet.org/ux-and-gamification-in-duolingo-40d55ee09359) |
| 10 | Opal | Quantified-loss "shock" onboarding, paywall threaded through onboarding | — | **Rejected outright**, same reasoning as #9. | — | — | Ethical/identity conflict | [screensdesign.com](https://screensdesign.com/apps/opal-screen-time-control/) |
| 11 | Forest | Dead tree persists visibly as guilt marker | — | **Rejected** (the growth half is kept as #2; this half is dropped). | — | — | Ethical/identity conflict | [Gearbrain](https://www.gearbrain.com/forest-productivity-smartphone-app-2622588862.html) |

---

## Phase 4 — Five design concepts for Pendilo

Prioritizing, per the brief: a beautiful voice-recording experience, delightful task completion, smooth Hoy/Semana transitions, expressive-but-subtle Poli animation, and motivating (non-manipulative) progress visualization. Explicitly avoiding generic dashboards, decorative gradients, distracting motion, and manipulative gamification.

### Concept A — "Breathing" voice capture
A calm, centered recording surface where Poli's antennae and a soft amplitude-reactive ring communicate "listening" state, replacing a generic waveform bar. Builds on Headspace's calm-motion ethos and Poli's existing `listening` mood, not on any novel visual language.

### Concept B — Quiet task completion
Checking a task plays a sub-150ms transform/opacity confirmation (per `DESIGN.md`'s own frequency rule — this happens many times a day, so it must stay almost imperceptible) paired with a single haptic (`haptics.success()`), and the completed item collapses into the already-existing "completadas" group rather than competing for attention. Rare, full-day completion gets the one "deleite" moment the day earns, via Poli's `celebrating` mood — not per-task fireworks (direct rejection of the Streaks-adjacent "celebrate every tap" anti-pattern).

### Concept C — Hoy ↔ Semana as one continuous surface
A horizontal `Pan` gesture morphs between Hoy's day view and Semana's week view (Fantastical-style), rather than two disconnected tab destinations, so the two screens read as one zoomable timeline instead of a navigation jump.

### Concept D — Poli's mood as the single source of state truth
Consolidate: everywhere the app currently shows a status via text or color alone, check whether Poli's mood can carry it instead (per `DESIGN.md`'s "Poli primero" hierarchy rule), introduced progressively rather than all at once (the Finch onboarding lesson).

### Concept E — Cumulative, additive progress visualization
Extend Poli's five-stripe shell fill into the Progreso screen as the week's primary visual: stripes/segments fill as tasks complete, calmly, with no regression animation, ever — direct descendant of Forest's growth metaphor with its guilt half surgically removed.

---

## Phase 5 — Implementation plan: the 3 strongest ideas

Selected for the combination of user value, visual differentiation, and consistency with the existing design system: **B (quiet task completion)**, **C (Hoy↔Semana transition)**, and **A (breathing voice capture)**. All three reuse existing tokens (`theme/tokens.ts`), the existing `haptics` helper, and the existing `useReducedMotion` hook — no new design-system primitives.

### 1. Quiet task completion

**Interaction spec**
- Tap the checkbox (existing `size.checkbox = 26` touch target, below the `size.touch = 44` minimum — the touch target should be padded to 44, not the visual checkbox itself enlarged).
- Immediate optimistic state flip; no network/async gate before the animation starts.
- Row transforms: checkbox fill + a subtle scale-settle on the row; row then animates its collapse into the completed group after a short, readable delay — not instantly, so the user sees what just happened.

**Animation states & timing**
| State | Property | Driver | Value |
|---|---|---|---|
| Checkbox fill-in | opacity + scale (never width/border) | `withSpring(spring.snappy)` — this is gesture-originated (a tap), so per `DESIGN.md` it's spring, not timing | `spring.snappy` (duration 300, dampingRatio 0.8) |
| Row collapse into "completadas" | opacity, then height **only** via the documented absolute-progress-bar exception — here, prefer a `Layout` transition on the list rather than animating height directly | Reanimated `Layout.duration(...)` | **(estimated)** 200–260ms, `easing.easeInOut` |
| Full-day celebration (rare) | Poli mood → `celebrating` | existing mood-change transition already in `PoliMascot.tsx` | `motion.moodChange.duration = 220` (existing token) |

**Gesture behavior:** tap only; no swipe-to-complete in this pass (swipe is reserved for reschedule/delete elsewhere — don't overload the same gesture with two meanings in one list).

**Haptic behavior:** `haptics.success()` once, at the same instant as the visual check (per `DESIGN.md`: haptics accompany a visual change, never substitute for one, never loop).

**Component architecture:** no new components required — extends the existing task-row component and `PoliMascot`'s existing mood prop. The only new piece is a day-completion detector (all visible tasks checked) that sets Poli's mood to `celebrating` once per day, with a guard against re-triggering if the user unchecks and rechecks the last item.

**Reduced-motion fallback:** per the existing `useReducedMotion` hook and `lib/haptics.ts` (which already disables haptics under reduced motion) — keep the opacity/color change that signals state, drop scale/overshoot, use `motion.reduced.duration = 120` (existing token).

**Performance:** everything above runs via Reanimated worklets on the UI thread already; the only addition to watch is list re-render cost when a row leaves the pending group — should use the list's existing key-based reconciliation, not a full re-render of the screen.

### 2. Hoy ↔ Semana transition

**Interaction spec:** a horizontal pan gesture on the main content area (not the tab bar) morphs Hoy's single-day view toward Semana's week view, analogous to Fantastical's week↔month swipe. Tab taps remain available and perform the same transition at `spring.suave` speed instead of following the finger.

**Animation states & timing**
| State | Property | Driver |
|---|---|---|
| Finger-tracked drag | `translateX`/opacity cross-fade of the two pre-laid-out views | directly bound to gesture translation (no spring yet — matches the finger 1:1) |
| Release past threshold | settle into destination view | `withSpring(spring.bouncy)` — momentum is real here (a swipe), so `DESIGN.md`'s rule explicitly allows `bouncy` |
| Release under threshold | snap back to origin view | `withSpring(spring.snappy)` |
| Tab-bar tap (no gesture) | same transition, no momentum | `withTiming` + `easing.sheet` (the token already reserved for sheet-style transitions) |

**Gesture behavior:** Gesture Handler `Pan`, constrained to the horizontal axis, with a vertical-scroll fail/simultaneous rule so it doesn't fight the lists' own vertical scrolling inside Hoy/Semana.

**Haptic behavior:** `haptics.selection()` once, exactly at the commit point where the destination view becomes active — not during the drag (haptics-as-confirmation rule, not decoration).

**Component architecture:** a thin wrapper screen that Expo Router's `Hoy`/`Semana` routes render into, holding both views measured off-screen and cross-fading/translating them; the router's own route change still fires (for deep-linking/back-button correctness) but is driven by the gesture's settled outcome, not the other way around.

**Reduced-motion fallback:** a straight cut (opacity-only cross-fade at `motion.reduced.duration`) with no translateX — gesture is still usable (it controls *which* view appears) but doesn't physically "slide."

**Performance considerations:** both views must be pre-measured/laid out before the gesture starts (no layout thrash mid-gesture); this is the costliest idea of the three and the one most worth prototyping in isolation before committing.

### 3. Breathing voice capture

**Interaction spec:** on entering voice capture, Poli's mood is set to `listening`; a soft ring (opacity/scale pulse, already partially modeled by the existing `motion.pulse`/`motion.ring` tokens) responds to live input amplitude rather than playing a fixed loop, so the surface reads as "listening to *you*," not just animating.

**Animation states & timing**
| State | Property | Driver |
|---|---|---|
| Idle pulse before speech detected | opacity | `motion.pulse` (existing: duration 1200, min opacity 0.4) |
| Amplitude-reactive ring while speaking | scale (bounded range), opacity | driven by live amplitude samples mapped to `motion.ring`'s existing `from`/`to` scale range (0.6–1.7), smoothed, not raw-jittery |
| Stop/confirm | mood → existing confirm state, ring fades | `easing.easeOut`, no haptic beyond the existing tap-to-stop confirmation |

**Gesture behavior:** press-and-hold or tap-to-toggle (whichever the current voice-capture entry point already uses — this concept doesn't propose changing the activation gesture, only what's shown while active).

**Haptic behavior:** one `haptics.light()` on recording start, one on stop — never during, since amplitude-driven haptic buzzing would violate the "never in loops, never per frame" rule verbatim.

**Component architecture:** reuses `PoliMascot`'s `listening` mood; the amplitude ring is a sibling view, not a new mascot state, so it can be iterated on independently of the mascot's own animation code.

**Reduced-motion fallback:** drop the scale-reactive ring entirely; keep a static "listening" color/opacity state change on Poli's face only.

**Performance considerations:** amplitude sampling must be throttled (reading on every audio buffer callback and feeding it straight into a shared value risks over-driving the UI thread) — sample and smooth on a timer in the **(estimated)** 60–120ms range rather than on every raw audio frame.

---

## What this report does not cover

- No dependencies were installed and no application code was changed — all three Phase 5 specs are ready for a build-and-feel pass once approved.
- Several "gap" items above (Duolingo's exact haptic pattern, Streaks' and Day One's exact transition timings, current Fantastical gesture set) were explicitly left unverified rather than guessed, and are flagged inline where they occur.
- A live, device-based comparison (actually installing these ten apps and recording their motion) would sharpen every timing figure above from "estimated range" to "measured" — recommended as a fast follow if any of the three Phase 5 ideas is greenlit for a prototype.
