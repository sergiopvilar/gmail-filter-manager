import fs from 'fs'
import path from 'path'
import _ from 'underscore'
import filters from './filters.json'

function importFile(file) {
  let contents = fs.readFileSync(pathFile(file), 'utf-8')
  return contents.split("\n").filter((e) => !_.isEmpty(e))
}

function pathFile(file) {
  return path.resolve(path.resolve(), 'lists', file)
}

export default {
  delete: {
    entries: importFile('delete.txt'),
    action: 'delete',
    file: pathFile('delete.txt')
  },
  delete_update: {
    entries: importFile('delete_update.txt'),
    action: 'update_delete',
    file: pathFile('delete_update.txt')
  },
  delete_filters: {
    entries: importFile('delete_filters.txt'),
    action: 'delete',
    file: pathFile('delete_filters.txt')
  },
  archive: {
    entries: importFile('archive.txt'),
    action: 'archive',
    file: pathFile('archive.txt')
  },
  archive_update: {
    entries: importFile('archive_update.txt'),
    action: 'update_archive',
    file: pathFile('archive_update.txt')
  },
  archive_filters: {
    entries: importFile('archive_filters.txt'),
    action: 'archive',
    file: pathFile('archive_filters.txt')
  },
  filters: {
    entries: filters,
    action: 'custom'
  }
}
