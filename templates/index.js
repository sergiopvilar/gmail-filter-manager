import fs from 'fs'
import path from 'path'

function importFile(file) {
  return fs.readFileSync(path.resolve(path.resolve(), 'templates', file), 'utf-8')
}

export default {
  document: importFile('document.ejs'),
}
