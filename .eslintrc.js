module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  rules: {
    'no-param-reassign': ['error', { props: false }],
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
