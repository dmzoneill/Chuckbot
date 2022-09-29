const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// Translate
// ####################################

class Translate extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);

  constructor() {
    super();

    MessageStrategy.state['Translate'] = {
      'enabled': true,
      'user_defaults': {}
    }

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

  describe(message, strategies) {
    this.message = message;
    MessageStrategy.typing(this.message);
    let description = "Provides translations"
    MessageStrategy.client.sendText(this.message.from, description);
  }

  provides() {
    return ['translate en/pt', 'translate default en/pt', 'translate off']
  }

  sendSupported(self) {
    let msg = "```";
    let i = 1;
    Object.keys(self.supported).forEach(key => {
      let padding = " ".repeat(25 - key.length);
      msg += key + padding + " : " + self.supported[key] + "\n";
      msg += i % 5 == 0 ? "\n" : "";
      i += 1;
    });
    msg += "```";
    self.client.sendText(self.message.from, msg);
  }

  handleMessage(message) {
    if (MessageStrategy.state['Translate']['enabled'] == false) return;

    this.message = message;
    var self = this;

    if (this.message.body.toLowerCase().startsWith('translate default')) {
      let parts = this.message.body.split(" ");
      if (parts.length == 3) {
        if (Object.values(this.supported).includes(parts[2]) == false) {
          this.sendSupported(self);
          return false;
        }
        MessageStrategy.state.Translate.user_defaults[this.message.from] = parts[2];
        return true;
      } else {
        self.client.sendText(self.message.from, "Failed to provide default language")
        return false;
      }
    }

    if (this.message.body.toLowerCase().startsWith('translate off')) {
      if (Object.keys(MessageStrategy.state.Translate.user_defaults).includes(this.message.from)) {
        delete MessageStrategy.state.Translate.user_defaults[this.message.from];
      }
      return true;
    }

    if (Object.keys(MessageStrategy.state.Translate.user_defaults).includes(this.message.from)) {
      let target_lang = MessageStrategy.state.Translate.user_defaults[this.message.from];
      let source_lang = "en";
      translate(this.message.body, source_lang, target_lang, true, true).then(res => {
        MessageStrategy.typing(self.message);
        self.client.reply(self.message.from, res.translation, self.message.id, true);
      }).catch(err => {
        self.client.sendText(self.message.from, err);
        self.client.sendText(self.message.from, err);
      });
      return true;
    }

    if (this.message.body.toLowerCase().startsWith('translate')) {
      let parts = this.message.body.indexOf(" ") > -1 ? this.message.body.split(" ") : [this.message.body];
      if (parts.length < 3) {
        // translate provided without addittional arguments
        return false;
      }

      let target_lang = parts[1];
      let source_lang = "en";
      let start = "translate " + target_lang;
      let msg = this.message.body.substring(start.trim().length);

      if (target_lang.indexOf("/") > -1) {
        let langparts = target_lang.split("/");
        source_lang = langparts[0];
        target_lang = langparts[1];
      }

      if (Object.values(this.supported).includes(target_lang) == false) {
        this.sendSupported(self);
        return false;
      }

      translate(msg, source_lang, target_lang, true, true).then(res => {
        MessageStrategy.typing(self.message);
        self.client.reply(self.message.from, res.translation, self.message.id, true);
      }).catch(err => {
        self.client.sendText(self.message.from, err);
        self.client.sendText(self.message.from, err);
      });

      return true;
    }
    return false;
  }
}

module.exports = {
  MessageStrategy: Translate
}