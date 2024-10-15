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
    return `#${f(0)}${f(8)}${f(4)}`.toUpperCase(); // Convert to uppercase
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
        `<i class="fas fa-unlock" style="color: ${contrastColor};"></i>`; // Font Awesome icons

    colorBlock.innerHTML = `
        <div class="color-content">
            <button class="button delete-btn" style="color: ${contrastColor}">
                <i class="fas fa-times"></i> <!-- Font Awesome delete icon -->
            </button>
            <button class="button copy-btn" style="color: ${contrastColor}">
                <i class="fas fa-copy" style="color: ${contrastColor};"></i> <!-- Font Awesome copy icon -->
            </button>
            <button class="button lock-btn" style="color: ${contrastColor}">
                ${lockIcon}
            </button>
            <div class="color-info" style="color: ${contrastColor}">
                <div class="color-hex">${hexColor}</div>
            </div>
        </div>
    `;

    colorBlock.querySelector('.delete-btn').addEventListener('click', () => deleteColor(index));
    colorBlock.querySelector('.lock-btn').addEventListener('click', () => toggleLock(index));
    colorBlock.querySelector('.copy-btn').addEventListener('click', () => copyToClipboard(hexColor)); // Add copy functionality

    return colorBlock;
}

function renderColors() {
    colorPalette.innerHTML = '';
    colors.forEach((color, index) => {
        const colorBlock = createColorBlock(color, index);
        colorPalette.appendChild(colorBlock);
    });
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
