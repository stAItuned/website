/**
 * Topic Hub Configuration
 * 
 * Each topic hub has a unique icon and color scheme for visual differentiation.
 * Colors are hex values used for gradients and accents.
 */

export type TopicHub = {
    slug: string
    name: string
    description: string
    icon: string
    /** Primary gradient color hex */
    colorFrom: string
    /** Secondary gradient color hex */
    colorTo: string
    /** Category for grouping */
    category: 'core' | 'applications' | 'career' | 'operations'
}

export const topicHubs: TopicHub[] = [
    // === CORE AI ===
    {
        slug: 'ai-fundamentals',
        name: 'AI & Data Science Fundamentals',
        description: 'Foundational concepts of AI, Data Science, Machine Learning, and algorithms.',
        icon: '🧠',
        colorFrom: '#6366f1', // indigo-500
        colorTo: '#8b5cf6',   // violet-500
        category: 'core'
    },
    {
        slug: 'genai-fundamentals',
        name: 'GenAI & LLM Fundamentals',
        description: 'Core concepts of Generative AI and Large Language Models.',
        icon: '✨',
        colorFrom: '#a855f7', // purple-500
        colorTo: '#d946ef',   // fuchsia-500
        category: 'core'
    },
    {
        slug: 'model-architecture',
        name: 'Model Architectures & Training',
        description: 'Deep dives into internal architectures (MoE, Attention) and training techniques (Fine-tuning, RLHF).',
        icon: '🏗️',
        colorFrom: '#8b5cf6', // violet-500
        colorTo: '#c026d3',   // fuchsia-600
        category: 'core'
    },

    // === APPLICATIONS ===
    {
        slug: 'rag',
        name: 'RAG & Context Engineering',
        description: 'Retrieval-Augmented Generation, vector databases, and advanced context management.',
        icon: '🔍',
        colorFrom: '#06b6d4', // cyan-500
        colorTo: '#2563eb',   // blue-600
        category: 'applications'
    },
    {
        slug: 'agents',
        name: 'AI Agents & Tool Use',
        description: 'Autonomous agents, function calling, planning, and multi-agent systems.',
        icon: '🤖',
        colorFrom: '#10b981', // emerald-500
        colorTo: '#0d9488',   // teal-600
        category: 'applications'
    },
    {
        slug: 'ai-coding',
        name: 'AI Coding Assistants & Dev Tools',
        description: 'Tools and workflows for AI-assisted software development.',
        icon: '💻',
        colorFrom: '#0ea5e9', // sky-500
        colorTo: '#4f46e5',   // indigo-600
        category: 'applications'
    },
    {
        slug: 'ai-research',
        name: 'AI Research Workflows',
        description: 'Tools for deep research, paper analysis, and knowledge synthesis.',
        icon: '🔬',
        colorFrom: '#f43f5e', // rose-500
        colorTo: '#ec4899',   // pink-600
        category: 'applications'
    },

    // === CAREER & BUSINESS ===
    {
        slug: 'ai-career',
        name: 'AI Career & Learning',
        description: 'GenAI Fit Check, Career OS, and learning strategies for the AI era.',
        icon: '🚀',
        colorFrom: '#f59e0b', // amber-500
        colorTo: '#ea580c',   // orange-600
        category: 'career'
    },
    {
        slug: 'case-studies',
        name: 'Case Studies & Industry',
        description: 'Real-world applications of AI: from healthcare to gaming, finance, and beyond.',
        icon: '🌍',
        colorFrom: '#0ea5e9', // sky-500
        colorTo: '#0284c7',   // sky-600
        category: 'applications'
    },

    // === OPERATIONS ===
    {
        slug: 'production',
        name: 'Production & Reliability',
        description: 'Deploying AI in production: guardrails, monitoring, latency, and cost.',
        icon: '⚙️',
        colorFrom: '#f97316', // orange-500
        colorTo: '#dc2626',   // red-600
        category: 'operations'
    },
    {
        slug: 'llm-security',
        name: 'AI Security, Safety & Governance',
        description: 'Guardrails, prompt injection, data leakage, compliance, and red teaming for production AI.',
        icon: '🛡️',
        colorFrom: '#ef4444', // red-500
        colorTo: '#b91c1c',   // red-700
        category: 'operations'
    },
    {
        slug: 'llm-evaluation',
        name: 'LLM Evaluation & Benchmarks',
        description: 'Measuring performance, ELO ratings, benchmarks, and evaluation frameworks.',
        icon: '📊',
        colorFrom: '#84cc16', // lime-500
        colorTo: '#16a34a',   // green-600
        category: 'operations'
    }
]

/** Helper to get a topic hub by slug */
export function getTopicHub(slug: string): TopicHub | undefined {
    return topicHubs.find(h => h.slug === slug)
}

/** Category labels for UI display */
export const categoryLabels: Record<TopicHub['category'], string> = {
    core: 'Core AI',
    applications: 'Applications',
    career: 'Career & Business',
    operations: 'Operations'
}
