interface RGBColor {
    r: number;
    g: number;
    b: number;
}

const MIN_LUMINANCE = 100;

const getRandomInt = (min: number, max: number): number => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
const calculateLuminance = ({ r, g, b }: RGBColor): number => {
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const generateColor = (): RGBColor => {
    return {
        r: getRandomInt(0, 255),
        g: getRandomInt(0, 255),
        b: getRandomInt(0, 255),
    };
};
const generateColor2 = (color1: RGBColor): RGBColor => {
    // Intercanvia els components RGB de color1 com desitges
    const color2: RGBColor = {
        r: color1.g,
        g: color1.b,
        b: color1.r,
    };
    return color2;
};

const adjustColorBrightness = (color: RGBColor, targetLuminance: number): RGBColor => {
    const currentLuminance = calculateLuminance(color);
        // Si el color és massa fosc, augmenta la lluminositat
        const luminanceDifference = targetLuminance - currentLuminance;
        const scaleFactor = (currentLuminance + luminanceDifference) / currentLuminance;
        // Augmenta els components RGB proporcionalment
        const adjustedColor: RGBColor = {
            r: Math.min(255, color.r * scaleFactor),
            g: Math.min(255, color.g * scaleFactor),
            b: Math.min(255, color.b * scaleFactor),
        };
        return adjustedColor;
    

};

const randomCanvasColors = (): [string, string] => {
    // Genera color1
    let color1 = generateColor();

    while (calculateLuminance(color1) > MIN_LUMINANCE) {
        // console.log('a');    
        color1 = generateColor();
    }

    // Ajusta color2 per garantir que sigui més clar si color1 és massa fosc
    const targetLuminance = MIN_LUMINANCE + 30; // Aquí pots ajustar el valor desitjat
    let color2 = generateColor2(color1);
    if (calculateLuminance(color2) < targetLuminance) {
        console.log('entro aquí');
        color2 = adjustColorBrightness(color2, targetLuminance);
    }

    return [
        `rgb(${color1.r}, ${color1.g}, ${color1.b})`,
        `rgb(${color2.r}, ${color2.g}, ${color2.b})`,
    ];
};
//const [color1, color2] = randomCanvasColors();

export default randomCanvasColors;