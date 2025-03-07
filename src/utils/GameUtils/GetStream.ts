import RitsuHTTP from '@structures/RitsuHTTP'

export default async function getStreamFromURL(url: string) {
  const stream = await RitsuHTTP.get<string>(url, {
    responseType: 'stream',
    timeout: 20000,
  }).catch((e) => {
    throw new Error(`Failed to fetch the stream. | ${e}`)
  })
  return stream.data
}
