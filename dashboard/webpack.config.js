const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({
  name: "dashboard",
  
  exposes: {
    './Component': './src/app/dashboard.component.ts',
  },

  shared: {
    ...shareAll({ 
      singleton: true, 
      strictVersion: false, 
      requiredVersion: false 
    }),
  },
});