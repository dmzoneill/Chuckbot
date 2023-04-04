const MessageStrategy = require('../MessageStrategy.js')

// ####################################
// WorldCup
// ####################################

class WorldCup extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name)
  static self = null
  static endpoint = 'http://api.cup2022.ir/api/v1'
  static token = ''
  static country_codes = {}
  static countries = {}
  static group_mapping = {}
  static name_mapping = {}
  static short_name_mapping = {}
  static json_teams = {}
  static json_groups = {}
  static json_matches = {}
  static headers = {}
  static l16Order = []
  static qOrder = []
  static sOrder = []

  constructor () {
    super('WorldCup', {
      enabled: true
    })

    WorldCup.Login({ from: '', sender: { id: '' } })
  }

  provides () {
    WorldCup.self = this

    return {
      help: 'Show world cup information',
      provides: {
        'wc update': {
          test: function (message) {
            return message.body.toLowerCase() === 'wc update'
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'To do'
          },
          action: function Update (message) {
            WorldCup.Update(message)
            return false
          },
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.WorldCup.enabled
          }
        },
        'wc groups': {
          test: function (message) {
            return message.body.toLowerCase() === 'wc groups'
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Shows the groups'
          },
          action: WorldCup.Groups,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.WorldCup.enabled
          }
        },
        'wc group [a-h]': {
          test: function (message) {
            return message.body.toLowerCase().match(/^wc group [a-h]$/i)
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Show a specific group'
          },
          action: WorldCup.Group,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.WorldCup.enabled
          }
        },
        'wc matches': {
          test: function (message) {
            return message.body.toLowerCase() === 'wc matches'
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Shows all matches'
          },
          action: WorldCup.Matches,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.WorldCup.enabled
          }
        },
        'wc matches [a-h]': {
          test: function (message) {
            return message.body.toLowerCase().match(/^wc matches [a-h]$/i)
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Shows all group matches'
          },
          action: WorldCup.GroupMatches,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.WorldCup.enabled
          }
        },
        'wc current': {
          test: function (message) {
            return message.body.toLowerCase().match(/^wc current$/i)
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Shows the current matches'
          },
          action: WorldCup.CurrentMatches,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.WorldCup.enabled
          }
        },
        'wc today': {
          test: function (message) {
            return message.body.toLowerCase().match(/^wc today$/i)
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Shows todays matches'
          },
          action: WorldCup.MatchesToday,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.WorldCup.enabled
          }
        },
        'wc tomorrow': {
          test: function (message) {
            return message.body.toLowerCase().match(/^wc tomorrow$/i)
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Shows tomorrows matches'
          },
          action: WorldCup.MatchesTomorrow,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.WorldCup.enabled
          }
        },
        'wc matches [a-zA-Z.]{4,15}': {
          test: function (message) {
            return message.body.toLowerCase().match(/^wc matches [a-zA-Z.]{4,15}$/i)
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Shows all team matches'
          },
          action: WorldCup.TeamMatches,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.WorldCup.enabled
          }
        },
        'wc top \d+': {
          test: function (message) {
            return message.body.toLowerCase().match(/^wc top( \d+)?$/i)
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Shows top'
          },
          action: WorldCup.Top,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.WorldCup.enabled
          }
        },
        'wc 16': {
          test: function (message) {
            return message.body.toLowerCase().match(/^wc 16$/i)
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Show last 16'
          },
          action: WorldCup.Last16,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.WorldCup.enabled
          }
        },
        'wc 8': {
          test: function (message) {
            return message.body.toLowerCase().match(/^wc 8$/i)
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Show quarters'
          },
          action: WorldCup.Quarters,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.WorldCup.enabled
          }
        },
        'wc 4': {
          test: function (message) {
            return message.body.toLowerCase().match(/^wc 4?$/i)
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Shows semis'
          },
          action: WorldCup.Semis,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.WorldCup.enabled
          }
        },
        'wc 2': {
          test: function (message) {
            return message.body.toLowerCase().match(/^wc 2?$/i)
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Show final'
          },
          action: WorldCup.Final,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.WorldCup.enabled
          }
        }
      },
      access: function (message, strategy) {
        return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name)
      },
      enabled: function () {
        return MessageStrategy.state.WorldCup.enabled
      }
    }
  }

  WorldCup () {
    return false
  }

  static async Login (message) {
    try {
      const file_data = JSON.parse(fs.readFileSync('strategies/config/worldcup.json', 'utf8'))

      const page = await MessageStrategy.axiosHttpRequest(
        message,
        'POST',
        WorldCup.endpoint + '/user/login',
        {
          'Content-Type': 'application/json'
        },
        200,
        true,
        'data',
        true,
        file_data
      )

      if (page === undefined) {
        // console.log('Unable to obtain token')
        return
      }

      WorldCup.token = page.token
      WorldCup.headers = {
        Accept: 'application/json',
        Authorization: 'Bearer ' + WorldCup.token
      }
      await WorldCup.Update(message)
    } catch (err) {
      // console.log(err)
    }
  }

  static async getGroup (letter) {
    for (let y = 0; y < WorldCup.json_groups.length; y++) {
      if (WorldCup.json_groups[y].group === letter.toUpperCase()) {
        return WorldCup.json_groups[y]
      }
    }

    return false
  }

  static async teamNameToShortName (team) {
    if (Object.keys(WorldCup.name_mapping).indexOf(team.toLowerCase()) > -1) {
      return WorldCup.name_mapping[team.toLowerCase()]
    }
    return false
  }

  static async teamShortNameToName (team) {
    if (Object.keys(WorldCup.short_name_mapping).indexOf(team) > -1) {
      return WorldCup.short_name_mapping[team]
    }
    return false
  }

  static async updateMatches (message) {
    try {
      // console.log('Update matches')
      MessageStrategy.typing(message)
      WorldCup.json_matches = await MessageStrategy.axiosHttpRequest(
        message,
        'GET',
        WorldCup.endpoint + '/match',
        WorldCup.headers,
        200,
        true, 'data',
        true
      )
      // console.log(WorldCup.json_matches)
      WorldCup.updateGroups()
    } catch (err) {
      // console.log(err)
    }
  }

  static async updateGroups (message) {
    try {
      if (Object.keys(WorldCup.headers).indexOf('Authorization') === -1) {
        MessageStrategy.typing(message)
        MessageStrategy.client.sendText(message.from, 'API down, check back later')
        WorldCup.Login(message)
        return
      }
      // console.log('Update groups')
      MessageStrategy.typing(message)
      WorldCup.json_groups = await MessageStrategy.axiosHttpRequest(
        message,
        'GET',
        WorldCup.endpoint + '/standings',
        WorldCup.headers,
        200,
        true, 'data',
        true
      )
      // console.log(WorldCup.json_groups)
      WorldCup.updateTeams()
    } catch (err) {
      // console.log(err)
    }
  }

  static async updateTeams (message) {
    try {
      if (Object.keys(WorldCup.headers).indexOf('Authorization') === -1) {
        MessageStrategy.typing(message)
        MessageStrategy.client.sendText(message.from, 'API down, check back later')
        WorldCup.Login(message)
        return
      }
      // console.log('Update teams')
      MessageStrategy.typing(message)
      WorldCup.json_teams = await MessageStrategy.axiosHttpRequest(
        message,
        'GET',
        WorldCup.endpoint + '/team',
        WorldCup.headers,
        200,
        true, 'data',
        true
      )
      // console.log(WorldCup.json_teams)

      if (WorldCup.json_teams === undefined) {
        // console.log('Empty teams')
        return
      }

      for (let y = 0; y < WorldCup.json_teams.length; y++) {
        WorldCup.country_codes[WorldCup.json_teams[y].fifa_code] = WorldCup.json_teams[y].name_en
        WorldCup.countries[WorldCup.json_teams[y].name_en] = WorldCup.json_teams[y].fifa_code
      }
      WorldCup.parseTeamGroups()
    } catch (err) {
      // console.log(err)
    }
  }

  static async parseTeamGroups (message) {
    try {
      if (Object.keys(WorldCup.headers).indexOf('Authorization') === -1) {
        MessageStrategy.typing(message)
        MessageStrategy.client.sendText(message.from, 'API down, check back later')
        WorldCup.Login(message)
        return
      }
      // console.log('Parse groups')
      MessageStrategy.typing(message)

      if (WorldCup.json_groups.length === undefined) {
        // console.log('Empty groups')
        return
      }

      for (let y = 0; y < WorldCup.json_groups.length; y++) {
        for (let x = 0; x < WorldCup.json_groups[y].teams.length; x++) {
          const letter = WorldCup.json_groups[y].group
          const team = WorldCup.json_groups[y].teams[x].name_en
          const country_shortname = WorldCup.countries[WorldCup.json_groups[y].teams[x].name_en]
          WorldCup.group_mapping[team] = letter
          WorldCup.name_mapping[team.toLowerCase()] = country_shortname
          WorldCup.short_name_mapping[country_shortname] = team
        }
      }
    } catch (err) {
      // console.log(err)
    }
  }

  static async Top (message) {
    try {
      if (Object.keys(WorldCup.headers).indexOf('Authorization') === -1) {
        MessageStrategy.typing(message)
        MessageStrategy.client.sendText(message.from, 'API down, check back later')
        WorldCup.Login(message)
        return
      }
      await WorldCup.Update(message)

      let limit = 10
      const parts = message.body.split(' ')
      if (parts.length === 3) {
        limit = parseInt(parts[2])
      }

      // console.log('Begin top scorers')

      const top_players = {}
      const top_countries = {}
      const top_country_mapping = {}

      if (WorldCup.json_groups === undefined) {
        // console.log('Empty matches')
        return
      }

      for (let y = 0; y < WorldCup.json_matches.length; y++) {
        const match = WorldCup.json_matches[y]

        if (match.home_scorers === undefined) {
          continue
        }

        let home_scorers = match.home_scorers[0]
        let away_scorers = match.away_scorers[0]

        if (home_scorers === '' || home_scorers === 'null') {
          home_scorers = []
        } else {
          if (home_scorers.indexOf(',') > -1) {
            home_scorers = home_scorers.split(',')
          } else {
            home_scorers = [home_scorers]
          }
        }

        if (away_scorers === '' || away_scorers === 'null') {
          away_scorers = []
        } else {
          if (away_scorers.indexOf(',') > -1) {
            away_scorers = away_scorers.split(',')
          } else {
            away_scorers = [away_scorers]
          }
        }

        const append_home = []

        for (let y = 0; y < home_scorers.length; y++) {
          if (home_scorers[y].indexOf('(') > -1) {
            const split = home_scorers[y].split('(')
            const player = split[0].trim()
            const amount = split[1].split(')')[0].trim()
            if (player === 'Penalties') {
              continue
            } else {
              for (let l = 0; l < amount; l++) {
                // console.log(player)
                append_home.push(player)
              }
            }
          }
        }

        home_scorers.concat(append_home)

        const append_away = []

        for (let y = 0; y < away_scorers.length; y++) {
          if (away_scorers[y].indexOf('(') > -1) {
            const split = away_scorers[y].split('(')
            const player = split[0].trim()
            const amount = split[1].split(')')[0].trim()
            if (player === 'Penalties') {
              continue
            } else {
              for (let l = 0; l < amount; l++) {
                // console.log(player)
                append_away.push(player)
              }
            }
          }
        }

        away_scorers.concat(append_away)

        for (let y = 0; y < home_scorers.length; y++) {
          top_country_mapping[home_scorers[y].trim()] = MessageStrategy.flags[match.home_team_en.trim()]

          if (home_scorers[y].indexOf('Penalties') > -1) {
            continue
          }

          if (Object.keys(top_players).indexOf(home_scorers[y]) > -1) {
            top_players[home_scorers[y].trim()] += 1
          } else {
            top_players[home_scorers[y].trim()] = 1
          }

          if (Object.keys(top_countries).indexOf(match.home_team_en) > -1) {
            top_countries[match.home_team_en.trim()] += 1
          } else {
            top_countries[match.home_team_en.trim()] = 1
          }
        }

        for (let y = 0; y < away_scorers.length; y++) {
          top_country_mapping[away_scorers[y].trim()] = MessageStrategy.flags[match.away_team_en.trim()]

          if (away_scorers[y].indexOf('Penalties') > -1) {
            continue
          }

          if (Object.keys(top_players).indexOf(away_scorers[y]) > -1) {
            top_players[away_scorers[y].trim()] += 1
          } else {
            top_players[away_scorers[y].trim()] = 1
          }

          if (Object.keys(top_countries).indexOf(match.away_team_en) > -1) {
            top_countries[match.away_team_en.trim()] += 1
          } else {
            top_countries[match.away_team_en.trim()] = 1
          }
        }
      }

      const sortable_players = []
      for (const p1 of top_players) {
        sortable_players.push([p1, top_players[p1]])
      }
      sortable_players.sort(function (a, b) {
        return a[1] - b[1]
      })
      sortable_players.reverse()

      let msg = ''

      MessageStrategy.client.sendText(message.from, 'Top scorers (player)')

      for (let u = 0; u < limit; u++) {
        const rpeat = 25 - sortable_players[u][0].length > 0 ? 25 - sortable_players[u][0].length : 0
        msg += top_country_mapping[sortable_players[u][0]] + ' ' + sortable_players[u][0] + ' '.repeat(rpeat) + ' ' + sortable_players[u][1] + '\n'

        if (u % 10 === 9) {
          MessageStrategy.typing(message)
          MessageStrategy.client.sendText(message.from, '```' + msg + '```')
          msg = ''
        }
      }

      if (msg.trim() !== '') {
        MessageStrategy.typing(message)
        MessageStrategy.client.sendText(message.from, '```' + msg + '```')
      }

      const sortable_countries = []
      for (const p2 of top_countries) {
        sortable_countries.push([p2, top_countries[p2]])
      }
      sortable_countries.sort(function (a, b) {
        return a[1] - b[1]
      })
      sortable_countries.reverse()

      MessageStrategy.client.sendText(message.from, 'Top scorers (country)')

      for (let u = 0; u < limit; u++) {
        const rpeat = 25 - sortable_countries[u][0].length > 0 ? 25 - sortable_countries[u][0].length : 0
        msg += MessageStrategy.flags[sortable_countries[u][0]] + ' ' + sortable_countries[u][0] + ' '.repeat(rpeat) + ' ' + sortable_countries[u][1] + '\n'

        if (u % 10 === 9) {
          MessageStrategy.typing(message)
          MessageStrategy.client.sendText(message.from, '```' + msg + '```')
          msg = ''
        }
      }

      if (msg.trim() !== '') {
        MessageStrategy.typing(message)
        MessageStrategy.client.sendText(message.from, '```' + msg + '```')
      }
    } catch (err) {
      // console.log(err)
    }
  }

  static async ShowMatches (message, letter = null, today = false, tomorrow = false, current = false) {
    try {
      if (Object.keys(WorldCup.headers).indexOf('Authorization') === -1) {
        MessageStrategy.typing(message)
        MessageStrategy.client.sendText(message.from, 'API down, check back later')
        WorldCup.Login(message)
        return
      }
      // console.log('Show Matches')

      let lastDate = null
      const tempLines = []
      let appended = 0

      await WorldCup.Update(message)

      if (WorldCup.json_matches === undefined) {
        // console.log('Empty matches')
        return
      }

      // console.log('Matches: ' + WorldCup.json_matches.length.toString())

      for (let y = 0; y < WorldCup.json_matches.length; y++) {
        const match = WorldCup.json_matches[y]
        // console.log(match)
        // console.log(match.local_date)
        const m = new Date(match.local_date)
        m.setHours(m.getHours() - 3)
        const d = new Date()
        const dateString = m.getFullYear() + '-' + (m.getMonth() + 1) + '-' + String(m.getDate()).padStart(2, '0')
        const timeString = m.getHours() + ':' + String(m.getMinutes()).padStart(2, '0')
        let home = WorldCup.countries[match.home_team_en]
        // console.log(match.home_team_en)
        // console.log('home: ' + home)
        let away = WorldCup.countries[match.away_team_en]
        // console.log('away: ' + away)
        // console.log(match.away_team_en)
        let home_goals = ''
        let away_goals = ''

        if (today) {
          // console.log('Today')
          // console.log(m.getFullYear() + '=' + d.getFullYear())
          // console.log((m.getMonth() + 1) + '=' + d.getMonth())
          // console.log(m.getDate() + '=' + d.getDate())

          if (!(m.getFullYear() === d.getFullYear() && m.getMonth() === d.getMonth() && m.getDate() === d.getDate())) {
            // console.log('Skip not today = ' + home + ' v ' + away)
            continue
          } else {
            // console.log('Today')
            // console.log(match)
          }
        }

        if (tomorrow) {
          // console.log('Tomorrow')
          d.setDate(d.getDate() + 1)

          if (!(m.getFullYear() === d.getFullYear() && m.getMonth() === d.getMonth() && m.getDate() === d.getDate())) {
            // console.log('Skip not tomorrow')
            continue
          } else {
            // console.log('Tomorrow')
            // console.log(match)
          }
        }

        if (current) {
          // console.log('Current')
          if (!(
            m.getFullYear() === d.getFullYear() &&
            m.getMonth() === d.getMonth() &&
            m.getDate() === d.getDate() &&
            d.getHours() >= m.getHours() &&
            d.getHours() <= m.getHours() + 2)) {
            // console.log('Skip not current')
            continue
          } else {
            // console.log('Current')
            // console.log(match)
          }
        }

        if (letter !== null) {
          // console.log('Letter')
          if (match.group !== letter.toUpperCase()) {
            continue
          }
        }

        // console.log('check teams lenght')

        if (home.length < 2 || away.length < 2) {
          continue
        }

        if (lastDate !== dateString) {
          tempLines.push(' '.repeat(7) + dateString)
          lastDate = dateString
        }

        let fullscore_home = 0
        let fullscore_away = 0

        if (match.home_scorers[0] !== 'null') {
          if (match.home_scorers[0].indexOf('Penalties(') > -1) {
            // console.log('xxxxxxxxxxxxxxxxxxxxxxxxx')
            // console.log(match.home_scorers[0])
            let penos = match.home_scorers[0].split('Penalties(')
            penos = penos[1].split(')')
            fullscore_home = parseInt(penos[0])
          }
        }

        if (match.away_scorers[0] !== 'null') {
          if (match.away_scorers[0].indexOf('Penalties(') > -1) {
            // console.log('ddddddddddddddddddddddddddddddddd')
            // console.log(match.away_scorers[0])
            let penos = match.away_scorers[0].split('Penalties(')
            penos = penos[1].split(')')
            fullscore_away = parseInt(penos[0])
          }
        }

        if (m.getFullYear() <= d.getFullYear() && m.getMonth() <= d.getMonth() && m.getDate() < d.getDate()) {
          // console.log('Previous days scores')
          home_goals = parseInt(match.home_score === null ? '0' : match.home_score) + fullscore_home
          home_goals = ' (' + home_goals.toString() + ')'
          away_goals = parseInt(match.away_score === null ? '0' : match.away_score) + fullscore_away
          away_goals = '(' + away_goals.toString() + ')'
        }

        if (m.getFullYear() === d.getFullYear() && m.getMonth() === d.getMonth() && m.getDate() === d.getDate() && d.getHours() >= m.getHours()) {
          // console.log('Today goals scored')
          if (!tomorrow) {
            home_goals = parseInt(match.home_score === null ? '0' : match.home_score) + fullscore_home
            home_goals = ' (' + home_goals.toString() + ')'
            away_goals = parseInt(match.away_score === null ? '0' : match.away_score) + fullscore_away
            away_goals = '(' + away_goals.toString() + ')'
          }
        }

        home = home === '--' ? 'TBC' : home
        away = away === '--' ? 'TBC' : away

        let left_space = away === 'TBC' ? 10 : 7
        left_space = left_space - (home + home_goals).length
        left_space = left_space <= 0 ? '' : ' '.repeat(left_space)
        let l_flag = MessageStrategy.flags[match.home_team_en]
        let r_flag = MessageStrategy.flags[match.away_team_en]

        l_flag = l_flag === undefined ? '' : l_flag
        r_flag = r_flag === undefined ? '' : r_flag
        const theLine = left_space + home + ' ' + l_flag + home_goals + ' · ' + away_goals + ' ' + r_flag + ' ' + away

        let scorerLines = ''
        if (match.away_scorers[0] !== null || match.home_scorers[0] !== null) {
          if (match.home_scorers[0] !== 'null' && match.home_scorers[0] !== '') {
            const l_scorers = match.home_scorers[0].split(',')
            scorerLines += ' '.repeat(11) + l_flag + '\n'
            for (let t = 0; t < l_scorers.length; t++) {
              left_space = 18 - l_scorers[t].length > 0 ? 18 - l_scorers[t].length : 0
              scorerLines += ' '.repeat(left_space) + l_scorers[t] + '\n'
            }
          }

          if (match.away_scorers[0] !== 'null' && match.away_scorers[0] !== '') {
            const r_scorers = match.away_scorers[0].split(',')
            scorerLines += ' '.repeat(11) + r_flag + '\n'
            for (let t = 0; t < r_scorers.length; t++) {
              left_space = 18 - r_scorers[t].length > 0 ? 18 - r_scorers[t].length : 0
              scorerLines += ' '.repeat(left_space) + r_scorers[t] + '\n'
            }
          }
        }

        tempLines.push('\n' + ' '.repeat(10) + timeString)
        tempLines.push(theLine)
        // tempLines.push(scorerLines);
        // console.log(scorerLines)
        appended += 1
      }

      if (letter !== null) {
        // console.log('H Letter')
        tempLines.unshift('Group ' + letter + ' matches')
      }

      if (today) {
        // console.log('H today')
        tempLines.unshift('Todays matches')
      }

      if (tomorrow) {
        // console.log('H tomorrow')
        tempLines.unshift('Tomorrows matches')
      }

      if (current) {
        // console.log('H Current')
        tempLines.unshift('Now playing')
      }

      if (appended === 0) {
        tempLines.push('0 matches')
      }

      let msg = ''
      for (let h = 0; h < tempLines.length; h++) {
        if (tempLines[h].startsWith(' '.repeat(7) + '20')) {
          if (msg.trim().length > 0) {
            MessageStrategy.typing(message)
            MessageStrategy.client.sendText(message.from, '```' + msg + '```')
            msg = ''
          }
        }

        msg += tempLines[h] + '\n'
      }

      MessageStrategy.typing(message)
      MessageStrategy.client.sendText(message.from, '```' + msg + '```')
    } catch (err) {
      // console.log(err)
    }
  }

  static async ShowGroup (message, letter) {
    try {
      if (Object.keys(WorldCup.headers).indexOf('Authorization') === -1) {
        MessageStrategy.typing(message)
        MessageStrategy.client.sendText(message.from, 'API down, check back later')
        WorldCup.Login(message)
        return
      }
      await WorldCup.Update(message)

      const group_header = 'Group ' + letter + '\n'
      const group_teams_header = '    🌐   P W D L F A Pts\n'
      const lines = []
      const group = await WorldCup.getGroup(letter)
      // console.log(group)
      let groupTeams = group.teams

      groupTeams = groupTeams.sort((a, b) => {
        if (a.pts > b.pts) {
          return -1
        }
        if (a.pts < b.pts) {
          return 1
        }
        return 0
      })

      for (let x = 0; x < groupTeams.length; x++) {
        const thegroup = groupTeams[x]
        const name = thegroup.name_en
        const short_name = await WorldCup.teamNameToShortName(name)
        const short_name_len = short_name.length
        let padding = 6 - short_name_len <= 0 ? 0 : 6 - short_name_len

        let line = ''
        line += short_name + ' '
        line += MessageStrategy.flags[name]
        line += ' '.repeat(padding)
        padding = 2 - thegroup.mp.toString().length
        line += thegroup.mp + ' '.repeat(padding)
        line += thegroup.w + ' '
        line += thegroup.d + ' '
        line += thegroup.l + ' '
        padding = 2 - thegroup.gf.toString().length
        line += thegroup.gf + ' '.repeat(padding)
        padding = 2 - thegroup.ga.toString().length
        line += thegroup.ga + ' '.repeat(padding)
        line += thegroup.pts + ' '.repeat(padding)

        lines.push(line)
      }

      const group_teams = lines.join('\n')
      // console.log(group)
      // console.log(lines)
      // console.log(group_teams)

      const msg = '```' + group_header + group_teams_header + group_teams + '```'
      MessageStrategy.typing(message)
      MessageStrategy.client.sendText(message.from, msg)
    } catch (err) {
      // console.log(err)
    }
  }

  static async filterMatches (type) {
    const filtered = []
    for (let y = 0; y < WorldCup.json_matches.length; y++) {
      if (WorldCup.json_matches[y].type === type) {
        filtered.push(WorldCup.json_matches[y])
      }
    }

    return filtered
  }

  static async orderMatches (matches, order) {
    const filtered = []

    for (let u = 0; u < matches.length; u++) {
      filtered[u] = {}
    }
    loop1:
    for (let y = 0; y < matches.length; y++) {
      loop2:
      for (let i = 0; i < order.length; i++) {
        // console.log(order[i])
        if (matches[y].home_team_en === order[i] || matches[y].away_team_en === order[i]) {
          const index = i === 0 ? 0 : Math.floor(i / 2)
          filtered[index] = matches[y]
          break loop2
        }
      }
    }

    return filtered
  }

  static async GetHomeAwayOrder (matches, order) {
    for (let y = 0; y < matches.length; y++) {
      for (let i = 0; i < order.length; i++) {
        if (matches[y].home_team_en === order[i] || matches[y].away_team_en === order[i]) {
          return i === 0 ? 0 : Math.floor(i / 2)
        }
      }
    }
  }

  static async StageReplace (stage, template, lookup = false) {
    let filtered = await WorldCup.filterMatches(stage)

    let state_sep = ''
    if (stage === 'R16') state_sep = 'R16'
    if (stage === 'semi') state_sep = 'S'
    if (stage === 'QR') state_sep = 'Q'
    if (stage === 'FIN') state_sep = 'F'

    if (lookup) {
      filtered = (stage === 'QR') ? await WorldCup.orderMatches(filtered, WorldCup.l16Order) : filtered
      filtered = (stage === 'semi') ? await WorldCup.orderMatches(filtered, WorldCup.qOrder) : filtered
      filtered = (stage === 'FIN') ? await WorldCup.orderMatches(filtered, WorldCup.sOrder) : filtered
    }

    for (let t = 0; t < filtered.length; t++) {
      if (filtered[t] === undefined) {
        continue
      }
      const home = Object.keys(filtered[t]).indexOf('home_team_en') > -1 ? filtered[t].home_team_en : ''
      const away = Object.keys(filtered[t]).indexOf('away_team_en') > -1 ? filtered[t].away_team_en : ''

      let fullscore_home = ''
      let fullscore_away = ''

      if (filtered[t].home_score !== undefined && filtered[t].away_score !== undefined) {
        fullscore_home = parseInt(filtered[t].home_score)
        fullscore_away = parseInt(filtered[t].away_score)

        if (filtered[t].home_scorers[0] !== 'null') {
          if (filtered[t].home_scorers[0].indexOf('Penalties(') > -1) {
            // console.log(filtered[t].home_scorers[0])
            let penos = filtered[t].home_scorers[0].split('Penalties(')
            penos = penos[1].split(')')
            fullscore_home += parseInt(penos[0])
          }
        }

        if (filtered[t].away_scorers[0] !== 'null') {
          if (filtered[t].away_scorers[0].indexOf('Penalties(') > -1) {
            // console.log(filtered[t].away_scorers[0])
            let penos = filtered[t].away_scorers[0].split('Penalties(')
            penos = penos[1].split(')')
            fullscore_away += parseInt(penos[0])
          }
        }
      }

      let home_score = fullscore_home === '' ? '' : ' (' + fullscore_home.toString() + ')'
      let away_score = fullscore_away === '' ? '' : ' (' + fullscore_away.toString() + ')'

      if (filtered[t].time_elapsed === 'notstarted') {
        home_score = ''
        away_score = ''
      }

      const home_flag = Object.keys(MessageStrategy.flags).indexOf(home) > -1 ? MessageStrategy.flags[home] : ''
      const away_flag = Object.keys(MessageStrategy.flags).indexOf(away) > -1 ? MessageStrategy.flags[away] : ''

      let home_replace = 'M' + (t + 1).toString()
      home_replace += state_sep
      const flag_home_replace = home_replace + 'FlagHome'
      home_replace += 'Home'

      let away_replace = 'M' + (t + 1).toString()
      away_replace += state_sep
      const flag_away_replace = away_replace + 'FlagAway'
      away_replace += 'Away'

      const home_vanity = WorldCup.countries[home] === undefined ? 'TBC ' + MessageStrategy.flags.World : WorldCup.countries[home]
      const away_vanity = WorldCup.countries[away] === undefined ? 'TBC' + MessageStrategy.flags.World : WorldCup.countries[away]
      template = template.replace(home_replace, home_vanity + home_score)
      template = template.replace(away_replace, away_vanity + away_score)
      template = template.replace(flag_home_replace, home_flag)
      template = template.replace(flag_away_replace, away_flag)

      if (stage === 'R16') {
        if (filtered[t].home_score > filtered[t].away_score) {
          WorldCup.l16Order.push(home)
        } else {
          WorldCup.l16Order.push(away)
        }
      }

      if (stage === 'QR') {
        if (filtered[t].home_score > filtered[t].away_score) {
          WorldCup.qOrder.push(home)
        } else {
          WorldCup.qOrder.push(away)
        }
      }

      if (stage === 'semi') {
        if (filtered[t].home_score > filtered[t].away_score) {
          WorldCup.sOrder.push(home)
        } else {
          WorldCup.sOrder.push(away)
        }
      }
    }

    return template
  }

  static async ShowGroupStages (message, num = 16) {
    const sep = ' '.repeat(20)

    let template16 = ''
    template16 = 'M1R16FlagHome M1R16Home\n'
    template16 += sep + 'M1QFlagHome M1QHome\n'
    template16 += 'M1R16FlagAway M1R16Away\n'
    template16 += sep + sep + 'M1SFlagHome M1SHome\n'
    template16 += 'M2R16FlagHome M2R16Home\n'
    template16 += sep + 'M1QFlagAway M1QAway\n'
    template16 += 'M2R16FlagAway M2R16Away\n'
    template16 += sep + sep + sep + 'M1FFlagHome M1FHome\n'
    template16 += 'M3R16FlagHome M3R16Home\n'
    template16 += sep + 'M2QFlagHome M2QHome\n'
    template16 += 'M3R16FlagAway M3R16Away\n'
    template16 += sep + sep + 'M1SFlagAway M1SAway\n'
    template16 += 'M4R16FlagHome M4R16Home\n'
    template16 += sep + 'M2QFlagAway M2QAway\n'
    template16 += 'M4R16FlagAway M4R16Away\n\n'
    template16 += sep + sep + sep + sep + MessageStrategy.flags.World + '\n\n'
    template16 += 'M5R16FlagHome M5R16Home\n'
    template16 += sep + 'M3QFlagHome M3QHome\n'
    template16 += 'M5R16FlagAway M5R16Away\n'
    template16 += sep + sep + 'M2SFlagHome M2SHome\n'
    template16 += 'M6R16FlagHome M6R16Home\n'
    template16 += sep + 'M3QFlagAway M3QAway\n'
    template16 += 'M6R16FlagAway M6R16Away\n'
    template16 += sep + sep + sep + 'M1FFlagAway M1FAway\n'
    template16 += 'M7R16FlagHome M7R16Home\n'
    template16 += sep + 'M4QFlagHome M4QHome\n'
    template16 += 'M7R16FlagAway M7R16Away\n'
    template16 += sep + sep + 'M2SFlagAway M2SAway\n'
    template16 += 'M8R16FlagHome M8R16Home\n'
    template16 += sep + 'M4QFlagAway M4QAway\n'
    template16 += 'M8R16FlagAway M8R16Away\n'

    let templateq = ''
    templateq = 'M1QFlagHome M1QHome\n'
    templateq += sep + 'M1SFlagHome M1SHome\n'
    templateq += 'M1QFlagAway M1QAway\n'
    templateq += sep + sep + 'M1FFlagHome M1FHome\n'
    templateq += 'M2QFlagHome M2QHome\n'
    templateq += sep + 'M1SFlagAway M1SAway\n'
    templateq += 'M2QFlagAway M2QAway\n'
    templateq += sep + sep + sep + MessageStrategy.flags.World + '\n\n'
    templateq += 'M3QFlagHome M3QHome\n'
    templateq += sep + 'M2SFlagHome M2SHome\n'
    templateq += 'M3QFlagAway M3QAway\n'
    templateq += sep + sep + 'M1FFlagAway M1FAway\n'
    templateq += 'M4QFlagHome M4QHome\n'
    templateq += sep + 'M2SFlagAway M2SAway\n'
    templateq += 'M4QFlagAway M4QAway\n'

    let templates = ''
    templates = 'M1SFlagHome M1SHome\n'
    templates += sep + 'M1FFlagHome M1FHome\n'
    templates += 'M1SFlagAway M1SAway\n'
    templates += sep + sep + WorldCup.countries.World + '\n\n'
    templates += 'M2SFlagHome M2SHome\n'
    templates += sep + 'M1FFlagAway M1FAway\n'
    templates += 'M2SFlagAway M2SAway\n'

    let templatef = ''
    templatef = 'M1FFlagHome M1FHome\n'
    templatef += sep + 'W\n'
    templatef += 'M1FFlagAway M1FAway\n'

    let msg = ''

    try {
      if (WorldCup.json_matches === undefined) {
        // console.log('Empty matches')
        return
      }

      if (num === 2) {
        const res = await WorldCup.StageReplace('FIN', templatef)
        msg = res
      }

      if (num === 4) {
        let res = await WorldCup.StageReplace('semi', templates)
        res = await WorldCup.StageReplace('FIN', res, true)
        msg = res
      }

      if (num === 8) {
        let res = await WorldCup.StageReplace('QR', templateq)
        res = await WorldCup.StageReplace('semi', res, true)
        res = await WorldCup.StageReplace('FIN', res, true)
        msg = res
      }

      if (num === 16) {
        let res = await WorldCup.StageReplace('R16', template16)
        res = await WorldCup.StageReplace('QR', res, true)
        res = await WorldCup.StageReplace('semi', res, true)
        res = await WorldCup.StageReplace('FIN', res, true)
        msg = res
      }

      MessageStrategy.typing(message)
      MessageStrategy.client.sendText(message.from, msg)
    } catch (err) {
      // console.log(err)
    }
  }

  static async Group (message) {
    try {
      const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
      const requested_letter = message.body.substring('wc group '.length).toUpperCase()
      if (groups.indexOf(requested_letter) > -1) {
        WorldCup.ShowGroup(message, requested_letter)
      }
    } catch (err) {
      // console.log(err)
    }
  }

  static async Groups (message) {
    try {
      const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
      groups.forEach(function (item, index, arr) {
        WorldCup.ShowGroup(message, arr[index])
      })
    } catch (err) {
      // console.log(err)
    }
  }

  static async GroupMatches (message) {
    try {
      WorldCup.ShowMatches(message, message.body.substring('wc matches '.length).toUpperCase())
    } catch (err) {
      // console.log(err)
    }
  }

  static async TeamMatches (message) {
    try {
      WorldCup.ShowMatches(message, message.body.substring('wc matches '.length).toUpperCase())
    } catch (err) {
      // console.log(err)
    }
  }

  static async Matches (message) {
    try {
      WorldCup.ShowMatches(message, null)
    } catch (err) {
      // console.log(err)
    }
  }

  static async CurrentMatches (message) {
    try {
      WorldCup.ShowMatches(message, null, false, false, true)
    } catch (err) {
      // console.log(err)
    }
  }

  static async MatchesToday (message) {
    try {
      WorldCup.ShowMatches(message, null, true, false, false)
    } catch (err) {
      // console.log(err)
    }
  }

  static async MatchesTomorrow (message) {
    try {
      WorldCup.ShowMatches(message, null, false, true, false)
    } catch (err) {
      // console.log(err)
    }
  }

  static async Last16 (message) {
    try {
      WorldCup.ShowGroupStages(message, 16)
    } catch (err) {
      // console.log(err)
    }
  }

  static async Quarters (message) {
    try {
      WorldCup.ShowGroupStages(message, 8)
    } catch (err) {
      // console.log(err)
    }
  }

  static async Semis (message) {
    try {
      WorldCup.ShowGroupStages(message, 4)
    } catch (err) {
      // console.log(err)
    }
  }

  static async Final (message) {
    try {
      WorldCup.ShowGroupStages(message, 2)
    } catch (err) {
      // console.log(err)
    }
  }

  static async Update (message) {
    try {
      await WorldCup.updateMatches(message)
    } catch (err) {
      // console.log(err)
    }
  }
}

module.exports = {
  MessageStrategy: WorldCup
}
