import fs from 'fs'
import path from 'path'
import _ from 'underscore'
import filters from './filters.json'

function importFile(file) {
  let contents = fs.readFileSync(path.resolve(path.resolve(), 'lists', file), 'utf-8')
  return contents.split("\n").filter((e) => !_.isEmpty(e))
}

export default {
  delete: {
    entries: importFile('delete.txt'),
    action: 'delete'
  },
  delete_update: {
    entries: importFile('delete_update.txt'),
    action: 'update_delete'
  },
  delete_filters: {
    entries: importFile('delete_filters.txt'),
    action: 'delete'
  },
  archive: {
    entries: importFile('archive.txt'),
    action: 'archive'
  },
  archive_update: {
    entries: importFile('archive_update.txt'),
    action: 'update_archive'
  },
  archive_filters: {
    entries: importFile('archive_filters.txt'),
    action: 'archive'
  },
  filters: {
    entries: filters,
    action: 'custom'
  }
}
