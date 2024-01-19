module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin'],
  };
};

//O PLUGIN REANIMATED PRECISA SER O ÚLTIMO, DE ACORDO COM A DOCUMENTAÇÃO
