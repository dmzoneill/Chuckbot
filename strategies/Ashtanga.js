const MessageStrategy = require('../MessageStrategy.js')

// eslint-disable-next-line no-extend-native
Array.prototype.myJoin = function (seperator, start, end) {
  if (!start) start = 0
  if (!end) end = this.length - 1
  end++
  return this.slice(start, end).join(seperator)
}

// ####################################
// yoga asanas
// ####################################

class Ashtanga extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name)

  constructor () {
    super('Ashtanga', {
      enabled: true
    })

    this.yoga_keywords = [
      'primary series',
      'Samasthiti',
      'Surya Namaskara A',
      'Surya Namaskara B',
      'Padangushtasana',
      'Pada hastasana',
      'Utthita Trikonasana',
      'Parivritta Trikonasana',
      'Utthita Parshvakonasana',
      'Parivritta Parshvakonasana',
      'Prasarita Padottanasana A',
      'Prasarita Padottanasana B',
      'Prasarita Padottanasana C',
      'Prasarita Padottanasana D',
      'Parshvottanasana',
      'Utthita Hasta Padangushtasana',
      'Ardha Baddha Padmottanasana',
      'Utkatanasana',
      'Virabhadrasana A',
      'Virabhadrasana B',
      'Dandasana',
      'Paschimattanasana',
      'Purvatanasana',
      'Ardha Baddha Padma Paschimattanasana',
      'Trianga Mukhaekapada Paschima',
      'Janu Shirshasana A',
      'Janu Shirshasana B',
      'Janu Shirshasana C',
      'Marichyasana A',
      'Marichyasana B',
      'Marichyasana C',
      'Marichyasana D',
      'Navasana',
      'Bhujapidasana',
      'Kurmasana',
      'Supta Kurmasana',
      'Garbha Pindasana',
      'Kukkutasana',
      'Baddha Konasana',
      'Upavishta Konasana',
      'Supta Konasana',
      'Supta Padangushtasana',
      'Ubhaya Padangushtasana',
      'Urdhva Mukha Paschimattanasana',
      'Setu Bandhasana',
      'Urdhva Dhanurasana',
      'Paschimattanasana',
      'Salamba Sarvangasana',
      'Halasana',
      'Karnapidasana',
      'Urdhva Padmasana',
      'Pindasana',
      'Matsyasana',
      'Uttana Padasana',
      'Shirshasana',
      'Baddha Padmasana',
      'Yoga Mudra',
      'Padmasana',
      'Uth Pluthi',
      'Shavasana',
      'Urdhva Namashkar',
      'Uttanasana A',
      'Uttanasana B',
      'Chaturanga Dandasana',
      'Urdhva Mukha Savan asana',
      'Adho Mukha Savan asana',
      'Pashasana',
      'Krounchasana',
      'Shalabhasana A',
      'Shalabhasana B',
      'Bhekasana',
      'Dhanurasana',
      'Parsvadhanurasana',
      'Ustrasana',
      'Laghu Vajrasana',
      'Kapotasana',
      'Supta Vajrasana',
      'Bakasana',
      'Bharadvajasana',
      'Ardha Matsyendraasana',
      'Ekapada Sirsasana A',
      'Ekapada Sirsasana B',
      'Ekapada Sirsasana C',
      'Dwipada Sirsasana B',
      'Yoga nidrasana',
      'Tittibhasana A',
      'Tittibhasana B',
      'Tittibhasana C',
      'Pincha Mayurasana',
      'Karandavasana',
      'Mayurasana',
      'Nakrasana',
      'Vatayanasana',
      'Parighasana',
      'Gomukhasana A',
      'Gomukhasana B',
      'Gomukhasana C',
      'Supta Urdhvapada Vajrasana A',
      'Supta Urdhvapada Vajrasana B',
      'Supta Urdhvapada Vajrasana C',
      'Mukta Hasta Sirsasana A',
      'Mukta Hasta Sirsasana B',
      'Mukta Hasta Sirsasana C',
      'Baddha Hasta Sirsasana A',
      'Baddha Hasta Sirsasana B',
      'Baddha Hasta Sirsasana C',
      'Baddha Hasta Sirsasana D',
      'Urdhva Dhanurasana',
      'Paschimattanasana'
    ]
  }

  async print_sorted_with_files () {
    try {
      Ashtanga.self.yoga_keywords.sort()

      // eslint-disable-next-line no-undef
      const paths = await globby('strategies/poses/*.png')

      Ashtanga.self.yoga_keywords.forEach(async function (move) {
        let nearestDistance = 999
        let nearest = ''

        paths.forEach(async function (path) {
          // eslint-disable-next-line no-undef
          const distance = levenshtein('strategies/poses/' + move + '.png', path)
          if (distance < nearestDistance && distance < 5) {
            nearestDistance = distance
            nearest = path
            console.log(nearest)
          }
        })
      })
    } catch (err) {
      console.log(err)
    }
  }

  provides () {
    Ashtanga.self = this

    return {
      help: 'Provide information on Ashtanga yoga poses',
      provides: {
        'yoga start': {
          test: function (message) {
            return message.body.toLowerCase() === 'yoga start'
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Turns on the feature'
          },
          action: function YogaStart (message) {
            MessageStrategy.typing(message)
            MessageStrategy.client.sendText(message.from, 'First series')
            Ashtanga.self.enabled = true
            return true
          },
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Ashtanga.enabled
          }
        },
        'yoga stop': {
          test: function (message) {
            return message.body.toLowerCase() === 'yoga stop'
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Turns off the feature'
          },
          action: function YogaStart (message) {
            MessageStrategy.typing(message)
            MessageStrategy.client.sendText(message.from, 'Lets go to the gym')
            Ashtanga.self.enabled = false
            return true
          },
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Ashtanga.enabled
          }
        },
        'yoga list': {
          test: function (message) {
            return message.body.toLowerCase() === 'yoga list'
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Show a sorted list'
          },
          action: function YogaList (message) {
            MessageStrategy.typing(message)
            Ashtanga.self.print_sorted_with_files()
            return true
          },
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Ashtanga.enabled
          }
        },
        'yoga poses': {
          test: function (message) {
            return message.body.toLowerCase() === 'yoga poses'
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Show all yoga poses'
          },
          action: function YogaPoses (message) {
            MessageStrategy.typing(message)
            let msg = ''
            Ashtanga.self.yoga_keywords.forEach(term => {
              msg += term + '\n'
            })
            MessageStrategy.client.sendText(message.from, msg)
            return true
          },
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.Ashtanga.enabled
          }
        },
        '*': {
          test: function (message) {
            return true
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Scans messages for yoga poses and posts the picture'
          },
          action: Ashtanga.self.YogaEnabled,
          interactive: false,
          enabled: function () {
            return MessageStrategy.state.Ashtanga.enabled
          }
        }
      },
      access: function (message, strategy) {
        return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name)
      },
      enabled: function () {
        return MessageStrategy.state.Ashtanga.enabled
      }
    }
  }

  async post_yoga_image (client, message, move) {
    try {
      // eslint-disable-next-line no-undef
      const paths = await globby('strategies/poses/*.png')

      let nearestDistance = 999
      let nearest = ''

      paths.forEach(async function (path) {
        // eslint-disable-next-line no-undef
        const distance = levenshtein('strategies/poses/' + move + '.png', path)
        if (distance < nearestDistance) {
          nearestDistance = distance
          nearest = path
        }
      })

      if (nearestDistance > 3) {
        return
      }

      if (nearest !== '') {
        await client.sendImage(message.from, nearest, move, move, null, null, false, false, true, false)
      }
    } catch (err) {
      console.log(err)
    }
  }

  get_next_indices (arr, pos, seqlen) {
    // arr = [the, boy, is, in, the, river]
    const len = arr.length
    const wanted = pos + seqlen
    const maxIndice = wanted > len - 1 ? len - 1 : wanted - 1
    return arr.myJoin(' ', pos, maxIndice)
  }

  YogaEnabled (message) {
    if (Ashtanga.self.enabled) {
      let nearestDistance = 9999
      let nearest = 9999

      Ashtanga.self.yoga_keywords.forEach(async function (pose) {
        try {
          const yogaPose = pose.toLowerCase()
          // get the length of the pose
          // use this length to match sentance in the message
          const yogaPoseArr = yogaPose.indexOf(' ') > -1 ? yogaPose.split(' ') : [yogaPose]
          const targetStringArr = message.body.toLowerCase().indexOf(' ') > -1 ? message.body.toLowerCase().split(' ') : [message.body.toLowerCase()]

          for (let x = 0; x < targetStringArr.length; x++) {
            // create a string of the next yogaPoseArr.lenght indices from the target string
            const substring = Ashtanga.self.get_next_indices(targetStringArr, x, yogaPoseArr.length)
            // e.g: substring = "string of the next"

            // eslint-disable-next-line no-undef
            const distance = levenshtein(yogaPose, substring)
            if (distance < nearestDistance) {
              nearestDistance = distance
              nearest = pose
            }
          }
        } catch (err) {
          console.log(err)
        }
      })

      const checkDistance = nearest === 'Navasana' ? 1 : 5

      if (nearestDistance < checkDistance) {
        MessageStrategy.typing(message)
        Ashtanga.self.post_yoga_image(MessageStrategy.client, message, nearest)
        return true
      }
    }

    return false
  }
}

module.exports = {
  MessageStrategy: Ashtanga
}
