const colorPalette = document.getElementById('color-palette');

let colors = [];
let lockedColors = [];

function generateRandomColor() {
    return {
        h: Math.floor(Math.random() * 360),
        s: Math.floor(Math.random() * 100),
        l: Math.floor(Math.random() * 100)
    };
}

function hslToHex({ h, s, l }) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

function getContrastColor(h, s, l) {
    return l > 50 ? '#000000' : '#ffffff';
}

function createColorBlock(color, index) {
    const hexColor = hslToHex(color);
    const contrastColor = getContrastColor(color.h, color.s, color.l);

    const colorBlock = document.createElement('div');
    colorBlock.className = 'color-block';
    colorBlock.style.backgroundColor = hexColor;
    colorBlock.setAttribute('data-index', index);

    const lockIcon = lockedColors[index] ? 
        `<i class="fas fa-lock" style="color: ${contrastColor};"></i>` : 
        `<i class="fas fa-unlock" style="color: ${contrastColor};"></i>`;

    colorBlock.innerHTML = `
        <div class="color-content">
            <div class="color-info" style="color: ${contrastColor}">
                <div class="color-hex">${hexColor}</div>
            </div>
            <div class="button-group">
                <button class="button copy-btn" style="color: ${contrastColor}">
                    <i class="fas fa-copy"></i>
                </button>
                <button class="button lock-btn" style="color: ${contrastColor}">
                    ${lockIcon}
                </button>
                <button class="button delete-btn" style="color: ${contrastColor}">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    `;

    colorBlock.querySelector('.delete-btn').addEventListener('click', () => deleteColor(index));
    colorBlock.querySelector('.lock-btn').addEventListener('click', () => toggleLock(index));
    colorBlock.querySelector('.copy-btn').addEventListener('click', () => copyToClipboard(hexColor));

    return colorBlock;
}

function renderColors() {
    colorPalette.innerHTML = '';
    colors.forEach((color, index) => {
        const colorBlock = createColorBlock(color, index);
        colorPalette.appendChild(colorBlock);
    });
    handleResponsiveLayout(); // Add this line to ensure proper layout after rendering
}

function generateNewColors() {
    colors = colors.map((color, index) => lockedColors[index] ? color : generateRandomColor());
    renderColors();
}

function toggleLock(index) {
    lockedColors[index] = !lockedColors[index];
    renderColors();
}

function deleteColor(index) {
    if (colors.length > 1) {
        colors.splice(index, 1);
        lockedColors.splice(index, 1);
        renderColors();
    }
}

for (let i = 0; i < 5; i++) {
    colors.push(generateRandomColor());
    lockedColors.push(false);
}

renderColors();

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        event.preventDefault();
        generateNewColors();
    }
});

function copyToClipboard(hexColor) {
    navigator.clipboard.writeText(hexColor);
}

document.getElementById('download-palette').addEventListener('click', openDownloadDialog);
document.querySelector('.close-button').addEventListener('click', closeDownloadDialog);
document.querySelectorAll('.download-option').forEach(button => {
    button.addEventListener('click', function() {
        const format = this.getAttribute('data-format');
        closeDownloadDialog();
    });
});

function openDownloadDialog() {
    document.getElementById('download-dialog').style.display = 'block';
}

function closeDownloadDialog() {
    document.getElementById('download-dialog').style.display = 'none';
}

function handleResponsiveLayout() {
    const colorBlocks = document.querySelectorAll('.color-block');
    if (window.innerWidth <= 1024) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const footerHeight = document.querySelector('.footer').offsetHeight;
        const availableHeight = window.innerHeight - headerHeight - footerHeight;
        const blockHeight = availableHeight / colors.length;
        colorBlocks.forEach(block => {
            block.style.height = `${blockHeight}px`;
        });
    } else {
        colorBlocks.forEach(block => {
            block.style.height = 'auto';
        });
    }
    showGenerateButton();
}

window.addEventListener('resize', () => {
    handleResponsiveLayout();
    showGenerateButton();
});

function showGenerateButton() {
    const footer = document.querySelector('.footer');
    if (window.innerWidth <= 1024) {
        footer.style.display = 'block';
    } else {
        footer.style.display = 'none';
    }
}

showGenerateButton();

document.getElementById('generate-btn').addEventListener('click', generateNewColors);

// Add these functions to the existing JavaScript file

function openViewDialog() {
    const viewDialog = document.getElementById('view-dialog');
    const paletteDetails = document.getElementById('palette-details');
    const colorPreview = document.getElementById('color-preview');
    const colorDetails = document.getElementById('color-details');
    paletteDetails.innerHTML = '';

    colors.forEach((color, index) => {
        const hexColor = hslToHex(color);
        const colorDiv = document.createElement('div');
        colorDiv.className = 'color-preview';
        colorDiv.style.backgroundColor = hexColor;
        colorDiv.addEventListener('click', () => {
            colorPreview.style.backgroundColor = hexColor;
            colorDetails.innerHTML = `
                <strong>Color ${index + 1}</strong><br>
                HEX: ${hexColor}<br>
                HSL: ${color.h}, ${color.s}%, ${color.l}%
            `;
        });
        paletteDetails.appendChild(colorDiv);
    });

    // Optionally, select the first color by default
    if (colors.length > 0) {
        const firstColorHex = hslToHex(colors[0]);
        colorPreview.style.backgroundColor = firstColorHex;
        colorDetails.innerHTML = `
            <strong>Color 1</strong><br>
            HEX: ${firstColorHex}<br>
            HSL: ${colors[0].h}, ${colors[0].s}%, ${colors[0].l}%
        `;
    }

    viewDialog.style.display = 'block';
}

function closeViewDialog() {
    document.getElementById('view-dialog').style.display = 'none';
}

document.getElementById('view-palette').addEventListener('click', openViewDialog);
document.querySelectorAll('.close-button').forEach(button => {
    button.addEventListener('click', closeViewDialog);
});

window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        closeViewDialog();
        closeDownloadDialog();
    }
});
