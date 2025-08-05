# QA Testing Form

A comprehensive quality assurance testing application built with Next.js and shadcn/ui design system.

## 🎨 Design System

This project uses [shadcn/ui](https://ui.shadcn.com) - a beautifully designed component library that provides a solid foundation for building modern web applications.

### Features

- **Modern Design**: Clean, accessible, and customizable components
- **OKLCH Colors**: Advanced color system for better color reproduction
- **Dark Mode Ready**: Built-in dark mode support
- **TypeScript**: Full TypeScript support for better development experience
- **Responsive**: Mobile-first responsive design
- **Accessible**: WCAG compliant components

### Components Available

The project includes a comprehensive set of UI components:

- **Layout**: Card, Container, Grid, Stack
- **Navigation**: Tabs, Breadcrumb, Navigation Menu
- **Forms**: Input, Button, Select, Checkbox, Radio, Switch, Slider
- **Feedback**: Alert, Toast, Progress, Badge
- **Data Display**: Table, Chart, Avatar, Badge
- **Overlay**: Dialog, Popover, Tooltip, Hover Card
- **And many more...**

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd qa-testing-form
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
qa-testing-form/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles with shadcn/ui theme
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page with component showcase
├── components/
│   └── ui/               # shadcn/ui components
├── lib/
│   └── utils.ts          # Utility functions (cn helper)
├── components.json        # shadcn/ui configuration
├── tailwind.config.ts    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

## 🎯 Key Features

### Design System Implementation

- **OKLCH Color Space**: Modern color system for better color reproduction
- **CSS Variables**: Dynamic theming with CSS custom properties
- **Component Variants**: Flexible component styling with class-variance-authority
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessibility**: WCAG compliant components

### QA Testing Features

- **Comprehensive Forms**: Systematic testing documentation
- **Real-time Validation**: Form validation with react-hook-form
- **Data Persistence**: Supabase integration for data storage
- **Export Capabilities**: PDF generation for test reports
- **Responsive Interface**: Works on all device sizes

## 🛠️ Technology Stack

- **Framework**: Next.js 15
- **Styling**: Tailwind CSS with shadcn/ui
- **Language**: TypeScript
- **Database**: Supabase
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Charts**: Recharts
- **PDF**: jsPDF + html2canvas

## 🎨 Customization

### Theming

The design system uses CSS custom properties for easy theming:

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  /* ... more variables */
}
```

### Adding Components

To add new shadcn/ui components:

1. Use the shadcn/ui CLI:
```bash
npx shadcn@latest add <component-name>
```

2. Or manually copy components from the [shadcn/ui website](https://ui.shadcn.com)

### Styling

- Use Tailwind CSS classes for styling
- Leverage the `cn()` utility for conditional classes
- Follow the design system's spacing and color tokens

## 📱 Responsive Design

The application is built with a mobile-first approach:

- **Mobile**: Optimized for touch interactions
- **Tablet**: Adaptive layouts for medium screens
- **Desktop**: Full-featured experience with advanced interactions

## 🌙 Dark Mode

Built-in dark mode support with automatic theme switching:

```tsx
import { ThemeProvider } from "@/components/theme-provider"

export function App() {
  return (
    <ThemeProvider>
      {/* Your app content */}
    </ThemeProvider>
  )
}
```

## ♿ Accessibility

All components are built with accessibility in mind:

- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Proper ARIA labels and roles
- **Color Contrast**: WCAG AA compliant color ratios
- **Focus Management**: Clear focus indicators

## 📊 Performance

- **Bundle Optimization**: Tree-shaking and code splitting
- **Image Optimization**: Next.js Image component
- **Caching**: Efficient caching strategies
- **Lazy Loading**: Components load on demand

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com) for the beautiful component library
- [Tailwind CSS](https://tailwindcss.com) for the utility-first CSS framework
- [Radix UI](https://www.radix-ui.com) for accessible primitives
- [Lucide](https://lucide.dev) for the icon library

---

Built with ❤️ using Next.js and shadcn/ui
