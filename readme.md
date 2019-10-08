# Babel Plugin JSX Path Prop

With this plugin, you can specify the name of a component and one of the component's props that is supposed to contain a file path. The plugin will then resolve the file path's contents and add another prop, `__content` to the component, containing the file's contents.

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

## Options

- `componentName` (required) - name of the jsx component to match against
- `propName` (required) - name of the prop that contains the file path
- `resolveFrom` (optional) - normally files resolve relative to the source file. If you pass a path via this option, files will resolve relative to the passed path
