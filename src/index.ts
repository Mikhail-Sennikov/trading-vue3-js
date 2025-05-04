import Vue, { VueConstructor, PluginFunction, PluginObject } from 'vue';
import TradingVue from './TradingVue.vue';
import DataCube from './helpers/datacube';
import Overlay from './mixins/overlay';
import Tool from './mixins/tool';
import Interface from './mixins/interface';
import Utils from './stuff/utils';
import Constants from './stuff/constants';
import Candle from './components/primitives/candle';
import Volbar from './components/primitives/volbar';
import Line from './components/primitives/line';
import Pin from './components/primitives/pin';
import Price from './components/primitives/price';
import Ray from './components/primitives/ray';
import Seg from './components/primitives/seg';
import { layout_cnv, layout_vol } from './components/js/layout_cnv';

// Define primitive types
interface Primitives {
    Candle: typeof Candle;
    Volbar: typeof Volbar;
    Line: typeof Line;
    Pin: typeof Pin;
    Price: typeof Price;
    Ray: typeof Ray;
    Seg: typeof Seg;
}

const primitives: Primitives = {
    Candle, Volbar, Line, Pin, Price, Ray, Seg
};

// Create proper Vue 2 plugin type
type TradingVuePlugin = VueConstructor & PluginObject<never> & {
    install: PluginFunction<never>;
};

// Cast to plugin type with install method
const TradingVueComponent = TradingVue as unknown as TradingVuePlugin;

// Implement install method
TradingVueComponent.install = function(Vue: VueConstructor) {
    Vue.component(TradingVueComponent.name, TradingVueComponent);
};

// Add plugin object properties
(TradingVueComponent as PluginObject<never>).install = TradingVueComponent.install;

// Register globally when included directly in browser
if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(TradingVueComponent);
    (window as any).TradingVueLib = {
        TradingVue: TradingVueComponent,
        Overlay,
        Utils,
        Constants,
        Candle,
        Volbar,
        layout_cnv,
        layout_vol,
        DataCube,
        Tool,
        Interface,
        primitives
    };
}

export default TradingVueComponent;

export {
    TradingVueComponent as TradingVue,
    Overlay,
    Utils,
    Constants,
    Candle,
    Volbar,
    layout_cnv,
    layout_vol,
    DataCube,
    Tool,
    Interface,
    primitives
};

// Global type declarations
declare global {
    interface Window {
        Vue?: VueConstructor;
        TradingVueLib?: {
            TradingVue: typeof TradingVueComponent;
            Overlay: typeof Overlay;
            Utils: typeof Utils;
            Constants: typeof Constants;
            Candle: typeof Candle;
            Volbar: typeof Volbar;
            layout_cnv: typeof layout_cnv;
            layout_vol: typeof layout_vol;
            DataCube: typeof DataCube;
            Tool: typeof Tool;
            Interface: typeof Interface;
            primitives: Primitives;
        };
    }
}
