
## Question
That's honestly a weekend of work, not 2.5 weeks. Which means you have time to actually polish rather than scramble.
A few things worth knowing about how Colosseum judges — they weight the submission package heavily. The video pitch, the monetization narrative, and how clearly you explain the "why Solana" angle matter almost as much as the code. The house fee model is genuinely compelling — you should lead with it. Something like: "Every session generates protocol revenue. The house always wins a cut. That's the business."
One specific thing to check before you submit: does your Anchor program handle the edge case where a session ends with no winner (e.g. everyone disconnects)? Judges who are devs will ask that. If there's a refund path or a timeout handler, mention it explicitly.
What's the current state of the frontend-to-contract wiring? Is Phantom already connected or is that still loose?