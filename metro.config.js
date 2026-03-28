const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Add .tflite to the asset extensions so Metro bundles the ML model
config.resolver.assetExts.push("tflite");

module.exports = config;
