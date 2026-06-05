// Helper rapido da mettere in fondo a layout.tsx per convertire HEX in "R, G, B"

function hexToRgb(hex?: string): string {
    if (!hex) return "0, 0, 0";
    const cleanHex = hex.replace("#", "");
    const num = parseInt(cleanHex, 16);
    return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
}

export default hexToRgb;