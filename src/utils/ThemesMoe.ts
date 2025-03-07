import { ThemesMoeAnime } from '@interfaces/ThemesMoe'
import RitsuHTTP from '@structures/RitsuHTTP'
import RitsuUtils from '@utils/RitsuUtils'

export default {
  async getAnimesByAnimeList(
    website: string,
    username: string
  ): Promise<ThemesMoeAnime[]> {
    switch (website) {
      case 'mal': {
        try {
          const themesMoeResponse = await RitsuHTTP.get<Array<ThemesMoeAnime>>(
            `https://themes.moe/api/mal/${username}`
          )

          const data = themesMoeResponse.data.filter(
            (anime) => anime.watchStatus === 2
          )

          if (data.length > 0) {
            return data
          } else {
            throw new Error("I didn't find any anime on that list.")
          }
        } catch (e) {
          if (RitsuUtils.isAxiosError(e)) {
            if (e.response.status === 400) throw new Error('User not found.')
          } else {
            throw new Error(`${e}`)
          }
        }
        break
      }
      case 'anilist': {
        try {
          const themesMoeResponse = await RitsuHTTP.get<Array<ThemesMoeAnime>>(
            `https://themes.moe/api/anilist/${username}`
          )

          const data = themesMoeResponse.data.filter(
            (anime) => anime.watchStatus === 2
          )

          if (data.length > 0) {
            return data
          } else {
            throw new Error("I didn't find any anime on that list.")
          }
        } catch (e) {
          if (RitsuUtils.isAxiosError(e)) {
            if (e.response.status === 400) throw new Error('User not found.')
          } else {
            throw new Error(`${e}`)
          }
        }
        break
      }
      default: {
        throw new Error('Unsupported Website')
      }
    }
  },

  async getAnimesBySeason(
    year: string,
    season: string
  ): Promise<ThemesMoeAnime[]> {
    try {
      const themesMoeResponse = await RitsuHTTP.get<Array<ThemesMoeAnime>>(
        `https://themes.moe/api/seasons/${year}`
      )

      const data = themesMoeResponse.data
      const filter = data.filter((anime) => anime.season === season)

      if (filter.length > 0) return filter

      throw new Error('Season not found.')
    } catch (e) {
      if (RitsuUtils.isAxiosError(e)) {
        if (e.response.status === 404) throw new Error('Year not found.')
      } else {
        throw new Error(`${e}`)
      }
    }
  },
}
