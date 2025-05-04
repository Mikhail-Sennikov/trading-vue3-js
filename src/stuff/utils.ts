import Const from './constants';

// OHLCV data type
type OHLCV = [number, number, number, number, number, number?];

interface UtilsInterface {
    clamp(num: number, min: number, max: number): number;
    add_zero(i: number | string): string;
    day_start(t: number): number;
    month_start(t: number): number;
    year_start(t: number): number;
    get_year(t?: number): number | undefined;
    get_month(t?: number): number | undefined;
    nearest_a(x: number, array: number[]): [number, number];
    round(num: number, decimals?: number): number;
    strip(number: number): number;
    get_day(t?: number): number | null;
    overwrite<T>(arr: T[], new_arr: T[]): void;
    copy_layout(obj: any, new_obj: any): void;
    detect_interval(ohlcv: OHLCV[]): number;
    get_num_id(id: string): number;
    fast_filter(arr: OHLCV[], t1: number, t2: number): [OHLCV[], number | undefined];
    fast_filter_i(arr: any[], t1: number, t2: number): [any[], number];
    fast_nearest(arr: OHLCV[], t1: number): [number | null, number | null];
    now(): number;
    pause(delay: number): Promise<void>;
    smart_wheel(delta: number): number;
    get_deltaX(event: any): number;
    get_deltaY(event: any): number;
    apply_opacity(c: string, op: number): string;
    parse_tf(smth: string | number): number | undefined;
    index_shift(sub: any[], data: any[]): number;
    measureText(ctx: CanvasRenderingContext2D & { measureTextOrg?: any }, text: string, tv_id: string): { width: number };
    uuid(temp?: string): string;
    uuid2(): string;
    warn(f: () => boolean, text: string, delay?: number): void;
    is_scr_props_upd(n: any, prev: any[]): boolean;
    delayed_exec(v: any): boolean;
    format_name(ov: any): string | undefined;
    xmode(): 'explore' | 'default';
    default_prevented(event: any): boolean;
    is_mobile: boolean;
}

// Binary search replacement for arrayslicer functionality
const binarySearch = (arr: OHLCV[], timestamp: number): number => {
    let low = 0;
    let high = arr.length - 1;

    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const val = arr[mid][0];

        if (val === timestamp) return mid;
        if (val < timestamp) low = mid + 1;
        else high = mid - 1;
    }

    return low > 0 ? low - 1 : 0;
};

const Utils: UtilsInterface = {
    clamp(num, min, max) {
        return num <= min ? min : num >= max ? max : num;
    },

    add_zero(i) {
        return (+i < 10 ? '0' : '') + i;
    },

    // Start of the day (zero millisecond)
    day_start(t) {
        const start = new Date(t);
        return Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate());
    },

    // Start of the month
    month_start(t) {
        const date = new Date(t);
        return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1);
    },

    // Start of the year
    year_start(t) {
        return Date.UTC(new Date(t).getUTCFullYear(), 0, 1);
    },

    get_year(t) {
        return t ? new Date(t).getUTCFullYear() : undefined;
    },

    get_month(t) {
        return t ? new Date(t).getUTCMonth() : undefined;
    },

    // Nearest in array
    nearest_a(x, array) {
        let dist = Infinity;
        let index = -1;
        let val = null;

        for (let i = 0; i < array.length; i++) {
            const currentDist = Math.abs(array[i] - x);
            if (currentDist < dist) {
                dist = currentDist;
                index = i;
                val = array[i];
            }
        }
        return [index, val!];
    },

    round(num, decimals = 8) {
        return parseFloat(num.toFixed(decimals));
    },

    // Strip? No, it's ugly floats in js
    strip(number) {
        return parseFloat(number.toPrecision(12));
    },

    get_day(t) {
        return t ? new Date(t).getUTCDate() : null;
    },

    // Update array keeping the same reference
    overwrite(arr, new_arr) {
        arr.splice(0, arr.length, ...new_arr);
    },

    // Copy layout in reactive way
    copy_layout(obj, new_obj) {
        for (const k in obj) {
            if (Array.isArray(obj[k])) {
                if (obj[k].length !== new_obj[k].length) {
                    this.overwrite(obj[k], new_obj[k]);
                    continue;
                }
                obj[k].forEach((item: any, index: number) => {
                    Object.assign(item, new_obj[k][index]);
                });
            } else {
                Object.assign(obj[k], new_obj[k][k]);
            }
        }
    },

    // Detects candles interval
    detect_interval(ohlcv) {
        const len = Math.min(ohlcv.length - 1, 99);
        let min = Infinity;

        for (let i = 0; i < len; i++) {
            const d = ohlcv[i + 1][0] - ohlcv[i][0];
            if (d < min) min = d;
        }

        // This saves monthly chart from being awkward
        if (min >= Const.MONTH && min <= Const.DAY * 30) {
            return Const.DAY * 31;
        }
        return min;
    },

    // Gets numberic part of overlay id (e.g 'EMA_1' => 1)
    get_num_id(id) {
        return parseInt(id.split('_').pop() || '0', 10);
    },

    // Fast filter. Really fast, like 10X
    fast_filter(arr, t1, t2) {
        if (!arr.length) return [[], undefined];

        try {
            const startIdx = binarySearch(arr, t1);
            const endIdx = binarySearch(arr, t2);
            return [arr.slice(startIdx, endIdx + 1), startIdx];
        } catch (e) {
            // Fallback to filter if binary search fails
            return [arr.filter(x => x[0] >= t1 && x[0] <= t2), 0];
        }
    },

    // Fast filter (index-based)
    fast_filter_i(arr, t1, t2) {
        const i1 = Math.max(Math.floor(t1), 0);
        const i2 = Math.min(Math.floor(t2 + 1), arr.length);
        return [arr.slice(i1, i2), i1];
    },

    // Nearest indexes (left and right)
    fast_nearest(arr, t1) {
        const index = binarySearch(arr, t1);
        return [
            index > 0 ? index - 1 : null,
            index < arr.length ? index : null
        ];
    },

    now() {
        return Date.now();
    },

    pause(delay) {
        return new Promise(resolve => setTimeout(resolve, delay));
    },

    // Limit crazy wheel delta values
    smart_wheel(delta) {
        const abs = Math.abs(delta);
        return abs > 500
            ? (200 + Math.log(abs)) * Math.sign(delta)
            : delta;
    },

    // Parse the original mouse event to find deltaX
    get_deltaX(event) {
        return event.originalEvent?.deltaX / 12 || 0;
    },

    // Parse the original mouse event to find deltaY
    get_deltaY(event) {
        return event.originalEvent?.deltaY / 12 || 0;
    },

    // Apply opacity to a hex color
    apply_opacity(c, op) {
        if (c.length === 7) {
            const alpha = Math.round(op * 255).toString(16).padStart(2, '0');
            return c + alpha;
        }
        return c;
    },

    // Parse timeframe or return value in ms
    parse_tf(smth) {
        return typeof smth === 'string'
            ? Const.map_unit[smth as keyof typeof Const.map_unit]
    : smth;
    },

    // Detect index shift between the main data sub
    // and the overlay's sub (for IB-mode)
    index_shift(sub, data) {
        if (!data.length) return 0;
        const first = data[0][0];
        let second;

        for (let i = 1; i < data.length; i++) {
            if (data[i][0] !== first) {
                second = data[i][0];
                break;
            }
        }

        for (let j = 0; j < sub.length; j++) {
            if (sub[j][0] === second) {
                return j - (second !== undefined ? 1 : 0);
            }
        }
        return 0;
    },

    // Fallback fix for Brave browser
    // https://github.com/brave/brave-browser/issues/1738
    measureText(ctx, text, tv_id) {
        const m = ctx.measureTextOrg?.(text) ?? ctx.measureText(text);
        if (m.width === 0) {
            const el = document.getElementById('tvjs-measure-text') ||
                document.createElement('div');
            el.id = 'tvjs-measure-text';
            el.style.position = 'absolute';
            el.style.top = '-1000px';
            el.style.font = ctx.font;
            el.textContent = text.replace(/ /g, '.');
            document.getElementById(tv_id)?.appendChild(el);
            return { width: el.offsetWidth };
        }
        return m;
    },

    uuid(temp = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx') {
        return temp.replace(/[xy]/g, c => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },

    uuid2() {
        return this.uuid('xxxxxxxxxxxx');
    },

    // Delayed warning, f = condition lambda fn
    warn(f, text, delay = 0) {
        setTimeout(() => {
            if (f()) console.warn(text);
        }, delay);
    },

    // Checks if script props updated
    // (and not style settings or something else)
    is_scr_props_upd(n, prev) {
        const p = prev.find(x => x.v.$uuid === n.v.$uuid);
        return p?.p?.settings?.$props?.some((x: string) => n.v[x] !== p.v[x]) ?? false;
    },

    // Checks if it's time to make a script update
    // (based on execInterval in ms)
    delayed_exec(v) {
        if (!v.script?.execInterval) return true;
        const t = Date.now();
        if (!v.settings.$last_exec || t > v.settings.$last_exec + v.script.execInterval) {
            v.settings.$last_exec = t;
            return true;
        }
        return false;
    },

    // Format names such as 'RSI, $length', where
    // length - is one of the settings
    format_name(ov: any): string | undefined {
        return ov.name?.replace(/\$(\w+)/g, (_: string, k: string) =>
            ov.settings?.[k] ?? ''
        )
    },

    // Default cursor mode
    xmode() {
        return this.is_mobile ? 'explore' : 'default';
    },

    default_prevented(event) {
        return event.original?.defaultPrevented ?? event.defaultPrevented;
    },

    // Mobile detection
    is_mobile: (() => {
        const w = window as any
        return 'onorientationchange' in w && (
            !!navigator.maxTouchPoints ||
            !!('msMaxTouchPoints' in navigator && (navigator as any).msMaxTouchPoints) ||
            'ontouchstart' in w ||
            (w.DocumentTouch && document instanceof w.DocumentTouch)
        )
    })()
};

export default Utils;
