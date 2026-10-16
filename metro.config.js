// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// .riv (Rive animation files) bundled as assets — ver components/PoliMascotRive.tsx.
config.resolver.assetExts.push('riv');

module.exports = config;
