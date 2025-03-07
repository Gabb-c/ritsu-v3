import { Message } from 'eris'
import { AnimeEntry } from 'anilist-node'
import { RoomDocument } from '@entities/Room'
import stringSimilarity from 'string-similarity'
import HintsHandler from '@handlers/HintsHandler'
import Constants from '@utils/Constants'
import { UserDocument } from '@entities/User'

export default {
  async handleCollect(room: RoomDocument, msg: Message) {
    if (!room.answerers.includes(msg.author.id)) {
      room.answerers.push(msg.author.id)

      const findInLeaderBoard = room.leaderboard.find((user) => {
        return user.id === msg.author.id
      })
      if (findInLeaderBoard === undefined) {
        room.leaderboard.push({ id: msg.author.id })
      }

      void msg.channel.createMessage(
        `<@${msg.author.id}> get the correct answer!`
      )
      await msg.delete()
      await room.save()
    }
  },

  async handleFakeCommand(
    prefix: string,
    user: UserDocument,
    hintsHandler: HintsHandler,
    msg: Message
  ) {
    const command = msg.content.trim()
    if (command === `${prefix}hint`) {
      if (user.cakes < 1)
        return msg.channel.createMessage(
          "You don't have enough cakes! A hint costs 1 cake, go vote for me on top.gg to get more cakes!"
        )
      const hint = hintsHandler.generateHint()
      const embed = {
        title: ':question: Give me a hint!',
        description: `**\`${hint}\`**`,
        color: Constants.EMBED_COLOR_BASE,
      }

      user.cakes = user.cakes - 1
      await user.save()
      await msg.channel.createMessage({ embed })
    }
  },

  isAnswer(animeData: AnimeEntry, msg: Message) {
    const parsedMessage = msg.content
      .trim()
      .replace(/[^\w\s]/gi, '')
      .toLowerCase()
    let score = 0

    const answers: Array<string> = []
    if (animeData.synonyms != null) {
      animeData.synonyms.forEach((s) => {
        answers.push(s)
      })
    }

    const titles = Object.values(animeData.title) as Array<string>
    titles.forEach((t) => {
      if (t !== null) {
        answers.push(t)
      }
    })

    answers.forEach((a) => {
      // Let's compare all the titles!
      const similarity = stringSimilarity.compareTwoStrings(a, parsedMessage)
      score = similarity > score ? similarity : score
    })
    return score > 0.45
  },

  isFakeCommand(prefix: string, msg: Message) {
    const command = msg.content.trim()
    if (command === `${prefix}hint`) {
      return true
    }
  },
}
