document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const uploadError = document.getElementById('upload-error');
    const previewGrid = document.getElementById('preview-grid');
    const emptyState = document.getElementById('empty-state');
    const fileCount = document.getElementById('file-count');
    const controlsSection = document.getElementById('controls-section');
    
    // Controls
    const sizeInput = document.getElementById('icon-size');
    const sizeValue = document.getElementById('size-value');
    const colorInput = document.getElementById('icon-color');
    const colorHex = document.getElementById('color-hex');
    const bgToggles = document.querySelectorAll('.toggle-btn[data-bg]');
    const resetBtn = document.getElementById('reset-btn');
    const exportAllBtn = document.getElementById('export-all-btn');

    // State
    let svgFiles = []; 
    const defaults = {
        size: 48,
        color: '#e2e8f0',
        bg: 'checkerboard'
    };
    let currentBgClass = `preview-bg-${defaults.bg}`;

    // Initialize
    function init() {
        setupEventListeners();
    }

    function setupEventListeners() {
        // Drag and Drop
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('dragover');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            handleFiles(e.dataTransfer.files);
        });

        // File Input
        fileInput.addEventListener('change', (e) => {
            handleFiles(e.target.files);
            fileInput.value = ''; 
        });

        // Controls
        sizeInput.addEventListener('input', (e) => {
            sizeValue.textContent = e.target.value;
            applyCustomizations();
        });

        colorInput.addEventListener('input', (e) => {
            colorHex.textContent = e.target.value.toLowerCase();
            applyCustomizations();
        });

        bgToggles.forEach(btn => {
            btn.addEventListener('click', (e) => {
                bgToggles.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                setPreviewBackground(btn.dataset.bg);
            });
        });

        resetBtn.addEventListener('click', resetCustomizations);
        exportAllBtn.addEventListener('click', exportAllCustom);
    }

    function handleFiles(files) {
        uploadError.classList.add('hidden');
        const validFiles = Array.from(files).filter(file => file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg'));
        
        if (validFiles.length === 0) {
            showError('Please upload valid SVG files.');
            return;
        }

        let processedCount = 0;

        validFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target.result;
                processSVG(file.name, content);
                
                processedCount++;
                if (processedCount === validFiles.length) {
                    renderGrid();
                    updateUIState();
                }
            };
            reader.readAsText(file);
        });
    }

    function processSVG(name, content) {
        const id = 'svg_' + Math.random().toString(36).substr(2, 9);
        const { isValid, message, cleanedContent } = validateAndCleanSVG(content);
        
        svgFiles.push({
            id,
            name,
            originalContent: content,
            customContent: isValid ? cleanedContent : content,
            isValid,
            validationMessage: message,
            doc: isValid ? new DOMParser().parseFromString(cleanedContent, 'image/svg+xml') : null
        });
    }

    function validateAndCleanSVG(content) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'image/svg+xml');
        const parserError = doc.querySelector('parsererror');
        
        if (parserError) {
            return { isValid: false, message: 'Invalid XML format', cleanedContent: content };
        }

        const svgElement = doc.querySelector('svg');
        if (!svgElement) {
            return { isValid: false, message: 'Missing <svg> element', cleanedContent: content };
        }

        return { 
            isValid: true, 
            message: 'Valid', 
            cleanedContent: doc.documentElement.outerHTML 
        };
    }

    function renderGrid() {
        if (svgFiles.length === 0) {
            previewGrid.innerHTML = '';
            previewGrid.appendChild(emptyState);
            return;
        }

        if (emptyState.parentNode) {
            emptyState.parentNode.removeChild(emptyState);
        }

        previewGrid.innerHTML = '';
        const template = document.getElementById('svg-card-template');

        svgFiles.forEach(file => {
            const clone = template.content.cloneNode(true);
            const card = clone.querySelector('.svg-card');
            const previewBg = clone.querySelector('.card-preview');
            const wrapper = clone.querySelector('.svg-wrapper');
            const nameEl = clone.querySelector('.file-name');
            const badgeEl = clone.querySelector('.validation-badge');
            const downloadOrigBtn = clone.querySelector('.download-original');
            const downloadCustBtn = clone.querySelector('.download-custom');

            card.dataset.id = file.id;
            nameEl.textContent = file.name;
            nameEl.title = file.name;

            // Apply background class
            previewBg.className = `card-preview ${currentBgClass}`;

            if (file.isValid) {
                wrapper.innerHTML = getCustomizedSVGString(file.doc);
            } else {
                wrapper.innerHTML = `<div style="color:var(--danger); text-align:center; padding:1rem; font-size:0.75rem;">Cannot preview:<br/>${file.validationMessage}</div>`;
                badgeEl.textContent = 'Invalid';
                badgeEl.classList.add('invalid');
                badgeEl.title = file.validationMessage;
                downloadCustBtn.disabled = true;
                downloadCustBtn.style.opacity = '0.5';
                downloadCustBtn.style.cursor = 'not-allowed';
            }

            downloadOrigBtn.addEventListener('click', () => downloadFile(file.originalContent, file.name));
            downloadCustBtn.addEventListener('click', () => {
                if (file.isValid) {
                    const customString = getCustomizedSVGString(file.doc);
                    const newName = file.name.replace('.svg', '-custom.svg');
                    downloadFile(customString, newName);
                }
            });

            previewGrid.appendChild(clone);
        });
    }

    function getCustomizedSVGString(doc) {
        if (!doc) return '';
        const cloneDoc = doc.cloneNode(true);
        const svg = cloneDoc.querySelector('svg');
        
        if (svg) {
            const size = sizeInput.value;
            svg.setAttribute('width', size);
            svg.setAttribute('height', size);

            const color = colorInput.value;
            const elements = svg.querySelectorAll('*');
            
            svg.style.color = color;
            
            elements.forEach(el => {
                const fill = el.getAttribute('fill');
                const stroke = el.getAttribute('stroke');
                
                if (fill && fill !== 'none' && fill !== 'transparent') {
                    el.setAttribute('fill', color);
                }
                if (stroke && stroke !== 'none' && stroke !== 'transparent') {
                    el.setAttribute('stroke', color);
                }
            });
            
            if (!svg.getAttribute('fill') || svg.getAttribute('fill') === 'currentColor') {
                 svg.setAttribute('fill', color);
            }
        }
        
        return cloneDoc.documentElement.outerHTML;
    }

    function applyCustomizations() {
        if (svgFiles.length === 0) return;
        
        svgFiles.forEach(file => {
            if (file.isValid) {
                const card = document.querySelector(`.svg-card[data-id="${file.id}"]`);
                if (card) {
                    const wrapper = card.querySelector('.svg-wrapper');
                    wrapper.innerHTML = getCustomizedSVGString(file.doc);
                }
            }
        });
    }

    function resetCustomizations() {
        sizeInput.value = defaults.size;
        sizeValue.textContent = defaults.size;
        colorInput.value = defaults.color;
        colorHex.textContent = defaults.color;
        
        bgToggles.forEach(b => {
            if(b.dataset.bg === defaults.bg) {
                b.classList.add('active');
            } else {
                b.classList.remove('active');
            }
        });
        setPreviewBackground(defaults.bg);

        applyCustomizations();
    }

    function setPreviewBackground(mode) {
        const newBgClass = `preview-bg-${mode}`;
        
        document.querySelectorAll('.card-preview').forEach(el => {
            el.classList.remove(currentBgClass);
            el.classList.add(newBgClass);
        });
        
        currentBgClass = newBgClass;
    }

    function updateUIState() {
        const count = svgFiles.length;
        fileCount.textContent = `${count} file${count !== 1 ? 's' : ''}`;
        
        if (count > 0) {
            controlsSection.classList.remove('disabled');
        } else {
            controlsSection.classList.add('disabled');
        }
    }

    function showError(message) {
        uploadError.textContent = message;
        uploadError.classList.remove('hidden');
    }

    function downloadFile(content, filename) {
        const blob = new Blob([content], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function exportAllCustom() {
        svgFiles.forEach(file => {
            if (file.isValid) {
                const customString = getCustomizedSVGString(file.doc);
                const newName = file.name.replace('.svg', '-custom.svg');
                downloadFile(customString, newName);
            }
        });
    }

    init();
});
