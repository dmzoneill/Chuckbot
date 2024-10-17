const MessageStrategy = require('../MessageStrategy.js')

// ####################################
// WebCam
// ####################################

class WebCam extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name)
  static self = null

  constructor () {
    super('WebCam', {
      enabled: true
    })
  }

  provides () {
    WebCam.self = this

    return {
      help: 'Takes actions using webcam',
      provides: {
        'webcam picture': {
          test: function (message) {
            return message.body.toLowerCase() === 'webcam picture'
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Take a webcam picture'
          },
          action: function TakePicture (message) {
            WebCam.self.TakePicture(message)
            return true
          },
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.WebCam.enabled
          }
        },
        'webcam pic': {
          test: function (message) {
            return message.body.toLowerCase() === 'webcam pic'
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Take a webcam picture'
          },
          action: function SendPic (message) {
            WebCam.self.SendPic(message)
            return true
          },
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.WebCam.enabled
          }
        },
        'webcam video': {
          test: function (message) {
            return message.body.toLowerCase().startsWith('webcam video')
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Take a video'
          },
          action: function TakeVideo (message) {
            WebCam.self.TakeVideo(message)
            return true
          },
          interactive: true,
          enabled: function () {
            return MessageStrategy.state.WebCam.enabled
          }
        }
      },
      access: function (message, strategy) {
        return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name)
      },
      enabled: function () {
        return MessageStrategy.state.WebCam.enabled
      }
    }
  }

  async TakeVideo (message) {
    const sha1d = crypto.createHash('sha1').digest('hex')
    let time = '10'
    const video_time = /webcam video ([0-9]{1,2})/i
    const found = message.body.match(video_time)

    if (found) {
      time = found[1]
    }

    // ffmpeg -video_size hd1080 -framerate 30 -i /dev/video0 -t 00:00:20
    // -acodec aac -vcodec libx265 -fps_mode vfr -crf 18  -vb 2M -r 30 record.mkv

    let cmd = 'ffmpeg -f pulse'
    cmd += ' -i alsa_input.usb-046d_C922_Pro_Stream_Webcam_F98F927F-02.analog-stereo'
    cmd += ' -ac 2 -f v4l2 -input_format mjpeg -video_size hd720'
    cmd += ' -framerate 60 -i /dev/video0 -t ' + time + ' -acodec aac'
    cmd += ' -vcodec libx265 -fps_mode vfr -crf 18 -vb 2M -r 30 ' + sha1d + '.mp4'

    MessageStrategy.typing(message)

    exec(cmd, (error, stdout, stderr) => {
      if (error) return

      if (fs.existsSync(sha1d + '.mp4')) {
        try {
          MessageStrategy.typing(message)
          MessageStrategy.client.sendFile(message.from, sha1d + '.mp4', new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + ' webcam video', 'Webcam home video')
          fs.unlinkSync(sha1d + '.mp4')
        } catch (err) {
          console.log(err)
        }
      }
    })
  }

  async TakePicture (message) {
    try {
      const opts = {
        width: 1280,
        height: 720,
        quality: 100,
        frames: 60,
        delay: 0,
        saveShots: true,
        output: 'jpeg',
        device: false,
        verbose: false,
        callbackReturn: 'base64'
      }

      NodeWebcam.capture('test_picture', opts, function (err, data) {
        if (err) return

        try {
          MessageStrategy.client.sendImage(message.chatId, data, 'filename.jpeg', '')
          fs.unlinkSync('test_picture.jpg')
        } catch (err) {
          console.log(err)
        }
      })
    } catch (err) {
      console.log(err)
    }
  }

  async SendPic (message) {
    try {
      // Read the directory to get all files
      const dirPath = './strategies/webcam/'
      const files = fs.readdirSync(dirPath)

      // Filter to ensure only images are selected (optional, based on file extension)
      const imageFiles = files.filter(file => ['.jpg', '.jpeg', '.png', '.gif'].includes(path.extname(file).toLowerCase()))

      if (imageFiles.length === 0) {
        throw new Error('No image files found in the directory')
      }

      // Select a random image
      const randomImage = imageFiles[Math.floor(Math.random() * imageFiles.length)]

      // Send the randomly selected image
      const filePath = path.join(dirPath, randomImage)
      await MessageStrategy.client.sendImage(message.chatId, filePath, randomImage, '')
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = {
  MessageStrategy: WebCam
}
