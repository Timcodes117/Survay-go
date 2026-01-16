"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex items-center space-x-2">
      <Select value={theme} onValueChange={setTheme}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Select theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">
            <div className="flex items-center space-x-2">
              <Sun className="h-4 w-4" />
              <span>Light</span>
            </div>
          </SelectItem>
          <SelectItem value="dark">
            <div className="flex items-center space-x-2">
              <Moon className="h-4 w-4" />
              <span>Dark</span>
            </div>
          </SelectItem>
          <SelectItem value="system">
            <div className="flex items-center space-x-2">
              <Monitor className="h-4 w-4" />
              <span>System</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

export function ThemeToggleButtons() {
  const { theme, setTheme } = useTheme()
  const [showModes, setShowModes] = React.useState<boolean>(false)

  return (
    <div className="flex items-center w-fit pr-4 " 
    onMouseEnter={()=>setShowModes(true)}
    onMouseLeave={()=>setShowModes(false)}>
      { showModes && <>
      <Button
        className="rounded-full"
        variant={theme === "light" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => setTheme("light")}
      >
        <Sun className="h-2 w-2" />
      </Button>
      <Button
        className="rounded-full"
        variant={theme === "dark" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => setTheme("dark")}
        >
        <Moon className="h-2 w-2" />
      </Button>
      <Button
        className="rounded-full"
        variant={theme === "system" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => setTheme("system")}
        >
        <Monitor className="h-2 w-2" />
      </Button>
        </>}

     { !showModes && <Button
        className="rounded-full font-medium flex items-center text-sm py-2 capitalize "
        variant={"secondary"}
        size="sm"
      >
        { theme === "light" ? <Sun className="h-2 w-2 mr-1" /> : theme === "dark" ? <Moon className="h-2 w-2 mr-1" />:  <Monitor className="h-2 w-2 mr-1" />}
        { theme === "light" ? "light" : theme === "dark" ? "dark" : "adaptive"}
      </Button>}


    </div>
  )
}
