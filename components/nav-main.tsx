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
import { ChevronRight, GripVertical, Plus, Shapes } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { useFormBuilderActions } from "@/hooks/use-form-builder-actions";
import { useNavMainState } from "@/hooks/use-nav-main-state";
import { useTransientFlash } from "@/hooks/use-transient-flash";
import { ELEMENT_GROUPS } from "@/lib/form/element-groups";
import { ELEMENT_ICON_BY_TYPE } from "@/lib/form/element-icons";
import type { AddableFieldType } from "@/lib/form/factories";
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
  onFocusTarget,
}: {
  value: string;
  fallbackValue: string;
  className?: string;
  displayClassName?: string;
  onCommit: (nextValue: string) => void;
  onFocusTarget?: () => void;
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
        className={displayClassName ?? "block max-w-full truncate "}
        onClick={(e) => {
          e.stopPropagation();
          onFocusTarget?.();
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          onFocusTarget?.();
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
      onClick={(e) => {
        e.stopPropagation();
        onFocusTarget?.();
      }}
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
  showSidebarFlash,
  onPageRowActivate,
  onChevronToggle,
  onAliasChange,
  onAddElement,
  onDeletePage,
  showDelete,
  children,
}: {
  page: FormPage;
  pageIndex: number;
  isOpen: boolean;
  showSidebarFlash: boolean;
  onPageRowActivate: () => void;
  onChevronToggle: () => void;
  onAliasChange: (nextAlias: string) => void;
  onAddElement: (type: AddableFieldType) => void;
  onDeletePage: () => void;
  showDelete: boolean;
  children?: React.ReactNode;
}) {
  const [addElementQuery, setAddElementQuery] = useState("");
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
  const filteredElementGroups = React.useMemo(() => {
    const query = addElementQuery.trim().toLowerCase();
    if (!query) return ELEMENT_GROUPS;

    return ELEMENT_GROUPS
      .map((group) => ({
        ...group,
        items: group.items.filter((item) =>
          item.label.toLowerCase().includes(query),
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [addElementQuery]);

  return (
    <SidebarMenuItem className="relative">
      <div
        ref={setNodeRef}
        data-sidebar-page-id={page.id}
        style={{ transform: CSS.Transform.toString(transform), transition }}
        className={cn(
          "relative group flex scroll-mt-3 items-center justify-between gap-1 pr-2 min-w-0 overflow-hidden rounded-md",
          isDragging && "opacity-50",
          isDropTarget && isPageDrag && "bg-primary/10",
          showSidebarFlash && "bg-primary/10 ring-1 ring-primary/40",
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
          type="button"
          onClick={onPageRowActivate}
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
          <span
            role="presentation"
            className="inline-flex shrink-0 cursor-pointer items-center rounded-sm p-0.5 text-muted-foreground hover:bg-muted/80"
            onClick={(e) => {
              e.stopPropagation();
              onChevronToggle();
            }}
          >
            <ChevronRight
              className={`size-4 transition-transform duration-200 ${isOpen ? "rotate-90" : "rotate-0"}`}
            />
          </span>
          <InlineEditableText
            className="w-full truncate text-xs !bg-transparent !border-none !ring-0 focus:!bg-muted-foreground/5 rounded-xl px-2"
            displayClassName="block w-full truncate text-xs px-2 rounded-xl"
            value={page.alias}
            fallbackValue={`Page ${pageIndex + 1}`}
            onFocusTarget={onPageRowActivate}
            onCommit={onAliasChange}
          />
        </SidebarMenuButton>
        <DropdownMenu onOpenChange={(open) => !open && setAddElementQuery("")}>
          <DropdownMenuTrigger asChild>
            <Button
              variant={"ghost"}
              size={"icon"}
              className="shrink-0 opacity-0 group-hover:opacity-50 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              <Plus size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="start" className="min-w-[280px] p-2">
            <div className="px-1 pb-2">
              <Input
                value={addElementQuery}
                onChange={(event) => setAddElementQuery(event.target.value)}
                placeholder="Search elements..."
                aria-label="Search add element list"
              />
            </div>
            <ScrollArea className="h-[260px]">
              {filteredElementGroups.length > 0 ? filteredElementGroups.map((group, idx) => (
                <React.Fragment key={group.label}>
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-xs text-muted-foreground">
                      {group.label}
                    </DropdownMenuLabel>
                    {group.items.map((item) => (
                      <DropdownMenuItem
                        key={item.value}
                        className="cursor-pointer"
                        onClick={() => onAddElement(item.value)}
                      >
                        <span className="mr-2 inline-flex items-center text-muted-foreground">
                          {React.createElement(ELEMENT_ICON_BY_TYPE[item.value], { size: 14 })}
                        </span>
                        {item.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                  {idx < filteredElementGroups.length - 1 && <DropdownMenuSeparator />}
                </React.Fragment>
              )) : (
                <p className="px-2 py-3 text-sm text-muted-foreground">
                  No elements found for "{addElementQuery}".
                </p>
              )}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>
        {showDelete && (
          <Button
            variant={"ghost"}
            size={"icon"}
            className="shrink-0 opacity-0 group-hover:opacity-50 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              onDeletePage();
            }}
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
  displayAlias,
  isSidebarSelected,
  onSelect,
  onAliasChange,
  onDelete,
}: {
  pageId: string;
  element: FormField;
  displayAlias: string;
  isSidebarSelected: boolean;
  onSelect: () => void;
  onAliasChange: (nextAlias: string) => void;
  onDelete: () => void;
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
      data-sidebar-element-id={element.id}
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "relative w-full min-w-0 scroll-mt-3 rounded-md",
        isDragging && "opacity-50",
        isDropTarget && isElementDrag && "bg-primary/10",
        isSidebarSelected && "bg-primary/10 ring-1 ring-primary/40",
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
        <SidebarMenuSubButton className="!px-0 min-w-0 pr-1" onClick={onSelect}>
          <div className="flex min-w-0 items-center gap-1.5">
            <span className="text-muted-foreground">
              {"type" in element && element.type in ELEMENT_ICON_BY_TYPE
                ? React.createElement(
                    ELEMENT_ICON_BY_TYPE[element.type as keyof typeof ELEMENT_ICON_BY_TYPE],
                    { size: 12 },
                  )
                : <Shapes size={12} />}
            </span>
            <InlineEditableText
              className="w-full max-w-full truncate text-xs px-2 border-none !bg-transparent !ring-0 focus:!bg-muted-foreground/5 rounded-xl"
              displayClassName="block w-full truncate text-xs px-2 rounded-xl cursor-default"
              value={displayAlias}
              fallbackValue="Untitled Field"
            onFocusTarget={onSelect}
              onCommit={onAliasChange}
            />
          </div>
        </SidebarMenuSubButton>
        <div className="flex w-9 shrink-0 justify-end">
          <Button
            variant={"ghost"}
            size={"icon"}
            className="shrink-0 opacity-0 group-hover:opacity-50 transition-opacity"
            onClick={onDelete}
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
  const {
    formPages,
    setFormPages,
    selectedElementId,
    setSelectedElementId,
    setRightPanelTab,
    setCurrentPageId,
    currentPageId,
    pageFocusGeneration,
    focusFormPageInEditor,
  } = useApp();
  const { addPage, removePage, addElementToPage, removeElementFromPage } =
    useFormBuilderActions();
  const {
    sortedPages,
    openPages,
    togglePage,
    expandPage,
    handlePageAliasChange,
    handleElementAliasChange,
    handlePageDragEnd,
    handleElementDragEnd,
  } = useNavMainState(formPages, setFormPages);
  const { targets: sidebarFlash, pulse: flashSidebar } = useTransientFlash(720);
  const lastProcessedPageFocusGen = useRef(0);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const getElementDisplayAliases = (elements: FormField[]) => {
    const counts = new Map<string, number>();
    const totalByAlias = new Map<string, number>();

    for (const element of elements) {
      const baseAlias = (element.alias || "Untitled Field").trim() || "Untitled Field";
      totalByAlias.set(baseAlias, (totalByAlias.get(baseAlias) ?? 0) + 1);
    }

    const displayById = new Map<string, string>();
    for (const element of elements) {
      const baseAlias = (element.alias || "Untitled Field").trim() || "Untitled Field";
      const nextIndex = (counts.get(baseAlias) ?? 0) + 1;
      counts.set(baseAlias, nextIndex);
      const hasDuplicates = (totalByAlias.get(baseAlias) ?? 0) > 1;
      displayById.set(
        element.id,
        hasDuplicates ? `${baseAlias} (${nextIndex})` : baseAlias,
      );
    }

    return displayById;
  };

  useEffect(() => {
    if (!selectedElementId) return;

    const ownerPage = sortedPages.find((page) =>
      page.elements.some((element) => element.id === selectedElementId),
    );
    if (!ownerPage) return;

    expandPage(ownerPage.id);

    const timeoutId = window.setTimeout(() => {
      const target = document.querySelector(
        `[data-sidebar-element-id="${selectedElementId}"]`,
      ) as HTMLElement | null;
      target?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [selectedElementId, expandPage]);

  useEffect(() => {
    if (pageFocusGeneration === 0) return;
    if (pageFocusGeneration === lastProcessedPageFocusGen.current) return;
    lastProcessedPageFocusGen.current = pageFocusGeneration;

    const pageId = currentPageId;
    if (!pageId) return;

    expandPage(pageId);
    flashSidebar({ pageId });

    const timeoutId = window.setTimeout(() => {
      const target = document.querySelector(
        `[data-sidebar-page-id="${pageId}"]`,
      ) as HTMLElement | null;
      target?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [pageFocusGeneration, currentPageId, expandPage, flashSidebar]);

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
            <div className="sticky top-0 z-10 flex min-w-0 items-center justify-between pr-2 bg-background">
              <SidebarGroupLabel>Pages</SidebarGroupLabel>
              <Button
                variant={"ghost"}
                size={"icon"}
                className="shrink-0"
                onClick={addPage}
              >
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
                  const displayAliases = getElementDisplayAliases(sortedElements);
                  return (
                    <SortablePageItem
                      key={page.id}
                      page={page}
                      pageIndex={pageIndex}
                      isOpen={!!openPages[page.id]}
                      showSidebarFlash={sidebarFlash.pageId === page.id}
                      onPageRowActivate={() => {
                        focusFormPageInEditor(page.id);
                      }}
                      onChevronToggle={() => togglePage(page.id)}
                      onAliasChange={(nextAlias) =>
                        handlePageAliasChange(page.id, nextAlias)
                      }
                      onAddElement={(type) => addElementToPage(page.id, type)}
                      onDeletePage={() => removePage(page.id)}
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
                                  displayAlias={
                                    displayAliases.get(element.id) ??
                                    element.alias ??
                                    "Untitled Field"
                                  }
                                  isSidebarSelected={
                                    selectedElementId === element.id
                                  }
                                  onSelect={() => {
                                    setCurrentPageId(page.id);
                                    setSelectedElementId(element.id);
                                    setRightPanelTab("properties");
                                  }}
                                  onAliasChange={(nextAlias) =>
                                    handleElementAliasChange(
                                      page.id,
                                      element.id,
                                      nextAlias,
                                    )
                                  }
                                  onDelete={() =>
                                    removeElementFromPage(page.id, element.id)
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
