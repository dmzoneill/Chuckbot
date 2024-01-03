const MessageStrategy = require('../MessageStrategy.js')

// ####################################
// GPT4All
// ####################################

class GPT4All extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name)
  static self = null
  static api = null

  constructor() {
    super('GPT4All', {
      enabled: true
    })
  }

  provides() {
    GPT4All.self = this

    return {
      help: 'Provides a basic example of a strategy',
      provides: {
        "GPT4All": {
          test: function (message) {
            return message.body.toLowerCase() === 'gpt4all'
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Just a simple test function the returns hello when you say hi'
          },
          action: GPT4All.self.Hello,
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.GPT4All.enabled
          }
        }
      },
      access: function (message, strategy) {
        return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name)
      },
      enabled: function () {
        return MessageStrategy.state.GPT4All.enabled
      }
    }
  }

  async setup() {
    const { GPT4All } = await import('gpt4all')
    GPT4All.api = new GPT4All('gpt4all-lora-unfiltered-quantized', true);
    await GPT4All.api.init();
    await GPT4All.api.open();
  }

  async Hello(message) {
    console.log("--------------------------------");
    await GPT4All.self.setup()

    // Generate a response using a prompt
    const prompt = 'Tell me about how Open Access to AI is going to help humanity.';
    const response = await GPT4All.api.prompt(prompt);
    console.log(`Prompt: ${prompt}`);
    console.log(`Response: ${response}`);

    const prompt2 = 'Explain to a five year old why AI is nothing to be afraid of.';
    const response2 = await GPT4All.api.prompt(prompt2);
    console.log(`Prompt: ${prompt2}`);
    console.log(`Response: ${response2}`);

    return true
  }
}

module.exports = {
  MessageStrategy: GPT4All
}
