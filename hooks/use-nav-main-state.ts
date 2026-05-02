import type { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useEffect, useMemo, useState } from "react";
import type { FormPage } from "@/lib/types";

type SetFormPages = (
  updater: ((prevPages: FormPage[]) => FormPage[]) | FormPage[],
) => void;

export function useNavMainState(
  formPages: FormPage[],
  setFormPages: SetFormPages,
) {
  const [openPages, setOpenPages] = useState<Record<string, boolean>>({});

  const sortedPages = useMemo(() => {
    return [...formPages].sort((a, b) => a.order - b.order);
  }, [formPages]);

  useEffect(() => {
    setOpenPages((prev) => {
      const next: Record<string, boolean> = {};
      for (const page of sortedPages) {
        next[page.id] = prev[page.id] ?? true;
      }
      return next;
    });
  }, [sortedPages]);

  const togglePage = (pageId: string) => {
    setOpenPages((prev) => ({
      ...prev,
      [pageId]: !prev[pageId],
    }));
  };

  const handlePageAliasChange = (pageId: string, newAlias: string) => {
    setFormPages((prevPages) =>
      prevPages.map((page) =>
        page.id === pageId ? { ...page, alias: newAlias } : page,
      ),
    );
  };

  const handleElementAliasChange = (
    pageId: string,
    elementId: string,
    newAlias: string,
  ) => {
    setFormPages((prevPages) =>
      prevPages.map((page) =>
        page.id === pageId
          ? {
              ...page,
              elements: page.elements.map((element) =>
                element.id === elementId
                  ? { ...element, alias: newAlias }
                  : element,
              ),
            }
          : page,
      ),
    );
  };

  const handlePageDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    if (
      typeof active.id !== "string" ||
      typeof over.id !== "string" ||
      !active.id.startsWith("page-") ||
      !over.id.startsWith("page-")
    ) {
      return;
    }

    setFormPages((prevPages) => {
      const pagesByOrder = [...prevPages].sort((a, b) => a.order - b.order);
      const oldIndex = pagesByOrder.findIndex((page) => page.id === active.id);
      const newIndex = pagesByOrder.findIndex((page) => page.id === over.id);
      if (oldIndex < 0 || newIndex < 0) return prevPages;

      return arrayMove(pagesByOrder, oldIndex, newIndex).map((page, index) => ({
        ...page,
        order: index + 1,
      }));
    });
  };

  const handleElementDragEnd =
    (pageId: string) =>
    ({ active, over }: DragEndEvent) => {
      if (!over || active.id === over.id) return;
      if (
        typeof active.id !== "string" ||
        typeof over.id !== "string" ||
        !active.id.startsWith("el-") ||
        !over.id.startsWith("el-")
      ) {
        return;
      }

      setFormPages((prevPages) =>
        prevPages.map((page) => {
          if (page.id !== pageId) return page;
          const elementsByOrder = [...page.elements].sort(
            (a, b) => a.order - b.order,
          );
          const oldIndex = elementsByOrder.findIndex(
            (element) => element.id === active.id,
          );
          const newIndex = elementsByOrder.findIndex(
            (element) => element.id === over.id,
          );
          if (oldIndex < 0 || newIndex < 0) return page;

          return {
            ...page,
            elements: arrayMove(elementsByOrder, oldIndex, newIndex).map(
              (element, index) => ({
                ...element,
                order: index + 1,
              }),
            ),
          };
        }),
      );
    };

  return {
    sortedPages,
    openPages,
    togglePage,
    handlePageAliasChange,
    handleElementAliasChange,
    handlePageDragEnd,
    handleElementDragEnd,
  };
}
