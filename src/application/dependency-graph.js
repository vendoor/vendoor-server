function resolve (allComponents) {
  const orderedComponents = [];

  (function innerResolve (components) {
    for (const component of components) {
      if (!Array.isArray(component.dependencies) || component.dependencies.length === 0) {
        if (!orderedComponents.find(c => c.name === component.name)) {
          orderedComponents.push(component)
        }
      } else {
        const dependencyObjects = component.dependencies.map(name => {
          const c = allComponents[name]

          if (!c) {
            throw new Error(`Unknown component detected "${name}" (dependency of ${component.name})`)
          }

          return c
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
