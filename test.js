Strategies = require("./strategies.js");

jest.mock('cron');

let msg = {
  "from": "",
  "body": "",
  "thumbnail": "",
  "id": false, 
  "sender": {
    "id": false
  }
}

let client = {
  'sendText': (to, message) => {},
  'simulateTyping': (chatid) => {}
}

const sendTextMock = jest.spyOn(client, "sendText");
const simulateTypingMock = jest.spyOn(client, "simulateTyping");

describe('Test strategies', () => {
  let message = {};

  beforeEach(() => {
    message = {};
    message['chatId'] = "1234567890@c.us";
    message['sender'] = {
      "id": "1234567890@c.us"
    }
  });

  it('should return a list of strategies', async () => {
    const result = Strategies.MessageStrategy.getStrategies(client);
    expect(Object.keys(result).length).toBeGreaterThan(0);
  });

  it('check hi strategy in stategies', async () => {
    const result = Strategies.MessageStrategy.getStrategies(client);
    expect(Object.keys(result).includes('Hi')).toBe(true);
  });

  it('check all strategies enabled', async () => {
    const strategies = Strategies.MessageStrategy.getStrategies(client);
    Object.keys(strategies).forEach(element => {
      expect(strategies[element].enabled).toBe(true);
    });
  });

  it('check all strategies have provides', async () => {
    const strategies = Strategies.MessageStrategy.getStrategies(client);
    Object.keys(strategies).forEach(element => {
      expect(Array.isArray(strategies[element].provides())).toBe(true);
    });
  });

  it('check all strategies handles message', async () => {
    const strategies = Strategies.MessageStrategy.getStrategies(client);
    Object.keys(strategies).forEach(element => {
      message['body'] = "£££total nonsense***";
      message['from'] = "3538619387876@c.us";
      expect(strategies[element].handleMessage(message, strategies)).toBe(false);
    });
  });
});


describe('Test hi strategy', () => {
  let mockTyping = jest.fn();
  let message = {};
  let strategies = null;

  beforeEach(() => {
    // assign the mock jest.fn() to static method
    Strategies.MessageStrategy.typing = mockTyping;
    strategies = Strategies.MessageStrategy.getStrategies(client);
    message = {};
  });

  it('Check hi enabled', async () => {
    const hi = strategies.Hi;
    expect(hi.enabled).toBe(true);
  });

  it('Hi returns true', async () => {
    message['body'] = "hi";
    message['from'] = "3538619387876@c.us";
    const hi = strategies.Hi;
    expect(hi.handleMessage(message, strategies)).toBe(true);
    expect(mockTyping).toHaveBeenCalled();
  });

  it('Hi returns false', async () => {
    message['body'] = "who";
    message['from'] = "3538619387876@c.us";
    const hi = strategies.Hi;
    expect(hi.handleMessage(message, strategies)).toBe(false);
  });
});