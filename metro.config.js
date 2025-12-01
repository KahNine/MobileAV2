const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

const { resolver } = config;
resolver.sourceExts = resolver.sourceExts.filter((ext) => ext !== "wasm");
resolver.assetExts.push("wasm");

if (typeof URL.canParse !== "function") {
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
