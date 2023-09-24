interface RGBColor {
    r: number;
    g: number;
    b: number;
}

const getRandomInt = (min: number, max: number): number => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const calculateLuminance = ({ r, g, b }: RGBColor): number => {
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const getColorDistance = (color1: RGBColor, color2: RGBColor): number => {
    return Math.sqrt(
        Math.pow(color1.r - color2.r, 2) +
        Math.pow(color1.g - color2.g, 2) +
        Math.pow(color1.b - color2.b, 2)
    );
};

const generateColor = (): RGBColor => {
    return {
        r: getRandomInt(0, 255),
        g: getRandomInt(0, 255),
        b: getRandomInt(0, 255),
    };
};

const COLORDISTANCE=100;
const COLORLUMINANCE=100;

const randomCanvasColors = (): [string, string] => {
    let color1 = generateColor();

    while (calculateLuminance(color1) > 180) {
        color1 = generateColor();
    }

    let color2 = generateColor();
    while (
        getColorDistance(color1, color2) > COLORDISTANCE ||
        calculateLuminance(color2) > COLORLUMINANCE
    ) {
        color2 = generateColor();
    }

    return [
        `rgb(${color1.r}, ${color1.g}, ${color1.b})`,
        `rgb(${color2.r}, ${color2.g}, ${color2.b})`,
    ];
};


//const [color1, color2] = randomCanvasColors();

export default randomCanvasColors;