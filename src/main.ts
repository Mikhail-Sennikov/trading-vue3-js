import Vue, { VueConstructor } from 'vue';
import App from './App.vue';
import axios from 'axios';

declare const MOB_DEBUG: boolean;

// MOB_DEBUG=true npm run test - Enables mobile debugging
// (sending console output to the webpack terminal)
if (MOB_DEBUG) {
    const debug = (...argv: any[]) => {
        axios.get('/debug', {
            params: {
                argv: JSON.stringify(argv)
            }
        }).catch(() => {});
    };

    console.log = debug;
    console.error = debug;
    console.warn = debug;
}

new Vue({
    el: '#app',
    render: (h) => h(App)
}) as Vue;
