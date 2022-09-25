Strategies = require("./strategies.js");

jest.mock('cron');
jest.mock('puppeteer');

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
  'sendImage': (to, message, image, text) => {},
  'sendLinkWithAutoPreview': (to, message) => {},
  'simulateTyping': (chatid) => {},
  'reply': (to, message) => {}
}

const sendTextMock = jest.spyOn(client, "sendText");
const sendImageMock = jest.spyOn(client, "sendImage");
const replyTextMock = jest.spyOn(client, "reply");
const simulateTypingMock = jest.spyOn(client, "simulateTyping");
const sendLinkWithAutoPreviewMock = jest.spyOn(client, "sendLinkWithAutoPreview");

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


describe('Test Hi strategy', () => {
  let mockTyping = jest.fn();
  let message = {};
  let strategies = null;

  beforeEach(() => {
    // assign the mock jest.fn() to static method
    Strategies.MessageStrategy.typing = mockTyping;
    strategies = Strategies.MessageStrategy.getStrategies(client);
    message = {};
  });

  it('Check Hi enabled', async () => {
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


describe('Test Spam strategy', () => {
    let mockTyping = jest.fn();
    let message = {};
    let strategies = null;
  
    beforeEach(() => {
      // assign the mock jest.fn() to static method
      Strategies.MessageStrategy.typing = mockTyping;
      strategies = Strategies.MessageStrategy.getStrategies(client);
      message = {};
      message['chatId'] = "1234567890@c.us";
      message['sender'] = {
        "id": "1234567890@c.us"
      };
    });
  
    it('Check Spam enabled', async () => {
      const Spam = strategies.Spam;
      expect(Spam.enabled).toBe(true);
    });
  
    it('Spam returns true', async () => {
      const Spam = strategies.Spam;
      message['body'] = "who";
      message['from'] = "3538619387876@c.us";
      //expect(Spam.handleMessage(message, strategies)).toBe(true);
    });
  
    it('Spam returns false', async () => {
      const Spam = strategies.Spam;
      message['body'] = "who";
      message['from'] = "3538619387876@c.us";
      expect(Spam.handleMessage(message, strategies)).toBe(false);
    });
});


describe('Test Help strategy', () => {
    let mockTyping = jest.fn();
    let message = {};
    let strategies = null;
  
    beforeEach(() => {
      // assign the mock jest.fn() to static method
      Strategies.MessageStrategy.typing = mockTyping;
      strategies = Strategies.MessageStrategy.getStrategies(client);
      message = {};
      message['body'] = "who";
      message['from'] = "3538619387876@c.us";
    });
  
    it('Check Help enabled', async () => {
      const Help = strategies.Help;
      expect(Help.enabled).toBe(true);
    });
  
    it('Help returns true', async () => {
      const Help = strategies.Help;
      //expect(Help.handleMessage(message, strategies)).toBe(true);
      //expect(mockTyping).toHaveBeenCalled();
    });
  
    it('Help returns false', async () => {
      const Help = strategies.Help;
      message['body'] = "not help";
      expect(Help.handleMessage(message, strategies)).toBe(false);
    });
});


describe('Test Harass strategy', () => {
    let mockTyping = jest.fn();
    let message = {};
    let strategies = null;
  
    beforeEach(() => {
      // assign the mock jest.fn() to static method
      Strategies.MessageStrategy.typing = mockTyping;
      strategies = Strategies.MessageStrategy.getStrategies(client);
      message = {};
      message['body'] = "who";
      message['from'] = "3538619387876@c.us";
    });
  
    it('Check Harass enabled', async () => {
      const Harass = strategies.Harass;
      expect(Harass.enabled).toBe(true);
    });
  
    it('Harass returns true', async () => {
      const Harass = strategies.Harass;
      //expect(Harass.handleMessage(message, strategies)).toBe(true);
      //expect(mockTyping).toHaveBeenCalled();
    });
  
    it('Harass returns false', async () => {
      const Harass = strategies.Harass;
      message['body'] = "not harass";
      expect(Harass.handleMessage(message, strategies)).toBe(false);
    });
});


describe('Test ChuckJokes strategy', () => {
    let mockTyping = jest.fn();
    let message = {};
    let strategies = null;
  
    beforeEach(() => {
      // assign the mock jest.fn() to static method
      Strategies.MessageStrategy.typing = mockTyping;
      strategies = Strategies.MessageStrategy.getStrategies(client);
      message = {};
      message['body'] = "who";
      message['from'] = "3538619387876@c.us";
    });
  
    it('Check ChuckJokes enabled', async () => {
      const ChuckJokes = strategies.ChuckJokes;
      expect(ChuckJokes.enabled).toBe(true);
    });
  
    it('ChuckJokes returns true', async () => {
      const ChuckJokes = strategies.ChuckJokes;
      //expect(ChuckJokes.handleMessage(message, strategies)).toBe(true);
      //expect(mockTyping).toHaveBeenCalled();
    });
  
    it('ChuckJokes returns false', async () => {
      const ChuckJokes = strategies.ChuckJokes;
      message['body'] = "not lul";
      expect(ChuckJokes.handleMessage(message, strategies)).toBe(false);
    });
});


describe('Test Asthanga strategy', () => {
    let mockTyping = jest.fn();
    let message = {};
    let strategies = null;
  
    beforeEach(() => {
      // assign the mock jest.fn() to static method
      Strategies.MessageStrategy.typing = mockTyping;
      strategies = Strategies.MessageStrategy.getStrategies(client);
      message = {};
      message['body'] = "who";
      message['from'] = "3538619387876@c.us";
    });
  
    it('Check Asthanga enabled', async () => {
      const Asthanga = strategies.Asthanga;
      expect(Asthanga.enabled).toBe(true);
    });
  
    it('Asthanga returns true', async () => {
      const Asthanga = strategies.Asthanga;
      message['body'] = "navasana";
      message['from'] = "3538619387876@c.us";
      expect(Asthanga.handleMessage(message, strategies)).toBe(true);
      expect(mockTyping).toHaveBeenCalled();
    });
  
    it('Asthanga returns false', async () => {
      const Asthanga = strategies.Asthanga;
      message['body'] = "not poses";
      expect(Asthanga.handleMessage(message, strategies)).toBe(false);
    });
});


describe('Test Youtube strategy', () => {
    let mockTyping = jest.fn();
    let message = {};
    let strategies = null;
  
    beforeEach(() => {
      // assign the mock jest.fn() to static method
      Strategies.MessageStrategy.typing = mockTyping;
      strategies = Strategies.MessageStrategy.getStrategies(client);
      message = {};
    });
  
    it('Check Youtube enabled', async () => {
      const Youtube = strategies.Youtube;
      expect(Youtube.enabled).toBe(true);
    });
  
    it('Youtube search returns true', async () => {
      const Youtube = strategies.Youtube;
      message['body'] = "youtube hot wings";
      message['from'] = "3538619387876@c.us";
      expect(Youtube.handleMessage(message, strategies)).toBe(true);
      // expect(mockTyping).toHaveBeenCalled();
    });
  
    it('Youtube returns false', async () => {
      const Youtube = strategies.Youtube;
      message['body'] = "not youtube xrp";
      expect(Youtube.handleMessage(message, strategies)).toBe(false);
    });
});


describe('Test TikTok strategy', () => {
    let mockTyping = jest.fn();
    let message = {};
    let strategies = null;
  
    beforeEach(() => {
      // assign the mock jest.fn() to static method
      Strategies.MessageStrategy.typing = mockTyping;
      strategies = Strategies.MessageStrategy.getStrategies(client);
      message = {};
    });
  
    it('Check TikTok enabled', async () => {
      const TikTok = strategies.TikTok;
      expect(TikTok.enabled).toBe(true);
    });
  
    it('TikTok returns true', async () => {
      const TikTok = strategies.TikTok;
      message['body'] = "https://vm.tiktok.com/ddwssa32s";
      message['from'] = "3538619387876@c.us";
      postTiktokPreviewMock = jest.spyOn(TikTok, "postTiktokPreview");
      expect(TikTok.handleMessage(message, strategies)).toBe(true);
      // expect(mockTyping).toHaveBeenCalled();
    });
  
    it('TikTok returns false', async () => {
      const TikTok = strategies.TikTok;
      message['body'] = "not http://vm.tiktok.com/";
      expect(TikTok.handleMessage(message, strategies)).toBe(false);
    });
});


describe('Test Twitter strategy', () => {
    let mockTyping = jest.fn();
    let message = {};
    let strategies = null;
  
    beforeEach(() => {
      // assign the mock jest.fn() to static method
      Strategies.MessageStrategy.typing = mockTyping;
      strategies = Strategies.MessageStrategy.getStrategies(client);
      message = {};
    });
  
    it('Check Twitter enabled', async () => {
      const Twitter = strategies.Twitter;
      expect(Twitter.enabled).toBe(true);
    });
  
    it('Twitter returns true', async () => {
      const Twitter = strategies.Twitter;
      message['body'] = "https://twitter.com/ddwssa32s";
      message['from'] = "3538619387876@c.us";
      postTwitterPreviewMock = jest.spyOn(Twitter, "postTwitterPreview");
      expect(Twitter.handleMessage(message, strategies)).toBe(true);
      // expect(mockTyping).toHaveBeenCalled();
    });
  
    it('Twitter returns false', async () => {
      const Twitter = strategies.Twitter;
      message['body'] = "not http://twitter.com/";
      expect(Twitter.handleMessage(message, strategies)).toBe(false);
    });
});


describe('Test Facebook strategy', () => {
    let mockTyping = jest.fn();
    let message = {};
    let strategies = null;
  
    beforeEach(() => {
      // assign the mock jest.fn() to static method
      Strategies.MessageStrategy.typing = mockTyping;
      strategies = Strategies.MessageStrategy.getStrategies(client);
      message = {};
    });
  
    it('Check Facebook enabled', async () => {
      const Facebook = strategies.Facebook;
      expect(Facebook.enabled).toBe(true);
    });
  
    it('Facebook returns true', async () => {
      const Facebook = strategies.Facebook;
      message['body'] = "https://www.facebook.com/ggggg";
      message['from'] = "3538619387876@c.us";
      postFacebookPreviewMock = jest.spyOn(Facebook, "postFacebookPreview");      
      expect(Facebook.handleMessage(message, strategies)).toBe(true);
      //expect(mockTyping).toHaveBeenCalled();
    });
  
    it('Facebook returns false', async () => {
      const Facebook = strategies.Facebook;
      message['body'] = "not facebook";
      expect(Facebook.handleMessage(message, strategies)).toBe(false);
    });
});


describe('Test HyperLink strategy', () => {
    let mockTyping = jest.fn();
    let message = {};
    let strategies = null;
  
    beforeEach(() => {
      // assign the mock jest.fn() to static method
      Strategies.MessageStrategy.typing = mockTyping;
      strategies = Strategies.MessageStrategy.getStrategies(client);
      message = {};
    });
  
    it('Check HyperLink enabled', async () => {
      const HyperLink = strategies.HyperLink;
      expect(HyperLink.enabled).toBe(true);
    });
  
    it('HyperLink returns true', async () => {
      const HyperLink = strategies.HyperLink;
      message['body'] = "https://www.google.com/test";
      message['from'] = "3538619387876@c.us";
      message['thumbnail'] = "";
      expect(HyperLink.handleMessage(message, strategies)).toBe(true);
      // expect(mockTyping).toHaveBeenCalled();
    });
  
    it('HyperLink returns false', async () => {
      const HyperLink = strategies.HyperLink;
      message['body'] = "not http://google.com";
      expect(HyperLink.handleMessage(message, strategies)).toBe(false);
    });
});


describe('Test Currency strategy', () => {
    let mockTyping = jest.fn();
    let message = {};
    let strategies = null;
  
    beforeEach(() => {
      // assign the mock jest.fn() to static method
      Strategies.MessageStrategy.typing = mockTyping;
      strategies = Strategies.MessageStrategy.getStrategies(client);
      message = {};
    });
  
    it('Check Currency enabled', async () => {
      const Currency = strategies.Currency;
      expect(Currency.enabled).toBe(true);
    });
  
    it('Currency returns true', async () => {
      const Currency = strategies.Currency;
      //expect(Currency.handleMessage(message, strategies)).toBe(true);
      //expect(mockTyping).toHaveBeenCalled();
    });
  
    it('Currency returns false', async () => {
      const Currency = strategies.Currency;
      message['body'] = "not fiat";
      expect(Currency.handleMessage(message, strategies)).toBe(false);
    });
});


describe('Test Crypto strategy', () => {
    let mockTyping = jest.fn();
    let message = {};
    let strategies = null;
  
    beforeEach(() => {
      // assign the mock jest.fn() to static method
      Strategies.MessageStrategy.typing = mockTyping;
      strategies = Strategies.MessageStrategy.getStrategies(client);
      message = {};
    });
  
    it('Check Crypto enabled', async () => {
      const Crypto = strategies.Crypto;
      expect(Crypto.enabled).toBe(true);
    });
  
    it('Crypto list', async () => {
      const Crypto = strategies.Crypto;
      message['body'] = "coin";
      message['from'] = "3538619387876@c.us";
      expect(Crypto.handleMessage(message, strategies)).toBe(true);
      expect(mockTyping).toHaveBeenCalled();
    });

    it('Crypto get coin', async () => {
      const Crypto = strategies.Crypto;
      message['body'] = "coin xrp";
      message['from'] = "3538619387876@c.us";
      expect(Crypto.handleMessage(message, strategies)).toBe(true);
      expect(mockTyping).toHaveBeenCalled();
    });
  
    it('Crypto returns false', async () => {
      const Crypto = strategies.Crypto;
      message['body'] = "not coin";
      expect(Crypto.handleMessage(message, strategies)).toBe(false);
    });
});


describe('Test Imdb strategy', () => {
    let mockTyping = jest.fn();
    let message = {};
    let strategies = null;
  
    beforeEach(() => {
      // assign the mock jest.fn() to static method
      Strategies.MessageStrategy.typing = mockTyping;
      strategies = Strategies.MessageStrategy.getStrategies(client);
      message = {};
    });
  
    it('Check Imdb enabled', async () => {
      const Imdb = strategies.Imdb;
      expect(Imdb.enabled).toBe(true);
    });
  
    it('Imdb returns true', async () => {
      const Imdb = strategies.Imdb;
      message['body'] = "imdb bad boys";
      message['from'] = "3538619387876@c.us";
      expect(Imdb.handleMessage(message, strategies)).toBe(true);
      // expect(mockTyping).toHaveBeenCalled();
    });
  
    it('Imdb returns false', async () => {
      const Imdb = strategies.Imdb;
      message['body'] = "not imdb bad boys";
      expect(Imdb.handleMessage(message, strategies)).toBe(false);
    });
});


describe('Test Google strategy', () => {
    let mockTyping = jest.fn();
    let message = {};
    let strategies = null;
  
    beforeEach(() => {
      // assign the mock jest.fn() to static method
      Strategies.MessageStrategy.typing = mockTyping;
      strategies = Strategies.MessageStrategy.getStrategies(client);
      message = {};
    });
  
    it('Check Google enabled', async () => {
      const Google = strategies.Google;
      expect(Google.enabled).toBe(true);
    });
  
    it('Google returns true', async () => {
      const Google = strategies.Google;
      message['body'] = "google ttt";
      message['from'] = "3538619387876@c.us";
      expect(Google.handleMessage(message, strategies)).toBe(true);
    });
  
    it('Google returns false', async () => {
      const Google = strategies.Google;
      message['body'] = "not google cork";
      expect(Google.handleMessage(message, strategies)).toBe(false);
    });
});


describe('Test Wikipedia strategy', () => {
    let mockTyping = jest.fn();
    let message = {};
    let strategies = null;
  
    beforeEach(() => {
      // assign the mock jest.fn() to static method
      Strategies.MessageStrategy.typing = mockTyping;
      strategies = Strategies.MessageStrategy.getStrategies(client);
      message = {};
    });
  
    it('Check Wikipedia enabled', async () => {
      const Wikipedia = strategies.Wikipedia;
      expect(Wikipedia.enabled).toBe(true);
    });
  
    it('Wikipedia returns true', async () => {
      const Wikipedia = strategies.Wikipedia;
      message['body'] = "wiki ff";
      message['from'] = "3538619387876@c.us";
      expect(Wikipedia.handleMessage(message, strategies)).toBe(true);
    });
  
    it('Wikipedia returns false', async () => {
      const Wikipedia = strategies.Wikipedia;
      message['body'] = "not wikipedia cork";
      expect(Wikipedia.handleMessage(message, strategies)).toBe(false);
    });
});


describe('Test Weather strategy', () => {
    let mockTyping = jest.fn();
    let message = {};
    let strategies = null;
  
    beforeEach(() => {
      // assign the mock jest.fn() to static method
      Strategies.MessageStrategy.typing = mockTyping;
      strategies = Strategies.MessageStrategy.getStrategies(client);
      message = {};
      message['body'] = "who";
      message['from'] = "3538619387876@c.us";
    });
  
    it('Check Weather enabled', async () => {
      const Weather = strategies.Weather;
      expect(Weather.enabled).toBe(true);
    });
  
    it('Weather returns true', async () => {
      const Weather = strategies.Weather;
      message['body'] = "weather cork";
      message['from'] = "3538619387876@c.us";
      expect(Weather.handleMessage(message, strategies)).toBe(true);
      // expect(mockTyping).toHaveBeenCalled();
    });
  
    it('Weather returns false', async () => {
      const Weather = strategies.Weather;
      message['body'] = "not weather cork";
      expect(Weather.handleMessage(message, strategies)).toBe(false);
    });
});


describe('Test Levenshteiner strategy', () => {
    let mockTyping = jest.fn();
    let message = {};
    let strategies = null;
  
    beforeEach(() => {
      // assign the mock jest.fn() to static method
      Strategies.MessageStrategy.typing = mockTyping;
      strategies = Strategies.MessageStrategy.getStrategies(client);
      message = {};
    });
  
    it('Check Levenshteiner enabled', async () => {
      const Levenshteiner = strategies.Levenshteiner;
      expect(Levenshteiner.enabled).toBe(true);
    });
  
    it('Levenshteiner returns true', async () => {
      const Levenshteiner = strategies.Levenshteiner;
      message['body'] = "levenshtein gg ttt";
      message['from'] = "3538619387876@c.us";
      expect(Levenshteiner.handleMessage(message, strategies)).toBe(true);
      expect(mockTyping).toHaveBeenCalled();
    });
  
    it('Levenshteiner returns false', async () => {
      const Levenshteiner = strategies.Levenshteiner;
      message['body'] = "not levenshtein gg ttt";
      expect(Levenshteiner.handleMessage(message, strategies)).toBe(false);
    });
});


describe('Test UrbanDictionary strategy', () => {
    let mockTyping = jest.fn();
    let message = {};
    let strategies = null;
  
    beforeEach(() => {
      // assign the mock jest.fn() to static method
      Strategies.MessageStrategy.typing = mockTyping;
      strategies = Strategies.MessageStrategy.getStrategies(client);
      message = {};
    });
  
    it('Check UrbanDictionary enabled', async () => {
      const UrbanDictionary = strategies.UrbanDictionary;
      expect(UrbanDictionary.enabled).toBe(true);
    });
  
    it('UrbanDictionary returns true', async () => {
      const UrbanDictionary = strategies.UrbanDictionary;
      message['body'] = "urban";
      message['from'] = "3538619387876@c.us";
      postUrbanQuoteMock = jest.spyOn(UrbanDictionary, "postUrbanQuote"); 
      expect(UrbanDictionary.handleMessage(message, strategies)).toBe(true);
    });
  
    it('UrbanDictionary returns false', async () => {
      const UrbanDictionary = strategies.UrbanDictionary;
      message['body'] = "not urban tosser";
      message['from'] = "3538619387876@c.us";
      expect(UrbanDictionary.handleMessage(message, strategies)).toBe(false);
    });
});


describe('Test Translate strategy', () => {
    let mockTyping = jest.fn();
    let message = {};
    let strategies = null;
  
    beforeEach(() => {
      // assign the mock jest.fn() to static method
      Strategies.MessageStrategy.typing = mockTyping;
      strategies = Strategies.MessageStrategy.getStrategies(client);
      message = {};
      message['body'] = "who";
      message['from'] = "3538619387876@c.us";
    });
  
    it('Check Translate enabled', async () => {
      const Translate = strategies.Translate;
      expect(Translate.enabled).toBe(true);
    });
  
    it('Translate returns false', async () => {
      const Translate = strategies.Translate;
      message['body'] = "translate";
      expect(Translate.handleMessage(message, strategies)).toBe(false);
    });
  
    it('Translate returns false', async () => {
      const Translate = strategies.Translate;
      expect(Translate.handleMessage(message, strategies)).toBe(false);
    });

    it('Translate set default language empty', async () => {
        const Translate = strategies.Translate;
        message['body'] = "translate default";
        expect(Translate.handleMessage(message, strategies)).toBe(false);
    });

    it('Translate set default language not empty', async () => {
        const Translate = strategies.Translate;
        message['body'] = "translate default de";
        expect(Translate.handleMessage(message, strategies)).toBe(true);
        expect(Object.keys(Translate.get_defaults()).includes("3538619387876@c.us")).toBe(true);
        expect(Translate.get_defaults()["3538619387876@c.us"] == "de").toBe(true);
    });

    it('Translate set default language off', async () => {
        const Translate = strategies.Translate;
        message['body'] = "translate off";
        expect(Translate.handleMessage(message, strategies)).toBe(true);
        expect(Object.keys(Translate.get_defaults()).includes("3538619387876@c.us")).toBe(false);
    });

    it('Translate from en to pt', async () => {
        const Translate = strategies.Translate;
        message['body'] = "translate en/pt this is a test";
        expect(Translate.handleMessage(message, strategies)).toBe(true);
    });

    it('Translate from en to fdfdsfsdf', async () => {
        const Translate = strategies.Translate;
        message['body'] = "translate en/fdfdsfsdf this is a test";
        expect(Translate.handleMessage(message, strategies)).toBe(false);
    });
});

