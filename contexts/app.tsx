import React from "react"
import { create } from "zustand"
import type { FormPage } from "@/lib/types"

interface AppState {
    zoom: number
    positionX: number
    positionY: number
    formPages: FormPage[]
    currentPageId?: string | null
    cursorMode: 'pan' | 'select'
}

interface AppActions {
    setZoom: (zoom: number) => void
    setPosition: (x: number, y: number) => void
    resetZoom: () => void
    setFormPages: (updater: React.SetStateAction<FormPage[]>) => void
    setCurrentPageId: (pageId: string | null) => void
    setCursorMode: (mode: 'pan' | 'select') => void
}

type AppStore = AppState & AppActions

const initialPages: FormPage[] = [
    {
        id: "page-1",
        alias: "Page 1",
        order: 1,
        elements: [
            {
                id: "el-1",
                type: "heading",
                alias: "Heading",
                order: 1,
                title: "Form Title",
                description: "Main heading for the form",
                label: "Untitled Form",
                visible: true,
                level: 2
            },
            {
                id: "el-2",
                type: "description",
                alias: "Description",
                order: 2,
                title: "Form Description",
                description: "Brief description of what this form is for",
                text: "Please fill out this form to help us understand your preferences.",
                visible: true
            },
            {
                id: "el-3",
                type: "text",
                alias: "Short Answer",
                order: 3,
                title: "Name Field",
                description: "Text input for collecting user's full name",
                label: "Your name",
                placeholder: "Enter full name",
                required: true,
                visible: true
            },
            {
                id: "el-4",
                type: "textarea",
                alias: "Long Answer",
                order: 4,
                title: "Comments Field",
                description: "Multi-line text input for detailed responses",
                label: "Additional comments",
                placeholder: "Enter your comments here...",
                visible: true
            },
            {
                id: "el-5",
                type: "email",
                alias: "Email",
                order: 5,
                title: "Email Address",
                description: "Email input field for contact information",
                label: "Email address",
                placeholder: "Enter your email",
                required: true,
                visible: true
            },
            {
                id: "el-6",
                type: "phone",
                alias: "Phone",
                order: 6,
                title: "Phone Number",
                description: "Phone number input field",
                label: "Phone number",
                placeholder: "Enter your phone number",
                visible: true
            },
            {
                id: "el-7",
                type: "number",
                alias: "Number",
                order: 7,
                title: "Age Field",
                description: "Numeric input for age or quantity",
                label: "Your age",
                placeholder: "Enter your age",
                min: 0,
                max: 120,
                visible: true
            }
        ]
    },
    {
        id: "page-2",
        alias: "Page 2",
        order: 2,
        elements: [
            {
                id: "el-8",
                type: "radio",
                alias: "Radio",
                order: 1,
                title: "Gender Selection",
                description: "Single choice radio button group",
                label: "Gender",
                options: ["Male", "Female", "Other", "Prefer not to say"],
                visible: true
            },
            {
                id: "el-9",
                type: "checkbox",
                alias: "Checkbox",
                order: 2,
                title: "Interests Selection",
                description: "Multiple choice checkbox group",
                label: "Your interests (select all that apply)",
                options: ["Sports", "Music", "Reading", "Travel", "Cooking", "Gaming"],
                visible: true
            },
            {
                id: "el-10",
                type: "select",
                alias: "Dropdown",
                order: 3,
                title: "Country Selection",
                description: "Dropdown menu for selecting country",
                label: "Country",
                options: ["United States", "Canada", "United Kingdom", "Australia", "Germany", "France", "Other"],
                visible: true
            },
            {
                id: "el-11",
                type: "divider",
                alias: "Divider",
                order: 4,
                title: "Section Divider",
                description: "Visual separator between sections",
                visible: true
            },
            {
                id: "el-12",
                type: "file",
                alias: "File Upload",
                order: 5,
                title: "Document Upload",
                description: "File upload field for documents",
                label: "Upload your resume",
                accept: [".pdf", ".doc", ".docx"],
                maxSizeMB: 5,
                visible: true
            },
            {
                id: "el-13",
                type: "image",
                alias: "Image Upload",
                order: 6,
                title: "Profile Picture",
                description: "Image upload field for profile pictures",
                label: "Profile picture",
                accept: ["image/jpeg", "image/png", "image/gif"],
                maxSizeMB: 2,
                visible: true
            }
        ]
    },
    {
        id: "page-3",
        alias: "Page 3",
        order: 3,
        elements: [
            {
                id: "el-14",
                type: "date",
                alias: "Date Picker",
                order: 1,
                title: "Birth Date",
                description: "Date picker for selecting birth date",
                label: "Date of birth",
                visible: true
            },
            {
                id: "el-15",
                type: "time",
                alias: "Time Picker",
                order: 2,
                title: "Preferred Time",
                description: "Time picker for selecting preferred time",
                label: "Preferred meeting time",
                visible: true
            },
            {
                id: "el-16",
                type: "address",
                alias: "Address",
                order: 3,
                title: "Home Address",
                description: "Address input field for home address",
                label: "Home address",
                placeholder: "Enter your full address",
                visible: true
            },
            {
                id: "el-17",
                type: "url",
                alias: "URL",
                order: 4,
                title: "Website URL",
                description: "URL input field for website links",
                label: "Website URL",
                placeholder: "https://example.com",
                visible: true
            },
            {
                id: "el-18",
                type: "media",
                alias: "Media",
                order: 5,
                title: "Sample Image",
                description: "Media element displaying an image",
                label: "Sample Image",
                mediaType: "image",
                url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
                visible: true
            },
            {
                id: "el-19",
                type: "pageBreak",
                alias: "Page Break",
                order: 6,
                title: "Page Break",
                description: "Visual page break element",
                visible: true
            }
        ]
    }
]

export const useApp = create<AppStore>()((set) => ({
    zoom: 1.0,
    positionX: 0,
    positionY: 0,
    formPages: initialPages,
    currentPageId: initialPages[0]?.id ?? null,
    cursorMode: 'select',
    setZoom: (zoom) => set({ zoom }),
    setPosition: (x, y) => set({ positionX: x, positionY: y }),
    resetZoom: () => set({ zoom: 1.0, positionX: 0, positionY: 0 }),
    setFormPages: (updater) => set((state) => ({
        formPages: typeof updater === "function" ? (updater as (prev: FormPage[]) => FormPage[])(state.formPages) : updater
    })),
    setCurrentPageId: (pageId) => set({ currentPageId: pageId }),
    setCursorMode: (mode) => set({ cursorMode: mode })
}))

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>
}