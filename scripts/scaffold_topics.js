const fs = require('fs');
const path = require('path');

// 1. Define Hubs (from config/topics.ts)
const topicHubs = [
    {
        slug: 'ai-career',
        name: 'AI Career & Learning',
        description: 'Role Fit Audit, Career OS, and learning strategies for the AI era.'
    },
    {
        slug: 'ai-fundamentals',
        name: 'AI & Data Science Fundamentals',
        description: 'Foundational concepts of AI, Data Science, Machine Learning, and algorithms.'
    },
    {
        slug: 'genai-fundamentals',
        name: 'GenAI & LLM Fundamentals',
        description: 'Core concepts of Generative AI and Large Language Models.'
    },
    {
        slug: 'rag',
        name: 'RAG & Context Engineering',
        description: 'Retrieval-Augmented Generation, vector databases, and advanced context management.'
    },
    {
        slug: 'agents',
        name: 'AI Agents & Tool Use',
        description: 'Autonomous agents, function calling, planning, and multi-agent systems.'
    },
    {
        slug: 'llm-evaluation',
        name: 'LLM Evaluation & Benchmarks',
        description: 'Measuring performance, ELO ratings, benchmarks, and evaluation frameworks.'
    },
    {
        slug: 'model-architecture',
        name: 'Model Architectures & Training',
        description: 'Deep dives into internal architectures (MoE, Attention) and training techniques (Fine-tuning, RLHF).'
    },
    {
        slug: 'ai-coding',
        name: 'AI Coding Assistants & Dev Tools',
        description: 'Tools and workflows for AI-assisted software development.'
    },
    {
        slug: 'ai-research',
        name: 'AI Research Workflows',
        description: 'Tools for deep research, paper analysis, and knowledge synthesis.'
    },
    {
        slug: 'production',
        name: 'Production & Reliability',
        description: 'Deploying AI in production: guardrails, monitoring, latency, and cost.'
    },
    {
        slug: 'business',
        name: 'AI for Business',
        description: 'Strategic application of AI for companies and decision makers.'
    }
];

const topicsDir = path.join(process.cwd(), 'public/content/topics');

// Ensure dir exists
if (!fs.existsSync(topicsDir)) {
    fs.mkdirSync(topicsDir, { recursive: true });
}

// Clean existing topics? Maybe safe to just overwrite the ones we know, and warn about others.
// The user wants a clean taxonomy.
// Let's archive old ones or just overwrite. I'll just write the 10 hubs.

topicHubs.forEach(hub => {
    const filePath = path.join(topicsDir, `${hub.slug}.md`);
    if (fs.existsSync(filePath)) {
        console.log(`Topic ${hub.slug} already exists. Skipping scaffold to preserve content.`);
        return;
    }

    const content = `---
title: "${hub.name}"
description: "${hub.description}"
seoTitle: "${hub.name} - Complete Guide & Resources"
seoDescription: "Comprehensive guide to ${hub.name}. Learn key concepts, best practices, and advanced techniques."
icon: "📚"
---

## What is ${hub.name}?

(Definition goes here. Explain what this topic covers and why it is important.)

## When to focus on this

(Explain who should learn this and when it is applicable.)

## Common Pitfalls

(List 2-3 common mistakes or misconceptions.)

## FAQ

<details>
<summary>Question 1?</summary>
Answer 1.
</details>
`;

    fs.writeFileSync(filePath, content);
    console.log(`Created ${hub.slug}.md`);
});

console.log('Scaffold complete.');
