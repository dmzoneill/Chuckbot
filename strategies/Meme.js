const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// Meme
// ####################################

class Meme extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);
  static self = null;
  static memes_setup = false;
  static timers = {};


  constructor() {
    super('Meme', {
      'enabled': true
    });
  }

  provides(message) {
    Meme.self = this;
    
    if (Meme.memes_setup == false) {
      Object.keys(Meme.timers).forEach(key => clearInterval(Meme.timers[key]));
      let setup = Meme.self.setup(message);
      if(setup == false) {
        return {};
      }
      Meme.self.setup_tickers();
      Meme.memes_setup = true;
    }

    return {
      help: 'Gets a random meme',
      provides: {
        'meme update chat': {
          test: function (message) {
            return true;
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name);
          },
          help: function () {
            return 'gets the meme and posts it to the chat';
          },
          action: function GetMeme(message) {
            Meme.self.setup(message);
            Meme.self.update_counter(message);
          },
          interactive: false,
          enabled: function () {
            return MessageStrategy.state['Meme']['enabled'];
          }
        },
        'meme': {
          test: function (message) {
            return message.body.toLowerCase() === 'meme';
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name);
          },
          help: function () {
            return 'gets the meme and posts it to the chat';
          },
          action: function GetMeme(message) {
            Meme.self.setup(message);
            Meme.self.get_meme(message);
          },
          interactive: true,
          enabled: function () {
            return MessageStrategy.state['Meme']['enabled'];
          }
        },
        'meme enable': {
          test: function (message) {
            return message.body.toLowerCase() === 'meme enable';
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name);
          },
          help: function () {
            return 'enables automatic memes in the chat';
          },
          action: function Enable(message) {
            Meme.self.setup(message);
            Meme.self.toggle(message, true);
          },
          interactive: true,
          enabled: function () {
            return MessageStrategy.state['Meme']['enabled'];
          }
        },
        'meme disable': {
          test: function (message) {
            return message.body.toLowerCase() === 'meme disable';
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name);
          },
          help: function () {
            return 'disables automatic memes in the chat';
          },
          action: function Disable(message) {
            Meme.self.setup(message);
            Meme.self.disable(message, true);
          },
          interactive: true,
          enabled: function () {
            return MessageStrategy.state['Meme']['enabled'];
          }
        },
        'meme freq': {
          test: function (message) {
            return message.body.toLowerCase().match(new RegExp(/meme freq \d+ \d+/));
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name);
          },
          help: function () {
            return 'sets the frequency of the memes';
          },
          action: function Frequency(message) {
            Meme.self.setup(message);
            Meme.self.frequency(message);
          },
          interactive: true,
          enabled: function () {
            return MessageStrategy.state['Meme']['enabled'];
          }
        },
        'meme spam': {
          test: function (message) {
            return message.body.toLowerCase().match(new RegExp(/meme spam \d+/));
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name);
          },
          help: function () {
            return 'sets the spam protection level of memes';
          },
          action: function Spam(message) {
            Meme.self.setup(message);
            Meme.self.spam(message);
          },
          interactive: true,
          enabled: function () {
            return MessageStrategy.state['Meme']['enabled'];
          }
        }
      },
      access: function (message, strategy) {
        return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name);
      },
      enabled: function () {
        return MessageStrategy.state['Meme']['enabled'];
      }
    }
  }

  setup(message) {
    let min = 30 * 60 * 1000;
    let max = 60 * 60 * 1000;
    let spam = 10;

    if(message==null) {
      return false;
    }

    if(Object.keys(message).indexOf('chatId') == -1) {
      return false;
    }

    if (Object.keys(MessageStrategy.state['Meme']).indexOf('chats') == -1) {
      MessageStrategy.state['Meme']['chats'] = {};
    }

    if (Object.keys(MessageStrategy.state['Meme']['chats']).indexOf(message.chatId) == -1) {
      MessageStrategy.state['Meme']['chats'][message.chatId] = {};
    }

    if (Object.keys(MessageStrategy.state['Meme']['chats'][message.chatId]).indexOf('enabled') == -1) {
      MessageStrategy.state['Meme']['chats'][message.chatId]['enabled'] = false;
    }

    if (Object.keys(MessageStrategy.state['Meme']['chats'][message.chatId]).indexOf('from') == -1) {
      MessageStrategy.state['Meme']['chats'][message.chatId]['from'] = message.from;
    }

    if (Object.keys(MessageStrategy.state['Meme']['chats'][message.chatId]).indexOf('min') == -1) {
      MessageStrategy.state['Meme']['chats'][message.chatId]['min'] = min;
    }

    if (Object.keys(MessageStrategy.state['Meme']['chats'][message.chatId]).indexOf('max') == -1) {
      MessageStrategy.state['Meme']['chats'][message.chatId]['max'] = max;
    }

    if (Object.keys(MessageStrategy.state['Meme']['chats'][message.chatId]).indexOf('spam') == -1) {
      MessageStrategy.state['Meme']['chats'][message.chatId]['spam'] = spam;
    }

    if (Object.keys(MessageStrategy.state['Meme']['chats'][message.chatId]).indexOf('counter') == -1) {
      MessageStrategy.state['Meme']['chats'][message.chatId]['counter'] = 0;
    }

    return true;
  }

  setup_tickers() {
    Meme.timers = {}
    Object.keys(MessageStrategy.state['Meme']['chats']).forEach(chatid => {
      if (MessageStrategy.state['Meme']['chats'][chatid]['enabled'] == true) {
        Meme.self.setup_ticker(chatid);
      }
    });
  }

  async setup_ticker(chatid) {
    if (Object.keys(Meme.timers).indexOf(chatid) > -1) {
      clearTimeout(Meme.timers[chatid]);
      delete Meme.timers[chatid];
    }
    let min = MessageStrategy.state['Meme']['chats'][chatid]['min'];
    let max = MessageStrategy.state['Meme']['chats'][chatid]['max'];
    let rand = Math.floor(Math.random() * (max - min + 1)) + min;
    let timer = setInterval(Meme.self.scheduled_meme, rand, chatid);
    Meme.timers[chatid] = timer;
  }

  async enable(message, update) {
    MessageStrategy.state['Meme']['chats'][message.chatId]['enabled'] = true;
    await Meme.self.setup_ticker(message.chatId);
    if (update) {
      MessageStrategy.client.sendText(message.from, "Enabled");
    }
  }

  async disable(message, update) {
    MessageStrategy.state['Meme']['chats'][message.chatId]['enabled'] = false;
    if (Object.keys(Meme.timers).indexOf(message.chatId) > -1) {
      clearTimeout(Meme.timers[message.chatId]);
      if (update) {
        MessageStrategy.client.sendText(message.from, "Disabled");
      }
    }
  }

  async toggle(message, update) {
    await Meme.self.disable(message, false);
    await Meme.self.waitFor(250);
    if (update) {
      await Meme.self.enable(message, update);
    }
  }

  async frequency(message) {
    let parts = message.body.split(" ");
    MessageStrategy.state['Meme']['chats'][message.chatId]['min'] = parseInt(parts[2]) * 60 * 1000;
    MessageStrategy.state['Meme']['chats'][message.chatId]['max'] = parseInt(parts[3]) * 60 * 1000;
    MessageStrategy.client.sendText(message.from, "Frequency updated");
    await this.toggle(message, false);
  }

  async spam(message) {
    let parts = message.body.split(" ");
    let spam = parseInt(parts[2]);
    MessageStrategy.state['Meme']['chats'][message.chatId]['spam'] = spam;
    MessageStrategy.client.sendText(message.from, "Spam updated");
    await this.toggle(message, false);
  }

  async update_counter(message) {
    MessageStrategy.state['Meme']['chats'][message.chatId]['counter'] += 1;
  }

  async scheduled_meme(chatid) {
    let spam_level = MessageStrategy.state['Meme']['chats'][chatid]['spam'];
    let breaker = spam_level - MessageStrategy.state['Meme']['chats'][chatid]['counter'];

    if (breaker <= 0) {
      Meme.self.get_meme({
        'from': MessageStrategy.state['Meme']['chats'][chatid]['from'],
        'chatId': chatid
      });
      MessageStrategy.state['Meme']['chats'][chatid]['counter'] = 0;
    }
  }

  async get_meme(message) {

    let topics = [
      'me_irl',
      'WackyTicTacs',
      'memes',
      'AdviceAnimals',
      'funny',
      'ContagiousLaughter',
      'dadjokes',
      'sarcasm',
      'humour',
      'funny',
      'ProgrammerHumor',
      'Jokes'
    ];

    while (true) {
      try {
        MessageStrategy.typing(message);
        let randomIndex = Math.floor(Math.random() * topics.length);
        let meme = request('GET', 'https://meme-api.herokuapp.com/gimme/' + topics[randomIndex], {
          headers: MessageStrategy.browser_config['headers']
        });
        let json = JSON.parse(meme.getBody());
        MessageStrategy.typing(message);
        let image = await MessageStrategy.get_image(json['url']);
        await MessageStrategy.client.sendImage(message.from, image, "meme.jpg", json['postLink']);
        return true;
      }
      catch (err) {
        console.log(err);
      }
    }
  }
}


module.exports = {
  MessageStrategy: Meme
}