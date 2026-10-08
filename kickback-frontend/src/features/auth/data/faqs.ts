// src/features/auth/data/faqs.ts
// Static for now. Only state things the app actually does; anything about
// refunds or payment timing should wait for the real payment flow.
export interface Faq {
    question: string;
    answer: string;
  }
  
  export const FAQS: Faq[] = [
    {
      question: "How do I book a table or console?",
      answer:
        "Open a café, pick a unit, choose your date, start time and duration, then tap Book. You'll get a review screen where you can apply an offer before confirming.",
    },
    {
      question: "What does 'Pending' mean on my booking?",
      answer:
        "Your slot is being held for you for 10 minutes while you finish. If it isn't confirmed in that time, the hold is released and the slot opens up for others.",
    },
    {
      question: "Can I cancel a booking?",
      answer:
        "Yes, from My Bookings, as long as the booking is pending or confirmed and hasn't started yet. A booking that has already started can't be cancelled.",
    },
    {
      question: "Why can't I pick a time I want?",
      answer:
        "That slot is already booked or outside the café's opening hours. Tap 'Show more details' on the booking page to see which times are free, or try a shorter duration.",
    },
    {
      question: "I forgot my password.",
      answer:
        "On the login page, tap 'Forgot password?'. We'll email a reset link that works for 30 minutes. If you're logged in, you can change it under Settings → Account security.",
    },
    {
      question: "How do I change the app's look?",
      answer:
        "Use the sun/moon button in the top bar, or go to Settings → Appearance. Your choice is saved to your account.",
    },
    {
      question: "How do I delete my account?",
      answer:
        "Go to Settings → Delete account. You can't delete it while you have upcoming bookings; cancel those first.",
    },
  ];
  