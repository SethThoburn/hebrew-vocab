// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

// Add 'xml' to assetExts
defaultConfig.resolver.assetExts = [...defaultConfig.resolver.assetExts, "xml"];

module.exports = defaultConfig;
