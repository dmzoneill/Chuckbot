const MessageStrategy = require('../MessageStrategy.js')

// ####################################
// Youtube previews / search
// ####################################

class Youtube extends MessageStrategy {
  static dummy = MessageStrategy.derived.add(this.name)
  static self = null

  constructor () {
    super('Youtube', {
      enabled: true
    })
  }

  provides () {
    Youtube.self = this

    return {
      help: 'Provides previews and searches for youtube videos',
      provides: {
        'youtube x': {
          test: function (message) {
            return message.body.toLowerCase().startsWith('youtube')
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Allows user to search for a youtube video given a string'
          },
          interactive: true,
          action: Youtube.self.Search,
          enabled: function () {
            return MessageStrategy.state.Youtube.enabled
          }
        },
        'skip-youtube': {
          test: function (message) {
            return message.body.match(/^https:\/\/.*youtube.com\/.*/) || message.body.match(/^https:\/\/youtu.be\/.*/)
          },
          access: function (message, strategy, action) {
            return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name + action.name)
          },
          help: function () {
            return 'Add previews for youtube urls'
          },
          interactive: false,
          action: Youtube.self.Preview,
          enabled: function () {
            return MessageStrategy.state.Youtube.enabled
          }
        }
      },
      access: function (message, strategy) {
        return MessageStrategy.hasAccess(message.sender.id, strategy.constructor.name)
      },
      enabled: function () {
        return MessageStrategy.state.Youtube.enabled
      }
    }
  }

  async Preview (message) {
    try {
      let getVideo = false

      MessageStrategy.typing(message)
      Youtube.self.waitFor(500)

      if (Object.keys(message).includes('thumbnail') === false) {
        getVideo = true
      }

      if (Object.keys(message).includes('thumbnail')) {
        if (message.thumbnail.length === 'undefined') {
          getVideo = true
        }
      }

      if (Object.keys(message).includes('thumbnail')) {
        if (getVideo === false) {
          if (message.thumbnail.length === 0) {
            getVideo = true
          }
        }
      }

      const parts = message.body.split('/')
      let videoId = ''
      if (parts[3].indexOf('v=') > -1) {
        const subParts = parts[3].split('v=')
        videoId = subParts[1]
      } else if (parts[3] === 'shorts') {
        videoId = parts[4]
      } else {
        videoId = parts[3]
      }

      if (getVideo) {
        MessageStrategy.typing(message)
        const youtubeImage = await MessageStrategy.get_image('https://img.youtube.com/vi/' + videoId + '/hqdefault.jpg')

        if (youtubeImage === null) {
          return
        }

        const youtube = await Innertube.create(/* options */)
        const video = await youtube.getBasicInfo(videoId)

        MessageStrategy.typing(message)
        // MessageStrategy.client.sendYoutubeLink(message.from, message.body, '', youtubeImage)
        await MessageStrategy.client.sendImage(message.from, youtubeImage, 'yt.jpg', video.basic_info.title + '\n\n' + 'https://www.youtube.com/watch?v=' + videoId)
      }
    } catch (err) {
      console.log(err)
    }
  }

  async Search (message) {
    const search_term = message.body.substring(7)

    try {
      const youtube = await Innertube.create(/* options */)
      const videos = await youtube.search(search_term)

      // console.log(await usetube.searchVideo(search_term))
      // const results = await yt.search(search_term)
      // const results = await usetube.searchVideo(search_term)
      // console.log("==========================================")
      // console.log(results.videos)
      // console.log("==========================================")
      if (videos.results.length === 0) {
        console.log('0 results')
        return false
      }
      MessageStrategy.typing(message)
      const youtube_image = await MessageStrategy.get_image('https://img.youtube.com/vi/' + videos.results[0].id + '/hqdefault.jpg', 200, false)
      await MessageStrategy.client.sendImage(message.from, 'data:image/jpeg;base64,' + youtube_image, 'yt.jpg', videos.results[0].title + '\n\n' + 'https://www.youtube.com/watch?v=' + videos.results[0].id)

      // console.log("data:image/jpeg;base64," + youtube_image)

      // await MessageStrategy.client.sendMessageWithThumb(
      //   youtube_image,
      //   "https://www.youtube.com/watch?v=" + results.videos[0].id,
      //   results.videos[0].title + "",
      //   results.videos[0].artist + "",
      //   "https://www.youtube.com/watch?v=" + results.videos[0].id,
      //   message.from
      // )

      // MessageStrategy.client.sendYoutubeLink(message.from, results[0].url)
      // MessageStrategy.client.sendYoutubeLink(message.from, "https://www.youtube.com/watch?v=" + results.videos[0].id)
      // MessageStrategy.client.sendLinkWithAutoPreview(
      //   message.from,
      //   "https://www.youtube.com/watch?v=" + results.videos[0].id,
      //   "https://www.youtube.com/watch?v=" + results.videos[0].id
      // )
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = {
  MessageStrategy: Youtube
}
