declare module '*.vue' {
    import Vue from 'vue'
    export default Vue
}

// Augment global type declarations
declare global {
    // Webpack DefinePlugin variables
    const MOB_DEBUG: boolean
    const process: {
        env: {
            NODE_ENV: 'development' | 'production'
        }
    }
}
