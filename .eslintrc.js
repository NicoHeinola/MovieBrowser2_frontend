module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    '@vue/typescript/recommended',
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    // Customize/add rules here
    'vue/multi-word-component-names': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'vue/script-indent': ['off'],
  },
}
