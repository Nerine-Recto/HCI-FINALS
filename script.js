// Accessibility enhancement functions
function toggleScreenReader() {
    const demoArea = document.getElementById('demo-area');
    demoArea.textContent = demoArea.textContent ? '' : 'Screen Reader Simulation Active';
    announceChange('Screen reader simulation ' + (demoArea.textContent ? 'activated' : 'deactivated'));
}

function toggleColorBlindness() {
    const body = document.body;
    body.classList.toggle('color-blind-mode');
    announceChange('Color blindness simulation ' + (body.classList.contains('color-blind-mode') ? 'activated' : 'deactivated'));
}

function resetAccessibility() {
    // Reset text size to default
    const fontSizeInput = document.getElementById('font-size');
    fontSizeInput.value = 16;
    adjustFontSize(16);

    // Reset contrast to default
    const contrastInput = document.getElementById('contrast');
    contrastInput.value = 1;
    adjustContrast(1);

    // Reset speech rate to default
    const speechRateInput = document.getElementById('speech-rate');
    speechRateInput.value = 1;
    adjustSpeechRate(1);

    // Reset volume to default
    const volumeInput = document.getElementById('volume');
    volumeInput.value = 0.5;
    adjustVolume(0.5);

    // Clear demo area text and reset classes
    document.getElementById('demo-area').textContent = '';
    document.body.classList.remove('color-blind-mode');

    announceChange('All accessibility settings have been reset to default');
}

function toggleSound() {
    const audioStatus = document.body.classList.toggle('audio-enabled');
    announceChange('Sound ' + (audioStatus ? 'enabled' : 'disabled'));
}

function adjustFontSize(size) {
    document.documentElement.style.fontSize = `${size}px`;
    announceChange(`Font size adjusted to ${size} pixels`);
}

function adjustContrast(contrast) {
    document.documentElement.style.filter = `contrast(${contrast})`;
    announceChange(`Contrast adjusted to ${contrast}`);
}

function adjustSpeechRate(rate) {
    announceChange(`Speech rate set to ${rate}`);
}

function adjustVolume(volume) {
    announceChange(`Volume set to ${Math.round(volume * 100)}%`);
}

function announceChange(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.textContent = message;
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
}

// Text-to-Speech function
function speakText() {
    const text = document.getElementById('tts-input').value;
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = parseFloat(document.getElementById('speech-rate').value);
        window.speechSynthesis.speak(utterance);
    } else {
        alert('Text-to-speech is not supported in your browser.');
    }
}

// Color Contrast Analyzer
function analyzeContrast() {
    const foreground = document.getElementById('foreground-color').value;
    const background = document.getElementById('background-color').value;
    const contrast = calculateContrast(foreground, background);
    const resultElement = document.getElementById('contrast-result');
    resultElement.textContent = `Contrast ratio: ${contrast.toFixed(2)}:1`;
    resultElement.style.color = foreground;
    resultElement.style.backgroundColor = background;
    
    const wcagResult = getWCAGCompliance(contrast);
    resultElement.textContent += ` - ${wcagResult}`;
}

function calculateContrast(foreground, background) {
    const rgb1 = hexToRgb(foreground);
    const rgb2 = hexToRgb(background);
    const l1 = getLuminance(rgb1);
    const l2 = getLuminance(rgb2);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
}

function getLuminance(rgb) {
    const a = rgb.map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getWCAGCompliance(contrast) {
    if (contrast >= 7) {
        return 'Passes AAA level';
    } else if (contrast >= 4.5) {
        return 'Passes AA level';
    } else if (contrast >= 3) {
        return 'Passes AA level for large text';
    } else {
        return 'Fails WCAG requirements';
    }
}

// Font Legibility Tester
function updateFontTest() {
    const fontSelect = document.getElementById('font-select');
    const fontSizeTest = document.getElementById('font-size-test');
    const fontTestText = document.getElementById('font-test-text');
    
    fontTestText.style.fontFamily = fontSelect.value;
    fontTestText.style.fontSize = `${fontSizeTest.value}px`;
}

// Event listeners for range inputs
document.getElementById('font-size').addEventListener('input', (e) => adjustFontSize(e.target.value));
document.getElementById('contrast').addEventListener('input', (e) => adjustContrast(e.target.value));
document.getElementById('speech-rate').addEventListener('input', (e) => adjustSpeechRate(e.target.value));
document.getElementById('volume').addEventListener('input', (e) => adjustVolume(e.target.value));

// Event listeners for font tester
document.getElementById('font-select').addEventListener('change', updateFontTest);
document.getElementById('font-size-test').addEventListener('input', updateFontTest);

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', () => {
    adjustFontSize(document.getElementById('font-size').value);
    adjustContrast(document.getElementById('contrast').value);
    adjustSpeechRate(document.getElementById('speech-rate').value);
    adjustVolume(document.getElementById('volume').value);
    updateFontTest();
});

