# In-site Bitcoin courses — outline for sign-off

Status: **Levels 1 and 2 written and in preview only — not committed, not
promoted to production.** The in-site content lives in `lib/course-data.ts`.
Levels 3 and 4 are declared but unpublished, so nothing half-finished ships.
Nothing goes to `main` until the wording below is approved.

Format: each lesson ends in 5 multiple-choice questions with instant feedback.
Levels 1 and 2 are 4 and 6 lessons. Level 1 is 5 questions per lesson (20
published); Level 2 is 5, 5, 5, 7, 5 and 5, giving 32. That is 52 published in
total. Levels 3 and 4 are planned at 3 lessons each (15 questions each), so the
full course is 16 lessons and 82 questions. Every option gets a one-line
explanation, so a wrong answer still teaches something. No score gating — a
learner can always read the explanation, because scaring people off is the
opposite of adoption.

Stance: the course advocates for Bitcoin and for its adoption, and Level 2 ends
on a case for it. It is honest advocacy rather than promotional advocacy, which
is the whole reason a sceptic keeps reading — a course that only confirmed the
reader's priors would teach nothing. Where the technology is failing, the lessons
say so with the same specificity as where it is working, and the quiz answers put
the claim in the correct option and the qualification in the explanation.

Question design rule, applied to every rewrite below: a question must be
answerable by reasoning about a situation, not by recognising the phrasing.
Distractors are beliefs a real learner could actually hold, and the correct
option's explanation names the mechanism rather than restating the answer.

Honesty rule, which matters most in Level 2: each school of economic thought is
stated in the form its own best advocates would recognise, and the current-data
lessons report what the figures actually say even where that cuts against
Bitcoin. A lesson that only confirmed the reader's priors would teach nothing,
and it is the first thing a sceptic checks.

Progress is per browser (Supabase `course_progress` table, keyed on the same
anonymous visitor id as likes). No accounts, no leaderboard, no certificate.

---

## Level 1 — Beginner

### L1.1 What Bitcoin actually is
Covers: the double-spend problem, blocks in order, coins as unspent outputs, fee
= inputs − outputs, the 21 million cap and halvings, satoshis, nodes vs miners,
and what one confirmation actually means.

*Audited on review. The original five tested recall — "what is one satoshi
worth", "how long until final" — with distractors nobody holds. All five are now
scenarios, and the lesson was extended with the UTXO model and the
nodes-validate/miners-produce distinction.*

1. **Someone pays you with a photo of a R10 note, and the same photo is spent
   again. What prevents both from succeeding?**
   A. Every node keeps a ledger of what has already been spent, and rejects a second spend of the same output · B. The bank notes the serial number and blocks the second use · C. A timestamp on the photo decides which payment came first · D. Miners pick one payment and delete the other from the mempool
  **Answer: A** — that is the double-spend rule, enforced independently by every
   node from the same shared history. A is the trusted-middleman answer Bitcoin
   exists to remove; D confuses miner preference with validity, since only one
   of the two can ever be valid.
2. **A café charges 21,000 sats for a coffee. What is that in bitcoin?**
   A. 0.21 BTC · B. 0.00021 BTC · C. 0.0000021 BTC · D. 0.0021 BTC
  **Answer: B** — one bitcoin is 100,000,000 satoshis. The distractors are
   deliberate powers-of-ten slips, so a wrong guess exposes exactly which place
   value went wrong.
3. **Why is the 21 million limit called a hard cap rather than a target?**
   A. Because exchanges promise not to lend out more than exists · B. Because mining output is limited · C. Because the issuance schedule is part of the consensus rules, and changing it would need nodes to accept a different history · D. Because governments signed an international treaty to hold the line
  **Answer: C** — it is enforced by the code every node runs, which makes it a
   cap and not an intention. B and C are promises, not mechanisms; D is a side
   effect, and the cap holds regardless of how much is mined.
4. **An app tells you your balance is 10 BTC. What decides whether that is
   true?**
   A. The exchange whose app it is, because the exchange holds the coins · B. The current price, because a count of coins is only worth what the market says it is worth · C. The wallet software that displays it · D. Every node re-checks the rules against the shared ledger, so the balance is whatever the unspent outputs say
  **Answer: D** — the app is a reader, not an authority. A is a fair answer for a
   *custodial* balance, which is exactly the point: the answer changes when you
   self-custody. What a balance is worth is a separate question, and one the course treats as contested rather than settled.
5. **Your transaction has one confirmation. What has happened so far?**
   A. It is in a block, so reversing it would be very hard, and the coins can still be spent onward · B. It is on the network but not yet in a block · C. It has been paid twice by mistake · D. It is final and those coins can never move again
  **Answer: A** — one confirmation is inclusion, and more blocks make reversal
   progressively harder. The common confusion is finality with frozen funds: a
   confirmed transaction is permanent, and spending those outputs again is normal
   forward progress, not a reversal.

### L1.2 Buying and storing
Covers: custodial vs non-custodial wallets, seed phrases, hot vs cold wallets,
"not your keys, not your coins", backups, and the one mistake that loses
everything.

1. **You write your twelve words on paper, and two years later restore the same
   wallet on a new phone. Why does that work?**
   A. Because the phrase contains a copy of the coins themselves · B. Because the words deterministically regenerate every key and address from one master secret · C. Because the wallet provider kept a copy for you · D. Because the blockchain remembers which devices belong to you
  **Answer: B** — that is deterministic derivation, and it is why one backup can
   restore everything. A is the custodial case; C is wrong because the chain has
   no concept of your devices; D is the most common misconception in the lesson,
   since the phrase unlocks outputs rather than containing coins.
2. **You install an app, tap "create wallet", and it shows you a 12-word
   recovery phrase. Who holds the keys that can spend your coins?**
   A. Nobody, because the coins sit on the blockchain unclaimed until someone spends them · B. The exchange, which holds keys on your behalf and hands them over when you need them · C. You do, because the phrase restores keys on your own device and the app is only an interface · D. The app company, because it generated the phrase on its own servers
  **Answer: C** — a non-custodial wallet. The keys live on your device, so the
   provider cannot move the coins without you. B is the custodial case the
   slogan warns about; C is wrong because coins are unspent outputs controlled by
   whoever holds the key that locks them; D makes an exchange a counterparty in
   the wallet you are using.
   *Rewritten on review: the old version asked what the slogan "refers to",
   which tested recall instead of understanding and repeated the idea that a
   wallet holds coins. The lesson now opens with "a wallet does not hold coins,
   it holds keys" and a four-way taxonomy, so this question can be answered by
   reasoning about the scenario.*
3. **You want a backup that survives a thief, a house fire, and malware on your
   computer. Which one holds up?**
   A. A photo in your camera roll, synced to your cloud account · B. An encrypted note in a password manager on two phones · C. A USB stick in your desk drawer at the office · D. A copy on paper or metal, in two separate physical locations, neither of them online
  **Answer: D** — it survives all three threats at once: no account to
   compromise, and no single place to lose. A and B both put the secret behind a
   login, which is the thing being protected; D survives the fire but not the
   burglary, and is often the only copy.
4. **Why can a seed phrase not be recovered by anyone, including the wallet
   developer?**
   A. Because there is no account, no server copy and no reset, so the phrase is the only key that exists · B. Because exchanges only keep copies for 90 days · C. Because it can only be restored onto the original device · D. Because the words are hashed on the blockchain
  **Answer: A** — recovery is not technically hard, it is structurally
   impossible: there is nowhere to recover from. That is the same property that
   makes the phrase worth protecting. D is the exact opposite of the truth, since
   portability is the point.
5. **You keep savings on a hardware wallet. Which attack does that actually
   stop?**
   A. A company deciding to freeze your account · B. Malware on your computer that tries to sign a transaction draining the wallet · C. Sending to a receiving address you did not mean to use · D. A phishing site that asks you to type your seed phrase into a fake form
  **Answer: B** — the private key stays on the device, so malware can request a
   signature but cannot forge one; it can only watch you approve something. The
   distractors are the failures people wrongly credit to hardware wallets: A is
   still the most effective theft vector and a device cannot detect it, C is
   solved more simply by nobody holding the keys, and D is your own eyes on the
   screen.
   *Q1, Q3, Q4 and Q5 audited on review. The originals were definitions and
   slogans ("a seed phrase is best described as…", "the main advantage of a cold
   wallet"), where the correct option was also the most reassuring one and the
   distractors were obviously wrong. Each is now a situation with a defensible
   wrong answer.*

### L1.3 Spending safely
Covers: verifying payments, fees and stuck transactions, the mempool in plain
English, invoices vs addresses, and the small set of scams that work because
they use real technical words.

1. **A café gives you the address joe@theirshop.com and you send 2,000 sats to
   it. What actually happened?**
   A. The shop signed into a custodial account and withdrew · B. A transaction was broadcast to the public Bitcoin blockchain · C. The address produced a fresh single-use invoice, and you paid that invoice · D. 2,000 sats are now locked to that address permanently
  **Answer: C** — a Lightning address is a human-readable alias that returns a
   new invoice each time, and the payment settles between wallet peers
   off-chain. A confuses it with a reusable on-chain address, D describes the
   opposite of Lightning, and C is a real thing a shop can choose about its own
   keys but is not implied by the address.
2. **Your 10,000-sat transaction has been pending for a day. What is most likely
   happening?**
   A. An exchange is holding it for review · B. The network rejected it as invalid · C. It has confirmed and your wallet is not refreshing · D. It is valid and in the mempool, competing for limited block space at a fee rate below current demand
  **Answer: D** — normal under load. The coins are reserved, the transaction is
   outbid, and it is included when demand drops or you raise the fee. C is
   impossible: an invalid transaction never enters the mempool. B applies only if
   an exchange controls the transaction, which is provider policy rather than
   base-layer behaviour.
3. **Someone in a support chat asks for your seed phrase "to verify your
   wallet". What should you do?**
   A. Share nothing and leave · B. Share only the first six words · C. Send a screenshot with the words blurred · D. Share it, they need it
  **Answer: A** — no legitimate support agent ever needs a seed phrase. Blurring
   words still exposes the rest.
4. **How do you independently check that a payment actually arrived?**
   A. Refresh the app twice · B. Look the transaction up on a block explorer or in your own node · C. Ask the sender · D. Trust the merchant's receipt
  **Answer: B** — verification means reading the chain yourself instead of
   trusting someone's claim.
5. **A confirmed transaction sent 1 BTC. What is still possible?**
   A. The sender can ask a miner to undo it within 24 hours · B. An exchange can
   reverse it on request · C. It stays in history, and those coins can only move
   again if a new transaction spends them · D. It is deleted if nobody confirms
   it further
   **Answer: C** — the ledger is append-only. Spending an output again is normal
   forward progress, not a reversal, and that new transaction is public too. B is
   the distinction that matters here: an exchange can freeze its own customer
   balances, but it cannot edit settled history.
   *Q1, Q2 and Q5 audited on review. Q3 (seed-phrase phishing) and Q4
   (independent verification) were kept unchanged — both already described a
   concrete situation, and their distractors are the exact mistakes a real
   learner is tempted by.*

---

### L1.4 The money question
Covers: fiat versus a supply rule, what the 21 million cap does and does not do,
the real return on cash, and the strongest form of the hard-money argument alongside the check that stops it being a slogan.

Deliberately short, and deliberately pro-adoption. This is the bridge into
Level 2, so the correct answer on every question is the strong Bitcoin case and
the honest limits are taught as things you manage (position size, horizon, adoption risk) rather than as reasons not to hold. Where the standard slogan is stronger than the truth, the lesson says so and then gives the honest version of the argument, which is stronger than the slogan because it does not depend on a forecast.

1. **A newcomer says "gold is scarce too, so what is the point of switching to
   Bitcoin?" What is the strongest answer?**
   A. Bitcoin is rarer than gold, and rarity is all that value needs to be · B. Bitcoin is already accepted as legal tender almost everywhere, so it is the safest place to keep money today · C. Bitcoin transactions are free, which is why it beats gold on cost · D. Gold's scarcity depends on people choosing not to mine more, while Bitcoin's cap is a rule every node checks, so no bank or government can dilute what you hold
  **Answer: D** — that is the difference that does the work. Gold is genuinely
   scarce, but nothing stops more being produced if that becomes profitable, so
   its scarcity depends on incentives nobody can rule out. Bitcoin's limit is enforced by consensus,
   which makes it a fact about the system rather than a promise about someone's
   behaviour. A is the trap this question exists to catch: scarcity alone is not
   money, and a rarity nobody has agreed to accept is a curiosity. C confuses
   legal tender, which is a weakness rather than a strength, with adoption. D is
   simply false, since on-chain transactions cost money and Lightning exists for
   exactly that reason.
   *Rewritten on review: the original asked what was missing from the claim
   "Bitcoin is money because nobody can print more of it", and the graded answer
   was that Bitcoin's acceptance is far narrower than the rand's. That is a true
   and useful point, but making it the one correct answer taught the first
   economic lesson of the course as a diminishment, in a lesson whose job is to
   hand the learner to Level 2 ready to hold the asset. The acceptance point now
   lives in the prose, framed as the frontier and the frontier's work rather than
   as a shortfall.*
2. **Your savings account pays 7% while consumer prices rose 4.4% over the year.
   What happened to what you can buy?**
   A. Roughly 2.6% a year more purchasing power, before tax · B. About 11.4% a year less purchasing power · C. It depends only on the exchange rate against the dollar · D. Nothing, the interest rate is the number that matters
  **Answer: A** — real return is roughly the nominal rate minus inflation, and it
   is a rough instrument rather than a promise. C is the classic error of adding
   the two numbers instead of subtracting them, which is expensive. D confuses one
   channel of imported prices with the prices the reader personally pays.
3. **Bitcoin's supply is fixed by protocol. A government can issue more rand. What
   follows from that difference?**
   A. The two will move together, because supply is the only thing that determines a price · B. The rules governing the two supplies differ, so the two assets do not carry the same risk · C. That 21 million against unlimited fiat issuance makes appreciation close to arithmetic, so scarcity does the work · D. The rand will be worthless within a year
  **Answer: B** — that is the actual consequence: a different supply rule means a
   different risk profile, and it is a statement about risk rather than a promise
   about direction. A is a cartoon that no school holds. D is the strong version of the scarcity argument, and the outline does not dismiss it: a fixed quantity facing an expanding one should appreciate in real terms over a long horizon, which is a serious claim. What D asserts as arithmetic is a long-run expectation in most schools' hands, and monetarists and Keynesians would both dispute that the supply side is the whole mechanism. The disagreement is real and the outline states it rather than settling it.
4. **Someone explains Bitcoin as "it is up because inflation is high." What is the
   strongest way to handle that claim?**
   A. Accept it, because it is the standard argument · B. Ask the person to prove inflation is not real · C. Treat it as a slogan rather than a mechanism: inflation erodes the wages you are paid in, which is the reason to hold something no institution can expand, and you test that over a full cycle rather than one good or bad year · D. Agree, because hard money always wins in the long run
  **Answer: C** — this is the honest version of the argument, and it is stronger
   than the slogan because it does not depend on a forecast. The case rests on what you hold over years and on position size rather than on timing. D is the tempting one
   to accept and it is the weakest: "always wins" cannot be checked against any
   record, and it is not what the hard-money argument claims.
   *Rewritten on review: the graded answer used to be a check on dates, which taught a good habit but made the payoff a deflation. The lesson no longer argues from any recent record, so the answer states the mechanism and argues the case.*
5. **A beginner asks whether Bitcoin is a "safe" place to keep savings. What is the
   honest and useful answer?**
   A. It depends mainly on which exchange you keep it on · B. Yes, it is safe, because the supply is capped · C. No, it cannot be safe, because nothing obliges anyone to keep holding it · D. The supply rule is fixed and verifiable, so no institution can dilute it, and the real risk is adoption, which you manage with position size and time horizon
  **Answer: D** — that separates the two questions properly: the dilution risk is
   answered by the design, permanently and without anybody's cooperation, and the
   adoption risk is the reader's to size. A is the overstatement that gets the whole argument dismissed, C is a verdict on uptake rather than on the design,
   and D is about custody risk, which is a different topic and one Level 1.2
   already covers.
   *Rewritten on review: the graded answer used to be a limitation rather than an answer. The lesson now states the adoption risk in the explanation and turns it into the thing the reader actually does about it.*

---

## Level 2 — Money & Economics

The user's brief was "the current state of fiat, the standard of living, and the
different schools of thought", with Bitcoin assessed against all of it rather
than assumed to win. Four lessons, 20 questions.

### M2.1 What money actually is
Covers: the three jobs of money, money as a bank liability rather than a pile of
notes, deposit creation on loan approval, why the textbook money multiplier
oversells the story, and state backing versus voluntary acceptance.

1. **A bank approves your bond and credits the amount to your account. That
   balance did not exist a moment earlier. Where did the money come from?**
   A. The bank created it, as the deposit side of the loan it just made · B. It was moved from a savings account into your transaction account · C. It was taken from someone else's account and reassigned to you · D. The central bank printed it and passed it to the bank
  **Answer: A** — a loan is an asset for the bank and a liability to you, created
   together, and that is the mechanism behind most new money in the economy. C and
   D are both transfers, which cannot create a balance that did not exist and
   leave the total unchanged.
2. **A textbook says a 10% reserve requirement gives a money multiplier of ten, so
   R1,000 of reserves should create R10,000. A researcher measures a far smaller
   result. What is the fairest conclusion?**
   A. Banks are required to hold 10% and simply decide not to lend it · B. The multiplier ignores what actually limits banks: capital, funding, liquidity and whether anyone wants to borrow · C. Banks are secretly creating counterfeit money · D. The textbook is right and the researcher made an error
  **Answer: B** — this is a genuine and still-unresolved disagreement, and the
   binding constraint in practice is bank capital and funding rather than a
   reserve fraction, which is zero in several countries. B misreads a requirement
   as a floor on lending rather than a minimum holding, and D describes licensed,
   disclosed deposit creation as though it were fraud.
3. **A central bank buys R1bn of government bonds from a commercial bank. What did
   that directly create?**
   A. R1bn of cash that households can spend immediately · B. R1bn of new household credit · C. R1bn of reserves held at the central bank · D. R1bn of tax revenue for the government
  **Answer: C** — that is the direct effect, and the gap between reserves and
   money is why "printing money" is looser language than people assume. Household
   money appears later and only if the bank lends or spends, which is A and C, and
   a bond purchase is not a tax, which is D.
4. **R100 in cash and a R100 account balance both work at the shop. Why is the
   balance usually the more important of the two?**
   A. Cash loses value faster than a balance does · B. Cash is not legal tender and cannot be used for debt · C. Banks are required to accept more cash than notes · D. Most of the money stock is a bank liability rather than physical notes, so the balance sheet is the real money system
  **Answer: D** — this reframes a lot of arguments, because when people say
   "money supply" they usually mean bank liabilities, which is why a bank run is a
   monetary event and not just a banking one. D is the key confusion to head off:
   both are claims in the same currency, so depreciation hits them identically.
5. **A tax authority will only accept payment in rand, and will not take Bitcoin.
   What does that establish?**
   A. It establishes that rand has state backing behind it, and Bitcoin has to earn its value through voluntary use · B. Bitcoin will replace the rand within five years · C. Bitcoin is not money, because money is whatever a state will take · D. The tax authority is acting unreasonably
  **Answer: A** — money and legal tender are not the same thing, and a state
   currency carries the state's ability to compel payment, which is a real
   advantage. Bitcoin lacks that backing entirely, which is both its weakness and
   the source of the property that interests people. A reduces money to one source
   of demand, and D is a timeline this course will not invent.

### M2.2 Five schools, one problem
Covers: Austrian (Mises, Hayek, Rothbard), Keynesian, monetarist (Friedman),
neoclassical and rational expectations, and MMT — each in its strongest form —
plus where they genuinely agree and how to use a school as a tool rather than an
identity.

1. **An Austrian and a Keynesian economist both study the 2008 financial crisis.
   What is the real difference between them?**
   A. They use different definitions of money and therefore cannot compare notes · B. Keynesians traced it to a collapse in effective demand; Austrians traced it to credit expansion that misdirected capital into projects that never worked · C. Keynesians believe banks caused it and Austrians blame governments · D. They disagree about whether the crisis happened
  **Answer: B** — same event, different causal story, therefore different remedy.
   This is what a genuine disagreement about mechanism looks like, and it is why
   the argument cannot be settled with a citation. A would be easy to resolve, and
   D mis-assigns blame the Austrians do not assign that way.
2. **A monetarist says inflation is always and everywhere a monetary phenomenon. On
   that view, a large tax rise with the money supply held constant should push
   prices…**
   A. Nowhere, because taxes have no effect on prices · B. Up, because taxation always creates money · C. Down, because cutting nominal demand is what cools prices in a monetarist model · D. Up, because every government action is inflationary
  **Answer: C** — this follows from money neutrality: real decisions respond to
   real rates and real spending. A monetarist would expect an effect of some kind,
   and the point of the question is that the sign follows the model rather than
   general intuition, which is exactly what makes D a caricature.
3. **An MMT economist says a government issuing its own currency can never run out
   of money, but can run out of things. What follows?**
   A. Countries sharing a currency such as the euro cannot run out of money either · B. A government can print unlimited real goods if it is determined · C. Taxes are a form of money printing · D. Printing can generate demand for goods that do not exist, which shows up as inflation or as a collapsing currency
  **Answer: D** — this is MMT's sharpest insight and also where its critics press
   hardest: the constraint is real resources and external balance, and the
   adjustment arrives through prices or the exchange rate rather than a printing
   failure. A is the misreading the whole school exists to refute, and C inverts
   MMT's own account of what taxes do.
4. **Which of these is closest to genuine common ground across the five schools?**
   A. Money is not a scarce good like a metal, and central bank actions are consequential · B. All inflation is caused by private banks · C. The 2008 crisis was caused by a shortage of houses · D. The economy should be run by published rules only
  **Answer: A** — on the scarcity point the schools are close to unanimous, which
   is why the Austrian criticism of gold-standard thinking applies to gold itself.
   The real argument is over the sign and the mechanism, not over whether policy
   matters. C is the sharpest split in the set, and D is close to a single school's
   position rather than common ground.
5. **Someone concludes "the Austrian school won, because Bitcoin has a fixed supply
   and national currencies do not." What is the best response?**
   A. That is correct, and it settles the debate · B. Monetarists have argued for
   rule-based money for decades, so attaching Bitcoin to one school narrows what
   has to be true and weakens the case · C. Bitcoin is Austrian economics with the
   theory removed · D. Monetarists oppose any fixed cap
   **Answer: B** — this is the persuasive form of the argument. The hard-money
   instinct is older and broader than Austrianism, so the interesting question is
   whether a hard cap delivers, not which economist guessed it first. D misstates
   the position: monetarists generally favour constraining discretionary money
   creation, and the real difference is degree and mechanism.

### M2.3 Fiat and the cost of living, right now
Covers: a dated snapshot of 2026 inflation in South Africa, the United States and
the euro area; what the central banks themselves say is causing it; what it costs
a South African household; and an honest ordering of the claims one can make
about fiat. Every figure is dated and every source is linked on the page.

Current figures, all checked on 26 September 2026:

- **South Africa** — 4.4% in August 2026, from 4.3% in July and 5.0% in June
  (Stats SA). Target is 3% with a ±1 point band, so 4.4% is above the top of the
  band. The SARB raised its policy rate 25bp to 7.25% on 23 September, effective
  the next day, and expects inflation above 5% this year and early next before
  easing back towards 3% by late 2027.
- **United States** — 3.4% over the year to August, core 2.4%, energy +16.3%,
  gasoline +27.4% (BLS). The Fed raised its target range to 3.75%–4.00% on
  16 September, its first increase since 2023, under chair Kevin Warsh.
- **Euro area** — 3.2% in August, from 2.9% in July and 2.0% a year earlier, with
  energy at 14.3% (Eurostat). The ECB raised all three key rates 25bp on
  10 September, taking the deposit facility to 2.50%.
- **Money supply** — US M2 was about $23.2 trillion in July 2026 against roughly
  $22.0 trillion a year earlier, so money grew faster than consumer prices. This
  is why the lesson refuses to say money is irrelevant, and equally refuses to
  say it is the whole story.
- **Household costs (South Africa)** — the Competition Commission's third Cost of
  Living Report has electricity +8.1% and water +10.1% year on year, petrol +26%
  and taxi fares +13% between January and July 2026, and six-year cumulative
  petrol inflation of 62.9% against 36% headline. Food plus housing is 66.8% of
  the budget in the lowest income decile.

1. **A headline says South African inflation rose to 4.4% in August 2026. What is
   the most useful thing to do with that number?**
   A. Assume your own costs rose 4.4% as well · B. Ignore it, since inflation is measured by the government · C. Compare its basket against your own, because fuel, electricity, water and taxi fares all rose faster than the average that year · D. Conclude that the rand has no value
  **Answer: C** — the CPI is a national average over a fixed basket, so it is the
   starting point for your own calculation and never the answer to it. A is the
   most common error in personal finance, and D converts a serious erosion into a
   cartoon, which is how people talk themselves out of a real problem.
2. **In 2026 the Fed, the ECB and the SARB all raised interest rates, and none was
   running a stimulus programme, yet inflation stayed above target everywhere. What
   does the simplest "money printing causes inflation" story conclude?**
   A. It shows the rate rises will fix it · B. It is confirmed, because prices went up · C. It cannot be evaluated, because inflation is too complex · D. It is not confirmed by this period, which is why the leading explanation is the energy shock rather than money printing
  **Answer: D** — this is the discipline the data imposes, and it is the whole
   point of the lesson. The named causes are the ones the central banks themselves
   cite. A is a theory that predicted a cause which was not operating, and C is a
   reason to be careful rather than a reason to stop checking.
3. **Food and housing together take two-thirds of a household's budget. Prices
   rise 4% and their income rises 2%. What happens to them?**
   A. They are roughly 2% worse off, and there is no discretionary spending left to cut · B. They should put savings into Bitcoin · C. They are 2% better off, because income rose · D. Nothing, because inflation figures are averages
  **Answer: A** — a household whose budget is nearly all essentials has no internal
   buffer, so it has to earn more or consume less. C is how people in this
   position get mismeasured, and D may be a reasonable hedge decision but does not
   follow from the arithmetic — and Bitcoin is not what pays for fuel, electricity or food, so it is not a substitute for necessities.
4. **Someone says "inflation is a tax on cash holders." Which version of that is
   actually accurate?**
   A. It is a literal government tax, with a rate and a bill · B. Holding cash loses
   roughly 3% to 4% of purchasing power a year against consumer prices, and no
   individual decided it · C. It only affects people without a bank account · D. It
   applies equally to shares and property
   **Answer: B** — that is the arithmetic behind the metaphor, and the incidence
   falls hardest on whoever holds the currency when the loss happens, which is why
   the same person can be helped and hurt by inflation depending on what they hold.
   A is a literalism the metaphor never claimed, and C confuses ease of avoidance
   with exposure.
5. **A bank account pays 7% while consumer prices rose 4.4% over the year. What can
   you actually conclude?**
   A. Real returns cannot be calculated at all · B. You are 7% richer · C. The approximate real gain is about 2.6% a year, before tax, and only if you genuinely earn that rate net · D. The bank is overpaying and will fail
  **Answer: C** — real return is roughly nominal minus inflation, which is a rough
   instrument rather than a promise, and the caveat about the net rate is the
   honest part. A reports what was credited rather than what it can buy.

### M2.4 Bitcoin in this picture
Covers: the one property that is verifiable, **the distinction the whole argument
turns on** (money versus price, and inflation as a supply phenomenon), **what the deflationary proposition actually claims and what it does not claim**, including the step from scarcity to price on which the schools are not unanimous, why that is
not a contradiction, **why the supply rule was written in 2008**, how it has
measured since as a monetary proposition, and the strongest honest bull and bear
cases side by side. Seven questions, because the distinction needs its own.

The `table` field on `LessonSection` (`{ head, rows, note? }`) still exists in the
lesson-page renderer, but M2.4 no longer uses it. The drawdown table and the
market-price figures were removed on the user's instruction. The lesson now argues
the case from the supply rule, the 2008 monetary expansion and the monetary-crisis
test cases, and states the bull and bear cases as limits on the argument rather
than as forecasts about outcomes. Keeping the distinction between money and price is
what lets the same lesson be advocacy and be accurate at the same time.

The 2008 material is the addition that carries the adoption argument, and it is
deliberately sequenced so it does not overclaim. The design brief is documented
— whitepaper posted 28 days after Lehman, genesis block headlining a bank
bailout, Satoshi's February 2009 "root problem with conventional currency is all
the trust that's required to make it work" — but the lesson then concedes that adoption was negligible for years and that the monetary test cases arrived much later, with Cyprus in March 2013 and the unlimited-printing pledge in March 2020. Claiming 2008 as proof of any particular outcome would be the weakest version of this argument, so the lesson does not make it.

1. **About 20 million bitcoins exist out of a maximum of 21 million. What does that
   establish?**
   A. Mining is nearly over, so the network's security must be about to collapse · B. The remaining million can be produced quickly by anyone who wants them · C. 20 million is close enough to 21 million that the difference is irrelevant · D. The total supply is knowable in advance and enforced by rules that every node checks, not by a decision anyone makes
  **Answer: D** — that is a structural property, and it is verifiable rather than
   promised. The two most tempting wrong answers are the symmetry error in C and
   the countdown in D: security comes from hash power paid in new coins and fees,
   so as issuance falls the fee market has to take over, which is a real design
   question rather than a collapse.
2. **Your salary is paid in a currency that expands every year, and you hold a
   fixed-supply asset instead. What does the monetary argument actually claim for
   you?**
   A. That your earnings are denominated in money someone else can dilute, and a supply rule nobody can change removes that one source of dilution · B. That inflation and a fixed-supply asset are unrelated, so the comparison is meaningless · C. That a supply cap guarantees your savings grow · D. That a fixed supply guarantees the asset appreciates
  **Answer: A** — this is the precise version, and it is narrower than the slogan.
   You have not removed adoption risk or the risk of being early. You have removed
   your exposure to monetary expansion, which is the one component of holding cash
   that is decided by other people. C is the commonest version and is simply wrong:
   a fixed supply removes an issuer, it does not create a holder. D is the failure
   mode here, because declining to run the comparison is what leaves the argument
   untested.
   *Rewritten on review. The original question compared bitcoin's price against
   consumer prices, which made the answer a statement about a single period and
   quietly conceded the argument it was meant to teach. It now asks what the
   monetary proposition licenses you to claim, which is the distinction the lesson
   is built on.*
3. **A central bank expands its money supply during a crisis while the Bitcoin
   supply rule stays exactly as written. What does the fixed rule tell you, and what
   does it not tell you?**
   A. That Bitcoin will hold its position against that expansion · B. That Bitcoin's
   own supply cannot be expanded in response to anything, and that whether anyone
   comes to hold it is a separate question the rules do not answer · C. That the
   problem is solved, because money growth is what caused the crisis · D. That
   Bitcoin and a fiat currency are now equivalent, because neither can be inflated
   **Answer: B** — those are two different claims and only one of them is settled by
   the protocol. The first is verifiable today by any node. The second is
   behavioural and unfolds over time, which is why the honest argument leans on the
   first and treats the second as a judgement. A is the instinct to read a supply
   rule as protection in every direction, and "hold its position" is exactly the
   part that has to be argued rather than derived. C mistakes a reasonable suspect
   for a complete cause, and a rule constraining one asset's supply is not a remedy
   for a currency problem. D confuses a cap on dilution with equivalence: it
   confers none of the other properties money needs, and it does not make one unit
   equal to a unit of a currency somebody else issues.
   *Rewritten on review. The original question was about rising rates and a sharp
   fall, so the lesson was still being taught through an outcome it explicitly
   refuses to forecast. The new question asks which half of the claim is settled by
   the rules, which is the distinction the whole lesson turns on.*
4. **A beginner is told "bitcoin is an inflation hedge, so it is a safe place for
   your savings." What is the most important omission?**
   A. Nothing, the statement is accurate as written · B. That the 21 million cap is only a promise made by developers, and could be changed whenever they wanted · C. That a fixed supply says nothing about whether anyone will be holding it in ten years, and that is the part that decides the outcome · D. That inflation no longer exists as a phenomenon
  **Answer: C** — this is the omission that matters, because "safe place for your
   savings" is a claim about the path, not about the supply schedule. If the money
   has to exist on a particular date, being early is a real risk regardless of the issuance rules. B is the false belief that the cap is a promise rather than a
   consensus rule, and it inverts the one property that is genuinely verifiable.
   *This question was rewritten on review: the original option A stated the right
   idea while being marked wrong, with an explanation that told the reader to pick a
   different option. A question cannot argue with its own answer key.*
5. **What is the strongest honest reason to hold bitcoin?**
   A. It has gone up for more than a decade · B. Banks want it to fail, which proves it matters · C. The supply can never change, so the price can only move in one direction · D. Its supply cannot be increased by any institution, and that rule is public, auditable and enforced by the network, so whether it matters is a judgement you make
  **Answer: D** — a verifiable property plus a decision about value is exactly why
   it is defensible, and it does not require a forecast. A is the scarcity argument at its strongest and gets a straight answer rather than a dismissal, because a fixed quantity facing an unlimited one is the core of the hard-money case. It is incomplete in one specific way: the same supply-and-demand model treats demand as the other half, and the demand side is behavioural. So the rule is verifiable and the conclusion is a judgement. C is the weakest available reason, and D is the logical fallacy that opposition proves correctness. The correct answer also does not require the economics to be unanimous, which is the point of stating it this way.
6. **A friend says a fixed supply means bitcoin cannot be diluted, so it is a safe
   place for savings. What is the strongest response?**
   A. The supply rule is real and removes issuer discretion, but it says nothing about what the asset is demanded for, and it does not hedge you in any particular period · B. That is right, because a fixed supply rules out the main way money loses value · C. That a fixed supply is only a promise made by developers · D. That savings held in a fixed-supply asset are risk-free
  **Answer: A** — this separates the structural part from the market part. The
   supply claim is verifiable and permanent. The value claim is not, and conflating
   them is how the argument gets oversold in both directions. A takes a true
   premise and swaps it for a false conclusion, which is the most common form of
   this error. C is the one thing bitcoin is not: the cap is enforced by consensus
   rules that every node checks independently, so changing it would take
   overwhelming the network rather than editing a file. D is plainly false because adoption is a real risk, and a monetary argument can be correct while nobody comes to hold the asset.
   *Rewritten on review. The original question asked about cycle recovery
   statistics, so the correct answer was a base rate and the lesson's argument came
   to depend on a pattern nobody had asked for. The point of the question is the
   limit on the claim, which is what the lesson now teaches.*
7. **Bitcoin's network went live on 3 January 2009, weeks after Lehman Brothers
   failed and a $700 billion bank bailout was signed. What does that timing tell
   you?**
   A. It proves bitcoin and the dollar move together, because both came out of the same response · B. The cap and the no-intermediary rule were answers to what 2008 showed, which is that losses were socialised while savers carried the risk, so the design brief is documented even though the price evidence only arrived years later · C. Nothing, the date is a coincidence and the supply rule could have been any number · D. It proves the early buyers were exploiting the crisis, so the asset is tainted
  **Answer: B** — a specific failure produced a specific design, which is a real
   reason to take the rules seriously, and the concession in the option matters as
   much as the claim: adoption was negligible for years, and the monetary test cases came from Cyprus in 2013 and the unlimited-printing pledge in 2020. A dismisses a
   documented brief, C inverts the moral of the story, since the counterparty to that
   rescue was the taxpayer rather than the early holder, and D confuses a shared origin with a shared monetary policy.
    *Added on review, from the user's question about what happened in 2008. The
    correct option is written so that a learner cannot read it as "2008 proves
    bitcoin goes up" — the lesson claims the design brief and disclaims the timing.*

### M2.5 The hardest money yet
Covers: money defined by the jobs it does rather than by intrinsic value, **the
eight-step history of money from shells to a hard-capped protocol**, the properties
that decide which money survives (supply rule, verifiability, divisibility, unit of
account, counterparty risk, blockability), the sound-money economics stated properly
— Menger on marketability, Mises on the regression theorem, Gresham's law in its
accurate form including the 1965 half-dollar episode, Hayek on competing private
currencies, Ammous on stock-to-flow — **what Bitcoin actually changes about payment
rails** against cards, wires, SWIFT, FedNow/Pix/UPI and Lightning, **the honest case
that fiat technology is also improving**, the adoption data that is already
measurable, and where the strong version of the argument fails. Eight sections,
18 minutes, four comparison tables, nine sources.

Written on request to explain money's historical transformations, its roles against
current economic standards, the sound economics, the technology improvement
against fiat, and what is actually being adopted now. Three deliberate choices:

* **The intrinsic-value argument is dismantled in the first section.** The lesson's
  strongest pro-Bitcoin move is turning the commonest objection on its head: the
  test would rule out fiat too, and no money has ever had the intrinsic worth
  the argument requires.
* **The classic mechanisms are used at full strength, not quoted as caveats.** The
  regression theorem and Gresham's law are both stated accurately and then used
  in the form that favours Bitcoin: the theorem describes spontaneous emergence
  rather than issuing a test, and bitcoin meets the one requirement it imposes
  because the 2010 pizza seller spent fiat to acquire bitcoin, establishing a
  prior exchange value first. On Gresham, the classic mechanism required a
  government-set face value, evidenced by the 1965 half-dollar, so what transfers
  is the holding behaviour, which is the "Nakamoto-Gresham" prediction that fiat
  gets spent and bitcoin gets saved. Both questions were tightened on review after
  the first drafts made the correct option a concession; the qualifications now
  live in the explanations, where they inform the reader instead of opening the
  answer against itself.
* **Fiat is credited where credit is due, and then the credit is shown not to
  reach the monetary question.** Pix, UPI and M-Pesa are named as among the
  decade's most important financial innovations, and the CBDC results — eNaira at
  98.5% of downloaded wallets unused, the Sand Dollar at 0.4% of physical
  currency, e-CNY reclassified in January 2026 as an intermediary liability after
  failing to displace Alipay and WeChat — are used to make the narrow point that
  better plumbing and a fixed supply are separate questions.

The adoption section leads with institutional and sovereign allocation, because
those decisions are unconditional by construction, and the table's note
carries the two counterweights: ETF and treasury holders do not hold the keys, and
non-El-Salvador sovereign holdings are estimates rather than public audits.

Questions:

1. **Someone rejects bitcoin with this argument: "Gold has intrinsic value and
   bitcoin has none, so bitcoin is not money." Which response engages the argument
   properly?**
   A. Money is defined by the jobs it does, exchange, account and store of value, and the metals that became money were valued for scarcity and marketability, which are the same two properties Bitcoin is being asked to supply with the addition of a publicly verifiable supply rule · B. They are right, which is why gold and fiat are the only real money and bitcoin is a commodity · C. They are right about the premise, and you should wait for bitcoin to gain intrinsic value before treating it as money · D. The argument is circular, because it assumes money needs intrinsic value in order to be valued
  **Answer: A** — the intrinsic-value test would rule out every money ever used,
   including gold and paper, which is why the argument sounds stronger than it is.
   C is a fair criticism but only a dismissal, since it offers no way to compare
   one money with another. A treats a premise nobody needs as a precondition, and
   D applies a test that fiat also fails.
2. **You are paid in rand and deciding how to hold savings. Gresham's law says
   "bad money drives out good". What does it actually predict here?**
   A. Bitcoin will eventually drive the rand out of circulation entirely, so switch
   now · B. Spend the money you earn and hold the money whose supply rule you can
   verify, because the overvalued medium keeps getting spent while the scarce one
   gets saved · C. Nothing, because the law only ever applied to coinage and says
   nothing about a digital asset · D. It means you should never spend anything,
   only hoard, since spending always circulates the weaker money
   **Answer: B** — the option leads with the mechanism rather than with its own
   caveat, which is deliberate: the strongest reading of this law for a bitcoin
   holder is the behaviour it predicts, and the 1965 half-dollar episode supplies
   the precedent. Precision is kept in the explanation rather than buried in the
   answer, so the reader gets the claim and the qualification together. A is the
   version people repeat and the law has never predicted a currency's
   disappearance, C is technically pointed and practically empty because the law
   is about relative overvaluation, which is exactly the situation, and D inverts
   the mechanism.
   *Tightened on review. The first draft made B the accurate-but-hedged option
   and led with "the classic form needs a government-fixed face value", so the
   correct answer read as a set of objections. The answer now states the
   prediction and the mechanism, and the 1965 precedent, and the qualification
   about the transfer from legal mechanism to holding behaviour lives in the
   explanation.*
3. **Mises' regression theorem says money cannot appear out of nothing: a good must
   already have been valued and directly traded before it is used as a medium of
   exchange. Bitcoin was created deliberately. What does that argument actually tell
   you?**
   A. That the theorem only applies to goods with intrinsic use value, so scarcity-based money is exempt from it entirely · B. That it needs institutional backing to become money, and that the ETF, treasury and reserve allocations are what will supply it · C. That bitcoin satisfies the condition rather than breaking it, because it was valued and directly traded before it was used as money, and the theory is not a test of whether a good can be designed · D. That early buyers were betting on a market that did not exist yet, which makes the first decade the weak part of the thesis rather than the strong part
  **Answer: C** — this is the strong reading, and it is Pickering's. The theorem
   has one requirement, a prior exchange value, and it was met on 22 May 2010 when
   the forum seller spent fiat to acquire 10,000 bitcoin expecting to trade it on
   to someone who wanted pizzas. On this reading the theorem was never an account
   of how money originates, so bitcoin is not the counter-example it is often said
   to be, and Pickering says the threat has been significantly overstated. A is the
   dangerous one, because it sounds like a celebration of institutional adoption
   while quietly accepting that money needs an issuer, which is the opposite of the
   thesis. C is the genuine bear objection about early buyers, kept because a
   course that dodged it would be worthless, and the answer notes that the risk was
   price rather than monetary design. D is the clever-sounding loophole that
   misstates the condition, since the theorem is about prior exchange value, not
   prior use value.
   *Corrected on review. The previous prompt asserted that the theorem says money
   "cannot emerge from barter without a prior market", and the correct answer then
   built on the misreading that Bitcoin is outside the theorem's scope because it
   was engineered rather than emergent. Both halves were wrong, and the error ran
   through the prompt, the correct option and the explanation at once. The prompt
   now states the theorem's actual single condition, and the correct option is the
   affirmative claim that bitcoin satisfies it. That is the pattern applied across
   this lesson: the correct answer carries the claim and the explanation carries
   the qualification, so a reader who answers
   correctly finishes the question more convinced rather than less, and still
   learns the thing that would change their mind.*
4. **You tap a card to pay for a coffee and the money leaves your account
   immediately. What has actually happened?**
   A. Both banks have swapped the money instantly and the delay is only in the paperwork · B. The merchant has been paid in central bank reserves, which is why it is instant · C. The merchant has your money and cannot take it back · D. Your bank has authorised a promise to the merchant's bank, the two banks settle in a later batched cycle, and the amount can still be reversed for months, for a percentage fee that exists largely to pay for that reversibility
  **Answer: D** — this is a good design for a consumer refund, and the fee and
   the delay are the price of it. A mistakes a claim for a transfer, C mistakes
   settlement for paperwork, and D confuses card settlement, which happens in
   commercial bank money, with the instant central-bank settlement of FedNow and
   RTP. The section this sits in is the rails argument, and it is deliberately
   non-monetary: it does not need the supply cap to work.
5. **Which is the strongest evidence that non-sovereign money is genuinely being
   adopted, and what does that evidence not prove?**
   A. Institutional and sovereign allocations, including a US Strategic Bitcoin Reserve legislated not to be sold and about $109bn in listed ETFs, and what it does not prove is that ordinary people hold it as money, since ETF and treasury holders do not hold the keys and reported holdings outside audited disclosures are estimates · B. The share price, which shows investors are willing to pay a premium for this property · C. The number of people who say they own it, which is the direct measure of adoption · D. Hashrate, which proves the network is secure and therefore that the money works
  **Answer: A** — separating the strongest evidence from its own limits is the
   point, and the option's concession is what makes it correct. Institutional
   allocation is unconditional by construction and is being made by
   institutions that cannot be compelled, which makes it the most durable signal;
   the boundaries are that wrapper ownership is migration rather than custody by
   choice, that the non-El-Salvador sovereign figures are estimates, and that daily
   payment numbers remain tiny against global payments. A is the weakest evidence because it confuses a momentary figure with durable demand, C measures awareness rather than use since ownership surveys are
   self-reported balances, and D proves the security budget is funded, which has
   never been the weak link in the argument.
   *Also reworked on the same instruction. The correct explanation previously ended
   on a limitation; it now states the limits and then lands on the affirmative
   point, which is that what is being expressed at scale is demand for a store of
   value whose supply rule a holder can verify, and no other widely held asset
   offers that combination.*
   *The lesson's final section is a list of six things the strong version cannot
   establish: that fixed supply does not imply adoption, that the unit of account
   is still weak, that custody is the soft spot in the adoption numbers, that
   hashrate is geographically concentrated in the United States, that stablecoins
   and CBDCs are real competition, and that the defensible claim is a bet on adoption, which is not guaranteed. An openly pro-Bitcoin course
   that ends on those six is the reason the rest of it is worth reading.*

### M2.6 The world this builds
Covers: what the argument is actually for, **what inflation and concentrated money
creation do to ordinary people**, what people do when their money stops working,
**what "accessible" has to mean as a concrete list of conditions**, the honest
access gap that is the real bottleneck, what has to be built and by whom, what
fair use means, and the reader's own role. Eight sections, 20 minutes, two tables,
ten sources, five questions.

Added on request, as the course's closing argument, and it is the advocacy
lesson. Four editorial decisions worth signing off on explicitly:

* **The corruption argument is made structurally, not personally.** The lesson
  does not allege that any named official is corrupt, because that claim is
  unfalsifiable and collapses when the people change. It argues that concentrating
  the authority to create money in a few unelected institutions creates a standing
  asymmetry between the issuer and the saver, and that the asymmetry produces bad
  outcomes without requiring bad intent on any given day. The 2008 rescues, the
  2001-2002 Argentine deposit confiscation and the 2019 $200-a-month dollar cap
  are the evidence. The lesson states plainly that this is the *stronger* version
  of the argument, because the answer is to remove the discretion rather than to
  request better behaviour, and question 2 makes the correct answer that version.
* **The access gap is reported at the same level of detail as the successes.** A
  27% first-try seed-phrase backup success rate across 847 first-time users in
  six countries, 41% of them photographing the backup, 34% of apparent successes
  containing a wrong word, 35% of 1,000 US holders having lost wallet access,
  120 million verified Coinbase users against 22 million MetaMask monthly
  actives. A course asking to be trusted cannot bury the numbers that embarrass
  it, and the same section reports that a five-step change to one screen took
  backup success from 27% to 81% and verified restoration from 66% to 96%. That
  last fact is what makes the lesson's optimism defensible rather than naive: the
  failure is measured, understood, and already solved in prototype.
* **Fair use is stated as constraints, not slogans.** Tell the truth about the
  price, do not promise what the technology cannot do, teach custody before the
  money arrives rather than after the loss, declare the tax position rather than
  coach evasion, and do not treat disagreement as hostility. One bullet says
  plainly that building an alternative which only persuades people who already
  agreed is a club, not adoption.

The "what has to be built" table is deliberately unflattering: it lists six builds
and concedes that most of them are not Bitcoin's to do, including the last mile,
where M-Pesa's 381,000 cash agents have no Bitcoin equivalent and services are
already bridging Lightning into M-Pesa wallets instead. Convergence, not conquest.

* **The lesson reports the evidence that cuts against it, including from its own
  sources.** This was added after a source audit and it is the decision I would
  most want signed off, because it is the one that costs the argument its
  easiest points. Chainalysis's Latin America report — the single best adoption
  case in the course — also says balances held with services rose to 71.2% by
  June 2026 while self-custodied balances fell 66.7% against 28.0%, in a section
  the report itself titles the personal wallet giving way to the platform. The lesson does not excuse that with a market explanation: in the region with the most Bitcoin users custody is consolidating with companies. The lesson also quotes the UX
  researchers' conclusion that the failure is engineering rather than education
  and that a good enough custodial experience creates inertia no teaching
  overcomes, and that no company reports how many users ever migrate, with the
  evidence suggesting most do not. That directly contradicts the fair-use advice
  to push the custody lesson before the purchase, so the lesson now teaches
  custody while stating plainly that education is necessary and not sufficient.
  The a16z Argentina reading is qualified the same way: downloads count arrivals
  rather than residents, the USDC payroll series had fallen to about a fifth of
  its early-2024 peak by July 2026, that data comes from an investor of the
  publisher, the publisher discloses that its third-party figures are not
  independently verified, and a digital dollar still cost about 4% more than the
  bank's a year after the rules were relaxed. The lesson claims only that demand
  survived the easing of the pressure that caused it, not that habits have
  changed. The Spark source is labelled as a vendor whose own SDK is one of the
  answers it recommends, and its thesis is flagged as also being a sales position.
  All ten M2.6 source URLs were opened and checked on 26 September 2026; the IMF
  article is confirmed real (Schimmelpfennig and Zhao, 16 June 2026) and the
  Chainalysis label was corrected to the report's actual headline rather than its
  SEO title.

Questions:

1. **Someone says inflation is just prices going up and has nothing to do with
   money creation. What is the strongest answer you can give without exaggerating?**
   A. Prices only go up when people start printing money, so inflation is always
   caused by the central bank · B. Money printing is a supply change, and you can
   see the effect in the currency itself: the peso has lost more than 99% against
   the dollar over a decade, Bolivia's reserves fell from $15.1bn to about
   $1.7bn, and the Fed's balance sheet went from roughly $900bn to $2.2tn during
   2008, so the person holding cash takes the loss while the issuer spends the new
   money · C. It depends entirely on the country, so there is no general argument
   to make · D. The honest answer is that we do not know, and anyone who says they
   do is selling something
   **Answer: B** — the defensible version names the mechanism and gives three
   dated, checkable examples, and the explanation notes that the people who
   suffered the peso collapse were paid in pesos and told the peso was money. A
   overstates and is dismissed on contact, C is true about severity and is
   therefore an argument for the structural case rather than against it, and D
   confuses uncertainty about the outcome with knowledge of the mechanism.
2. **Why is a hard cap on supply a structural answer to the problem of money being
   created by a small number of unelected institutions?**
   A. Because every previous money that worked had a cap of some kind · B. Because the people who run those institutions are corrupt and should be replaced · C. Because a cap removes the discretion entirely: the argument never has to rely on anyone intending well, since no one has the ability to do otherwise, and that is what makes it structural rather than a promise · D. Because it guarantees the price will go up
  **Answer: C** — and the explanation says explicitly that this is stronger than
   the corruption version, which is why A is a distractor rather than the
   intended answer. C is refuted by M2.4's own argument: a cap governs the supply and says nothing about whether anyone comes to hold the asset. D is false, and the lesson's own history section supplies the
   refutation: the two durable pre-fiat eras were gold and coinage, both
   undermined by their issuers changing the terms.
3. **A 27% first-try success rate for backing up a wallet, measured across 847
   first-time users in six countries. What does that number tell you about where
   adoption is actually stuck?**
   A. That self-custody should be deprioritised until the interface is perfect · B. That most people should simply keep using custodial wallets, which is what they prefer anyway · C. That these users lacked the technical ability to use bitcoin safely · D. That the binding constraint is design, not demand, and the same study showed a five-step change to that one screen taking success from 27% to 81% and verified restoration from 66% to 96%
  **Answer: D** — the most encouraging fact in the course, and the reason the
   lesson's optimism is evidence-based. A is the most common way advocates talk
   themselves out of fixing anything, and the study is explicit that the same
   people used mobile banking daily. C inverts the finding. D treats preference as
   the counter-argument when preference is the measurement, and the ecosystem
   numbers make the gap concrete.
4. **What is the single highest-leverage thing an advocate can do to grow fair,
   durable adoption?**
   A. Explain it accurately to people one at a time, including the adoption risk and the custody responsibility, so the people who arrive stay for years instead of quarters · B. Promote the price, since most people only pay attention after it has already moved · C. Concentrate on the people who already agree, and build a strong community around the shared conviction · D. Build the user interfaces, since a 27% success rate on one screen is the whole problem
  **Answer: A** — adoption is a trust business and demand is not the scarce part,
   which the ETF, treasury and sovereign allocations make obvious. B is the tactic
   that reliably sells to the cohort with the shortest holding period and the
   loudest exit. C produces a club and, worse, removes the only people who can say
   where the reasoning is weak. D is close and worth a lot of work, but it is not
   available to most advocates, and the explanation says what is.
5. **A friend with a phone and no bank account wants to save in a currency that has
   lost most of its value. What does a bitcoin-accessible world have to give them
   first?**
   A. Legal tender status, which is what actually made it work in El Salvador · B. Access that needs nothing they do not have: no bank account, no identity document, no minimum, no permission, and a way to move value for cents without asking anyone, which is what over 90% of African bitcoin users actually need since they are mobile-only · C. A better exchange, with more pairs and a nicer interface, so they can trade more easily · D. Regular saving, because adding to a fixed-supply asset on a schedule means never having to make a timing call
  **Answer: B** — this is what the demand data is made of, and the unbanked person
   is who the money printer hurts most and serves least, since 100 million people
   in sub-Saharan Africa have no official ID. A is a better version of the same
   locked door that also puts savings somewhere that can freeze the balance. C
   recommends a strategy that only works if you are wrong about the other
   person's income. D does not scale from two countries, and the replicable thing
   is already visible across Latin America and Africa in permissionless digital
   dollars.

---

## Level 3 — Intermediate: Power, Technology, and Building (declared, unpublished)

Ordering rationale: energy and power are taught first because they are the
physical constraint that makes the technology possible at all. Only then does
the level ask what that technology is, and then what people build on it. This
also keeps both of the reader's cases standing side by side rather than
substituting one for the other: the capability side (L3.1–L3.3) is not
replaced by the monetary side, and Level 4 carries the monetary side explicitly
alongside it.

### L3.1 Energy and power
Covers: energy vs power, why energy precedes money in the analysis, power
scarcity, energy sufficiency and reliability, what the energy actually buys, the
instrumental and marginal cases, the three standard claims compared case by
case, the gold comparison and what its disagreement turns on, and the published
findings that cut against the case.

Question design note: the reader asked for the energy lesson to be as honest as
possible and to make the strong case that the energy is instrumental rather
than dangerous. Those two instructions are in tension, and the resolution used
here is to keep the counter-evidence and let the positive case rest on the thing
that is not contested, which is that sufficient and reliable energy is what
makes everything else possible. The lesson therefore argues the marginal case,
where mining absorbs power that was already being wasted, and declines the
larger claim that mining is an energy-access programme, because a rise in supply
is not a rise in access.

1. **A generator is rebuilt to burn the same fuel per hour but output twice the
   electricity. In this lesson's language, what changed?**
   A. Fuel became cheaper · B. Its energy consumption doubled · C. Its power doubled: energy per hour is unchanged while useful work per hour rises · D. Its efficiency fell to zero
  **Answer: C** — power is energy per unit time, so converting the same energy
   into more work per hour raises power. The distinction is the entire point of
   Ch8.
2. **Why does this level teach energy before money?**
   A. Because money is a state invention and energy is not · B. Because energy is easier to measure than money · C. Energy is more expensive than money · D. Because energy and power bound what production is physically possible, whereas money only records which goods get produced
  **Answer: D** — an ordering claim about causation, not about importance.
   Money allocates; power sets the envelope.
3. **The "power scarcity" claim is best described as which of these?**
   A. Energy is abundant, but power, meaning energy harnessed densely and delivered when it is needed, stays limited and so remains valuable · B. The world is running out of energy · C. Utilities overcharge for electricity · D. Renewables will be exhausted before fossil fuels
  **Answer: A** — the claim concerns controllability and timing, not the total
   quantity of energy in the world.
4. **A settlement has abundant solar and wind but no storage and no transmission
   lines. Does it have energy, or power?**
   A. Power, but no energy · B. Energy, but little usable power, because the resource arrives intermittently and cannot be delivered on demand · C. Both, equally · D. Neither
  **Answer: B** — intermittency without storage or delivery is precisely the
   constraint the lesson is about.
5. **A mining operation is sited beside a gas well whose output would otherwise
   be flared. Which best describes the effect on energy sufficiency for
   others?**
   A. It improves sufficiency substantially, because mining supplies electricity to the local population · B. It has no effect either way, because energy is a global pool · C. It leaves sufficiency for others intact and removes a waste stream, so the effect is neutral to mildly positive · D. It lowers sufficiency, because any new large load reduces the electricity available to others
  **Answer: C** — flaring is a pure loss, the fuel is spent and the emissions
   released regardless, so absorbing it recovers output that was being destroyed.
   This is the marginal case where the instrumental argument is strongest, and
   A is the mistake of assuming a load always competes for generation that would
   otherwise serve someone else.
6. **A Texas modelling study found Bitcoin demand more than doubled wind
   capacity while raising total carbon emissions about 1.6 times, and that the
   emissions increase nearly vanished when miners were switched off whenever
   renewable generation fell short. What is the correct reading?**
   A. Bitcoin mining is good for the grid, since it builds clean generation · B. Bitcoin mining always increases emissions regardless of how it is run · C. Wind capacity would have doubled anyway · D. Flexible mining load can pull new clean generation into existence, but only the grid-integrated version is close to emissions-neutral
  **Answer: D** — both halves are the finding. The value is real and
   conditional, and the condition is grid integration rather than anything
   intrinsic to proof of work.
7. **One study finds Bitcoin consumes less total energy than gold, another finds
   Bitcoin uses more energy per dollar of value than gold. Both are reputable.
   What is the real source of the disagreement?**
   A. They use different denominators: total sector energy against energy per dollar of market value · B. They measured different years, and the comparison is out of date · C. Gold's figure is unknowable, so the study that estimates it must be wrong · D. One team made a calculation error
  **Answer: A** — gold has enormous non-industrial demand and a high price per
   unit of mass, so per dollar it uses little energy, while the whole sector
   burns a lot. The question asked decides which number is the right one.
8. **Someone claims mining helps the developing world because it creates demand
   for cheap electricity. Which is the most defensible version?**
   A. The claim is entirely false, because mining has no effect on any other industry · B. It is an indirect effect: reliable low-cost demand can improve project returns on new solar and wind, so more gets built, but it raises supply rather than access and can raise local tariffs · C. The claim is true, because mining locates itself where energy is most needed · D. The claim is true as usually stated, because mining brings power to places that lack it
  **Answer: B** — the narrow claim the evidence supports. It runs through
   project economics over years, and supply is not access.
9. **What is the strongest objection to framing Bitcoin's electricity use as
   scarce power rather than as waste?**
   A. Bitcoin already runs mostly on renewables, so there is nothing to debate · B. Power is not a real economic quantity · C. It recasts a measurable environmental cost as an economic abstraction, and the verdict changes with whichever counterfactual you compare against · D. Energy abundance means all energy use is harmless
  **Answer: C** — the comparison is entirely counterfactual-dependent, which is
   the honest limit of the framing and the first thing a sceptic will raise.

### L3.2 Wallets, seeds and nodes
Covers: HD wallets (BIP32/BIP39), what a full node validates, SPV wallets, the
BIP39 passphrase, pruning, and why running a node is an act of verification.

1. **A full node is useful mainly because it…**
   A. It makes your transactions free, because validating them locally removes the miner · B. It gives you a better wallet interface with more charts and features · C. It pays you for staying online, so keeping it running is a small income · D. It validates every block and transaction against the consensus rules itself
  **Answer: D** — trusting someone else's server means trusting them about your
   money.
2. **A light/SPV wallet instead…**
   A. It trusts the server about which chain the headers belong to, and only checks that the headers link up and carry enough work · B. It downloads every block and checks them all, just more slowly · C. It runs the mining pool, so it can confirm its own transactions first · D. It cannot be fooled by a server, because it verifies everything locally before displaying it
  **Answer: A** — much lighter, but it trusts the server for the header chain.
3. **What does the BIP39 passphrase (a "25th word") change?**
   A. Every transaction now costs less, because the wallet is doing more work · B. The seed is different, so the same words with a different passphrase are a different wallet with a different balance · C. The twelve words are now encrypted, so the phrase on the backup is unreadable · D. The wallet can now be opened if you lose the twelve words
  **Answer: B** — the same words with a different passphrase are a different
   wallet with a different balance.
4. **A pruned node…**
   A. It only keeps unconfirmed transactions and discards confirmed ones · B. It enforces only half of the consensus rules, trading security for space · C. It can no longer usually serve old blocks to a peer, or build an index of every transaction · D. It now rejects any block that is more than a year old
  **Answer: C** — pruning saves disk, and the node still checks the chain
   against the rules.
5. **Deriving multiple addresses from one seed phrase is possible because…**
   A. The network copies your keys whenever you ask for a new address · B. Mining produces fresh addresses and distributes them to wallets that ask · C. Exchanges keep a record of the addresses they issued and reissue them on request · D. Hierarchical deterministic derivation computes child keys from a master key along a defined path
  **Answer: D** — this is what makes one backup able to restore an entire
   wallet.

### L3.3 Building and scaling: Lightning, fees and the mempool
Covers: channels vs payments, opening and closing, inbound vs outbound
liquidity, HTLCs, routing failures, sat/vB fee rates, mempool behaviour,
Replace-by-Fee, the SegWit discount, and why input count moves your fee. This
lesson carries ten questions, because Lightning and fee-market mechanics are two
distinct mechanisms and merging them into five would have meant dropping one.

1. **Where does a Lightning payment actually settle?**
   A. On a public blockchain, one block per payment · B. Between channel peers
   off-chain, with the open and close of each channel settled on-chain · C. In
   the sender's wallet database · D. With the merchant's bank
   **Answer: B** — that is why Lightning is fast and cheap, and also why channel
   openings and closings are visible on-chain.
2. **"Outbound liquidity" on a channel refers to…**
   A. How much you can spend before you need to receive · B. The total channel
   size · C. How fast your node syncs · D. The number of channels you have
   **Answer: A** — inbound payments need the other side to have outbound room, so
   liquidity sits on the side it can leave from.
3. **A payment fails to route. The most common cause is…**
   A. The recipient's node is offline and the invoice expired · B. No path exists
   with enough outbound liquidity at each hop, or the fee quoted is too low ·
   C. The channel uses too much bandwidth · D. The receiver's wallet is out of
   date
   **Answer: B** — routing is a search for a path of open, funded channels.
4. **The point of an HTLC in Lightning is to…**
   A. Compress the payment before sending it · B. Make the payment conditional:
   the money is only claimable if the next hop pays onward · C. Store the payment
   history · D. Encrypt the invoice
   **Answer: B** — this conditional structure is what lets an intermediate node
   forward value without being able to steal it.
5. **What is the main trust trade-off of using a custodial Lightning wallet?**
   A. Payments take longer to confirm · B. The provider can lose or freeze your
   balance, and can see your payment history · C. Invoices expire sooner · D.
   Channels cannot be closed
   **Answer: B** — convenience is bought with custody.

1. **Bitcoin fees are quoted in…**
   A. Sats per transaction · B. Satoshis per virtual byte · C. Percent of the
   amount sent · D. Sats per confirmation
   **Answer: B** — this measures the space your transaction takes up in a block.
2. **The mempool is…**
   A. A queue of valid but unconfirmed transactions waiting for a block ·
   B. A copy of the whole blockchain · C. A mining pool's payout list · D. A
   wallet's address list
   **Answer: A** — miners pick from it, mostly by fee rate.
3. **Replace-by-Fee exists because…**
   A. Wallets sometimes need to change a stuck transaction, paying a higher fee so
   it replaces the old one · B. Blocks are too full to confirm anything ·
   C. Exchanges require it · D. Miners must confirm every transaction
   **Answer: A** — it is the standard escape hatch for an under-priced stuck
   transaction.
4. **Why is a transaction with many inputs usually more expensive?**
   A. Each input is a separate signature · B. Each input needs its own output in
   the data, and fees scale with the size of that data · C. Miners charge per
   input · D. It does not — fees are fixed
   **Answer: B** — fee follows data size, which is why consolidating inputs from
   many small payments matters.
5. **The SegWit witness discount made typical transactions cheaper by…**
   A. Removing signatures from the network entirely · B. Moving signature data
   into a part of the transaction that is not hashed into the transaction ID ·
   C. Capping fees at 1 sat · D. Batching blocks
   **Answer: B** — the discount is the reason sending to a SegWit-native
   address is markedly cheaper.

---

## Level 4 — Advanced: Time, Money, and the Long Game (declared, unpublished)

This level is deliberately paired with Level 3 rather than replacing it. Level 3
argues the capability case — power, technology, and what gets built. Level 4
argues the monetary case. L4.3 states the relationship between them explicitly,
because the most common failure mode of courses like this is presenting the two
as rivals when they are claims about different layers of one system.

### L4.1 Time and time preference
Covers: opportunity cost, the ultimate resource, time preference, economizing
time, saving and capital, time preference and civilization, and time preference
and Bitcoin. The through-line is that Bitcoin is presented as a long-term tool
rather than a quick fix, and what follows from that framing.

1. **You spend two evenings building a tool that saves you twenty minutes a
   week. In this lesson's terms, what are those two evenings?**
   A. An investment whose real cost is the other things you could have done with
   the time · B. Wasted, because the saving is so small · C. Free, because you
   already own the computer · D. A tax on leisure
   **Answer: A** — this is opportunity cost, and it is why a rational person can
   still judge the build irrational when it is compared to an hourly wage.
2. **Time preference is best described as…**
   A. How punctual a person is · B. The degree to which present consumption is
   preferred over future consumption — the price of waiting · C. The interest
   rate on a savings account · D. How long a person expects to live
   **Answer: B** — an individual's time preference and the natural rate of
   interest are the same phenomenon observed from two directions.
3. **Why is Bitcoin framed as a long-term tool rather than a quick fix?**
   A. Because long holding periods are taxed less heavily · B. Because a claim on
   future purchasing power only pays off if you can wait long enough for it to
   compound, which is a claim about time rather than about a transaction · C.
   Because short-term holders are irrational · D. Because fees fall over time
   **Answer: B** — the framing is an argument about patience compounding, not
   about price in the short run.
4. **Someone takes a car loan to buy a depreciating asset they cannot afford,
   instead of waiting two years to buy a better used one. In time-preference
   terms they have…**
   A. Lowered their time preference · B. Raised their time preference · C. Raised
   their rate of saving · D. Become more patient
   **Answer: A** — spending now rather than waiting is lower time preference, and
   the asset's depreciation compounds the error rather than offsetting it.
5. **What is the strongest objection to time-preference arguments?**
   A. Time preference cannot be measured · B. That low time preference is
   sometimes genuinely justified by real uncertainty, so the argument is properly
   about systematic misvaluation caused by money creation, not about individual
   financial error · C. Saving is always irrational · D. Interest rates are a
   government artefact
   **Answer: B** — this is the honest reading, and it is what makes the claim an
   argument about monetary policy instead of personal finance.

### L4.2 Money: what it solves, and why there is one of it
Covers: the problem money solves, salability, salability across time, why one
money, money and the state, the value and uniqueness of money, and how much
money there should be.

1. **The problems money is introduced to solve are chiefly…**
   A. The safe storage and transport of wealth · B. The impossibility of trading
   directly with everyone you need, and holding value across time · C. Measuring
   national output · D. Collecting taxes efficiently
   **Answer: B** — salability, and salability across time.
2. **The economic quality that makes a good money is best described as…**
   A. Its status as legal tender · B. Salability — how easily it can be
   exchanged for the things you actually want · C. Its resale value to the
   issuer · D. Its physical durability
   **Answer: B** — legal tender status is a legal fact, not the economic
   function.
3. **If a good is extremely salable, what tends to happen to its price in
   ordinary non-monetary trades?**
   A. It rises, because the monetary use bids the same supply away from other
   uses · B. It falls · C. Nothing changes · D. It becomes illegal to trade
   **Answer: A** — this is why the most liquid goods historically become money
   and then get bid away from their original use.
4. **"Money is a product of the market, not of the state" is best read as…**
   A. A claim that government-issued currency has no value · B. An account of
   how money emerges from voluntary exchange, which is a narrower and different
   claim · C. A claim that only Bitcoin qualifies as money · D. A denial that
   states exist
   **Answer: B** — the phrase is routinely over-extended in both directions; the
   narrow reading is defensible and the broad one is not.
5. **Why does a market normally converge on one money rather than several?**
   A. Because governments decree it · B. Because the most salable good gains the
   most value as money, which pulls trade toward a single medium and entrenches
   it · C. Because coins are easier to count than other goods · D. Because law
   requires a single unit
   **Answer: B** — the reinforcement is a consequence of salability, not an act
   of decree.

### L4.3 The hardest money, beside the development case
Covers: hard money as resistance to arbitrary expansion, time preference and
Bitcoin, the fixed supply, and the explicit relationship between the monetary
case and the building case. The reader asked that the two cases sit beside each
other rather than one replacing the other, and that is the lesson's core.

1. **A "hard" money is defined by its resistance to…**
   A. Being used at all · B. Arbitrary expansion by whoever issues it · C. Being
   traded · D. Being mined
   **Answer: B** — hardness is a property of the supply schedule, not of usage.
2. **The monetary case and the development case for Bitcoin are…**
   A. Rival claims, of which at most one can be true · B. Independent claims
   about different layers of the same system, so a project can succeed at one
   while failing at the other · C. The same argument stated twice · D. Irrelevant
   to whether it is adopted
   **Answer: B** — this is the most important distinction in the level. Money
   is a scarce token; the protocol is a non-scarce good. One can work without the
   other.
3. **Bitcoin's source code is free to copy without limit while the coin supply
   is capped at 21 million. Is that a contradiction?**
   A. Yes, the two claims cannot both hold · B. No — they act on different
   layers. Software is a non-scarce good, the token is a scarce one, and the
   protocol is the mechanism that links them · C. Only if demand is high enough ·
   D. The cap will rise to match the number of copies
   **Answer: B** — this is Ch7's non-scarce technology sitting beside Ch10's
   money, which is the "beside each other" claim in its plainest form.
4. **A fixed supply cap is necessary for sound money. What does it not
   provide?**
   A. Low volatility · B. Demand and salability — a scarce good nobody wants is
   not money · C. Legal tender status · D. Mining rewards
   **Answer: B** — the cap constrains supply and does nothing for demand, which
   is the most common overreach in the scarcity argument.
5. **What is the strongest objection to Bitcoin's monetary case?**
   A. That its inflation-adjusted returns have underperformed most mainstream
   assets over long periods and it pays no yield, so the whole case rests on
   future demand for something nobody is obliged to hold · B. That it is not a
   currency · C. That its supply is not really fixed · D. That it cannot scale
   **Answer: A** — this is a real objection and the one a serious critic leads
   with. It is stated here at full strength on purpose.

---

## Level 5 — Technical Deep Dive (declared, unpublished)

Preserved intact from the earlier Level 4 draft. Not written yet, and not
replaced by Levels 3–4: the deep protocol material is a legitimate later level
and none of it was discarded when the energy-first ordering was adopted.

### L5.1 Script and spending conditions
Covers: script types (P2PKH, P2WPKH, P2SH, P2TR), Taproot and Schnorr,
timelocks, immutability in practice, and how script paths shape Lightning.

1. **P2TR (Taproot) outputs are best described as…**
   A. Scripts anyone can change until spent · B. A single-key Schnorr spend
   path, with an optional script path revealed only if the key path is not used ·
   C. Scripts that expire after 10 minutes · D. Multi-signature-only outputs
   **Answer: B** — most spends look identical on-chain, which is a privacy and
   cost win.
2. **Compared with earlier script types, Taproot's main practical gains are…**
   A. Smaller transactions, fewer signatures for multi-sig setups, and less
   on-chain information exposed · B. Faster block times · C. A larger supply ·
   D. Automatic fee refunds
   **Answer: A** — the improvements are in cost, privacy, and script flexibility.
3. **A transaction timelock means…**
   A. The mempool will delete the transaction after a deadline · B. Funds cannot
   be spent before a certain height or time has passed · C. The fee expires ·
   D. The wallet is locked for a fixed period
   **Answer: B** — this is how channels enforce delayed refunds on close.
4. **Which statement about a confirmed transaction is accurate?**
   A. It can be reversed by its sender at any time · B. It is immutable; the only
   way to move those coins again is a new transaction spending its outputs · C. It
   can be edited by miners · D. It expires and the coins return automatically
   **Answer: B** — finality is structural, not administrative.
5. **Why does Lightning need script at all?**
   A. To compress channel data · B. Because channel balances are enforced by
   on-chain-style conditions (HTLCs and timelocks) so funds can never be claimed
   by both parties · C. To store channel history · D. To encrypt invoices
   **Answer: B** — the off-chain ledger is only as trustworthy as the script that
   settles it on-chain.

### L5.2 Consensus and mining
Covers: proof of work, the block subsidy and halving, difficulty retargeting,
headers and the merkle root, nonces, and what a 51% attack can and cannot do.

1. **Proof of work exists to make…**
   A. Transactions free · B. Rewriting history and double-spending expensive and
   probabilistic · C. Mining profitable · D. Blocks smaller
   **Answer: B** — the cost of attacking the chain is meant to exceed the value
   of what an attacker could gain.
2. **Mining rewards come from…**
   A. Transaction fees only · B. A block subsidy, which halves on a schedule,
   plus fees paid by transactions · C. Voluntary donations · D. Exchange
   listings
   **Answer: B** — the subsidy halves roughly every 210,000 blocks until it
   reaches zero, after which fees are the incentive.
3. **The difficulty adjustment recalculates roughly…**
   A. Every block · B. Every 2,016 blocks, to keep blocks near the 10-minute
   target as hash power changes · C. Every year · D. Only when blocks are full
   **Answer: B** — retargeting keeps the network's pace stable as miners join
   and leave.
4. **Which item is part of a block header?**
   A. The full list of transactions · B. The merkle root, previous block hash,
   timestamp and difficulty bits · C. Users' wallet balances · D. The payee's
   name
   **Answer: B** — headers commit to the block compactly; transaction details
   are separate.
5. **A miner controlling a majority of hash power could…**
   A. Steal coins from any address without spending them · B. Reverse or censor
   recent transactions, at a real economic cost · C. Create coins from nothing
   permanently · D. Change the 21 million cap
   **Answer: B** — coins can only move by their owner's keys, and the attack is
   expensive and visible.

### L5.3 Privacy, scaling and self-hosting
Covers: pseudonymity vs anonymity, address reuse, CoinJoin, what Lightning does
and does not hide, node types, and where the protocol is defined.

1. **Bitcoin is best described as…**
   A. Anonymous · B. Pseudonymous — transactions are public and linked, but not
   tied to a name · C. Private between sender and receiver · D. Encrypted end to
   end
   **Answer: B** — all transactions are public, and the addresses involved can
   be linked over time.
2. **The single most damaging privacy habit is…**
   A. Using a hardware wallet · B. Reusing the same address across many payments,
   which lets observers link them all together · C. Running a node · D.
   Verifying a payment on a block explorer
   **Answer: B** — address reuse collapses your history into a single visible
   track.
3. **CoinJoin attempts to improve privacy by…**
   A. Encrypting transactions · B. Combining several users' payments so
   observers cannot tell which input paid which output · C. Hiding the mempool ·
   D. Requiring a coin-mixer registration
   **Answer: B** — the ambiguity is the goal, and analysis companies are
   persistent opponents of it.
4. **What does Lightning hide, and what does it not?**
   A. It hides fee rates only · B. Individual payments stay off-chain, but channel
   opens and closes are on-chain and each hop sees the payment it forwards · C.
   It hides everything · D. It hides the sender but not the receiver
   **Answer: B** — Lightning is not a privacy tool, it is a payments rail with
   different trade-offs.
5. **A BIP is…**
   A. A mining pool · B. A proposal document that defines a change to the
   protocol, such as Taproot · C. A wallet brand · D. A block type
   **Answer: B** — the proposals are the published, versioned source of how
   Bitcoin's rules evolve.

---

## What I still need from you

Levels 3 and 4 stay unpublished until you ask for them. Levels 1 and 2 are
built and sitting in a preview deployment only, so nothing needs deciding before
you can read them — the questions below are the ones still open, and nothing is
committed or promoted until you are happy.

1. **Accuracy check** on the Levels 1 and 2 wording above. Anything factually off
   gets fixed before it ships, and the rewritten questions are the highest-risk
   part: each distractor is now a plausible belief rather than an obvious error,
   so an explanation can be technically true and still mislead.
2. **Economics balance, now settled in structure but not signed off in tone.**
   Level 2 gives Austrian, Keynesian, monetarist, neoclassical and MMT a full
   lesson between them, and the current-data lessons report the 2026 evidence
   even where it undercuts Bitcoin. Is that the right weight? If the balance
   still reads as too sceptical somewhere, say which lesson and I will change
   that lesson rather than softening the whole level.
3. **Dated figures.** Every number in M2.3 and M2.4 was checked on 26 September
   2026 and is sourced on the page. This is the cost of the approach: those
   figures will age. Do you want a visible "checked on" date and refresh note
   (currently on the page), or a mechanism to re-verify and update them
   periodically?
4. **Local angle**: should lessons reference your own events (meet-ups, the
   bootcamp, the doccie) as worked examples, or stay generic so they work for
   anyone? The levels so far stayed generic but point learners at the site's own
   wallet tool in the "try it yourself" boxes.
5. **Tone check**: the Beginner level says "scaring people off is the opposite
   of adoption" — keep that voice, or make it more formal?
6. **Pass mark**: none is enforced. If you want a certificate or completion
   badge, that needs an identity decision (emails or accounts), which I would
   rather not add.
7. **Progress persistence**: progress is stored in the browser and mirrored to
   Supabase when it is configured, but it is not yet restored from Supabase on a
   different device. Say the word if you want cross-browser progress back, since
   that needs the Supabase project live first.
