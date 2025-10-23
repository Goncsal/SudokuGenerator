# 🧩 Sudoku PWA - Offline Sudoku Progressive Web App

A fully-featured Progressive Web App for playing Sudoku puzzles offline with multiple difficulty levels, annotations, and game persistence.

## 🚀 Features

### Core Gameplay
- **Sudoku Generator**: Creates puzzles with Easy, Medium, and Hard difficulty levels
- **Interactive Board**: Click to select cells, enter numbers, and navigate with keyboard
- **Annotations/Notes**: Toggle annotation mode to add pencil marks in cells
- **Real-time Validation**: Highlights conflicts and invalid moves
- **Hint System**: Get hints when stuck

### PWA Capabilities
- **Offline First**: Fully functional without internet connection
- **Service Worker**: Caches all assets for offline use
- **Installable**: Add to home screen on mobile and desktop
- **Responsive Design**: Works seamlessly on all device sizes

### Game Management
- **Auto-save**: Automatically saves progress every 30 seconds
- **Manual Save**: Save games manually at any time
- **Load Games**: Resume incomplete games or view completed ones
- **Undo/Redo**: Full history system with undo and redo functionality
- **Timer**: Track your solving time

### User Experience
- **Dark/Light Theme**: Toggle between themes with persistent preference
- **Statistics**: Track your progress, completion rates, and average times
- **Keyboard Support**: Full keyboard navigation and number input
- **Error Highlighting**: Visual feedback for invalid moves

## 🎮 How to Play

### Basic Controls
1. **Select Cell**: Click on any cell to select it
2. **Enter Numbers**: 
   - Click number pad buttons OR
   - Press number keys (1-9) on keyboard
3. **Clear Cell**: 
   - Double-click the cell OR
   - Press Delete/Backspace OR
   - Click the Clear button

### Annotation Mode
1. **Toggle Notes**: Click "📝 Notes" button to enable annotation mode
2. **Add Notes**: Select numbers to add as pencil marks in empty cells
3. **Remove Notes**: Click the same numbers again to remove them

### Keyboard Shortcuts
- **Arrow Keys**: Navigate between cells
- **Numbers 1-9**: Enter numbers or annotations
- **Delete/Backspace**: Clear selected cell

## 🛠️ Getting Started

### Development
```bash
npm start
```
Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it.

### Production Build
```bash
npm run build
```
Builds the app for production to the `build` folder.

### Serve Production Build
```bash
npm install -g serve
serve -s build
```

## 📱 Installation as PWA

### Desktop
1. Open the app in Chrome/Edge
2. Click the install icon in the address bar
3. Or use the install prompt that appears

### Mobile
1. Open the app in mobile browser
2. Tap "Add to Home Screen" when prompted
3. Or use browser menu → "Add to Home Screen"

## 🎯 Technical Features

### Offline Capabilities
- Generate new puzzles offline
- Save and load games offline
- Full gameplay without internet
- Theme preferences persist offline
- Statistics saved locally

### Data Storage
All data is stored locally using IndexedDB:
- **Games**: Puzzle state, progress, timestamps
- **Settings**: Theme preferences, user options
- **Statistics**: Performance metrics and history

## 🔧 Browser Support

- ✅ Chrome 67+ (recommended)
- ✅ Firefox 60+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers with service worker support

---

**Enjoy solving Sudoku puzzles offline! 🧩✨**
