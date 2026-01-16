"use client"

import * as React from "react"
import { type ComponentType, useEffect, useMemo, useState } from "react"
import { ChevronRight, Plus } from "lucide-react"
import { useApp } from "@/contexts/app"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar"
import { Button } from "./ui/button"
import { IconTrash } from "@tabler/icons-react"
import { Input } from "./ui/input"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: ComponentType<any>
    isActive?: boolean
  }[]
}) {
  const { formPages, setFormPages } = useApp()
  const [openPages, setOpenPages] = useState<Record<string, boolean>>({})

  const sortedPages = useMemo(() => {
    return [...formPages].sort((a, b) => a.order - b.order)
  }, [formPages])

  // Expand all pages by default so elements are visible
  useEffect(() => {
    setOpenPages(Object.fromEntries(sortedPages.map((p) => [p.id, true])))
  }, [sortedPages])

  // Handler to update page alias
  const handlePageAliasChange = (pageId: string, newAlias: string) => {
    setFormPages((prevPages) =>
      prevPages.map((page) =>
        page.id === pageId ? { ...page, alias: newAlias } : page
      )
    )
  }

  // Handler to update element label
  const handleElementLabelChange = (pageId: string, elementId: string, newLabel: string) => {
    setFormPages((prevPages) =>
      prevPages.map((page) =>
        page.id === pageId
          ? {
              ...page,
              elements: page.elements.map((element) =>
                element.id === elementId ? { ...element, label: newLabel } : element
              )
            }
          : page
      )
    )
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild tooltip={item.title}>
              <a href={item.url}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
        {sortedPages.length > 0 && (
          <>
            <div className="flex items-center justify-between mr-3">
            <SidebarGroupLabel>Pages</SidebarGroupLabel>
            <Button variant={"ghost"} size={"icon"}><Plus size={16} /></Button>
            </div>
            {sortedPages.map((page) => (
              <SidebarMenuItem key={page.id}>
            <div className="flex items-center justify-between mr-3">
                
                <SidebarMenuButton
                  onClick={() =>
                    setOpenPages((prev) => ({ ...prev, [page.id]: !prev[page.id] }))
                  }
                  data-state={openPages[page.id] ? "open" : "closed"}
                >
                  <ChevronRight
                    className={`transition-transform duration-200 ${openPages[page.id] ? "rotate-90" : "rotate-0"}`}
                  />
                  {/* <span>{page.alias}</span> */}
                  <Input 
                    className=" w-full text-xs !bg-transparent !border-none !ring-0 focus:!bg-muted-foreground/5 rounded-xl" 
                    value={page.alias} 
                    onChange={(e) => handlePageAliasChange(page.id, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.currentTarget.blur()
                      }
                    }}
                    onBlur={(e) => {
                      if (!e.target.value.trim()) {
                        // Prevent empty values, use fallback if empty
                        const fallbackAlias = `Page ${sortedPages.findIndex(p => p.id === page.id) + 1}`
                        handlePageAliasChange(page.id, fallbackAlias)
                      }
                    }}
                  /> 
                  
                </SidebarMenuButton>
                <Button variant={"ghost"} size={"icon"} className="opacity-0 group-hover:opacity-50 transition-opacity"><Plus size={16} /></Button>
                {page.order > 1 && <Button variant={"ghost"} size={"icon"} className="opacity-0 group-hover:opacity-50 transition-opacity"><IconTrash size={16} /></Button>}
            </div>
                {openPages[page.id] && (
                  <SidebarMenuSub>
                    {page.elements.map((el) => (
                      <SidebarMenuSubItem key={el.id}>
            <div className="flex items-center justify-between">

                        <SidebarMenuSubButton className="!px-0">
                          {/* <span className="text-xs max-w-[150px] truncate">{el.label ?? el.alias} ({el.type})</span> */}
                          <Input
                            className=" w-full text-xs border-none !bg-transparent !ring-0 focus:!bg-muted-foreground/5 rounded-xl" 
                            value={el.label ?? el.alias} 
                            onChange={(e) => handleElementLabelChange(page.id, el.id, e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.currentTarget.blur()
                              }
                            }}
                            onBlur={(e) => {
                              if (!e.target.value.trim()) {
                                // Prevent empty values, use element alias as fallback
                                const fallbackLabel = el.alias || 'Untitled Field'
                                handleElementLabelChange(page.id, el.id, fallbackLabel)
                              }
                            }}
                          /> 
                        </SidebarMenuSubButton>
                        <Button variant={"ghost"} size={"icon"} className="opacity-0 group-hover:opacity-50 transition-opacity"><IconTrash size={16} /></Button>
            </div>
                      </SidebarMenuSubItem>
                    ))}
                    {page.elements.length === 0 && (
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton aria-disabled>
                          <span>Empty page</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    )}
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>
            ))}
          </>
        )}
      </SidebarMenu>
    </SidebarGroup>
  )
}
