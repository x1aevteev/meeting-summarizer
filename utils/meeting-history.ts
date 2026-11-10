import type { SummaryResult } from './summary'

export type Message = { speaker: string; text: string }
export type Meeting = { id: string; transcript: string; conversation: Message[]; summary: SummaryResult }

const examples = [
  {
    id: 'website-review', title: 'Website redesign review', duration: '24 min',
    speakers: ['Nina', 'Leo'], topic: 'The mobile navigation and pricing page are ready for review.',
    task: 'Test the mobile navigation on iOS and Android', deadline: 'Thursday',
    decision: 'Keep the pricing layout unchanged for this release.',
  },
  {
    id: 'customer-handoff', title: 'Customer onboarding handoff', duration: '18 min',
    speakers: ['Sarah', 'Omar'], topic: 'The first customer group is ready for the new onboarding flow.',
    task: 'Share the onboarding checklist with support', deadline: 'Friday',
    decision: 'Roll out to the first customer group before expanding access.',
  },
  {
    id: 'roadmap', title: 'November roadmap sync', duration: '32 min',
    speakers: ['Alex', 'Maya'], topic: 'Reporting improvements are the priority for the next sprint.',
    task: 'Draft acceptance criteria for the reporting changes', deadline: 'Monday',
    decision: 'Defer dashboard customization to the following sprint.',
  },
]

const discussions: Record<string, [string, string][]> = {
  "website-review": [
    [
      "What should visitors see first on mobile?",
      "The main benefit and a single call to action."
    ],
    [
      "Where does navigation get confusing?",
      "The menu hides the contact link below the fold."
    ],
    [
      "Can we move contact higher?",
      "Yes, right after pricing."
    ],
    [
      "How does the menu behave with the keyboard?",
      "Focus returns to the toggle when it closes."
    ],
    [
      "What about touch targets?",
      "The links need more vertical padding."
    ],
    [
      "Are the images final?",
      "The hero is final; the feature images need crops."
    ],
    [
      "Which crops should we prepare?",
      "Portrait for mobile and landscape for desktop."
    ],
    [
      "How will we check the pricing page?",
      "Compare both plans on a narrow screen."
    ],
    [
      "Do the cards need a horizontal scroll?",
      "No, they stack in reading order."
    ],
    [
      "What if fonts load slowly?",
      "The fallback should keep the title from shifting."
    ],
    [
      "Which browsers matter most?",
      "Safari on iOS and Chrome on Android."
    ],
    [
      "Where should we log visual issues?",
      "In the review ticket, with viewport and screenshots."
    ],
    [
      "What counts as a launch blocker?",
      "A broken menu, hidden pricing, or an unusable signup link."
    ],
    [
      "Who signs off after testing?",
      "I'll share the checklist with you for final approval."
    ]
  ],
  "customer-handoff": [
    [
      "How many customers are in the first group?",
      "A small group we can follow up with individually."
    ],
    [
      "What is the first onboarding step?",
      "Accept the invitation and confirm the email address."
    ],
    [
      "What if the invitation expires?",
      "Support can resend it from the account page."
    ],
    [
      "What does the checklist cover?",
      "Invites, account setup, and the first successful login."
    ],
    [
      "Who owns unanswered questions?",
      "Support triages them and routes product issues to us."
    ],
    [
      "Can customers stop and resume setup?",
      "Yes, their completed steps are preserved."
    ],
    [
      "Which step should we monitor closely?",
      "Email confirmation, since that can block access."
    ],
    [
      "How do we spot a stalled account?",
      "Look for an invitation with no confirmation after a day."
    ],
    [
      "Should support send a reminder?",
      "Yes, once, with instructions to request a fresh link."
    ],
    [
      "Where do we record feedback?",
      "In the shared rollout log, without account secrets."
    ],
    [
      "How do we handle a blocker?",
      "Pause new invitations and investigate with support."
    ],
    [
      "When do we review the first group?",
      "After the first week, once we've collected feedback."
    ],
    [
      "What would justify widening access?",
      "Customers can finish setup without recurring support issues."
    ],
    [
      "What should I send the support lead?",
      "The checklist, escalation route, and review date."
    ]
  ],
  "roadmap": [
    [
      "Which report do we tackle first?",
      "The overview report used in the weekly review."
    ],
    [
      "What is missing there today?",
      "A date range and a clear empty state."
    ],
    [
      "Should we add custom widgets this sprint?",
      "No, they distract from making the core report reliable."
    ],
    [
      "What date presets do users need?",
      "This week, last week, and a custom range."
    ],
    [
      "How should we treat time zones?",
      "Display the account time zone beside the range."
    ],
    [
      "What happens with incomplete data?",
      "Explain what is missing instead of showing a misleading zero."
    ],
    [
      "Do users need an export?",
      "Not for the first cut; validate the on-screen report first."
    ],
    [
      "Who reviews the data definitions?",
      "The reporting owner will confirm them before implementation."
    ],
    [
      "What should acceptance criteria include?",
      "Known totals, boundary dates, and the empty state."
    ],
    [
      "How can QA reproduce expected totals?",
      "Provide a small fixture with a hand-checked total."
    ],
    [
      "What could block the sprint?",
      "Unclear ownership of the upstream data source."
    ],
    [
      "Can frontend start before the final API?",
      "Yes, once we agree on the response shape."
    ],
    [
      "What do we present at the sprint review?",
      "A report with date filters and one verified example."
    ],
    [
      "When will we revisit customization?",
      "After the core report is accepted, in the following sprint."
    ]
  ]
}

export const exampleMeetings: Meeting[] = examples.map((entry) => {
  const [lead, owner] = entry.speakers
  const conversation = [
    { speaker: lead, text: entry.topic },
    ...(discussions[entry.id] ?? []).flatMap(([question, answer]) => [
      { speaker: lead, text: question },
      { speaker: owner, text: answer },
    ]),
    { speaker: owner, text: `I'll take this action: ${entry.task}. I can have it done by ${entry.deadline}.` },
    { speaker: lead, text: entry.decision },
  ]
  return {
    id: entry.id,
    conversation,
    transcript: conversation.map(message => `${message.speaker}: ${message.text}`).join('\n'),
    summary: {
      title: entry.title,
      duration: entry.duration,
      summary: `${entry.topic} ${entry.decision}`,
      keyPoints: [entry.topic, entry.decision],
      actionItems: [{ task: entry.task, owner, deadline: entry.deadline }],
      decisions: [entry.decision],
    },
  }
})
