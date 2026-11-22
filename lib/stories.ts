export interface StorySlide {
  eyebrow: string;
  title: string;
  body: string;
}

export interface Story {
  id: 'vouchers' | 'market-day' | 'workshops' | 'about';
  label: string;
  kicker: string;
  slides: StorySlide[];
  actionLabel: string;
}

export const stories: Story[] = [
  {
    id: 'vouchers',
    label: 'Vouchers',
    kicker: 'Mohlakeng circular economy',
    slides: [
      {
        eyebrow: '01 / The idea',
        title: 'Sats that stay local',
        body: 'Bitcoin Sisonke connects Mohlakeng residents with merchants who accept Bitcoin. The point is simple: what you earn here can be spent here.',
      },
      {
        eyebrow: '02 / How it works',
        title: 'Swap, spend, repeat',
        body: 'Pick up a voucher from a participating merchant, spend it with the next one, and the merchant settles in sats. Every round keeps value moving through the township.',
      },
      {
        eyebrow: '03 / Your part',
        title: 'Start with R20',
        body: 'A small voucher is enough to try the loop and see how it feels when money moves straight between neighbours.',
      },
    ],
    actionLabel: 'Claim R20 Voucher',
  },
  {
    id: 'market-day',
    label: 'Market Day',
    kicker: 'Merchants and neighbours',
    slides: [
      {
        eyebrow: '01 / The scene',
        title: 'Rows, not screens',
        body: 'Our merchant mini-tour with the Bitcoin Mohlakeng Society and Student of Bitcoin puts real shop owners in front of real questions — no slides, no jargon.',
      },
      {
        eyebrow: '02 / What happens',
        title: 'Trust before tech',
        body: 'People want to know who stands behind a payment, what happens if a phone dies, and how to check a balance. We work through it at the stall.',
      },
      {
        eyebrow: '03 / Come through',
        title: 'Curiosity is welcome',
        body: 'Market days are where curious neighbours become first-time users and merchants become confident receivers.',
      },
    ],
    actionLabel: 'Back a Market Day',
  },
  {
    id: 'workshops',
    label: 'Workshops',
    kicker: 'Learn by doing',
    slides: [
      {
        eyebrow: '01 / The method',
        title: 'Do the thing',
        body: 'From the Africa Free Routing Lightning Bootcamp in Johannesburg to wallet workshops in Mohlakeng, sessions are built around doing the work, not hearing about it.',
      },
      {
        eyebrow: '02 / The detail',
        title: 'Nodes, channels, custody',
        body: 'Participants set up wallets, open channels, make real payments, and talk through the mistakes that usually happen the first time.',
      },
      {
        eyebrow: '03 / The next seat',
        title: 'Room for one more',
        body: 'Tickets help cover the venue, the teacher, and the sats people need to practise with on the day.',
      },
    ],
    actionLabel: 'Get Workshop Ticket',
  },
  {
    id: 'about',
    label: 'About',
    kicker: 'Why we exist',
    slides: [
      {
        eyebrow: '01 / Who we are',
        title: 'A Flagship, not a platform',
        body: '₿itcoin Flagship is a grassroots community running education, meetups, public art and campaigns between Johannesburg and Randfontein.',
      },
      {
        eyebrow: '02 / The node',
        title: 'Online and open',
        body: 'The Flagship node keeps payments moving while the wallet buttons on this site let you support the work directly over Lightning.',
      },
      {
        eyebrow: '03 / Stay close',
        title: 'Small sats, real work',
        body: 'Every contribution goes to the wallets you can see on this page — education, events, activation and the documentary.',
      },
    ],
    actionLabel: 'Support the Flagship',
  },
];
