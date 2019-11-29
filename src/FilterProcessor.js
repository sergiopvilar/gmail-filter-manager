import _ from 'underscore'
import ejs from 'ejs'
import fs from 'fs'
import path from 'path'
import templates from '../templates/index.js'

/**
 * This class is responsible for reading .txt and .json files
 * and export it to Gmail's filter .xml files
 */
export default class FilterProcessor {

  constructor() {
    this.toDelete = []
    this.toUpdateDelete = []
    this.toArchive = []
    this.toUpdateArchive = []
    this.customFilters = []
  }

  get opts() {
    return {
      filterLength: process.env.FILTER_LENGTH || 3,
      filtersPerFile: process.env.FILTERS_PER_FILE || 100,
      archiveLabel: process.env.ARCHIVE_LABEL || 'To Review',
      priorityMail: process.env.PRIORITY_MAIL || 'you@email.com'
    }
  }

  registerList(action, list) {
    const keys = {
      delete: 'toDelete',
      update_delete: 'toUpdateDelete',
      archive: 'toArchive',
      update_archive: 'toUpdateArchive',
      custom: 'customFilters'
    }

    if(typeof keys[action] === 'undefined') throw new Error(`Unsupported action ${action}!`)
    this[keys[action]] = this[keys[action]].concat(list)
  }

  getActionOptions(action) {
    const actionList = {
      delete: { shouldTrash: true },
      archive: { label: this.opts.archiveLabel,  shouldArchive: true }
    }

    return actionList[action.replace('update_', '')]
  }

  getGroupedList(list) {
    let entries = []
    while (list.length > 0) {
      entries.push(list.slice(0, this.opts.filterLength).join(' OR '))
      list = list.slice(this.opts.filterLength)
    }

    return entries
  }

  processList(action, list, summarize = true) {
    let contents = '',
      entries = summarize ? this.getGroupedList(_.uniq(list)) : list,
      subEntries, counter = 0

    while (entries.length > 0) {
      subEntries = entries.slice(0, this.opts.filtersPerFile)
      entries = entries.slice(this.opts.filtersPerFile)
      counter++

      if (subEntries.length === 0 || (subEntries.length === 1 && _.isEmpty(subEntries[0]))) continue

      contents = ejs.render(templates.document, {
        entries: subEntries,
        actions: summarize ? this.getActionOptions(action) : {}
      })

      fs.writeFileSync(path.resolve(path.resolve(), 'output', `${action}_${counter}.xml`), contents, 'utf-8')
    }
  }

  run() {
    this.processList('delete', this.toDelete)
    this.processList('update_delete', this.toUpdateDelete)
    this.processList('archive', this.toArchive)
    this.processList('update_archive', this.toUpdateArchive)
    this.processList('filters', this.customFilters, false)
  }

}
