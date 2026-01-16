"use client"
import React from 'react'
import { Button } from '../ui/button'
import { Cog, Users, Edit2 } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'

const tabDefs = [
  { key: 'editor', label: 'Editor', Icon: Edit2 },
  { key: 'responses', label: 'Responses', Icon: Users },
  { key: 'settings', label: 'Settings', Icon: Cog },
]

function Tabs() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const active = searchParams.get('tab') ?? 'editor'

  const setTab = (key: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('tab', key)
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <div className='w-full h-fit flex gap-2  items-center justify-center'>
      {tabDefs.map(({ key, label, Icon }) => (
        <div key={key} className='relative'>
          <AnimatePresence initial={false}>
            {active === key && (
              <motion.div
                layoutId='active-tab-bg'
                className='absolute inset-0 rounded-md bg-secondary/80'
                transition={{ type: 'spring', stiffness: 500, damping: 40, mass: 0.6 }}
              />
            )}
          </AnimatePresence>
          <Button
            variant={'secondary'}
            className={`text-sm  !font-normal !bg-transparent relative px-4 ${active === key ? 'text-primary' : 'text-muted-foreground'}`}
            onClick={() => setTab(key)}
          >
            <span className='relative z-10 flex items-center gap-1'>
              <Icon />
              <AnimatePresence initial={false}>
                {active === key && (
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
          </Button>
        </div>
      ))}
    </div>
  )
}

export default Tabs