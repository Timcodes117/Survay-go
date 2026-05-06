import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../ui/button";
import { IconCirclePlus2 } from "@tabler/icons-react";
import { ChevronsUpDown, HandIcon, MessageCircle, MousePointer2, Search } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ScrollArea } from "../ui/scroll-area";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "../ui/sheet";
import { Input } from "../ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useApp } from "@/contexts/app";
import { useFormBuilderActions } from "@/hooks/use-form-builder-actions";
import { ELEMENT_GROUPS } from "@/lib/form/element-groups";
import { ELEMENT_ICON_BY_TYPE } from "@/lib/form/element-icons";
import { usePathname, useRouter } from "next/navigation";

const FloatingToolBar = () => {
    const { cursorMode, setCursorMode, formPages, setCurrentPageId, setSelectedElementId } = useApp();
    const { addElementToCurrentPage } = useFormBuilderActions();
    const [activePanel, setActivePanel] = useState<"search" | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const searchInputRef = useRef<HTMLInputElement>(null);
    const pathname = usePathname();
    const router = useRouter();

    const formId = useMemo(() => {
        const matched = pathname.match(/\/dashboard\/([^/]+)/);
        return matched?.[1] ?? null;
    }, [pathname]);

    const routeItems = useMemo(
        () =>
            formId
                ? [
                    { label: "Editor", description: "Design your form", href: `/dashboard/${formId}/editor` },
                    { label: "Responses", description: "View submitted entries", href: `/dashboard/${formId}/responses` },
                    { label: "Settings", description: "Configure behavior and webhooks", href: `/dashboard/${formId}/settings` },
                ]
                : [],
        [formId],
    );

    const searchableElements = useMemo(
        () =>
            formPages.flatMap((page) =>
                page.elements.map((element) => {
                    const searchParts = [
                        element.alias,
                        element.title,
                        element.description,
                        "label" in element ? element.label : "",
                        "placeholder" in element ? element.placeholder : "",
                        "options" in element && Array.isArray(element.options)
                            ? element.options.join(" ")
                            : "",
                    ]
                        .filter(Boolean)
                        .join(" ")
                        .toLowerCase();

                    return {
                        pageId: page.id,
                        pageAlias: page.alias,
                        pageOrder: page.order,
                        elementId: element.id,
                        elementType: element.type,
                        elementAlias: element.alias,
                        elementTitle: element.title,
                        searchParts,
                    };
                }),
            ),
        [formPages],
    );

    const filteredResults = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return searchableElements.slice(0, 30);
        return searchableElements
            .filter((entry) => entry.searchParts.includes(query))
            .slice(0, 50);
    }, [searchQuery, searchableElements]);

    useEffect(() => {
        if (activePanel !== "search") return;
        const timeout = window.setTimeout(() => searchInputRef.current?.focus(), 20);
        return () => window.clearTimeout(timeout);
    }, [activePanel]);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            const target = event.target as HTMLElement | null;
            const isEditable =
                !!target &&
                (target.tagName === "INPUT" ||
                    target.tagName === "TEXTAREA" ||
                    target.isContentEditable);
            if (isEditable) return;

            const key = event.key.toLowerCase();
            if ((event.ctrlKey || event.metaKey) && key === "f") {
                event.preventDefault();
                setActivePanel("search");
                return;
            }
            if (key === "v") {
                event.preventDefault();
                setCursorMode("select");
                return;
            }
            if (key === "h") {
                event.preventDefault();
                setCursorMode("pan");
            }
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [setCursorMode]);

    const handlePickSearchResult = (pageId: string, elementId: string) => {
        setCurrentPageId(pageId);
        setSelectedElementId(elementId);
        setActivePanel(null);
    };

    const handleNavigate = (href: string) => {
        router.push(href);
        setActivePanel(null);
    };

    return (
        <Sheet open={activePanel !== null} onOpenChange={(open) => !open && setActivePanel(null)}>
            <div className="flex items-center justify-center absolute bottom-10 px-1 left-1/2 -translate-x-1/2 bg-background text-foreground w-fit h-[50px] rounded-xl shadow-md border-[0.5px] z-50">
                <div className="flex items-center justify-center gap-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                onClick={() => setCursorMode("select")}
                                variant={cursorMode !== "select" ? "ghost" : "secondary"}
                                size={"icon"}
                                className="w-[50px] h-[40px]"
                                aria-label="Pointer tool"
                            >
                                <MousePointer2 className="!size-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">Pointer (V)</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                onClick={() => setCursorMode("pan")}
                                variant={cursorMode !== "pan" ? "ghost" : "secondary"}
                                size={"icon"}
                                className="w-[50px] h-[40px]"
                                aria-label="Hand tool"
                            >
                                <HandIcon className="!size-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">Hand / Grab (H)</TooltipContent>
                    </Tooltip>

                    <DropdownMenu>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <DropdownMenuTrigger asChild>
                                    <Button size={"icon"} variant={"ghost"} className="w-[60px] h-[40px]" aria-label="Add element">
                                        <IconCirclePlus2 className="!size-5" />
                                    </Button>
                                </DropdownMenuTrigger>
                            </TooltipTrigger>
                            <TooltipContent side="top">Add element</TooltipContent>
                        </Tooltip>
                        <DropdownMenuContent side="top" align="center" className="min-w-[340px] w-[340px] p-2">
                            <ScrollArea className="h-[300px]">
                                {ELEMENT_GROUPS.map((group, idx) => (
                                    <React.Fragment key={group.label}>
                                        <DropdownMenuGroup>
                                            <DropdownMenuLabel className="text-xs text-muted-foreground">{group.label}</DropdownMenuLabel>
                                            {group.items.map((item) => (
                                                <DropdownMenuItem
                                                    key={item.value}
                                                    className="cursor-pointer"
                                                    onClick={() => addElementToCurrentPage(item.value)}
                                                >
                                                    <span className="mr-2 inline-flex items-center text-muted-foreground">
                                                        {React.createElement(ELEMENT_ICON_BY_TYPE[item.value], { size: 14 })}
                                                    </span>
                                                    {item.label}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuGroup>
                                        {idx < ELEMENT_GROUPS.length - 1 && <DropdownMenuSeparator />}
                                    </React.Fragment>
                                ))}
                            </ScrollArea>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant={"ghost"}
                                size={"icon"}
                                className="w-[50px] h-[40px]"
                                aria-label="Comments"
                            >
                                <MessageCircle className="!size-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">Comments (coming soon)</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                onClick={() => setActivePanel("search")}
                                variant={"ghost"}
                                size={"icon"}
                                className="w-[50px] h-[40px]"
                                aria-label="Search elements"
                            >
                                <Search className="!size-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">Search (Ctrl/Cmd + F)</TooltipContent>
                    </Tooltip>

                    <div className="h-8 w-px bg-sidebar-border" />

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant={"default"} size={"icon"} className="w-[100px] h-[40px] text-white rounded-lg">
                                Share
                                <ChevronsUpDown size={14} />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">Share</TooltipContent>
                    </Tooltip>
                </div>
            </div>

            <SheetContent className="w-[420px] p-0 sm:max-w-[420px] h-full flex flex-col">
                <SheetHeader>
                    <SheetTitle>Search elements</SheetTitle>
                    <SheetDescription>
                        Find elements quickly and navigate key form routes.
                    </SheetDescription>
                </SheetHeader>
                <div className="px-4 pb-4 pt-1 space-y-3 flex-1 min-h-0 flex flex-col">
                    <Input
                        ref={searchInputRef}
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        placeholder="Search form elements..."
                        aria-label="Search form elements"
                    />
                    <ScrollArea className="flex-1 min-h-0">
                        <div className="space-y-5">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
                                    Elements
                                </p>
                                <div className="space-y-1">
                                    {filteredResults.length > 0 ? (
                                        filteredResults.map((result) => (
                                            <button
                                                key={result.elementId}
                                                type="button"
                                                onClick={() => handlePickSearchResult(result.pageId, result.elementId)}
                                                className="w-full text-left px-2 py-2 rounded-md hover:bg-muted/60 transition-colors"
                                            >
                                                <p className="text-sm font-medium truncate">
                                                    {result.elementTitle || result.elementAlias || result.elementType}
                                                </p>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    Page {result.pageOrder}: {result.pageAlias} - {result.elementType}
                                                </p>
                                            </button>
                                        ))
                                    ) : (
                                        <p className="text-sm text-muted-foreground px-2 py-3">
                                            No elements found for "{searchQuery}".
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
                                    Routes
                                </p>
                                <div className="space-y-1">
                                    {routeItems.map((item) => (
                                        <button
                                            key={item.href}
                                            type="button"
                                            onClick={() => handleNavigate(item.href)}
                                            className="w-full px-2 py-2 text-left rounded-md hover:bg-muted/60 transition-colors"
                                        >
                                            <p className="text-sm font-medium">{item.label}</p>
                                            <p className="text-xs text-muted-foreground">{item.description}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default FloatingToolBar;