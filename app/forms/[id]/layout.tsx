import React from 'react'
import Link from 'next/link'

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
        <header>
            <h1>Form</h1>
            <nav>
                <ul>
                    <li><Link href="/forms">Forms</Link></li>
                    <li><Link href="/forms/new">New Form</Link></li>
                </ul>
            </nav>
        </header>
        {children}
    </div>
  )
}

export default layout