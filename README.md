# Chuckbot

Hardest shit since sliced pan

![alt text](https://github.com/dmzoneill/Chuckbot/blob/main/logo.png?raw=true)![alt text](https://github.com/dmzoneill/Chuckbot/blob/main/chat.png?raw=true)

### Get setup
```
make up
make local
```

Using the phone number you supplied to the setup.

Invite the number for a whatsapp group, or chat him directly.

basic commands are:

```

Spam
| - help spam

State
| - help state
| - state show
| - state save  
| - state load

TikTok
| - help tiktok

Translate
| - help translate  
| - translate default x  
| - translate off  
| - translate de x

Twitter
| - help twitter

UrbanDictionary  
| - help urbandictionary  
| - urban

Ashtanga  
| - help ashtanga  
| - yoga start  
| - yoga stop  
| - yoga list  
| - yoga poses

ChuckJokes  
| - help chuckjokes  
| - chuck stfu  
| - chuck

Crypto  
| - help crypto  
| - coin  
| - coin 0-9  
| - coin name  
| - coin name duration

Currency  
| - help currency  
| - currency

Deluge  
| - help deluge

Facebook  
| - help facebook

Imdb  
| - help imdb  
| - imdb x

Jackett  
| - help jackett

Levenshteiner  
| - help levenshteiner  
| - levenshtein x y

Logger  
| - help logger  
| - logger list mine  
| - logger list

Meme  
| - help meme  
| - meme

PhilipsHue  
| - help philipshue  
| - hue x 

Pornhub  
| - help pornhub  
| - pornhub x

PulseAudio  
| - help pulseaudio  
| - volume x

Radarr  
| - help radarr

Rbac  
| - help rbac  
| - role list  
| - role add x y  
| - role remove x y

Reddit  
| - help reddit

Sonarr  
| - help sonarr

Feature  
| - help feature  
| - feature list  
| - feature enable x  
| - feature disable x

Google  
| - help google  
| - google x

Harass  
| - help harass  
| - harass  
| - harass x  
| - harass stop x  
| - harass list

Help  
| - help help  
| - help  
| - help x

Hi  
| - help hi  
| - Hi

HyperLink  
| - help hyperlink

AYCBooking  
| - help aycbooking

AYCComms  
| - help ayccomms

AYCHeaters  
| - help aycheaters

AYCHoover  
| - help aychoover

AYCPi  
| - help aycpi

Amazon  
| - help amazon

Weather 
| - help weather  
| - weather x

WebCam  
| - help webcam  
| - webcam picture  
| - webcam video

Wikipedia  
| - help wikipedia  
| - wiki today  
| - wiki x

WorldCup 
| - help worldcup 
| - wc today  
| - wc tomorrow 
| - wc current 
| - wc matches
| - wc matches [a-h]
| - wc matches [a-hA-Z.{4,15}]
| - wc groups
| - wc groups [a-h]

Youtube  
| - help youtube  
| - youtube x

```

Add your own module/strategy

```
# include base class
const MessageStrategy = require("../MessageStrategy.js")


class MyMod extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);
  static self = null;

  constructor() {
    super('MyMod', {
      'enabled': true
    });
  }

  provides() {
    MyMod.self = this;

    return {
      help: 'Manages MyMod',
      provides: {
        'Door': {
          test: function (message) {
            return message.body.toLowerCase() === 'door';
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name);
          },
          help: function () {
            return 'Info for your help entry';
          },
          action: MyMod.self.MyModFunc,
          interactive: false,
          enabled: function () {
            return MessageStrategy.state['MyMod']['enabled'];
          }
        },
        'as many of these as you need': {
          .....
        },
        'as many of these as you need': {
          .....
        }
      },
      access: function (message, strategy) {
        return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name);
      },
      enabled: function () {
        return MessageStrategy.state['MyMod']['enabled'];
      }
    }
  }

  MyModFunc() {
    return false;
  }
}

module.exports = {
  MessageStrategy: MyMod
}

```
