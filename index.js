const fs = require('fs')
const path = require('path')

module.exports = function importGlobArrayPlugin(babel) {
  const { types: t } = babel
  return {
    visitor: {
      JSXElement(_path, state) {
        const { componentName, propName, resolveFrom, targetPropName } = state.opts

        // filter for jsx element name matches
        const elementName = _path.node.openingElement.name.name
        if (!elementName === componentName) return

        // filter for prop name matches
        const props = _path.node.openingElement.attributes
        const matchedProp = props.find(
          prop => prop.name && prop.name.name === propName
        )
        if (!matchedProp) return

        let targetPropValue = '__content';
        if (targetPropName) {
          const matchedTargetProp = props.find(
            prop => prop.name && prop.name.name === targetPropName
          );
          if (!matchedTargetProp) {
            throw new Error(
              `The component "${componentName}" specified a target path prop of "${targetPropName}", but no prop was found\n\nComponent Location: ${state.file.opts.filename}:${_path.node.loc.start.line}:${_path.node.loc.start.column}`
            )
          }
          targetPropValue = matchedTargetProp.value.value;
        }

        // use the prop value to read the file contents
        const propFilePath = matchedProp.value.value
        const rootDir = resolveFrom
          ? resolveFrom
          : path.dirname(state.file.opts.filename)
        const fullFilePath = path.join(rootDir, propFilePath)
        let content
        try {
          content = fs.readFileSync(fullFilePath, 'utf8')
        } catch (err) {
          throw new Error(
            `The component "${componentName}" specified a path prop of "${propFilePath}", but no file was found at "${fullFilePath}"\n\nComponent Location: ${state.file.opts.filename}:${_path.node.loc.start.line}:${_path.node.loc.start.column}`
          )
        }

        // build the target value prop and add to the jsx element's props
        const contentProp = t.JSXAttribute(
          t.JSXIdentifier(targetPropValue),
          t.stringLiteral(content)
        )

        props.push(contentProp)
      }
    }
  }
}
