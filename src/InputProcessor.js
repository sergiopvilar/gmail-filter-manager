import xml2js from 'xml2js'
import fs from 'fs'
import path from 'path'

/**
 * Reads a filter .xml file and writes it's contents to a file that FilterProcessor
 * can understand so this way we mix delete and archive filters from your initial filters
 * together with the new ones
 */
export default class InputProcessor {

  constructor() {
    this.fileList = []
    this.toDelete = []
    this.toArchive = []
    this.toFilter = []
    this.parseCounter = 0
  }

  get opts() {
    return {
      archiveLabel: process.env.ARCHIVE_LABEL || 'To Review',
    }
  }

  registerList(list) {
    this.fileList.push(list)
  }

  hasSender(meta) {
    return typeof this.getFrom(meta) !== 'undefined' && typeof this.getFrom(meta).value !== 'undefined'
  }

  shouldDelete(meta) {
    return meta.filter((m) => m.name === 'shouldTrash').length > 0 && this.hasSender(meta)
  }

  getFrom(meta) {
    return meta.filter((m) => m.name === 'from')[0]
  }

  shouldArchive(meta) {
    return meta.filter((m) => m.name === 'label' && m.value === this.opts.archiveLabel).length > 0 && this.hasSender(meta)
  }

  parseFile() {
    const file = this.fileList[this.parseCounter]
    let meta

    if (this.parseCounter >= this.fileList.length) return this.writeFiles()

    xml2js.parseString(file, (err, result) => {
      result.feed.entry.forEach((entry) => {
        meta = entry['apps:property'].map((e) => e['$'])

        if (this.shouldDelete(meta))
          this.toDelete.push(this.getFrom(meta).value)
        else if (this.shouldArchive(meta))
          this.toArchive.push(this.getFrom(meta).value)
        else
          this.toFilter.push(meta)
      })

      this.parseCounter++
      this.parseFile()
    })

  }

  writeFile(filename, content) {
    fs.writeFileSync(path.resolve(path.resolve(), 'lists', filename), content, 'utf-8')
  }

  writeFiles() {
    this.writeFile('archive_filters.txt', this.toArchive.join("\n"))
    this.writeFile('delete_filters.txt', this.toDelete.join("\n"))
    this.writeFile('filters.json', JSON.stringify(this.toFilter))
  }

  run() {
    this.parseFile()
  }

}
