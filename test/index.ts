import Vue from 'vue'
import App from './Test.vue'

// Interface for MOB_DEBUG from webpack DefinePlugin
declare const MOB_DEBUG: boolean

// Mobile debug mode
if (MOB_DEBUG) {
    console.log = debug
    console.error = debug
    console.warn = debug
}

new Vue({
    el: '#app',
    render: (h) => h(App)
})

const isDev = process.env.NODE_ENV !== "production"
Vue.config.performance = isDev

function debug(...args: any[]): void {
    try {
        fetch(`/debug?argv=${encodeURIComponent(JSON.stringify(args))}`)
    } catch (e) {
        console.error('Debug send failed:', e)
    }
}
