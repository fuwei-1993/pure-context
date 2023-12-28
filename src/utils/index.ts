export const depsCollection = <T extends Record<string, any> = any>(
  target: T,
) => {
  const deps = new Set<string | symbol>()
  return {
    proxyState: new Proxy(target, {
      get(target, key, receiver) {
        if (!deps.has(key)) {
          deps.add(key)
        }

        return Reflect.get(target, key, receiver)
      },
      set(target, key, newValue, receiver) {
        console.error(`[pure-context]: 属性${key as string}无法被改变, 请检查`)
        Reflect.set(target, key, newValue, receiver)
        return true
      },
    }),
    deps,
  }
}
