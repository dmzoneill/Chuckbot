const MessageStrategy = require('../MessageStrategy.js')

// ####################################
// Sonarr
// ####################################

class Sonarr extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name)
  static self = null
  static config = {}

  constructor () {
    super('Sonarr', {
      enabled: true
    })
    this.load_config()
  }

  load_config () {
    try {
      // eslint-disable-next-line no-undef
      fs.readFile('strategies/config/sonarr.json', 'utf8', function (err, data) {
        if (err) {
          return console.log(err)
        }
        try {
          const obj = JSON.parse(data)
          if (obj != null) {
            Sonarr.config = obj
          }
        } catch (err) {
          console.log(err)
        }
      })
    } catch (err) {
      console.log(err)
    }
  }

  provides (message) {
    Sonarr.self = this

    return {
      help: 'Manages sonarr',
      provides: {
        sonarr: {
          test: function (message) {
            return message.body.toLowerCase() === 'sonarr'
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'To do'
          },
          action: Sonarr.self.Sonarr,
          interactive: false,
          enabled: function () {
            return MessageStrategy.state.Sonarr.enabled
          }
        },
        'sonarr list': {
          test: function (message) {
            return message.body.toLowerCase() === 'sonarr list'
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'List all series'
          },
          action: function List (message) {
            Sonarr.self.List(message, false)
            return true
          },
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Sonarr.enabled
          }
        },
        // eslint-disable-next-line no-useless-escape
        'sonarr show \d+': {
          test: function (message) {
            return message.body.toLowerCase().match(/^sonarr show \d+$/i)
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Show details about given series (id)'
          },
          action: function Show (message) {
            Sonarr.self.Show(message)
            return true
          },
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Sonarr.enabled
          }
        },
        'sonarr show .*': {
          test: function (message) {
            return message.body.toLowerCase().match(/^sonarr show .*$/i)
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Show details about given series (name)'
          },
          action: function ShowByName (message) {
            Sonarr.self.ShowByName(message)
            return true
          },
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Sonarr.enabled
          }
        },
        // eslint-disable-next-line no-useless-escape
        'sonarr add \d+': {
          test: function (message) {
            return message.body.toLowerCase().match(/^sonarr add \d+$/i)
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Add series by tvdb id'
          },
          action: function Add (message) {
            Sonarr.self.Add(message)
            return true
          },
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Sonarr.enabled
          }
        },
        'sonarr search .*': {
          test: function (message) {
            return message.body.toLowerCase().match(/^sonarr search .*$/i)
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Search for series to add'
          },
          action: function Search (message) {
            Sonarr.self.Search(message)
            return true
          },
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Sonarr.enabled
          }
        },
        // eslint-disable-next-line no-useless-escape
        'sonarr update \d+': {
          test: function (message) {
            return message.body.toLowerCase().match(/^sonarr update \d+$/i)
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Search and download new episodes (id)'
          },
          action: function Update (message) {
            Sonarr.self.Update(message)
            return true
          },
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Sonarr.enabled
          }
        },
        'sonarr update .*': {
          test: function (message) {
            return message.body.toLowerCase().match(/^sonarr update .*$/i)
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Search and download new episodes (name)'
          },
          action: function Update (message) {
            Sonarr.self.Update(message)
            return true
          },
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Sonarr.enabled
          }
        },
        // eslint-disable-next-line no-useless-escape
        'sonarr missing \d+': {
          test: function (message) {
            return message.body.toLowerCase().match(/^sonarr missing \d+$/i)
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Show missing episodes from series (id)'
          },
          action: function Missing (message) {
            Sonarr.self.Missing(message)
            return true
          },
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Sonarr.enabled
          }
        },
        'sonarr missing .*': {
          test: function (message) {
            return message.body.toLowerCase().match(/^sonarr missing .*$/i)
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Show missing episodes from series (name)'
          },
          action: function Missing (message) {
            Sonarr.self.Missing(message)
            return true
          },
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Sonarr.enabled
          }
        },
        'sonarr stats': {
          test: function (message) {
            return message.body.toLowerCase().match(/^sonarr stats$/i)
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Show sonarr stats'
          },
          action: function Stats (message) {
            Sonarr.self.Stats(message)
            return true
          },
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Sonarr.enabled
          }
        },
        'sonarr calendar': {
          test: function (message) {
            return message.body.toLowerCase().match(/^sonarr calendar$/i)
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Show calendar'
          },
          action: function Calendar (message) {
            Sonarr.self.Calendar(message)
            return true
          },
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Sonarr.enabled
          }
        }
      },
      access: function (message, strategy) {
        return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name)
      },
      enabled: function () {
        return MessageStrategy.state.Sonarr.enabled
      }
    }
  }

  Sonarr (message) {
    return false
  }

  async sonarr_query (path, post = false) {
    try {
      const sonarrHeaders = MessageStrategy.browser_config.headers
      sonarrHeaders['X-Api-Key'] = Sonarr.config.key
      sonarrHeaders['Content-Type'] = 'application/json'
      const url = Sonarr.config.host + path

      if (post) {
        // eslint-disable-next-line no-undef
        return await axios.post(url, post, {
          headers: sonarrHeaders
        })
      }

      // eslint-disable-next-line no-undef
      return await axios(url, {
        headers: sonarrHeaders
      })
    } catch (err) {
      console.log(err)
    }
  }

  async search_wanted (message) {
    try {
      const len = 'sonarr update'.length
      let searchId = parseInt(message.body.substring(len).trim())

      if (Number.isNaN(searchId)) {
        const series = await Sonarr.self.List(message, true)
        const found = series.find(x => {
          return x.title.toLowerCase() === message.body.substring(len).trim()
        })

        if (found === undefined) {
          return
        }

        searchId = found.id
      }

      const wantedOptions = {
        name: 'SeriesSearch',
        seriesId: searchId
      }

      console.log(wantedOptions)

      return await Sonarr.self.sonarr_query('/api/v3/command', wantedOptions)
    } catch (err) {
      console.log(err)
    }
  }

  async show_missing (message) {
    try {
      MessageStrategy.typing(message)

      const len = 'sonarr missing'.length
      let searchId = parseInt(message.body.substring(len).trim())
      let name = ''
      const series = await Sonarr.self.List(message, true)

      if (Number.isNaN(searchId)) {
        const found = series.find(x => {
          return x.title.toLowerCase() === message.body.substring(len).trim()
        })

        if (found === undefined) {
          return
        }
        name = message.body.substring(len)
        searchId = found.id
      } else {
        const found = series.find(x => {
          return x.id === searchId
        })

        if (found === undefined) {
          return
        }
        name = found.title
      }

      let msg = ''
      let page = 1
      let fnd = 0

      while (true) {
        if (page % 4 === 0) {
          MessageStrategy.typing(message)
        }
        const missing = await Sonarr.self.sonarr_query('/api/v3/wanted/missing/?pageSize=1000&page=' + page.toString())
        const data = missing.data

        for (let h = 0; h < data.records.length; h++) {
          if (data.records[h].seriesId === searchId) {
            msg += 's' + data.records[h].seasonNumber.toString().padStart(2, '0')
            msg += 'e' + data.records[h].episodeNumber.toString().padStart(2, '0')
            msg += ' - ' + data.records[h].title + '\n'
            fnd += 1
          }
        }

        if (page * 1000 > data.totalRecords) {
          break
        }

        page += 1
      }

      if (fnd > 0) {
        msg = 'Missing episodes from ' + name + '\n\n' + msg
      } else {
        msg = '0 missing episodes'
      }

      MessageStrategy.client.sendText(message.from, msg)
    } catch (err) {
      console.log(err)
    }
  }

  async show_series (show, message) {
    try {
      // eslint-disable-next-line no-undef
      const details = request('GET', 'http://api.tvmaze.com/lookup/shows?thetvdb=' + show.tvdbId, {
        headers: {
          Accept: 'text/plain'
        }
      })

      const tvshow = JSON.parse(details.getBody())

      let poster = ''

      for (let p = 0; p < show.images.length; p++) {
        if (show.images[p].coverType === 'poster') {
          poster = show.images[p].remoteUrl
          break
        }
      }

      const breaker = '--------------------------------------------------------------------\n'

      let msg = ''
      msg += show.title + ' ('
      msg += show.year + ') (' + show.id + ')\n'
      msg += breaker
      msg += show.overview + ')\n'
      msg += breaker
      msg += 'https://imdb.com/title/' + show.imdbId + '\n'
      msg += tvshow.url + '\n'
      msg += breaker
      msg += 'Episodes: ' + show.episodeFileCount + '/' + show.totalEpisodeCount + '\n'

      for (let y = 0; y < show.seasons.length; y++) {
        msg += 'Season ' + show.seasons[y].seasonNumber + ': ' + show.seasons[y].statistics.percentOfEpisodes + '%\n'
      }

      const posterImage = await MessageStrategy.get_image(poster)

      await MessageStrategy.client.sendImage(
        message.from,
        posterImage, '',
        msg.trim()
      )
    } catch (err) {
      console.log(err)
    }
  }

  async Search (message) {
    let x = 1
    try {
      MessageStrategy.typing(message)
      const searchTerm = message.body.substring(13).trim().replace(' ', '+')
      const page = await Sonarr.self.get_page(Sonarr.self, 'https://thetvdb.com/search?query=' + searchTerm, 500)

      if (page) {
        let [elementHandle] = []
        let propertyHandle = null
        MessageStrategy.typing(message)

        for (x = 1; x < 10; x++) {
          const xstr = x.toString()

          // name
          const xpathName = '//*[@id="hits"]/div/div/ol/li[' + xstr + ']/div/div/h3/a/text()';
          [elementHandle] = await page.$x(xpathName)
          propertyHandle = await elementHandle.getProperty('textContent')
          const name = await propertyHandle.jsonValue()

          // link
          const xpathLink = '//*[@id="hits"]/div/div/ol/li[' + xstr + ']/div/a/@href';
          [elementHandle] = await page.$x(xpathLink)
          propertyHandle = await elementHandle.getProperty('value')
          const link = await propertyHandle.jsonValue()

          if (link.indexOf('movies/') > -1) continue
          if (link.indexOf('people/') > -1) continue

          // poster
          const xpathPoster = '//*[@id="hits"]/div/div/ol/li[' + xstr + ']/div/a/img/@src';
          [elementHandle] = await page.$x(xpathPoster)
          propertyHandle = await elementHandle.getProperty('value')
          const poster = await propertyHandle.jsonValue()

          // id
          const xpathId = '//*[@id="hits"]/div/div/ol/li[' + xstr + ']/div/div/div[1]/text()';
          [elementHandle] = await page.$x(xpathId)
          console.log(elementHandle)
          propertyHandle = await elementHandle.getProperty('textContent')
          let id = await propertyHandle.jsonValue()
          id = id.split('#')[1]

          MessageStrategy.typing(message)

          const posterImage = await MessageStrategy.get_image(poster)

          await MessageStrategy.client.sendImage(
            message.from,
            posterImage, '',
            name + '\nhttps://thetvdb.com' + link + '\n' + id
          )
        }
      }
    } catch (err) {
      if (x === 1) {
        console.log(err)
        MessageStrategy.client.sendText(message.from, 'No results')
      }
    }
  }

  async List (message, returnList = false) {
    try {
      MessageStrategy.typing(message)

      const sonarrList = await Sonarr.self.sonarr_query('/api/series/')

      const series = sonarrList.data
      series.sort((a, b) => {
        return a.title.localeCompare(b.title)
      })

      if (returnList) {
        return series
      }

      const map1 = series.map(x => x.id.toString().padEnd(5) + ': ' + (x.title.length > 30 ? x.title.substring(0, 30) + ' ..' : x.title))

      let msg = '```'
      for (let y = 0; y < map1.length; y++) {
        msg += map1[y] + '\n'

        if (y % 10 === 9) {
          msg = msg.trim() + '```'
          MessageStrategy.client.sendText(message.from, msg)
          msg = '```'
          await Sonarr.self.waitFor(500)
        }
      }
      MessageStrategy.client.sendText(message.from, msg.trim() + '```')
    } catch (err) {
      console.log(err)
    }
  }

  async Add (message) {
    try {
      const tvdbid = message.body.substring(10).trim()

      MessageStrategy.typing(message)

      // eslint-disable-next-line no-undef
      const details = request('GET', 'http://api.tvmaze.com/lookup/shows?thetvdb=' + tvdbid, {
        headers: {
          Accept: 'text/plain'
        }
      })

      const show = JSON.parse(details.getBody())

      const addSeriesOptions = {
        addOptions: {
          ignoreEpisodesWithFiles: true,
          ignoreEpisodesWithoutFiles: true,
          searchForMissingEpisodes: false
        },
        title: show.name,
        seasons: [
          {
            monitored: true,
            seasonNumber: 1
          }
        ],
        rootFolderPath: '/tv',
        qualityProfileId: 6,
        seasonFolder: true,
        monitored: true,
        tvdbId: tvdbid,
        tvRageId: 0,
        cleanTitle: null,
        imdbId: null,
        titleSlug: show.name.replace(' ', '-').toLowerCase(),
        id: 0,
        images: []
      }

      MessageStrategy.typing(message)

      const addSeries = await Sonarr.self.sonarr_query('/api/series/', addSeriesOptions)

      MessageStrategy.typing(message)

      MessageStrategy.client.sendText(message.from, 'Series Added')

      Sonarr.self.search_wanted(addSeries.data.id)
    } catch (err) {
      console.log(err)
      MessageStrategy.client.sendText(message.from, JSON.stringify(err.response.data, null, 2))
    }
  }

  async Show (message) {
    try {
      MessageStrategy.typing(message)

      const id = message.body.split(' ')[2]
      const result = await Sonarr.self.sonarr_query('/api/series/' + id)

      MessageStrategy.typing(message)

      Sonarr.self.show_series(result.data, message)
    } catch (err) {
      console.log(err)
    }
  }

  async ShowByName (message) {
    try {
      MessageStrategy.typing(message)

      const name = message.body.substring('sonarr show'.length).toLowerCase().trim()
      const series = await Sonarr.self.List(message, true)
      const found = series.find(x => {
        return x.title.toLowerCase() === name
      })

      if (found === undefined) {
        return
      }

      MessageStrategy.typing(message)

      Sonarr.self.show_series(found, message)
    } catch (err) {
      console.log(err)
    }
  }

  async Stats (message) {
    // http://192.168.0.30:8989/api/v3/queue/status

    // {
    //   "totalCount": 142,
    //   "count": 141,
    //   "unknownCount": 1,
    //   "errors": false,
    //   "warnings": false,
    //   "unknownErrors": false,
    //   "unknownWarnings": false
    // }

    // http://192.168.0.30:8989/api/v3/system/status/

    // {
    //   "appName": "Sonarr",
    //   "instanceName": "Sonarr",
    //   "version": "3.0.9.1555",
    //   "buildTime": "2022-08-07T19:07:41Z",
    //   "isDebug": false,
    //   "isProduction": true,
    //   "isAdmin": false,
    //   "isUserInteractive": false,
    //   "startupPath": "/app/sonarr/bin",
    //   "appData": "/config",
    //   "osName": "ubuntu",
    //   "osVersion": "20.04",
    //   "isMonoRuntime": true,
    //   "isMono": true,
    //   "isLinux": true,
    //   "isOsx": false,
    //   "isWindows": false,
    //   "mode": "console",
    //   "branch": "develop",
    //   "authentication": "none",
    //   "sqliteVersion": "3.31.1",
    //   "urlBase": "",
    //   "runtimeVersion": "6.12.0.182",
    //   "runtimeName": "mono",
    //   "startTime": "2022-10-20T09:24:58.701366Z",
    //   "packageVersion": "3.0.9.1555-ls308",
    //   "packageAuthor": "[linuxserver.io](https://www.linuxserver.io/)",
    //   "packageUpdateMechanism": "docker"
    // }

    // http://192.168.0.30:8989/api/v3/queue/

    // {
    //   "page": 1,
    //   "pageSize": 100,
    //   "sortKey": "timeleft",
    //   "sortDirection": "ascending",
    //   "totalRecords": 128,
    //   "records": [
    //     {
    //       "seriesId": 768,
    //       "episodeId": 86763,
    //       "language": {
    //         "id": 1,
    //         "name": "English"
    //       },
    //       "quality": {
    //         "quality": {
    //           "id": 3,
    //           "name": "WEBDL-1080p",
    //           "source": "web",
    //           "resolution": 1080
    //         },
    //         "revision": {
    //           "version": 1,
    //           "real": 0,
    //           "isRepack": false
    //         }
    //       },
    //       "size": 1372723200.0,
    //       "title": "The.Handmaids.Tale.S05E07.1080p.WEB.H264-CAKES",
    //       "sizeleft": 0.0,
    //       "timeleft": "00:00:00",
    //       "estimatedCompletionTime": "2022-10-20T19:20:39.48788Z",
    //       "status": "downloading",
    //       "trackedDownloadStatus": "ok",
    //       "trackedDownloadState": "importPending",
    //       "statusMessages": [],
    //       "downloadId": "BFE71D28C5C9F63EC0F36CEDC01187281DBF609A",
    //       "protocol": "torrent",
    //       "downloadClient": "deluge",
    //       "indexer": "animetosho",
    //       "outputPath": "/downloads/The.Handmaids.Tale.S05E07.1080p.WEB.H264-CAKES.iso",
    //       "id": 1883989717
    //     },

    try {
      MessageStrategy.typing(message)

      const id = message.body.split(' ')[2]

      const result = await Sonarr.self.sonarr_query('/api/series/' + id)

      MessageStrategy.typing(message)

      Sonarr.self.show_series(result.data, message)
    } catch (err) {
      console.log(err)
    }
  }

  async Calendar (message) {
    try {
      MessageStrategy.typing(message)

      const result = await Sonarr.self.sonarr_query('/api/v3/calendar/')
      const data = result.data
      const series = await Sonarr.self.List(message, true)

      MessageStrategy.typing(message)

      let msg = ''
      for (let y = 0; y < data.length; y++) {
        const found = series.find(x => {
          return x.id === data[y].seriesId
        })

        msg += '*' + found.title + '*\n'
        msg += 'Title : ' + data[y].title + '\n'
        msg += 'Season : ' + data[y].seasonNumber + ' - '
        msg += 'Episode : ' + data[y].episodeNumber + '\n'
        msg += 'Air date : ' + data[y].airDate + '\n'
        msg += 'Downloaded : ' + data[y].hasFile + '\n'
        MessageStrategy.client.sendText(message.from, msg.trim())
        msg = ''
      }
    } catch (err) {
      console.log(err)
    }
  }

  async Update (message) {
    try {
      MessageStrategy.typing(message)
      MessageStrategy.client.sendText(message.from, 'Searching ...')
      const res = await Sonarr.self.search_wanted(message)
      MessageStrategy.client.sendText(message.from, JSON.stringify(res.data, null, 2))
    } catch (err) {
      console.log(err)
    }
  }

  async Missing (message) {
    try {
      MessageStrategy.typing(message)
      Sonarr.self.show_missing(message)
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = {
  MessageStrategy: Sonarr
}
