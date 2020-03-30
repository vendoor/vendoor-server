function resolve (components) {
  const orderedComponents = [];

  (function innerResolve (components) {
    for (const component of components) {
      if (!Array.isArray(component.dependencies) || component.dependencies.length === 0) {
        orderedComponents.push(component)
      } else {
        innerResolve(component.dependencies)
      }
    }
  })(Object.values(components))

  return orderedComponents
}

module.exports = {
  resolve
}
