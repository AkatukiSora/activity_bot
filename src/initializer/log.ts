import log4js from "log4js"

log4js.configure({
    appenders: {
      out: { type: 'stdout' },
      lowlogs: { type: 'dateFile', filename: 'log/application.log', pattern: '.yyyy-MM-dd', compress: false, },
      highlogs: { type: 'dateFile', filename: 'log/error.log', pattern: '.yyyy-MM-dd', compress: false, },
      lowFilter: { type: 'logLevelFilter', appender: 'lowlogs', level: 'debug' },
      highFilter: { type: 'logLevelFilter', appender: 'highlogs', level: 'warn' },
    },
    categories: {
      default: { appenders: ['out', "lowFilter", "highFilter"], level: 'all' }
    }
  })

export const logger = log4js.getLogger()