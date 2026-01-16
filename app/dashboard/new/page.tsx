"use client"
import { TypographyH1, TypographyP } from "@/components/ui/typography"
import { ScrollArea } from "@/components/ui/scroll-area"
import FloatingToolBar from "@/components/tools/toolbar"
import Tabs from "@/components/form/tabs"
import { IconZoomIn, IconZoomOut } from "@tabler/icons-react"
import { File, Fullscreen, ZoomIn } from "lucide-react"
import { Select } from "@/components/ui/select"
import { SelectTrigger } from "@/components/ui/select"
import { SelectValue } from "@/components/ui/select"
import { SelectContent } from "@/components/ui/select"
import { SelectItem } from "@/components/ui/select"
import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from "react-zoom-pan-pinch"
import { useApp } from "@/contexts/app"
import { useRef, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import page from "@/app/page"
import EditableElementContainer from "@/components/editable/container"
import { Input } from "@/components/ui/input"

export default function NewPage() {
  const { zoom, setZoom, resetZoom, formPages, currentPageId, setCurrentPageId, cursorMode } = useApp()
  const transformRef = useRef<ReactZoomPanPinchRef>(null)
  const [currentZoom, setCurrentZoom] = useState(zoom)
  const pageRefs = useRef<Record<string, HTMLElement | null>>({})
  const visibilityRatiosRef = useRef<Record<string, number>>({})
  const searchParams = useSearchParams()
  const tab = searchParams.get("tab") ?? "editor"

  // Sync local zoom state with context zoom when it changes (e.g., from trackpad)
  useEffect(() => {
    setCurrentZoom(zoom)
  }, [zoom])

  // Get the closest predefined zoom value for display
  const getClosestZoomValue = (currentZoom: number) => {
    const predefinedValues = [25, 50, 75, 100, 125, 150, 200, 300]
    const currentPercent = Math.round(currentZoom * 100)
    
    // Find the closest predefined value
    const closest = predefinedValues.reduce((prev, curr) => 
      Math.abs(curr - currentPercent) < Math.abs(prev - currentPercent) ? curr : prev
    )
    
    return closest.toString()
  }

  const handleZoomChange = (value: string) => {
    const newZoom = parseInt(value) / 100
    setCurrentZoom(newZoom)
    setZoom(newZoom)
    if (transformRef.current && transformRef.current.state) {
      const currentState = transformRef.current.state
      transformRef.current.setTransform(currentState.positionX, currentState.positionY, newZoom)
    }
  }

  const handleResetZoom = () => {
    setCurrentZoom(1.0)
    setZoom(1.0)
    if (transformRef.current) {
      transformRef.current.resetTransform()
    }
  }

  // Observe which page is currently in view (>= 60% visible), pick the highest ratio
  // Only run when editor tab is active AND elements are mounted
  useEffect(() => {
    if (!formPages?.length || tab !== "editor") {
      return
    }

    // Wait for elements to be mounted after AnimatePresence
    const setupObserver = () => {
      const thresholds = Array.from({ length: 21 }, (_, i) => i / 20) // 0.00 .. 1.00 in 0.05 steps
      const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).dataset.pageId
          if (!id) continue
          visibilityRatiosRef.current[id] = entry.intersectionRatio
        }

        let bestId: string | null = null
        let bestRatio = 0
        for (const id of Object.keys(visibilityRatiosRef.current)) {
          const ratio = visibilityRatiosRef.current[id] ?? 0
          if (ratio >= 0.6 && ratio >= bestRatio) {
            bestRatio = ratio
            bestId = id
          }
        }

        // If nothing meets 60%, still pick the highest, so there's always a current page
        if (!bestId) {
          for (const id of Object.keys(visibilityRatiosRef.current)) {
            const ratio = visibilityRatiosRef.current[id] ?? 0
            if (ratio >= bestRatio) {
              bestRatio = ratio
              bestId = id
            }
          }
        }

        if (bestId) {
          setCurrentPageId(bestId)
        }
      }, { threshold: thresholds })

      // Find elements in DOM
      formPages.forEach((p) => {
        const el = document.querySelector(`[data-page-id="${p.id}"]`) as HTMLElement
        if (el) observer.observe(el)
      })

      return observer
    }

    // Delay to ensure AnimatePresence has mounted the elements
    let observer: IntersectionObserver | null = null
    const timeoutId = setTimeout(() => {
      observer = setupObserver()
    }, 200)

    return () => {
      clearTimeout(timeoutId)
      if (observer) observer.disconnect()
      visibilityRatiosRef.current = {}
    }
  }, [formPages, setCurrentPageId, tab])

  return (
    <div className="flex flex-1 flex-col w-full relative overflow-hidden">
      <Tabs />

      <AnimatePresence mode="wait">
        {tab === "editor" && (
          <motion.div
            key="tab-editor"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="contents"
          >
          <div className="w-full flex-1 " style={{ minHeight: '100%' }}>
            <div className="w-full h-full">
              <TransformWrapper
                ref={transformRef}
                initialScale={currentZoom}
                minScale={0.1}
                maxScale={5}
                centerOnInit={false}
                wheel={{ step: 0.1 }}
                doubleClick={{ disabled: false, step: 0.7 }}
                panning={{disabled: cursorMode !== 'pan'}}
                onZoom={(ref) => {
                  setCurrentZoom(ref.state.scale)
                  setZoom(ref.state.scale)
                }}
                onInit={(ref) => {
                  // Ensure the ref is properly initialized
                  transformRef.current = ref
                }}
              >
                <TransformComponent
                  wrapperClass="!w-full h-full"
                  contentClass="!w-full h-full flex flex-col items-center gap-20"
                  wrapperStyle={{ width: '100%', height: '100%' }}
                >
                 <div className="w-full h-[50px]"></div>
              {/* below is the page screens */}
           {formPages.map((page) => (
             <div 
               key={page.id}
               ref={(el) => { pageRefs.current[page.id] = el }}
               data-page-id={page.id}
               onPointerDown={(e: React.PointerEvent) => cursorMode !== 'pan' && e.stopPropagation()}
            onMouseDown={(e: React.MouseEvent) => cursorMode !== 'pan' && e.stopPropagation()}
               className="space-y-6 w-full max-w-[595px] min-h-[842px] mb-10 bg-background border-[0.5px] mx-auto p-8 shadow-2xl relative" 
             >
              <div className="px-3 py-1 bg-gray-400/20 absolute -top-8 left-0 rounded-md w-fit text-xs text-muted-foreground flex flex-row items-center gap-1">
               <File className="size-3" />
               <p className="text-muted-foreground truncate max-w-[400px]">
                 Page {page.order} of {formPages.length}{currentPageId === page.id ? " (current)" : ""} • {page.alias}
               </p>
              </div>
               {/* Content goes here for page.alias / page.order */}
               {page.elements.map((element, index) => (
                <EditableElementContainer key={element.id} element={element} />
               ))}
             </div>))}

              </TransformComponent>
              </TransformWrapper>
            </div>
          </div>

          {/* floating toolbar */}
          <FloatingToolBar />

          {/* zoom bar */}
          <div className="absolute top-5 right-10 w-fit !h-[35px] rounded-2xl shadow-md border-[0.5px] backdrop-blur-lg bg-white/10">
           <div className="flex items-center justify-between w-full h-full">
             <button 
               onClick={handleResetZoom}
               className="flex items-center justify-center w-10 h-10 rounded-full text-foreground hover:bg-white/10 transition-colors"
             >
               <Fullscreen size={18} />
             </button>
             <div className="h-4 w-px bg-sidebar-border" />
             <div className="flex items-center justify-center w-8 h-10 rounded-full text-foreground">
               <ZoomIn size={18} />
             </div>

             <Select 
               value={getClosestZoomValue(currentZoom)} 
               onValueChange={handleZoomChange}
             >
               <SelectTrigger className="w-[80px] !text-xs h-10 rounded-full !border-none !bg-transparent !shadow-none">
                 <SelectValue placeholder="Zoom" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="25">25%</SelectItem>
                 <SelectItem value="50">50%</SelectItem>
                 <SelectItem value="75">75%</SelectItem>
                 <SelectItem value="100">100%</SelectItem>
                 <SelectItem value="125">125%</SelectItem>
                 <SelectItem value="150">150%</SelectItem>
                 <SelectItem value="200">200%</SelectItem>
                 <SelectItem value="300">300%</SelectItem>
               </SelectContent>
             </Select>
           </div>
          </div>
          </motion.div>
        )}

        {tab === "responses" && (
          <motion.div
            key="tab-responses"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="w-full max-w-[900px] mx-auto p-6 min-h-full flex flex-1 "
          >
            {/* Responses UI */}
          </motion.div>
        )}

        {tab === "settings" && (
          <motion.div
            key="tab-settings"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="w-full max-w-[900px] mx-auto p-6 min-h-full flex flex-1 "
          >
            {/* Settings UI */}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
