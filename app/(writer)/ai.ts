"use server"
import OpenAI from "openai"

const client = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY! 
})

export async function generateOutline(topic: string) {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Write a concise outline for an article about: ${topic}. The outline should be suitable for a technical AI/Data Science blog.`
        }
      ],
      max_tokens: 500,
    })

    return response.choices[0].message?.content ?? ""
  } catch (error) {
    console.error('Error generating outline:', error)
    throw new Error('Failed to generate outline')
  }
}

export async function improveSentence(sentence: string) {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Improve this sentence for a technical AI/Data Science blog: "${sentence}"`
        }
      ],
      max_tokens: 200,
    })

    return response.choices[0].message?.content ?? ""
  } catch (error) {
    console.error('Error improving sentence:', error)
    throw new Error('Failed to improve sentence')
  }
}
