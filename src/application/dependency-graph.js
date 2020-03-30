function resolve (componentRegistry) {
  const orderedComponents = []

  for (const componentName of Object.keys(componentRegistry)) {
    innerResolve([componentName], componentRegistry[componentName].dependencies)

    pushComponent(orderedComponents, componentRegistry[componentName])
  }

  return orderedComponents

  function innerResolve (resolutionStack, dependencyNamesOfCurrentComponent) {
    for (const dependencyName of dependencyNamesOfCurrentComponent) {
      guardCyclicDependencies(resolutionStack, dependencyName)

      const dependency = componentRegistry[dependencyName]

      guardUnknownDependency(resolutionStack, dependencyName, dependency)

      if (Array.isArray(dependency.dependencies)) {
        resolutionStack.push(dependencyName)

        innerResolve(resolutionStack, dependency.dependencies)
      }

      pushComponent(orderedComponents, dependency)
    }
  }
}

function guardCyclicDependencies (resolutionStack, dependencyName) {
  if (resolutionStack.includes(dependencyName)) {
    throw new Error(`Cyclic dependencies detected: ${resolutionStack.join(' -> ')} -> ${dependencyName}`)
  }
}

function guardUnknownDependency (resolutionStack, dependencyName, dependency) {
  const parent = resolutionStack.length === 0
    ? '* top level which should not happen'
    : resolutionStack[resolutionStack.length - 1]

  if (!dependency) {
    throw new Error(`Unknown component detected "${dependencyName}" (dependency of ${parent})`)
  }
}

function pushComponent (orderedComponents, component) {
  if (!orderedComponents.find(c => c.name === component.name)) {
    orderedComponents.push(component)
  }
}

module.exports = {
  resolve
}
