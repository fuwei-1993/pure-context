export const depsCollection = <T extends Record<string, any> = any>(
  target: T,
) => {
  const uniqueKeys = new Set<string | symbol>()
  return {
    proxyState: new Proxy(target, {
      get(target, key, receiver) {
        if (!uniqueKeys.has(key)) {
          uniqueKeys.add(key)
        }

        return Reflect.get(target, key, receiver)
      },
      set(target, key, newValue, receiver) {
        Reflect.set(target, key, newValue, receiver)
        return true
      },
    }),
    depKeys: uniqueKeys,
  }
}

export const shallowCompareFn = (prevFn: Function, nextFn: Function) => {
  if (isFunction(prevFn) && isFunction(nextFn)) {
    if (nextFn.toString() === prevFn.toString()) {
      return true
    }
  }
  return false
}

export const logger = <T>(key: string, prev: T, next: T) => {
  console.group(
    `%c [pure-context]: %c${key} 发生了变化`,
    'color: gray; font-weight: lighter;',
    'color: black; font-weight: bold;',
  )
  console.log('%c prev', 'color: #9E9E9E; font-weight: bold;', prev)
  console.log('%c next', 'color: #4CAF50; font-weight: bold;', next)
  console.groupEnd()
}
