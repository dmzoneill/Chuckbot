const MessageStrategy = require('../MessageStrategy.js')

// ####################################
// Weather
// ####################################

class Weather extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name)
  static self = null

  constructor () {
    super('Weather', {
      enabled: true
    })
  }

  provides () {
    Weather.self = this

    return {
      help: 'Gets the weather for a given area',
      provides: {
        'weather x': {
          test: function (message) {
            return message.body.toLowerCase().startsWith('weather')
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Gets the weather for a given place'
          },
          action: function GetWeather (message) {
            Weather.self.GetWeather(message)
            return true
          },
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Weather.enabled
          }
        }
      },
      access: function (message, strategy) {
        return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name)
      },
      enabled: function () {
        return MessageStrategy.state.Weather.enabled
      }
    }
  }

  GetWeather (message) {
    const search_term = message.body.substring(7)
    weather.find({ search: search_term, degreeType: 'C' }, function (err, result) {
      if (err) { 
        console.log(err)
        return
      }

      MessageStrategy.typing(message)
      let report = result[0].location.name
      report += '\n'
      report += 'Current: '
      report += result[0].current.skytext + ' '
      report += result[0].current.temperature
      report += result[0].location.degreetype
      report += '\n'
      report += 'Feels like: '
      report += result[0].current.feelslike
      report += result[0].location.degreetype
      MessageStrategy.client.sendText(message.from, report)
    })
  }
}

module.exports = {
  MessageStrategy: Weather
}
