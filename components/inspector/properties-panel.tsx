"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { useApp } from "@/contexts/app";
import type { FormField } from "@/lib/types";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ScrollArea } from "../ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";

const CHOICE_TYPES = new Set(["radio", "checkbox", "select"]);
const PLACEHOLDER_TYPES = new Set([
  "text",
  "textarea",
  "email",
  "phone",
  "number",
  "address",
  "url",
]);
const URL_TYPES = new Set(["media", "url"]);
const ACCEPT_TYPES = new Set(["file", "image"]);
const MEDIA_TYPES = new Set(["media"]);
const GROUPED_HEADING_TYPES = new Set(["headingDescriptionGroup"]);
const HEADING_TYPES = new Set(["heading"]);
const DESCRIPTION_TYPES = new Set(["description"]);
const REQUIRED_ACCEPT_TYPES = [".pdf", ".doc", ".docx"] as const;

const getAcceptPreset = (accept?: string[]) => {
  if (!accept || accept.length === 0) return "all";
  const normalized = Array.from(new Set(accept.map((item) => item.toLowerCase())));
  const isAllPreset =
    REQUIRED_ACCEPT_TYPES.every((item) => normalized.includes(item)) &&
    normalized.length === REQUIRED_ACCEPT_TYPES.length;
  if (isAllPreset) return "all";
  if (normalized.length === 1 && REQUIRED_ACCEPT_TYPES.includes(normalized[0] as (typeof REQUIRED_ACCEPT_TYPES)[number])) {
    return normalized[0];
  }
  return "all";
};

function FieldBlock({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3 py-3">
      <p className="text-sm font-semibold tracking-tight">{title}</p>
      {description ? (
        <p className="text-xs text-muted-foreground">{description}</p>
      ) : null}
      {children}
    </section>
  );
}

function CompactField({
  id,
  label,
  children,
}: {
  id?: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 gap-1.5">
      <Label
        htmlFor={id}
        className="text-[11px] uppercase tracking-wide text-muted-foreground"
      >
        {label}
      </Label>
      {children}
    </div>
  );
}

function DraftInput({
  value,
  onCommit,
  className,
  id,
  type = "text",
  min,
  placeholder,
}: {
  value: string | number;
  onCommit: (next: string) => void;
  className?: string;
  id?: string;
  type?: string;
  min?: number;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState(String(value ?? ""));

  useEffect(() => {
    setDraft(String(value ?? ""));
  }, [value]);

  const commit = () => {
    onCommit(draft);
  };

  return (
    <Input
      id={id}
      type={type}
      min={min}
      placeholder={placeholder}
      className={className}
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          commit();
        }
        if (e.key === "Escape") {
          e.preventDefault();
          setDraft(String(value ?? ""));
        }
      }}
    />
  );
}

function DraftTextarea({
  value,
  onCommit,
  className,
  id,
  placeholder,
}: {
  value: string;
  onCommit: (next: string) => void;
  className?: string;
  id?: string;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState(value ?? "");

  useEffect(() => {
    setDraft(value ?? "");
  }, [value]);

  const commit = () => {
    onCommit(draft);
  };

  return (
    <Textarea
      id={id}
      placeholder={placeholder}
      className={className}
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          commit();
        }
        if (e.key === "Escape") {
          e.preventDefault();
          setDraft(value ?? "");
        }
      }}
    />
  );
}

function SortableOptionRow({
  id,
  value,
  disableRemove,
  inputClassName,
  inputPlaceholder,
  onChange,
  onRemove,
}: {
  id: string;
  value: string;
  disableRemove: boolean;
  inputClassName: string;
  inputPlaceholder?: string;
  onChange: (next: string) => void;
  onRemove: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="flex items-center gap-2"
    >
      <button
        type="button"
        aria-label="Drag option"
        title="Drag to reorder"
        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <DraftInput
        className={inputClassName}
        value={value}
        placeholder={inputPlaceholder}
        onCommit={onChange}
      />
      <button
        type="button"
        aria-label="Remove option"
        title="Remove option"
        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
        disabled={disableRemove}
        onClick={onRemove}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function PropertiesPanel() {
  const {
    formPages,
    selectedElementId,
    setRightPanelTab,
    setSelectedElementId,
    updateElementById,
  } = useApp();

  const selected = useMemo(() => {
    for (const page of formPages) {
      const element = page.elements.find((item) => item.id === selectedElementId);
      if (element) {
        return { pageId: page.id, element };
      }
    }
    return null;
  }, [formPages, selectedElementId]);

  const updateSelected = (updater: (field: FormField) => FormField) => {
    if (!selected) return;
    updateElementById(selected.pageId, selected.element.id, updater);
  };
  const optionIdsRef = useRef<string[]>([]);
  const propertiesScrollViewportRef = useRef<HTMLDivElement | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  useLayoutEffect(() => {
    if (!selectedElementId) return;
    propertiesScrollViewportRef.current?.scrollTo({ top: 0, left: 0 });
  }, [selectedElementId]);

  if (!selected) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
        <div className="p-4">
          <p className="text-sm font-semibold">No element selected</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Select an element on the canvas to edit it here.
          </p>
        </div>
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
          AI mode
        </p>
        <button
          type="button"
          onClick={() => setRightPanelTab("ai")}
          className="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-muted"
        >
          Open assistant
        </button>
      </div>
    );
  }

  const element = selected.element;
  const optionsValue =
    "options" in element && Array.isArray(element.options)
      ? element.options
      : [];
  const acceptPreset =
    "accept" in element && Array.isArray(element.accept)
      ? getAcceptPreset(element.accept)
      : "all";

  const inputClassName =
    "h-8 rounded-md border-0 bg-zinc-100 dark:bg-zinc-800/80 text-sm shadow-none focus-visible:ring-1 focus-visible:ring-ring";
  const textAreaClassName =
    "min-h-[76px] rounded-md border-0 bg-zinc-100 dark:bg-zinc-800/80 text-sm shadow-none focus-visible:ring-1 focus-visible:ring-ring";
  const currentOptions = optionsValue.length > 0 ? optionsValue : ["Option 1"];
  if (optionIdsRef.current.length < currentOptions.length) {
    const missingCount = currentOptions.length - optionIdsRef.current.length;
    for (let index = 0; index < missingCount; index++) {
      optionIdsRef.current.push(`option-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`);
    }
  } else if (optionIdsRef.current.length > currentOptions.length) {
    optionIdsRef.current = optionIdsRef.current.slice(0, currentOptions.length);
  }
  const optionIds = optionIdsRef.current;

  return (
    <ScrollArea className="h-full w-full" viewportRef={propertiesScrollViewportRef}>
      <div className="space-y-4 p-3 px-8">
        <header className="pb-2 sticky top-0 bg-background z-10 border-b">
          <p className="text-sm font-semibold">{element.alias || "Untitled element"}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {element.type} · #{element.order}
          </p>
        </header>
        {/* <div className="h-px w-full bg-border/70" /> */}

        <FieldBlock title="Content">
          <CompactField id="field-title" label="Title">
            <DraftInput
              id="field-title"
              className={inputClassName}
              placeholder="e.g. Section title"
              value={element.title ?? ""}
              onCommit={(nextValue) =>
                updateSelected((current) => ({
                  ...current,
                  title: nextValue,
                }))
              }
            />
          </CompactField>
          <CompactField id="field-description" label="Description">
            <DraftTextarea
              id="field-description"
              className={textAreaClassName}
              placeholder="Optional helper text"
              value={element.description ?? ""}
              onCommit={(nextValue) =>
                updateSelected((current) => ({
                  ...current,
                  description: nextValue,
                }))
              }
            />
          </CompactField>
          {GROUPED_HEADING_TYPES.has(element.type) ? (
            <>
              <CompactField id="field-group-heading" label="Heading text">
                <DraftInput
                  id="field-group-heading"
                  className={inputClassName}
                  placeholder="Main heading"
                  value={"heading" in element ? element.heading ?? "" : ""}
                  onCommit={(nextValue) =>
                    updateSelected((current) => ({
                      ...current,
                      heading: nextValue,
                    }))
                  }
                />
              </CompactField>
              <CompactField id="field-group-text" label="Group description text">
                <DraftTextarea
                  id="field-group-text"
                  className={textAreaClassName}
                  placeholder="Supporting paragraph"
                  value={"text" in element ? element.text ?? "" : ""}
                  onCommit={(nextValue) =>
                    updateSelected((current) => ({
                      ...current,
                      text: nextValue,
                    }))
                  }
                />
              </CompactField>
            </>
          ) : null}
          {HEADING_TYPES.has(element.type) ? (
            <CompactField id="field-heading-text" label="Heading text">
              <DraftInput
                id="field-heading-text"
                className={inputClassName}
                placeholder="Heading text"
                value={"label" in element ? element.label ?? "" : ""}
                onCommit={(nextValue) =>
                  updateSelected((current) => ({
                    ...current,
                    label: nextValue,
                  }))
                }
              />
            </CompactField>
          ) : null}
          {DESCRIPTION_TYPES.has(element.type) ? (
            <CompactField id="field-description-text" label="Description text">
              <DraftTextarea
                id="field-description-text"
                className={textAreaClassName}
                placeholder="Description text"
                value={"text" in element ? element.text ?? "" : ""}
                onCommit={(nextValue) =>
                  updateSelected((current) => ({
                    ...current,
                    text: nextValue,
                  }))
                }
              />
            </CompactField>
          ) : null}
        </FieldBlock>
        <div className="h-px w-full bg-border/70" />

        {GROUPED_HEADING_TYPES.has(element.type) ? (
          <>
            <FieldBlock title="Layout">
              <CompactField id="field-group-gap" label="Vertical gap (Y)">
                <DraftInput
                  id="field-group-gap"
                  className={inputClassName}
                  placeholder="e.g. 8"
                  type="number"
                  min={0}
                  value={"gapY" in element ? element.gapY ?? 8 : 8}
                  onCommit={(nextValue) =>
                    updateSelected((current) => ({
                      ...current,
                      gapY: Math.max(0, Number(nextValue) || 0),
                    }))
                  }
                />
              </CompactField>
            </FieldBlock>
            <div className="h-px w-full bg-border/70" />
          </>
        ) : null}

        {"label" in element ? (
          <FieldBlock title="Label">
            <CompactField id="field-label" label="Label text">
              <DraftInput
                id="field-label"
                className={inputClassName}
                placeholder="Question or label"
                value={element.label ?? ""}
                onCommit={(nextValue) =>
                  updateSelected((current) => ({
                    ...current,
                    label: nextValue,
                  }))
                }
              />
            </CompactField>
          </FieldBlock>
        ) : null}
        {"label" in element ? <div className="h-px w-full bg-border/70" /> : null}

        {PLACEHOLDER_TYPES.has(element.type) ? (
          <FieldBlock title="Placeholder">
            <CompactField id="field-placeholder" label="Placeholder text">
              <DraftInput
                id="field-placeholder"
                className={inputClassName}
                placeholder="Hint inside the field"
                value={element.placeholder ?? ""}
                onCommit={(nextValue) =>
                  updateSelected((current) => ({
                    ...current,
                    placeholder: nextValue,
                  }))
                }
              />
            </CompactField>
          </FieldBlock>
        ) : null}
        {PLACEHOLDER_TYPES.has(element.type) ? (
          <div className="h-px w-full bg-border/70" />
        ) : null}

        {CHOICE_TYPES.has(element.type) ? (
          <FieldBlock title="Options">
            <div className="space-y-2">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={(event) => {
                  const { active, over } = event;
                  if (!over || active.id === over.id) return;
                  const activeIndex = optionIds.indexOf(String(active.id));
                  const overIndex = optionIds.indexOf(String(over.id));
                  if (activeIndex < 0 || overIndex < 0) return;

                  const nextOptions = arrayMove(currentOptions, activeIndex, overIndex);
                  optionIdsRef.current = arrayMove(optionIdsRef.current, activeIndex, overIndex);
                  updateSelected((current) => ({
                    ...current,
                    options: nextOptions,
                  }));
                }}
              >
                <SortableContext items={optionIds} strategy={verticalListSortingStrategy}>
                  {currentOptions.map((option, index) => (
                    <SortableOptionRow
                      key={optionIds[index]}
                      id={optionIds[index]}
                      value={option}
                      disableRemove={currentOptions.length <= 1}
                      inputClassName={inputClassName}
                      inputPlaceholder="Option label"
                      onChange={(nextValue) => {
                        const nextOptions = [...currentOptions];
                        nextOptions[index] = nextValue;
                        updateSelected((current) => ({
                          ...current,
                          options: nextOptions,
                        }));
                      }}
                      onRemove={() => {
                        if (currentOptions.length <= 1) return;
                        const nextOptions = currentOptions.filter((_, idx) => idx !== index);
                        optionIdsRef.current = optionIdsRef.current.filter((_, idx) => idx !== index);
                        updateSelected((current) => ({
                          ...current,
                          options: nextOptions,
                        }));
                      }}
                    />
                  ))}
                </SortableContext>
              </DndContext>
              <button
                type="button"
                aria-label="Add option"
                title="Add option"
                className="inline-flex h-8 items-center justify-center gap-1 rounded-md px-2 text-xs text-muted-foreground hover:bg-muted"
                onClick={() => {
                  const nextOptions =
                    optionsValue.length > 0 ? [...optionsValue] : ["Option 1"];
                  nextOptions.push(`Option ${nextOptions.length + 1}`);
                  optionIdsRef.current.push(`option-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`);
                  updateSelected((current) => ({
                    ...current,
                    options: nextOptions,
                  }));
                }}
              >
                <Plus className="h-4 w-4" />
                <span>Add</span>
              </button>
            </div>
          </FieldBlock>
        ) : null}
        {CHOICE_TYPES.has(element.type) ? <div className="h-px w-full bg-border/70" /> : null}

        {ACCEPT_TYPES.has(element.type) ? (
          <FieldBlock
            title="Accepted file types"
            description="Choose accepted file types."
          >
            <CompactField label="Allowed type preset">
              <Select
                value={acceptPreset}
                onValueChange={(value) => {
                  const nextAccept =
                    value === "all" ? [...REQUIRED_ACCEPT_TYPES] : [value];
                  updateSelected((current) => ({
                    ...current,
                    accept: nextAccept,
                  }));
                }}
              >
                <SelectTrigger className={inputClassName}>
                  <SelectValue placeholder="File types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All (.pdf, .doc, .docx)</SelectItem>
                  <SelectItem value=".pdf">.pdf</SelectItem>
                  <SelectItem value=".doc">.doc</SelectItem>
                  <SelectItem value=".docx">.docx</SelectItem>
                </SelectContent>
              </Select>
            </CompactField>
          </FieldBlock>
        ) : null}
        {ACCEPT_TYPES.has(element.type) ? <div className="h-px w-full bg-border/70" /> : null}

        {"maxSizeMB" in element ? (
          <FieldBlock title="File size">
            <CompactField id="field-max-size" label="Max size (MB)">
              <DraftInput
                id="field-max-size"
                className={inputClassName}
                placeholder="e.g. 10"
                type="number"
                min={1}
                value={element.maxSizeMB ?? ""}
                onCommit={(nextValue) =>
                  updateSelected((current) => ({
                    ...current,
                    maxSizeMB: Number(nextValue) || undefined,
                  }))
                }
              />
            </CompactField>
          </FieldBlock>
        ) : null}
        {"maxSizeMB" in element ? <div className="h-px w-full bg-border/70" /> : null}

        {URL_TYPES.has(element.type) ? (
          <FieldBlock title="URL">
            <CompactField label="Source URL">
              <DraftInput
                className={inputClassName}
                placeholder="https://example.com/..."
                value={"url" in element ? element.url ?? "" : ""}
                onCommit={(nextValue) =>
                  updateSelected((current) => ({
                    ...current,
                    url: nextValue,
                  }))
                }
              />
            </CompactField>
          </FieldBlock>
        ) : null}
        {URL_TYPES.has(element.type) ? <div className="h-px w-full bg-border/70" /> : null}

        {MEDIA_TYPES.has(element.type) && "mediaType" in element && element.mediaType === "image" ? (
          <FieldBlock title="Image Size">
            <CompactField label="Fit">
              <Select
                value={"imageFit" in element ? element.imageFit ?? "cover" : "cover"}
                onValueChange={(value) =>
                  updateSelected((current) => ({
                    ...current,
                    imageFit: value === "contain" ? "contain" : "cover",
                  }))
                }
              >
                <SelectTrigger className={inputClassName}>
                  <SelectValue placeholder="Fit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cover">Cover</SelectItem>
                  <SelectItem value="contain">Contain</SelectItem>
                </SelectContent>
              </Select>
            </CompactField>

            <CompactField label="Width">
              <Select
                value={"imageWidth" in element ? element.imageWidth ?? "full" : "full"}
                onValueChange={(value) =>
                  updateSelected((current) => ({
                    ...current,
                    imageWidth: value === "fixed" ? "fixed" : "full",
                  }))
                }
              >
                <SelectTrigger className={inputClassName}>
                  <SelectValue placeholder="Width" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Full width</SelectItem>
                  <SelectItem value="fixed">Fixed</SelectItem>
                </SelectContent>
              </Select>
            </CompactField>
          </FieldBlock>
        ) : null}
        {MEDIA_TYPES.has(element.type) && "mediaType" in element && element.mediaType === "image" ? (
          <div className="h-px w-full bg-border/70" />
        ) : null}

        <FieldBlock title="Visibility & Validation">
          <label className="flex items-center justify-between py-2 text-sm">
            <span>Visible</span>
            <Switch
              checked={element.visible ?? true}
              onCheckedChange={(checked) =>
                updateSelected((current) => ({
                  ...current,
                  visible: checked,
                }))
              }
            />
          </label>
          {"required" in element ? (
            <label className="flex items-center justify-between py-2 text-sm">
              <span>Required</span>
              <Switch
                checked={Boolean(element.required)}
                onCheckedChange={(checked) =>
                  updateSelected((current) => ({
                    ...current,
                    required: checked,
                  }))
                }
              />
            </label>
          ) : null}
        </FieldBlock>
        <div className="h-px w-full bg-border/70" />

        <button
          type="button"
          onClick={() => setSelectedElementId(null)}
          className="w-full rounded-md px-3 py-2 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          Clear selection
        </button>
      </div>
    </ScrollArea>
  );
}
