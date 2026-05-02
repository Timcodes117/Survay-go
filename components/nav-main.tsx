"use client";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useDndContext,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IconTrash } from "@tabler/icons-react";
import { ChevronRight, GripVertical, Plus } from "lucide-react";
import * as React from "react";
import { useEffect, useState } from "react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useApp } from "@/contexts/app";
import { useNavMainState } from "@/hooks/use-nav-main-state";
import type { FormField, FormPage } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

function InlineEditableText({
  value,
  fallbackValue,
  className,
  displayClassName,
  onCommit,
}: {
  value: string;
  fallbackValue: string;
  className?: string;
  displayClassName?: string;
  onCommit: (nextValue: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEditing) {
      setDraft(value);
    }
  }, [isEditing, value]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const commit = () => {
    const trimmed = draft.trim();
    onCommit(trimmed || fallbackValue);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      // biome-ignore lint/a11y/useKeyWithClickEvents: double click starts inline edit in this controlled sidebar row.
      // biome-ignore lint/a11y/noStaticElementInteractions: this element intentionally triggers inline edit mode.
      <span
        className={displayClassName ?? "block max-w-full truncate"}
        onClick={(e) => e.stopPropagation()}
        onDoubleClick={(e) => {
          e.stopPropagation();
          setIsEditing(true);
        }}
      >
        {value}
      </span>
    );
  }

  return (
    <Input
      ref={inputRef}
      className={className}
      value={draft}
      onClick={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
      onChange={(e) => setDraft(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          commit();
        }
        if (e.key === "Escape") {
          e.preventDefault();
          setDraft(value);
          setIsEditing(false);
        }
      }}
      onBlur={commit}
    />
  );
}

function SortablePageItem({
  page,
  pageIndex,
  isOpen,
  onToggleOpen,
  onAliasChange,
  showDelete,
  children,
}: {
  page: FormPage;
  pageIndex: number;
  isOpen: boolean;
  onToggleOpen: () => void;
  onAliasChange: (nextAlias: string) => void;
  showDelete: boolean;
  children?: React.ReactNode;
}) {
  const { active, over } = useDndContext();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: page.id,
  });
  const isDropTarget = Boolean(
    over && active && over.id === page.id && active.id !== page.id,
  );
  const isPageDrag =
    typeof active?.id === "string" && active.id.startsWith("page-");
  const isOverMidpoint =
    isDropTarget &&
    over?.rect &&
    (active?.rect.current.translated?.top ?? over.rect.top) +
      (active?.rect.current.translated?.height ?? over.rect.height) / 2 >
      over.rect.top + over.rect.height / 2;

  return (
    <SidebarMenuItem className="relative">
      <div
        ref={setNodeRef}
        style={{ transform: CSS.Transform.toString(transform), transition }}
        className={cn(
          "relative group flex items-center justify-between gap-1 pr-2 min-w-0 overflow-hidden rounded-md",
          isDragging && "opacity-50",
          isDropTarget && isPageDrag && "bg-primary/10",
        )}
      >
        {isDropTarget && isPageDrag && !isOverMidpoint && (
          <span className="pointer-events-none absolute inset-x-2 top-0 z-10 h-0.5 rounded bg-primary" />
        )}
        {isDropTarget && isPageDrag && isOverMidpoint && (
          <span className="pointer-events-none absolute inset-x-2 bottom-0 z-10 h-0.5 rounded bg-primary" />
        )}
        <SidebarMenuButton
          className="min-w-0 flex-1"
          onClick={onToggleOpen}
          data-state={isOpen ? "open" : "closed"}
        >
          <button
            type="button"
            {...attributes}
            {...listeners}
            onClick={(e) => e.stopPropagation()}
            title="Drag to reorder page"
            className="mr-1 inline-flex h-5 w-5 items-center justify-center rounded border border-border/60 bg-muted/50 text-foreground/80 shadow-sm touch-none cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-70 focus-visible:opacity-100 transition-opacity"
          >
            <GripVertical size={14} />
          </button>
          <ChevronRight
            className={`transition-transform duration-200 ${isOpen ? "rotate-90" : "rotate-0"}`}
          />
          <InlineEditableText
            className="w-full truncate text-xs !bg-transparent !border-none !ring-0 focus:!bg-muted-foreground/5 rounded-xl px-2"
            displayClassName="block w-full truncate text-xs px-2 rounded-xl"
            value={page.alias}
            fallbackValue={`Page ${pageIndex + 1}`}
            onCommit={onAliasChange}
          />
        </SidebarMenuButton>
        <Button
          variant={"ghost"}
          size={"icon"}
          className="shrink-0 opacity-0 group-hover:opacity-50 transition-opacity"
        >
          <Plus size={16} />
        </Button>
        {showDelete && (
          <Button
            variant={"ghost"}
            size={"icon"}
            className="shrink-0 opacity-0 group-hover:opacity-50 transition-opacity"
          >
            <IconTrash size={16} />
          </Button>
        )}
      </div>
      {children}
    </SidebarMenuItem>
  );
}

function SortableElementItem({
  pageId,
  element,
  onAliasChange,
}: {
  pageId: string;
  element: FormField;
  onAliasChange: (nextAlias: string) => void;
}) {
  const { active, over } = useDndContext();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: element.id,
  });
  const isDropTarget = Boolean(
    over && active && over.id === element.id && active.id !== element.id,
  );
  const isElementDrag =
    typeof active?.id === "string" && active.id.startsWith("el-");
  const isOverMidpoint =
    isDropTarget &&
    over?.rect &&
    (active?.rect.current.translated?.top ?? over.rect.top) +
      (active?.rect.current.translated?.height ?? over.rect.height) / 2 >
      over.rect.top + over.rect.height / 2;

  return (
    <SidebarMenuSubItem
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "relative w-full min-w-0 rounded-md",
        isDragging && "opacity-50",
        isDropTarget && isElementDrag && "bg-primary/10",
      )}
    >
      {isDropTarget && isElementDrag && !isOverMidpoint && (
        <span className="pointer-events-none absolute inset-x-2 top-0 z-10 h-0.5 rounded bg-primary" />
      )}
      {isDropTarget && isElementDrag && isOverMidpoint && (
        <span className="pointer-events-none absolute inset-x-2 bottom-0 z-10 h-0.5 rounded bg-primary" />
      )}
      <div className="group grid w-full min-w-0 grid-cols-[1.5rem_minmax(0,1fr)_2.25rem] items-center">
        <button
          type="button"
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          title="Drag to reorder field"
          className="inline-flex h-5 w-5 items-center justify-center rounded border border-border/60 bg-muted/50 text-foreground/80 shadow-sm touch-none cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-70 focus-visible:opacity-100 transition-opacity"
          aria-label={`Reorder ${element.alias || "Untitled Field"} in ${pageId}`}
        >
          <GripVertical size={12} />
        </button>
        <SidebarMenuSubButton className="!px-0 min-w-0 pr-1">
          <InlineEditableText
            className="w-full max-w-full truncate text-xs px-2 border-none !bg-transparent !ring-0 focus:!bg-muted-foreground/5 rounded-xl"
            displayClassName="block w-full truncate text-xs px-2 rounded-xl"
            value={`${element.alias} ` || "Untitled Field"}
            fallbackValue="Untitled Field"
            onCommit={onAliasChange}
          />
        </SidebarMenuSubButton>
        <div className="flex w-9 shrink-0 justify-end">
          <Button
            variant={"ghost"}
            size={"icon"}
            className="shrink-0 opacity-0 group-hover:opacity-50 transition-opacity"
          >
            <IconTrash size={16} />
          </Button>
        </div>
      </div>
    </SidebarMenuSubItem>
  );
}

export function NavMain({
  items,
  onItemSelect,
}: {
  items: {
    title: string;
    url: string;
    icon?: React.ElementType;
    isActive?: boolean;
  }[];
  onItemSelect?: (item: { title: string; url: string }) => boolean | undefined;
}) {
  const { formPages, setFormPages } = useApp();
  const {
    sortedPages,
    openPages,
    togglePage,
    handlePageAliasChange,
    handleElementAliasChange,
    handlePageDragEnd,
    handleElementDragEnd,
  } = useNavMainState(formPages, setFormPages);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              tooltip={item.title}
              onClick={(event) => {
                const handled = onItemSelect?.({
                  title: item.title,
                  url: item.url,
                });
                if (handled) event.preventDefault();
              }}
            >
              <a href={item.url}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
        {sortedPages.length > 0 && (
          <>
            <div className="flex items-center justify-between pr-2 min-w-0">
              <SidebarGroupLabel>Pages</SidebarGroupLabel>
              <Button variant={"ghost"} size={"icon"} className="shrink-0">
                <Plus size={16} />
              </Button>
            </div>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handlePageDragEnd}
            >
              <SortableContext
                items={sortedPages.map((page) => page.id)}
                strategy={verticalListSortingStrategy}
              >
                {sortedPages.map((page, pageIndex) => {
                  const sortedElements = [...page.elements].sort(
                    (a, b) => a.order - b.order,
                  );
                  return (
                    <SortablePageItem
                      key={page.id}
                      page={page}
                      pageIndex={pageIndex}
                      isOpen={!!openPages[page.id]}
                      onToggleOpen={() => togglePage(page.id)}
                      onAliasChange={(nextAlias) =>
                        handlePageAliasChange(page.id, nextAlias)
                      }
                      showDelete={page.order > 1}
                    >
                      {openPages[page.id] && (
                        <DndContext
                          sensors={sensors}
                          collisionDetection={closestCenter}
                          onDragEnd={handleElementDragEnd(page.id)}
                        >
                          <SortableContext
                            items={sortedElements.map((element) => element.id)}
                            strategy={verticalListSortingStrategy}
                          >
                            <SidebarMenuSub>
                              {sortedElements.map((element) => (
                                <SortableElementItem
                                  key={element.id}
                                  pageId={page.id}
                                  element={element}
                                  onAliasChange={(nextAlias) =>
                                    handleElementAliasChange(
                                      page.id,
                                      element.id,
                                      nextAlias,
                                    )
                                  }
                                />
                              ))}
                              {sortedElements.length === 0 && (
                                <SidebarMenuSubItem>
                                  <SidebarMenuSubButton aria-disabled>
                                    <span>Empty page</span>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              )}
                            </SidebarMenuSub>
                          </SortableContext>
                        </DndContext>
                      )}
                    </SortablePageItem>
                  );
                })}
              </SortableContext>
            </DndContext>
          </>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
