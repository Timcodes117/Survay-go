import React from "react"
import { create } from "zustand"
import {
    validateAndNormalizeForm,
    type FormField,
    type FormPage,
    type ValidationIssue,
} from "@/lib/types"
import {
    createElementComment,
    type ElementComment,
} from "@/lib/types/element-comment"

interface AppState {
    zoom: number
    positionX: number
    positionY: number
    formPages: FormPage[]
    pastFormPages: FormPage[][]
    futureFormPages: FormPage[][]
    currentPageId?: string | null
    /** When set, editor scrolls this page into view then clears via `consumeCanvasScrollTarget`. */
    canvasScrollTargetPageId: string | null
    /** Incremented on explicit page focus so the sidebar can sync without reacting to scroll-driven `currentPageId` updates. */
    pageFocusGeneration: number
    cursorMode: 'pan' | 'select'
    selectedElementId: string | null
    rightPanelTab: 'properties' | 'ai'
    validationErrors: ValidationIssue[]
    validationWarnings: ValidationIssue[]
    canUndo: boolean
    canRedo: boolean
    /** When true, clicking an element sets comment target instead of opening the inspector. */
    commentPlacementActive: boolean
    /** Element the user picked while comment mode is on (shows comment anchor). */
    commentTargetElementId: string | null
    /** Which element's comment dropdown is open (if any). */
    commentPopoverElementId: string | null
    /** Collaboration metadata: comments keyed by element id (not part of form schema / undo). */
    elementCommentsByElementId: Record<string, ElementComment[]>
}

interface AppActions {
    setZoom: (zoom: number) => void
    setPosition: (x: number, y: number) => void
    resetZoom: () => void
    setFormPages: (updater: React.SetStateAction<FormPage[]>) => void
    setCurrentPageId: (pageId: string | null) => void
    /** Select page, clear element selection, scroll canvas + sidebar (no frame highlight on the page sheet). */
    focusFormPageInEditor: (pageId: string) => void
    consumeCanvasScrollTarget: () => void
    setCursorMode: (mode: 'pan' | 'select') => void
    setSelectedElementId: (elementId: string | null) => void
    setRightPanelTab: (tab: 'properties' | 'ai') => void
    updateElementById: (
        pageId: string,
        elementId: string,
        updater: (element: FormField) => FormField
    ) => void
    undo: () => void
    redo: () => void
    clearValidationIssues: () => void
    setCommentPlacementActive: (active: boolean) => void
    setCommentTargetElementId: (elementId: string | null) => void
    setCommentPopoverElementId: (elementId: string | null) => void
    addElementComment: (elementId: string, text: string) => void
    removeElementComment: (elementId: string, commentId: string) => void
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
                type: "headingDescriptionGroup",
                alias: "Heading + Description",
                order: 1,
                title: "Hero Header Group",
                description: "Grouped heading and description block",
                heading: "Untitled Form",
                text: "Please fill out this form to help us understand your preferences.",
                visible: true,
                gapY: 8
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

const validatedInitial = validateAndNormalizeForm(initialPages)
const initialFormPages = validatedInitial.value
const HISTORY_LIMIT = 50

export const useApp = create<AppStore>()((set) => ({
    zoom: 1.0,
    positionX: 0,
    positionY: 0,
    formPages: initialFormPages,
    pastFormPages: [],
    futureFormPages: [],
    currentPageId: initialFormPages[0]?.id ?? null,
    canvasScrollTargetPageId: null,
    pageFocusGeneration: 0,
    cursorMode: 'select',
    selectedElementId: null,
    rightPanelTab: 'ai',
    validationErrors: validatedInitial.errors,
    validationWarnings: validatedInitial.warnings,
    canUndo: false,
    canRedo: false,
    commentPlacementActive: false,
    commentTargetElementId: null,
    commentPopoverElementId: null,
    elementCommentsByElementId: {},
    setZoom: (zoom) => set({ zoom }),
    setPosition: (x, y) => set({ positionX: x, positionY: y }),
    resetZoom: () => set({ zoom: 1.0, positionX: 0, positionY: 0 }),
    setFormPages: (updater) => set((state) => {
        const nextCandidate =
            typeof updater === "function"
                ? (updater as (prev: FormPage[]) => FormPage[])(state.formPages)
                : updater
        const result = validateAndNormalizeForm(nextCandidate)

        if (!result.ok) {
            return {
                validationErrors: result.errors,
                validationWarnings: result.warnings,
            }
        }

        if (result.value === state.formPages) {
            return {
                formPages: state.formPages,
                validationErrors: result.errors,
                validationWarnings: result.warnings,
            }
        }

        const nextPast = [...state.pastFormPages, state.formPages]
        const boundedPast =
            nextPast.length > HISTORY_LIMIT
                ? nextPast.slice(nextPast.length - HISTORY_LIMIT)
                : nextPast

        return {
            formPages: result.value,
            pastFormPages: boundedPast,
            futureFormPages: [],
            validationErrors: result.errors,
            validationWarnings: result.warnings,
            canUndo: boundedPast.length > 0,
            canRedo: false,
        }
    }),
    setCurrentPageId: (pageId) => set({ currentPageId: pageId }),
    focusFormPageInEditor: (pageId) =>
        set((state) => ({
            currentPageId: pageId,
            selectedElementId: null,
            canvasScrollTargetPageId: pageId,
            pageFocusGeneration: state.pageFocusGeneration + 1,
        })),
    consumeCanvasScrollTarget: () => set({ canvasScrollTargetPageId: null }),
    setCursorMode: (mode) => set({ cursorMode: mode }),
    setSelectedElementId: (elementId) => set({ selectedElementId: elementId }),
    setRightPanelTab: (tab) => set({ rightPanelTab: tab }),
    updateElementById: (pageId, elementId, updater) =>
        set((state) => {
            const targetPage = state.formPages.find((page) => page.id === pageId)
            const targetElement = targetPage?.elements.find((element) => element.id === elementId)
            if (!targetElement) return state

            const nextElement = updater(targetElement)
            const nextCandidate = state.formPages.map((page) =>
                page.id === pageId
                    ? {
                        ...page,
                        elements: page.elements.map((element) =>
                            element.id === elementId ? nextElement : element
                        ),
                    }
                    : page
            )
            const result = validateAndNormalizeForm(nextCandidate)

            if (!result.ok) {
                return {
                    validationErrors: result.errors,
                    validationWarnings: result.warnings,
                }
            }

            const nextPast = [...state.pastFormPages, state.formPages]
            const boundedPast =
                nextPast.length > HISTORY_LIMIT
                    ? nextPast.slice(nextPast.length - HISTORY_LIMIT)
                    : nextPast

            return {
                rightPanelTab: 'properties',
                selectedElementId: elementId,
                formPages: result.value,
                pastFormPages: boundedPast,
                futureFormPages: [],
                validationErrors: result.errors,
                validationWarnings: result.warnings,
                canUndo: boundedPast.length > 0,
                canRedo: false,
            }
        }),
    undo: () =>
        set((state) => {
            if (state.pastFormPages.length === 0) return state

            const previousFormPages = state.pastFormPages[state.pastFormPages.length - 1]
            const nextPast = state.pastFormPages.slice(0, -1)
            const nextFuture = [state.formPages, ...state.futureFormPages]
            const result = validateAndNormalizeForm(previousFormPages)

            return {
                formPages: result.ok ? result.value : previousFormPages,
                pastFormPages: nextPast,
                futureFormPages: nextFuture,
                validationErrors: result.errors,
                validationWarnings: result.warnings,
                canUndo: nextPast.length > 0,
                canRedo: nextFuture.length > 0,
            }
        }),
    redo: () =>
        set((state) => {
            if (state.futureFormPages.length === 0) return state

            const [nextFormPages, ...remainingFuture] = state.futureFormPages
            const nextPast = [...state.pastFormPages, state.formPages]
            const boundedPast =
                nextPast.length > HISTORY_LIMIT
                    ? nextPast.slice(nextPast.length - HISTORY_LIMIT)
                    : nextPast
            const result = validateAndNormalizeForm(nextFormPages)

            return {
                formPages: result.ok ? result.value : nextFormPages,
                pastFormPages: boundedPast,
                futureFormPages: remainingFuture,
                validationErrors: result.errors,
                validationWarnings: result.warnings,
                canUndo: boundedPast.length > 0,
                canRedo: remainingFuture.length > 0,
            }
        }),
    clearValidationIssues: () => set({ validationErrors: [], validationWarnings: [] }),
    setCommentPlacementActive: (active) =>
        set(() => ({
            commentPlacementActive: active,
            ...(!active
                ? {
                      commentTargetElementId: null,
                      commentPopoverElementId: null,
                  }
                : {}),
        })),
    setCommentTargetElementId: (elementId) =>
        set({ commentTargetElementId: elementId }),
    setCommentPopoverElementId: (elementId) =>
        set({ commentPopoverElementId: elementId }),
    addElementComment: (elementId, text) =>
        set((state) => {
            const comment = createElementComment(text)
            if (!comment.text) return state
            const prev = state.elementCommentsByElementId[elementId] ?? []
            return {
                elementCommentsByElementId: {
                    ...state.elementCommentsByElementId,
                    [elementId]: [...prev, comment],
                },
            }
        }),
    removeElementComment: (elementId, commentId) =>
        set((state) => {
            const prev = state.elementCommentsByElementId[elementId] ?? []
            const next = prev.filter((comment) => comment.id !== commentId)
            if (next.length === prev.length) return state
            const nextMap = { ...state.elementCommentsByElementId }
            if (next.length === 0) {
                delete nextMap[elementId]
            } else {
                nextMap[elementId] = next
            }
            return {
                elementCommentsByElementId: nextMap,
            }
        }),
}))

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>
}