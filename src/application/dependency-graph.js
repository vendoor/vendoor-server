function resolve (allComponents) {
  const orderedComponents = [];

  (function innerResolve (components) {
    for (const component of components) {
      if (!Array.isArray(component.dependencies) || component.dependencies.length === 0) {
        orderedComponents.push(component)
      } else {
        const dependencyObjects = component.dependencies.map(name => {
          const c = allComponents[name]

          if (!c) {
            throw new Error(`Unknown component detected "${name}" (dependency of ${component.name})`)
          }
        })

        innerResolve(dependencyObjects)
      }
    }
  })(Object.values(allComponents))

  return orderedComponents
}

module.exports = {
  resolve
}
