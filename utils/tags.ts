const arrayToHash = function (objArray: Array<string>) {
  const hash = objArray.reduce(
    (hash: Object, key: string) => Object.assign(hash, { [key]: true }),
    {}
  )
  return hash
}

export { arrayToHash }
