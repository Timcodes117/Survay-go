import React from "react"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen">
    <div className="w-[100px] h-full bg-[#19161d]" >
        {/* <marquee behavior="scroll" direction="left">survay go</marquee> */}
        </div>
      <div className="w-[35%] h-full bg-[url(/lines.jpg)] bg-contain bg-center bg-repeat-y flex items-center justify-center relative">
      {/* <p className="text-black text-8xl !font-[Megrim] z-20 font-bold absolute top-10 p-20 left-10">Need Smart<br />Forms?</p> */}
       
      </div>
      <div className="flex-1 h-full flex flex-col bg-white">
        <div className="flex-1 overflow-y-auto flex flex-col justify-center items-center p-8">
          {children}
        </div>
      </div>
    </div>
  )
}