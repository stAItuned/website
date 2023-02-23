import api from "@lib/services";

import type { Target, Topic } from "@lib/models";

export interface Response {
  targets: (Target & Record<"value", string>)[],
  topics: (Topic & Record<"value", string>)[]
}

/** @type {import('./$types').PageServerLoad} */
export async function load(): Promise<Response> {
  return {
    targets: await (await api.articles.targets.fetch())
      .map(target => ({ value: target.id.toString(), ...target })),
    topics: await (await api.articles.topics.fetch())
      .map(topic => ({ value: topic.id.toString(), ...topic })),
  }
}