const CronJob = require('cron').CronJob
const fs = require('fs')
const globby = require('globby')
const levenshtein = require('js-levenshtein')
const request = require('sync-request')
const crypto = require('crypto')
const CoinMarketCap = require('coinmarketcap-api')
const puppeteer = require('puppeteer')
const deluge = require('deluge')
const resizeImg = require('resize-image-buffer')
const Jimp = require("jimp")
const axios = require('axios')
const urlencode = require('rawurlencode')
const nameToImdb = require('name-to-imdb')
const { translate } = require('bing-translate-api')
const ud = require('@dmzoneill/urban-dictionary')
const weather = require('weather-js')
const wiki = require('wikipedia')
const yt = require('youtube-search-without-api-key')
const NodeWebcam = require('node-webcam')
const exec = require('child_process')
const jsdom = require('jsdom')
const YAML = require('yaml')
const x2j = require('xml2json');
const yahooStockAPI = require('yahoo-stock-api').default
const ccxt = require('ccxt')
const asciichart = require('asciichart')
const IG = require('instagram-web-api')
const usetube = require('usetube')
const talib = require('talib');
const { createCanvas } = require('canvas');

// const imageboard = require('imageboard')
// const TradingView = require('tradingview')

const strategies_dir = './strategies/'

class MessageStrategy {
  static derived = new Set()
  static state = {}
  static strategies = {}
  static contacts = []
  static contacts_verbose = []
  static groups = []
  static groups_verbose = []
  static watcher = null
  static watched_events = {}
  static access_paths = []
  static last_event = null
  static self = null
  static contact_update_counter = 10
  static http_cache_folder = 'strategies/http_cache_folder'

  static browser_config = {
    headers: {
      Accept: '*/*',
      'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
      'Access-Control-Request-Headers': 'content-type',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Origin': 'https://google.com/',
      'Pragma': 'no-cache',
      'Referer': 'https://google.com/',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-site',
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36'
    }
  }

  static flags = {
    World: '🌎',
    'Ascension Island': '🇦🇨',
    Andorra: '🇦🇩',
    'United Arab Emirates': '🇦🇪',
    Afghanistan: '🇦🇫',
    'Antigua & Barbuda': '🇦🇬',
    Anguilla: '🇦🇮',
    Albania: '🇦🇱',
    Armenia: '🇦🇲',
    Angola: '🇦🇴',
    Antarctica: '🇦🇶',
    Argentina: '🇦🇷',
    'American Samoa': '🇦🇸',
    Austria: '🇦🇹',
    Australia: '🇦🇺',
    Aruba: '🇦🇼',
    'Åland Islands': '🇦🇽',
    Azerbaijan: '🇦🇿',
    'Bosnia & Herzegovina': '🇧🇦',
    Barbados: '🇧🇧',
    Bangladesh: '🇧🇩',
    Belgium: '🇧🇪',
    BurkinaFaso: '🇧🇫',
    Bulgaria: '🇧🇬',
    Bahrain: '🇧🇭',
    Burundi: '🇧🇮',
    Benin: '🇧🇯',
    'St.Barthélemy': '🇧🇱',
    Bermuda: '🇧🇲',
    Brunei: '🇧🇳',
    Bolivia: '🇧🇴',
    'Caribbean Netherlands': '🇧🇶',
    Brazil: '🇧🇷',
    Bahamas: '🇧🇸',
    Bhutan: '🇧🇹',
    'Bouvet Island': '🇧🇻',
    Botswana: '🇧🇼',
    Belarus: '🇧🇾',
    Belize: '🇧🇿',
    Canada: '🇨🇦',
    'Cocos(Keeling)Islands': '🇨🇨',
    'Congo-Kinshasa': '🇨🇩',
    'Central African Republic': '🇨🇫',
    'Congo-Brazzaville': '🇨🇬',
    Switzerland: '🇨🇭',
    'Côted’Ivoire': '🇨🇮',
    'Cook Islands': '🇨🇰',
    Chile: '🇨🇱',
    Cameroon: '🇨🇲',
    China: '🇨🇳',
    Colombia: '🇨🇴',
    'Clipperton Island': '🇨🇵',
    'Costa Rica': '🇨🇷',
    Cuba: '🇨🇺',
    CapeVerde: '🇨🇻',
    Curaçao: '🇨🇼',
    'Christmas Island': '🇨🇽',
    Cyprus: '🇨🇾',
    Czechia: '🇨🇿',
    Germany: '🇩🇪',
    DiegoGarcia: '🇩🇬',
    Djibouti: '🇩🇯',
    Denmark: '🇩🇰',
    Dominica: '🇩🇲',
    'Dominican Republic': '🇩🇴',
    Algeria: '🇩🇿',
    'Ceuta&Melilla': '🇪🇦',
    Ecuador: '🇪🇨',
    Estonia: '🇪🇪',
    Egypt: '🇪🇬',
    'Western Sahara': '🇪🇭',
    Eritrea: '🇪🇷',
    Spain: '🇪🇸',
    Ethiopia: '🇪🇹',
    'European Union': '🇪🇺',
    Finland: '🇫🇮',
    Fiji: '🇫🇯',
    'Falkland Islands': '🇫🇰',
    Micronesia: '🇫🇲',
    'Faroe Islands': '🇫🇴',
    France: '🇫🇷',
    Gabon: '🇬🇦',
    'United Kingdom': '🇬🇧',
    Grenada: '🇬🇩',
    Georgia: '🇬🇪',
    'French Guiana': '🇬🇫',
    Guernsey: '🇬🇬',
    Ghana: '🇬🇭',
    Gibraltar: '🇬🇮',
    Greenland: '🇬🇱',
    Gambia: '🇬🇲',
    Guinea: '🇬🇳',
    Guadeloupe: '🇬🇵',
    'Equatorial Guinea': '🇬🇶',
    Greece: '🇬🇷',
    'South Georgia&': '🇬🇸',
    Guatemala: '🇬🇹',
    Guam: '🇬🇺',
    'Guinea-Bissau': '🇬🇼',
    Guyana: '🇬🇾',
    'Hong Kong SAR': '🇭🇰',
    'Heard&McDonald': '🇭🇲',
    Honduras: '🇭🇳',
    Croatia: '🇭🇷',
    Haiti: '🇭🇹',
    Hungary: '🇭🇺',
    'Canary Islands': '🇮🇨',
    Indonesia: '🇮🇩',
    Ireland: '🇮🇪',
    Israel: '🇮🇱',
    'Isle of Man': '🇮🇲',
    India: '🇮🇳',
    'British Indian Ocean': '🇮🇴',
    Iraq: '🇮🇶',
    Iran: '🇮🇷',
    Iceland: '🇮🇸',
    Italy: '🇮🇹',
    Jersey: '🇯🇪',
    Jamaica: '🇯🇲',
    Jordan: '🇯🇴',
    Japan: '🇯🇵',
    Kenya: '🇰🇪',
    Kyrgyzstan: '🇰🇬',
    Cambodia: '🇰🇭',
    Kiribati: '🇰🇮',
    Comoros: '🇰🇲',
    'St.Kitts&': '🇰🇳',
    'North Korea': '🇰🇵',
    'Korea Republic': '🇰🇷',
    'South Korea': '🇰🇷',
    Kuwait: '🇰🇼',
    'Cayman Islands': '🇰🇾',
    Kazakhstan: '🇰🇿',
    Laos: '🇱🇦',
    Lebanon: '🇱🇧',
    'St.Lucia': '🇱🇨',
    Liechtenstein: '🇱🇮',
    SriLanka: '🇱🇰',
    Liberia: '🇱🇷',
    Lesotho: '🇱🇸',
    Lithuania: '🇱🇹',
    Luxembourg: '🇱🇺',
    Latvia: '🇱🇻',
    Libya: '🇱🇾',
    Morocco: '🇲🇦',
    Monaco: '🇲🇨',
    Moldova: '🇲🇩',
    Montenegro: '🇲🇪',
    'St.Martin': '🇲🇫',
    Madagascar: '🇲🇬',
    'Marshall Islands': '🇲🇭',
    'North Macedonia': '🇲🇰',
    Mali: '🇲🇱',
    'Myanmar(Burma)': '🇲🇲',
    Mongolia: '🇲🇳',
    'MacaoSar China': '🇲🇴',
    'Northern Mariana Islands': '🇲🇵',
    Martinique: '🇲🇶',
    Mauritania: '🇲🇷',
    Montserrat: '🇲🇸',
    Malta: '🇲🇹',
    Mauritius: '🇲🇺',
    Maldives: '🇲🇻',
    Malawi: '🇲🇼',
    Mexico: '🇲🇽',
    Malaysia: '🇲🇾',
    Mozambique: '🇲🇿',
    Namibia: '🇳🇦',
    NewCaledonia: '🇳🇨',
    Niger: '🇳🇪',
    'Norfolk Island': '🇳🇫',
    Nigeria: '🇳🇬',
    Nicaragua: '🇳🇮',
    Netherlands: '🇳🇱',
    Nederlands: '🇳🇱',
    Norway: '🇳🇴',
    Nepal: '🇳🇵',
    Nauru: '🇳🇷',
    Niue: '🇳🇺',
    'New Zealand': '🇳🇿',
    Oman: '🇴🇲',
    Panama: '🇵🇦',
    Peru: '🇵🇪',
    'French Polynesia': '🇵🇫',
    'Papua New Guinea': '🇵🇬',
    Philippines: '🇵🇭',
    Pakistan: '🇵🇰',
    Poland: '🇵🇱',
    'St.Pierre&': '🇵🇲',
    PitcairnIslands: '🇵🇳',
    'Puerto Rico': '🇵🇷',
    'Palestinian Territories': '🇵🇸',
    Portugal: '🇵🇹',
    Palau: '🇵🇼',
    Paraguay: '🇵🇾',
    Qatar: '🇶🇦',
    Réunion: '🇷🇪',
    Romania: '🇷🇴',
    Serbia: '🇷🇸',
    Russia: '🇷🇺',
    Rwanda: '🇷🇼',
    'Saudi Arabia': '🇸🇦',
    'Solomon Islands': '🇸🇧',
    Seychelles: '🇸🇨',
    Sudan: '🇸🇩',
    Sweden: '🇸🇪',
    Singapore: '🇸🇬',
    'St.Helena': '🇸🇭',
    Slovenia: '🇸🇮',
    'Svalbard&Jan': '🇸🇯',
    Slovakia: '🇸🇰',
    'Sierra Leone': '🇸🇱',
    'San Marino': '🇸🇲',
    Senegal: '🇸🇳',
    Somalia: '🇸🇴',
    Suriname: '🇸🇷',
    'South Sudan': '🇸🇸',
    'SãoTomé&': '🇸🇹',
    ElSalvador: '🇸🇻',
    SintMaarten: '🇸🇽',
    Syria: '🇸🇾',
    Eswatini: '🇸🇿',
    TristanDaCunha: '🇹🇦',
    'Turks & Caicos': '🇹🇨',
    Chad: '🇹🇩',
    'French Southern Territories': '🇹🇫',
    Togo: '🇹🇬',
    Thailand: '🇹🇭',
    Tajikistan: '🇹🇯',
    Tokelau: '🇹🇰',
    'Timor-Leste': '🇹🇱',
    Turkmenistan: '🇹🇲',
    Tunisia: '🇹🇳',
    Tonga: '🇹🇴',
    Turkey: '🇹🇷',
    'Trinidad & Tobago': '🇹🇹',
    Tuvalu: '🇹🇻',
    Taiwan: '🇹🇼',
    Tanzania: '🇹🇿',
    Ukraine: '🇺🇦',
    Uganda: '🇺🇬',
    'U.S.OutlyingIslands': '🇺🇲',
    'United Nations': '🇺🇳',
    'United States': '🇺🇸',
    Uruguay: '🇺🇾',
    Uzbekistan: '🇺🇿',
    'Vatican City': '🇻🇦',
    'St.Vincent&': '🇻🇨',
    Venezuela: '🇻🇪',
    'British Virgin Islands': '🇻🇬',
    'U.S.VirginIslands': '🇻🇮',
    Vietnam: '🇻🇳',
    Vanuatu: '🇻🇺',
    'Wallis & Futuna': '🇼🇫',
    Samoa: '🇼🇸',
    Kosovo: '🇽🇰',
    Yemen: '🇾🇪',
    Mayotte: '🇾🇹',
    'South Africa': '🇿🇦',
    Zambia: '🇿🇲',
    Zimbabwe: '🇿🇼',
    England: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    Scotland: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
    Wales: '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
    'forTexas(US-TX)': '🏴󠁵󠁳󠁴󠁸󠁿'
  }

  static client = {
    client: null,
    log: function () {
      // let output = new Error().stack.toString().match(/at \w+\.\w+/)[0].split('.')[1].padEnd(20, ' ');
      // for (let u = 0; u < arguments.length; u++) {
      //   try {
      //     output += arguments[u].toString().padEnd(40, ' ')
      //   } catch(err) {

      //   }
      // }
      // console.log(output);
    },
    sendText: function sendText() {
      const args = Array.from(arguments)
      this.log(args[0], args[1])
      return this.client.sendText(args[0], args[1])
    },
    sendImage: function sendImage() {
      const args = Array.from(arguments)
      this.log(args[0], args[1], args[2], args[3])
      return this.client.sendImage(args[0], args[1], args[2], args[3])
    },
    sendLinkWithAutoPreview: function sendLinkWithAutoPreview() {
      const args = Array.from(arguments)
      this.log(args[0], args[1], args[2], args[3])
      return this.client.sendLinkWithAutoPreview(args[0], args[1], args[2], args[3])
    },
    sendMessageWithThumb: function sendMessageWithThumb() {
      const args = Array.from(arguments)
      this.log(args[0], args[1], args[2], args[3], args[4], args[5])
      console.log("send message with thumb")
      return this.client.sendMessageWithThumb(args[0], args[1], args[2], args[3], args[4], args[5])
    },
    reply: function reply() {
      const args = Array.from(arguments)
      this.log(args[0], args[1], args[2], args[3])
      return this.client.reply(args[0], args[1], args[2], args[3])
    },
    getAllChats: function getAllChats() {
      const args = Array.from(arguments)
      return this.client.getAllChats()
    },
    getAllGroups: function getAllGroups() {
      const args = Array.from(arguments)
      this.log(args[0], args[1])
      return this.client.getAllGroups(args[0], args[1])
    },
    getGroupMembers: function getGroupMembers() {
      const args = Array.from(arguments)
      this.log(args[0])
      return this.client.getGroupMembers(args[0])
    },
    sendYoutubeLink: function sendYoutubeLink() {
      const args = Array.from(arguments)
      this.log(args[0], args[1], args[2], args[3])
      return this.client.sendYoutubeLink(args[0], args[1], args[2], args[3])
    },
    decryptMedia: function decryptMedia() {
      const args = Array.from(arguments)
      this.log(args[0])
      return this.client.decryptMedia(args[0])
    },
    sendFile: function sendFile() {
      const args = Array.from(arguments)
      this.log(args[0], args[1], args[2], args[3])
      return this.client.sendFile(args[0], args[1], args[2], args[3])
    },
    sendSeen: function sendSeen() {
      const args = Array.from(arguments)
      this.log(args[0])
      return this.client.sendSeen(args[0])
    },
    simulateTyping: function simulateTyping() {
      const args = Array.from(arguments)
      this.log(args[0], args[1])
      return this.client.simulateTyping(args[0], args[1])
    },
    leaveGroup: function leaveGroup() {
      const args = Array.from(arguments)
      this.log(args[0])
      return this.client.leaveGroup(args[0])
    }
  }

  constructor(key, config) {
    MessageStrategy.self = this
    if (Object.keys(MessageStrategy.state).includes(key) == false) {
      MessageStrategy.state[key] = config
    }
  }

  static hasAccess(sender_id, prototype_name) {
    if (MessageStrategy.access_paths.includes(prototype_name) == false) {
      MessageStrategy.access_paths.push(prototype_name)
    }
    return MessageStrategy.strategies.Rbac.hasAccess(sender_id, prototype_name)
  }

  static watch() {
    if (MessageStrategy.watcher != null) {
      MessageStrategy.watcher.close()
    }

    fs.watch(strategies_dir, (event, filename) => {
      if (filename) {
        MessageStrategy.update_strategy(filename)
      }
    })
  }

  static async update_active_chat_contacts() {
    MessageStrategy.contacts = []
    const all_chats = await MessageStrategy.client.getAllChats()

    for (let h = 0; h < all_chats.length; h++) {
      if (MessageStrategy.contacts.indexOf(all_chats[h].contact.id) > -1) {
        continue
      }
      MessageStrategy.contacts.push(all_chats[h].contact.id)
      MessageStrategy.contacts_verbose.push(all_chats[h].contact.id + ' ' + all_chats[h].contact.name)
    }

    const all_groups = await MessageStrategy.client.getAllGroups()

    for (let h = 0; h < all_groups.length; h++) {
      MessageStrategy.groups.push(all_groups[h].id)
      MessageStrategy.groups_verbose.push(all_groups[h].id + ' ' + all_groups[h].name)
      const members = await MessageStrategy.client.getGroupMembers(all_groups[h].id)
      for (let k = 0; k < members.length; k++) {
        if (MessageStrategy.contacts.indexOf(members[k].id.trim()) > -1) continue
        MessageStrategy.contacts.push(members[k].id.trim())
      }
    }
  }

  static async get_chat_id(message) {
    if (message == null) {
      return
    }
    if (Object.keys(message).indexOf('chatId') > -1) {
      return message.chatId
    } else {
      return message.from
    }
  }

  static async typing(message) {
    try {
      if (message.from == "chuck") {
        return;
      }
      await MessageStrategy.client.simulateTyping(await MessageStrategy.get_chat_id(message), true)
      await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 1000)))
      await MessageStrategy.client.simulateTyping(await MessageStrategy.get_chat_id(message), false)
    } catch (err) {
      console.log(err)
    }
  }

  static update_strategy(file) {
    try {
      if (Object.keys(MessageStrategy.watched_events).includes(strategies_dir + file) == false) {
        MessageStrategy.watched_events[strategies_dir + file] = new Date(0)
      }
      fs.stat(strategies_dir + file, function (err, stats) {
        try {
          if (stats.mtime.valueOf() === MessageStrategy.watched_events[strategies_dir + file].valueOf()) {
            return
          }
          MessageStrategy.watched_events[strategies_dir + file] = stats.mtime
          MessageStrategy.changed = true
          delete require.cache[require.resolve(strategies_dir + file)]
          const instance = require(strategies_dir + file)
          const obj = eval(`new ${instance.MessageStrategy}()`)
          MessageStrategy.strategies[obj.constructor.name] = obj
          console.log(file + ' reloaded')
        } catch (err) {
          console.log(err)
        }
      })
    } catch (err) {
      console.log(err)
    }
  }

  static update_strategies() {
    if (Object.keys(MessageStrategy.strategies).length == 0) {
      MessageStrategy.strategies = {}
      MessageStrategy.watch()
    }

    MessageStrategy.update_strategy('State.js')
    MessageStrategy.update_strategy('Spam.js')
    MessageStrategy.update_strategy('Rbac.js')
    MessageStrategy.update_strategy('Feature.js')

    fs.readdir(strategies_dir, (err, files) => {
      if (err) {
        throw err
      }
      files.forEach(file => {
        if (file.endsWith('js')) {
          MessageStrategy.update_strategy(file)
        }
      })
    })
  }

  static doHandleMessage(message) {
    try {
      const keys = Object.keys(MessageStrategy.strategies)
      const is_chuck_event = Object.keys(message).indexOf('isChuck') != -1

      if (Object.keys(message).indexOf('chatId') == -1) {
        MessageStrategy.client.sendSeen(message.chatId)
      }
      

      for (let y = 0; y < keys.length; y++) {
        const handler = MessageStrategy.strategies[keys[y]]

        if (is_chuck_event) {
          handler.handleEvent(message)
          continue
        }

        const module = handler.provides(message)
        if (Object.keys(module).indexOf('provides') == -1) {
          continue
        }
        handler.message = message

        if (module.provides == null) continue

        console.log(" >> " + keys[y])

        const actions_keys = Object.keys(module.provides)
        for (let x = 0; x < actions_keys.length; x++) {
          const action_obj = module.provides[actions_keys[x]]
          MessageStrategy.hasAccess(message.sender.id, keys[y] + action_obj.action.name)
          if (action_obj.test(message)) {
            if (action_obj.access(message, handler, action_obj.action) == false) {
              MessageStrategy.client.reply(message.from, 'Access denied to ' + action_obj.action.name, message.id, true)
              y = keys.length
              break
            }
            if (action_obj.enabled() == false) {
              MessageStrategy.client.reply(message.from, 'Access denied, ' + action_obj.action.name + ' is disabled', message.id, true)
              y = keys.length
              break
            }
            if (module.access(message, handler) == false) {
              MessageStrategy.client.reply(message.from, 'Access denied to ' + keys[y], message.id, true)
              y = keys.length
              break
            }
            if (module.enabled() == false) {
              MessageStrategy.client.reply(message.from, 'Access denied, ' + keys[y] + ' is disabled', message.id, true)
              y = keys.length
              break
            }

            let action_result = action_obj.action(message)
            console.log(" >>>> " + keys[y] + " - " + actions_keys[x])
            action_result = action_result == undefined ? false : action_result

            if (action_result) {
              console.log("break")
              console.log(action_result)
              y = keys.length
              break
            }
          }
        }
      }

      if (is_chuck_event) {
        return
      }

      MessageStrategy.strategies.State.Save(message)
      
      if (MessageStrategy.contact_update_counter == 0 || MessageStrategy.contacts.length == 0) {
        MessageStrategy.self.call_update_active_chat_contacts()
        MessageStrategy.contact_update_counter = 10
      }
      MessageStrategy.contact_update_counter -= 1
    } catch (err) {
      console.log(err)
    }
  }

  static async get_image(url, img_width = 480, data_url = true) {
    const responseImage = await axios(url, { responseType: 'arraybuffer', headers: MessageStrategy.browser_config.headers })
    let jimpImg = undefined

    var buffer = Buffer.from(new Uint8Array(responseImage.data));
    await Jimp.read(buffer).then((img) => {
      img.resize(img_width, Jimp.AUTO)
      img.quality(70)
      jimpImg = img
    })
    let image = await jimpImg.getBufferAsync(Jimp.MIME_JPEG)

    const buffer64 = Buffer.from(image, 'binary').toString('base64')

    if (data_url) {
      return 'data:image/jpeg;base64,' + buffer64
    } else {
      return buffer64
    }
  }

  static async fs_get_image(path, img_width = 480) {
    try {
      let image = fs.readFileSync(path)
      let jimpImg = undefined

      var buffer = Buffer.from(new Uint8Array(image));
      await Jimp.read(buffer).then((img) => {
        img.resize(img_width, Jimp.AUTO)
        img.quality(70)
        jimpImg = img
      })
      image = await jimpImg.getBufferAsync(Jimp.MIME_JPEG)

      const buffer64 = Buffer.from(image, 'binary').toString('base64')
      return 'data:image/jpeg;base64,' + buffer64
    } catch (err) {
      console.log(err)
    }
  }

  static async axiosHttpRequest(message, method = 'GET', url, headers = false, statusCode = 200, json = false, json_key = false, verbose = true, post_data = false, cache = false, download = false) {
    try {
      const opts = {
        method: method.toLowerCase(),
        url
      }

      if (download) {
        opts['responseType'] = 'arraybuffer',
          opts['reponseEncoding'] = 'binary'
      }

      if (post_data != false) {
        opts.data = post_data
      }

      if (headers != false) {
        opts.headers = headers
      }

      const response = await axios(opts)

      if (response.status != statusCode) {
        MessageStrategy.typing(message)
        MessageStrategy.client.sendText(message.from, 'Received response code ' + response.status.toString() + ', expected ' + statusCode.toString())
        if (verbose) {
          MessageStrategy.client.sendText(message.from, response.data)
        }

        return json ? {} : ''
      }

      const json_reduced = json_key != false ? response.data[json_key] : response.data

      if (!fs.existsSync(MessageStrategy.http_cache_folder)) {
        fs.mkdirSync(MessageStrategy.http_cache_folder, { recursive: true })
      }

      if (cache) {
        await fs.writeFileSync(MessageStrategy.http_cache_folder + '/' + url.replaceAll('/', '.').replaceAll(':', '.') + (json ? '.json' : ''), JSON.stringify(response.data))
      }

      return json ? json_reduced : response.data
    } catch (err) {
      console.log(err)
    }
  }

  async randomIntFromInterval(min = 10800, max = 28800) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  handleEvent(message) {
    // const sha1 = crypto.createHash('sha1').update(JSON.stringify(message)).digest('hex')
    // if (MessageStrategy.last_event == null) {
    //   MessageStrategy.last_event = sha1
    //   console.log(message)
    // }
    // if (MessageStrategy.last_event != sha1) {
    //   MessageStrategy.last_event = sha1
    //   console.log(message)
    // }
  }

  async call_update_active_chat_contacts() {
    MessageStrategy.update_active_chat_contacts()
  }

  async waitFor(ms) {
    return new Promise(resolve => setTimeout(() => resolve(), ms))
  }

  async get_page(self, fullurl, wait = 500) {
    try {
      MessageStrategy.typing(self.message)

      const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'], headless: false })
      const page = await browser.newPage()
      await page.goto(fullurl)
      await page.setViewport({ width: 1366, height: 768 })

      const bodyHandle = await page.$('body')
      const { height } = await bodyHandle.boundingBox()

      MessageStrategy.typing(self.message)

      await bodyHandle.dispose()
      const calculatedVh = page.viewport().height
      let vhIncrease = 0
      while (vhIncrease + calculatedVh < height) {
        // Here we pass the calculated viewport height to the context
        // of the page and we scroll by that amount
        await page.evaluate(_calculatedVh => {
          window.scrollBy(0, _calculatedVh)
        }, calculatedVh)
        await self.waitFor(250)
        vhIncrease = vhIncrease + calculatedVh
      }

      MessageStrategy.typing(self.message)

      // Setting the viewport to the full height might reveal extra elements
      await page.setViewport({ width: 1366, height: calculatedVh })

      // Wait for a little bit more
      await self.waitFor(wait)

      // Scroll back to the top of the page by using evaluate again.
      await page.evaluate(_ => {
        window.scrollTo(0, 0)
      })

      MessageStrategy.typing(self.message)

      return page
    } catch (err) {
      console.log(err)
      return null
    }
  }

  async get_page_og_data(self, fullurl, wait = 500, data_url = true) {
    try {
      const page = await self.get_page(self, fullurl, wait)
      const data = await page.evaluate(() => document.querySelector('*').outerHTML);
      console.log(data)

      const description = await page.evaluate(() => {
        const desc = document.head.querySelector('meta[property="og:description"]')
        if (desc) {
          return desc.getAttribute('content')
        }
        return null
      })

      const image_url = await page.evaluate(() => {
        const image = document.head.querySelector('meta[property="og:image"]')
        if (image) {
          return image.getAttribute('content')
        }
        return null
      })

      const title = await page.evaluate(() => {
        return document.head.querySelector('title').innerText
      })

      // page.close()
      page.browser().close()

      if (image_url == null) {
        console.log("get_page_og_data image_url is null")
        return [null, null]
      } else {
        const desc = description == null ? title : description
        MessageStrategy.typing(self.message)
        return [desc, await MessageStrategy.get_image(image_url, 320, data_url)]
      }
    } catch (err) {
      console.log(err)
      return [null, null]
    }
  }

  async get_page_title(url, wait = 250) {
    try {
      const page = await MessageStrategy.get_page(url, wait)

      const description = await page.evaluate(() => {
        const desc = document.head.querySelector('meta[property="og:description"]')
        if (desc) {
          return desc.getAttribute('content')
        }
        return null
      })

      const title = await page.evaluate(() => {
        return document.head.querySelector('title').innerText
      })

      return description == null ? title : description
    } catch (err) {
      console.log(err)
    }
  }

  get_contacts() {
    return MessageStrategy.contacts
  }

  get_contacts_verbose() {
    return MessageStrategy.contacts_verbose
  }

  get_groups() {
    return MessageStrategy.groups
  }

  get_groups_verbose() {
    return MessageStrategy.groups_verbose
  }
}

module.exports = MessageStrategy
