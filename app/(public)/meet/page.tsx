import Link from 'next/link'
import { PageTransition } from '@/components/ui/PageTransition'

const teams = [
  {
    name: 'Writers',
    slug: 'writers',
    description: 'The creative minds behind our content',
    logo: '/assets/team/writers-logo.png'
  },
  {
    name: 'Tech',
    slug: 'tech', 
    description: 'The technical experts driving innovation',
    logo: '/assets/team/tech-logo.png'
  },
  {
    name: 'Marketing',
    slug: 'marketing',
    description: 'Spreading AI knowledge to the world',
    logo: '/assets/team/marketing-logo.png'
  }
]

export default function MeetPage() {
  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto mb-32 mt-[150px] px-4 space-y-16">
        
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-4 text-primary-500 w-full md:w-fit bg-slate-100 px-8 py-4 rounded-lg font-semibold">
          <Link href="/" className="text-sm lg:text-base opacity-50 hover:underline hover:opacity-100 transition">
            Home
          </Link>
          <span>/</span>
          <span className="text-base lg:text-xl truncate">Meet</span>
        </nav>

        {/* Introduction */}
        <section className="text-primary-600 md:text-lg space-y-8">
          <div className="space-y-2">
            <h3 className="font-bold text-2xl">
              Have you always wanted to exchange opinions about AI practical applications?
            </h3>
            <p>Then you're in the right place.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-2xl">We are stAI tuned</h3>
            <p>
              We are an open knowledge community and we are glad to share everyone's AI knowledge.
              From practical AI applications to AI curiosities - it's your time to spread AI culture!
            </p>
          </div>
        </section>

        {/* Team Section */}
        <section className="space-y-16">
          <h1 className="text-6xl font-bold text-primary-600 text-center uppercase">Our Team</h1>
          <div className="flex flex-col md:flex-row gap-16 justify-center">
            {teams.map((team) => (
              <div
                key={team.slug}
                className="flex flex-col items-center gap-8 opacity-50 hover:opacity-100 duration-500 transition"
              >
                <Link href={`/meet/${team.slug}`} className="flex flex-col items-center gap-8">
                  <div className="hover:scale-125 duration-500 transition">
                    <div className="h-[200px] w-[200px] bg-primary-600 rounded-lg flex items-center justify-center text-white text-4xl font-bold">
                      {team.name[0]}
                    </div>
                  </div>

                  <div className="bg-primary-600 text-white font-semibold text-2xl uppercase py-4 px-8 rounded-full w-full text-center hover:bg-primary-700 transition">
                    {team.name}
                  </div>
                </Link>
                
                <p className="text-center text-gray-600 max-w-xs">
                  {team.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PageTransition>
  )
}
