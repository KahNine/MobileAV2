const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Polyfill for Node.js versions < 19.9.0
if (typeof URL.canParse !== 'function') {
    URL.canParse = function (url, base) {
        try {
            new URL(url, base);
            return true;
        } catch (e) {
            return false;
        }
    };
}

module.exports = config;
