# BusinessAI - Project Setup Guide

Welcome to the BusinessAI project! This guide will help you set up and run the project from scratch, even if you're a beginner.

## Prerequisites

- **Node.js** (v18 or newer) or **Bun** (recommended for this project) or you can use any package manager like, **YARN** or **pnpm**
- **Git** (to clone the repository)

## 1. Clone the Repository

Open your terminal and run:

```
git clone git@github.com:JaznanOfficial/ai-digital-business-builder.git
cd ai-digital-business-builder
```

## 2. Install Dependencies

If you are using **Bun** (recommended):

```
bun install
```

If you are using **npm**:

```
npm install
```

If you are using **pnpm**:

```
pnpm install
```

If you are using **yarn**:

```
yarn install
```

## 3. Environment Variables

Create a `.env` file in the root of your project for any environment variables you may need. For now, you can leave it empty or add variables as your project grows.

## 4. Run the Development Server

With **Bun**:

```
bun run dev
```

With **npm**:

```
npm run dev
```

or whatever your package manager use it instead of bun or npm

The app will be running at [http://localhost:3000](http://localhost:3000)

## 5. Project Structure

- `app/` - Main application pages and routes
- `components/` - Reusable UI components
- `public/` - Static assets (images, icons, etc.)
- `styles/` - Global styles (Tailwind CSS)

## 6. Customization

- Update the UI and logic in the `app/` and `components/` folders as needed.
- Forms are validated with [Zod](https://zod.dev/).
- Authentication is currently disabled. You can enable it or add your own logic as needed.

## 7. Useful Commands

- **Start dev server:** `bun run dev` or `npm run dev`
- **Build for production:** `bun run build` or `npm run build`
- **Lint code:** `bun run lint` or `npm run lint`

## 8. Need Help?

- If you get stuck, check the code comments and this README.
- For more help, search online for [Next.js](https://nextjs.org/docs), [Bun](https://bun.sh/docs), or [React](https://react.dev/learn).

---

Happy coding! 🚀
