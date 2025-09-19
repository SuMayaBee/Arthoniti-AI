'use client';

import clsx from 'clsx';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQ_ITEMS = [
  {
    q: 'What is Hyperscaler and how does it work?',
    a: 'Hyperscaler is a suite of AI tools that help you create brand assets like logos, websites, pitch decks and more. Pick a tool, provide a few inputs and our AI generates high‑quality content for you in seconds.',
  },
  {
    q: 'Can I customize the AI‑generated content?',
    a: 'Absolutely. You can refine prompts, adjust styles and make manual edits. Our editors will let you tweak colors, fonts, images and copy until it’s perfect.',
  },
  {
    q: 'How accurate and reliable are the contents?',
    a: 'We combine curated templates with AI to produce consistent, on‑brand results. You stay in control and can iterate quickly with previews and history.',
  },
  {
    q: 'Do I need technical skills to use Hyperscaler?',
    a: 'No. Everything is built for non‑technical users—Clear instructuions, simple inputs, and helpful defaults. Premium users can still fine‑tune deeply if they want.',
  },
];

export default function FAQ({ className }: { className?: string }) {
  return (
    <section className={clsx('container mx-auto px-4 md:px-8', className)}>
      <h2 className="mb-6 text-center font-medium text-4xl text-foreground tracking-tight md:mb-8 md:text-6xl">
        Your Questions Answered!
      </h2>

      <Accordion className="w-full space-y-4" collapsible type="single">
        {FAQ_ITEMS.map((item) => (
          <AccordionItem
            className="rounded-2xl border-0 bg-white"
            key={item.q}
            value={item.q}
          >
            <div className="overflow-hidden rounded-2xl border-primary-100 border-b">
              <AccordionTrigger className="px-4 py-4 text-left no-underline hover:no-underline [&>svg]:h-8 [&>svg]:w-8 [&>svg]:rounded-full [&>svg]:bg-primary-300 [&>svg]:p-2 [&>svg]:text-primary-700">
                <div className="font-normal text-foreground text-lg">
                  {item.q}
                </div>
              </AccordionTrigger>
            </div>
            <AccordionContent className="px-4 py-4 text-muted-foreground">
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
