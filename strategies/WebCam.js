const MessageStrategy = require("../MessageStrategy.js")

// ####################################
// WebCam
// ####################################

class WebCam extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name);

  constructor() {
    super('WebCam', {
      'enabled': true
    });
  }

  describe(message, strategies) {
    this.message = message;
    MessageStrategy.typing(this.message);
    let description = "Takes a picture or video from local webcam"
    MessageStrategy.client.sendText(this.message.from, description);
  }

  provides() {
    return ['WebCam', 'Webcam picture', 'Webcam video \d+'];
  }

  async takeVideo(self) {

    let sha1d = crypto.createHash('sha1').digest('hex');
    let time = "10";
    let video_time = /webcam video ([0-9]{1,2})/i;
    let found = self.message.body.match(video_time);

    if (found) {
      time = found[1];
    }

    let cmd = "ffmpeg -y -f video4linux2 -s 1280x720 -pix_fmt yuyv422 -r 6 -t ";
    cmd += time + " -i /dev/video0 " + sha1d + ".mp4";

    MessageStrategy.typing(self.message);

    exec(cmd, (error, stdout, stderr) => {
      if (fs.existsSync(sha1d + ".mp4")) {
        try {
          MessageStrategy.typing(self.message);
          self.client.sendFile(self.message.from, sha1d + ".mp4", "cam", "Webcam home video");
          fs.unlinkSync(sha1d + ".mp4");
        } catch (err) {
          console.log(err);
        }
      }
    });
  }

  async takePicture(self) {
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
          self.client.sendImage(self.message.chatId, data, 'filename.jpeg', '');
          fs.unlinkSync("test_picture.jpg");
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

    if (this.message.body.toLowerCase().startsWith('webcam')) {
      if (MessageStrategy.hasAccess(this.message.sender.id, this.constructor.name) == false) {
        self.client.reply(this.message.from, 'Not for langers like you', this.message.id, true);
        return;
      }
    }

    if (this.message.body.toLowerCase() == 'webcam picture') {
      MessageStrategy.typing(this.message);
      this.takePicture(this);
      return true;
    }

    if (this.message.body.toLowerCase().startsWith('webcam video')) {
      MessageStrategy.typing(this.message);
      this.takeVideo(this);
      return true;
    }

    return false;
  }
}


module.exports = {
  MessageStrategy: WebCam
}