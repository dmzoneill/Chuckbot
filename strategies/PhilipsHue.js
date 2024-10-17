const MessageStrategy = require('../MessageStrategy.js')

// ####################################
// PhilipsHue
// ####################################

class PhilipsHue extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name)
  static self = null

  constructor () {
    super('PhilipsHue', {
      enabled: true
    })
  }

  provides () {
    PhilipsHue.self = this

    return {
      help: 'Philips Hue light management',
      provides: {
        'hue x': {
          test: function (message) {
            return message.body.toLowerCase().startsWith('hue')
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return [
              'Hue',
              'Hue lights',
              'Hue ([0-9]+) (on|off|clear|reset|select|lselect|colorloop|[0-9a-zA-Z]{6})',
              'Hue ([0-9]+) (hue|sat|bri)=[0-9]+',
              'Hue ([0-9]+) ... (transitiontime=[0-9]+)',
              'Hue groups',
              'Hue group ([0-9]+) (on|off|clear|reset|select|lselect|colorloop|[0-9a-zA-Z]{6})',
              'Hue group ([0-9]+) (hue|sat|bri)=[0-9]+',
              'Hue group ([0-9]+) ... (transitiontime=[0-9]+)?'
            ].join('\n')
          },
          action: PhilipsHue.self.ChangeLighting,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.PhilipsHue.enabled
          }
        }
      },
      access: function (message, strategy) {
        return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name)
      },
      enabled: function () {
        return MessageStrategy.state.PhilipsHue.enabled
      }
    }
  }

  do_cmd (message, opts) {
    const cmd = './node_modules/hueadm/bin/hueadm ' + opts.join(' ')
    console.log(cmd)

    // eslint-disable-next-line no-undef
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`)
        MessageStrategy.client.reply(message.from, error.message, message.id, true)
        return
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`)
        MessageStrategy.client.reply(message.from, stderr, message.id, true)
        return
      }
      console.log(`stdout: ${stdout}`)
      let msg = '```'
      msg += stdout.replace(/\s*-\s*/gm, '\n').trim()
      msg += '```'
      MessageStrategy.client.reply(message.from, msg, message.id, true)
    })
  }

  ChangeLighting (message) {
    if (message.body.indexOf(' ') === 1) {
      return
    }

    const opts = message.body.split(' ')

    const cleanOpts = []
    const dodgey = [
      '\\', '"', "'", ';', '>', '<', '$', '&', '`',
      '!', '@', '(', ')', '|',
      '/', ',', '.', '?', '~', '{', '}', '[', ']'
    ]

    // group
    opts.forEach(opt => {
      const cleanOpts = opt

      for (let c = 0; c < dodgey.length; c++) {
        cleanOpts.replace(dodgey[c], '')
      }

      cleanOpts.push(cleanOpts)
    })

    // groups
    if (cleanOpts[1] === 'groups') {
      PhilipsHue.self.do_cmd([cleanOpts[1]])
      return
    }

    // groups
    if (cleanOpts[1] === 'lights') {
      PhilipsHue.self.do_cmd([cleanOpts[1]])
      return
    }

    let offset = 1

    if (cleanOpts[1] === 'group') {
      console.log('Group checking offset')
      offset = 2
    }

    if (cleanOpts[offset].match(/\d+/) === null) {
      console.log('No light or group number')
      MessageStrategy.client.reply(message.from, 'No light or group number', message.id, true)
      return
    }

    if (cleanOpts[offset + 1].match(/(on|off|clear|reset|select|lselect|colorloop|#?[0-9a-zA-Z]{6})/) === null) {
      console.log('Action should be on, off, clear, reset, select, lselect, colorloop, [0-9a-zA-Z]{6}')
      MessageStrategy.client.reply(message.from, 'Action should be on, off, clear, reset', message.id, true)
      return
    }

    if (cleanOpts[offset + 1].match(/#?[0-9a-zA-Z]{6}/) != null) {
      cleanOpts[offset + 1] = "'" + cleanOpts[offset + 1] + "'"
    }

    if (cleanOpts.length > 20) {
      console.log('Where are you off to?')
      MessageStrategy.client.reply(message.from, 'Where are you off to?', message.id, true)
      return
    }

    const options = [
      'hue=([0-9]{1,3})',
      'sat=([0-9]{1,3})',
      'bri=([0-9]{1,3})',
      'transitiontime=([0-9]{2,4})'
    ]

    // check repeating args
    for (let f = offset + 2; f < cleanOpts.length; f++) {
      let passed = false
      for (let h = 0; h < options.length; h++) {
        if (cleanOpts[f].match(new RegExp(options[h]))) {
          passed = true
        }
      }
      if (passed === false) {
        console.log('Additional option ' + options[f] + ' nonsense')
        MessageStrategy.client.reply(message.from, 'Additional option ' + options[f] + ' nonsense', message.id, true)
        return
      }
    }

    cleanOpts.shift()

    if (offset === 1) {
      cleanOpts.unshift('light')
    }

    console.log(cleanOpts)

    PhilipsHue.self.do_cmd(message, cleanOpts)
  }
}

module.exports = {
  MessageStrategy: PhilipsHue
}
