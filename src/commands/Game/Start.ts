import Game from '@handlers/GameHandler'
import MatchConfig from '@handlers/MatchSettingsHandler'
import RitsuClient from '@structures/RitsuClient'
import { RitsuCommand, Context } from '@structures/RitsuCommand'

class Start extends RitsuCommand {
  constructor(client: RitsuClient) {
    super(client, {
      name: 'start',
      description: 'Start a Game!',
      category: 'Game',
      dev: false,
      aliases: [],
      requiredPermissions: null,
    })
  }

  async run({ message, guild, t }: Context) {
    const matchConfig = new MatchConfig(message, this.client, guild, t)
    const gamemode = await matchConfig.getGamemode()
    if (!gamemode) return
    const rounds = await matchConfig.getRounds()
    if (!rounds) return
    const duration = await matchConfig.getDuration()
    if (!duration) return

    let animeListWebsite: string
    let animeListUsername: string
    let season: string
    let seasonYear: string

    if (gamemode === 'list') {
      animeListWebsite = await matchConfig.getListWebsite()
      if (!animeListWebsite) return
      animeListUsername = await matchConfig.getListUsername(animeListWebsite)
      if (!animeListUsername) return
    } else if (gamemode === 'season') {
      const seasonObject = await matchConfig.getSeason()
      if (!seasonObject) return

      season = seasonObject.season
      seasonYear = seasonObject.year
    }

    const game = new Game(
      message,
      this.client,
      {
        mode: gamemode,
        rounds: rounds,
        time: duration.parsed,
        readableTime: duration.value,

        // Optional
        animeListUsername: animeListUsername,
        animeListWebsite: animeListWebsite,
        season: season,
        year: seasonYear,
      },
      t
    )
    await game.initGame()
  }
}

export = Start
