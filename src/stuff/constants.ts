const SECOND = 1000;
const MINUTE = SECOND * 60;
const MINUTE3 = MINUTE * 3;
const MINUTE5 = MINUTE * 5;
const MINUTE15 = MINUTE * 15;
const MINUTE30 = MINUTE * 30;
const HOUR = MINUTE * 60;
const HOUR4 = HOUR * 4;
const HOUR12 = HOUR * 12;
const DAY = HOUR * 24;
const WEEK = DAY * 7;
const MONTH = WEEK * 4;
const YEAR = DAY * 365;

const MONTHMAP = [
    "Jan", "Feb", "Mar", "Apr",
    "May", "Jun", "Jul", "Aug",
    "Sep", "Oct", "Nov", "Dec"
] as const;

// Grid time steps
const TIMESCALES = [
    YEAR * 10, YEAR * 5, YEAR * 3, YEAR * 2, YEAR,
    MONTH * 6, MONTH * 4, MONTH * 3, MONTH * 2, MONTH,
    DAY * 15, DAY * 10, DAY * 7, DAY * 5, DAY * 3, DAY * 2, DAY,
    HOUR * 12, HOUR * 6, HOUR * 3, HOUR * 1.5, HOUR,
    MINUTE30, MINUTE15, MINUTE * 10, MINUTE5, MINUTE * 2, MINUTE
];

// Grid $ steps
const $SCALES = [0.05, 0.1, 0.2, 0.25, 0.5, 0.8, 1, 2, 5];

interface ChartConfigType {
    SBMIN: number;
    SBMAX: number;
    TOOLBAR: number;
    TB_ICON: number;
    TB_ITEM_M: number;
    TB_ICON_BRI: number;
    TB_ICON_HOLD: number;
    TB_BORDER: number;
    TB_B_STYLE: string;
    TOOL_COLL: number;
    EXPAND: number;
    CANDLEW: number;
    GRIDX: number;
    GRIDY: number;
    BOTBAR: number;
    PANHEIGHT: number;
    DEFAULT_LEN: number;
    MINIMUM_LEN: number;
    MIN_ZOOM: number;
    MAX_ZOOM: number;
    VOLSCALE: number;
    UX_OPACITY: number;
    ZOOM_MODE: 'tv' | 'tl';
    L_BTN_SIZE: number;
    L_BTN_MARGIN: string;
    SCROLL_WHEEL: 'prevent' | 'pass' | 'click';
    FONT: string;
}

const ChartConfig: ChartConfigType = {
    SBMIN: 60,       // Minimal sidebar px
    SBMAX: Infinity, // Max sidebar, px
    TOOLBAR: 57,     // Toolbar width px
    TB_ICON: 25,     // Toolbar icon size px
    TB_ITEM_M: 6,    // Toolbar item margin px
    TB_ICON_BRI: 1,  // Toolbar icon brightness
    TB_ICON_HOLD: 420, // ms, wait to expand
    TB_BORDER: 1,    // Toolbar border px
    TB_B_STYLE: 'dotted', // Toolbar border style
    TOOL_COLL: 7,    // Tool collision threshold
    EXPAND: 0.15,    // %/100 of range
    CANDLEW: 0.6,    // %/100 of step
    GRIDX: 100,      // px
    GRIDY: 47,       // px
    BOTBAR: 28,      // px
    PANHEIGHT: 22,   // px
    DEFAULT_LEN: 50, // candles
    MINIMUM_LEN: 5,  // candles,
    MIN_ZOOM: 25,    // candles
    MAX_ZOOM: 1000,  // candles,
    VOLSCALE: 0.15,  // %/100 of height
    UX_OPACITY: 0.9, // Ux background opacity
    ZOOM_MODE: 'tv', // 'tv' or 'tl'
    L_BTN_SIZE: 21,  // Legend Button size, px
    L_BTN_MARGIN: '-6px 0 -6px 0', // css margin
    SCROLL_WHEEL: 'prevent', // 'pass', 'click'
    FONT: `11px -apple-system,BlinkMacSystemFont,
    Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,
    Fira Sans,Droid Sans,Helvetica Neue,
    sans-serif`
};

const IB_TF_WARN =
    `When using IB mode you should specify ` +
    `timeframe ('tf' filed in 'chart' object),` +
    `otherwise you can get an unexpected behaviour`;


type TimeUnit = 
    "1s" | "5s" | "10s" | "20s" | "30s" | 
    "1m" | "3m" | "5m" | "15m" | "30m" | 
    "1H" | "2H" | "3H" | "4H" | "12H" | 
    "1D" | "1W" | "1M" | "1Y";

const MAP_UNIT: Record<TimeUnit, number> = {
    "1s": SECOND,
    "5s": SECOND * 5,
    "10s": SECOND * 10,
    "20s": SECOND * 20,
    "30s": SECOND * 30,
    "1m": MINUTE,
    "3m": MINUTE3,
    "5m": MINUTE5,
    "15m": MINUTE15,
    "30m": MINUTE30,
    "1H": HOUR,
    "2H": HOUR * 2,
    "3H": HOUR * 3,
    "4H": HOUR4,
    "12H": HOUR12,
    "1D": DAY,
    "1W": WEEK,
    "1M": MONTH,
    "1Y": YEAR
};

interface ExportedConstants {
    SECOND: number;
    MINUTE: number;
    MINUTE5: number;
    MINUTE15: number;
    MINUTE30: number;
    HOUR: number;
    HOUR4: number;
    DAY: number;
    WEEK: number;
    MONTH: number;
    YEAR: number;
    MONTHMAP: readonly string[];
    TIMESCALES: number[];
    $SCALES: number[];
    ChartConfig: ChartConfigType;
    map_unit: Record<TimeUnit, number>;
    IB_TF_WARN: string;
}

const exportedConstants: ExportedConstants = {
    SECOND,
    MINUTE,
    MINUTE5,
    MINUTE15,
    MINUTE30,
    HOUR,
    HOUR4,
    DAY,
    WEEK,
    MONTH,
    YEAR,
    MONTHMAP,
    TIMESCALES,
    $SCALES,
    ChartConfig,
    map_unit: MAP_UNIT,
    IB_TF_WARN
};

export default exportedConstants;
