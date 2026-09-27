/**
 * In-site course content. Levels 1 and 2 are written and quiz-complete; levels 3
 * and 4 are declared but unpublished so nothing half-finished ships. The source
 * of truth for structure and questions is docs/course-outline.md.
 *
 * Question design rule: every question should be answerable by reasoning about
 * a scenario, not by recognising the phrasing. Distractors have to be beliefs a
 * real learner could hold, and the explanation has to teach the mechanism.
 *
 * Honesty rule, which matters most in Level 2: the economics lessons state each
 * school of thought in its strongest form, and they report what the current data
 * actually says even where it cuts against Bitcoin. A lesson that only confirmed
 * the reader's priors would teach nothing, and it would be the first thing a
 * sceptic checks. Where a lesson quotes a current figure it is dated and sourced,
 * and the reader is told how to re-check it.
 */

export interface QuizOption {
  id: string;
  label: string;
  correct: boolean;
  /** One line per option, so a wrong guess still teaches something. */
  explanation: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: QuizOption[];
}

export interface LessonTable {
  /** Column headings, left to right. */
  head: string[];
  /** One array per body row, matching the order of `head`. */
  rows: string[][];
  /** Shown under the table so the reader knows how the figures were chosen. */
  note?: string;
}

export interface LessonSection {
  heading: string;
  paragraphs: string[];
  /** Optional short list, used where a taxonomy or checklist is clearer than prose. */
  points?: string[];
  /** Optional table, used where the comparison is the point (cycles, rates, schools). */
  table?: LessonTable;
}

export interface LessonSource {
  label: string;
  detail: string;
  url: string;
}

export interface Lesson {
  id: string;
  title: string;
  blurb: string;
  minutes: number;
  sections: LessonSection[];
  questions: QuizQuestion[];
  tryIt: string[];
  /** Shown as a sources block, so a reader can verify rather than trust. */
  sources?: LessonSource[];
}

export interface Level {
  id: string;
  name: string;
  blurb: string;
  lessons: Lesson[];
  published: boolean;
}

const L1_1: Lesson = {
  id: 'l1-1-what-bitcoin-is',
  title: 'What Bitcoin actually is',
  blurb: 'The double-spend problem, blocks, coins as unspent outputs, and who checks the rules.',
  minutes: 6,
  sections: [
    {
      heading: 'The problem Bitcoin starts from',
      paragraphs: [
        'Hand someone a R10 note and you have handed over money. Hand someone a photo of a R10 note and you have handed over nothing, because digital things copy perfectly. That breaks every payment system which used to assume the cash was physical.',
        'The old fix was always the same: a trusted middleman keeps the official list of who owns what. Your bank, or the payment provider, or the app. It works, but it means the party you trust can lose your money, freeze your payments or hand your records to someone else, and if you cannot reach that system at all, you cannot participate.',
        'Bitcoin publishes the ledger to everyone and has every participant check it themselves. No company grants permission, and no single database holds the truth.',
      ],
    },
    {
      heading: 'Blocks, in order',
      paragraphs: [
        'Transactions are gathered into blocks roughly every ten minutes. Each block carries a fingerprint of the block before it, its hash, which is what makes the chain a chain: to change an old block you would have to redo every block after it.',
        'Ten minutes is a target rather than a schedule. Difficulty adjusts so that longer blocks get slightly easier to produce and shorter blocks slightly harder, pulling the average back toward the target as hash power comes and goes.',
      ],
    },
    {
      heading: 'Coins are unspent outputs, not balances',
      paragraphs: [
        'A Bitcoin transaction does not say "Alice sent 0.1 to Bob". It spends specific pieces of money called unspent transaction outputs (UTXOs) and creates new ones. If you hold 0.1 BTC, that is really one or more UTXOs carrying your key.',
        'Each payment therefore names the exact pieces it spends. That is also where the fee comes from: fee = value of the inputs minus value of the outputs. There is no separate fee field, and no way to make a transaction that forgets to pay it.',
      ],
    },
    {
      heading: 'Twenty-one million, and satoshis',
      paragraphs: [
        'The protocol issues new coins on a fixed schedule, starting at 50 BTC per block and halving every 210,000 blocks, roughly every four years, until the total approaches 21 million BTC. The last satoshi is expected around the year 2140.',
        'One bitcoin is 100,000,000 satoshis. The satoshi is the smallest unit and the one fees are quoted in, so 21,000 sats and 0.00021 BTC are the same amount written two ways.',
      ],
    },
    {
      heading: 'Who checks what',
      paragraphs: [
        'Two jobs are often confused. Nodes validate: they re-check every block and transaction against the rules and reject anything invalid. Miners produce new blocks by doing proof-of-work, which is how new coins enter circulation and how limited block space gets allocated.',
        'Validation is not a favour granted to you. Anyone running the software does it, and any node can walk away at any time. Running your own node is how you check a claim instead of trusting the person making it.',
      ],
    },
    {
      heading: 'Confirmation and finality',
      paragraphs: [
        'A transaction in its first block has one confirmation. Zero confirmations means it is waiting in the mempool and could still be replaced, which is why on-chain payments for goods usually wait for a few blocks. Lightning sidesteps that wait by using channels.',
        'Confirmed history cannot be edited. The only way to move the same coins again is a new transaction spending them elsewhere, and that transaction is visible to everyone.',
      ],
    },
  ],
  tryIt: [
    'Open the wallet on this site and create a test invoice. Note that the amount is in sats, and that the invoice is a single-use request rather than a reusable address.',
    'Check the current block height on any block explorer, then divide it by 210,000 to see roughly how many halvings have happened.',
  ],
  questions: [
    {
      id: 'l1-1-q1',
      prompt: 'Someone pays you with a photo of a R10 note, and the person who sent it the same photo also tries to spend it. What actually prevents both payments from succeeding?',
      options: [
{
          id: 'a',
          label: 'Every node keeps a ledger of what has already been spent, and rejects a second spend of the same output',
          correct: true,
          explanation:
            'That is the double-spend rule, enforced independently by every node from the same shared history. No permission needed, and no single copy of the ledger.',
        },
{
          id: 'b',
          label: 'The bank notes the serial number and blocks the second use',
          correct: false,
          explanation: 'Serial-number tracking needs an issuing bank you can trust. That is exactly the dependency Bitcoin removes.',
        },
{
          id: 'c',
          label: 'A timestamp on the photo decides which payment came first',
          correct: false,
          explanation: 'Timestamps are not authoritative to anyone. Only the ordering in the shared ledger is.',
        },
{
          id: 'd',
          label: 'Miners pick one payment and delete the other from the mempool',
          correct: false,
          explanation: 'Miners choose which valid transactions to include, but the reason only one of the two can ever be valid is the rule nodes apply, not their preference.',
        }
      ],
    },
    {
      id: 'l1-1-q2',
      prompt: 'A café charges 21,000 sats for a coffee. What is that in bitcoin?',
      options: [
{ id: 'a', label: '0.21 BTC', correct: false, explanation: 'That is 21 million sats, a thousand times too large.' },
{ id: 'b', label: '0.00021 BTC', correct: true, explanation: 'One bitcoin is 100,000,000 satoshis, so 21,000 sats is 21,000 divided by 100,000,000.' },
{ id: 'c', label: '0.0000021 BTC', correct: false, explanation: 'That is 210 sats, a hundred times too small.' },
{ id: 'd', label: '0.0021 BTC', correct: false, explanation: 'That is 210,000 sats, ten times too large.' }
      ],
    },
    {
      id: 'l1-1-q3',
      prompt: 'Why is the 21 million limit called a hard cap rather than a target?',
      options: [
{
          id: 'a',
          label: 'Because exchanges promise not to lend out more than exists',
          correct: false,
          explanation: 'Promises are not the mechanism. The supply rule holds even if every exchange in the world were dishonest.',
        },
{
          id: 'b',
          label: 'Because mining output is limited',
          correct: false,
          explanation: 'Mining difficulty does limit new coins, but that is a side effect. The cap comes from the fixed schedule, and it holds independently of how much is mined.',
        },
{
          id: 'c',
          label: 'Because the issuance schedule is part of the consensus rules, and changing it would need nodes to accept a different history',
          correct: true,
          explanation:
            'The schedule is in the code every node enforces, so changing it is not a policy tweak, it is a fork that has to be agreed to. That is what makes it a cap rather than an intention.',
        },
{
          id: 'd',
          label: 'Because governments signed an international treaty to hold the line',
          correct: false,
          explanation: 'No treaty exists, and treaties are not what enforces the supply. The enforcement is every node running the same rules.',
        }
      ],
    },
    {
      id: 'l1-1-q4',
      prompt: 'An app tells you your balance is 10 BTC. What decides whether that claim is true?',
      options: [
{
          id: 'a',
          label: 'The exchange whose app it is, because the exchange holds the coins',
          correct: false,
          explanation: 'That is a real answer for a custodial balance: the number is the provider\'s bookkeeping. It stops being the answer the moment you self-custody.',
        },
{ id: 'b', label: 'The current price, because a count of coins is only worth what the market says it is worth', correct: false, explanation: 'A balance is a count of unspent outputs, and the ledger settles that count rather than anyone\'s opinion. What it is worth is a separate question, and scarcity is a real input into the answer: a fixed 21 million against an expanding money supply is the hard-money argument for why the two should not drift apart indefinitely. It is not a settled one. A monetarist puts the weight on the money supply, a Keynesian on the demand side, and a behavioural reading on adoption and liquidity. This lesson stops at the part that is checkable.' },
{
          id: 'c',
          label: 'The wallet software that displays it',
          correct: false,
          explanation: 'The wallet renders a number it was told. It is convenient to read, and not evidence of anything.',
        },
{
          id: 'd',
          label: 'Every node re-checks the rules against the shared ledger, so the balance is whatever the unspent outputs say',
          correct: true,
          explanation:
            'The app is a reader, not an authority. If the ledger says otherwise, the app is wrong, and a node will tell you so.',
        }
      ],
    },
    {
      id: 'l1-1-q5',
      prompt: 'Your transaction has one confirmation. What has happened so far?',
      options: [
{
          id: 'a',
          label: 'It is in a block, so reversing it would be very hard, and the coins can still be spent onward',
          correct: true,
          explanation:
            'One confirmation means inclusion, and further blocks make reversal progressively harder. Spending those outputs again is normal usage, not a reversal.',
        },
{
          id: 'b',
          label: 'It is on the network but not yet in a block',
          correct: false,
          explanation: 'That is zero confirmations. One confirmation is the block already.',
        },
{
          id: 'c',
          label: 'It has been paid twice by mistake',
          correct: false,
          explanation: 'A second payment would be a separate transaction spending the same output, which the network would reject.',
        },
{
          id: 'd',
          label: 'It is final and those coins can never move again',
          correct: false,
          explanation: 'Finality means the history cannot be rewritten. It does not freeze the coins.',
        }
      ],
    },
  ],
};

const L1_2: Lesson = {
  id: 'l1-2-buying-and-storing',
  title: 'Buying and storing',
  blurb: 'Custody, seed phrases, hot versus cold wallets, backups, and the mistake that ends everything.',
  minutes: 7,
  sections: [
    {
      heading: 'A wallet does not hold coins. It holds keys.',
      paragraphs: [
        'This is the confusion hiding inside the slogan "not your keys, not your coins", and it is worth being exact about, because the whole phrase rests on it.',
        'Your coins are not inside an app. They are unspent outputs sitting in the shared ledger, spread across thousands of blocks that every node stores. What a wallet holds is the set of private keys that authorise spending those specific outputs. So when people say a wallet "holds your coins", they mean it holds the only thing capable of moving them.',
        'That leaves exactly one question that sorts every wallet into a type: who holds the keys?',
      ],
      points: [
        'Custodial: an exchange account, or any app that keeps keys for you. The provider holds the keys, so it can move or freeze the coins and your balance is its bookkeeping. If it fails, you are left holding a claim on a company, not coins.',
        'Non-custodial, hot: the app on your phone holds the keys. Convenient and exposed, which is why it is the first thing malware and phishing go after.',
        'Non-custodial, cold: a small hardware device keeps the keys offline and signs on itself. Most people hold long-term savings here.',
        'Keys only: you write the seed phrase on paper and derive your own addresses. The most self-sufficient option, and the least forgiving of mistakes.',
      ],
    },
    {
      heading: 'Custody is a choice about who you trust',
      paragraphs: [
        'Custody buys convenience: a way back in when you forget something, a support line when something breaks, and no need to understand private keys before your first payment. Exchanges are the obvious case, and several have collapsed, frozen accounts or lost balances outright. When that happens the losses land on customers.',
        'Self-custody removes that counterparty. In exchange, you become the only person who can lose the coins and the only one who can move them.',
        'So "not your keys, not your coins" is not a slogan aimed at exchanges. It is a statement about which side of that trade you are on: hold the keys yourself, or hold somebody else\'s promise.',
      ],
    },
    {
      heading: 'The seed phrase is the whole wallet',
      paragraphs: [
        'Most modern wallets are deterministic: one secret, the seed phrase, derives every private key and every address you will ever use. Twelve or twenty-four ordinary English words, generated for you once.',
        'Anyone who reads that phrase owns the coins, permanently and provably, because they can regenerate your keys and sign for them. There is no second factor, no support line and no reset button. Treat those words like a vault key rather than a password.',
      ],
    },
    {
      heading: 'Where the keys live day to day',
      paragraphs: [
        'A workable setup separates the two jobs. A hot wallet for spending, where speed matters and the amount is small. A cold wallet for savings, where the only requirement that matters is that the keys never touch a machine that is online.',
        'The cold wallet signs on its own screen, so a transaction has to be approved on the device itself. That is exactly what malware on your computer cannot do on your behalf, and it is why the habit of checking the screen is worth forming before you need it.',
      ],
    },
    {
      heading: 'Backups that survive a bad week',
      paragraphs: [
        'Write the phrase on paper, or stamp it into metal. Two copies, in two different physical places, so that one fire, one flood or one burglary cannot take both.',
        'Never photograph it, and never paste it into a notes app, spreadsheet, email draft or cloud drive. Those are the first places a thief or a malware scan looks, because that is where everybody keeps them.',
        'Test the restore: open a brand new wallet, enter the phrase, and confirm the addresses match. An untested backup is a hope, not a backup.',
      ],
    },
    {
      heading: 'Buying without regrets',
      paragraphs: [
        'Start with an amount you could afford to lose while you learn. The first purchase is tuition.',
        'Withdraw to your own wallet early and small, then a larger one. It proves your setup works before the size of the amount depends on it.',
        'Check the receiving address on the wallet\'s own screen, character by character. Address poisoning and clipboard malware both work by making what you pasted look right when it is not.',
      ],
    },
    {
      heading: 'The mistake that ends everything',
      paragraphs: [
        'A lost seed phrase with no backup cannot be recovered. Not by support, not by the wallet developer, not by anyone. The coins stay on the ledger forever, spendable by no one.',
        'There is no customer service in a system with no accounts. That is the trade you make for not having to trust one.',
      ],
    },
  ],
  tryIt: [
    'Write a one-page recovery note for a friend: where the backup lives, who else knows about it, and exactly what to do if the device is lost.',
  ],
  questions: [
    {
      id: 'l1-2-q1',
      prompt: 'You write your twelve words on paper, and two years later restore the same wallet on a new phone. Why does that work?',
      options: [
{
          id: 'a',
          label: 'Because the phrase contains a copy of the coins themselves',
          correct: false,
          explanation: 'The phrase contains no coins. It contains the ability to unlock outputs that already sit on the ledger.',
        },
{
          id: 'b',
          label: 'Because the words deterministically regenerate every key and address from one master secret',
          correct: true,
          explanation:
            'That is what deterministic derivation means. The same words always rebuild the same wallet, which is why one backup is enough to restore everything.',
        },
{
          id: 'c',
          label: 'Because the wallet provider kept a copy for you',
          correct: false,
          explanation: 'If a provider kept a copy, the wallet would be custodial and your recovery would depend on that provider still existing.',
        },
{
          id: 'd',
          label: 'Because the blockchain remembers which devices belong to you',
          correct: false,
          explanation: 'The chain records outputs and the keys that control them. It has no concept of your devices.',
        }
      ],
    },
    {
      id: 'l1-2-q2',
      prompt:
        'You install an app, tap "create wallet", and it shows you a 12-word recovery phrase. Who holds the keys that can spend your coins?',
      options: [
{
          id: 'a',
          label: 'Nobody, because the coins sit on the blockchain unclaimed until someone spends them',
          correct: false,
          explanation:
            'Coins are unspent outputs in the shared ledger, controlled by whoever holds the key that locks them. Nobody needs to claim them.',
        },
{
          id: 'b',
          label: 'The exchange, which holds keys on your behalf and hands them over when you need them',
          correct: false,
          explanation:
            'Any third party holding keys is a counterparty whose failure costs you. Keep the keys in the wallet you are actually using.',
        },
{
          id: 'c',
          label: 'You do, because the phrase restores keys on your own device and the app is only an interface',
          correct: true,
          explanation:
            'That is a non-custodial wallet. The keys live on your device, so the provider cannot move the coins without you, and the phrase is a backup of those keys rather than a login.',
        },
{
          id: 'd',
          label: 'The app company, because it generated the phrase on its own servers',
          correct: false,
          explanation:
            'If the provider keeps a copy it is custodial, and the phrase you were shown is a copy of something it can also use. This is the case the slogan warns about.',
        }
      ],
    },
    {
      id: 'l1-2-q3',
      prompt: 'You want a backup that survives a thief, a house fire, and malware on your computer. Which one holds up?',
      options: [
{
          id: 'a',
          label: 'A photo in your camera roll, synced to your cloud account',
          correct: false,
          explanation: 'A cloud copy is one compromised account away from being the end of your money, and it is the first place a thief looks.',
        },
{
          id: 'b',
          label: 'An encrypted note in a password manager on two phones',
          correct: false,
          explanation: 'Better than a photo, but the secret is now on networked devices and inside one company\'s database. A device compromise or a provider failure gets you.',
        },
{
          id: 'c',
          label: 'A USB stick in your desk drawer at the office',
          correct: false,
          explanation: 'It survives a house fire, but it is one burglary or one lost bag from being gone, and it is often the only copy you have.',
        },
{
          id: 'd',
          label: 'A copy on paper or metal, in two separate physical locations, neither of them online',
          correct: true,
          explanation:
            'This survives all three threats at once: no account to compromise, and no single place to lose. The trade-off is that it cannot be recalled or changed once written.',
        }
      ],
    },
    {
      id: 'l1-2-q4',
      prompt: 'Why can a seed phrase not be recovered by anyone, including the wallet developer?',
      options: [
{
          id: 'a',
          label: 'Because there is no account, no server copy and no reset, so the phrase is the only key that exists',
          correct: true,
          explanation:
            'Recovery is not technically difficult, it is structurally impossible: there is no copy anywhere to recover from. That is also what makes the phrase worth protecting.',
        },
{
          id: 'b',
          label: 'Because exchanges only keep copies for 90 days',
          correct: false,
          explanation: 'Exchanges are not involved in a self-custodial wallet at all, so no exchange policy applies.',
        },
{
          id: 'c',
          label: 'Because it can only be restored onto the original device',
          correct: false,
          explanation: 'The opposite is true. A seed phrase restores the same wallet on any compatible device, which is what makes it portable.',
        },
{
          id: 'd',
          label: 'Because the words are hashed on the blockchain',
          correct: false,
          explanation: 'The words never touch the blockchain. They only ever generate keys locally, which is precisely why nobody else can help.',
        }
      ],
    },
    {
      id: 'l1-2-q5',
      prompt: 'You keep savings on a hardware wallet. Which attack does that actually stop?',
      options: [
{
          id: 'a',
          label: 'A company deciding to freeze your account',
          correct: false,
          explanation: 'There is no company to freeze anything, because nobody else holds the keys. That is a different, simpler protection.',
        },
{
          id: 'b',
          label: 'Malware on your computer that tries to sign a transaction draining the wallet',
          correct: true,
          explanation:
            'The private key is on the device and never leaves it, so malware can ask for a signature but cannot produce one itself. It can only watch you approve something.',
        },
{
          id: 'c',
          label: 'Sending to a receiving address you did not mean to use',
          correct: false,
          explanation: 'The hardware device cannot tell a wrong address from a right one. You still have to check the screen yourself.',
        },
{
          id: 'd',
          label: 'A phishing site that asks you to type your seed phrase into a fake form',
          correct: false,
          explanation: 'A hardware device cannot tell a real prompt from a fake one. Phishing your words is still the single most effective attack.',
        }
      ],
    },
  ],
};

const L1_3: Lesson = {
  id: 'l1-3-spending-safely',
  title: 'Spending safely',
  blurb: 'Invoices versus addresses, the mempool in plain English, verifying payments, and the scams that borrow real words.',
  minutes: 7,
  sections: [
    {
      heading: 'An address is not an invoice',
      paragraphs: [
        'An on-chain address is reusable: send to it whenever you like, as often as you like. A Lightning address like name@domain looks like an address but behaves like a request. It generates a fresh invoice each time, and the payment has to match that specific invoice.',
        'Invoices are single-use and they expire. That is deliberate: it stops one paid invoice being replayed, and it tells the payer exactly how much is expected and how long they have.',
      ],
    },
    {
      heading: 'The mempool, in plain English',
      paragraphs: [
        'Blocks have limited space. Transactions waiting to be included sit in the mempool, and miners fill blocks mostly in order of the fee paid per unit of space. If a block fills up with higher-paying transactions, yours waits, however long it takes.',
        'Fees are quoted in satoshis per virtual byte, which measures how much block space you take up rather than how much you send. A large payment with a single input is cheap; a payment consolidating twenty small inputs is not.',
      ],
    },
    {
      heading: 'Why it is stuck',
      paragraphs: [
        'Almost always the cause is a fee rate below what the network is currently paying for inclusion. It is not a fault, a scam, or lost money. The coins are reserved, just not included yet.',
        'Most wallets can raise the fee on a stuck transaction (replace-by-fee), or you can simply wait for the mempool to clear. The exception is a transaction that was replaced or evicted entirely, which is where checking on-chain starts to matter.',
      ],
    },
    {
      heading: 'Check it yourself',
      paragraphs: [
        'A payment notification is a claim. An explorer or your own node is evidence: check the amount, check the address it actually paid, and count the confirmations.',
        'This is the difference between trusting someone and verifying something, and it is the habit that matters once the amounts get large.',
      ],
    },
    {
      heading: 'Scams that borrow real vocabulary',
      paragraphs: [
        'Nobody who legitimately supports you will ever ask for your seed phrase. Not "to verify your wallet", not "to migrate it", not as part of a refund. Blurring a screenshot or sharing six of twelve words is still handing over part of a key.',
        'Fake wallet "sync" sites, urgent "double your sats" giveaways, and direct messages from "support" that you did not initiate all borrow real technical language to make a lie sound procedural.',
        'Practical defences: only ever type a seed phrase into hardware you set up yourself and never into a website; read the full receiving address on the device screen; and treat any time pressure as the actual attack.',
      ],
    },
    {
      heading: 'Can it be reversed?',
      paragraphs: [
        'No. There is no chargeback and no administrator who can edit a block. A confirmed transaction is permanent, and the only way those coins move again is a new transaction spending the same outputs, which is public too.',
        'Reversibility is a feature of the banking system rather than of Bitcoin. If you want a safety net, you are choosing a merchant who offers one on-chain; you cannot demand one.',
      ],
    },
  ],
  tryIt: [
    'Pay a small test amount first, confirm it on-chain, and only then send the real amount.',
  ],
  questions: [
    {
      id: 'l1-3-q1',
      prompt: 'A café gives you the address joe@theirshop.com and you send 2,000 sats to it. What actually happened?',
      options: [
{
          id: 'a',
          label: 'The shop signed into a custodial account and withdrew',
          correct: false,
          explanation: 'That would describe a custodial Lightning wallet, and it is a choice the shop made about its own keys, not something implied by the address.',
        },
{
          id: 'b',
          label: 'A transaction was broadcast to the public Bitcoin blockchain',
          correct: false,
          explanation: 'That is the opposite of Lightning. A public transaction would show the payment to everyone and cost more than the payment itself.',
        },
{
          id: 'c',
          label: 'The address produced a fresh single-use invoice, and you paid that invoice',
          correct: true,
          explanation:
            'Nothing is sent to the address itself. The address is a lookup that returns a new invoice each time, and the payment settles between wallet peers off-chain.',
        },
{
          id: 'd',
          label: '2,000 sats are now locked to that address permanently',
          correct: false,
          explanation: 'Lightning addresses are human-readable aliases, not destinations. A reusable on-chain address works differently from this.',
        }
      ],
    },
    {
      id: 'l1-3-q2',
      prompt: 'Your 10,000-sat transaction has been pending for a day. What is most likely happening?',
      options: [
{
          id: 'a',
          label: 'An exchange is holding it for review',
          correct: false,
          explanation: 'If you sent from an exchange and it controls the transaction, it can be held. That is a provider policy, not how the base layer works.',
        },
{
          id: 'b',
          label: 'The network rejected it as invalid',
          correct: false,
          explanation: 'An invalid transaction never enters the mempool in the first place. It would have failed immediately and spent nothing.',
        },
{
          id: 'c',
          label: 'It has confirmed and your wallet is not refreshing',
          correct: false,
          explanation: 'Check it on an explorer to rule this out, but a wallet that is stuck on a confirmed transaction is rare compared with the fee explanation above.',
        },
{
          id: 'd',
          label: 'It is valid and in the mempool, competing for limited block space at a fee rate below current demand',
          correct: true,
          explanation:
            'This is normal under load. Your coins are reserved, the transaction is simply outbid, and it will be included when demand drops or you raise the fee.',
        }
      ],
    },
    {
      id: 'l1-3-q3',
      prompt: 'Someone in a support chat asks for your seed phrase "to verify your wallet". What should you do?',
      options: [
{ id: 'a', label: 'Share nothing and leave', correct: true, explanation: 'No legitimate agent ever needs a seed phrase, and blurring words still exposes the rest.' },
{ id: 'b', label: 'Share only the first six words', correct: false, explanation: 'Six of twelve words is a large slice of the key space and still compromises the wallet.' },
{ id: 'c', label: 'Send a screenshot with the words blurred', correct: false, explanation: 'Screenshots can be edited, and the unblurred parts still matter.' },
{ id: 'd', label: 'Share it, they need it', correct: false, explanation: 'No support flow anywhere requires a seed phrase. This is the single most common theft trick.' }
      ],
    },
    {
      id: 'l1-3-q4',
      prompt: 'How do you independently check that a payment actually arrived?',
      options: [
{ id: 'a', label: 'Refresh the app twice', correct: false, explanation: 'Refreshing shows you what the app last heard, which is the same claim again.' },
{
          id: 'b',
          label: 'Look the transaction up on a block explorer or in your own node',
          correct: true,
          explanation: 'Verification means reading the chain yourself instead of trusting a claim about it.',
        },
{ id: 'c', label: 'Ask the sender', correct: false, explanation: 'Asking the payer is still trusting the payer.' },
{ id: 'd', label: "Trust the merchant's receipt", correct: false, explanation: 'A receipt is the merchant telling you what happened, not evidence.' }
      ],
    },
    {
      id: 'l1-3-q5',
      prompt: 'A confirmed transaction sent 1 BTC. What is still possible?',
      options: [
{ id: 'a', label: 'The sender can ask a miner to undo it within 24 hours', correct: false, explanation: 'Miners follow the rules, and there is no cancellation window in the protocol.' },
{ id: 'b', label: 'An exchange can reverse it on request', correct: false, explanation: 'An exchange can freeze its own customer balances, but it cannot edit settled history.' },
{
          id: 'c',
          label: 'It stays in history, and those coins can only move again if a new transaction spends them',
          correct: true,
          explanation:
            'The ledger is append-only. Spending an output again is normal forward progress, not a reversal, and that new transaction is public too.',
        },
{ id: 'd', label: 'It is deleted if nobody confirms it further', correct: false, explanation: 'Confirmations accumulate but nothing expires. A confirmed transaction is a permanent entry.' }
      ],
    },
  ],
};

/**
 * Deliberately a short bridge rather than a summary of Level 2. Its job is to
 * stop the beginner treating the hard-money claim as a slogan, and to hand them
 * to Level 2 with the hard part still open.
 */
const L1_4: Lesson = {
  id: 'l1-4-the-money-question',
  title: 'The money question',
  blurb:
    'You now hold two different kinds of money. Here is the strongest case for why that difference matters, and what you have to get right for it to hold.',
  minutes: 5,
  sections: [
    {
      heading: 'You are holding two different kinds of money',
      paragraphs: [
        'The rand you earn, the dollar you see quoted, the euro in your account: all of these are fiat money. They are valuable because a government issues them and because a state can insist you pay taxes in them. Their supply is a policy decision, made by committees, and it can change.',
        'Bitcoin is not that. Nobody\'s committee decides how much there will be. The schedule is written into the rules, and the last of the 21 million is not due until around the year 2140.',
        'That is the entire structural difference, and it is also the only part of the claim you can verify from the protocol itself rather than take on somebody\'s word.',
      ],
    },
    {
      heading: 'What the cap does, and what it does not do',
      paragraphs: [
        'The cap is a real and unusual property, so it is worth being precise about how far it reaches.',
      ],
      points: [
        'The total supply is knowable in advance, and no institution can add to it. Your share cannot be diluted by a new issuance decision, by a bank, or by a government.',
        'Bitcoin is the first money in history where the supply rule is enforced by everyone who runs the system rather than promised by the people who issued it. That is not a trust question, and nobody has to take anyone\'s word for it.',
        'Money is acceptance, and that is the frontier. Bitcoin\'s supply is fixed today, and the work now is people choosing to hold it and use it, which is what this course is for. Fiat does not have to win your consent, which is its advantage and also its limit.',
        'A fixed supply fixes the quantity and nothing else. It does not decide how many people come to hold it, and it does not decide how quickly. That is an adoption question rather than a design question, and it is handled with position size and time horizon rather than with doubt.',
      ],
    },
    {
      heading: 'The part the slogans skip',
      paragraphs: [
        'If you have heard "Bitcoin protects your savings from inflation" said as though it were a fact, be suspicious of the slogan, because it is stronger than the truth. The version you can check is narrower: a supply rule that cannot be changed, set against a money supply that can be changed by a committee. Consumer prices in the United States had risen about 3.4% over the year, and that is the kind of fact a supply rule is meant to address, whether or not any particular asset responded over any particular twelve months.',
        'Saying this out loud is not disloyalty to anything. It is the difference between an argument you can evaluate and one you have to believe, and an argument that survives being checked is worth a great deal more.',
        'What survives the check is stronger than the slogan anyway. The case for Bitcoin was never a forecast about any single holding\'s outcome. It is that your earnings are denominated in money someone else can dilute, and a supply no one can expand is a hedge against that specific risk. You do not need anyone to predict 2030 for that to be true, and you do not need to be right about timing to benefit from holding it.',
        'The remaining risk is adoption, and that is a decision about how much to hold and for how long, not a question about whether the design works. Sizing for it is exactly the skill this course is trying to build.',
      ],
    },
    {
      heading: 'What this course does with that',
      paragraphs: [
        'Level 2 does the actual work, and it is deliberately harder than a slogan. It covers what money is and where it comes from, five serious schools of economic thought stated in their strongest form, what inflation is doing to living standards right now with the sources named, and finally what Bitcoin does and does not do about any of it.',
        'None of the five schools is treated as the winner, because the honest answer is that they disagree about mechanisms and the evidence has not settled between them. Pick one as a working tool if it helps. Do not pick one as an identity.',
      ],
    },
  ],
  tryIt: [
    'Before you decide what you think, write down your one-sentence answer to: what is Bitcoin actually for? Then read Level 2 and see whether you would still write the same sentence.',
  ],
  questions: [
    {
      id: 'l1-4-q1',
      prompt:
        'A newcomer says "gold is scarce too, so what is the point of switching to Bitcoin?" What is the strongest answer?',
      options: [
{
          id: 'a',
          label: 'Bitcoin is rarer than gold, and rarity is all that value needs to be',
          correct: false,
          explanation:
            'Scarcity on its own is not money, and a rarity nobody has agreed to accept is just a curiosity. The interesting claim is not that Bitcoin is rarer, it is that Bitcoin\'s scarcity is enforced rather than hoped for.',
        },
{
          id: 'b',
          label: 'Bitcoin is already accepted as legal tender almost everywhere, so it is the safest place to keep money today',
          correct: false,
          explanation:
            'Legal tender status is a small minority of countries, and it is a weakness rather than a strength: the whole point is that Bitcoin does not depend on a state to give it value. A safe store of value is a different claim from a claim about adoption.',
        },
{
          id: 'c',
          label: 'Bitcoin transactions are free, which is why it beats gold on cost',
          correct: false,
          explanation:
            'On-chain transactions cost money, which is exactly why Lightning exists. Cheap settlement is real and it is part of the case, but it is not what makes Bitcoin money and it is not the strongest answer to this question.',
        },
{
          id: 'd',
          label: 'Gold\'s scarcity depends on people choosing not to mine more, while Bitcoin\'s cap is a rule every node checks, so no bank or government can dilute what you hold',
          correct: true,
          explanation:
            'That is the difference that does the work. Gold is genuinely scarce but nothing stops more of it being produced if that becomes profitable, and gold supply responds to incentives nobody can rule out. Bitcoin\'s limit is enforced by consensus, so it is a fact about the system rather than a promise about someone\'s behaviour.',
        }
      ],
    },
    {
      id: 'l1-4-q2',
      prompt: 'Your savings account pays 7% while consumer prices rose 4.4% over the year. What happened to what you can buy?',
      options: [
{
          id: 'a',
          label: 'Roughly 2.6% a year more purchasing power, before tax',
          correct: true,
          explanation:
            'Real return is roughly the nominal rate minus inflation. It is a rough instrument rather than a promise, and it assumes you actually earn 7% after tax rather than the headline figure.',
        },
{
          id: 'b',
          label: 'About 11.4% a year less purchasing power',
          correct: false,
          explanation: 'That is what you would get by adding the two numbers instead of subtracting, which is a common and expensive mistake.',
        },
{
          id: 'c',
          label: 'It depends only on the exchange rate against the dollar',
          correct: false,
          explanation: 'The exchange rate is one channel through which imported prices rise, but a real return is measured against the prices you personally buy.',
        },
{
          id: 'd',
          label: 'Nothing, the interest rate is the number that matters',
          correct: false,
          explanation: 'The nominal rate tells you what the account pays. It says nothing about what that money can purchase, which is the question that affects you.',
        }
      ],
    },
    {
      id: 'l1-4-q3',
      prompt: 'Bitcoin\'s supply is fixed by protocol. A government can issue more rand. What follows from that difference?',
      options: [
{
          id: 'a',
          label: 'The two will move together, because supply is the only thing that determines a price',
          correct: false,
          explanation: 'Supply is one input among several, and demand, expectations and sentiment do most of the work in setting any price.',
        },
{
          id: 'b',
          label: 'The rules governing the two supplies differ, so the two assets do not carry the same risk',
          correct: true,
          explanation:
            'That is the actual consequence: a different supply rule means a different risk profile. It is a statement about risk, not a promise about which one goes up. It is also the answer that does not require the theory to be unanimous. Monetarists would put the weight on the money supply, Keynesians on the demand side, and behavioural readings on adoption and liquidity. The scarcity argument in D is the hard-money version of the same disagreement, and this course states the split rather than picking a side and calling it a fact.',
        },
{
          id: 'c',
          label: 'That 21 million against unlimited fiat issuance makes appreciation close to arithmetic, so scarcity does the work',
          correct: false,
          explanation: 'This is the strong version of the scarcity argument, and it deserves a straight answer rather than a dismissal. A fixed quantity facing an expanding one should appreciate in real terms over a long enough horizon, and that is a serious claim rather than a slogan. What it skips is that the same supply-and-demand model treats demand as the other half of the equation. On that reading the rule constrains one side and leaves the other to adoption, so the two can sit far apart for a long time.',
        },
{
          id: 'd',
          label: 'The rand will be worthless within a year',
          correct: false,
          explanation: 'No serious economist, from any school, claims a currency simply collapses. That is a cartoon, not an argument.',
        }
      ],
    },
    {
      id: 'l1-4-q4',
      prompt: 'Someone explains Bitcoin as "it is up because inflation is high." What is the strongest way to handle that claim?',
      options: [
{
          id: 'a',
          label: 'Accept it, because it is the standard argument',
          correct: false,
          explanation:
            'It is a widespread argument rather than a verified one, and popularity is not the test. A slogan you repeat is worth less than a mechanism you can explain.',
        },
{
          id: 'b',
          label: 'Ask the person to prove inflation is not real',
          correct: false,
          explanation:
            'That sidesteps the claim instead of testing it, and the price data is public anyway. Asking someone to disprove inflation is not a way of answering a question about Bitcoin.',
        },
{
          id: 'c',
          label: 'Treat it as a slogan rather than a mechanism: inflation erodes the wages you are paid in, which is the reason to hold something no institution can expand, and you test that over a full cycle rather than one good or bad year',
          correct: true,
          explanation:
            'This is the honest version of the argument, and it is stronger than the slogan because it does not depend on a forecast. The case rests on what you hold over years and on position size, and not on timing.',
        },
{
          id: 'd',
          label: 'Agree, because hard money always wins in the long run',
          correct: false,
          explanation:
            'A long-run conclusion is fine and an unverifiable one is not. "Always wins" claims nothing you can check against a five-year or ten-year record, and it is not what the hard-money argument actually claims.',
        }
      ],
    },
    {
      id: 'l1-4-q5',
      prompt: 'A beginner asks whether Bitcoin is a "safe" place to keep savings. What is the honest and useful answer?',
      options: [
{
          id: 'a',
          label: 'It depends mainly on which exchange you keep it on',
          correct: false,
          explanation:
            'Exchange choice matters for custody risk and it has nothing to do with whether the asset can be diluted. Holding your own keys removes the counterparty risk, and this course covers that in Level 1.2.',
        },
{
          id: 'b',
          label: 'Yes, it is safe, because the supply is capped',
          correct: false,
          explanation:
            'A cap guarantees the supply and nothing about whether anyone keeps choosing it. Promising safety on the strength of the cap alone is the overstatement that gets the whole argument dismissed.',
        },
{
          id: 'c',
          label: 'No, it cannot be safe, because nothing obliges anyone to keep holding it',
          correct: false,
          explanation:
            'The fact that people have given up on it before is a fact about uptake, not a verdict on the design. It says something real about how hard adoption is, and nothing at all about whether the supply rule works.',
        },
{
          id: 'd',
          label: 'The supply rule is fixed and verifiable, so no institution can dilute it, and the real risk is adoption, which you manage with position size and time horizon',
          correct: true,
          explanation:
            'That separates the two questions properly. The dilution risk is answered by the design, permanently and without anybody\'s cooperation, and the adoption risk is yours to size. Nobody can promise you that people will keep choosing this, and anyone who does is selling something, but a cap you can verify is a fact rather than a guess.',
        }
      ],
    },
  ],
};

const M2_1: Lesson = {
  id: 'm2-1-what-money-is',
  title: 'What money actually is',
  blurb: 'The three jobs money does, why most money is a bank record, and where new deposits come from.',
  minutes: 8,
  sections: [
    {
      heading: 'Three jobs, and a candidate can fail one',
      paragraphs: [
        'A thing becomes money because people agree it does three jobs at once. It is a medium of exchange, so you can pay with it. It is a unit of account, so you can price things in it. And it is a store of value, so you can hold it and spend it later without it evaporating.',
        'Most proposed cryptocurrencies fail on the first two and are trying to fix the third. Cash still works fine as an exchange medium while a shop accepts it, and it still measures prices well enough. What it struggles with is holding value across decades.',
      ],
    },
    {
      heading: 'Money is mostly a record, not a thing',
      paragraphs: [
        'This is the fact that surprises people who picture money as a pile of notes. In almost every modern economy, the large majority of the money stock is a number in an account: a liability of a commercial bank.',
        'Banknotes are a small, shrinking share of it. That matters for two reasons. It means the money supply is a measure of bank balance sheets, and it means that when a bank fails, the failure is a question about a money system rather than about a robbed vault.',
      ],
    },
    {
      heading: 'Where new deposits come from',
      paragraphs: [
        'The image people carry is a central bank printing banknotes. In practice most new money appears when a commercial bank approves a loan: your mortgage, your car finance, a business facility. The moment the loan is made, a deposit is credited to your account that did not exist a moment earlier.',
        'The bank is simultaneously creating a liability to you and an asset for itself. The loan is the money. Nothing was printed, nothing was transferred from anyone else\'s account, and the number of rand in the system went up by the size of the loan.',
        'The United States removed its reserve requirement in 2020, which is a useful reminder that the limit on deposit creation is not a simple "ten percent in the vault" rule.',
      ],
    },
    {
      heading: 'The money multiplier, and why it oversells the story',
      paragraphs: [
        'Economics textbooks used to teach a clean formula: with a 10 percent reserve requirement, one rand of reserves creates ten rand of deposits, so money multiplies. It is memorable, and it does not match what banks actually do.',
        'The practical constraint is not one number. A bank cannot lend what it cannot fund, cannot lend without holding capital against the risk, and cannot lend to nobody. In several countries required reserve ratios are zero, so the formula would predict infinite money creation, which plainly has not happened.',
        'Recognise this as a live disagreement rather than a settled fact. Serious economists still argue about how much money lending creates and what the limits are. What is not in dispute is the mechanism: loans create deposits.',
      ],
    },
    {
      heading: 'A currency nobody issued',
      paragraphs: [
        'Every rand in circulation is ultimately backed by something: a claim on a bank, which is a claim on assets, which are largely a claim on the state\'s ability to collect taxes and settle its debts. The value of fiat money rests substantially on the state standing behind it, including coercively.',
        'Bitcoin is not a claim on anything. It confers no right to a house, a service, or a share of a company. Its value has to be generated entirely by voluntary agreement between people who choose to hold it.',
        'That is a genuine structural difference, and it cuts both ways. It is why Bitcoin cannot be diluted by a policy decision, and also why it cannot be demanded of anyone.',
      ],
    },
  ],
  tryIt: [
    'Look at your bank statement and find the deposit balance. Then check what that bank\'s total assets and liabilities look like on its website or annual report. The claim you hold is a line on a balance sheet.',
  ],
  questions: [
    {
      id: 'm2-1-q1',
      prompt: 'A bank approves your bond and credits the amount to your account. That balance did not exist a moment earlier. Where did the money come from?',
      options: [
{
          id: 'a',
          label: 'The bank created it, as the deposit side of the loan it just made',
          correct: true,
          explanation:
            'A loan is an asset for the bank and a liability to you, and the two are created together. That is the mechanism behind most new money in the economy, and it is why "money printing" is an incomplete description of banking.',
        },
{
          id: 'b',
          label: 'It was moved from a savings account into your transaction account',
          correct: false,
          explanation: 'Moving money between your own accounts changes nothing about the total, and it could not have created a balance that did not exist.',
        },
{
          id: 'c',
          label: 'It was taken from someone else\'s account and reassigned to you',
          correct: false,
          explanation: 'That would be a transfer rather than an increase. The total money supply would be unchanged, and no new lending would be involved.',
        },
{
          id: 'd',
          label: 'The central bank printed it and passed it to the bank',
          correct: false,
          explanation: 'Banks do not wait for notes from the central bank to make a loan. The loan is funded by creating a matching liability, which is why the money supply is mostly bank liabilities.',
        }
      ],
    },
    {
      id: 'm2-1-q2',
      prompt: 'A textbook says a 10% reserve requirement gives a money multiplier of ten, so R1,000 of reserves should create R10,000. A researcher measures the real result as far smaller. What is the fairest conclusion?',
      options: [
{
          id: 'a',
          label: 'Banks are required to hold 10% and simply decide not to lend it',
          correct: false,
          explanation: 'A reserve requirement limits what must be held, not what may be lent. Holding more than required and not lending anyway is a real choice, but it is not what a requirement dictates.',
        },
{
          id: 'b',
          label: 'The multiplier ignores what actually limits banks: capital, funding, liquidity and whether anyone wants to borrow',
          correct: true,
          explanation:
            'This is a genuine and still-unresolved disagreement in economics. The formula is memorable and the mechanism is real, but the binding constraint in practice is bank capital and funding, not a reserve fraction, which is zero in several countries.',
        },
{
          id: 'c',
          label: 'Banks are secretly creating counterfeit money',
          correct: false,
          explanation: 'Deposit creation is legal, licensed and disclosed. Calling it counterfeiting describes a normal part of banking as though it were fraud.',
        },
{
          id: 'd',
          label: 'The textbook is right and the researcher made an error',
          correct: false,
          explanation: 'The textbook version is a simplification written for teaching, and it was never a literal forecast. Discarding measurement because it contradicts a model is backwards.',
        }
      ],
    },
    {
      id: 'm2-1-q3',
      prompt: 'A central bank buys R1bn of government bonds from a commercial bank. What did that directly create?',
      options: [
{
          id: 'a',
          label: 'R1bn of cash that households can spend immediately',
          correct: false,
          explanation: 'The purchase credits a bank, not a household. Money for households appears later and only if the bank lends or spends.',
        },
{
          id: 'b',
          label: 'R1bn of new household credit',
          correct: false,
          explanation: 'No household has borrowed anything. Credit creation happens when a bank makes a loan, not when a central bank buys securities from another bank.',
        },
{
          id: 'c',
          label: 'R1bn of reserves held at the central bank',
          correct: true,
          explanation:
            'That is the direct effect. Reserves and money are different things, and the gap between them is why "printing money" is looser language than people assume it is.',
        },
{
          id: 'd',
          label: 'R1bn of tax revenue for the government',
          correct: false,
          explanation: 'A bond purchase is not a tax. The government ends up with more outstanding debt, which is a different and separate effect.',
        }
      ],
    },
    {
      id: 'm2-1-q4',
      prompt: 'R100 in cash and a R100 account balance both work at the shop. Why is the balance usually the more important of the two?',
      options: [
{
          id: 'a',
          label: 'Cash loses value faster than a balance does',
          correct: false,
          explanation: 'Both are claims in the same currency. Currency depreciation hits them identically, which is why the distinction is about form, not about value.',
        },
{
          id: 'b',
          label: 'Cash is not legal tender and cannot be used for debt',
          correct: false,
          explanation: 'Cash is legal tender in South Africa. The difference is not legal status but which system holds the larger share.',
        },
{
          id: 'c',
          label: 'Banks are required to accept more cash than notes',
          correct: false,
          explanation: 'Deposit guarantees apply to the deposits, and note acceptance is a separate practical question. Neither explains the size difference.',
        },
{
          id: 'd',
          label: 'Most of the money stock is a bank liability rather than physical notes, so the balance sheet is the real money system',
          correct: true,
          explanation:
            'This reframes a lot of arguments. When people say "money supply", they usually mean bank liabilities, which is why bank runs are a monetary event and not just a banking one.',
        }
      ],
    },
    {
      id: 'm2-1-q5',
      prompt: 'A tax authority will only accept payment in rand, and will not take Bitcoin. What does that establish?',
      options: [
{
          id: 'a',
          label: 'It establishes that rand has state backing behind it, and Bitcoin has to earn its value through voluntary use',
          correct: true,
          explanation:
            'Money and legal tender are not the same thing. A state currency carries the state\'s ability to compel payment, and that is a real advantage for it. Bitcoin lacks that backing entirely, which is both its weakness and the source of the property that interests people.',
        },
{
          id: 'b',
          label: 'Bitcoin will replace the rand within five years',
          correct: false,
          explanation: 'Nothing about tax collection implies a timeline, and this is a prediction rather than an inference. A lesson that supplied one would be making things up.',
        },
{
          id: 'c',
          label: 'Bitcoin is not money, because money is whatever a state will take',
          correct: false,
          explanation: 'Taxes are one source of demand for a currency, not a complete definition of money. Gold is not tax-collectable and is still money by most definitions.',
        },
{
          id: 'd',
          label: 'The tax authority is acting unreasonably',
          correct: false,
          explanation: 'A state collecting its own currency is entirely standard. The reason is fiscal, not unreasonable.',
        }
      ],
    },
  ],
};

const M2_2: Lesson = {
  id: 'm2-2-schools-of-thought',
  title: 'Five schools, one problem',
  blurb: 'Austrian, Keynesian, monetarist, neoclassical and MMT, each in the form its best advocates would recognise.',
  minutes: 9,
  sections: [
    {
      heading: 'Why schools exist at all',
      paragraphs: [
        'These schools are not arguing about the data. They largely agree on what happened. They disagree about the mechanism underneath, and therefore about what should be done about it.',
        'That is why the argument is so persistent. If two people disagree about facts, you can settle it with a source. If they agree on facts and disagree about causation, the disagreement is structural, and it usually comes down to assumptions about how people behave that cannot be settled the same way.',
      ],
    },
    {
      heading: 'Austrian economics',
      paragraphs: [
        'Built on Mises, Hayek and Rothbard. Its foundations are three claims worth knowing on their own merits, whether or not you end up agreeing with them.',
      ],
      points: [
        'Subjective value: nothing is valuable because of the labour in it. A thing is worth what the highest-valuing person will trade for it, and that ranking differs between people and changes over time.',
        'Time preference: saving is postponing consumption, and postponed consumption is the basis of all capital formation. A society that saves more can build more.',
        'The calculation problem: without a widely accepted money, prices cannot express relative scarcity clearly, so entrepreneurs cannot work out whether a plan is profitable. Money is a communication device before it is a store of value.',
        'The business cycle theory: expanding credit on fractional reserves offers a rate of interest that does not reflect real saving, so capital is directed into projects that only look profitable while cheap money lasts. The boom is the distortion, the bust is the correction.',
        'Prescription: end central banking, abolish the ability to expand credit artificially, and let prices and saving guide capital. Hard money, in other words.',
      ],
    },
    {
      heading: 'Keynesian economics',
      paragraphs: [
        'Named for John Maynard Keynes, and dominant in policy circles from the 1940s into the 1990s. Its central claim is that an economy can get stuck below its capacity.',
      ],
      points: [
        'Demand can fall short of supply, producing unemployment and idle capacity. Nobody is forced to employ workers in a recession, so the absence of work is not evidence that the work is unprofitable.',
        'Prices and wages are sticky downwards, because workers resist nominal pay cuts and firms hesitate to cut prices, so demand shocks turn into output shocks rather than price adjustments.',
        'The 2008 collapse is the reference case: the economy was not short of houses or goods, it was short of spending. On this view, letting a financial crisis run its course is a policy choice with a human cost.',
        'Prescription: fiscal stimulus, deficit spending in a slump, and central banks that keep rates low until demand recovers.',
      ],
    },
    {
      heading: 'Monetarism',
      paragraphs: [
        'Milton Friedman\'s position, and the most direct ancestor of the Bitcoin argument. Where the Austrians blame credit expansion, Friedman blamed money.',
      ],
      points: [
        'Inflation is always and everywhere a monetary phenomenon. You cannot explain persistent price growth without money growing faster than output.',
        'Rules beat discretion. A central bank that commits to a published rule in advance is more trustworthy than one that improvises, because policy surprises are hard to distinguish from political opportunism.',
        'The practical version is inflation targeting: a published number, with policy adjusted to bring actual inflation towards it. The United States, euro area, United Kingdom and South Africa all operate some form of it.',
        'Prescription: control money growth, publish a target, and get out of the way.',
      ],
    },
    {
      heading: 'Neoclassical and rational expectations',
      paragraphs: [
        'The mainstream framework of most contemporary central banking, descended from the work that reconciled microeconomics with macroeconomics.',
      ],
      points: [
        'People learn. If everyone believes policy will respond to inflation, expectations adjust in advance and the same policy has less effect, which is the Lucas critique in plain terms.',
        'Activist fine-tuning is often self-defeating, because the attempt to exploit a predictable relationship destroys it.',
        'Money is largely neutral in the long run: it is a veil over real goods, capital and technology. A change in the money supply changes nominal variables first and real variables eventually.',
        'Prescription: rules, credibility, and a central bank that does not try to pick the top of the cycle.',
      ],
    },
    {
      heading: 'Modern Monetary Theory',
      paragraphs: [
        'The newest and most contested of the five, and in some ways the most radical. It starts by rejecting the money-multiplier framing of banking entirely.',
      ],
      points: [
        'Money is not fundamentally a commodity or a physical thing. It is a unit of account issued by a tax-collecting state, and the tax is what gives it demand.',
        'A government issuing its own currency cannot run out of its own money. It can run out of labour, capacity, land, imports or its ability to sell goods in foreign currency.',
        'Spending is a transfer of real resources. A government budget is not a household budget, and a deficit with the currency issuer is a different animal from a deficit with a foreign creditor.',
        'The real constraint is inflation: spend into an economy at capacity and the bidding starts, regardless of the financing method.',
        'The disputes are intense and mostly about external balance and exchange rates rather than the domestic mechanics. It is not a mainstream position and is treated as a serious one.',
      ],
    },
    {
      heading: 'Where they agree, and where they do not',
      paragraphs: [
        'The interesting part is how much ground they share, which is more than the shouting suggests.',
      ],
      points: [
        'Common ground: the 2008 crisis was not caused by a shortage of physical goods. Money is not a scarce good like silver. Central bank actions are consequential rather than neutral. Over the long run, sustained inflation is a monetary phenomenon.',
        'Sharp disagreement: whether discretionary intervention helps or harms, whether the economy is stable enough to manage, and how much weight expectations deserve.',
        'Sharpest practical split: what to do about a supply that cannot be expanded. A monetarist and an Austrian agree on the value of a rule-based cap and would argue over the reasons. A Keynesian considers a binding supply constraint to be a policy problem rather than a solution.',
      ],
    },
    {
      heading: 'How to use a school of thought',
      paragraphs: [
        'A school is a toolkit, not an identity. The useful move is to take one seriously enough to see what it would predict, then check whether the prediction held.',
        'Ask three questions of any economic claim: what is the mechanism, what evidence would change my mind, and what would I expect to see next? An argument that cannot answer the second and third is a slogan with a citation attached.',
      ],
    },
  ],
  tryIt: [
    'Pick the school you find least convincing and write down the one prediction it makes that you could actually check. Most people find they can, and that is the point of the exercise.',
  ],
  questions: [
    {
      id: 'm2-2-q1',
      prompt: 'An Austrian and a Keynesian economist both study the 2008 financial crisis. What is the real difference between them?',
      options: [
{
          id: 'a',
          label: 'They use different definitions of money and therefore cannot compare notes',
          correct: false,
          explanation: 'They broadly share a working definition of the money stock. The divergence is in the causal model, not the vocabulary.',
        },
{
          id: 'b',
          label: 'Keynesians traced it to a collapse in effective demand; Austrians traced it to credit expansion that misdirected capital into projects that never worked',
          correct: true,
          explanation:
            'Same event, different causal story, therefore different remedy: one argues for stimulus, the other for letting the correction run and preventing the next credit expansion. This is what a genuine disagreement about mechanism looks like.',
        },
{
          id: 'c',
          label: 'Keynesians believe banks caused it and Austrians blame governments',
          correct: false,
          explanation: 'The Austrians blame fractional-reserve credit expansion, which is a feature of the banking system they also criticise for being too fragile. It is not a simple blame assignment.',
        },
{
          id: 'd',
          label: 'They disagree about whether the crisis happened',
          correct: false,
          explanation: 'Both accept it happened and roughly when. Disagreeing about facts would be easy to settle; this is not that.',
        }
      ],
    },
    {
      id: 'm2-2-q2',
      prompt: 'A monetarist says inflation is always and everywhere a monetary phenomenon. On that view, a large tax rise with the money supply held constant should push prices…',
      options: [
{
          id: 'a',
          label: 'Nowhere, because taxes have no effect on prices',
          correct: false,
          explanation: 'A monetarist would expect an effect. The argument is that the money supply sets the nominal environment, and that the tax rise is a blunt way of cooling demand inside it.',
        },
{
          id: 'b',
          label: 'Up, because taxation always creates money',
          correct: false,
          explanation: 'Taxes destroy deposits rather than create them. Under MMT a tax is a monetary operation, but it is not money creation.',
        },
{
          id: 'c',
          label: 'Down, because cutting nominal demand is what cools prices in a monetarist model',
          correct: true,
          explanation:
            'This follows from money neutrality: real decisions respond to real rates and real spending, not to nominal ones. It is a theoretical prediction, and a crude instrument in practice, which is one reason monetary policy is done through rates rather than tax rises.',
        },
{
          id: 'd',
          label: 'Up, because every government action is inflationary',
          correct: false,
          explanation: 'That is a caricature. Monetarists are precisely the group most insistent that policy can be disinflationary.',
        }
      ],
    },
    {
      id: 'm2-2-q3',
      prompt: 'An MMT economist says a government issuing its own currency can never run out of money, but can run out of things. What follows?',
      options: [
{
          id: 'a',
          label: 'Countries sharing a currency such as the euro cannot run out of money either',
          correct: false,
          explanation: 'A currency union has no single issuer able to respond, and member states can run out of foreign currency. It is a well-known MMT vulnerability.',
        },
{
          id: 'b',
          label: 'A government can print unlimited real goods if it is determined',
          correct: false,
          explanation: 'Printing can create demand, not goods. The limit is the physical capacity of an economy, which is exactly the constraint MMT insists on.',
        },
{
          id: 'c',
          label: 'Taxes are a form of money printing',
          correct: false,
          explanation: 'On MMT\'s own account taxes are the opposite: they destroy deposits and create demand for the currency, which is what gives it value.',
        },
{
          id: 'd',
          label: 'Printing can generate demand for goods that do not exist, which shows up as inflation or as a collapsing currency',
          correct: true,
          explanation:
            'This is MMT\'s sharpest insight and also where its critics press hardest: the constraint is real resources and external balance, and the adjustment arrives through prices or through the exchange rate rather than through a printing failure.',
        }
      ],
    },
    {
      id: 'm2-2-q4',
      prompt: 'Which of these is closest to genuine common ground across the five schools?',
      options: [
{
          id: 'a',
          label: 'Money is not a scarce good like a metal, and central bank actions are consequential',
          correct: true,
          explanation:
            'On the scarcity point the schools are close to unanimous, which is why the Austrian criticism of gold-standard thinking applies to gold itself. The real argument is over the sign and the mechanism, not over whether policy matters.',
        },
{
          id: 'b',
          label: 'All inflation is caused by private banks',
          correct: false,
          explanation: 'That is close to an Austrian position and is opposed by the others. It is a contested claim, not common ground.',
        },
{
          id: 'c',
          label: 'The 2008 crisis was caused by a shortage of houses',
          correct: false,
          explanation: 'There was a housing construction boom and then a glut. Nobody serious claims physical scarcity caused the crash.',
        },
{
          id: 'd',
          label: 'The economy should be run by published rules only',
          correct: false,
          explanation: 'Monetarists and neoclassicals lean that way. Keynesians and MMT do not, and that disagreement is one of the sharpest in the set.',
        }
      ],
    },
    {
      id: 'm2-2-q5',
      prompt: 'Someone concludes "the Austrian school won, because Bitcoin has a fixed supply and national currencies do not." What is the best response?',
      options: [
{
          id: 'a',
          label: 'That is correct, and it settles the debate',
          correct: false,
          explanation: 'It does not settle anything. A cap is a policy design, and several traditions wanted something like it long before Bitcoin existed.',
        },
{
          id: 'b',
          label: 'Monetarists have argued for rule-based money for decades, so attaching Bitcoin to one school narrows what has to be true and weakens the case',
          correct: true,
          explanation:
            'This is the persuasive form of the argument. The hard-money instinct is older and broader than Austrianism, and the interesting question is whether a hard cap delivers, not which economist guessed it first.',
        },
{
          id: 'c',
          label: 'Bitcoin is Austrian economics with the theory removed',
          correct: false,
          explanation: 'Bitcoin is a protocol, not a theory, and it has no theory of business cycles attached. That is a weakness of the framing, not evidence of the economics.',
        },
{
          id: 'd',
          label: 'Monetarists oppose any fixed cap',
          correct: false,
          explanation: 'They are generally in favour of constraining discretionary money creation. The difference is degree and mechanism, and a global cap is a much stronger instrument than an inflation target.',
        }
      ],
    },
  ],
};

const M2_3: Lesson = {
  id: 'm2-3-fiat-and-cost-of-living',
  title: 'Fiat and the cost of living, right now',
  blurb: 'What inflation is actually doing in 2026, sourced and dated, including the parts that do not flatter the hard-money argument.',
  minutes: 10,
  sections: [
    {
      heading: 'How to read this lesson',
      paragraphs: [
        'This lesson reports figures as they stood on 26 September 2026, and every number below is attributed and dated. Numbers like these go out of date, and a lesson that quietly rots is worse than one with no numbers in it.',
        'So treat the figures as a snapshot and the method as the lesson. Every claim here can be checked against a primary source, and the sources are listed at the bottom of the page. If a figure has moved on by the time you read this, you have learned to do the thing the lesson was for.',
      ],
    },
    {
      heading: 'The current picture',
      paragraphs: [
        'South Africa: consumer inflation was 4.4% in August 2026, up from 4.3% in July and from 5.0% in June, according to Statistics South Africa. The Reserve Bank\'s target is 3% with a tolerance band of one percentage point either side, so 4.4% is above the top of that band. Its Monetary Policy Committee raised the policy rate by 25 basis points to 7.25% on 23 September, with the new rate taking effect on 25 September, and expects headline inflation to run above 5% later this year and early next year before slowing as the fuel shock recedes, then back near 3% towards the end of 2027.',
        'United States: consumer prices rose 3.4% over the year to August 2026, with core inflation at 2.4%. Energy prices are up 16.3% over the year, and gasoline alone is up more than a quarter.',
        'Euro area: inflation was 3.2% in August, up from 2.9% in July and from 2.0% a year earlier. Energy inflation in the euro area is running at 14.3%.',
        'None of these economies is meeting its target, and all three are fighting the same battle at the same time.',
      ],
    },
    {
      heading: 'The part that does not flatter the argument',
      paragraphs: [
        'If you were looking for a clean illustration of "they print money, prices rise", 2026 is not it, and pretending otherwise would be bad teaching.',
        'In September 2026 the Federal Reserve raised its policy rate by a quarter point to a range of 3.75% to 4.00%, on a 12-0 vote. The ECB raised its three key rates by 25 basis points on 10 September, taking the deposit facility to 2.50%, and the SARB raised its policy rate by 25 basis points to 7.25% effective 25 September. No major central bank was running a quantitative-easing programme. The fuel shock behind all of it shows up in the detail: the Reserve Bank reports an average petrol under-recovery of R2.83 per litre, and euro area energy inflation has accelerated to 14.3%.',
        'The central banks name the same first-order cause: an energy and fuel shock. That is not an assumption, it is what the South African fuel-price path and the euro area energy series both show, with euro area energy inflation running at 14.3%. A supply shock to an essential input meeting demand that will not cool can do most of the damage on its own, with no change in monetary policy required.',
        'Money has not stopped growing, either. US M2 rose roughly 5% over the year to July 2026, faster than the 3.4% rise in consumer prices, so the quantity story is not simply absent. The honest conclusion is that you cannot attribute 2026 inflation to one cause from the outside, and that the schools in the previous lesson disagree precisely about this. That disagreement is the subject, not a flaw in it.',
      ],
    },
    {
      heading: 'What it actually costs a household',
      paragraphs: [
        'Averages hide the people who have no room to move, so here is the distributional version, focused on South Africa.',
        'The Competition Commission\'s third Cost of Living Report, published in September 2026, found that between July 2025 and July 2026 electricity prices rose 8.1% and water prices 10.1%, both far above the 4.3% headline rate for the period. Between January and July 2026 petrol rose 26% and minibus taxi fares 13%. Over six years, cumulative petrol inflation reached 62.9% and taxi fares 52.9%, against 36% for headline inflation. In other words, the fuel you need to get to work has roughly outrun the average price level by a wide margin.',
        'Statistics South Africa reports that 75.6% of household spending goes to just four categories: housing and utilities, food and non-alcoholic beverages, transport, and insurance and financial services. In the lowest income decile, food plus housing and utilities alone is 66.8% of the budget. There is no discretionary spending left to absorb a price rise in that position. You either earn more or buy less.',
        'PayInc found average take-home pay fell to R21,228 in April 2026, down 0.5% in nominal terms year on year, with purchasing power down 2.7% after inflation. The PMBEJD household food basket cost about R5,480 in August 2026. The national minimum wage is R30.23 an hour. VAT on the average food basket alone comes to about R352 a month, which is more than the cost of 30kg of maize meal.',
      ],
    },
    {
      heading: 'So what is the honest claim about fiat?',
      paragraphs: [
        'Three statements, at descending levels of confidence, because that is the honest ordering.',
      ],
      points: [
        'Uncontroversial: holding rand or dollars costs you roughly 3% to 4% of purchasing power a year against consumer prices, before any interest rate is considered. That is arithmetic, not a theory.',
        'True and less discussed: inflation is a transfer, and the incidence falls hardest on whoever is holding the cash when it happens. Someone holding savings in a market-indexed asset is not exposed in the same way as someone holding notes under a mattress.',
        'Genuinely contested: whether that transfer is the dominant force in an ordinary person\'s life, or whether energy, wages and services matter more. In 2026 the honest answer in South Africa is that fuel, electricity and water rose far faster than the average, and for many households those are the prices that matter.',
        'Also contested: whether the long-run hard-money case is strong. It is a serious argument with serious economists on both sides, and the strongest version is not "they will print until it collapses" but "no inflation target is a guarantee, and the first people to pay for a policy error are the ones holding cash".',
      ],
    },
  ],
  tryIt: [
    'Build your own inflation number for one month. Write down what you actually buy: fuel, transport, food, electricity, data. Compare the change against the official headline. The gap between the two is the most useful economics lesson most people never do.',
    'Then open your bank\'s rate page and subtract the inflation rate from the interest rate. That is your real return, and it is the number that should appear in the advert.',
  ],
  sources: [
    {
      label: 'Statistics South Africa — Consumer Price Index, August 2026 (released 23 September 2026)',
      detail: 'The August 2026 headline of 4.4%, up from 4.3% in July and 5.0% in June, with the fuel and food detail and the weights behind the four biggest spending categories.',
      url: 'https://www.statssa.gov.za/?page_id=1854&PPN=P0141&SCH=74479',
    },
    {
      label: 'South African Reserve Bank — Monetary Policy Committee statement, September 2026',
      detail: 'The 25 basis point increase to a 7.25% policy rate, and the expectation of inflation above 5% this year before easing back towards 3% by late 2027.',
      url: 'https://www.resbank.co.za/content/dam/sarb/publications/statements/monetary-policy-statements/2026/september/september-statement.pdf',
    },
    {
      label: 'Competition Commission — third Cost of Living Report, August 2026',
      detail: 'Electricity up 8.1% and water up 10.1% year on year; petrol up 26% and taxi fares 13% between January and July 2026; six-year cumulative figures.',
      url: 'https://www.compcom.co.za/wp-content/uploads/2026/09/CC_Cost-of-Living-Report_Aug-2026.pdf',
    },
    {
      label: 'US Bureau of Labor Statistics — Consumer Price Index, August 2026',
      detail: 'Headline 3.4%, core 2.4%, energy up 16.3% and gasoline up 27.4% over the year. The archived release, so these numbers stay where they were.',
      url: 'https://www.bls.gov/news.release/archives/cpi_09112026.htm',
    },
    {
      label: 'European Central Bank — monetary policy decisions, 10 September 2026',
      detail: 'The 25 basis point increase in all three key rates, taking the deposit facility to 2.50%, attributed to Middle East energy inflation.',
      url: 'https://www.ecb.europa.eu/press/pr/date/2026/html/ecb.mp260910~314e508016.en.html',
    },
    {
      label: 'Eurostat — euro area annual inflation, August 2026',
      detail: '3.2% headline, up from 2.9% in July and 2.0% a year earlier, with energy at 14.3%.',
      url: 'https://ec.europa.eu/eurostat/web/products-euro-indicators/w/2-17092026-ap',
    },
    {
      label: 'Federal Reserve — FOMC statement and projections, 16 September 2026',
      detail: 'The increase to a 3.75% to 4.00% target range, and the median projection of 3.7% PCE inflation for 2026 falling to 2.3% in 2027.',
      url: 'https://www.federalreserve.gov/newsevents/pressreleases/monetary20260916a.htm',
    },
    {
      label: 'Federal Reserve — H.6 money stock measures',
      detail: 'Seasonally adjusted M2 of about $23.2 trillion in July 2026, against roughly $22.0 trillion a year earlier.',
      url: 'https://www.federalreserve.gov/releases/h6/current/default.htm',
    },
    {
      label: 'PMBEJD — Household Affordability Index, August 2026',
      detail: 'The average household food basket at about R5,480, the national minimum wage, and VAT as a share of the basket.',
      url: 'https://pmbejd.org.za/wp-content/uploads/2026/08/August-2026-Household-Affordability-Index-PMBEJD_26082026.pdf',
    },
  ],
  questions: [
    {
      id: 'm2-3-q1',
      prompt: 'A headline says South African inflation rose to 4.4% in August 2026. What is the most useful thing to do with that number?',
      options: [
{
          id: 'a',
          label: 'Assume your own costs rose 4.4% as well',
          correct: false,
          explanation: 'The CPI is a national average across a fixed basket. Using it as your personal inflation rate is the most common error in personal finance.',
        },
{
          id: 'b',
          label: 'Ignore it, since inflation is measured by the government',
          correct: false,
          explanation: 'The measurement is imperfect, but it is the best shared yardstick available and it is produced independently enough to be audited. Discarding it costs you the comparison.',
        },
{
          id: 'c',
          label: 'Compare its basket against your own, because fuel, electricity, water and taxi fares all rose faster than the average that year',
          correct: true,
          explanation:
            'The Competition Commission found electricity up 8.1% and water up 10.1% year on year, and petrol up 26% in seven months. The average is the starting point for your own calculation, never the answer to it.',
        },
{
          id: 'd',
          label: 'Conclude that the rand has no value',
          correct: false,
          explanation: '4.4% a year is a serious erosion and nothing like a collapse. Treating gradual depreciation as collapse is how people talk themselves out of a real problem.',
        }
      ],
    },
    {
      id: 'm2-3-q2',
      prompt: 'In 2026 the Fed, the ECB and the SARB all raised interest rates, and none was running a stimulus programme, yet inflation stayed above target everywhere. What does the simplest "money printing causes inflation" story conclude?',
      options: [
{
          id: 'a',
          label: 'It shows the rate rises will fix it',
          correct: false,
          explanation: 'That is a forecast about policy effectiveness, not a conclusion from the theory. It happens to be what the Fed and SARB are betting on.',
        },
{
          id: 'b',
          label: 'It is confirmed, because prices went up',
          correct: false,
          explanation: 'It predicted a cause, and the cause it named was not operating. A theory that survives anything is not a theory you can rely on.',
        },
{
          id: 'c',
          label: 'It cannot be evaluated, because inflation is too complex',
          correct: false,
          explanation: 'It can be evaluated, and it failed this test. Complexity is a reason to be careful, not a reason to stop checking.',
        },
{
          id: 'd',
          label: 'It is not confirmed by this period, which is why the leading explanation is the energy shock rather than money printing',
          correct: true,
          explanation:
            'This is the discipline the data imposes. The named cause is the one the central banks themselves cite, an energy and fuel shock, and it is visible in both the South African fuel-price path and the euro area energy series. It does not mean money never matters, only that it is not the whole story here.',
        }
      ],
    },
    {
      id: 'm2-3-q3',
      prompt: 'Food and housing together take two-thirds of a household\'s budget. Prices rise 4% and their income rises 2%. What happens to them?',
      options: [
{
          id: 'a',
          label: 'They are roughly 2% worse off, and there is no discretionary spending left to cut',
          correct: true,
          explanation:
            'A household whose budget is nearly all essentials has no internal buffer. Unlike a household with a large flexible share, which can absorb a price rise by buying less of something optional, this one has to earn more or consume less.',
        },
{
          id: 'b',
          label: 'They should put savings into Bitcoin',
          correct: false,
          explanation: 'That may be a reasonable hedge decision, but it does not follow from the arithmetic. Bitcoin is not what pays for fuel, electricity or food, so it is not a substitute for necessities.',
        },
{
          id: 'c',
          label: 'They are 2% better off, because income rose',
          correct: false,
          explanation: 'Income rose in nominal terms. Relative to prices, they are worse off, which is the distinction that matters.',
        },
{
          id: 'd',
          label: 'Nothing, because inflation figures are averages',
          correct: false,
          explanation: 'Averages are exactly how people in this position get mismeasured. Being worse off is what the aggregate number conceals.',
        }
      ],
    },
    {
      id: 'm2-3-q4',
      prompt: 'Someone says "inflation is a tax on cash holders." Which version of that is actually accurate?',
      options: [
{
          id: 'a',
          label: 'It is a literal government tax, with a rate and a bill',
          correct: false,
          explanation: 'There is no bill and nobody sets the rate. The metaphor is useful precisely because the loss is diffuse and nobody contests it, which is also why it is easy to underestimate.',
        },
{
          id: 'b',
          label: 'Holding cash loses roughly 3% to 4% of purchasing power a year against consumer prices, and no individual decided it',
          correct: true,
          explanation:
            'That is the arithmetic behind the metaphor, and it is not contested. The incidence falls hardest on whoever holds the currency when the loss happens, which is why the same person can be helped by inflation and hurt by it depending on what they hold.',
        },
{
          id: 'c',
          label: 'It only affects people without a bank account',
          correct: false,
          explanation: 'Currency depreciation affects every holder of rand or dollars. Bank access changes how easily you can avoid it, not whether you are exposed.',
        },
{
          id: 'd',
          label: 'It applies equally to shares and property',
          correct: false,
          explanation: 'A share or a property is priced in the same currency and can rise in nominal terms, so it is a different exposure. That is the actual argument for holding assets, and it is not guaranteed either.',
        }
      ],
    },
    {
      id: 'm2-3-q5',
      prompt: 'A bank account pays 7% while consumer prices rose 4.4% over the year. What can you actually conclude?',
      options: [
{
          id: 'a',
          label: 'Real returns cannot be calculated at all',
          correct: false,
          explanation: 'They can be approximated, and the approximation is the most useful number on any savings statement. Perfection is not the standard here.',
        },
{
          id: 'b',
          label: 'You are 7% richer',
          correct: false,
          explanation: 'That is the nominal figure, which says what was credited. It says nothing about what that money can now buy.',
        },
{
          id: 'c',
          label: 'The approximate real gain is about 2.6% a year, before tax, and only if you genuinely earn that rate net',
          correct: true,
          explanation:
            'Real return is roughly nominal minus inflation. It is a rough instrument rather than a promise, which is why this lesson hands you the arithmetic and the caveat instead of a conclusion about how well you are doing.',
        },
{
          id: 'd',
          label: 'The bank is overpaying and will fail',
          correct: false,
          explanation: 'A 2.6% real return is a normal commercial margin, not evidence of insolvency.',
        }
      ],
    },
  ],
};

const M2_4: Lesson = {
  id: 'm2-4-bitcoin-in-this-picture',
  title: 'Bitcoin in this picture',
  blurb:
    'The monetary case for a fixed supply, stated as a proposition about money rather than as a forecast about any single holding, with the limits of that proposition stated honestly.',
  minutes: 14,
  sections: [
    {
      heading: 'Start with what is checkable',
      paragraphs: [
        'About 20 million of the 21 million bitcoins have been mined. The rest arrive on a published schedule, and any node can verify the total independently without asking anyone\'s permission.',
        'That property is real, it is unusual, and it is worth something. Everything else in this lesson is a harder question, and it is worth keeping the two apart.',
      ],
    },
    {
      heading: 'The distinction the whole argument turns on',
      paragraphs: [
        'Money and price are different things, and almost every bad claim about Bitcoin comes from running them together. Price is the general level at which goods and services exchange for money, and it is an outcome rather than a decision. The money supply is how much of the medium exists, decided by whoever controls issuance.',
        'Inflation is monetary in that sense: when the quantity of money grows faster than the goods and services on sale, each unit buys less. It does not require anybody to be dishonest, only a decision to issue more.',
        'A hard cap is a rule about the second of those. It says the quantity of bitcoin can never be increased by any institution, in any crisis, for any reason. That is a claim about issuance, and it is one of the few claims in this entire lesson you can verify rather than take on trust.',
      ],
    },
    {
      heading: 'What the deflationary proposition actually claims',
      paragraphs: [
        'The honest version needs one word of care. Bitcoin is not deflationary in the sense of forcing prices down. What it offers is that its supply cannot expand when demand for money rises, so it cannot participate in the dilution that expanding a fiat money supply causes. That is a much narrower claim than the slogans, and it is the one worth defending.',
        'The proposition follows straight from the distinction. If you are paid in a currency that expands, part of what you hold is a claim on an increasing quantity of that currency. A holding whose supply is fixed does not carry that particular risk. What you have removed is your exposure to one specific form of dilution, decided by other people.',
        'What the proposition does not claim matters just as much. It makes no claim about what any individual holding is worth, it does not say it offsets inflation in any particular year, and it does not say a fixed supply settles the question for you. A fixed supply removes an issuer from the process. It does not create a holder. The step from "the supply cannot expand" to "so it will be worth more" is where this argument leaves the part of economics people agree on. Scarcity is a real input into price, and the standard supply-and-demand model says a fixed quantity facing an expanding one should appreciate in real terms over a long enough horizon. That is the hard-money prediction, and it is the reason this lesson exists. What the schools dispute is how much work the supply side does by itself. A monetarist would put the emphasis on the money supply rather than on the scarcity of a single asset. A Keynesian would say demand moves first and that a fixed quantity is not a support. A behavioural reading would point at adoption, liquidity and the rate people discount at. Nobody here is being dishonest and the disagreement has not been settled, so this course states the rule, states the theory, and hands you the judgement rather than dressing it up as arithmetic.',
      ],
    },
    {
      heading: 'Why that is not a contradiction',
      paragraphs: [
        'The hard-money case is a claim about a monetary regime over decades, not a quarter. Nobody can settle a thirty-year monetary argument in advance, and the people who claim they can are selling something.',
        'Bitcoin is held for two different reasons at once, and they are not the same reason. Some hold it because they want no issuer in the money supply. Some hold it because they expect others to want it. The first reason is a monetary argument and the second is a behavioural one, and only the first is settled by the rules. Keeping them apart is the discipline here, because only one of them can be checked on a block explorer.',
        'The useful discipline is to keep the two apart. The rule is permanent, public and verifiable. How many people come to hold it is a fact about the world, decided over time and not by a committee. Confusing the two is how both the bull case and the bear case end up wrong.',
      ],
    },
    {
      heading: 'Why the rule was written in 2008',
      paragraphs: [
        'Bitcoin did not exist in 2008. It was designed in the middle of that crisis, and the brief is unusually specific.',
        'Lehman Brothers filed for bankruptcy on 15 September 2008. The next day the Federal Reserve authorised an $85 billion loan to AIG, taking a 79.9% equity stake. On 3 October, Congress authorised $700 billion in TARP. The Fed\'s balance sheet went from roughly $900 billion before the crisis to about $2.2 trillion by the end of 2008, and on to roughly $4.5 trillion by 2014.',
        'On 31 October 2008, forty-six days after Lehman and twenty-eight days after TARP, an unknown person posted to a cryptography mailing list: "I\'ve been working on a new electronic cash system that\'s fully peer-to-peer, with no trusted third party." The network went live on 3 January 2009, and the coinbase field of the very first block carries a newspaper headline: "The Times 03/Jan/2009 Chancellor on brink of second bailout for banks." Every node that has validated the chain since has read that sentence.',
        'Satoshi\'s own summary, in February 2009: "The root problem with conventional currency is all the trust that\'s required to make it work. The central bank must be trusted not to debase the currency, but the history of fiat currencies is full of breaches of that trust."',
        'Note what that balance sheet expansion actually is: a bank crediting new deposits it did not have to borrow. That is money creation, and it is the mechanism the supply rule is aimed at. The cap is not an arbitrary number, it is a direct answer to what 2008 demonstrated.',
      ],
    },
    {
      heading: 'How it has measured since 2009',
      paragraphs: [
        'Since January 2009, four halvings have completed, in 2012, 2016, 2020 and 2024. About 20 of the 21 million bitcoins now exist, and the last of them arrive slowly enough that the remaining supply is the scarcest part of the schedule.',
        'The record, stated plainly: it has survived the Eurozone debt crisis, the Cyprus bail-in, the 2020 pandemic crash, the collapse of Mt. Gox and the exchanges that followed it, the 2021 Chinese mining ban, the FTX collapse, and a simultaneous tightening cycle from three major central banks. It has never needed a bailout, because nothing inside it can be made insolvent by somebody else\'s promise.',
        'The monetary thesis has its real test cases long after 2008. In March 2013 Cyprus closed its banks and told depositors above €100,000 that they would lose 47.5% of their savings in its largest bank. In 2020 the Fed pledged to print unlimited money. Those are exactly the conditions the proposition is about: a currency under stress while a central bank expands its balance sheet.',
        'The honest limit is that the test is harder than it looks. A monetary crisis is not a prediction, and a monetary argument can look right for years while nothing about it is exercised. That is why the case is stated as a property of the money rather than as a record of outcomes.',
      ],
    },
    {
      heading: 'The honest bull case',
      paragraphs: [
        'No committee can add supply, and the rule is public, auditable and enforced by the network itself. People are choosing to hold it for that reason, and it is a genuinely new one.',
        'Settlement without a counterparty, capped issuance, and use that is entirely voluntary. The strongest form of the argument is that these are structural, so they do not depend on the character of any government or banker.',
      ],
    },
    {
      heading: 'The honest bear case',
      paragraphs: [
        'A fixed supply does not create holders, and most of the "inflation hedge" talk is written after the fact rather than tested in advance.',
        'Its unit of account is still fiat. Bitcoin is accounted in dollars, and taxes and rent are denominated in a currency somebody else issues, so the monetary function it is asked to perform is still measured by the money it is meant to displace.',
        'It remains expensive to move on-chain relative to its own value, so it functions far more as a savings asset than as a medium of exchange. Lightning helps, and it adds counterparty risk or channel complexity in exchange.',
        'Adoption is not guaranteed, and the risk of being early is real: a monetary argument can be correct and still fail to be adopted within any horizon you care about. That is not a detail, because it decides whether this is appropriate for you at all.',
      ],
    },
    {
      heading: 'How to hold all of this',
      paragraphs: [
        'This is not an inflation policy sold at the counter. It is a money whose supply rule cannot be changed, and the reason to hold it is that you accept those terms, not that it insures you against a particular month.',
        'Nobody, including this course, can tell you how many people will come to hold it. Anyone who tells you they can has an interest in your answer. What you can do is check the supply schedule yourself, understand the risks, and size the position so that being wrong about adoption does not change your life.',
      ],
    },
  ],
  tryIt: [
    'Open a bitcoin block explorer, read the current supply and the next halving date, and confirm the number is the one every other node agrees on. Note that nobody published an announcement authorising it.',
    'Find the money stock for your own currency at its central bank and note who decides when it changes. Holding those two numbers next to each other is the whole lesson in one line.',
  ],
  sources: [
    {
      label: 'US Bureau of Labor Statistics — Consumer Price Index, August 2026',
      detail:
        'The US price series the monetary argument is measured against: the all items index rose 3.4 percent over the twelve months ending August 2026, with the core index at 2.4 percent. This is the price level the monetary argument is about.',
      url: 'https://www.bls.gov/news.release/archives/cpi_09112026.htm',
    },
    {
      label: 'SEC Form 424B3 filing — disclosed risk factors for a bitcoin-linked product',
      detail:
        'A registration statement that has to set out, for a regulator, what can go wrong when someone holds the asset: custody, loss, regulatory and legal risk. Useful precisely because these risks are on the public record in a filing rather than only in the marketing of the companies selling the product.',
      url: 'https://www.sec.gov/Archives/edgar/data/1980994/000143774924020207/bit20240606_424b3.htm',
    },
    {
      label: 'Satoshi Nakamoto Institute — "Gradually, Then Suddenly: Introduction"',
      detail:
        'Source for the 2008 chronology used above: Lehman on 15 September, the $85 billion AIG loan, TARP on 3 October, the Fed balance sheet moving from roughly $900 billion to $2.2 trillion and then $4.5 trillion, the whitepaper post on 31 October 2008, the genesis headline, and Satoshi\'s February 2009 summary of the trust problem. Read it as an argument, because that is what it is.',
      url: 'https://nakamotoinstitute.org/library/gradually-then-suddenly/introduction/',
    },
    {
      label: 'Bitcoin: A Peer-to-Peer Electronic Cash System (whitepaper)',
      detail:
        'The primary document, and the source for the 21 million schedule and the halving structure that the supply claim rests on. The supply rule is the one part of the whole argument that you can check directly against the protocol rather than take on anyone\'s word.',
      url: 'https://bitcoin.org/bitcoin.pdf',
    },
    {
      label: '2012–2013 Cypriot financial crisis — background',
      detail:
        'The March 2013 bank closure, the bailout, and the seizure of 47.5% of Bank of Cyprus deposits above €100,000. This is a monetary event rather than a price chart: a currency under stress and a banking system recapitalised by the state.',
      url: 'https://en.wikipedia.org/wiki/2012%E2%80%932013_Cypriot_financial_crisis',
    },
  ],
  questions: [
    {
      id: 'm2-4-q1',
      prompt: 'About 20 million bitcoins exist out of a maximum of 21 million. What does that establish?',
      options: [
{
          id: 'a',
          label: 'Mining is nearly over, so the network\'s security must be about to collapse',
          correct: false,
          explanation: 'Security comes from hash power, which is paid in new coins. As issuance falls, the fee market has to take over, and that transition is a real design question rather than a countdown to collapse.',
        },
{
          id: 'b',
          label: 'The remaining million can be produced quickly by anyone who wants them',
          correct: false,
          explanation: 'The schedule halves every 210,000 blocks, so the late coins arrive more slowly than the early ones, not faster. The cap is enforced by the rules, not by scarcity of opportunity.',
        },
{
          id: 'c',
          label: '20 million is close enough to 21 million that the difference is irrelevant',
          correct: false,
          explanation: 'About 95% is mined, which is why the remaining coins are worth waiting for. The tail of the schedule is where scarcity is concentrated.',
        },
{
          id: 'd',
          label: 'The total supply is knowable in advance and enforced by rules that every node checks, not by a decision anyone makes',
          correct: true,
          explanation:
            'That is the structural property, and it is verifiable rather than promised. Note that security comes from ongoing hash power paid in new coins and fees, so the last coins matter more than the first.',
        }
      ],
    },
    {
      id: 'm2-4-q2',
      prompt:
        'Your salary is paid in a currency that expands every year, and you hold a fixed-supply asset instead. What does the monetary argument actually claim for you?',
      options: [
{
          id: 'a',
          label:
            'That your earnings are denominated in money someone else can dilute, and a supply rule nobody can change removes that one source of dilution',
          correct: true,
          explanation:
            'This is the precise version, and it is narrower than the slogan. You have not removed adoption risk or the risk of being early. You have removed your exposure to monetary expansion, which is the one component of holding cash that is decided by other people.',
        },
{
          id: 'b',
          label: 'That inflation and a fixed-supply asset are unrelated, so the comparison is meaningless',
          correct: false,
          explanation:
            'The comparison is the argument. Declining to run it is the failure mode here, not running it.',
        },
{
          id: 'c',
          label: 'That a supply cap guarantees your savings grow',
          correct: false,
          explanation:
            'No. A supply rule constrains issuance, not demand, and demand is what sets the price. The proposition is about which risk you stop carrying, not about the return you get.',
        },
{
          id: 'd',
          label: 'That a fixed supply guarantees the asset appreciates',
          correct: false,
          explanation:
            'This is the commonest version and it is simply wrong. Fixed supply removes an issuer; it does not create a holder. The two get confused constantly, usually by people selling something.',
        }
      ],
    },
    {
      id: 'm2-4-q3',
      prompt:
        'A central bank expands its money supply during a crisis while the Bitcoin supply rule stays exactly as written. What does the fixed rule tell you, and what does it not tell you?',
      options: [
{
          id: 'a',
          label: 'That Bitcoin will hold its position against that expansion',
          correct: false,
          explanation:
            'A fixed supply settles the issuer question and nothing else. It does not decide how many people come to hold the asset, so "hold its position" is the part that has to be argued rather than derived.',
        },
{
          id: 'b',
          label:
            'That Bitcoin\'s own supply cannot be expanded in response to anything, and that whether anyone comes to hold it is a separate question the rules do not answer',
          correct: true,
          explanation:
            'Those are two different claims and only one of them is settled by the protocol. The first is verifiable today by any node. The second is behavioural and unfolds over time, which is why the honest argument leans on the first and treats the second as a judgement.',
        },
{
          id: 'c',
          label: 'That the problem is solved, because money growth is what caused the crisis',
          correct: false,
          explanation:
            'Money growth is a reasonable suspect in a monetary crisis, not a complete account of one. A rule constraining one asset\'s supply is not a remedy for a currency problem, and the lesson never claims it is.',
        },
{
          id: 'd',
          label: 'That Bitcoin and a fiat currency are now equivalent, because neither can be inflated',
          correct: false,
          explanation:
            'A cap prevents dilution of that supply. It does not confer the other properties money needs, and it does not make one unit equal to a unit of a currency somebody else issues.',
        }
      ],
    },
    {
id: 'm2-4-q4',
      prompt: 'A beginner is told "bitcoin is an inflation hedge, so it is a safe place for your savings." What is the most important omission?',
      options: [
{
          id: 'a',
          label: 'Nothing, the statement is accurate as written',
          correct: false,
          explanation: 'It is an overstatement. A structural property is being presented as a safety guarantee, and no supply rule can answer the second half of that claim.',
        },
{
          id: 'b',
          label: 'That the 21 million cap is only a promise made by developers, and could be changed whenever they wanted',
          correct: false,
          explanation:
            'It is enforced by consensus rules that every node checks independently, so changing it would require overwhelming the network rather than editing a file. The cap is verifiable, which is the strongest thing about it.',
        },
{
          id: 'c',
          label: 'That a fixed supply says nothing about whether anyone will be holding it in ten years, and that is the part that decides the outcome',
          correct: true,
          explanation:
            'This is the omission that matters, because "safe place for your savings" is a claim about the path, not about the supply schedule. If the money has to exist on a particular date, being early is a real risk regardless of the issuance rules.',
        },
{
          id: 'd',
          label: 'That inflation no longer exists as a phenomenon',
          correct: false,
          explanation: 'Inflation ran above target in the United States, the euro area and South Africa through 2026. It is not a thing that went away.',
        }
      ],
    },
    {
      id: 'm2-4-q5',
      prompt: 'What is the strongest honest reason to hold bitcoin?',
      options: [
{
          id: 'a',
          label: 'It has gone up for more than a decade',
          correct: false,
          explanation: 'Past performance is the weakest of the available reasons, because it asks you to extrapolate a record instead of examining a rule.',
        },
{
          id: 'b',
          label: 'Banks want it to fail, which proves it matters',
          correct: false,
          explanation: 'Opposition is evidence that something is contested, not evidence that it is correct. A claim that needs an enemy to be true is not a claim.',
        },
{
          id: 'c',
          label: 'The supply can never change, so the price can only move in one direction',
          correct: false,
          explanation: 'This is the scarcity argument stated at its strongest, and refusing it would be dishonest rather than rigorous. A fixed quantity facing an unlimited one is the core of the hard-money case, and the expectation that it appreciates in real terms over a long horizon is a mainstream position within that tradition rather than a fringe one. What it does not settle is how much weight the supply side carries alone, and there the schools are genuinely divided: a monetarist looks at the money supply, a Keynesian at demand, and a behavioural account at adoption and liquidity. The cap is real. The conclusion drawn from it is a judgement, and this course asks you to make it rather than to accept it.',
        },
{
          id: 'd',
          label: 'Its supply cannot be increased by any institution, and that rule is public, auditable and enforced by the network, so whether it matters is a judgement you make',
          correct: true,
          explanation:
            'This is a verifiable property plus a decision about value, which is exactly why it is defensible. It does not require a forecast, and it is honest about the part you have to decide for yourself. Notice that it does not require the economics to be unanimous either: it holds whether you think the scarcity argument in A is right, wrong, or right on a horizon longer than your own.',
        }
      ],
    },
    {
      id: 'm2-4-q6',
      prompt:
        'A friend says a fixed supply means bitcoin cannot be diluted, so it is a safe place for savings. What is the strongest response?',
      options: [
{
          id: 'a',
          label:
            'The supply rule is real and removes issuer discretion, but it says nothing about what the asset is demanded for, and it does not hedge you in any particular period',
          correct: true,
          explanation:
            'This separates the structural part from the market part. The supply claim is verifiable and permanent. The value claim is not, and conflating them is how the argument gets oversold in both directions.',
        },
{
          id: 'b',
          label: 'That is right, because a fixed supply rules out the main way money loses value',
          correct: false,
          explanation:
            'It rules out one way, and quietly swaps it for another. Demand for the asset can fall for reasons that have nothing to do with issuance, and a holder is exposed to all of them.',
        },
{
          id: 'c',
          label: 'That a fixed supply is only a promise made by developers',
          correct: false,
          explanation:
            'It is enforced by consensus rules that every node checks independently, so changing it would require overwhelming the network rather than editing a file. That is the strongest thing about it.',
        },
{
          id: 'd',
          label: 'That savings held in a fixed-supply asset are risk-free',
          correct: false,
          explanation:
            'They are not. Adoption is a real risk, and a monetary argument can be correct while nobody comes to hold the asset. A supply rule addresses dilution, not uptake.',
        }
      ],
    },
    {
      id: 'm2-4-q7',
      prompt:
        'Bitcoin\'s network went live on 3 January 2009, weeks after Lehman Brothers failed and a $700 billion bank bailout was signed. What does that timing tell you?',
      options: [
{
          id: 'a',
          label: 'It proves bitcoin and the dollar move together, because both came out of the same response',
          correct: false,
          explanation: 'The response was monetary; the design constraint is about supply rules. They came out of the same crisis and they are not the same asset, which is the entire reason to hold the comparison open.',
        },
{
          id: 'b',
          label:
            'The cap and the no-intermediary rule were answers to what 2008 showed, which is that losses were socialised while savers carried the risk, so the design brief is documented even though the price evidence only arrived years later',
          correct: true,
          explanation:
            'This is the useful reading. A specific failure produced a specific design, which is a reason to take the rules seriously. It is not proof the price follows, and it is worth being clear that adoption was negligible for years before Cyprus and 2020 gave the thesis any price evidence at all.',
        },
{
          id: 'c',
          label: 'Nothing, the date is a coincidence and the supply rule could have been any number',
          correct: false,
          explanation:
            'It is a documented design brief, not a coincidence. The whitepaper, Satoshi\'s February 2009 explanation and the bailout headline in the genesis block all point the same way.',
        },
{
          id: 'd',
          label: 'It proves the early buyers were exploiting the crisis, so the asset is tainted',
          correct: false,
          explanation:
            'It proves the opposite of what is claimed. A rescue funded by newly created money is the behaviour the design is aimed at, and the counterparty in that rescue was the taxpayer, not the early holder.',
        }
      ],
    },
  ],
};

const M2_5: Lesson = {
  id: 'm2-5-hardest-money-yet',
  title: 'The hardest money yet',
  blurb:
    'How money actually got here, the jobs and properties that decide which money wins, where the sound-money economics genuinely holds and where it breaks, what Bitcoin really changes about payment rails, and the adoption data that is already measurable.',
  minutes: 18,
  sections: [
    {
      heading: 'Money is the job, not the object',
      paragraphs: [
        'Start by getting rid of the most persistent misconception in this whole subject. Money is not valuable because of what it is made of. It is valuable because of the job it does, and the job has three parts.',
        'First, a medium of exchange, so you do not have to hunt for a counterparty who happens to want what you have. Second, a unit of account, so you can price things in one number instead of a thousand barter ratios. Third, a store of value, so what you earn today is still there when you need it next month. Most textbook lists add a fourth: a standard of deferred payment, so a promise written today settles in money later.',
        'Notice that nothing in that list mentions intrinsic worth. Every money that has ever worked has been a token or a claim. Gold coins worked because people agreed to trade for them, not because a cow would accept one. Fiat works because a tax authority will accept it and a wage payer will pay it. The question is never "is this thing valuable in itself", it is "does this thing do the job, and can I trust the rule that governs its supply".',
        'This is worth sitting with, because the intrinsic-value argument is the most common objection to Bitcoin and it is also the argument that quietly undermines gold. Nothing that has ever functioned as money has a use value that justifies its exchange value. The metals that became money were valued for scarcity and for how easily they could be traded, which is precisely the pair of properties Bitcoin is being asked to supply.',
      ],
      points: [
        'Medium of exchange — avoids the double coincidence of wants.',
        'Unit of account — turns a thousand barter ratios into one number.',
        'Store of value — links today\'s effort to next month\'s need.',
        'Standard of deferred payment — makes written promises settleable in something everyone accepts.',
      ],
    },
    {
      heading: 'Eight steps, six thousand years',
      paragraphs: [
        'Money has not been the same thing twice. Each version solved a real problem of the version before it, and each version eventually broke in the same general way: the entity issuing it acquired an incentive to change the rules.',
        'That pattern is the actual lesson of monetary history. It is not a story about metals being nicer than paper. It is a story about who controls the supply and what happens to the people who cannot check them.',
      ],
      table: {
        head: ['Era', 'What money was', 'The problem it solved', 'What eventually broke it'],
        rows: [
          [
            'Before coinage',
            'Shells, beads, salt, cattle, grain',
            'Portable, countable, hard to fake, locally verifiable',
            'No supply discipline, and awkward units (value of a cow in salt changes with the season)',
          ],
          [
            'c. 600 BC, Lydia',
            'Struck electrum coins',
            'A stamped uniform unit that was far harder to clip or counterfeit',
            'Kings debased their own coinage for revenue; the same incentive as every later issuer',
          ],
          [
            'Rome, c. 200 BC onward',
            'Silver denarius',
            'Paying and taxing an empire across continents at scale',
            'Successive debasement reduced the silver content to a small fraction of the stated name',
          ],
          [
            '1284, Venice',
            'Gold ducat',
            'A coin whose stated weight was guaranteed, so a trading civilisation could keep its accounts straight',
            'When the issuer\'s finances went bad, the incentive to debase reappeared regardless of the metal',
          ],
          [
            '1792-1914, gold standard',
            'Coins redeemable at a fixed weight of gold; the US briefly bimetallic at a 15:1 silver-to-gold ratio',
            'Prices stopped moving with the metal supply, and long-distance trade got a fixed yardstick',
            'Deflation and a rigid answer to bank runs; US abandoned silver coinage in 1873 and gold convertibility in 1933',
          ],
          [
            '1944 Bretton Woods, to 1971',
            'The dollar pegged to gold at $35 an ounce, and every other currency pegged to the dollar',
            'Fixed exchange rates and a stable world price for trade',
            'The United States ran out of gold to honour the promise, and convertibility was suspended on 15 August 1971',
          ],
          [
            '1971 to today',
            'Fiat: floating, national, not redeemable for anything',
            'Elastic supply in a crisis, and sovereign control of the currency',
            'The supply is a policy decision, so the money is only as sound as the institutions behind it',
          ],
          [
            '2009 to today',
            'Bitcoin',
            'A hard-capped supply and settlement with no issuer, no bank and no trusted third party',
            'Nothing has broken it, but it is seventeen years old, has a weak unit of account, and has a smaller daily market than any G7 currency',
          ],
        ],
        note:
          'Dates are the conventional ones in economic history. The point of the table is not that any row is identical to Bitcoin. It is that the row before fiat also ended in a supply decision made by people who could not be checked by the person holding the money.',
      },
    },
    {
      heading: 'The properties that decide which money wins',
      paragraphs: [
        'What makes money durable across centuries is not the material. It is whether the supply rule is knowable in advance, whether a stranger can verify it without trusting anybody, and whether nobody can quietly change it.',
        'Gold and bitcoin are closer than they look, and closer to each other than either is to fiat. Gold\'s supply rule was slow and unknowable to its holder; bitcoin\'s is published, scheduled and independently verifiable. That is the specific upgrade, and it is the only one that is genuinely new.',
      ],
      table: {
        head: ['Property', 'Gold', 'Fiat', 'Bitcoin'],
        rows: [
          [
            'Supply rule',
            'Mined slowly, unpredictable in advance, and historically discovered centuries late',
            'Set by policy, revised whenever conditions or politics require it',
            '21 million, halving schedule, published from genesis block and enforced by consensus',
          ],
          [
            'Who can create it',
            'Only mining, at a real resource cost',
            'A central bank, plus licensed banks creating deposits',
            'Anyone who can run a node and win the work; nobody by decree',
          ],
          [
            'Can a stranger verify it?',
            'Weight and purity, by assay',
            'Only by trusting the issuer and the banking system',
            'Yes, by running the consensus rules against the public chain',
          ],
          [
            'Divisibility',
            'Awkward in practice, from 100-ounce bars down to tiny fractional weights',
            'Excellent, to eight decimals and beyond',
            'Excellent: 1 BTC is 100,000,000 satoshis, so 21 million coins become 2.1 quadrillion units',
          ],
          [
            'Unit of account',
            'Settled by centuries of use',
            'Primary today, the reference for everything',
            'The weak point: almost all of it is still accounted in dollars, and taxes and rent are still denominated in fiat',
          ],
          [
            'Medium of exchange',
            'Accepted, but heavy, slow and awkward to verify',
            'The best-developed medium of exchange humans have built',
            'Weak on the base layer, which is expensive for small payments; genuinely usable over Lightning and with stablecoins',
          ],
          [
            'Store of value',
            'Credible for centuries, with no issuer risk, and costly to hold',
            'Loses purchasing power by design when the policy is inflationary',
            'Unpredictable in the short run, produces no income, no insurance, and no legal claim against anyone',
          ],
          [
            'Counterparty risk',
            'None, if you hold the metal',
            'Total, if you hold a bank deposit or a wallet balance',
            'None at the protocol; total at an exchange, and a custodial product reintroduces the same risk fiat has',
          ],
          [
            'Can it be blocked?',
            'No',
            'Yes, by the issuer, the network, or the acquiring bank',
            'No, once confirmed, which is the specific property that no fiat payment has',
          ],
        ],
        note:
          'A property only counts if it is observable. "Trustworthy" is not a property; a published cap that any node can check is. This table is the strongest form of the hard-money argument, and it is also where the argument is weakest, because three of the right-hand column are still marked weak.',
      },
    },
    {
      heading: 'The sound economics, and where it actually breaks',
      paragraphs: [
        'There is a real body of economic theory here, built long before Bitcoin, and the honest thing is to state it accurately rather than to use it as a slogan.',
        'Carl Menger set out the account of money as the natural result of marketability in his 1871 Principles of Economics, and published it as an essay, "On the Origin of Money", in 1892. Among things that were bartered, the ones that were easiest to trade kept being traded, and eventually stopped being valued for themselves at all. Shell, salt and cattle worked because they were durable, portable and easily assessed. That is a genuine account of how money emerges, and it explains why adoption matters more than design.',
        'Ludwig von Mises sharpened it into the regression theorem, and this is the part of the argument that Bitcoin enthusiasts most often quote and most often quote wrong. The theorem is usually summarised as: money cannot appear out of nothing, because before a good can serve as a medium of exchange it must already have had an exchange value for other reasons. That much is right, and the subtle part is what "for other reasons" means. Mises did not say the good had to have a use as something other than money. He said only that individuals had to have valued it and traded it directly before it was used as a medium of exchange, and that their expectation of future purchasing power is what gives present money its value.',
        'The interesting part is what happens when you apply that to Bitcoin. On 22 May 2010 a forum user paid 10,000 bitcoin for two pizzas. The standard telling is that Bitcoin became money that day. A closer reading is stronger than that: the person running the pizza place was spending fiat to acquire bitcoin, precisely because they expected to trade the bitcoin onward. So bitcoin had been subjectively valued and directly exchanged before it was ever used as a medium of exchange, which is exactly the condition the theorem imposes. Bitcoin therefore does not strain the regression theorem so much as satisfy it, and the strongest published defence of the theorem says the threat from Bitcoin has been "significantly overstated".',
        'One caveat about that defence, because it is the part enthusiasts skip. The reading above is contested within Austrian economics, and the honest position is narrower than either camp wants. Bitcoin works as money in practice, which is a fact about behaviour rather than a theorem. The regression theorem was never a test of whether a good can be engineered into a medium of exchange; on Mises\'s own account it was an explanation of where the purchasing power of money comes from. If you want to know whether Bitcoin succeeds, the adoption data answers that and the theorem does not.',
        'Then there is Gresham\'s law, and it needs the same precision. The effect was first described in the 1550s, when the rate war between the Habsburg Netherlands and England flooded the Low Countries with full-weight coins that then circulated only at face value, while the lighter local coinage was hoarded and melted down. Thomas Gresham, a London financier serving Elizabeth I, gave the pattern his name, and the mechanism is that when governments cut the silver content of coins while holding their face value fixed, the good coins disappear from circulation and the debased ones do the rest of the work. England had been debasing the silver in the shilling for base metal since Henry VIII. In the United States, the 1965 change that cut the half-dollar from 90% silver to 40% while leaving its legal value unchanged emptied the good coins out of circulation within a few years. The refined form, as Rothbard put it, is that money overvalued by government drives out money undervalued by government, which is why the law needs a government-set face value for the classic mechanism to operate.',
        'Bitcoin has no face value set by anyone, so what transfers is the holding behaviour rather than the legal mechanism, and that version has become known as "Nakamoto-Gresham": while a fiat currency still works as a medium of exchange, and you still earn your income in it, fiat gets spent and Bitcoin gets saved. That is the prediction, and it is a prediction about behaviour rather than about returns, so it is only ever as good as the conditions it depends on.',
        'Two more pieces of theory are worth knowing. F. A. Hayek\'s 1976 "Denationalisation of Money" argued for private competing currencies, and he won the Nobel Prize that year, so the idea that a non-state money can compete is respectable mainstream economics rather than a fringe position. And Saifedean Ammous\' 2018 "The Bitcoin Standard" built its argument on stock-to-flow, the ratio of existing supply to annual new issuance, arguing that a high ratio is what distinguishes a monetary asset from a speculative one. It is a clean way to see why Bitcoin is treated differently from other crypto, and it is also a ratio applied to a monetary claim, which is why economists who dislike it dislike it. It is Ammous\'s own framework rather than a consensus finding, and he is an advocate for the asset he is evaluating, not a neutral witness.',
      ],
    },
    {
      heading: 'What Bitcoin actually changes about the rails',
      paragraphs: [
        'The strongest non-monetary argument for Bitcoin is not about scarcity at all. It is about what happens when money moves.',
        'A card payment is not a transfer of money. It is an authorisation, which is a promise from your bank to the merchant\'s bank, and that promise is settled later in batched cycles a day or two afterwards. It is also reversible, for a long time, at the cardholder\'s discretion. This is not a flaw or a conspiracy. It is a design that makes consumer fraud protection possible, and it is genuinely useful for a refund you are owed.',
        'The cost of that design is a percentage fee, a multi-day settlement cycle, a permanent need for both parties to hold accounts at regulated institutions, and a record that only the parties and their processors can read. Bitcoin\'s base layer trades all of that for something different: roughly ten minutes a block, a settlement that becomes practically irreversible after a handful of confirmations, availability every second of the year, no account requirement, a cost that does not scale with the amount, and a ledger anyone can audit for themselves. Over Lightning, the same properties arrive in under a second for a fraction of a cent.',
      ],
      table: {
        head: ['', 'Card', 'Wire or SWIFT', 'FedNow, Pix, UPI', 'Bitcoin base layer', 'Lightning'],
        rows: [
          [
            'Speed',
            'Authorised in seconds, settled in 1-2 days',
            'Minutes to 1-5 business days; Fedwire is near-instant within US business hours',
            'Seconds, 24/7',
            'About 10 minutes a block, about an hour to be practical final',
            'Under a second',
          ],
          [
            'Reversal',
            'Chargebacks, up to 120 days on a consumer card',
            'Effectively none once sent',
            'Mostly none; an ACH consumer return can still run 60 days',
            'A chain rewrite, priced in hashrate and rising with every confirmation',
            'None',
          ],
          [
            'Account required',
            'Yes, both ends, with identity checks',
            'Yes, both ends',
            'Almost always yes at one end',
            'No',
            'No',
          ],
          [
            'Cost',
            'Roughly 1.5%-3.5% of the purchase',
            'Around $15-$50 plus a foreign-exchange markup often in the low single digits',
            'Near zero to low',
            'About $1-$3 regardless of amount, but relatively heavy for a small payment',
            'Under a cent',
          ],
          [
            'Who can freeze it',
            'The issuer, the network and the acquirer',
            'Either bank, and the compliance regime',
            'The bank, the network, or the regulator',
            'Nobody',
            'Nobody, once the payment is settled',
          ],
          [
            'Can you audit it yourself',
            'No, you get a statement',
            'No',
            'No',
            'Yes, the full history is public',
            'Payment proves cryptographically; the route is private by default',
          ],
        ],
        note:
          'A rough survey of published fee and settlement data as of September 2026, not a quotation. Card fee ranges vary enormously by merchant category and card type, and the real reason those fees exist is the fraud and chargeback machinery the last row above describes. Judge the systems on the job you need done, not on the row that flatters your conclusion.',
      },
    },
    {
      heading: 'The honest case that fiat technology is also improving',
      paragraphs: [
        'If this lesson only criticised existing payment technology it would be dishonest, because that technology has improved enormously and much of the improvement is recent.',
        'Brazil\'s Pix launched in November 2020 and processed on the order of 63 billion transactions worth about $4.6 trillion in 2024, reaching something like 87% of Brazilian adults. India\'s UPI processed roughly 241.6 billion transactions in 2025 with more than 550 million users. Kenya\'s M-Pesa, launched in 2007, serves around 66 million customers across eight countries through roughly 381,000 cash agents, works on basic phones over USSD, and now serves about 40 million monthly active users in Kenya alone. These are not clumsy systems. They are among the most important financial innovations of the decade, and in Kenya they are the reason a great many people are banked at all.',
        'The United States is the interesting laggard. FedNow launched in July 2023 and by the first quarter of 2026 had 1,725 participating banks and credit unions, about 19.7% of US financial institutions, moving roughly 2.73 million transactions worth $271 billion a quarter. That is real growth off a small base, but FedNow and the older real-time payment rails together still move only about 0.12 instant payments per person per month in the United States, against 35 in Thailand, 27 in Brazil, 13 in Sweden and 11 in India.',
        'Central bank digital currency is the part where the evidence is most instructive, because it is money technology improving while the supply question stays exactly where it was. The digital yuan remains the largest retail CBDC pilot in the world, with a cumulative 232 million wallets issued by the end of 2025 and throughput of about 10,000 transactions a second. In January 2026 the People\'s Bank of China reclassified it as a liability of private intermediaries, which is a fair description of what it had become: digital fiat with a central bank logo. It has not displaced the private incumbents that already dominate Chinese mobile payments. Nigeria\'s eNaira, launched in 2021, had about 98.5% of its downloaded wallets sitting unused three years on. The Bahamas\' Sand Dollar plateaued at roughly 0.4% of the physical currency in circulation, in a period when physical cash itself grew. Jamaica\'s JAM-DEX has seen both transaction volumes and values decline since launch, which the BIS Innovation Hub team attributes not to the incentives themselves but to there being too few merchants and digital wallet providers to make it usable.',
        'So the fair conclusion is narrow and specific. Fiat rails are faster, cheaper and more available than they were a decade ago, and in several countries they are the best payment technology on earth. None of that changes the monetary question, because a CBDC, a Pix payment and a FedNow transfer are all claims on an issuer whose supply is set by policy. Improving the plumbing does not change who decides how much there is. It is entirely possible for the payment layer to improve and the monetary layer to stay unfixed, and that is roughly what the last three years of central bank technology have demonstrated.',
      ],
    },
    {
      heading: 'The adoption is measurable, not hypothetical',
      paragraphs: [
        'The most common weakness in the hard-money argument is that it is always about the future. This one is not, and the reason to take the argument seriously is that the demand for a non-sovereign store of value has already shown up in places that cannot be argued about.',
        'The clearest of these is institutional and sovereign allocation, because it is unconditional by construction: a decision to hold does not depend on the day it was made.',
      ],
      table: {
        head: ['Evidence', 'Approximate figure', 'Why it matters'],
        rows: [
          [
            'US Strategic Bitcoin Reserve',
            '328,372 BTC, from the executive order of 6 March 2025, with a no-sell directive and a 20-year minimum-holding law',
            'A G20 government holding a non-sovereign asset and legislating that it cannot be sold',
          ],
          [
            'Listed spot bitcoin ETFs',
            'About $109bn in assets, from roughly $57.4bn of cumulative net inflows since January 2024',
            'Pension and brokerage money can now buy it inside ordinary retirement accounts, which removed the largest structural barrier to a small allocation',
          ],
          [
            'Corporate treasuries',
            'Strategy held 847,363 BTC, about 4.04% of the maximum supply, as of 22 June 2026',
            'A listed company has made this its balance-sheet policy, and smaller companies have followed',
          ],
          [
            'Sovereign and public funds',
            'El Salvador over 6,200 BTC, accumulating at about 1 BTC a day; Mubadala around 8,700 BTC via an ETF stake; Bhutan widely estimated at around 13,000 BTC',
            'Participation has spread from one country to a Gulf sovereign wealth fund, a microstate and a Himalayan monarchy. Only El Salvador and the Central African Republic have made it legal tender, so it is still a niche',
          ],
          [
            'Security and settlement capacity',
            'About 1,000 exahashes per second, roughly a zettahash, with a 2026 peak near 1.05-1.13 ZH, and about 128 TWh of annual energy use',
            'The network is securing itself with real capital expenditure, and it is a meaningful slice of world electricity',
          ],
          [
            'Actual payments use',
            'About 651,655 daily transactions in June 2026, up roughly 90% year on year, and over $1bn of monthly Lightning volume in early 2026',
            'This is the number that matters most and it is the smallest, because on-chain use is still small against global payments',
          ],
        ],
        note:
          'Figures were current as of September 2026 and several come from issuer disclosures and press reporting rather than audited statements, so check the primary sources below before quoting any of them. Two caveats belong in the same breath as the numbers: holders of an ETF do not hold the keys, and reported sovereign holdings outside El Salvador are estimates rather than public audits. Adoption into wrappers is migration, not custody by choice.',
      },
      points: [
        'Roughly 559-741 million people worldwide are estimated to own crypto, and 28-30% of US adults report owning some.',
        'About 988,000 addresses hold at least one whole bitcoin; an estimated 20% of the maximum supply, near 3.97 million coins, is believed permanently lost.',
        'SegWit is around 85% of transactions and Taproot around 20%, so the upgrades that make fees cheaper are actually in use rather than announced.',
        'Roughly 24,500 reachable Bitcoin nodes validate the chain, against a full initial block download of about 600 GB. Verifying from scratch is a deliberate act, not a default.',
      ],
    },
    {
      heading: 'Where the strong version fails',
      paragraphs: [
        'Every argument above is true, and the case is still not conclusive. These are the places it fails, stated as plainly as the rest of the lesson.',
        'The monetary argument is not an adoption argument. Gresham\'s law tells you that if the conditions hold, behaviour will shift. It says nothing about whether the conditions hold, and the conditions include that people can still get paid in fiat and that they will still want to hold a savings asset that has already disappointed them. Fixed supply is a property of the asset. Adoption is a fact about the world, and only one of those is guaranteed.',
        'Bitcoin\'s unit of account is genuinely weak. Almost every bitcoin is accounted in dollars, taxes and rent are denominated in fiat, and a Bitcoin Standard would require a generation of stable denominated account that does not yet exist. This is the single strongest argument against the strongest version of the thesis, and it is a direct consequence of money\'s second function still being performed by fiat.',
        'Custody is the soft spot in the adoption numbers. Estimates of 20% permanently lost are a record of irreversible mistakes, not of a system that is easy to use safely. And the fastest-growing way to own bitcoin is through a wrapper in which someone else holds the keys, which is a milder version of the bank exposure the technology was designed to remove.',
        'Permissionless does not mean geographically dispersed. Around 37-38% of hashrate is in the United States, so a determined state could censor a large share of new blocks. That is a materially different risk profile from "no trusted third party", and it deserves to be described accurately rather than waved away.',
        'Finally, competition is real and mostly not Bitcoin\'s to ignore. CBDCs, faster instant-payment rails, tokenised bank deposits and stablecoins are all improving, and stablecoins in particular are already a multi-billion-dollar, dollar-denominated settlement layer that captures much of the use case people assume Bitcoin will take. If the demand is for a stable digital claim, the incumbents have a large head start on distribution and trust.',
        'The defensible version of the claim is therefore narrow, and narrow is fine. Bitcoin is the first money in this table whose supply rule a holder can verify independently, and there is real and growing demand for exactly that property. It is a bet on adoption, and it is not a replacement for the payment rails that already work well.',
      ],
    },
  ],
  tryIt: [
    'Open a block explorer and read the coinbase message in block zero, then look up the current block height and the total number of satoshis that will ever exist. Five minutes of that is a better check on "verifiable supply" than any amount of argument.',
    'Make two columns. Left: the properties in the table above that Bitcoin currently satisfies, and right: the ones marked weak. Then look up how much of the money you personally would keep in each column. Most people are not in the same market as the one they think they are in.',
    'Compare a real transfer receipt. Take any ordinary card payment and the fee on a cross-border remittance to the same recipient, and note the settlement date and the fee. That comparison is the rails argument, and you can run it in ten minutes without reading anything theoretical.',
  ],
  sources: [
    {
      label: 'BIS CPMI and Markets Committee — "Central bank digital currencies" (12 March 2018)',
      detail:
        'The institutional case for a state-issued digital currency, and the strongest version of the objection to private digital tokens as money: a general-purpose CBDC could have wide-ranging implications for banks and the financial system, because commercial banks\' reliance on customer deposits could become less stable as deposits moved to the central bank in times of stress. The Committee\'s conclusion is careful rather than hawkish, finding that each jurisdiction should weigh the implications thoroughly before deciding whether to issue. Worth reading as the best version of the opposing argument rather than as background. It predates stablecoins, so for the modern version of the same argument see the Atlantic Council tracker above.',
      url: 'https://www.bis.org/cpmi/publ/d174.htm',
    },
    {
      label: 'Federal Reserve Bank of Richmond — Economic Brief 26-28, "FedNow and the Development of U.S. Fast Payments"',
      detail:
        'FedNow participant count and quarterly volumes, the FedNow/RTP settlement-model comparison, and the per-capita fast-payment comparison across Thailand, Brazil, Sweden, India and the United States used in the technology section.',
      url: 'https://www.richmondfed.org/publications/research/economic_brief/2026/eb_26-28',
    },
    {
      label: 'Atlantic Council — Central Bank Digital Currency Tracker',
      detail:
        'e-CNY transaction and wallet counts, the January 2026 reclassification of e-CNY as an intermediary liability, and the cross-border wholesale CBDC projects. e-CNY as "digital fiat" rather than new money is the framing used above.',
      url: 'https://www.atlanticcouncil.org/cbdctracker/',
    },
    {
      label: 'CSIS — "How Central Banks Can Win the Digital Currency Race"',
      detail:
        'The adoption failures that make the CBDC case more complicated than the technology case: eNaira wallet usage, the Sand Dollar share of physical currency, Alipay and WeChat\'s share of Chinese mobile payments, and the 2025 volume comparison of FedNow with RTP.',
      url: 'https://www.csis.org/analysis/how-central-banks-can-win-digital-currency-race',
    },
    {
      label: 'Branch, Cooper, Franco, Frost, Koo Wilkens, Lyu, McIntosh, Mu, Phillip, Salinas, Ward, Walker and Wright — "Retail CBDCs in practice: the experience of the SandDollar, e-CNY and JAM-DEX" (2025)',
      detail:
        'The underlying data for the wallet counts and transaction totals in the CBDC paragraph, including the e-CNY throughput figure and the decline in JAM-DEX volumes. Written by a team from the BIS Innovation Hub and published on SSRN, so the figures can be traced to a citable source. Note that it is a working paper rather than a peer-reviewed BIS Working Paper, and that SSRN blocks scripted access, so it is best read from the PDF.',
      url: 'https://doi.org/10.2139/ssrn.5398695',
    },
    {
      label: 'Mises Institute — "The Relevance of Bitcoin and the Regression Theorem"',
      detail:
        'Pickering\'s reply to Luther is the clearest published attempt to reconcile Bitcoin with Mises\' regression theorem, and it corrects the misquotation this lesson is built against. Pickering holds that the theorem was never an account of how money originates, and that it requires subjective valuation and prior direct exchange rather than a non-monetary use, so Bitcoin\'s emergence is not the counter-example Luther claimed. Worth reading precisely because the correction runs against the Bitcoin-friendly version of this argument as well as against the sceptical one.',
      url: 'https://mises.org/quarterly-journal-austrian-economics/relevance-bitcoin-regression-theorem-reply-luther',
    },
    {
      label: 'Ammous, Saifedean — "The Bitcoin Standard" (2018)',
      detail:
        'The book that carries the stock-to-flow argument used in the sound-economics section. This link is the publisher\'s page for the book rather than the full text, so the argument has to be taken from the book itself and not from any figure quoted here. Two things to keep in mind while reading it: stock-to-flow is Ammous\'s own framework rather than a consensus finding in economics, and he is an advocate for the asset he is evaluating, not a neutral witness.',
      url: 'https://saifedean.com/the-bitcoin-standard/',
    },
    {
      label: 'Wikipedia — "Gresham\'s law"',
      detail:
        'The primary historical episodes cited: Copernicus\'s 1519 description, Henry VIII\'s debasement of the shilling, the 1550s Antwerp rate war, Rothbard\'s refined statement of the law as requiring a government-fixed face value, and the 1965 US half-dollar episode in which good coins were hoarded and melted.',
      url: 'https://en.wikipedia.org/wiki/Gresham%27s_law',
    },
    {
      label: 'Federal Reserve — H.6 Money Stock Measures',
      detail:
        'The place to check the money-stock series that any hard-money argument ultimately turns on, rather than taking a number from an article. Worth knowing that the Fed publishes two different things under similar names: H.6 is the money stock, while H.4.1 is the central bank balance sheet, and it is easy to cite the wrong one.',
      url: 'https://www.federalreserve.gov/releases/h6/',
    },
  ],
  questions: [
    {
      id: 'm2-5-q1',
      prompt:
        'Someone rejects bitcoin with this argument: "Gold has intrinsic value and bitcoin has none, so bitcoin is not money." Which response engages the argument properly?',
      options: [
{
          id: 'a',
          label:
            'Money is defined by the jobs it does, exchange, account and store of value, and the metals that became money were valued for scarcity and marketability, which are the same two properties Bitcoin is being asked to supply with the addition of a publicly verifiable supply rule',
          correct: true,
          explanation:
            'This is the accurate reply. The intrinsic-value test would rule out every money ever used, including gold, which is why the argument is weaker than it sounds. What actually separates candidates is whether the functions get performed and whether a holder can verify the supply rule without trusting the issuer.',
        },
{
          id: 'b',
          label: 'They are right, which is why gold and fiat are the only real money and bitcoin is a commodity',
          correct: false,
          explanation:
            'This accepts a test that fiat also fails, since a banknote is paper. It also mistakes the thing for the job: a commodity trades by its use value, and a money is defined by acceptance.',
        },
{
          id: 'c',
          label: 'They are right about the premise, and you should wait for bitcoin to gain intrinsic value before treating it as money',
          correct: false,
          explanation:
            'No money has ever had the intrinsic value the argument requires, so the test is unusable. A cow does not accept gold bullion, and a landlord does not accept it either.',
        },
{
          id: 'd',
          label: 'The argument is circular, because it assumes money needs intrinsic value in order to be valued',
          correct: false,
          explanation:
            'The criticism is fair but it is only a dismissal, not a replacement. It tells you the argument is wrong and leaves you with no way to compare one money with another.',
        }
      ],
    },
    {
      id: 'm2-5-q2',
      prompt:
        'You are paid in rand and deciding how to hold savings. Gresham\'s law says "bad money drives out good". What does it actually predict here?',
      options: [
{
          id: 'a',
          label: 'Bitcoin will eventually drive the rand out of circulation entirely, so switch now',
          correct: false,
          explanation:
            'The law has never predicted the disappearance of a national currency, and it does not describe what happened when the euro or the dollar displaced other currencies. It predicts relative holding behaviour, not replacement.',
        },
{
          id: 'b',
          label:
            'Spend the money you earn and hold the money whose supply rule you can verify, because the overvalued medium keeps getting spent while the scarce one gets saved',
          correct: true,
          explanation:
            'This is the mechanism, and it is the strongest practical claim the law supports. The classic form needed a government-set face value: in 1965 the United States cut the half-dollar from 90% silver to 40% while holding its value fixed, and the good coins were hoarded and melted out of circulation within a few years. Bitcoin has no legislated face value, so what transfers is the holding behaviour rather than the legal mechanism, and the version that applies is usually called Nakamoto-Gresham. Note what it predicts: while wages are still paid in fiat, fiat gets spent and bitcoin gets saved, which is exactly the pattern visible in the ETF, treasury and sovereign allocations. It is a prediction about behaviour, not about returns.',
        },
{
          id: 'c',
          label: 'Nothing, because the law only ever applied to coinage and says nothing about a digital asset',
          correct: false,
          explanation:
            'Technically pointed and practically empty. The law is about relative overvaluation and holding behaviour, which is exactly the situation, and throwing away the mechanism discards the most useful part of the argument.',
        },
{
          id: 'd',
          label: 'It means you should never spend anything, only hoard, since spending always circulates the weaker money',
          correct: false,
          explanation:
            'This inverts the law. Spending the medium you are paid in and holding the scarce asset is the behaviour it describes; permanent hoarding of everything is not a consequence of it.',
        }
      ],
    },
    {
      id: 'm2-5-q3',
      prompt:
        'Mises\' regression theorem says money cannot appear out of nothing: a good must already have been valued and directly traded before it is used as a medium of exchange. Bitcoin was created deliberately. What does that argument actually tell you?',
      options: [
{
          id: 'a',
          label: 'That the theorem only applies to goods with intrinsic use value, so scarcity-based money is exempt from it entirely',
          correct: false,
          explanation:
            'This sounds like a clever loophole, and it misstates the condition. The theorem concerns prior exchange value, not prior use value, so a good valued only as a store of value sits squarely inside its scope rather than outside it.',
        },
{
          id: 'b',
          label:
            'That it needs institutional backing to become money, and that the ETF, treasury and reserve allocations are what will supply it',
          correct: false,
          explanation:
            'This one is comfortable and wrong, because it accepts a premise the argument never made. Nothing in the regression theorem says money requires an issuer, and the significance of the adoption data is that the supply is being bid for by institutions that cannot compel anyone to hold it. If money needed a backer, bitcoin would not be the interesting case.',
        },
{
          id: 'c',
          label:
            'That bitcoin satisfies the condition rather than breaking it, because it was valued and directly traded before it was used as money, and the theory is not a test of whether a good can be designed',
          correct: true,
          explanation:
            'This is the strong reading, and it is Pickering\'s. The theorem has one requirement, a prior exchange value, and it was met on 22 May 2010 when the forum seller spent fiat to acquire 10,000 bitcoin expecting to trade it on to someone who wanted pizzas, so bitcoin had been valued and directly exchanged before it was ever used as a medium of exchange. On this reading the theorem was never an account of how money originates, so bitcoin is not the counter-example it is often said to be, and Pickering says the threat has been significantly overstated. The question the theorem does not answer is whether a deliberately created medium of exchange finds buyers, and adoption is answering that one.',
        },
{
          id: 'd',
          label:
            'That early buyers were betting on a market that did not exist yet, which makes the first decade the weak part of the thesis rather than the strong part',
          correct: false,
          explanation:
            'The observation is fair, and it is about adoption rather than monetary design. Early adoption was slow and uncertain for years, and that risk was real. But the argument the theorem raises is whether a created medium of exchange can find buyers at all, and the years since 2009 are the best evidence anyone has for the design.',
        }
      ],
    },
    {
      id: 'm2-5-q4',
      prompt:
        'You tap a card to pay for a coffee and the money leaves your account immediately. What has actually happened?',
      options: [
{
          id: 'a',
          label: 'Both banks have swapped the money instantly and the delay is only in the paperwork',
          correct: false,
          explanation:
            'The delay is the settlement, not the paperwork. Until the interbank settlement cycle completes, the transaction is a promise between two institutions rather than a transfer of funds.',
        },
{
          id: 'b',
          label: 'The merchant has been paid in central bank reserves, which is why it is instant',
          correct: false,
          explanation:
            'Card settlement generally happens in commercial bank money, not central bank reserves. Reserves and instant settlement are the business of FedNow, RTP and Pix, which is a separate and later development.',
        },
{
          id: 'c',
          label: 'The merchant has your money and cannot take it back',
          correct: false,
          explanation:
            'The merchant holds a claim on your bank, and can ask for it back. That is what makes refund and fraud protection work, and it is why the settlement takes a day or two rather than seconds.',
        },
{
          id: 'd',
          label:
            'Your bank has authorised a promise to the merchant\'s bank, the two banks settle in a later batched cycle, and the amount can still be reversed for months, for a percentage fee that exists largely to pay for that reversibility',
          correct: true,
          explanation:
            'This is what a card payment is, and it is a good design for a consumer refund. Compare it with a Bitcoin base-layer transaction, which takes about an hour to become practically final with no reversal window, or Lightning, which is under a second for a fraction of a cent.',
        }
      ],
    },
    {
      id: 'm2-5-q5',
      prompt:
        'Which is the strongest evidence that non-sovereign money is genuinely being adopted, and what does that evidence not prove?',
      options: [
{
          id: 'a',
          label:
            'Institutional and sovereign allocations, including a US Strategic Bitcoin Reserve legislated not to be sold and about $109bn in listed ETFs, and what it does not prove is that ordinary people hold it as money, since ETF and treasury holders do not hold the keys and reported holdings outside audited disclosures are estimates',
          correct: true,
          explanation:
            'This separates the strongest evidence from its own limits, and the limits are part of why the signal is strong rather than a weakness in it. Institutional allocation is unconditional by construction, which makes it the most durable signal available, and it is being made by institutions that cannot be compelled to hold the asset. The honest boundaries are that wrapper ownership is migration rather than custody by choice, that the non-El-Salvador sovereign figures are estimates, and that daily payment numbers are still tiny against global payments. What is being expressed at scale right now is demand for a store of value whose supply rule a holder can check for himself, and no other widely held asset offers that combination.',
        },
{
          id: 'b',
          label: 'The share price, which shows investors are willing to pay a premium for this property',
          correct: false,
          explanation:
            'Price is the weakest evidence available, because it is a market for scarcity and can move on liquidity alone, as recent years have shown repeatedly. It measures demand for the asset, not adoption of the money.',
        },
{
          id: 'c',
          label: 'The number of people who say they own it, which is the direct measure of adoption',
          correct: false,
          explanation:
            'Ownership surveys, around 28-30% of US adults, are mostly wallet balances, often with small or zero value, and they are self-reported. They measure awareness far better than use.',
        },
{
          id: 'd',
          label: 'Hashrate, which proves the network is secure and therefore that the money works',
          correct: false,
          explanation:
            'Hashrate proves the security budget is being funded, which is a genuine and important fact. It says nothing about whether anyone accepts the money, and security has never been the weak link in the argument.',
        }
      ],
    },
  ],
};

const M2_6: Lesson = {
  id: 'm2-6-the-world-this-builds',
  title: 'The world this builds',
  blurb:
    'Why this is worth wanting: what inflation and concentrated money creation do to ordinary people, what people actually do when their money stops working, what a bitcoin-accessible world would change, the honest access gap that stands in the way, and what each of us has to build to get there.',
  minutes: 20,
  sections: [
    {
      heading: 'The problem this is actually for',
      paragraphs: [
        'Everything in the four lessons before this one was an argument. This one is about what the argument is for, and the answer is not a number going up.',
        'Start with the mechanism rather than the slogan. When a central bank creates money, it does not raise a tax and it does not ask. It swaps one asset for another, and the newly created balance is spendable while the bonds it was bought with are not. Whoever holds cash, and whoever is paid in cash, holds the thing that just got diluted. That is the whole content of the money printer, and it is why inflation is not a natural weather event. It is a policy that can be switched on and off by a small number of people who are not elected to make that trade-off for you.',
        'The evidence is not subtle, and it is not theoretical. In 2008 the Federal Reserve\'s balance sheet went from roughly $900 billion before the crisis to about $2.2 trillion by the end of it, and on to roughly $4.5 trillion by 2014, and the rescue was funded by newly created money. In 2020 the Fed pledged to print without limit. In 2001 and 2002 Argentina froze bank deposits and forcibly converted dollar-denominated deposits and loans into pesos by decree; when the peso-dollar peg ended, the rate moved from about one peso per dollar to nearly four, destroying roughly three-quarters of the peso\'s dollar value in a step. In 2019 the same country limited its citizens to $200 a month in official dollar purchases. Bolivia\'s official foreign exchange reserves fell from a peak of $15.1 billion in 2014 to roughly $1.7 billion by 2023, and banks responded by restricting dollar card spending and charging steep fees on international transactions.',
        'And the currency itself is the record. Argentina\'s peso has lost more than 99% of its value against the US dollar over the past decade. The people who suffered that were not speculators and not foreigners. They were people who were paid in pesos, who saved in pesos, and who were told the peso was money.',
        'So what is the corruption argument, stated in a form that survives contact with a sceptic? Here is the careful version, and it is stronger than the accusation. You do not have to believe that any particular official is corrupt. You only have to notice that when the authority to create money is concentrated in a handful of institutions, the holders of that authority hold a permanent structural advantage over everyone who saved. They can respond to any crisis, any election, any loss of confidence. You cannot. That asymmetry does not require bad intent on any given day to produce a bad outcome over a decade, which is exactly what makes it a structural problem rather than a moral complaint, and why the answer has to be a rule rather than a promise.',
        'A hard cap is a rule. Nobody has to be trusted not to use it, because it is not available to anyone. That is the difference between arguing that someone will behave well and removing their ability to do otherwise.',
      ],
    },
    {
      heading: 'What people actually do when their money stops working',
      paragraphs: [
        'The best argument for adoption is not a forecast. It is that the behaviour has already happened, in enormous numbers, without anybody persuading anyone.',
        'In Argentina, one in five people now use crypto, roughly four times the Latin American average. Ninety-four per cent of peso-denominated crypto trading goes into dollar-pegged stablecoins, the highest share Artemis tracks for any major currency. Some of that is inflation insurance, and some of it is now just how people get paid: the share of Argentina-based contractors receiving USDC rose through 2024, and by 2026 roughly 40% of the digital dollar market in the country was stablecoins.',
        'What makes that detail remarkable is that the pressure has partly gone away. Controls were lifted in April 2025, inflation eased from around 25.5% a month to about 2.1% during 2026, and the gap between the official and parallel dollar rates closed to roughly 4%. Wallet downloads kept climbing every quarter while inflation fell. Something that was adopted as a defence kept being downloaded after the emergency eased, which is the most interesting thing in this data.',
        'Treat the word habit with care, though, because the people who published it flagged the limits themselves. The download counts measure arrivals, not residents: they say nothing about how much is still held, for how long, or by how many people who came back. The series that does touch saving behaviour — contractors paid in USDC — had fallen back to about a fifth of its early-2024 peak by July 2026, and it came from a payroll company that is an investor in the publisher, which states in its own disclosures that the third-party figures are not independently verified. And if a digital dollar still costs about 4% more than the bank\'s a year after the rules were relaxed, that price gap is itself evidence that people are still choosing it under constraint rather than out of settled preference. The solid reading is narrower and still worth having: demand did not evaporate when the reason for it softened, which is a different and more durable claim than a change of habit.',
        'In Venezuela, which is the acute case, the crypto economy reached $39.1 billion of activity in the twelve months to 30 June 2026, a 107.2% increase and the fastest growth in the region by a wide margin. Merchants interviewed there reported receiving close to 40% of their income in USDT, and freelancers and remote workers increasingly in crypto. That is not speculation. That is a functioning shadow dollar economy, built because the official one stopped functioning.',
        'And the part that has nothing to do with hyperinflation is the part everybody can relate to. Sending $200 to sub-Saharan Africa still costs about 9% on average, against a global average of 6%, and remittances to Latin America run 5% to 7% on roughly $170 billion of flows. Those fees are not greed. They are correspondent banking, and the cost of being an unbanked counterparty. In June 2026, stablecoin value on corridors with Mexico at either end reached $1.8 billion a month, about four times its early-2024 level, and stablecoins now carry roughly 8% of Mexico\'s remittance flow. Across Latin America as a whole, stablecoins reached 32% of cross-border value and 22% of domestic peer-to-peer activity by June 2026.',
        'The pattern across every one of these countries is the same trifecta: a currency that loses value, capital controls that make the official market useless, and expensive cross-border rails. That is the actual demand curve, and it was not manufactured by anybody in this course.',
      ],
    },
    {
      heading: 'What accessible has to mean, concretely',
      paragraphs: [
        '"Accessible" is the word that gets used loosely, so it is worth defining as a list of things that must all be true. If any one of them fails, the person is not in.',
        'This matters because the assets most affected by money printing are held by exactly the people who are most locked out of the existing system. Fifty-one per cent of adults in sub-Saharan Africa do not own a bank account, and over 100 million people in the region have no official identity document at all, which means they cannot pass the compliance check that every regulated platform requires. More than 90% of African Bitcoin users are mobile-only, so a design that assumes a laptop and a fast connection is a design for somebody else.',
      ],
      table: {
        head: ['What has to be true', 'What it looks like today', 'What it looks like when it is solved'],
        rows: [
          [
            'No bank account required',
            '51% of sub-Saharan African adults are unbanked, and 100m+ have no ID, so regulated platforms are unreachable',
            'A phone and a wallet. Nothing else. No account, no employer, no branch, no credit check',
          ],
          [
            'Cheap enough to matter',
            'About 9% to send $200 to sub-Saharan Africa, 5-7% to Latin America, against a 6% global average',
            'Cents, in under a second, with no minimum. The 2026 user survey put stablecoin transfers about 40% below traditional remittance channels',
          ],
          [
            'No permission to move or hold value',
            'Argentina capped official dollar purchases at $200 a month in 2019; capital controls and FX shortages recur across the region',
            'Holding and moving value is not something anyone grants you, and cannot be withdrawn',
          ],
          [
            'A store of value that is not a policy decision',
            'The peso has lost more than 99% against the dollar over a decade; Venezuela\'s bolivar and Nigeria\'s naira have both lost far more',
            'Saving is not a bet on somebody else\'s inflation target, and nobody can dilute the thing you hold',
          ],
          [
            'Open at the hour you need it',
            'Markets close, transfers batch, correspondent settlement takes one to five business days, and some payments do not work at weekends at all',
            'Any hour, any day, any timezone, settled or not, with no business day',
          ],
          [
            'The merchant keeps the fee, not the processor',
            'Card payments commonly cost 1.5-3.5% because the fees pay for chargebacks and fraud handling',
            'A fraction of a cent over Lightning. In Latin America, 71% of firms already using stablecoins name international payments as their top use case',
          ],
          [
            'Nobody can freeze it',
            'A bank can freeze an account, a payment can be reversed for months, and deposits have been confiscated outright',
            'A confirmed transaction cannot be reversed by anyone, because there is no counterparty to ask',
          ],
          [
            'And the honest last row',
            'Losing a seed phrase means the money is gone permanently. There is no fraud department, no chargeback, and no support line',
            'That stays true, and it is the reason the tooling has to carry the burden. Accessibility cannot mean pretending the cost is zero',
          ],
        ],
        note:
          'Figures are from published sources as of 2026 and are dated in the sections above and in the source list. The last row is deliberate. Any account of a world where money is accessible that hides the cost of losing your own keys is not advocacy, it is marketing.',
      },
    },
    {
      heading: 'The access gap, stated honestly',
      paragraphs: [
        'If you want to advocate for something, you have to know where it is failing. Bitcoin\'s binding constraint is not interest. It is that the single most important step is the step that fails.',
        'A 2026 study that followed 847 first-time Bitcoin users across Nigeria, Kenya, South Africa, Ghana, Tanzania and Uganda found that only 229 of them, 27%, backed up their wallet correctly on the first attempt. The rest skipped the backup or abandoned the wallet without knowing what they had lost. Asked what they thought the twelve words were for, 41% said a verification code and 18% thought the app was testing whether they could read English. Six per cent understood that those words were the backup. None of this was stupidity: these were small business owners, teachers and traders who used mobile banking every day without trouble. The interface was designed to fail them, with no explanation before the words, no instruction to get a pen, English-only vocabulary for non-native speakers, and no error checking that surfaced a mistyped word until months later, when they needed to restore.',
        'Only 17% of the users who did write their words down stored them securely. Forty-one per cent photographed them, which captures the entire backup in a compromised phone, and 23% put them in phone notes. Of the people who thought they had completed the backup, 34% had written at least one word wrong.',
        'The scale is not confined to one region. A 2026 survey of 1,000 US crypto holders found 35% had lost access to a wallet or account and 31% of those never recovered the funds, with only 15% having ever tested their recovery process. A Carnegie Mellon study presented at CHI 2025 found only 43% of respondents could correctly identify an image of a seed phrase, and many believed a lost one could simply be reset. Two-thirds of users say they support self-custody, and hardware wallet adoption still lags far behind the stated preference.',
        'The gap is measurable at the ecosystem level too. Coinbase has over 120 million verified users; MetaMask, the most widely used self-custodial wallet, has roughly 22 million monthly actives. The single most-praised property of this money is the one most people are not using, and the reason is not that they do not care. It is that self-custody today asks three or four unfamiliar steps, a ceremony, and the acceptance of permanent loss, in a flow with no support line.',
        'And here is the part that should give you real confidence rather than despair: the same study tested twenty-three variations of that onboarding and found a five-step framework that moved successful backup from 27% to 81%, and verified restoration from 66% to 96%. The fix was not a new technology. It was telling people what the words were, asking them to get a pen and paper first, showing the words in small verified groups, refusing to let anyone continue with a word wrong, and telling them where to store the result. 73% was never a property of Bitcoin. It was a property of one screen.',
        'That is what makes accessibility a build rather than a dream, and it is why the honest answer to "is this realistic" is more positive than the industry\'s reputation suggests. The failure is measured, understood and already fixed in prototype. What is missing is deployment, and deployment is what people like you are for.',
        'Now the part that cuts against everything above, because a course that only lets you read the flattering half of its own sources is propaganda. Chainalysis reports that across Latin America, the region growing fastest, balances held with services rose to 71.2% by June 2026 while self-custodied balances fell 66.7% against 28.0% for services, and the section of that report is titled the personal wallet giving way to the platform. Self-custodied bitcoin did not grow over the period while self-custodied stablecoins rose 66%, and the direction is the direction, in the region with the most Bitcoin users, custody is consolidating with companies.',
        'The UX researchers reach a conclusion that is uncomfortable for anyone whose plan is to fix adoption with better teaching. They argue the problem is engineering, not education, and that a good enough custodial experience creates inertia that no amount of educational content overcomes. No company publicly reports how many users who start custodial ever migrate, and the available evidence is that most never do. That is why the seed phrase is being engineered away rather than explained better: passkeys, social recovery, multi-party computation and embedded wallets, where the user never handles a private key at all. Those options do remove the failure rate. They also move the dependency rather than remove it — a multi-party scheme with a server-held share needs that operator, and a social-recovery scheme needs its guardians — so they are a trade, not a free win, and the sources describing them are largely published by the vendors who sell them.',
        'So the advice has to survive contact with that. Teach custody before the money arrives rather than after the loss, and be honest that education is necessary and probably not sufficient. The realistic expectation is not that the unbanked will run a seed phrase. It is that they will use a service built on rails they cannot inflate or censor, and that the long-run pressure toward holding the asset yourself only arrives once the tooling stops demanding the ceremony. Anyone who promises a mass migration to self-custody is selling something. The defensible claim is narrower: the rails are ready now, the interface problems are measured and solvable, and the people who most need this money are the last to be served by the existing system rather than the first to be captured by a new one.',
      ],
    },
    {
      heading: 'What has to be built, and by whom',
      paragraphs: [
        'Nobody is going to build this on behalf of the people who most need it, for the same reason nobody built them a bank branch. So it is worth being specific about the work rather than vague about the vision.',
      ],
      table: {
        head: ['The build', 'Why it decides access', 'What good looks like'],
        rows: [
          [
            'Onboarding that does not lose people money',
            'A 73% first-try backup failure rate is the single largest source of permanent, avoidable loss, and it is a design problem',
            'Explain before the ceremony, allow a person to come back later, verify every word, and show recovery before showing the wallet. Support, not just security',
          ],
          [
            'Recovery that is not a 12-word memory test',
            'A single unrecoverable mistake is the reason custodial platforms keep winning, and it is the reason most adopters never leave one',
            'Social recovery with a time-lock window, multi-party backup for mobile-only users, passkeys, and multisig that a non-technical person can operate',
          ],
          [
            'Rails that reach people who are not already banked',
            'Access to dollars is the actual product in most of these markets, and Bitcoin is the settlement layer under it',
            'Lightning and stablecoins working on cheap phones over poor bandwidth, with on-ramps and off-ramps that exist locally instead of only in the United States',
          ],
          [
            'The last mile, by whatever name',
            'M-Pesa reaches 40 million monthly active users in Kenya through roughly 381,000 cash agents, and 298,900 of those are in Kenya alone. Bitcoin has no equivalent and is not going to build one',
            'Convergence, not conquest. Services already bridge Lightning payments into M-Pesa wallets, so the recipient needs no crypto knowledge at all',
          ],
          [
            'Legal clarity and identity that works',
            'Over 100 million people in sub-Saharan Africa cannot pass a regulated compliance check, and a permissionless asset is the only door open to them',
            'Rules that let people hold and pay without fear of arbitrary enforcement, and identity that does not require a birth certificate a person does not have',
          ],
          [
            'Honest local money, not only dollars',
            'If the answer to local currency risk is a dollar token, you have solved dollarization and imported a new dependency',
            'Local-currency stablecoins and real local exchange, so people can price and save in the money they actually earn',
          ],
        ],
        note:
          'This is the honest version of the vision. Notice how little of it is about Bitcoin specifically, and how much is about the last mile being somebody else\'s job. A movement that demands people build things it has no intention of helping build is a marketing campaign, and it fails for the same reason the 73% failed: because nobody prepared the person who showed up.',
      },
    },
    {
      heading: 'What fair use means',
      paragraphs: [
        'Adoption is a trust business, and the only durable way to grow it is to be the kind of advocate people can check. In practice that means a handful of things, stated plainly because most public advocacy fails at exactly this point.',
        'Tell the truth about the risk. Bitcoin has been abandoned by some of the people who adopted it first, and a monetary argument that is correct is still only an argument. Anyone who sells it as a get-rich scheme is not making an argument, and people who arrived on that basis are the reason adoption stalls, because the person who concludes the argument was wrong does not come back and does not recommend it.',
        'Do not promise what the technology cannot do. It is not a get-out-of-tax jail. In most countries holding and spending is a taxable event, and pretending otherwise exposes the people who believe you to penalties that would never have touched them.',
        'Do teach custody, and do it before the money arrives. The single irreversible mistake people make is backing up the wrong thing, and the fastest way to prevent it is to insist on the boring step. If someone will not hold their own keys, at least make sure they know that what they have is a claim on someone else\'s balance sheet, and that roughly a fifth of all the bitcoin that has ever existed is already gone that way. Teach it knowing the research is clear that education alone will not move most people, and that the balance of balances is already tipping towards services: your job is to make sure they understand what they are choosing between, not to make self-custody sound like the only respectable answer.',
        'Do help people use it safely and for something real. A small amount you understand, held properly, is worth more than a large amount you do not.',
        'And do not treat disagreement as hostility. The five schools in lesson two all have serious arguments, and the person who disagrees with you about money is not your enemy. Building a monetary alternative that only persuades people who already agreed is not adoption. It is a club.',
      ],
      points: [
        'Say what it is, including the risk, and let people decide with full information.',
        'Push the custody lesson before the purchase, not after the loss.',
        'Declare the tax position rather than coaching evasion.',
        'Prefer Lightning and stablecoins for payments and bitcoin for savings, and explain why that is a fair use of each.',
        'Argue with evidence and dates. It is less effective than shouting and much more effective over ten years.',
      ],
    },
    {
      heading: 'Where you come in',
      paragraphs: [
        'You are the part of this that cannot be automated, so it is worth being blunt about the roles that actually move the number.',
        'Hold it, and hold it properly. Every genuine holder is one less adoption statistic that has to be manufactured, and every properly custodial coin is one that cannot be quietly sold out from under someone by a custodian. That is not a small thing: the reason adoption looks smaller than demand probably is a large share of it sitting in wrappers.',
        'Build the boring parts. Interfaces, recovery, local on-ramps, fee estimation, translations, plain-language explanations of what a seed phrase is. The study in the previous section found that the entire gap between a 27% and an 81% success rate was five decisions about one screen. That is what the work looks like.',
        'Accept it. Merchant acceptance is the least glamorous and most effective form of advocacy, and it is also the only kind that shows up in the data as real use rather than speculation.',
        'Teach it accurately, to one person at a time, without a funnel. The person who is helped by a clear explanation and nothing else is worth more than a hundred impressions and converts into a holder who stays for a decade instead of a quarter.',
        'Argue for the rule, not the price. The case survives a bad year on the strength of the supply cap, and the case for the supply cap is a claim about what we owe future holders of money, which is a much stronger platform than any chart.',
        'Then be honest about the size of the claim. The defensible version is narrow: Bitcoin is the first money whose supply rule a holder can verify without asking anyone\'s permission, and there is growing and measurable demand for exactly that. It is a bet on adoption, in a world where the alternative is money you must trust. Those two things are not equally likely, and you now know enough to judge which one you believe.',
      ],
    },
  ],
  tryIt: [
    'Take the last section\'s list of roles and pick one you could actually do this month, with a date attached. A specific commitment to one person teaches more than another week of reading.',
    'Find someone who is curious but not technical, and give them the shortest honest version: what it is, that nobody can guarantee it will be adopted, that self-custody is their responsibility, and why the supply rule matters. Then notice which part they ask a follow-up question about. That is the part the next person needs to hear.',
    'Read one real banking or fintech app\'s onboarding as if you were a first-time user with a low balance and no support. Then read a bitcoin wallet\'s the same way. The gap between the two is the actual adoption bottleneck, and it is mostly copy and defaults rather than cryptography.',
  ],
  sources: [
    {
      label: 'a16z crypto — "How Argentina uses stablecoins, in 5 charts"',
      detail:
        'The Argentine case used above: one in five people using crypto, 94% of peso trading going to stablecoins, contractor pay shifting to USDC, and the most interesting finding for the adoption argument, which is that wallet downloads kept climbing through 2026 while monthly inflation fell from about 25.5% to 2.1% and controls were lifted in April 2025. Read the limits as carefully as the claim: downloads count arrivals rather than residents, the USDC payroll series had fallen back to about a fifth of its early-2024 peak by July 2026, that data comes from an investor of the publisher, and the publisher states its third-party figures are not independently verified. The lesson therefore claims demand survived the easing of the pressure that caused it, which is defensible, and not that Argentines have developed settled new habits, which is not established.',
      url: 'https://a16zcrypto.com/posts/article/how-argentina-uses-crypto-5-charts/',
    },
    {
      label: 'Chainalysis — "Latin America: Brazil Leads World in Adoption as Region\'s Crypto Economy Grows" (23 September 2026)',
      detail:
        'The regional figures: $593.8bn of activity in the twelve months to 30 June 2026, Venezuela up 107.2% to $39.1bn, Mexico stablecoin corridors at $1.8bn a month in June 2026, and stablecoins at 32% of cross-border value and 22% of domestic peer-to-peer activity. Also the report\'s identification of the trifecta driving demand: persistent inflation, currency volatility and capital controls.',
      url: 'https://www.chainalysis.com/blog/latin-america-crypto-adoption-2026/',
    },
    {
      label: 'International Monetary Fund — "Stablecoins in Nigeria: A Growing Cross-Border Channel"',
      detail:
        'The institutional view, including the numbers used here: about $59bn of crypto inflows to Nigeria between July 2023 and June 2024, roughly 60% of sub-Saharan African stablecoin inflows since 2019, and the World Bank figure that sending $200 to sub-Saharan Africa costs about 9%. Note that the IMF also recommends stronger oversight, which is a fair reading of the limitations.',
      url: 'https://www.imf.org/en/news/articles/2026/06/16/stablecoins-in-nigeria',
    },
    {
      label: 'Brookings — "Stablecoins can transform the Global South by reimagining digital finance, trade, and development"',
      detail:
        'The financial-inclusion figures: 51% of adults in sub-Saharan Africa unbanked, 40% with mobile money accounts, 41% of stablecoin-using organisations reporting savings above 10%, 71% of Latin American firms citing international payments as the top use case, and the point that a system-wide approach including universal internet access is required, which the lesson repeats rather than glosses over.',
      url: 'https://www.brookings.edu/articles/stablecoins-can-transform-the-global-south-by-reimagining-digital-finance-trade-and-development/',
    },
    {
      label: 'Bitcoin UX Africa — "Bitcoin Seed Phrase UX: Why 73% of Users Fail Backup"',
      detail:
        'The central evidence of the access-gap section: 847 first-time users across six countries, 27% first-try backup success, what people thought the twelve words were for, the storage distribution, and the five-step framework that lifted success to 81% and verified restoration to 96%. It is a single study from a practitioner group rather than peer-reviewed work, and it is cited at that strength, but it is the clearest published measurement of the onboarding problem.',
      url: 'https://bitcoinux.africa/blog/posts/seed-phrase-ux.html',
    },
    {
      label: 'Spark — "The Self-Custody UX Gap: Why Most Users Still Choose Custodial Wallets"',
      detail:
        'The ecosystem-level framing used here, including the 120 million verified Coinbase users against roughly 22 million monthly actives at MetaMask, the 2026 Oobit survey of 1,000 US holders on lost wallet access and untested recovery, the CHI 2025 Carnegie Mellon seed-phrase identification finding, and the passkey, social-recovery, MPC and embedded-wallet approaches discussed as possible builds. Worth reading with a thumb on the scale: this is published by a protocol whose SDK is one of those answers, and its thesis is that the gap closes from the infrastructure side rather than the education side, which is also a sales position. The underlying survey and study numbers it cites are attributed, which is why the lesson uses those and treats the conclusion as one view rather than the finding.',
      url: 'https://www.spark.money/research/self-custodial-wallet-ux-barriers',
    },
    {
      label: 'Milken Institute — "Global Digital Asset Adoption: Sub-Saharan Africa"',
      detail:
        'The identity barrier and the regulatory context: over 100 million people in the region without official identification documents, eNaira wallet inactivity against strong private stablecoin use, and the comparison of official CBDC programmes with what people actually choose.',
      url: 'https://milkeninstitute.org/content-hub/insights/global-digital-asset-adoption-sub-saharan-africa',
    },
    {
      label: 'Ripple — "Crypto Regulation in Africa: What\'s Changing in 2026"',
      detail:
        'The "what has to be built" section\'s legal and last-mile detail: roughly eight African countries with crypto-specific regulation, Kenya\'s 2025 Virtual Asset Service Providers Bill, Nigeria\'s Investments and Securities Act 2025, and the scale of mobile money that Bitcoin has to reach rather than replace.',
      url: 'https://ripple.com/insights/crypto-regulation-in-africa/',
    },
    {
      label: 'Buenos Aires Herald — "From dual currencies to crypto. Is Argentina a blueprint for the stablecoin future?"',
      detail:
        'Supporting colour for the stress-laboratory framing, including Argentina\'s roughly 45% economic informality in 2026, the reasoning that inflation plus informality plus remittance dependence is the same combination found in Nigeria and other high-adoption markets, and the local view that Argentina\'s practices will become more common globally.',
      url: 'https://buenosairesherald.com/business/from-dual-currencies-to-crypto-is-argentina-a-blueprint-for-the-stablecoin-future',
    },
    {
      label: 'The Bitcoin whitepaper — "Bitcoin: A Peer-to-Peer Electronic Cash System"',
      detail:
        'The original text of the system being advocated here, including the double-spending problem and the proof-of-work mechanism. Worth reading in full once, because every claim in this lesson about what the money does traces back to it.',
      url: 'https://bitcoin.org/bitcoin.pdf',
    },
  ],
  questions: [
    {
      id: 'm2-6-q1',
      prompt:
        'Someone says inflation is just prices going up and has nothing to do with money creation. What is the strongest answer you can give without exaggerating?',
      options: [
{
          id: 'a',
          label: 'Prices only go up when people start printing money, so inflation is always caused by the central bank',
          correct: false,
          explanation:
            'Overstated. Demand, supply shocks and energy prices all move consumer prices, and a course that claims otherwise will be dismissed immediately. The precise claim is narrower and survives scrutiny.',
        },
{
          id: 'b',
          label:
            'Money printing is a supply change, and you can see the effect in the currency itself: the peso has lost more than 99% against the dollar over a decade, Bolivia\'s reserves fell from $15.1bn to about $1.7bn, and the Fed\'s balance sheet went from roughly $900bn to $2.2tn during 2008, so the person holding cash takes the loss while the issuer spends the new money',
          correct: true,
          explanation:
            'This is the defensible version. It names the mechanism, it gives three dated and checkable examples, and it does not require a theory about why officials behave as they do. The people who suffered the peso collapse were paid in pesos and told the peso was money.',
        },
{
          id: 'c',
          label: 'It depends entirely on the country, so there is no general argument to make',
          correct: false,
          explanation:
            'The severity varies enormously, which is true and which is exactly why the structural argument matters: the risk exists everywhere, and the countries where it has already bitten are the ones producing the adoption data.',
        },
{
          id: 'd',
          label: 'The honest answer is that we do not know, and anyone who says they do is selling something',
          correct: false,
          explanation:
            'The caution is healthy and the conclusion is not. We know a great deal about the mechanism and the historical record; what nobody knows is the future price, which is a different question from whether currency creation dilutes the saver.',
        }
      ],
    },
    {
      id: 'm2-6-q2',
      prompt:
        'Why is a hard cap on supply a structural answer to the problem of money being created by a small number of unelected institutions?',
      options: [
{
          id: 'a',
          label: 'Because every previous money that worked had a cap of some kind',
          correct: false,
          explanation:
            'Not true. Fiat money has no cap, and the lesson\'s own history section shows that the two most durable eras before fiat were gold and coinage, both of which were undermined by their issuers changing the terms. The cap is the innovation, not a return to something familiar.',
        },
{
          id: 'b',
          label: 'Because the people who run those institutions are corrupt and should be replaced',
          correct: false,
          explanation:
            'That is a moral claim, and it is not needed. It also cannot be verified, and it fails the moment the people change, which is the objection you want to avoid depending on.',
        },
{
          id: 'c',
          label:
            'Because a cap removes the discretion entirely: the argument never has to rely on anyone intending well, since no one has the ability to do otherwise, and that is what makes it structural rather than a promise',
          correct: true,
          explanation:
            'This is the strong version of the case, and notice that it is stronger than the corruption version. Concentrated discretion is a standing asymmetry between the issuer and the saver, so the answer is to delete the discretion rather than to request better behaviour from a small group of unelected people. 2008 and 2001-2002 show the asymmetry being used, without anyone needing to have set out to abuse it.',
        },
{
          id: 'd',
          label: 'Because it guarantees the price will go up',
          correct: false,
          explanation:
            'A cap fixes the supply, not the price. M2.4 spends a whole lesson on why those are different, and nothing in the supply schedule implies a direction for the price. Anyone promising a rising price has misunderstood the mechanism they are claiming to believe in.',
        }
      ],
    },
    {
      id: 'm2-6-q3',
      prompt:
        'A 27% first-try success rate for backing up a wallet, measured across 847 first-time users in six countries. What does that number tell you about where adoption is actually stuck?',
      options: [
{
          id: 'a',
          label: 'That self-custody should be deprioritised until the interface is perfect',
          correct: false,
          explanation:
            'That inverts the finding. The reason to fix the interface is that self-custody is the property that makes the money unspendable by anyone else, and every year it stays awkward is a year of custody the incumbent keeps. A better screen is available now, not after a perfect version exists.',
        },
{
          id: 'b',
          label: 'That most people should simply keep using custodial wallets, which is what they prefer anyway',
          correct: false,
          explanation:
            'They may prefer it, but preference is not a counter-argument, it is the measurement. Roughly 120 million verified Coinbase users against about 22 million monthly actives at MetaMask, plus two-thirds of users saying they support self-custody while hardware adoption lags, all point the same way.',
        },
{
          id: 'c',
          label: 'That these users lacked the technical ability to use bitcoin safely',
          correct: false,
          explanation:
            'The same people used mobile banking daily without trouble. They were small business owners, teachers and traders. Attributing the failure to capability is both wrong and the most common way advocates talk themselves out of fixing anything.',
        },
{
          id: 'd',
          label:
            'That the binding constraint is design, not demand, and the same study showed a five-step change to that one screen taking success from 27% to 81% and verified restoration from 66% to 96%',
          correct: true,
          explanation:
            'This is the most encouraging fact in the course. The gap was not a property of the technology, it was five decisions about one interface: explain before the ceremony, let people come back later, show words in verified groups, block progress on a wrong word, and say where to store the result. Interest and price were never the constraint.',
        }
      ],
    },
    {
      id: 'm2-6-q4',
      prompt:
        'What is the single highest-leverage thing an advocate can do to grow fair, durable adoption?',
      options: [
{
          id: 'a',
          label: 'Explain it accurately to people one at a time, including the adoption risk and the custody responsibility, so the people who arrive stay for years instead of quarters',
          correct: true,
          explanation:
            'Adoption is a trust business and the demand is not the scarce part, which the ETF, treasury and sovereign allocations make obvious. What is scarce is people who understand it. The person who is helped by a clear explanation and nothing else is the one who still holds through 2027, and that holder is worth more than a hundred impressions.',
        },
{
          id: 'b',
          label: 'Promote the price, since most people only pay attention after it has already moved',
          correct: false,
          explanation:
            'This is the standard growth tactic and it is what produces the people who leave. Several waves of early adopters have given up on it entirely. Promotional acquisition reliably sells to the cohort with the shortest holding period and the loudest exit.',
        },
{
          id: 'c',
          label: 'Concentrate on the people who already agree, and build a strong community around the shared conviction',
          correct: false,
          explanation:
            'A monetary alternative that only persuades people who were already persuaded is not adoption, it is a club. It also removes the most useful test of the argument, because people who already agree cannot tell you where the reasoning is weak.',
        },
{
          id: 'd',
          label: 'Build the user interfaces, since a 27% success rate on one screen is the whole problem',
          correct: false,
          explanation:
            'Close, and worth a lot of work, but it is not available to most advocates. The interface is a solvable build; the scarce thing you can do today is make sure nobody who trusts you loses money at the step that is irreversible, and tells the truth about the price while they do it.',
        }
      ],
    },
    {
      id: 'm2-6-q5',
      prompt:
        'A friend with a phone and no bank account wants to save in a currency that has lost most of its value. What does a bitcoin-accessible world have to give them first?',
      options: [
{
          id: 'a',
          label: 'Legal tender status, which is what actually made it work in El Salvador',
          correct: false,
          explanation:
            'Only two countries have done this, so it is not the mechanism that scales. The far more replicable thing is what has already happened across Latin America and Africa: permissionless digital dollars, particularly stablecoins, used because the official channel was closed, priced in cents and settled in seconds.',
        },
{
          id: 'b',
          label:
            'Access that needs nothing they do not have: no bank account, no identity document, no minimum, no permission, and a way to move value for cents without asking anyone, which is what over 90% of African bitcoin users actually need since they are mobile-only',
          correct: true,
          explanation:
            'This is what the demand data is made of, and the unbanked person is the person the money printer hurts most and serves least. It is also why the convergence argument matters: M-Pesa already reaches 40 million monthly active users in Kenya through roughly 381,000 cash agents, and services are already bridging Lightning into those wallets so the recipient needs no crypto knowledge at all.',
        },
{
          id: 'c',
          label: 'A better exchange, with more pairs and a nicer interface, so they can trade more easily',
          correct: false,
          explanation:
            'An exchange is a counterparty that requires identity documents and a phone number, and 100 million people in sub-Saharan Africa have no official ID. It is a better version of the same locked door, and it puts their savings somewhere that can freeze the balance.',
        },
{
          id: 'd',
          label: 'Regular saving, because adding to a fixed-supply asset on a schedule means never having to make a timing call',
          correct: false,
          explanation:
            'That is a real strategy for someone with income in a stable currency, and it is unavailable to the person in the scenario, who is paid in the depreciating one. Telling a person with no dollars to buy anything is advice that only works if you are wrong about their income.',
        }
      ],
    },
  ],
};

const L3_1: Lesson = {
  id: 'l3-1-energy-and-power',
  title: 'Energy and power',
  blurb:
    'The physical constraint underneath the technology: energy versus power, why abundant reliable energy is the thing worth protecting, what Bitcoin\'s energy actually buys, and the published findings that undercut the easiest version of the case.',
  minutes: 12,
  sections: [
    {
      heading: 'Energy and power are not the same thing',
      paragraphs: [
        'Economists who write about energy begin by separating two words that ordinary speech runs together. Energy is the total amount of work available over time: litres of fuel, kilowatt-hours from the grid, calories in a meal. Power is the rate at which that energy is put to work.',
        'A river with enormous volume but no drop over its surface has a great deal of energy and almost no power, because nothing is doing work with it. Turn the same water through a turbine and the power is large while the energy taken from the river is unchanged. This is why a more efficient machine does more work on the same fuel, and why the two words cannot be swapped in an economic argument.',
        'Bitcoin\'s proof of work is a machine in exactly this sense. It spends energy continuously, and what it produces is not energy at all but a scarce, verifiable ordering of transactions. The security of that ordering is bought in power.',
      ],
    },
    {
      heading: 'Why energy comes before money',
      paragraphs: [
        'The ordering is a claim about causation. Energy and power set the outer bound on what a society can produce: you cannot compute, mine, transport or build outside the physical supply of usable power. Money does not create that bound. Money decides which of the available goods get made, and at what price, among things already limited by what can physically be done.',
        'This is why the most serious books put energy and power near the front rather than treating them as a late environmental chapter. If you cannot account for the physical input, you are not doing economics, you are doing bookkeeping on top of an assumption you have not examined.',
        'The practical consequence for this course is that Bitcoin has to be judged as a machine before it is judged as an asset. A protocol that cannot be secured is not a monetary innovation, it is a wish.',
      ],
    },
    {
      heading: 'Power scarcity: the argument taken seriously',
      paragraphs: [
        'The claim is not that the world is running out of energy. It is closer to the reverse: total energy available to humanity is large and growing, and solar and wind in particular are not close to exhausted on any relevant timescale. The scarcity claimed is of power, meaning energy harnessed densely, converted efficiently, and delivered at the moment and place it is wanted.',
        'A settlement with unlimited solar and wind but no storage and no transmission lines has energy and almost no power, because the resource arrives intermittently and cannot be made to arrive on demand. Storage, transmission and conversion are what turn abundant energy into usable power, and those are the expensive, physically constrained parts.',
        'Read this way the energy question stops being an environmental footnote and becomes capital allocation: how much scarce, controllable power should be committed to securing a monetary ledger rather than to something else? That is a real trade-off, and the person making it is entitled to an opinion about which use is worth more.',
      ],
    },
    {
      heading: 'What Bitcoin actually consumes, and how to re-check it',
      paragraphs: [
        'Numbers in this space change fast and are estimated rather than metered, so treat any figure as a snapshot with a date attached. The Cambridge Bitcoin Electricity Consumption Index publishes a power-demand estimate and an annualised consumption figure, updated daily.',
        'As reported from Cambridge research in late 2025, the network was consuming on the order of 190 terawatt-hours of electricity annualised, up from about 138 TWh in mid-2024, explicitly described as preliminary. The same research reported that 52.4% of surveyed miners\' electricity came from sustainable sources including renewables and nuclear.',
        'The scale check is where most arguments go wrong. Against world electricity generation of roughly 30,000 TWh a year, 190 TWh is on the order of two-thirds of one percent. Large enough to be measurable and local, small enough that the global aggregate is not the interesting number. The interesting number is what one grid, one watershed, or one provincial tariff experiences.',
        'Two caveats survive into every claim built on the sustainability figure. It comes from a survey, so it over-represents operators willing to disclose, and Cambridge itself noted that heavy participation by US companies skewed earlier country-level results. A percentage of surveyed miners is not a percentage of the network.',
      ],
      table: {
        head: ['Measure', 'Reported figure', 'How to re-check'],
        rows: [
          [
            'Annualised consumption',
            '~190 TWh (reported Dec 2025, preliminary)',
            'ccaf.io/cbeci — updates daily',
          ],
          [
            'vs June 2024',
            '138 TWh',
            'Cambridge research, reported 2025',
          ],
          [
            'World electricity generation',
            '~30,000 TWh/yr (order of magnitude)',
            'iea.org/energy-system/electricity',
          ],
          [
            'Bitcoin share of world electricity',
            'Well under 1%',
            'Divide the two rows above yourself',
          ],
          [
            'Miner electricity from sustainable sources',
            '52.4% of surveyed miners',
            'ccaf.io/cbeci — note it is survey data',
          ],
        ],
        note:
          'Every figure here is an estimate with a publication date, and the daily CBECI value will have moved. The method is shown so you can disagree with the number rather than having to trust it.',
      },
    },
    {
      heading: 'Sufficient and reliable energy is the thing worth protecting',
      paragraphs: [
        'This is the part of the argument that is not contested, and it is the part that ought to be the measure everything else is judged against. Access to enough energy, available reliably, is the precondition for almost every improvement in material living standards. It pumps water, refrigerates food and medicine, runs irrigation, keeps hospitals and schools and small industry running after dark, and makes computation and communications possible at all. A grid that cannot deliver power when it is needed is not a smaller version of a working grid, it is a different and much poorer thing.',
        'Two properties are doing the work here, and it is worth keeping them apart. Sufficiency is whether there is enough energy in total to meet demand. Reliability is whether it arrives when and where it is needed. A society can have plenty of energy and still be poor because it is unreliable, and it can have reliable power for a small fraction of its people while the aggregate looks healthy. Most political argument about energy is really argument about the second property, and it is local.',
        'So the question that matters for Bitcoin is not whether its energy is large or small in the abstract. It is a marginal question, and it has a definite form: does the electricity Bitcoin mining consumes reduce the sufficiency or the reliability of supply available to anybody else? If that power was already generated and then curtailed, burned without being delivered, or stranded at a wellhead, the answer is no, and something stronger than no, because the fuel has been spent and the carbon emitted either way, so the output is recovered rather than sacrificed. If that power would otherwise have gone to a household or a factory, the answer is yes, and the effect lands on people who did not choose to be involved.',
        'Two honest limits on this framing. The strong correlation between energy use and living standards across countries is partly a story about industrialisation rather than a clean causal lever you can pull, and a place can have abundant energy while a large share of its people still lack reliable access, because sufficiency and access are different questions. So a rise in supply is not the same as a rise in access, and anyone who tells you mining is an energy-access programme is overstating it by a wide margin.',
        'What is defensible is narrower and still worth having. Mining is a load that can be switched off almost instantly, at effectively no cost, which makes it unusually useful to a grid operator handling intermittent generation. Where it runs on associated gas that would otherwise be flared, it removes a real emissions source rather than adding one. Where it absorbs curtailed output, it improves the returns on the generation that is already built and makes the next project easier to finance. Those are engineering effects, they are local, and they are measurable, which makes them far more useful than a global percentage in either direction.',
      ],
    },
    {
      heading: 'The instrumental case: what the energy actually buys',
      paragraphs: [
        'The strongest version of the positive case is not that the energy is harmless. It is that the energy is an input to something specific, and that the input is chosen well. The specific something is finality without a counterparty: a settlement that cannot be reversed, frozen, or repudiated by any bank, government or clearing house, and that still works when those institutions are unreachable, insolvent or hostile.',
        'The second instrumental argument is about where the electricity comes from rather than how much of it there is. Bitcoin mining needs a grid connection and an internet connection, and nothing else. It does not need a factory site, a supply chain, a workforce, or a customer in the same country. That makes it one of very few large consumers able to follow cheap power to wherever it happens to be, which is the property that makes the marginal question above answerable in the favourable direction at all.',
        'The strongest peer-reviewed support is a modelling study of the Texas interconnection that found Bitcoin demand more than doubled wind capacity and raised the renewable share of generation, while also increasing total carbon emissions by around 1.6 times. The same study then modelled miners being switched off whenever renewable generation fell unexpectedly short, and found the emissions increase shrank to a small fraction of the original, with a higher renewable share on top of that.',
        'So the honest reading of the best available modelling is conditional, and the condition is the whole point. Flexible load attached to a grid can pull new clean generation into existence. The same load, run as an unmanaged constant draw on a constrained grid, adds emissions. Which of those you get is a question about grid integration rather than about proof of work in the abstract.',
      ],
    },
    {
      heading: 'Three claims, compared case by case',
      paragraphs: [
        'Each of the following is repeated constantly, in good faith and often in bad faith. Rather than score them, the useful exercise is to lay out for each one what the case actually is, what the effect is if it holds, and who carries that effect. None of the three survives as cleanly as the person making it would like, and the honest position is a different verdict on each.',
        'Claim one: Bitcoin uses less energy than gold. Here the case is that the incumbent store of value is enormously energy intensive, so displacing it with something cheaper must be a net improvement. The effect if true is a reduction in total energy per unit of monetary value held, and a smaller aggregate footprint for the same monetary function. The difficulty is that the two reputable studies measure different things and land in opposite places, which the next section takes apart. The people who carry the effect are the communities near the mining, who bear the local concentration regardless of which total is right.',
        'Claim two: Bitcoin mining helps the developing world. Here the case is that reliable, round-the-clock demand for electricity improves the returns on new generation, so more solar and wind gets built, which raises energy sufficiency for everyone downstream. The effect if true is a genuine increase in supply, concentrated in places with cheap power rather than poor ones, arriving over years rather than months. The difficulty is that this is an indirect effect through project economics, and a rise in supply is not a rise in access, so the people who most need electricity are the least likely to be the ones mining helps directly. In constrained grids the effect on existing residential tariffs can be negative, and that has happened.',
        'Claim three: the incumbent system costs more energy than Bitcoin. Here the case is that banks, branches, ATMs, cash logistics, card rails, data centres and the industrial process of refining gold all consume energy, and probably more in total than securing a public ledger. The effect if true is that the environmental criticism is aimed at the wrong target. The difficulty is that this comparison cannot be settled, because the competing number is published by nobody, and a comparison where one side has a public daily meter and the other side has no meter at all will resolve in favour of whichever side you assume. It is still worth making. It is not evidence.',
      ],
      table: {
        head: ['Claim', 'The case for it', 'The effect if it holds', 'Who carries the effect'],
        rows: [
          [
            'Less energy than gold',
            'Gold refining and mining are energy intensive at every stage',
            'Lower total energy per unit of monetary value stored',
            'Communities near mining carry the local concentration either way',
          ],
          [
            'Helps the developing world',
            'Round-the-clock demand improves returns on new generation',
            'More generation built, raising energy sufficiency over years',
            'Not the unelectrified, who gain supply rather than access',
          ],
          [
            'Incumbent costs more',
            'Banking, cash logistics and gold refining all consume power',
            'The environmental criticism is aimed at the wrong target',
            'Unmeasurable, because the competing figure is unpublished',
          ],
          [
            'Flexible load helps the grid',
            'Controllable demand pulls new clean generation into existence',
            'More wind and solar, with emissions near-neutral if integrated',
            'Grid operators, who can verify this and therefore demand it',
          ],
        ],
        note:
          'The last row is the only one with an identifiable party who can check the claim and act on it. That is why it carries more weight than the three above it, and why the first three are argued rather than settled.',
      },
    },
    {
      heading: 'The gold comparison, and what the disagreement turns on',
      paragraphs: [
        'This one deserves care, because it is where people most often expect a clean win and least often get one. Two studies are usually quoted and they genuinely contradict each other.',
        'A Galaxy Research estimate put the gold industry at roughly 240 terawatt-hours a year, against Bitcoin at around 114 TWh at the time, which favours Bitcoin. A 2018 study in Nature Sustainability by Krause and Tolaymat compared energy per dollar of market value instead, finding Bitcoin at about 17 MJ per dollar, gold at roughly 5 MJ, and aluminium at about 122 MJ, which favours Bitcoin against aluminium and against gold.',
        'The disagreement is not arithmetic and it is not a mistake by either team. It is a choice of denominator. Galaxy asks how much energy the whole gold sector burns, and the answer is large, because that sector is enormous and wasteful at every stage. Krause and Tolaymat ask how much energy it takes to produce a dollar of market value, and gold wins on that measure, because gold carries enormous non-industrial demand and a very high price per unit of mass, so each dollar of it corresponds to very little metal and therefore very little energy. Bitcoin, priced far lower per unit of energy expended, loses that comparison. Both are legitimate questions about the same two systems. They simply have different answers, and the gold question you are asking decides which number you should be using.',
        'There is one further asymmetry, and it is checkable. Bitcoin\'s energy figure is public, continuously updated, and derived from hash rate by a documented method anyone can inspect and re-run. Gold\'s comparable figure is a greenhouse gas estimate for the industry, converted into energy using a global average carbon intensity, and the underlying report comes from an association made up of thirty-three gold industry bodies. One side of this comparison measures its own sector and publishes it daily. The other is a self-reported industry figure converted by a third party. That does not make the gold number wrong, and Krause and Tolaymat\'s method may still be the better question. But it does mean the two numbers do not carry the same evidential weight, and anyone treating them as symmetric is not being careful.',
        'So the useful conclusion is not that Bitcoin wins. It is that the comparison is a choice of question rather than a fact about the world, and that you should be suspicious of anyone who reports it as a fact in either direction. Note also that a pro-proof-of-stake house that argues proof of work should be abandoned concedes that gold mining consumes more energy than Bitcoin, which is agreement on the sector-total version from an opponent.',
      ],
    },
    {
      heading: 'Where the positive case fails, in published research',
      paragraphs: [
        'Three findings that cut against Bitcoin, from serious sources, because a lesson that omitted them would be worth less than nothing to anyone who checks.',
        'The NBER working paper on the Scrubgrass power plant in Pennsylvania, which was on the verge of retirement before a mining deal, found that the social cost of carbon from mining at that plant exceeded the value added by it, estimating between $3.11 and $6.79 in external damages for each $1 increase in the Bitcoin price. The authors also found the result held under an alternative counterfactual. Reusing a dying plant is a real benefit and the social cost exceeded it in that case.',
        'The same Texas modelling study that supports the renewable-capacity case found that Bitcoin demand raised total carbon emissions around 1.6 times without demand response. Adding a large unmanaged constant load to a gas-heavy grid is not free, and the study is explicit about it.',
        'Proof of stake exists, it uses orders of magnitude less energy, and serious practitioners, including some cryptographers, argue that it solved the energy question years ago. Bitcoin does not use it, for reasons that are defensible and complex and that this course covers in a later level. But a course that presents proof of work\'s energy cost as a necessary evil has to sit with the fact that the alternative was designed, shipped, and is in production use. The choice is a choice, and energy cost is part of what was chosen.',
        'Read together with the sufficiency section, these findings do not say the energy is wasted. They say the effect is genuinely local, genuinely conditional on how the load is integrated, and capable of coming out negative at a specific plant. A claim that survives only under a condition is not a failed claim, but it is not a clean one either, and this is the shape of the honest answer.',
      ],
    },
    {
      heading: 'The framing objection, stated properly',
      paragraphs: [
        'If you have read the power-scarcity framing before, the first objection is usually: this recasts a measurable environmental cost as an economic abstraction, and the verdict changes depending on which counterfactual you pick. Against gold mining it looks small. Against a hypothetical system that never needed the energy, it looks large. Neither comparison is wrong; they answer different questions, and the honest position is that the energy question cannot be settled by a ratio at all.',
        'There is a second, harder objection. An economic argument for the value of power presumes the power was wanted for something. If the honest case for Bitcoin is that it settles a ledger more cheaply or more independently than the alternatives, then the real question is not whether the energy is valuable but whether the same job could have been done with less of it. Proof of work deliberately spends energy to make history expensive to rewrite, and that is a design decision rather than a physical necessity. Any account that presents the cost as simply required is overstating it.',
        'What survives all of this is narrower than the slogans on either side, and it is not nothing. Proof of work buys finality that does not require anybody\'s permission, and it is paid for largely out of power that was going to be wasted, curtailed, or stranded. Whether that is a good trade depends on how well the load is integrated into the grid, which is an engineering question with an identifiable party who can answer it, and the evidence says the answer varies sharply by how it is done.',
      ],
    },
  ],
  questions: [
    {
      id: 'l3-1-q1',
      prompt:
        'A generator is rebuilt to burn the same fuel per hour but output twice the electricity. In this lesson\'s language, what changed?',
      options: [
{
          id: 'a',
          label: 'Fuel became cheaper',
          correct: false,
          explanation:
            'A rebuild does not move a commodity price. The change is physical, not financial.',
        },
{
          id: 'b',
          label: 'Its energy consumption doubled',
          correct: false,
          explanation:
            'Energy per hour is unchanged, because the machine burns the same fuel. This is the confusion the whole lesson exists to prevent.',
        },
{
          id: 'c',
          label: 'Its power doubled: energy per hour is unchanged while useful work per hour rises',
          correct: true,
          explanation:
            'Power is energy per unit time, so converting the same energy into more work per hour raises power. Efficiency is precisely this conversion getting better.',
        },
{
          id: 'd',
          label: 'Its efficiency fell to zero',
          correct: false,
          explanation:
            'Output rose on identical fuel input, so efficiency improved rather than collapsed.',
        }
      ],
    },
    {
      id: 'l3-1-q2',
      prompt: 'Why does this course teach energy before money?',
      options: [
{
          id: 'a',
          label: 'Because money is a state invention and energy is not',
          correct: false,
          explanation:
            'That is a separate claim from Chapter 10, not the reason for the ordering. Conflating them is how a physical argument turns into a political one.',
        },
{
          id: 'b',
          label: 'Because energy is easier to measure than money',
          correct: false,
          explanation:
            'Measurement is not a reason to teach something first, and money is measured constantly.',
        },
{
          id: 'c',
          label: 'Energy is more expensive than money',
          correct: false,
          explanation:
            'Price is not the claim, and in many grids energy is cheap per unit. The argument is about physical possibility, not cost.',
        },
{
          id: 'd',
          label: 'Because energy and power bound what production is physically possible, whereas money only records which goods get produced',
          correct: true,
          explanation:
            'It is an ordering claim about causation. Money allocates within the envelope; power sets the envelope. Get the direction wrong and every later argument inherits the error.',
        }
      ],
    },
    {
      id: 'l3-1-q3',
      prompt: 'The "power scarcity" claim is best described as which of these?',
      options: [
{
          id: 'a',
          label: 'Energy is abundant, but power, meaning energy harnessed densely and delivered when it is needed, stays limited and so remains valuable',
          correct: true,
          explanation:
            'The scarcity is in controllability and timing. Storage, transmission and conversion are the constrained parts, which is why a resource-rich place can still be power-poor.',
        },
{
          id: 'b',
          label: 'The world is running out of energy',
          correct: false,
          explanation:
            'This inverts the argument. Total energy is abundant and growing; the claim is about the usable, controllable form.',
        },
{
          id: 'c',
          label: 'Utilities overcharge for electricity',
          correct: false,
          explanation: 'A pricing complaint, not the argument. The claim survives at any price.',
        },
{
          id: 'd',
          label: 'Renewables will be exhausted before fossil fuels',
          correct: false,
          explanation:
            'Not the claim, and not something the economics supports. Exhaustion timelines are not what power scarcity means.',
        }
      ],
    },
    {
      id: 'l3-1-q4',
      prompt:
        'A settlement has abundant solar and wind but no storage and no transmission lines. Does it have energy, or power?',
      options: [
{
          id: 'a',
          label: 'Power, but no energy',
          correct: false,
          explanation:
            'This inverts the definitions. You cannot have a rate with no quantity behind it.',
        },
{
          id: 'b',
          label: 'Energy, but little usable power, because the resource arrives intermittently and cannot be delivered on demand',
          correct: true,
          explanation:
            'The resource exists but cannot be timed to match demand. This is the clearest demonstration of why abundant energy does not produce abundant power.',
        },
{
          id: 'c',
          label: 'Both, equally',
          correct: false,
          explanation:
            'If that were true, intermittency would not be a problem. The missing infrastructure is exactly what breaks the equivalence.',
        },
{
          id: 'd',
          label: 'Neither',
          correct: false,
          explanation:
            'Sunlight falling on panels is energy and is measurable. Denying it entirely is a different error from the one being avoided.',
        }
      ],
    },
    {
      id: 'l3-1-q5',
      prompt:
        'A mining operation is sited beside a gas well whose output would otherwise be flared, in a country with high electricity demand and little spare generation. Which answer best describes the effect on energy sufficiency for other people?',
      options: [
{
          id: 'a',
          label: 'It improves sufficiency substantially, because mining supplies electricity to the local population',
          correct: false,
          explanation:
            'Mining consumes power; it does not deliver any. A rise in supply is not the same as a rise in access, and conflating them is the most common overreach in this debate.',
        },
{
          id: 'b',
          label: 'It has no effect either way, because energy is a global pool',
          correct: false,
          explanation:
            'Electricity is not globally fungible. It is a local grid, and a grid is why the question has a determinate answer at all.',
        },
{
          id: 'c',
          label: 'It leaves sufficiency for others intact and removes a waste stream, so the effect is neutral to mildly positive',
          correct: true,
          explanation:
            'Flaring is a pure loss: the fuel is spent and the emissions released regardless. Absorbing it recovers output that was being destroyed. This is the marginal case where the instrumental argument is strongest.',
        },
{
          id: 'd',
          label: 'It lowers sufficiency, because any new large load reduces the electricity available to others',
          correct: false,
          explanation:
            'This assumes the load competes for generation that would otherwise serve other users. Here the gas is being wasted, so the generation is not coming from anywhere else.',
        }
      ],
    },
    {
      id: 'l3-1-q6',
      prompt:
        'A Texas modelling study found that adding Bitcoin mining demand more than doubled wind capacity and raised total carbon emissions by about 1.6 times. It then found that emissions rose only slightly when miners were switched off whenever renewable generation fell short. What is the correct reading?',
      options: [
{
          id: 'a',
          label: 'Bitcoin mining is good for the grid, since it builds clean generation',
          correct: false,
          explanation:
            'This reads the first result and discards the second. The study found emissions rose substantially without demand response, so the clean-generation effect is not free.',
        },
{
          id: 'b',
          label: 'Bitcoin mining always increases emissions regardless of how it is run',
          correct: false,
          explanation:
            'This overcorrects. The demand-response variant nearly eliminated the emissions increase, so "regardless" is not supported.',
        },
{
          id: 'c',
          label: 'Wind capacity would have doubled anyway',
          correct: false,
          explanation:
            'The doubling is the treatment effect the study attributes to added mining demand. The baseline without it was substantially lower.',
        },
{
          id: 'd',
          label: 'Flexible mining load can pull new clean generation into existence, but only the grid-integrated version is close to emissions-neutral',
          correct: true,
          explanation:
            'Both halves are the finding. The value is real and conditional, and the condition is grid integration rather than anything intrinsic to proof of work.',
        }
      ],
    },
    {
      id: 'l3-1-q7',
      prompt:
        'One study finds Bitcoin consumes less total energy than gold, and another finds Bitcoin uses more energy per dollar of value than gold. Both are reputable. What is the real source of the disagreement?',
      options: [
{
          id: 'a',
          label: 'They use different denominators: total sector energy against energy per dollar of market value',
          correct: true,
          explanation:
            'Gold has huge non-industrial demand and a high price per unit of mass, so per dollar of value it uses little energy, while the whole sector burns a lot. The question you ask decides which number is the right one.',
        },
{
          id: 'b',
          label: 'They measured different years, and the comparison is out of date',
          correct: false,
          explanation:
            'Dates matter, but the gap between the two results is far too large to be explained by a couple of years of data.',
        },
{
          id: 'c',
          label: 'Gold\'s figure is unknowable, so the study that estimates it must be wrong',
          correct: false,
          explanation:
            'Unknowable is different from unknowably-reported. The gold estimate is uncertain and industry-sourced, which is a reason for caution rather than dismissal.',
        },
{
          id: 'd',
          label: 'One team made a calculation error',
          correct: false,
          explanation:
            'Nothing suggests a mistake. Both are careful, and the disagreement survives scrutiny precisely because it is structural.',
        }
      ],
    },
    {
      id: 'l3-1-q8',
      prompt:
        'Someone claims Bitcoin mining helps the developing world because it creates demand for cheap electricity. Which is the most defensible version of that claim?',
      options: [
{
          id: 'a',
          label: 'The claim is entirely false, because mining has no effect on any other industry',
          correct: false,
          explanation:
            'Too strong in the other direction. The capacity and curtailment effects in the modelling are real, even though the development framing is wrong.',
        },
{
          id: 'b',
          label: 'It is an indirect effect: reliable low-cost demand can improve project returns on new solar and wind, so more gets built, but it raises supply rather than access and can raise local tariffs',
          correct: true,
          explanation:
            'This is the narrow claim the evidence supports. It runs through project economics over years, it increases energy sufficiency without necessarily increasing energy access, and the distributional effect on existing customers is not automatically favourable.',
        },
{
          id: 'c',
          label: 'The claim is true, because mining locates itself where energy is most needed',
          correct: false,
          explanation:
            'This reverses the actual incentive. Miners follow cheap and surplus power, which is systematically not the same as scarce power in poor places.',
        },
{
          id: 'd',
          label: 'The claim is true as usually stated, because mining brings power to places that lack it',
          correct: false,
          explanation:
            'Mining delivers no electricity to anyone. It loads onto existing grids, so it cannot be an energy-access programme.',
        }
      ],
    },
    {
      id: 'l3-1-q9',
      prompt: 'What is the strongest objection to framing Bitcoin\'s electricity use as scarce power rather than as waste?',
      options: [
{
          id: 'a',
          label: 'Bitcoin already runs mostly on renewables, so there is nothing to debate',
          correct: false,
          explanation:
            'A sustainability percentage does not answer a question about scarcity and displacement. It answers a different, partial one.',
        },
{
          id: 'b',
          label: 'Power is not a real economic quantity',
          correct: false,
          explanation:
            'Power has a price and a marginal cost in every grid on earth. Disagreeing with a use of power is not the same as denying it economic content.',
        },
{
          id: 'c',
          label: 'It recasts a measurable environmental cost as an economic abstraction, and the verdict changes with whichever counterfactual you compare against',
          correct: true,
          explanation:
            'Against gold it looks small; against a system that never needed the energy it looks large. Neither is fraudulent, which is why the framing alone cannot settle the question.',
        },
{
          id: 'd',
          label: 'Energy abundance means all energy use is harmless',
          correct: false,
          explanation:
            'Abundance does not make externality-free. A source used wastefully is still waste, and that is a stronger point than this one.',
        }
      ],
    },
  ],
  tryIt: [
    'Open ccaf.io/cbeci and write down today\'s power-demand figure in gigawatts, then come back next month and write down the new one. Two data points teach the volatility better than any argument about it.',
    'Take your own household electricity use for a month in kilowatt-hours and divide it by the annualised TWh figure above. The result is awkwardly small, which is the point: a global percentage is not a household moral question.',
    'Pick a local grid and find out its curtailment figure and its reserve margin. Those two numbers decide whether new flexible load helps or hurts, and almost nobody in the argument checks them.',
    'Find the Texas interconnection study and the NBER Scrubgrass paper, and notice that opposite sides cite both. Then decide for yourself which question each is actually answering.',
    'Read the Krause and Tolaymat abstract and the Galaxy methodology note side by side, then write down which denominator each one uses. That single step dissolves most of the argument you have read online.',
  ],
  sources: [
    {
      label: 'Can Bitcoin mining increase renewable electricity capacity? (ScienceDirect)',
      detail:
        'Peer-reviewed modelling of the Texas interconnection. Finds more than doubled wind capacity and higher renewable share, but about 1.6x higher total emissions without demand response, and near-elimination of that increase with it. The single most important source in this lesson.',
      url: 'https://www.sciencedirect.com/science/article/pii/S0928765523000313',
    },
    {
      label: 'NBER Working Paper 31745 — cryptomining at a retiring coal plant',
      detail:
        'Studies the Scrubgrass plant in Pennsylvania. Finds the site-specific benefit of avoiding plant retirement alongside the finding that social carbon costs exceeded value added. The strongest quantitative evidence against the easy version of the positive case.',
      url: 'https://www.nber.org/system/files/working_papers/w31745/w31745.pdf',
    },
    {
      label: 'Krause & Tolaymat, "Quantification of energy and carbon costs for mining cryptocurrencies" (Nature Sustainability, 2018)',
      detail:
        'Compares energy per dollar of market value across commodities. Finds Bitcoin at about 17 MJ per dollar against gold at about 5 MJ and aluminium at about 122 MJ. Cited here specifically because it contradicts the other gold comparison. The full text is paywalled, so the abstract is the part you can read free.',
      url: 'https://www.nature.com/articles/s41893-018-0152-7',
    },
    {
      label: 'Galaxy Research, "On Bitcoin\'s Energy Consumption"',
      detail:
        'Estimates total gold-industry energy and compares it to Bitcoin\'s on a whole-sector basis. The open-sourced methodology is worth reading precisely because the number it produces differs from the per-dollar one.',
      url: 'https://www.galaxy.com/insights/research/on-bitcoins-energy-consumption',
    },
    {
      label: '"Mining the wind: blockchain-enabled flexible loads for curtailment mitigation" (Queen\'s University Belfast)',
      detail:
        'Models ASIC load absorbing curtailed wind, with a stated monetisation rate. A Stage-1 proof of concept that explicitly calls for further validation, so read it as a direction rather than a result.',
      url: 'https://pure.qub.ac.uk/en/publications/mining-the-wind-blockchain-enabled-flexible-loads-for-curtailment/',
    },
    {
      label: 'Cambridge Bitcoin Electricity Consumption Index (CBECI)',
      detail:
        'Live power-demand and annualised-consumption estimates, updated daily. The primary source for the headline figures here.',
      url: 'https://ccaf.io/cbeci/',
    },
    {
      label: 'CBECI methodology',
      detail:
        'How the estimate is constructed and what it assumes. Read this before quoting a number, because it is a model and not a meter.',
      url: 'https://ccaf.io/cbnsi/cbeci/methodology',
    },
    {
      label: 'Cambridge research on Bitcoin energy and mix, reported by TheEnergyMag (2025)',
      detail:
        'Source of the December 2025 and June 2024 consumption figures and the 52.4% sustainable-sourcing figure quoted here, including its survey-bias caveats.',
      url: 'https://www.theenergymag.com/news/market-news/bitcoin-energy-consumption-mix-cambridge-eif',
    },
    {
      label: 'Saifedean Ammous, Principles of Economics, Chapter 8: Energy and Power',
      detail:
        'The power-scarcity argument this lesson is built on. Read it from the author\'s own site rather than from a summary.',
      url: 'https://saifedean.com/books',
    },
    {
      label: 'International Energy Agency — Electricity',
      detail:
        'World generation and demand context, providing the denominator in the percentage calculation.',
      url: 'https://www.iea.org/energy-system/electricity',
    },
  ],
};

/**
 * L3.2. Two separate tools get conflated here constantly, so the lesson keeps
 * them apart: a wallet holds keys and spends coins, while a node checks other
 * people's rules. A hardware signer and a full node solve different problems
 * and neither substitutes for the other. The honest half of the lesson is the
 * limits section, because "run a node" is often sold as protection it does not
 * actually provide.
 */
const L3_2: Lesson = {
  id: 'l3-2-wallets-seeds-and-nodes',
  title: 'Wallets, seeds and nodes',
  blurb:
    'What a wallet actually holds, how one seed phrase produces a whole tree of addresses, what a full node checks that a light wallet does not, and the honest limits of running one.',
  minutes: 11,
  sections: [
    {
      heading: 'A wallet holds keys, not coins',
      paragraphs: [
        'The most common misunderstanding in this area is that a Bitcoin wallet contains bitcoin. It does not. Bitcoin lives as unspent transaction outputs recorded on the shared ledger, and every one of them is locked to a public key. What sits in your wallet is the private key that matches those public keys, which is what authorises spending.',
        'So the wallet is a signing device. It takes a proposed transaction, checks it spends coins you control, and produces the signature that would allow it to be accepted. If the device is lost but you still hold the key, the coins are untouched. If the key is copied by someone else and your device is still lost, the coins are gone and no support line can reverse it, because nobody has the authority to.',
        'This split is why a paper backup of keys has always been enough to restore money, even though it cannot show a balance, cannot sign anything and looks nothing like the app people are used to. A wallet is an interface to a key. What that key has ever been used to spend is decided on the network, not in the app.',
      ],
    },
    {
      heading: 'One seed, a whole tree of addresses',
      paragraphs: [
        'An early design gave every address its own random private key, which meant every address needed its own backup and a single lost note lost one address\'s funds. Hierarchical deterministic wallets replaced that. One master key generates children, and children generate grandchildren, along a defined path, so a single seed phrase can recreate the entire structure.',
        'BIP39 describes the phrase itself: a list of 2048 ordinary words from which a fixed amount of entropy is drawn, conventionally 12 or 24 words, with a checksum that makes a mistyped word detectable. BIP32 describes the derivation, producing child keys from a parent using a one-way function, so a child key cannot be walked backwards to the master. BIP44 then fixes the shape of the path, giving the familiar form m/44\'/0\'/0\'/0/0, where each number selects a purpose, a coin type, an account, a receive or change branch, and an index.',
        'The practical consequence is the whole reason HD wallets exist. One backup of twelve words restores every address you have used and every address you will go on to use, on any machine, forever. That is a genuinely large improvement in safety, and it is worth understanding that the words are not a list of your accounts. They are a starting point for a calculation, and the addresses are that calculation run forward.',
      ],
    },
    {
      heading: 'The passphrase is a real second factor, and a real footgun',
      paragraphs: [
        'A BIP39 passphrase, often called a twenty-fifth word, is an optional extra word or phrase applied to the phrase before it becomes a seed. The result is a different seed, which means a different set of addresses, which means a different wallet. The twelve words on your backup are unchanged; what changes is what they generate.',
        'The upside is real and it is the right tool for one specific situation. If someone forces you to hand over your recovery phrase, an empty passphrase gives them only the wallet that a naive thief would look for. A memorable but unguessable passphrase hides the rest, and because an attacker cannot tell which passphrase you use, guessing is the only route in. This is a genuine second factor, and it costs you nothing to carry.',
        'The footguns are just as real and are where people lose money. There is no way to check the passphrase later: forget it and the balance is unreachable, permanently, with no support desk and no reset. Many wallets also cannot tell you whether a passphrase was entered at all, only that the balance is zero, so a simple typo looks identical to a wipe. And it does not protect against anything that can read your keystrokes, because the passphrase is being typed on the same compromised machine.',
        'The honest summary is that the passphrase protects a phrase that has left your control, and does nothing for a machine that has not. Treat it as a second lock on the same door rather than as a second door, and write it down with the phrase, never in the same photograph or the same notebook, because the common failure is storing them together and calling that two factors.',
      ],
    },
    {
      heading: 'What a full node does',
      paragraphs: [
        'A full node downloads the entire chain and checks it. It parses every transaction in every block, rejects anything that breaks a consensus rule, and builds its own picture of which coins are unspent. It does not take anybody\'s word for whether a transaction is real, including the word of the wallet it is connected to.',
        'That sounds like a technical detail and it is closer to a political position. Every consensus check is an enforcement of a rule, and enforcing it yourself means your node can refuse to accept a block that other software would have accepted. If a rule is changed, or a block is invalid under the rules in force, your node says so on its own evidence. A server that tells you what to accept is asking you to delegate exactly the judgement the technology was built to return to you.',
        'It also means you do not have to trust whoever gave you the wallet software. Your node has seen the chain for itself.',
      ],
    },
    {
      heading: 'What a full node does not do',
      paragraphs: [
        'This is the section the sales pages skip, and it matters more than the one before. Running a node is real verification and it is worth doing, and it is not omnipotence.',
        'A node validates transactions. It does not prevent you from sending coins to a scammer, and following a fraudulent but technically valid address to a fraudulent but technically valid exchange balance is something no node on earth will stop. A node will happily confirm the mechanics of a transaction that leaves you penniless, because the transaction is perfectly valid and you are the problem.',
        'A node does not recover a lost seed. That is a key problem, and a full chain of verified history tells you nothing about a key you no longer hold. A node also does not protect coins that are not yours to control, so anything sitting on a custodial exchange remains subject to that exchange\'s solvency, its regulators and its willingness to freeze.',
        'And a node cannot save you from a fault that is valid under the consensus rules themselves. If a bug lets a transaction destroy coins while still satisfying every rule a node checks, a correct node accepts it, because refusing would mean the node and the network disagreeing. The defence against that is review, not validation. This is a real limit of the verification model rather than a gap someone intends to fix later.',
        'None of this is a reason to skip the node. It is a reason to stop describing it as the thing that makes you safe, and to describe it accurately as the thing that makes your view of the ledger your own.',
      ],
    },
    {
      heading: 'Light wallets, and the trust that stays',
      paragraphs: [
        'A light or SPV wallet does something cheaper. It downloads block headers rather than whole blocks, and checks that the headers form a valid chain with real work in it, and it asks for merkle proofs showing that the transactions it cares about are genuinely included in a block. That is enough to rule out the crudest lies, and it needs kilobytes rather than hundreds of gigabytes.',
        'The trust that remains is the header chain itself. The wallet has verified that the headers link up and carry sufficient work, but it has not verified that the chain it was given is the chain with the most work on it, because proving that requires seeing the blocks themselves. A dishonest server can show you a self-consistent shorter chain and stop there, and a light wallet has no way to notice. It is a real reduction in trust, not the elimination of it.',
        'There is a second cost that is often left unstated. Because the wallet asks the server about every address it cares about, the server learns the full set of addresses you use, when you used them and what you did with them. Your coins may be unspendable by the server, and your entire financial history has still been handed to it in exchange for a balance display. For anyone whose threat model includes an interested observer, that is often a larger problem than the one SPV was solving.',
      ],
    },
    {
      heading: 'Pruning: keeping the chain, dropping the history',
      paragraphs: [
        'Bitcoin Core prunes by default. Once a block is far enough behind the chain tip, its contents are deleted once validation is complete, because a node only ever needs the recent chain to validate what comes next. What it keeps is the state: the set of unspent outputs, which is what lets it tell you your balance and reject a double spend.',
        'The rules do not change. A pruned node enforces precisely the same consensus rules as an archival one, which is the point most people get wrong, and it is why pruning saves disk rather than correctness. What it costs is history. A pruned node generally cannot serve old blocks to a peer syncing from genesis, and indexing every historical transaction with the txindex option requires the full chain, so a pruned node has to re-download to build one.',
        'So the choice is about what you want your node to be able to answer, not about how much you care about correctness. Plenty of people run a pruned node and never notice. If you intend to explore old transactions, run a server, or reindex, keep the chain. Otherwise pruning is the sensible default and most node operators never change it.',
      ],
      table: {
        head: ['Setup', 'What it downloads', 'What it still trusts', 'What it protects against'],
        rows: [
          [
            'Full node, archival',
            'Every block and transaction, from genesis',
            'Nobody for the contents of the chain',
            'A server lying about history, or the chain being a minority fork',
          ],
          [
            'Full node, pruned',
            'Every block to validate it, then discards old block data',
            'Nobody for validation; history itself is gone',
            'The same, but it can no longer answer questions about old blocks',
          ],
          [
            'Light or SPV wallet',
            'Block headers, plus proofs for the transactions it needs',
            'The server, for which chain the headers belong to',
            'A fabricated transaction; not a fabricated chain',
          ],
          [
            'Custodial account',
            'Nothing; you are shown a balance by someone else',
            'The custodian, entirely',
            'Nothing. This row is in the table to be compared honestly',
          ],
        ],
        note:
          'Disk and bandwidth requirements change with every release, so treat any specific number you read as dated. The Bitcoin Core documentation states current requirements, and the honest comparison between these rows is the second one, not the last: a pruned node and a light wallet both involve trust, and they are not the same trust.',
      },
    },
    {
      heading: 'A signer and a node are different tools',
      paragraphs: [
        'Two recommendations get bundled together constantly, and they defend against different attacks. A hardware signer exists to stop the key being read off a general-purpose computer, which is what malware and a careless backup are for. A full node exists to stop a server telling you what is true about the chain. Neither covers the other\'s problem: a hardware wallet connected to a dishonest server will happily sign a transaction the server fabricated, and a perfectly validating node holds no keys at all.',
        'Running both is the standard advice, and the reasoning is simply that the two attackers are different. One threatens your machine, the other threatens your connection. A device with a secure element and your own node means a compromised browser and a dishonest provider are each individually insufficient, which is a genuinely stronger position than either gives alone.',
        'The same honesty applies to the recommendation to check your balance on your own node. That is worth doing, and notice what it does and does not prove. It proves the coins are unspent and that no rule was broken. It does not prove they are not about to be spent by whoever holds the corresponding key elsewhere, and it does not tell you where the coins came from, which is a separate question that the ledger answers only if you look.',
        'This is also the part where verification stops being technical. A node is a vote on what the rules are, cast by running software that enforces them. It costs disk, bandwidth and attention, and the honest position is that this is a real burden for a benefit that is not entirely personal: an independently enforced chain is worth more when more people enforce it, and a person running a node is contributing to a shared property while also improving their own view of it. Whether that is worth a few hundred gigabytes of disk is a judgement each person has to make, and nobody should be told the answer.',
      ],
    },
  ],
  questions: [
    {
      id: 'l3-2-q1',
      prompt: 'Someone asks what a full node is actually for. Which is the accurate answer?',
      options: [
{
          id: 'a',
          label: 'It makes your transactions free, because validating them locally removes the miner',
          correct: false,
          explanation:
            'Validation and mining are different jobs. A node that validates free still relies on miners to order transactions, and fees are what pay for that ordering.',
        },
{
          id: 'b',
          label: 'It gives you a better wallet interface with more charts and features',
          correct: false,
          explanation:
            'The interface comes from the wallet, not the node. A node is a validator with no screen, and swapping which one you connect to changes your trust, not your features.',
        },
{
          id: 'c',
          label: 'It pays you for staying online, so keeping it running is a small income',
          correct: false,
          explanation:
            'This confuses proof of work with validation. Mining is paid for producing new blocks by hash power, and every full node, including miners, does the validation as unpaid work.',
        },
{
          id: 'd',
          label: 'It validates every block and transaction against the consensus rules itself',
          correct: true,
          explanation:
            'That is the whole function. The node builds its own view of which coins are unspent, and it can refuse a block that other software would have accepted.',
        }
      ],
    },
    {
      id: 'l3-2-q2',
      prompt:
        'A light wallet uses far less bandwidth than a full node and still refuses to accept a transaction the server made up. What is it relying on that a full node is not?',
      options: [
{
          id: 'a',
          label: 'It trusts the server about which chain the headers belong to, and only checks that the headers link up and carry enough work',
          correct: true,
          explanation:
            'Exactly the trade. It rules out a fabricated transaction via merkle proofs, but proving it is on the longest chain requires the blocks themselves, so a dishonest server can show a self-consistent shorter chain.',
        },
{
          id: 'b',
          label: 'It downloads every block and checks them all, just more slowly',
          correct: false,
          explanation:
            'If it did, it would be a full node. The saving comes precisely from skipping the block contents, which is also what leaves the gap.',
        },
{
          id: 'c',
          label: 'It runs the mining pool, so it can confirm its own transactions first',
          correct: false,
          explanation:
            'Light wallets do not mine or pool, and a node that mined would still be trusting a server about history. The saving would vanish.',
        },
{
          id: 'd',
          label: 'It cannot be fooled by a server, because it verifies everything locally before displaying it',
          correct: false,
          explanation:
            'This is the overclaim the light model invites. It does not verify everything, and the honest description of the residual trust is in option C.',
        }
      ],
    },
    {
      id: 'l3-2-q3',
      prompt: 'You add a passphrase to a twelve-word recovery phrase. What has actually changed?',
      options: [
{
          id: 'a',
          label: 'Every transaction now costs less, because the wallet is doing more work',
          correct: false,
          explanation:
            'Fees are set by the size of the transaction in virtual bytes and the demand for block space, not by anything you store locally.',
        },
{
          id: 'b',
          label: 'The seed is different, so the same words with a different passphrase are a different wallet with a different balance',
          correct: true,
          explanation:
            'Correct. It is a second factor on the words, and it is unforgiving: there is no way to recover a forgotten passphrase and no way to confirm you typed it correctly.',
        },
{
          id: 'c',
          label: 'The twelve words are now encrypted, so the phrase on the backup is unreadable',
          correct: false,
          explanation:
            'The words on the backup are unchanged and still readable. The passphrase is applied after them, in the derivation, not to the paper.',
        },
{
          id: 'd',
          label: 'The wallet can now be opened if you lose the twelve words',
          correct: false,
          explanation:
            'The opposite. The passphrase is combined with the twelve words, so losing the words loses the wallet even if the passphrase is known.',
        }
      ],
    },
    {
      id: 'l3-2-q4',
      prompt: 'A node operator prunes the chain to save disk. What did they give up?',
      options: [
{
          id: 'a',
          label: 'It only keeps unconfirmed transactions and discards confirmed ones',
          correct: false,
          explanation:
            'It keeps confirmed state, which is what lets it know your balance and catch a double spend. The blocks are what go, not the unspent output set.',
        },
{
          id: 'b',
          label: 'It enforces only half of the consensus rules, trading security for space',
          correct: false,
          explanation:
            'This is the misconception pruning exists to correct. The rules enforced are identical; the block data deleted was not going to be needed again.',
        },
{
          id: 'c',
          label: 'It can no longer usually serve old blocks to a peer, or build an index of every transaction',
          correct: true,
          explanation:
            'That is the real cost, and it is the right question to ask. Pruning keeps your validation completely intact and gives up history instead, which is why txindex, the option for querying every past transaction, needs the full chain again.',
        },
{
          id: 'd',
          label: 'It now rejects any block that is more than a year old',
          correct: false,
          explanation:
            'Pruning affects storage, not acceptance. A pruned node validates new blocks exactly as before, and an old block arriving now is a normal part of sync, not something to refuse.',
        }
      ],
    },
    {
      id: 'l3-2-q5',
      prompt:
        'One twelve-word phrase restores every address you have used and every address you will use. Which design makes that possible?',
      options: [
{
          id: 'a',
          label: 'The network copies your keys whenever you ask for a new address',
          correct: false,
          explanation:
            'Key creation is local and offline. The network sees a funded address and never learns the key that controls it, which is the entire point of the arrangement.',
        },
{
          id: 'b',
          label: 'Mining produces fresh addresses and distributes them to wallets that ask',
          correct: false,
          explanation:
            'Miners choose which transactions to include and cannot invent addresses anyone controls. Address generation is deterministic maths done on your own machine.',
        },
{
          id: 'c',
          label: 'Exchanges keep a record of the addresses they issued and reissue them on request',
          correct: false,
          explanation:
            'Addresses are not issued by anybody, which is exactly why a self-custodied wallet needs no institution to restore it. Nothing is reissued, and nothing is reissued to you if the provider stops existing.',
        },
{
          id: 'd',
          label: 'Hierarchical deterministic derivation computes child keys from a master key along a defined path',
          correct: true,
          explanation:
            'Correct, and the one-way function matters as much as the tree: a child key cannot be used to walk back to the master, so any single derived key is safe to handle on its own.',
        }
      ],
    },
  ],
  tryIt: [
    'Write down the twelve words of a test wallet on paper, restore it on a second machine, and confirm you see the same balance and the same addresses. That exercise is the whole argument for HD wallets, done in five minutes.',
    'Turn on a passphrase, restore again with it, then try restoring with the words and no passphrase. Watching the balance sit at zero is the most effective way to understand that a different passphrase means a different wallet rather than a locked one.',
    'Start a pruned node and check how much disk it ends up using. Compare that with what the Bitcoin Core documentation currently says, because the figure you measured is the one that is right for your version.',
  ],
  sources: [
    {
      label: 'Bitcoin Core documentation — Pruning',
      detail:
        'Why pruning is safe, what state is retained, and what a pruned node can no longer serve. The primary source for the limits in the pruning section.',
      url: 'https://bitcoincore.org/en/doc/pruning/',
    },
    {
      label: 'BIP32 — Hierarchical Deterministic Wallets',
      detail:
        'The derivation scheme itself: child keys from a parent along a path, and the one-way property that makes derivation safe to expose.',
      url: 'https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki',
    },
    {
      label: 'BIP39 — Mnemonic code for generating deterministic keys',
      detail:
        'The wordlist, the entropy and checksum scheme, and the optional passphrase. Source for the twelve-versus-twenty-four words and the 25th word.',
      url: 'https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki',
    },
    {
      label: 'BIP44 — Multi-Purpose HD derivation paths',
      detail: 'Why the path looks like m/44\'/0\'/0\'/0/0, and what each number selects.',
      url: 'https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki',
    },
    {
      label: 'Bitcoin Core — Verify your own transactions',
      detail:
        'The developer documentation on validation, and the clearest available statement of what a node does and does not check.',
      url: 'https://developer.bitcoin.org/devguide/block_chain.html',
    },
  ],
};


export const courseLevels: Level[] = [
  {
    id: 'level-1',
    name: 'Beginner',
    blurb: 'What Bitcoin is, how to buy it, how to store it, how to spend it safely, and the money question it raises.',
    published: true,
    lessons: [L1_1, L1_2, L1_3, L1_4],
  },
  {
    id: 'level-2',
    name: 'Money & Economics',
    blurb:
      'Where money comes from, the five schools that disagree about it, what fiat is doing to living standards now, what Bitcoin does and does not do about it, how money got to the strongest version of itself, and the world this is being built to replace. This level argues for adoption, and it does not make its case by leaving out the parts that are hard.',
    published: true,
    lessons: [M2_1, M2_2, M2_3, M2_4, M2_5, M2_6],
  },
  {
    id: 'level-3',
    name: 'Intermediate',
    blurb:
      'What physically makes the technology possible, what the technology is, and what people build on it. Power and energy first, because they set the bound on everything that follows.',
    published: false,
    lessons: [L3_1, L3_2],
  },
  {
    id: 'level-4',
    name: 'Advanced',
    blurb:
      'Time, money, and the long game: opportunity cost, time preference, what money actually solves, and the monetary case for Bitcoin held explicitly beside the development case rather than instead of it.',
    published: false,
    lessons: [],
  },
  {
    id: 'level-5',
    name: 'Technical Deep Dive',
    blurb: 'Script, consensus, privacy, and how the network actually settles.',
    published: false,
    lessons: [],
  },
];

export const publishedLevels = courseLevels.filter((level) => level.published);

/**
 * Levels that are still unpublished but already have written lessons. The draft
 * review route renders from this, so a lesson is readable for review while it
 * is hidden from the published course, and the moment a level is published it
 * leaves this list and the review route 404s it. That keeps the two in step
 * without anyone having to remember to update a second list by hand.
 */
export const draftLevels = courseLevels.filter((level) => !level.published && level.lessons.length > 0);

export function getDraftLesson(
  levelId: string,
  lessonId: string,
): { level: Level; lesson: Lesson } | undefined {
  const level = courseLevels.find((candidate) => candidate.id === levelId);
  if (!level || level.published) return undefined;
  const lesson = level.lessons.find((candidate) => candidate.id === lessonId);
  if (!lesson) return undefined;
  return { level, lesson };
}

export function getLevel(levelId: string): Level | undefined {
  return courseLevels.find((level) => level.id === levelId);
}

export function getLesson(levelId: string, lessonId: string): { level: Level; lesson: Lesson } | undefined {
  const level = getLevel(levelId);
  if (!level || !level.published) return undefined;
  const lesson = level.lessons.find((candidate) => candidate.id === lessonId);
  if (!lesson) return undefined;
  return { level, lesson };
}

export const allLessons = publishedLevels.flatMap((level) => level.lessons.map((lesson) => ({ level, lesson })));

export function getLessonPosition(lessonId: string): { index: number; total: number } | undefined {
  const flat = allLessons.map((entry) => entry.lesson);
  const index = flat.findIndex((lesson) => lesson.id === lessonId);
  if (index === -1) return undefined;
  return { index: index + 1, total: flat.length };
}

export function getNextLesson(lessonId: string): { levelId: string; lessonId: string; title: string } | undefined {
  const flat = allLessons;
  const index = flat.findIndex((entry) => entry.lesson.id === lessonId);
  const next = flat[index + 1];
  if (!next) return undefined;
  return { levelId: next.level.id, lessonId: next.lesson.id, title: next.lesson.title };
}
