import dotenv from 'dotenv'
import inputs from './input/index.js'
import InputProcessor from './src/InputProcessor.js'

dotenv.config()
const processor = new InputProcessor()

Object.keys(inputs).forEach((key) => {
  processor.registerList(inputs[key])
})

processor.run()
