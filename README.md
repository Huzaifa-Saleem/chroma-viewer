# ChromaDB Viewer

![ChromaDB Viewer](https://img.shields.io/badge/ChromaDB-Viewer-8A2BE2)
![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black)
![License](https://img.shields.io/badge/License-MIT-blue)

A beautiful and intuitive web interface for exploring and visualizing your ChromaDB vector database. ChromaDB Viewer allows you to connect to any ChromaDB instance, browse collections, and explore embeddings with a modern, responsive UI.

## 🚀 Features

- **Connect to any ChromaDB instance**: Local or remote ChromaDB servers
- **Browse collections**: View all collections in your ChromaDB instance
- **Explore data**: View documents, metadata, and embeddings in a clean interface
- **Search functionality**: Filter through your vector data with ease
- **Pagination**: Navigate through large datasets efficiently
- **Sorting**: Sort your data by various fields
- **Responsive design**: Works on desktop and mobile devices
- **Dark mode support**: Easy on the eyes for late-night sessions

## 📋 Prerequisites

- Node.js 18.x or later
- A running ChromaDB instance (local or remote)

## 🛠️ Installation

1. Clone the repository:

```bash
git clone https://github.com/Huzaifa-Saleem/chroma-viewer.git
cd chroma-viewer
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔧 Usage

1. Enter your ChromaDB URL in the connection screen (e.g., `http://localhost:8000`)
2. Browse through your collections
3. Select a collection to view its data
4. Use the search bar to filter data
5. Click on embeddings to expand and view them

## 🏗️ Building for Production

To create an optimized production build:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

## 🧪 Technologies Used

- **Next.js**: React framework for server-rendered applications
- **TypeScript**: For type safety and better developer experience
- **TailwindCSS**: For responsive and beautiful UI
- **ChromaDB Client**: For connecting to ChromaDB instances
- **Axios**: For API requests

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [ChromaDB](https://github.com/chroma-core/chroma) - The open-source embedding database
- [Next.js](https://nextjs.org/) - The React framework
- [TailwindCSS](https://tailwindcss.com/) - For the UI components
