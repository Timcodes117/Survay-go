import React from "react"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen">
      <div className="w-[45%] h-full bg-black flex items-center justify-center relative">
      <p className="text-white text-8xl !font-[Megrim] z-20 font-bold absolute top-10 p-20 left-10">Need Smart<br />Forms?</p>
        <img
          src="/hbg.jpg"
          alt="Auth page visual"
          className="object-contain object-bottom scale-70 w-full h-full"
        />
      </div>
      <div className="flex-1 h-full flex flex-col">
        <div className="flex-1 overflow-y-auto flex flex-col justify-center items-center p-8">
          {children}
        </div>
      </div>
    </div>
  )
}