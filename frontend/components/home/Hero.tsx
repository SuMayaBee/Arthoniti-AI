import { Fuzzy_Bubbles } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import CrownIcon from '@/components/icons/CrownIcon';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ThreeStarIcon from '../icons/ThreeStarIcon';

const fuzzy = Fuzzy_Bubbles({ subsets: ['latin'], weight: ['400', '700'] });
export default function Hero() {
  return (
    <section className="relative mx-auto w-11/12 px-4 sm:px-6 lg:w-10/12 lg:px-8 lg:py-16">
      <div className="mx-auto text-center">
        <Badge
          className="mb-4 h-9 max-w-full overflow-hidden text-ellipsis whitespace-nowrap px-2.5 py-1.5 font-normal text-xs shadow-md shadow-primary-400 sm:h-10 sm:px-3 sm:py-2 sm:text-sm md:text-base lg:text-lg"
          variant="secondary"
        >
          <ThreeStarIcon className="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" />
          Generative Business Intelligence with AI
        </Badge>
        <h1 className="mb-6 font-bold text-4xl text-gray-900 md:text-6xl">
          Launch Your Business with
          <span
            className="ml-4 inline-block bg-clip-text align-baseline text-transparent"
            style={{
              background:
                'linear-gradient(to top right, #a855f7 0%, #8b5cf6 12%, #3b82f6 24%, #06b6d4 36%, #10b981 48%, #22c55e 60%, #fbbf24 72%, #f59e0b 84%, #ff5e3a 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            AI
          </span>
          <br className="hidden sm:block" /> Powered Assets
        </h1>
        <p className="mx-auto mb-8 max-w-3xl text-gray-600 text-xl">
          Launch stunning logos, websites, pitch decks, and more—instantly. AI
          does the heavy lifting so you can focus on growing your brand.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            asChild
            className="rotating-gradient-border p-[2px] sm:inline-flex"
            variant="rainbow"
          >
            <Link className="p-0" href="/signup">
              <span>
                <span className="flex w-full items-center justify-center font-normal text-base">
                  <CrownIcon className="mr-2" size={24} />3 Days Free Trial{' '}
                </span>
              </span>
            </Link>
          </Button>
        </div>
        {/* Side callouts under the primary CTA */}
        <div className="mt-8 flex w-full flex-row items-start justify-between">
          {/* Left: Clean & Minimal UI with arrow */}
          <div className="flex items-center gap-2 text-left">
            <p
              className={`${fuzzy.className} font-bold text-gray-800 leading-tight`}
            >
              Clean & Minimal
              <br />
              User Interface
            </p>
            <Image
              alt="Arrow"
              className="-scale-x-100 mt-2 h-14 w-14"
              height={80}
              src="/images/hero-arrow.png"
              width={120}
            />
          </div>

          {/* Right: Avatars + stat with arrow */}
          <div className="flex items-center gap-2">
            <Image
              alt="Arrow"
              className="mt-2 h-14 w-14"
              height={80}
              src="/images/hero-arrow.png"
              width={120}
            />
            <div className="text-left">
              <div className="-space-x-1 flex overflow-hidden">
                <Image
                  alt=""
                  className="-outline-offset-1 inline-block size-6 rounded-full"
                  height={24}
                  src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  width={24}
                />
                <Image
                  alt=""
                  className="-outline-offset-1 inline-block size-6 rounded-full"
                  height={24}
                  src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  width={24}
                />
                <Image
                  alt=""
                  className="-outline-offset-1 inline-block size-6 rounded-full"
                  height={24}
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
                  width={24}
                />
                <Image
                  alt=""
                  className="-outline-offset-1 inline-block size-6 rounded-full"
                  height={24}
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  width={24}
                />
              </div>

              <p className={'mt-3 text-gray-800 text-lg leading-tight'}>
                <span className="text-purple-600">10K Founders</span> <br />
                Use Our Product
              </p>
            </div>
          </div>
        </div>
        {/* Hero video */}
        <div className="mt-5 flex w-full justify-center px-2 sm:px-0 md:mt-0">
          <div className="w-full overflow-hidden rounded-2xl border-[2px] border-primary-600 shadow-neon-purple md:mx-[12rem]">
            <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
              <iframe
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute top-0 left-0 h-full w-full"
                frameBorder="0"
                src="https://www.youtube.com/embed/M5N3xHgjVNg"
                title="Product Demo"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
