module.exports = {
  babel: {
    plugins: ['@emotion/babel-plugin']
  },
  webpack: {
    configure: (config) => {
      // @react-three/drei depends on @mediapipe/tasks-vision, which references a source map it
      // doesn't publish. The warning is harmless but fails builds when CI=true.
      config.ignoreWarnings = [...(config.ignoreWarnings || []), /Failed to parse source map/];
      // Lazy chunks load through webpack's own Trusted Types policy, the only one the CSP allows
      // (see the Content-Security-Policy in public/index.html)
      config.output.trustedTypes = { policyName: 'webpack' };
      return config;
    }
  }
};
