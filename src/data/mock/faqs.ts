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
    id: 'when-to-pay',
    question: 'When do I pay?',
    answer:
      'You choose a payment method when you request pickup. With Cash on Delivery you pay when your laundry is delivered; other methods are shown as coming soon.',
  },
  {
    id: 'track-order',
    question: 'How can I track my order?',
    answer: 'Open the Orders tab and tap Track Order on any active order to follow its progress in real time.',
  },
  {
    id: 'cancel',
    question: 'Can I cancel an order?',
    answer:
      'Yes — you can cancel an order any time before a rider has been assigned. Contact support if a rider is already on the way.',
  },
  {
    id: 'missing-item',
    question: 'What should I do if an item is missing?',
    answer: 'Contact support right away with your order ID so we can follow up with the laundry partner on your behalf.',
  },
  {
    id: 'damage',
    question: 'What if my clothes are damaged?',
    answer:
      'Contact support right away with your order ID. Our laundry partners are responsible for any damage that happens during cleaning.',
  },
  {
    id: 'contact-rider',
    question: 'How do I contact my laundry or rider?',
    answer: 'Open your order in the Orders tab — active orders show a Call or Message action for your assigned rider.',
  },
  {
    id: 'contact',
    question: 'How do I contact support?',
    answer: 'Use Call Support or Message Support below — our team is available every day from 8 AM to 8 PM.',
  },
];
