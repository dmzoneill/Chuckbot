const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// WebCam
// ####################################

class WebCam extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);

  constructor() {
    super();
    MessageStrategy.state['WebCam'] = {
      'enabled': true,
      'allowed_requesters': [
        "353861938787@c.us"
      ]
    }
  }

  describe(message, strategies) {
    this.message = message;
    MessageStrategy.typing(this.message);
    let description = "Takes a picture or video from local webcam"
    MessageStrategy.client.sendText(this.message.from, description);
  }

  provides() {
    return ['WebCam', 'Webcam picture']
  }

  takePicture(self) {
    try {
      
      if(MessageStrategy.state['WebCam']['allowed_requesters'].includes(self.message.sender.id) == false) {
        self.client.reply(self.message.from, 'Not for langers like you', self.message.id, true);
        return;
      }

      var opts = {
        width: 1280,
        height: 720,
        quality: 100,
        frames: 60,
        delay: 0,
        saveShots: true,
        output: "jpeg",
        device: false,
        callbackReturn: "location",
        verbose: false,
        callbackReturn: "base64"
      };

      NodeWebcam.capture("test_picture", opts, function (err, data) {
        try {
          self.client.sendImage(self.message.chatId, data, 'filename.jpeg', '')
        } catch (err) {
          console.log(err);
        }
      });
    } catch (err) {
      console.log(err);
    }
  }

  handleMessage(message) {
    if (MessageStrategy.state['WebCam']['enabled'] == false) return;

    this.message = message;

    if (this.message.body.toLowerCase() === 'webcam picture') {
      MessageStrategy.typing(this.message);
      this.takePicture(this);
      return true;
    }

    return false;
  }
}


module.exports = {
  MessageStrategy: WebCam
}