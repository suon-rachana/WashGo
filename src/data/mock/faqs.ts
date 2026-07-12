export interface Faq {
  id: string;
  question: string;
  answer: string;
}

export const faqs: Faq[] = [
  {
    id: 'how-it-works',
    question: 'How does WashGo work?',
    answer:
      'Choose a laundry partner, select your services, schedule a pickup, and we handle the rest — from collection to clean, folded delivery.',
  },
  {
    id: 'pricing',
    question: 'How is the laundry price calculated?',
    answer:
      'Pricing depends on the services you choose (per kg, per item, or a flat rate) plus a pickup fee and a return delivery fee.',
  },
  {
    id: 'cancel',
    question: 'Can I cancel an order?',
    answer:
      'Yes — you can cancel an order any time before a rider has been assigned. Contact support if a rider is already on the way.',
  },
  {
    id: 'damage',
    question: 'What if my clothes are damaged?',
    answer:
      'Contact support right away with your order ID. Our laundry partners are responsible for any damage that happens during cleaning.',
  },
  {
    id: 'contact',
    question: 'How do I contact support?',
    answer: 'Use Call Support or Message Support below — our team is available every day from 8 AM to 8 PM.',
  },
];
