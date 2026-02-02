# Survay Go

An AI-powered form builder built with Next.js, FastAPI, and Google Gemini 2.1. Create, customize, and publish dynamic forms with an intuitive visual editor and AI assistance.

## 🚀 Features

### Core Functionality
- **Visual Form Builder**: Drag-and-drop interface for creating multi-page forms
- **AI-Powered Assistant**: Chat with Gemini 2.1 to create, modify, and enhance your forms
- **Multi-Page Forms**: Build complex forms with multiple pages and page breaks
- **Real-Time Editing**: Edit form elements directly in the canvas
- **Zoom & Pan**: Navigate large forms with zoom controls (25% - 300%) and pan mode
- **Responsive Design**: Modern UI with dark/light theme support

### Form Field Types

#### Basic Inputs
- Text input
- Textarea (long answer)
- Number input
- Email input
- Phone input

#### Choice Fields
- Radio buttons (single choice)
- Checkboxes (multiple choice)
- Dropdown/Select

#### Advanced Fields
- Date picker
- Time picker
- Address input
- URL input

#### File & Media
- File upload (with file type restrictions and size limits)
- Image upload
- Media display (images/videos)

#### Layout & Display
- Headings (H1-H6)
- Description text
- Dividers
- Page breaks
- Media embeds

### Editor Features
- **Cursor Modes**: Switch between Select and Pan modes
- **Floating Toolbar**: Quick access to add elements, change cursor mode, and share forms
- **Page Navigation**: Automatic page detection based on viewport visibility
- **Element Panel**: Organize and manage form elements
- **Undo/Redo**: History management (UI ready)
- **Publish**: Share and publish forms (UI ready)

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.5.4 (App Router)
- **Language**: TypeScript 5
- **UI Library**: React 19.1.0
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui (Radix UI primitives)
- **State Management**: Zustand 5.0.8
- **Animations**: Framer Motion 12.23.22
- **Icons**: 
  - Lucide React
  - Tabler Icons
- **Form Handling**: Custom form builder implementation
- **Zoom/Pan**: react-zoom-pan-pinch 3.7.0
- **Notifications**: Sonner 2.0.7
- **HTTP Client**: Axios 1.12.2
- **Theme**: next-themes 0.4.6

### Development Tools
- **Linter/Formatter**: Biome 2.2.0
- **Package Manager**: npm
- **Type Checking**: TypeScript strict mode

## 📁 Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── dashboard/          # Dashboard routes
│   │   ├── account/        # User account page
│   │   ├── new/            # Form editor page
│   │   └── recents/        # Recent forms page
│   ├── layout.tsx          # Root layout with theme provider
│   └── page.tsx            # Landing page
├── components/             # React components
│   ├── ui/                 # shadcn/ui components
│   ├── chat/               # AI chat interface
│   │   ├── bubble.tsx      # Chat message bubbles
│   │   ├── input.tsx       # Chat input component
│   │   └── panel.tsx       # Chat panel container
│   ├── editable/           # Editable form elements
│   │   ├── container.tsx   # Element container wrapper
│   │   └── wrapper.tsx     # Element wrapper
│   ├── form/               # Form builder components
│   │   ├── element-panel.tsx
│   │   ├── element-renderer.tsx
│   │   └── tabs.tsx
│   ├── tools/              # Editor tools
│   │   └── toolbar.tsx     # Floating toolbar
│   ├── app-sidebar.tsx     # Main sidebar navigation
│   ├── nav-*.tsx           # Navigation components
│   └── theme-*.tsx         # Theme components
├── contexts/               # React contexts
│   ├── app.tsx             # Main app state (Zustand store)
│   └── auth.tsx            # Authentication context
├── hooks/                  # Custom React hooks
│   └── use-mobile.ts       # Mobile detection hook
├── lib/                    # Utilities and types
│   ├── types/              # TypeScript type definitions
│   │   ├── fields/         # Form field type definitions
│   │   │   ├── base.ts
│   │   │   ├── basic.ts
│   │   │   ├── choice.ts
│   │   │   ├── advanced.ts
│   │   │   ├── file-media.ts
│   │   │   ├── layout-display.ts
│   │   │   └── index.ts
│   │   └── page.ts         # Page type definitions
│   └── utils.ts            # Utility functions
├── public/                 # Static assets
└── package.json            # Dependencies and scripts
```

## 🚦 Getting Started

### Prerequisites
- Node.js 20+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run Biome linter
- `npm run format` - Format code with Biome

## 🏗️ Architecture

### State Management
The app uses Zustand for global state management. The main store (`contexts/app.tsx`) manages:
- Form pages and elements
- Zoom level and pan position
- Current page ID
- Cursor mode (select/pan)

### Form Structure
Forms are organized as:
- **Pages**: Multiple pages can be created with unique IDs
- **Elements**: Each page contains an array of form elements
- **Types**: Elements are strongly typed with TypeScript

### Component Architecture
- **UI Components**: Reusable shadcn/ui components in `components/ui/`
- **Feature Components**: Domain-specific components (chat, form, tools)
- **Layout Components**: Sidebar, navigation, and layout wrappers
- **Context Providers**: App state and theme providers

### AI Integration
- Chat panel integrated with Google Gemini 2.1
- Session memory linked to each project
- AI assistant can create, modify, and publish forms

## 🎨 Styling

- **Tailwind CSS 4**: Utility-first CSS framework
- **CSS Variables**: Theme-aware color system
- **Dark Mode**: Full dark/light theme support via next-themes
- **Responsive**: Mobile-first responsive design

## 📝 Code Quality

- **TypeScript**: Strict type checking enabled
- **Biome**: Fast linter and formatter
- **ESLint**: Next.js and React recommended rules
- **Path Aliases**: `@/*` maps to project root

## 🔮 Future Enhancements

Based on the current codebase, planned features include:
- Form responses view
- Form settings panel
- Undo/redo functionality
- Form publishing and sharing
- User authentication
- AI credits system
- Signature pad field
- Password field

## 📄 License

Private project - All rights reserved

---

Built with ❤️ using Next.js, TypeScript, and AI
