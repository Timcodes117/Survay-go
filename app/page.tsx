"use client"
import { useTheme } from 'next-themes'
import Link from 'next/link'
import React from 'react'

const page = () => {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const isDarkMode = mounted ? resolvedTheme === "dark" : false
  return (
    <main>
      <br />
      <header className='flex items-center justify-between w-full max-w-7xl mx-auto mt-5'>
      {isDarkMode ? <img src="/logo-white.svg" alt="logo" className='  ' width={200} /> : <img src="/logo.svg" alt="logo" className='  ' width={200} />}


        <nav>
          <ul className='flex items-center gap-6'>
            <Link href="/">Home</Link>
            <Link href="/">About</Link>
            <Link href="/">Docs</Link>
            <Link href="/">Contact</Link>
            <Link href="/" className='bg-[var(--foreground)] text-[var(--background)] px-4 py-2 rounded-full'>Try now</Link>
          </ul>
        </nav>
      </header>
      {/* <br /> */}
      <section className='flex flex-col items-center justify-end mt-20 w-full max-w-7xl mx-auto'>
       {isDarkMode ? <img src="/logo-white.svg" alt="logo" className='  ' width={500} /> : <img src="/logo.svg" alt="logo" className='  ' width={500} />}
        <p className='text-sm max-w-[700px] mt-2 pl-[18%]'>An AI powered forms editor for generating and automating 
        survay tasks. Create, customize, and publish dynamic forms with an intuitive visual editor and AI assistance.</p>
        <br />
        <div className='w-full flex flex-row items-center justify-start gap-4  max-w-[500px] pl-[10%]'>
          <Link href="/dashboard/new" target='_blank' className='bg-[var(--foreground)] text-[var(--background)] px-4 py-1 rounded-full'>Try now</Link>
          <Link href="/" >Learn more</Link>        
          </div>
          <br />
          <br />
          <img src="/dashboard.png" alt="hero" className='w-fit h-[350px] object-contain shadow-2xl' />
      </section>
    </main>
  )
}

export default page