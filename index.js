import dotenv from 'dotenv'
import path from 'path'
import lists from './lists/index.js'
import FilterProcessor from './src/FilterProcessor.js'

dotenv.config()
const processor = new FilterProcessor()

Object.keys(lists).forEach((key) => {
  processor.registerList(lists[key].action, lists[key].entries)
})

processor.run()
processor.copy(lists['delete_update'], path.resolve(path.resolve(), 'lists', 'delete.txt'))
processor.copy(lists['archive_update'], path.resolve(path.resolve(), 'lists', 'archive.txt'))
