"use client";

import { ArrowUp, Pin, Trash2, X } from "lucide-react";
import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { CommentConnectorOverlay } from "@/components/editable/comment-connector-overlay";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useApp } from "@/contexts/app";

/** Horizontal dashed segment from field edge toward the pin (pixels). */
const COMMENT_PIN_GUTTER_PX = 52;

const COMMENT_PIN_ANCHOR_CLASS = "absolute -top-2 left-0 z-20";

const pinGutterOffsetStyle: CSSProperties = {
  transform: `translateX(calc(-100% - ${COMMENT_PIN_GUTTER_PX}px))`,
};

function formatCommentAge(ts: number): string {
  const sec = Math.floor((Date.now() - ts) / 1000);
  if (sec < 60) return "just now";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

interface CommentPopoverChromeProps {
  draft: string;
  setDraft: (value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
  scrollChildren: ReactNode;
  footerPlaceholder?: string;
}

function CommentPopoverChrome({
  draft,
  setDraft,
  onSubmit,
  onClose,
  scrollChildren,
  footerPlaceholder = "Reply",
}: CommentPopoverChromeProps) {
  const footerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = window.setTimeout(() => footerRef.current?.focus(), 0);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="flex h-[292px] w-full flex-col overflow-hidden rounded-2xl">
      <header className="flex shrink-0 items-center justify-between gap-2 border-b border-border px-4 py-3">
        <h3 className="font-semibold text-base tracking-tight">Comment</h3>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 rounded-full text-muted-foreground"
          aria-label="Close"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          <X className="size-4" />
        </Button>
      </header>

      <ScrollArea className="min-h-0 flex-1 px-4 py-3">
        <div className="pr-2">{scrollChildren}</div>
      </ScrollArea>

      <footer className="shrink-0 px-4 py-3">
        <div className="flex items-center gap-2 rounded-full bg-muted/40 py-1 pl-3 pr-1 dark:bg-muted/25">
          <Input
            ref={footerRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={footerPlaceholder}
            className="h-9 flex-1 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onSubmit();
              }
            }}
            onClick={(e) => e.stopPropagation()}
          />
          <Button
            type="button"
            size="icon"
            variant="outline"
            className={cn(
              "size-9 shrink-0 rounded-full border-0 shadow-none",
              "bg-neutral-950 text-white hover:bg-neutral-950/90 [&_svg]:text-white",
              "dark:bg-white dark:text-neutral-950 dark:hover:bg-white/90 dark:[&_svg]:text-neutral-950",
              "disabled:bg-muted disabled:text-muted-foreground disabled:[&_svg]:text-muted-foreground disabled:opacity-100",
            )}
            aria-label="Send comment"
            onClick={(e) => {
              e.stopPropagation();
              onSubmit();
            }}
            disabled={!draft.trim()}
          >
            <ArrowUp className="size-4" />
          </Button>
        </div>
      </footer>
    </div>
  );
}

interface ElementCommentPlacementComposerProps {
  elementId: string;
  onRequestClose: () => void;
}

/** First comment: anchor sits at pin corner; panel opens to the left with connector line. */
export function ElementCommentPlacementComposer({
  elementId,
  onRequestClose,
}: ElementCommentPlacementComposerProps) {
  const { addElementComment } = useApp();
  const anchorRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [draft, setDraft] = useState("");

  const submit = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    addElementComment(elementId, trimmed);
    setDraft("");
  };

  return (
    <>
      <CommentConnectorOverlay
        anchorRef={anchorRef}
        panelRef={panelRef}
        open
      />
      <span
        aria-hidden
        className="pointer-events-none absolute left-0 top-[14px] z-[18] box-border h-0 -translate-x-full border-t border-dashed border-muted-foreground/75"
        style={{ width: COMMENT_PIN_GUTTER_PX }}
      />
      <Popover
        modal={false}
        defaultOpen
        onOpenChange={(next) => {
          if (!next) onRequestClose();
        }}
      >
        <PopoverTrigger asChild>
          <button
            type="button"
            ref={anchorRef}
            tabIndex={-1}
            aria-hidden
            className={`${COMMENT_PIN_ANCHOR_CLASS} size-9 opacity-0`}
            style={pinGutterOffsetStyle}
            onPointerDown={(e) => e.stopPropagation()}
          />
        </PopoverTrigger>
        <PopoverContent
          ref={panelRef}
          side="right"
          align="start"
          sideOffset={14}
          collisionPadding={20}
          className="w-[min(340px,calc(100vw-24px))] border-border p-0 shadow-2xl"
          onOpenAutoFocus={(e) => e.preventDefault()}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <CommentPopoverChrome
            draft={draft}
            setDraft={setDraft}
            onSubmit={submit}
            onClose={onRequestClose}
            footerPlaceholder="Write a comment…"
            scrollChildren={
              <p className="text-muted-foreground text-sm leading-relaxed">
                Your comment will pin to this field. Use the row below to add
                it.
              </p>
            }
          />
        </PopoverContent>
      </Popover>
    </>
  );
}

interface ElementCommentPinProps {
  elementId: string;
}

export function ElementCommentPin({ elementId }: ElementCommentPinProps) {
  const {
    elementCommentsByElementId,
    commentPopoverElementId,
    setCommentPopoverElementId,
    addElementComment,
    removeElementComment,
  } = useApp();
  const [draft, setDraft] = useState("");
  const anchorRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const open = commentPopoverElementId === elementId;
  const comments = elementCommentsByElementId[elementId] ?? [];

  const handleOpenChange = (next: boolean) => {
    setCommentPopoverElementId(next ? elementId : null);
    if (!next) setDraft("");
  };

  const handleSubmit = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    addElementComment(elementId, trimmed);
    setDraft("");
  };

  const close = () => handleOpenChange(false);

  return (
    <>
      <CommentConnectorOverlay
        anchorRef={anchorRef}
        panelRef={panelRef}
        open={open}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute left-0 top-[14px] z-[18] box-border h-0 -translate-x-full border-t border-dashed border-muted-foreground/75"
        style={{ width: COMMENT_PIN_GUTTER_PX }}
      />
      <Popover modal={false} open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <button
            ref={anchorRef}
            type="button"
            className={`${COMMENT_PIN_ANCHOR_CLASS} grid size-9 cursor-pointer place-items-center outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
            style={pinGutterOffsetStyle}
            aria-label="Open comments"
            title="Comments"
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <span className="relative flex size-8 items-center justify-center drop-shadow-md">
              <span className="absolute inset-0 rounded-full border border-border bg-background shadow-sm" />
              <span className="absolute inset-[5px] rounded-full bg-muted/80 dark:bg-muted/60" />
              <span className="relative z-10 flex size-4 items-center justify-center">
                <Pin className="size-3.5 text-foreground" />
              </span>
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent
          ref={panelRef}
          side="right"
          align="start"
          sideOffset={14}
          collisionPadding={20}
          className="w-[min(340px,calc(100vw-24px))] border-border p-0 shadow-2xl"
          onOpenAutoFocus={(e) => e.preventDefault()}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <CommentPopoverChrome
            draft={draft}
            setDraft={setDraft}
            onSubmit={handleSubmit}
            onClose={close}
            scrollChildren={
              comments.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No comments yet.
                </p>
              ) : (
                <ul className="space-y-3">
                  {comments.map((c) => (
                    <li
                      key={c.id}
                      className="rounded-xl bg-muted/35 px-3 py-2.5 dark:bg-muted/25"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm leading-snug break-words">{c.text}</p>
                          <p className="mt-1 text-[11px] text-muted-foreground">
                            {formatCommentAge(c.createdAt)}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-7 shrink-0 text-muted-foreground hover:text-foreground"
                          aria-label="Delete comment"
                          onClick={(event) => {
                            event.stopPropagation()
                            removeElementComment(elementId, c.id)
                          }}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )
            }
          />
        </PopoverContent>
      </Popover>
    </>
  );
}
