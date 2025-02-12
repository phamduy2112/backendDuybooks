module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'prettier'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    // Tắt tất cả các quy tắc của ESLint
    'no-console': 'off',
    'no-debugger': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    'prettier/prettier': 'off', // Tắt Prettier
    'no-undef': 'off', // Tắt các lỗi không xác định
    'no-unused-vars': 'off', // Tắt cảnh báo về biến không sử dụng
    'quotes': 'off', // Tắt cảnh báo về dấu nháy (single vs double)
    'semi': 'off', // Tắt cảnh báo về dấu chấm phẩy
    'comma-dangle': 'off', // Tắt cảnh báo về dấu phẩy cuối dòng
    // Bạn có thể thêm các quy tắc khác ở đây nếu muốn tắt thêm lỗi
  },
};
