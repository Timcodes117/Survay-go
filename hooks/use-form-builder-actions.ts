import { useCallback } from "react"
import { useApp } from "@/contexts/app"
import { createField, createPage, type AddableFieldType } from "@/lib/form/factories"

export function useFormBuilderActions() {
  const {
    formPages,
    currentPageId,
    selectedElementId,
    setFormPages,
    setCurrentPageId,
    setSelectedElementId,
    setRightPanelTab,
  } = useApp()

  const addPage = useCallback(() => {
    const nextPage = createPage(formPages.length + 1)
    setFormPages((prevPages) => [...prevPages, nextPage])
    setCurrentPageId(nextPage.id)
    return nextPage.id
  }, [formPages.length, setCurrentPageId, setFormPages])

  const removePage = useCallback(
    (pageId: string) => {
      if (formPages.length <= 1) return

      const nextPages = formPages
        .filter((page) => page.id !== pageId)
        .map((page, index) => ({ ...page, order: index + 1 }))

      setFormPages(nextPages)

      if (currentPageId === pageId) {
        setCurrentPageId(nextPages[0]?.id ?? null)
      }
    },
    [currentPageId, formPages, setCurrentPageId, setFormPages],
  )

  const addElementToPage = useCallback(
    (pageId: string, type: AddableFieldType = "text") => {
      let nextElementId: string | null = null

      setFormPages((prevPages) =>
        prevPages.map((page) => {
          if (page.id !== pageId) return page
          const nextElement = createField(type, page.elements.length + 1)
          nextElementId = nextElement.id
          return {
            ...page,
            elements: [...page.elements, nextElement],
          }
        }),
      )

      if (nextElementId) {
        setSelectedElementId(nextElementId)
        setRightPanelTab("properties")
      }
    },
    [setFormPages, setRightPanelTab, setSelectedElementId],
  )

  const addElementToCurrentPage = useCallback(
    (type: AddableFieldType) => {
      const targetPageId = currentPageId ?? formPages[0]?.id ?? addPage()
      if (!targetPageId) return

      if (!formPages.some((page) => page.id === targetPageId)) {
        setCurrentPageId(targetPageId)
      }

      addElementToPage(targetPageId, type)
    },
    [addElementToPage, addPage, currentPageId, formPages, setCurrentPageId],
  )

  const removeElementFromPage = useCallback(
    (pageId: string, elementId: string) => {
      setFormPages((prevPages) =>
        prevPages.map((page) => {
          if (page.id !== pageId) return page
          const nextElements = page.elements
            .filter((element) => element.id !== elementId)
            .map((element, index) => ({ ...element, order: index + 1 }))
          return {
            ...page,
            elements: nextElements,
          }
        }),
      )

      if (selectedElementId === elementId) {
        setSelectedElementId(null)
      }
    },
    [selectedElementId, setFormPages, setSelectedElementId],
  )

  return {
    addPage,
    removePage,
    addElementToPage,
    addElementToCurrentPage,
    removeElementFromPage,
  }
}
