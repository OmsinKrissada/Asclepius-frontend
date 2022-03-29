module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'plugin:nuxt/recommended'
  ],
  plugins: [
  ],
  // add your custom rules here
  rules: {
    '@typescript-eslint/no-unused-vars': 'off',
    'semi': 'off',
    'quote-props': 'off',
    'comma-dangle': 'off',
    'vue/multi-word-component-names': 'off',
    'no-trailing-spaces': 'off',
    'node/handle-callback-err': 'off',
  }
};
