const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// Translate
// ####################################

class Translate extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);
  static self = null;

  constructor() {
    super('Translate', {
      'enabled': true,
      'user_defaults': {}
    });

    this.supported = {
      'Afrikaans': 'af',
      'Albanian': 'sq',
      'Amharic': 'am',
      'Arabic': 'ar',
      'Armenian': 'hy',
      'Assamese': 'as',
      'Azerbaijani': 'az',
      'Bangla': 'bn',
      'Bashkir': 'ba',
      'Basque': 'eu',
      'Bosnian': 'bs',
      'Bulgarian': 'bg',
      'Cantonese (Traditional)': 'yue',
      'Catalan': 'ca',
      'Chinese (Literary)': 'lzh',
      'Chinese Simplified': 'zh-Hans',
      'Chinese Traditional': 'zh-Hant',
      'Croatian': 'hr',
      'Czech': 'cs',
      'Danish': 'da',
      'Dari': 'prs',
      'Divehi': 'dv',
      'Dutch': 'nl',
      'English': 'en',
      'Estonian': 'et',
      'Faroese': 'fo',
      'Fijian': 'fj',
      'Filipino': 'fil',
      'Finnish': 'fi',
      'French': 'fr',
      'French (Canada)': 'fr-CA',
      'Galician': 'gl',
      'Georgian': 'ka',
      'German': 'de',
      'Greek': 'el',
      'Gujarati': 'gu',
      'Haitian Creole': 'ht',
      'Hebrew': 'he',
      'Hindi': 'hi',
      'Hmong Daw': 'mww',
      'Hungarian': 'hu',
      'Icelandic': 'is',
      'Indonesian': 'id',
      'Inuinnaqtun': 'ikt',
      'Inuktitut': 'iu',
      'Inuktitut (Latin)': 'iu-Latn',
      'Irish': 'ga',
      'Italian': 'it',
      'Japanese': 'ja',
      'Kannada': 'kn',
      'Kazakh': 'kk',
      'Khmer': 'km',
      'Klingon (Latin)': 'tlh-Latn',
      'Korean': 'ko',
      'Kurdish (Central)': 'ku',
      'Kurdish (Northern)': 'kmr',
      'Kyrgyz': 'ky',
      'Lao': 'lo',
      'Latvian': 'lv',
      'Lithuanian': 'lt',
      'Macedonian': 'mk',
      'Malagasy': 'mg',
      'Malay': 'ms',
      'Malayalam': 'ml',
      'Maltese': 'mt',
      'Marathi': 'mr',
      'Mongolian (Cyrillic)': 'mn-Cyrl',
      'Mongolian (Traditional)': 'mn-Mong',
      'Myanmar (Burmese)': 'my',
      'Māori': 'mi',
      'Nepali': 'ne',
      'Norwegian': 'nb',
      'Odia': 'or',
      'Pashto': 'ps',
      'Persian': 'fa',
      'Polish': 'pl',
      'Portuguese (Brazil)': 'pt',
      'Portuguese (Portugal)': 'pt-PT',
      'Punjabi': 'pa',
      'Querétaro Otomi': 'otq',
      'Romanian': 'ro',
      'Russian': 'ru',
      'Samoan': 'sm',
      'Serbian (Cyrillic)': 'sr-Cyrl',
      'Serbian (Latin)': 'sr-Latn',
      'Slovak': 'sk',
      'Slovenian': 'sl',
      'Somali': 'so',
      'Spanish': 'es',
      'Swahili': 'sw',
      'Swedish': 'sv',
      'Tahitian': 'ty',
      'Tamil': 'ta',
      'Tatar': 'tt',
      'Telugu': 'te',
      'Thai': 'th',
      'Tibetan': 'bo',
      'Tigrinya': 'ti',
      'Tongan': 'to',
      'Turkish': 'tr',
      'Turkmen': 'tk',
      'Ukrainian': 'uk',
      'Upper Sorbian': 'hsb',
      'Urdu': 'ur',
      'Uyghur': 'ug',
      'Uzbek (Latin)': 'uz',
      'Vietnamese': 'vi',
      'Welsh': 'cy',
      'Yucatec Maya': 'yua',
      'Zulu': 'zu'
    };
  }

  get_defaults() {
    return MessageStrategy.state.Translate.user_defaults;
  }

  sendSupported(message) {
    let msg = "```";
    let i = 1;
    Object.keys(Translate.self.supported).forEach(key => {
      let padding = " ".repeat(25 - key.length);
      msg += key + padding + " : " + Translate.self.supported[key] + "\n";
      msg += i % 5 == 0 ? "\n" : "";
      i += 1;
    });
    msg += "```";
    MessageStrategy.client.sendText(message.from, msg);
  }

  provides() {
    Translate.self = this;

    return {
      help: 'Does in chat translations',
      provides: {
        'translate default x': {
          test: function (message) {
            return message.body.toLowerCase().startsWith('translate default');
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name);
          },
          help: function () {
            return 'Sets the default translation for the user';
          },
          action: function SetDefault(message) {
            return Translate.self.SetDefault(message);
          },
          interactive: true,
          enabled: function () {
            return MessageStrategy.state['Translate']['enabled'];
          }
        },
        'translate off': {
          test: function (message) {
            return message.body.toLowerCase().startsWith('translate off');
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name);
          },
          help: function () {
            return 'Disable automatic translation';
          },
          action: function SetOff(message) {
            return Translate.self.SetOff(message);
          },
          interactive: true,
          enabled: function () {
            return MessageStrategy.state['Translate']['enabled'];
          }
        },
        'translate automatic': {
          test: function (message) {
            return Object.keys(MessageStrategy.state.Translate.user_defaults).includes(message.from);
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name);
          },
          help: function () {
            return 'Automatic translation';
          },
          action: function Automatic(message) {
            return Translate.self.Automatic(message);
          },
          interactive: false,
          enabled: function () {
            return MessageStrategy.state['Translate']['enabled'];
          }
        },
        'translate de x': {
          test: function (message) {
            return message.body.toLowerCase().startsWith('translate');
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name);
          },
          help: function () {
            return 'Manual translation';
          },
          action: function Manual(message) {
            return Translate.self.Manual(message);
          },
          interactive: true,
          enabled: function () {
            return MessageStrategy.state['Translate']['enabled'];
          }
        }
      },
      access: function (message, strategy) {
        return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name);
      },
      enabled: function () {
        return MessageStrategy.state['Translate']['enabled'];
      }
    }
  }

  SetDefault(message) {
    let parts = message.body.split(" ");
    if (parts.length == 3) {
      if (Object.values(this.supported).includes(parts[2]) == false) {
        Translate.self.sendSupported(message);
        return false;
      }
      MessageStrategy.state.Translate.user_defaults[message.from] = parts[2];
      return true;
    } else {
      MessageStrategy.client.sendText(message.from, "Failed to provide default language")
      return false;
    }
  }

  SetOff(message) {
    if (Object.keys(MessageStrategy.state.Translate.user_defaults).includes(message.from)) {
      delete MessageStrategy.state.Translate.user_defaults[message.from];
    }
    return true;
  }

  Automatic(message) {
    let target_lang = MessageStrategy.state.Translate.user_defaults[message.from];
    let source_lang = "en";
    translate(message.body, source_lang, target_lang, true, true).then(res => {
      MessageStrategy.typing(message);
      MessageStrategy.client.reply(message.from, res.translation, message.id, true);
    }).catch(err => {
      MessageStrategy.client.sendText(message.from, err);
      MessageStrategy.client.sendText(message.from, err);
    });
    return true;
  }

  Manual(message) {
    let parts = message.body.indexOf(" ") > -1 ? message.body.split(" ") : [message.body];
    if (parts.length < 3) {
      // translate provided without addittional arguments
      return false;
    }

    let target_lang = parts[1];
    let source_lang = "en";
    let start = "translate " + target_lang;
    let msg = message.body.substring(start.trim().length);

    if (target_lang.indexOf("/") > -1) {
      let langparts = target_lang.split("/");
      source_lang = langparts[0];
      target_lang = langparts[1];
    }

    if (Object.values(Translate.self.supported).includes(target_lang) == false) {
      Translate.self.sendSupported(message);
      return false;
    }

    translate(msg, source_lang, target_lang, true, true).then(res => {
      MessageStrategy.typing(message);
      MessageStrategy.client.reply(message.from, res.translation, message.id, true);
    }).catch(err => {
      MessageStrategy.client.sendText(message.from, err);
      MessageStrategy.client.sendText(message.from, err);
    });

    return true;
  }
}

module.exports = {
  MessageStrategy: Translate
}