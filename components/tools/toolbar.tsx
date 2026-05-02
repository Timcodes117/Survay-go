import React from "react";
import { Button } from "../ui/button";
import { IconCirclePlus2, IconPencilCog, IconPlus, IconSparkles, IconTools } from "@tabler/icons-react";
import { ChevronsUpDown, Grab, MessageCircle, MouseIcon, MousePointer, MousePointer2, Search, Sparkle, Hand, HandIcon } from "lucide-react";
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
import { useApp } from "@/contexts/app";

const ELEMENT_GROUPS: { label: string; items: { label: string; value: string }[] }[] = [
    {
        label: "Layout & Display",
        items: [
            { label: "Heading", value: "heading" },
            { label: "Description", value: "description" },
            { label: "Divider", value: "divider" },
            { label: "Media", value: "media" },
            { label: "Page Break", value: "pageBreak" },
        ],
    },
    {
        label: "Basic Inputs",
        items: [
            { label: "Text", value: "text" },
            { label: "Textarea", value: "textarea" },
            { label: "Number", value: "number" },
            { label: "Email", value: "email" },
            // { label: "Password", value: "password" },
            { label: "Phone", value: "phone" },
        ],
    },
    {
        label: "Choices",
        items: [
            { label: "Radio", value: "radio" },
            { label: "Checkbox", value: "checkbox" },
            { label: "Select", value: "select" },
        ],
    },
    {
        label: "File & Media",
        items: [
            { label: "File Upload", value: "file" },
            { label: "Image Upload", value: "image" },
            // { label: "Signature", value: "signature" },
        ],
    },
    {
        label: "Advanced",
        items: [
            { label: "Date Picker", value: "date" },
            { label: "Time Picker", value: "time" },
            { label: "Address", value: "address" },
            { label: "URL", value: "url" },
        ],
    },
];

const FloatingToolBar = () => {
    const { cursorMode, setCursorMode } = useApp();

    const cursorModeOptions = [
        {
            value: 'select' as const,
            label: 'Select',
            description: 'Click to select elements',
            icon: MousePointer2
        },
        {
            value: 'pan' as const,
            label: 'Pan',
            description: 'Click and drag to move around',
            icon: Hand
        }
    ];

    const currentMode = cursorModeOptions.find(option => option.value === cursorMode);

    return (
        <div className="flex items-center justify-center absolute bottom-10 px-1 left-1/2 -translate-x-1/2 bg-background text-foreground w-fit h-[50px] rounded-xl shadow-md border-[0.5px] z-50">
            <div className="flex items-center justify-center gap-2">
                {/* <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button 
                            variant={"secondary"} 
                            size={"icon"} 
                            className="w-[50px] h-[40px]"
                            aria-label="Cursor mode"
                        >
                            {currentMode?.icon && <currentMode.icon className="!size-5" />}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="top" align="center" className="w-[200px] p-2">
                        <div className="space-y-1">
                            {cursorModeOptions.map((option) => (
                                <DropdownMenuItem
                                    key={option.value}
                                    className="cursor-pointer p-0"
                                    onClick={() => setCursorMode(option.value)}
                                >
                                    <div className="flex items-center gap-3 w-full p-3">
                                        <option.icon className="size-4" />
                                        <div className="text-left">
                                            <div className="font-medium text-sm">{option.label}</div>
                                            <div className="text-xs text-muted-foreground">{option.description}</div>
                                        </div>
                                    </div>
                                </DropdownMenuItem>
                            ))}
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu> */}
                <Button onClick={() => setCursorMode('select')}
                            variant={ cursorMode !== 'select' ? null : "secondary"} 
                            size={"icon"} 
                            color="white"
                            className="w-[50px] h-[40px]"
                            aria-label="Cursor mode"
                        >
                            <MousePointer2 className="!size-5" />
                        </Button>
                <Button onClick={() => setCursorMode('pan')}
                            variant={ cursorMode !== 'pan' ? null : "secondary"} 
                            size={"icon"} 
                            className="w-[50px] h-[40px]"
                            color="white"
                            aria-label="Cursor mode"
                        >
                            <HandIcon className="!size-5" />
                        </Button>
                {/* <Button variant={"ghost"} size={"icon"} className="w-[50px] h-[40px]">
                    <Mous className="!size-5" />
                </Button> */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button size={"icon"} variant={"ghost"} className="w-[60px] h-[40px]" aria-label="Add element">
                            <IconCirclePlus2 className="!size-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="top" align="center" className="min-w-[340px] w-[340px] p-2">
                        <ScrollArea className="h-[300px]">
                        {ELEMENT_GROUPS.map((group, idx) => (
                            <React.Fragment key={group.label}>
                                <DropdownMenuGroup>
                                    <DropdownMenuLabel className="text-xs text-muted-foreground">{group.label}</DropdownMenuLabel>
                                    {group.items.map((item) => (
                                        <DropdownMenuItem key={item.value} className="cursor-pointer">
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
                <Button variant={"ghost"} size={"icon"} className="w-[50px] h-[40px]">
                    <MessageCircle className="!size-5" />
                </Button>
                <Button variant={"ghost"} size={"icon"} className="w-[50px] h-[40px]">
                    <Search className="!size-5" />
                </Button>
            <div className="h-8 w-px bg-sidebar-border" />
                <Button variant={"default"} size={"icon"} className="w-[100px] h-[40px] text-white rounded-lg">
                    Share
                    <ChevronsUpDown size={14} />
                </Button>

            </div>
        </div>
    )
}

export default FloatingToolBar;