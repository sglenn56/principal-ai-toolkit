// Principal AI Toolkit - Tools Configuration
// Add tools here. Each tool is an object with a stable id.
window.PRINCIPAL_AI_TOOLS = [
  {
    id: "parent-email-response",
    title: "Parent Email Response Builder",
    subtitle: "Behavior & Student Concerns",
    category: "Communication",
    purpose:
      "Draft a calm, professional response to parent concerns related to student behavior while maintaining clear boundaries and protecting relationships.",
    whenToUse: [
      "You receive an emotional or confrontational parent email",
      "A behavior incident requires follow-up communication",
      "You need to respond promptly without escalating the situation",
      "You want a clear, neutral, professional tone"
    ],
    whatYouNeed: [
      "Brief summary of the parent's concern (1–2 sentences)",
      "General, non-identifying student context (grade level, type of situation)",
      "Your desired tone (supportive, neutral, or firm)"
    ],
    ferpaNote:
      "Do not include student names, dates of birth, addresses, IEP details, or other identifying information.",
    promptTitle: "Copy & Paste Prompt",
    promptText:
`You are an experienced elementary school principal.

Write a professional email response to a parent regarding the following concern:

Parent concern:
[Briefly summarize the concern here]

Context (non-identifying):
[Grade level, general situation—no names or identifying details]

Tone:
[Supportive / Neutral / Firm]

The response should:
- Acknowledge the parent's concern
- Maintain clear and appropriate boundaries
- Use calm, respectful, professional language
- Avoid blame or emotional language
- Reassure the parent that the school is addressing the situation
- End with an invitation for continued communication if appropriate`,
    whatYouGet: [
      "A polished, ready-to-send email draft",
      "Professional administrator tone appropriate for elementary families",
      "Clear, defensible language aligned with school expectations",
      "A response that reduces escalation and builds trust"
    ],
    timeSaved: "5–10 minutes per message",
    adjustments: [
      { label: "Make it shorter", text: "Condense this response while keeping the same tone and message." },
      { label: "Make it firmer", text: "Rewrite this response to be more direct and firm while remaining professional." },
      { label: "Make it more supportive", text: "Soften the tone and add reassurance for the family." },
      { label: "Add a next step", text: "Add a sentence inviting the parent to meet or follow up if needed." }
    ],
    exampleOutput:
`Thank you for reaching out and sharing your concerns. I understand how important it is for families to feel confident that their child is safe and supported at school.

We have addressed the situation and are continuing to monitor student behavior to ensure expectations are clear and consistently reinforced. Please know that our staff takes these matters seriously and works closely with students to support positive choices.

If you have additional questions or would like to discuss this further, I am happy to continue the conversation.`,
    pitfalls: [
      "Responding while emotions are still high",
      "Over-explaining or justifying decisions unnecessarily",
      "Including identifying student information",
      "Sending without a brief human review"
    ],
    whereItFits:
      "This tool is most effective during quick response windows—before the school day begins, during a planning period, or when you need to respond thoughtfully without delaying communication.",
    relatedToolIds: []
  }
];

// Create categories array from tools
const categories = ["All categories"];
const uniqueCategories = new Set();
window.PRINCIPAL_AI_TOOLS.forEach(tool => {
  uniqueCategories.add(tool.category);
});
categories.push(...Array.from(uniqueCategories).sort());

// Export for use in main script
window.toolsConfig = {
  tools: window.PRINCIPAL_AI_TOOLS,
  categories
};
