const babel = require('@babel/core')
const plugin = require('../')
const fs = require('fs')
const path = require('path')
const react = require('@babel/plugin-transform-react-jsx')

test('basic', () => {
  const { content, filename } = loadFixture('basic')
  const { code } = babel.transform(content, {
    plugins: [react, [plugin, { componentName: 'Test', propName: 'path' }]],
    filename
  })
  expect(code).toMatchSnapshot()
})

test('resolveFrom option', () => {
  const { content, filename } = loadFixture('resolve-from')
  const { code } = babel.transform(content, {
    plugins: [
      react,
      [
        plugin,
        {
          componentName: 'Test',
          propName: 'path',
          resolveFrom: path.join(__dirname)
        }
      ]
    ],
    filename
  })
  expect(code).toMatchSnapshot()
})

test('invalid path error', () => {
  const { content, filename } = loadFixture('invalid-path')
  expect(() =>
    babel.transform(content, {
      plugins: [react, [plugin, { componentName: 'Test', propName: 'path' }]],
      filename
    })
  ).toThrow(
    `The component "Test" specified a path prop of "jdfhskdjhf", but no file was found at "/Users/jeff/Sites/babel-plugin-jsx-path-prop/__tests__/fixtures/jdfhskdjhf"\n\nComponent Location: /Users/jeff/Sites/babel-plugin-jsx-path-prop/__tests__/fixtures/invalid-path.js:4:6`
  )
})

function loadFixture(name) {
  const filename = path.join(__dirname, `fixtures/${name}.js`)
  return { content: fs.readFileSync(filename, 'utf8'), filename }
}
