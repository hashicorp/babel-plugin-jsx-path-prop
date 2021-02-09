# Babel Plugin JSX Path Prop

With this plugin, you can specify the name of a component and one of the component's props that is supposed to contain a file path. The plugin will then resolve the file path's contents and add another prop to the component, containing the file's contents. The added prop will default to `__content`, but can be customized.

This allows components to be "filesystem-aware" even on the client side as long as the plugin runs at build time.

## Usage

This plugin can be used in any way that a babel plugin is normally used, for the purpose of examples below we will assume use of a `.babelrc` file.

Given the following code:

```jsx
<Foo filePath='example.txt' />
```

And the following `.babelrc` configuration:

```js
{
  plugins: [
    [
      'babel-plugin-jsx-path-prop',
      { componentName: 'Foo', propName: 'filePath' }
    ]
  ]
}
```

We would see the following result:

```jsx
<Foo
  filePath='example.txt'
  __content='this is the contents of the example.txt file'
/>
```

### Multiple Props

Support for handling multiple props is supported. To handle this, supply an array of configuration options to the plugin. This could allow for multiple component support, or multiple prop support for a single components. To support multiple props on a single component, the `targetPropName` option should be supplied. This configuration will use it's value for the resulting content instead of the default `__content` prop. If not supplied, the target property will default to `__content`. If supplied, but not found on the component, an error will be thrown.

Given the following:

```jsx
<Foo filePath='example.txt' filePathTarget='fileContent' otherPath='other.txt' otherPathTarget='otherContent' />
```

And the following `.babelrc` configuration:

```js
{
  plugins: [
    [
      'babel-plugin-jsx-path-prop',
      [
        { componentName: 'Foo', propName: 'filePath', targetPropName: 'filePathTarget' },
        { componentName: 'Foo', propName: 'otherPath', targetPropName: 'otherPathTarget' }
      ]
    ]
  ]
}
```

We would see the following result:

```jsx
<Foo
  filePath='example.txt'
  fileContent='this is the contents of the example.txt file'
  otherPath='other.txt'
  otherContent='this is the contents of the other.txt file'
/>
```

## Options

- `componentName` (required) - name of the jsx component to match against
- `propName` (required) - name of the prop that contains the file path
- `resolveFrom` (optional) - normally files resolve relative to the source file. If you pass a path via this option, files will resolve relative to the passed path
- `targetPropName` (optional) - the target prop to place the extracted contents into, if not supplied, content will placed into `__content` prop
