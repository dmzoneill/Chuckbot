const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// WebCam
// ####################################

class WebCam extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);
  static self = null;

  constructor() {
    super('WebCam', {
      'enabled': true
    });
  }

  provides() {
    WebCam.self = this;

    return {
      help: 'Takes actions using webcam',
      provides: {
        'webcam picture': {
          test: function (message) {
            return message.body.toLowerCase() == 'webcam picture';
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name);
          },
          help: function () {
            return 'Take a webcam picture';
          },
          action: function TakePicture(message) {
            WebCam.self.TakePicture(message);
            return true;
          },
          interactive: true,
          enabled: function () {
            return MessageStrategy.state['WebCam']['enabled'];
          }
        },
        'webcam video': {
          test: function (message) {
            return message.body.toLowerCase().startsWith('webcam video');
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name);
          },
          help: function () {
            return 'Take a video';
          },
          action: function TakeVideo(message) {
            WebCam.self.TakeVideo(message);
            return true;
          },
          interactive: true,
          enabled: function () {
            return MessageStrategy.state['WebCam']['enabled'];
          }
        }
      },
      access: function (message, strategy) {
        return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name);
      },
      enabled: function () {
        return MessageStrategy.state['WebCam']['enabled'];
      }
    }
  }

  async TakeVideo(message) {

    let sha1d = crypto.createHash('sha1').digest('hex');
    let time = "10";
    let video_time = /webcam video ([0-9]{1,2})/i;
    let found = message.body.match(video_time);

    if (found) {
      time = found[1];
    }

    let cmd = "ffmpeg -y -f video4linux2 -s 1280x720 -pix_fmt yuyv422 -r 6 -t ";
    cmd += time + " -i /dev/video0 " + sha1d + ".mp4";

    MessageStrategy.typing(message);

    exec(cmd, (error, stdout, stderr) => {
      if (fs.existsSync(sha1d + ".mp4")) {
        try {
          MessageStrategy.typing(message);
          MessageStrategy.client.sendFile(message.from, sha1d + ".mp4", "cam", "Webcam home video");
          fs.unlinkSync(sha1d + ".mp4");
        } catch (err) {
          console.log(err);
        }
      }
    });
  }

  async TakePicture(message) {
    try {

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
          MessageStrategy.client.sendImage(message.chatId, data, 'filename.jpeg', '');
          fs.unlinkSync("test_picture.jpg");
        } catch (err) {
          console.log(err);
        }
      });
    } catch (err) {
      console.log(err);
    }
  }
}


module.exports = {
  MessageStrategy: WebCam
}