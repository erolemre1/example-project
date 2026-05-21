# Interactive Popup Template Builder

This is an interactive, drag-and-drop pop-up template builder specifically designed for interview assessments.

Developed using Vue 3, TypeScript, and Express.js, this project delivers the core requirements of the Trial Project.

## Live Demo

The project has been deployed and is available for live testing:

- **Frontend (Netlify):** [https://interactive-template-builder.netlify.app/](https://interactive-template-builder.netlify.app/)
- **Backend (Render):** [https://example-project-gicp.onrender.com/api/templates](https://example-project-gicp.onrender.com/api/templates)

> **Note:** The backend is hosted on Render's free tier. If the API hasn't been used in a while, it may take around 50 seconds for the server to spin up on the first request. Please be patient during the initial load

## Quick Start

The project is structured as a simple monorepo to make the setup and review process as seamless as possible.

### Prerequisites
- Node.js (v20+ recommended)
- npm (v9+)

### Installation & Running

1. **Install dependencies:**
   ```sh
   npm install

2. **Start the Backend Server:**
Runs the Express server on http://localhost:3001
   ```sh
   npm run server
   
3. **Start the Backend Server:**
Runs the Vue app via Vite (typically on http://localhost:5173)

   ```sh
   npm run dev

4. **Run Tests:**

   ```sh
   npm run test

## Architecture & Technical Decisions

- **Monorepo Approach:** To make the evaluation process easier, both the frontend and backend are housed in a single repository sharing one package.json. The backend is executed directly via tsx, avoiding the need for a separate build step for the Node server.
- **Frontend Stack:** Vue 3 with Composition API and strict TypeScript. Chosen for its excellent reactivity system which is perfect for a canvas-based drag-and-drop tool.
- **State Management:** Used Pinia to manage the canvas state, selected elements, and template properties globally.
- **ID Generation:** Implemented nanoid for generating unique, short IDs for individual canvas elements and templates.
- **Backend:** A lightweight Node.js/Express server. Per the requirements, it uses an in-memory data structure (an array) to store templates without requiring an external database setup.

## Assumptions Made

During development, I made the following assumptions to maintain scope and focus on core functionality:

1. **In-Memory Volatility:** Since the backend uses an in-memory array, all saved templates will be lost when the npm run server process is restarted. This was deemed acceptable based on the "no external DB required" constraint.
2. **Canvas Boundaries:** I assumed that elements dragged partially outside the boundaries should be clipped (overflow: hidden) rather than expanding the canvas.
3. **No Authentication:** I assumed this is a purely internal tool or a localized demo, so no user authentication or session management was implemented.
4. **CORS:** I enabled CORS fully on the backend to allow the Vite dev server to communicate with the Express API without proxy configuration complexities.

## What I Would Improve With More Time

Given the 5-8 hour development constraint, I focused strictly on core functionality, code quality, and TypeScript safety. If I had more time, I would implement the following improvements:

### 1. Refactoring & Architecture
- **Modular Store Architecture:** Currently, the state might be managed in a single monolithic Pinia store. With more time, I would separate this into domain-specific stores based on workflows (e.g., useCanvasStore, useElementStore, useHistoryStore for undo/redo).

- ** Separate Repositories: Currently, the project is structured as a monorepo for ease of review. In a real-world scenario with more time, I would separate the backend into its own repository. This separation of concerns would allow for independent deployment pipelines, easier scaling, and cleaner dependency management.

### 2. Features (Bonus Implementation)
- **Real Database Integration:** Replace the in-memory array with a real database (like PostgreSQL or MongoDB) using an ORM like Prisma or Mongoose for persistent data storage.
- **Z-Index Management:** Add controls to bring elements forward or send them backward, which is crucial for complex visual designs.
- **Grid Snapping:** Implement a snapping mechanism during the drag event for precise, aligned element placement.

### 3. Testing
- **Higher Coverage:** Expand Jest unit tests to cover more edge cases, especially around boundary detection for the draggable elements.
