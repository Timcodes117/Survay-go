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
    focusFormPageInEditor,
  } = useApp()

  const addPage = useCallback(() => {
    const nextPage = createPage(formPages.length + 1)
    setFormPages((prevPages) => [...prevPages, nextPage])
    focusFormPageInEditor(nextPage.id)
    return nextPage.id
  }, [focusFormPageInEditor, formPages.length, setFormPages])

  const removePage = useCallback(
    (pageId: string) => {
      if (formPages.length <= 1) return

      const removedPage = formPages.find((page) => page.id === pageId)
      const selectionOnRemovedPage = removedPage?.elements.some(
        (element) => element.id === selectedElementId,
      )

      if (selectionOnRemovedPage) {
        setSelectedElementId(null)
      }

      const nextPages = formPages
        .filter((page) => page.id !== pageId)
        .map((page, index) => ({ ...page, order: index + 1 }))

      setFormPages(nextPages)

      if (currentPageId === pageId) {
        const nextId = nextPages[0]?.id ?? null
        if (nextId) {
          focusFormPageInEditor(nextId)
        } else {
          setCurrentPageId(null)
        }
      }
    },
    [
      currentPageId,
      focusFormPageInEditor,
      formPages,
      selectedElementId,
      setCurrentPageId,
      setFormPages,
      setSelectedElementId,
    ],
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
