import { version } from '../../package.json'

class AndroidVersionChecker {
  async check() {
    const url = 'https://api.github.com/repos/lgabardos/AgriChrono/releases/latest'
    const response = await fetch(url)
    const json = await response.json()
    const latestVersion = json.tag_name.replace('v', '')
    return latestVersion > version
  }

  async getLatestAPK() {
    const url = 'https://api.github.com/repos/lgabardos/AgriChrono/releases/latest'
    const response = await fetch(url)
    const json = await response.json()
    const assets = json.assets
    const asset = assets[0]
    return asset.browser_download_url
  }
}
export const androidVersionChecker = () => new AndroidVersionChecker()
