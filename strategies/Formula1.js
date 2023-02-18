const { contact_update_counter } = require('../MessageStrategy.js')
const MessageStrategy = require('../MessageStrategy.js')

// ####################################
// Formula1
// ####################################

class Formula1 extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name)
  static self = null
  static endpoint = 'v1.formula-1.api-sports.io'
  static token = '9f1f5866c19deed2d24acadc0bd3030b'
  static cache_folder = 'strategies/f1'
  static drivers = {}
  static teams = {}
  static circuits = {}
  static ranking_driver = {}
  static ranking_team = {}
  static competition = {}
  static drivers = {}
  static races = {}

  static cache = {}

  constructor () {
    super('Formula1', {
      enabled: true
    })
  }

  provides () {
    Formula1.self = this

    return {
      help: 'Show F1 season information',
      provides: {
        'f1 rankings driver': {
          test: function (message) {
            return message.body.toLowerCase() === 'f1 rankings driver'
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Shows driver rankings'
          },
          action: Formula1.RankingsDriver,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Formula1.enabled
          }
        },
        'f1 rankings team': {
          test: function (message) {
            return message.body.toLowerCase() === 'f1 rankings team'
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Shows teams rankings'
          },
          action: Formula1.RankingsTeam,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Formula1.enabled
          }
        },
        'f1 races': {
          test: function (message) {
            return message.body.toLowerCase() === 'f1 races'
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Shows races'
          },
          action: Formula1.Races,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Formula1.enabled
          }
        },
        'f1 driver .*': {
          test: function (message) {
            return message.body.toLowerCase().match(/^f1 driver [a-zA-Z.]{3,20}$/i)
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Shows a driver'
          },
          action: Formula1.Driver,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Formula1.enabled
          }
        }
      },
      access: function (message, strategy) {
        return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name)
      },
      enabled: function () {
        return MessageStrategy.state.Formula1.enabled
      }
    }
  }

  Formula1 () {
    return false
  }

  static async apiRequest (url) {
    try {
      if (Object.keys(Formula1.cache).indexOf(url) > -1) {
        return Formula1.cache[url]
      }
      const page = request('GET', 'https://' + Formula1.endpoint + '/' + url, {
        headers: {
          'x-rapidapi-host': Formula1.endpoint,
          'x-rapidapi-key': Formula1.token
        }
      })
      console.log(console.log(page.getBody('utf8')))

      Formula1.cache[url] = JSON.parse(page.getBody('utf8'))
      return Formula1.cache[url]
    } catch (err) {
      console.log(err)
    }
  }

  static createCacheFolders () {
    if (!fs.existsSync(Formula1.cache_folder + '/drivers')) {
      fs.mkdirSync(Formula1.cache_folder + '/drivers', { recursive: true })
    }
    if (!fs.existsSync(Formula1.cache_folder + '/circuits')) {
      fs.mkdirSync(Formula1.cache_folder + '/circuits', { recursive: true })
    }
    if (!fs.existsSync(Formula1.cache_folder + '/teams')) {
      fs.mkdirSync(Formula1.cache_folder + '/teams', { recursive: true })
    }
  }

  static async convert_image (save_path) {
    const cmd = "convert '" + save_path + "' -background white -alpha remove -alpha off '" + save_path + "'.jpg"
    const child_process = require('child_process')
    child_process.execSync(cmd)
  }

  static async downloadImage (url, save_path) {
    try {
      if (fs.existsSync(save_path)) {
        if (!fs.existsSync(save_path + '.jpg')) {
          await Formula1.convert_image(save_path)
          return
        }
        return
      }

      const image = request('GET', url, {
        headers: {
          'x-rapidapi-host': Formula1.endpoint,
          'x-rapidapi-key': Formula1.token
        }
      })

      await fs.writeFileSync(save_path, image.getBody())
      await Formula1.convert_image(save_path)
    } catch (err) {
      console.log(err)
    }
  }

  static async Races (message, season = new Date().getFullYear(), next = 0, last = 0, type = 'race') {
    Formula1.createCacheFolders()

    // {
    //   "id": 1318,
    //   "competition": {
    //     "id": 23,
    //     "name": "Abu Dhabi Grand Prix",
    //      "location": {
    //        "country": "Abu Dhabi",
    //        "city": "Yas Marina, Abou Dabi"
    //      }
    //   },
    //   "circuit": {
    //     "id": 23,
    //     "name": "Yas Marina Circuit",
    //     "image": "https://media.api-sports.io/formula-1/circuits/23.png"
    //   },
    //   "season": 2021,
    //   "type": "Race",
    //   "laps": {
    //     "current": null,
    //     "total": 58
    //   },
    //   "fastest_lap": {
    //     "driver": {
    //       "id": 25
    //     },
    //     "time": "1:44.481"
    //   },
    //   "distance": "307.6 Kms",
    //   "timezone": "utc",
    //   "date": "2021-12-12T13:00:00+00:00",
    //   "weather": null,
    //   "status": "Completed"
    // }

    try {
      MessageStrategy.typing(message)
      const filter_next = next > 0 ? '&next=' + next.toString() : ''
      const filter_last = last > 0 ? '&last=' + last.toString() : ''
      const filters = filter_next + filter_last
      const result = await Formula1.apiRequest('races?season=' + season + filters + '&type=' + type)

      console.log(result)

      if (result.errors.length > 0) {
        console.log(result.errors)
        return
      }

      Formula1.races = result.response

      for (let y = 0; y < Formula1.races.length; y++) {
        let msg = ''
        const race = Formula1.races[y]
        const competition = race.competition
        Formula1.competition[competition.id] = competition
        const circuit = race.circuit
        Formula1.circuits[circuit.id] = circuit
        const laps = race.laps
        const fastest_lap = race.fastest_lap
        await Formula1.downloadImage(circuit.image, Formula1.cache_folder + '/circuits/' + circuit.id)
        msg += competition.name + '\n'
        msg += 'Circuit: ' + circuit.name + '\n'
        if (fastest_lap != null && Formula1.drivers[fastest_lap.driver.id] != undefined) {
          msg += 'Fastest Lap: ' + Formula1.drivers[fastest_lap.driver.id].name + ' ' + fastest_lap.time + '\n'
        }
        msg += 'Laps ' + race.laps.total + ' Distance: ' + race.distance + '\n'

        await MessageStrategy.client.sendImage(
          message.from,
          await MessageStrategy.fs_get_image('./' + Formula1.cache_folder + '/circuits/' + circuit.id + '.jpg', 480),
          circuit.name,
          msg)
      }
    } catch (err) {
      console.log(err)
    }
  }

  static async RankingsTeam (message) {
    Formula1.createCacheFolders()
    // {
    //   "position": 1,
    //   "team": {
    //   "id": 5,
    //   "name": "Mercedes-AMG Petronas",
    //   "logo": "https://media.api-sports.io/formula-1/teams/5.png"
    //   },
    //   "points": 739,
    //   "season": 2019
    // }

    try {
      MessageStrategy.typing(message)
      const result = await Formula1.apiRequest('rankings/teams?season=' + new Date().getFullYear())
      if (result.errors.length > 0) {
        console.log(result.errors)
        return
      }

      Formula1.ranking_team = result.response
      let msg = ''

      for (let y = 0; y < Formula1.ranking_team.length; y++) {
        const pos = Formula1.ranking_team[y]
        console.log(pos)
        const team = pos.team
        Formula1.teams[team.id] = team
        await Formula1.downloadImage(team.logo, Formula1.cache_folder + '/teams/' + team.id)
        msg += team.name + ' '.repeat(27 - team.name.length)
        msg += ' ' + (pos.points == null ? 0 : pos.points) + '\n'
      }

      MessageStrategy.typing(message)
      MessageStrategy.client.sendText(message.from, '```' + msg + '```')
    } catch (err) {
      console.log(err)
    }
  }

  static async RankingsDriver (message) {
    Formula1.createCacheFolders()
    // {
    //   "position": 2,
    //   "driver": {
    //   "id": 5,
    //   "name": "Valtteri Bottas",
    //   "abbr": "BOT",
    //   "number": 77,
    //   "image": "https://media.api-sports.io/formula-1/drivers/5.png"
    //   },
    //   "team": {
    //   "id": 5,
    //   "name": "Mercedes-AMG Petronas",
    //   "logo": "https://media.api-sports.io/formula-1/teams/5.png"
    //   },
    //   "points": 326,
    //   "wins": 3,
    //   "behind": 87,
    //   "season": 2019
    // }

    try {
      MessageStrategy.typing(message)
      const result = await Formula1.apiRequest('rankings/drivers?season=' + new Date().getFullYear())

      if (result.errors.length > 0) {
        console.log(result.errors)
        return
      }

      Formula1.ranking_driver = result.response
      let msg = ''

      for (let y = 0; y < Formula1.ranking_driver.length; y++) {
        const pos = Formula1.ranking_driver[y]
        console.log(pos)
        const driver = pos.driver
        const team = pos.team
        Formula1.drivers[driver.id] = driver
        Formula1.teams[team.id] = team
        await Formula1.downloadImage(driver.image, Formula1.cache_folder + '/drivers/' + driver.id)
        await Formula1.downloadImage(team.logo, Formula1.cache_folder + '/teams/' + team.id)
        msg += driver.name + ' '.repeat(20 - driver.name.length)
        msg += ' ' + (pos.points == null ? 0 : pos.points)
        msg += ' ' + (pos.wins == null ? ' ' : pos.wins)
        msg += ' ' + (pos.behind == null ? ' ' : pos.behind) + '\n'
      }

      MessageStrategy.typing(message)
      MessageStrategy.client.sendText(message.from, '```' + msg + '```')
    } catch (err) {
      console.log(err)
    }
  }

  static async Driver (message) {
    Formula1.createCacheFolders()
    // {
    //   "id": 20,
    //   "name": "Lewis Hamilton",
    //   "abbr": "HAM",
    //   "image": "https://media.api-sports.io/formula-1/drivers/20.png",
    //   "nationality": "British",
    //   "country": {
    //     "name": "United Kingdom",
    //     "code": "GB"
    //   },
    //   "birthdate": "1985-01-07",
    //   "birthplace": "Stevenage, England",
    //   "number": 44,
    //   "grands_prix_entered": 288,
    //   "world_championships": 7,
    //   "podiums": 182,
    //   "highest_race_finish": {
    //     "position": 1,
    //     "number": 103
    //   },
    //   "highest_grid_position": 1,
    //   "career_points": "4165.5",
    //   "teams": [
    //     {
    //       "season": 2022,
    //       "team": {
    //       "id": 5,
    //       "name": "Mercedes-AMG Petronas",
    //       "logo": "https://media.api-sports.io/formula-1/teams/5.png"
    //     }
    //     },
    //     {},
    //     {},
    //     {},
    //     {},
    //     {},
    //     {},
    //     {},
    //     {},
    //     {},
    //     {},
    //     {}
    //   ]
    // }

    try {
      MessageStrategy.typing(message)
      const search = message.body.substring(10)
      const result = await Formula1.apiRequest('drivers' + '?search=' + search)

      if (result.errors.length > 0) {
        console.log(result.errors)
        return
      }

      Formula1.drivers = result.response

      for (let y = 0; y < Formula1.drivers.length; y++) {
        let msg = ''
        const driver = Formula1.drivers[y]
        await Formula1.downloadImage(driver.image, Formula1.cache_folder + '/drivers/' + driver.id)

        msg += driver.name + ' (' + driver.birthdate + ')\n'
        msg += MessageStrategy.flags[driver.country.name] + ' ' + driver.country.name + '\n'
        msg += 'Total grand prix: ' + driver.grands_prix_entered + '\n'
        msg += 'World championships: ' + driver.world_championships + '\n'
        msg += 'Podiums: ' + driver.podiums + '\n'
        msg += 'Career points: ' + driver.career_points + '\n'
        msg += 'Highest grid position: ' + driver.highest_grid_position + '\n'
        msg += '\n'
        msg += 'Teams\n'

        for (let p = 0; p < driver.teams.length; p++) {
          msg += driver.teams[p].season + ': ' + driver.teams[p].team.name + '\n'
        }

        await MessageStrategy.client.sendImage(
          message.from,
          await MessageStrategy.fs_get_image('./' + Formula1.cache_folder + '/drivers/' + driver.id + '.jpg', 480),
          driver.name,
          msg)
      }
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = {
  MessageStrategy: Formula1
}
