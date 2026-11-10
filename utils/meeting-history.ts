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

export const exampleMeetings: Meeting[] = examples.map((entry) => {
  const [lead, owner] = entry.speakers
  const conversation = [
    { speaker: lead, text: entry.topic },
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
