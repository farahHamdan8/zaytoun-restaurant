import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { milestones, chef } from '../data/storyData';

export default function StorySection() {
  const { t, language } = useLanguage();

  return (
    <section id="story" className="border-t border-white/5 px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-xl text-center">
          <span className="text-xs tracking-wide text-gold">{t('story.eyebrow')}</span>
          <h2 className="mt-3 font-display text-4xl text-zinc-50 sm:text-5xl">{t('story.title')}</h2>
          <p className="mt-3 text-zinc-400">{t('story.subtitle')}</p>
        </div>

        {/* Milestones grid */}
        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {milestones.map((milestone, index) => (
            <motion.div
              key={milestone.year}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="rounded-2xl border border-white/10 bg-zinc-900/50 p-5"
            >
              <span className="font-display text-3xl text-gold">{milestone.year}</span>
              <h3 className="mt-2 text-base font-semibold text-zinc-100">{milestone.title[language]}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{milestone.description[language]}</p>
            </motion.div>
          ))}
        </div>

        {/* Chef bio */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="mt-14 grid grid-cols-1 overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/50 sm:grid-cols-2"
        >
          <div className="aspect-[4/3] sm:aspect-auto">
            <img src={chef.image} alt={chef.name[language]} className="h-full w-full object-cover" />
          </div>
          <div className="flex flex-col justify-center p-7 sm:p-10">
            <span className="text-xs tracking-wide text-gold">{t('story.chefEyebrow')}</span>
            <h3 className="mt-3 font-display text-3xl text-zinc-50">{chef.name[language]}</h3>
            <p className="mt-1 text-sm text-zinc-500">{chef.role[language]}</p>
            <p className="mt-5 font-display text-xl italic leading-relaxed text-zinc-300">{chef.quote[language]}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
