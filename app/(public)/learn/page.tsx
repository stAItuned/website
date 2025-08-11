import Link from 'next/link'
import Image from 'next/image'
import { PageTransition } from '@/components/ui/PageTransition'

const targets = [
  {
    name: 'Newbie',
    slug: 'newbie',
    description: 'Just starting your AI journey? Start here with beginner-friendly content.',
    image: '/assets/learn/newbie-card.jpg'
  },
  {
    name: 'Expert', 
    slug: 'expert',
    description: 'Ready for advanced AI concepts and cutting-edge research.',
    image: '/assets/learn/expert-card.png'
  }
]

export default function LearnPage() {
  return (
    <PageTransition>
      <section className="max-w-7xl mx-auto mt-[150px] mb-32 px-4 space-y-16">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-4 text-primary-500 w-full md:w-fit bg-slate-100 px-8 py-4 rounded-lg font-semibold">
          <Link href="/" className="text-sm lg:text-base opacity-50 hover:underline hover:opacity-100 transition">
            Home
          </Link>
          <span>/</span>
          <span className="text-base lg:text-xl truncate">Learn</span>
        </nav>

        {/* Target Selection */}
        <div className="flex lg:flex-row flex-col justify-between gap-16">
          {targets.map((target) => (
            <div key={target.slug} className="w-full px-8">
              <Link href={`/learn/${target.slug}`} className="items-center flex flex-col group">
                <div className="relative w-64 h-64 mb-4 overflow-hidden rounded-lg">
                  <Image
                    src={target.image}
                    alt={`${target.name} card`}
                    fill
                    className="object-cover group-hover:scale-125 transition-transform duration-300"
                  />
                </div>
                <div className="bg-primary-600 text-white text-3xl py-6 px-8 rounded-full w-full text-center font-semibold hover:bg-primary-700 transition">
                  {target.name}
                </div>
                <p className="text-center mt-4 text-gray-600 max-w-xs">
                  {target.description}
                </p>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </PageTransition>
  )
}
