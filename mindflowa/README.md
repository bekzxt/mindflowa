# MindFlowa

MindFlowa is a student-focused planning app that creates realistic daily plans based on energy, capacity, and deadlines. It helps users avoid overplanning by enforcing capacity limits based on their self-reported energy levels.

## Features

- **Daily Energy Check**: Select Low, Medium, or High energy to set your capacity for the day.
- **Capacity Constraints**: Visual feedback when tasks exceed your daily energy limit.
- **Urgent Minimum Mode**: Automatically focuses on critical tasks when energy is low.
- **Clean Architecture**: Built with a strictly separated Domain, Data, and Presentation layers.
- **Local Persistence**: All data is saved to your browser's Local Storage.

## tech Stack

- **Frontend**: React, TypeScript, Vite
- **State Management**: Zustand
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **Dates**: date-fns

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm

### Installation

1.  Clone the repository (if you haven't already):
    ```bash
    git clone https://github.com/bekzxt/mindflowa.git
    cd mindflowa
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

### Running the App

Start the development server:

```bash
npm run dev
```

Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`).

### Building for Production

To create a production build:

```bash
npm run build
```

The output will be in the `dist` folder.
