import fs from 'fs'
import path from 'path'
import glob from 'glob'

export default (() => {
  let files = glob.sync(path.resolve(path.resolve(), 'input', '*.xml'), {})
  let returnObjects = {}

  files.forEach((file) => {
    returnObjects[path.basename(file).replace('.xml', '')] = fs.readFileSync(file, 'utf-8')
  })

  return returnObjects
})()
