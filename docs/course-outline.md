# In-site Bitcoin courses — outline for sign-off

Status: **proposal, not built.** The Learn tab currently ships with the external
course directory only. Nothing below goes live until this outline is approved and
the wording is fact-checked.

Format decided: 3 levels x 3 lessons, each lesson ends in 5 multiple-choice
questions (45 total) with instant feedback. Every option gets a one-line
explanation, so a wrong answer still teaches something. No score gating — a
learner can always read the explanation, because scaring people off is the
opposite of adoption.

Progress is per browser (Supabase `course_progress` table, keyed on the same
anonymous visitor id as likes). No accounts, no leaderboard, no certificate.

---

## Level 1 — Beginner

### L1.1 What Bitcoin actually is
Covers: peer-to-peer electronic cash, the double-spend problem, block and
transaction structure, the 21 million cap, satoshis, full nodes vs miners, the
10-minute block target.

1. **What problem is Bitcoin designed to solve without a bank or government?**
   A. Slow internet connections · B. Double-spending the same coin without a
   trusted third party · C. High electricity bills · D. Software update cycles
   **Answer: B** — every payment system needs a rule about who owns what; Bitcoin
   uses proof of work and a shared ledger instead of a trusted middleman.
2. **What is the maximum number of bitcoins that will ever exist?**
   A. 100 million · B. 21 million · C. 1 billion · D. Unlimited
   **Answer: B** — the supply schedule is fixed in the protocol; the last satoshi
   is expected around the year 2140.
3. **What is one satoshi worth?**
   A. 1/100 of a bitcoin · B. 1/1,000,000 of a bitcoin ·
   C. 1/100,000,000 of a bitcoin · D. 1/10 of a bitcoin
   **Answer: C** — one bitcoin is 100,000,000 satoshis.
4. **Who decides whether a transaction is valid?**
   A. A central authority · B. Whoever sends the most sats · C. Every node running
   the rules independently · D. The oldest wallet software
   **Answer: C** — nodes re-check the rules themselves; no company can grant
   permission.
5. **How long does a transaction usually take before it is considered final?**
   A. Instantly · B. About 10 minutes for the first confirmation · C. 24 hours ·
   D. 7 days
   **Answer: B** — one block targets 10 minutes; deeper confirmations reduce the
   (already small) risk of a reversal.

### L1.2 Buying and storing
Covers: custodial vs non-custodial wallets, seed phrases, hot vs cold wallets,
"not your keys, not your coins", backups, and the one mistake that loses
everything.

1. **A seed phrase is best described as…**
   A. A password you type into an app · B. The master key your coins are derived
   from, in human-readable words · C. A block hash · D. A public address
   **Answer: B** — it can regenerate every key and address, so anyone who has it
   owns the coins.
2. **"Not your keys, not your coins" refers to…**
   A. Wallet apps that hold your coins for you · B. Wallets that only work
   offline · C. Hardware wallets · D. Mining hardware
   **Answer: A** — if a company holds the keys, it holds the coins, and your
   access depends on that company staying in business.
3. **What is the safest way to back up a seed phrase?**
   A. Photograph it and email it to yourself · B. Store it in a notes app synced
   to the cloud · C. Write it on paper, in private, and keep two copies in two
   separate physical locations · D. Paste it into a spreadsheet
   **Answer: C** — anyone who gets a copy of the phrase can take the coins, and
   cloud copies are the first thing a thief looks for.
4. **You lose your seed phrase and have no backup. What happens?**
   A. Support can restore it · B. The coins return to the miner pool · C. The
   coins become unspendable and are gone forever · D. You can recover half with
   your email
   **Answer: C** — there is no reset, no customer service, and no recovery
   process. Nobody, including the developer, can reverse it.
5. **What is the main advantage of a cold wallet?**
   A. It sends transactions faster · B. The private keys never touch an
   internet-connected device · C. It has no fees · D. It guarantees a higher
   price
   **Answer: B** — keeping keys offline removes the most common theft vector.

### L1.3 Spending safely
Covers: verifying payments, fees and stuck transactions, the mempool in plain
English, invoices vs addresses, and the small set of scams that work because
they use real technical words.

1. **A merchant gives you a Lightning address. What is it?**
   A. A QR code you must scan to receive money · B. A reusable human-readable
   payment address that generates an invoice when someone sends to it ·
   C. A private key · D. A block hash
   **Answer: B** — unlike an on-chain address, money is not sent to the address
   itself; it is sent to an invoice it produces.
2. **Your transaction has been sitting unconfirmed for hours. What is the most
   likely cause?**
   A. The coins are fake · B. The fee rate is below what miners will accept for
   inclusion right now · C. Too many confirmations · D. The wallet is old
   **Answer: B** — blocks have limited space, so unfilled mempool space is
   auctioned by fee.
3. **Someone in a support chat asks for your seed phrase "to verify your
   wallet". What should you do?**
   A. Share it, they need it · B. Share only the first six words · C. Share
   nothing and leave · D. Send a screenshot with the words blurred
   **Answer: C** — no legitimate support agent ever needs a seed phrase. Blurring
   words still exposes the rest.
4. **How do you independently check that a payment actually arrived?**
   A. Trust the merchant's receipt · B. Look the transaction up on a block
   explorer or in your own node · C. Refresh the app twice · D. Ask the sender
   **Answer: B** — verification means reading the chain yourself instead of
   trusting someone's claim.
5. **Can a confirmed Bitcoin transaction be reversed?**
   A. Yes, within 24 hours by the sender · B. Yes, by the exchange · C. No —
   only by spending the outputs to different addresses in a later transaction ·
   D. Yes, if you ask the miner
   **Answer: C** — the ledger is append-only, so history can be added to but not
   edited.

---

## Level 2 — Intermediate

### L2.1 Wallets, seeds and nodes
Covers: HD wallets (BIP32/BIP39), what a full node validates, SPV wallets, the
BIP39 passphrase, pruning, and why running a node is an act of verification.

1. **A full node is useful mainly because it…**
   A. Earns you sats for being online · B. Independently validates every block
   and transaction against the consensus rules · C. Makes your transactions free ·
   D. Gives you a better wallet interface
   **Answer: B** — trusting someone else's server means trusting them about your
   money.
2. **A light/SPV wallet instead…**
   A. Downloads and validates the entire chain · B. Downloads block headers and
   the transactions relevant to your addresses, trusting proof that the chain
   built on them · C. Runs the mining pool · D. Cannot be tricked by a fake
   transaction
   **Answer: B** — much lighter, but it trusts the server for the header chain.
3. **What does the BIP39 passphrase (a "25th word") change?**
   A. It lowers your transaction fees · B. It changes the seed itself, producing a
   different set of wallets from the same words · C. It unlocks a locked wallet
   without the words · D. It recovers a lost seed phrase
   **Answer: B** — the same words with a different passphrase are a different
   wallet with a different balance.
4. **A pruned node…**
   A. Rejects blocks more than a year old · B. Discards old block data it no
   longer needs while still validating new blocks from the chain it follows ·
   C. Stores only unconfirmed transactions · D. Runs with half the network rules
   **Answer: B** — pruning saves disk, and the node still checks the chain
   against the rules.
5. **Deriving multiple addresses from one seed phrase is possible because…**
   A. The network copies your keys · B. Hierarchical deterministic wallets derive
   child keys from a master key using a defined path · C. Mining produces new
   addresses · D. Exchanges hand out spare addresses
   **Answer: B** — this is what makes one backup able to restore an entire
   wallet.

### L2.2 Lightning
Covers: channels vs payments, opening and closing, inbound vs outbound
liquidity, HTLCs, routing failures, and the trade-offs you accept by using it.

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

### L2.3 Fees, the mempool and coin control
Covers: fee rates in sat/vB, mempool behaviour, Replace-by-Fee, the SegWit
witness discount, and why the number of inputs affects your fee.

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

## Level 3 — Advanced

### L3.1 Script and spending conditions
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

### L3.2 Consensus and mining
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

### L3.3 Privacy, scaling and self-hosting
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

## What I need from you before building

1. **Accuracy check** on the 45 questions above — anything factually off gets
   fixed before it ships.
2. **Local angle**: should lessons reference your own events (meet-ups, the
   bootcamp, the doccie) as worked examples, or stay generic so they work for
   anyone?
3. **Tone check**: the Beginner level currently says "scaring people off is the
   opposite of adoption" — keep that voice, or make it more formal?
4. **Pass mark**: none is enforced. If you want a certificate or completion
   badge, that needs an identity decision (emails or accounts), which I would
   rather not add.
