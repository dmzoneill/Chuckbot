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
APC  
| - help apc  
| - apc info
AYCBooking  
| - help aycbooking
AYCComms  
| - help ayccomms
AYCDoor  
| - help aycdoor  
| - ayc open door
AYCHeaters  
| - help aycheaters  
| - ayc heater status  
| - ayc heater on  
| - ayc heater off  
| - ayc heater boost  
| - ayc heater reset
AYCHoover  
| - help aychoover
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
| - meme enable  
| - meme disable  
| - meme freq  
| - meme spam
PhilipsHue  
| - help philipshue  
| - hue x
PulseAudio  
| - help pulseaudio  
| - volume x
Radarr  
| - help radarr
Rbac  
| - help rbac  
| - role mine  
| - role d+  
| - role list  
| - restricted list  
| - role add x y  
| - restricted add x  
| - role remove x y  
| - restricted remove x
Reddit  
| - help reddit
Sonarr  
| - help sonarr  
| - sonarr list  
| - sonarr show d+  
| - sonarr show .  
| - sonarr add d+  
| - sonarr search .  
| - sonarr update d+  
| - sonarr update .  
| - sonarr missing d+  
| - sonarr missing .  
| - sonarr stats  
| - sonarr calendar
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
Weather  
| - help weather  
| - weather x
WebCam  
| - help webcam  
| - webcam picture  
| - webcam video
AYCPi  
| - help aycpi
Amazon  
| - help amazon
Ashtanga  
| - help ashtanga  
| - yoga start  
| - yoga stop  
| - yoga list  
| - yoga poses
Chuck  
| - help chuck  
| - chuck name
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
Feature  
| - help feature  
| - feature list  
| - feature enable x  
| - feature disable x
Formula1  
| - help formula1  
| - f1 rankings driver  
| - f1 rankings team  
| - f1 races  
| - f1 driver .
Google  
| - help google  
| - google x
Wikipedia  
| - help wikipedia  
| - wiki today  
| - wiki x
WorldCup  
| - help worldcup  
| - wc update  
| - wc groups  
| - wc group [a-h]  
| - wc matches  
| - wc matches [a-h]  
| - wc current  
| - wc today  
| - wc tomorrow  
| - wc matches [a-zA-Z.]{4,15}  
| - wc top d+  
| - wc 16  
| - wc 8  
| - wc 4  
| - wc 2
Youtube  
| - help youtube  
| - youtube x
Harass  
| - help harass  
| - harass  
| - harass x  
| - harass stop x  
| - harass list
Help  
| - help help  
| - help  
| - help xHi  
| - help hi  
| - Hi
HyperLink  
| - help hyperlink
Imdb  
| - help imdb  
| - imdb x
Jackett  
| - help jackett

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
