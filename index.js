import dotenv from 'dotenv'
import lists from './lists/index.js'
import FilterProcessor from './src/FilterProcessor.js'

dotenv.config()
const processor = new FilterProcessor()

Object.keys(lists).forEach((key) => {
  processor.registerList(lists[key].action, lists[key].entries)
})

processor.run()
