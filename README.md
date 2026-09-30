# SVG Icon Toolkit

SVG Icon Toolkit is a free, open-source browser-based utility that allows designers and developers to inspect, preview, customize, validate, and export SVG icons locally.

**Repository:** [https://github.com/boytamim/svg-icon-toolkit](https://github.com/boytamim/svg-icon-toolkit)

## Features

- **Upload & Preview:** Drag-and-drop multiple SVG files to view them in a responsive grid.
- **Customization:** Modify the fill color and dimensions of your icons in real-time.
- **Validation:** Basic structure checking to identify malformed SVGs.
- **Exporting:** Download original files or export your customized versions individually or in bulk.
- **Themes:** Toggle between light, dark, and checkerboard backgrounds to see how your icons behave.

## Requirements

No backend, database, or external APIs are required. This is a purely client-side application built with HTML5, CSS3, and Vanilla JavaScript.

## How to Run Locally

You can run this application using any local development server, or by simply opening the `index.html` file in your browser.

### Option 1: Open Directly (Easiest)

1. Clone or download this repository to your local machine.
2. Locate the `index.html` file in the project folder.
3. Double-click it or drag it into your modern web browser (Chrome, Firefox, Safari, Edge).

### Option 2: Using a Local Server

If you have Python installed or use VS Code, you can run a local server:

**Using Python:**
```bash
# Python 3
python -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

**Using Node.js:**
```bash
npx serve .
```

## How to Test Each Feature

1. **Upload:** Drag one or more `.svg` files into the upload area or click "Browse Files".
2. **Preview:** Observe the files appearing in the grid. Test invalid files (like a renamed `.png` or malformed SVG text) to see the validation badge and error state.
3. **Customize:** Use the Size slider to change dimensions and the Color picker to change the icon fills. The preview updates instantly.
4. **Themes:** Click the "Light", "Dark", or "Check" buttons to test icons against different backgrounds.
5. **Export Individual:** On any valid icon card, click "Original" to download the unchanged source, or "Custom" to download the modified version with your current size and color settings.
6. **Export All:** Click the "Export All Custom" button in the sidebar to download all valid icons with the current customizations applied.

## Technologies Used

- HTML5
- CSS3 (with CSS Variables for theming)
- Vanilla JavaScript (DOM manipulation, File API, Blob creation)

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute to this project.
