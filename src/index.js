/* eslint-disable camelcase */

'use strict'

const { size, omit, mapKeys, camelCase, pick } = require('lodash')
const fetchTimeline = require('fetch-timeline')
const bodyParser = require('body-parser')
const queryType = require('query-types')
const getStream = require('get-stream')

const help = require('./help')

const isProduction = process.env.NODE_ENV === 'production'
const createError = prop => new Error(`Need to provide '${prop}' env.`)
const mapKeysToCamelCase = obj => mapKeys(obj, (value, key) => camelCase(key))

const {
  TWITTER_CONSUMER_KEY: consumer_key,
  TWITTER_CONSUMER_SECRET: consumer_secret
} = process.env

if (!consumer_key) throw createError('TWITTER_CONSUMER_KEY')
if (!consumer_secret) throw createError('TWITTER_CONSUMER_SECRET')

const CREDENTIALS_KEYS = [
  'access_token',
  'access_token_secret',
  'consumer_key',
  'consumer_secret'
]

const OPTS_KEYS = ['limit_days', 'limit']

const DEFAULT_PARAMS = {
  count: 200,
  include_rts: false,
  exclude_replies: false
}

const DEFAULT_OPTS = {
  limit: 3200
}

const getCredentials = obj =>
  Object.assign({}, pick(obj, ['access_token', 'access_token_secret']), {
    consumer_key,
    consumer_secret
  })

const getOpts = obj => mapKeysToCamelCase(pick(obj, OPTS_KEYS))

module.exports = (app, express) => {
  app
    .use(require('helmet')())
    .use(require('compression')())
    .use(require('cors')())
    .use(require('jsendp')())
    .use(queryType.middleware())
    .use(require('express-status-monitor')())
    .use(bodyParser.urlencoded({ extended: false }))
    .use(bodyParser.json())
    .use(require('morgan')(isProduction ? 'combined' : 'dev'))
    .use(express.static('static'))
    .disable('x-powered-by')

  app.get('/', async function (req, res) {
    const credentials = getCredentials(req.query)
    if (size(credentials) !== size(CREDENTIALS_KEYS)) {
      return res.success({ data: help, message: help.message })
    }

    const params = Object.assign(
      {},
      DEFAULT_PARAMS,
      omit(req.query, OPTS_KEYS.concat(CREDENTIALS_KEYS))
    )

    const opts = Object.assign(
      {},
      DEFAULT_OPTS,
      { credentials },
      getOpts(req.query)
    )

    try {
      const stream = fetchTimeline(params, opts)
      let meta

      stream.on('info', function (info) {
        meta = info
      })

      const tweets = await getStream.array(stream)
      return res.success({ data: { meta, tweets } })
    } catch (err) {
      return res.error({ message: err.message || err })
    }
  })

  return app
}
