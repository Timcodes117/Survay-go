"use client"
import React from 'react'
import Link from 'next/link'
import { Button } from '../ui/button'
import { Cog, Users, Edit2 } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'

const tabDefs = [
  { key: 'editor', label: 'Editor', Icon: Edit2, segment: 'editor' },
  { key: 'responses', label: 'Responses', Icon: Users, segment: 'responses' },
  { key: 'settings', label: 'Settings', Icon: Cog, segment: 'settings' },
]

function Tabs() {
  const router = useRouter()
  const pathname = usePathname()
  const activeTab = tabDefs.find((tab) => pathname.endsWith(`/${tab.segment}`))?.key ?? 'editor'
  const basePath = pathname.replace(/\/(editor|responses|settings)\/?$/, '')

  React.useEffect(() => {
    for (const tab of tabDefs) {
      if (tab.key === activeTab) continue
      router.prefetch(`${basePath}/${tab.segment}`)
    }
  }, [activeTab, basePath, router])

  return (
    <div className='w-full h-fit flex gap-2  items-center justify-center'>
      {tabDefs.map(({ key, label, Icon, segment }) => (
        <div key={key} className='relative'>
          <AnimatePresence initial={false}>
            {activeTab === key && (
              <motion.div
                layoutId='active-tab-bg'
                className='absolute inset-0 rounded-md bg-secondary/80'
                transition={{ type: 'spring', stiffness: 500, damping: 40, mass: 0.6 }}
              />
            )}
          </AnimatePresence>
          <Button
            asChild
            variant={'secondary'}
            className={`text-sm  !font-normal !bg-transparent relative px-4 ${activeTab === key ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <Link href={`${basePath}/${segment}`} scroll={false} prefetch>
              <span className='relative z-10 flex items-center gap-1'>
                <Icon />
                <AnimatePresence initial={false}>
                  {activeTab === key && (
                    <motion.span
                      key='label'
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 'auto', opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className='overflow-hidden'
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
            </Link>
          </Button>
        </div>
      ))}
    </div>
  )
}

export default Tabs