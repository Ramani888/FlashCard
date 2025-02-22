// const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

// /**
//  * Metro configuration
//  * https://facebook.github.io/metro/docs/configuration
//  *
//  * @type {import('metro-config').MetroConfig}
//  */
// const customConfig = {
//   maxWorkers: 8,
//   resolver: {
//     sourceExts: ['jsx', 'js', 'ts', 'tsx', 'json'], // Ensure extensions are correct
//   },
// };

// module.exports = mergeConfig(getDefaultConfig(__dirname), customConfig);

const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const customConfig = {
  maxWorkers: 8,
  resolver: {
    sourceExts: ['jsx', 'js', 'ts', 'tsx', 'json'], // Ensure extensions are correct
    assetExts: [...defaultConfig.resolver.assetExts, 'lottie'], // Merge asset extensions
  },
};

module.exports = mergeConfig(defaultConfig, customConfig);
