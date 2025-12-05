'use client'

import { CodeBlock } from '@/components/ui/CodeBlock'
import { useToast } from '@/components/ui/Toast'
import { ScrollReveal, StaggerContainer, FadeIn } from '@/components/ui/Animations'

export default function CodeBlockDemoPage() {
  const { showToast } = useToast()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent mb-4">
              Interactive Code Blocks
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Professional code examples with copy, line numbers, and syntax highlighting
            </p>
          </div>
        </ScrollReveal>

        <StaggerContainer staggerDelay={100}>
          {/* Example 1: TypeScript with line numbers */}
          <FadeIn>
            <section className="mb-12 stai-glass-panel p-8 rounded-2xl">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                TypeScript Example
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Full-featured code block with line numbers, copy button, and filename
              </p>
              <CodeBlock
                code={`interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user' | 'guest'
}

async function fetchUser(userId: string): Promise<User> {
  const response = await fetch(\`/api/users/\${userId}\`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch user')
  }
  
  return response.json()
}

// Usage example
const user = await fetchUser('123')
console.log(\`Welcome, \${user.name}!\`)`}
                language="typescript"
                showLineNumbers={true}
                filename="user.ts"
              />
            </section>
          </FadeIn>

          {/* Example 2: Python with highlighted lines */}
          <FadeIn>
            <section className="mb-12 stai-glass-panel p-8 rounded-2xl">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Python with Highlighted Lines
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Lines 3-5 are highlighted to draw attention to key code
              </p>
              <CodeBlock
                code={`import numpy as np
from sklearn.model_selection import train_test_split

# Highlight these important lines
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train the model
model = RandomForestClassifier(n_estimators=100)
model.fit(X_train, y_train)

# Evaluate
accuracy = model.score(X_test, y_test)
print(f"Model accuracy: {accuracy:.2%}")`}
                language="python"
                showLineNumbers={true}
                highlightLines={[3, 4, 5, 6]}
                filename="train_model.py"
              />
            </section>
          </FadeIn>

          {/* Example 3: JavaScript with expand/collapse */}
          <FadeIn>
            <section className="mb-12 stai-glass-panel p-8 rounded-2xl">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                React Component Example
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Long code with expand/collapse functionality
              </p>
              <CodeBlock
                code={`import { useState, useEffect } from 'react'

export function TodoList() {
  const [todos, setTodos] = useState([])
  const [input, setInput] = useState('')

  useEffect(() => {
    // Load todos from localStorage
    const saved = localStorage.getItem('todos')
    if (saved) {
      setTodos(JSON.parse(saved))
    }
  }, [])

  const addTodo = () => {
    if (input.trim()) {
      const newTodos = [...todos, { 
        id: Date.now(), 
        text: input, 
        completed: false 
      }]
      setTodos(newTodos)
      localStorage.setItem('todos', JSON.stringify(newTodos))
      setInput('')
    }
  }

  const toggleTodo = (id) => {
    const newTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )
    setTodos(newTodos)
    localStorage.setItem('todos', JSON.stringify(newTodos))
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Todos</h1>
      <div className="flex gap-2 mb-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Add a todo..."
          className="flex-1 px-4 py-2 border rounded"
        />
        <button onClick={addTodo} className="px-6 py-2 bg-blue-500 text-white rounded">
          Add
        </button>
      </div>
      <ul className="space-y-2">
        {todos.map(todo => (
          <li key={todo.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span className={todo.completed ? 'line-through' : ''}>
              {todo.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}`}
                language="javascript"
                showLineNumbers={true}
                filename="TodoList.jsx"
                maxHeight={300}
              />
            </section>
          </FadeIn>

          {/* Example 4: Shell commands */}
          <FadeIn>
            <section className="mb-12 stai-glass-panel p-8 rounded-2xl">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Shell Commands
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Installation and setup commands
              </p>
              <CodeBlock
                code={`# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start`}
                language="bash"
                showLineNumbers={false}
              />
            </section>
          </FadeIn>

          {/* Example 5: JSON configuration */}
          <FadeIn>
            <section className="mb-12 stai-glass-panel p-8 rounded-2xl">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                JSON Configuration
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Configuration file example
              </p>
              <CodeBlock
                code={`{
  "name": "my-awesome-app",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "react": "^18.2.0",
    "next": "^14.0.0",
    "typescript": "^5.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "tailwindcss": "^3.3.0"
  }
}`}
                language="json"
                showLineNumbers={true}
                filename="package.json"
              />
            </section>
          </FadeIn>

          {/* Example 6: CSS */}
          <FadeIn>
            <section className="mb-12 stai-glass-panel p-8 rounded-2xl">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                CSS Styling
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Modern CSS with animations
              </p>
              <CodeBlock
                code={`.button {
  position: relative;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
}

.button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  transition: left 0.5s ease;
}

.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
}

.button:hover::before {
  left: 100%;
}`}
                language="css"
                showLineNumbers={true}
                filename="button.css"
                highlightLines={[24, 25, 26]}
              />
            </section>
          </FadeIn>

          {/* Test Toast Integration */}
          <FadeIn>
            <section className="mb-12 stai-glass-panel p-8 rounded-2xl">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Toast Integration Test
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Click the buttons to test toast notifications with different variants
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => showToast('Successfully completed!', 'success')}
                  className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-all hover:scale-105 active:scale-95"
                >
                  Success Toast
                </button>
                <button
                  onClick={() => showToast('Something went wrong!', 'error')}
                  className="px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all hover:scale-105 active:scale-95"
                >
                  Error Toast
                </button>
                <button
                  onClick={() => showToast('Please review your input', 'warning')}
                  className="px-6 py-3 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition-all hover:scale-105 active:scale-95"
                >
                  Warning Toast
                </button>
                <button
                  onClick={() => showToast('Here is some information', 'info')}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all hover:scale-105 active:scale-95"
                >
                  Info Toast
                </button>
              </div>
            </section>
          </FadeIn>

          {/* Feature Overview */}
          <FadeIn>
            <section className="stai-glass-panel p-8 rounded-2xl">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                Features
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-600 dark:text-primary-400">📋</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      One-Click Copy
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Copy code to clipboard with toast feedback
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-secondary-600 dark:text-secondary-400">🔢</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Line Numbers
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Optional line numbers for reference
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 dark:text-green-400">✨</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Syntax Highlighting Ready
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Support for 20+ languages
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 dark:text-purple-400">📝</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Line Highlighting
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Emphasize important code lines
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-orange-600 dark:text-orange-400">📁</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Filename Display
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Show file context for examples
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-pink-600 dark:text-pink-400">🌓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Dark Mode
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Beautiful in light and dark themes
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </FadeIn>
        </StaggerContainer>
      </div>
    </div>
  )
}
