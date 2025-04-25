import { version } from '../../package.json'

class AndroidVersionChecker {
  private readonly latestUrl = 'https://api.github.com/repos/lgabardos/AgriChrono/releases/latest'

  private compareVersions(version1: string, version2: string) {
    const v1Parts = version1.split('.').map(Number)
    const v2Parts = version2.split('.').map(Number)

    for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
      const v1 = v1Parts[i] || 0 // Si la version n'a pas de partie, on considère qu'elle est 0
      const v2 = v2Parts[i] || 0

      if (v1 < v2) {
        return -1 // version1 est inférieure à version2
      }
      if (v1 > v2) {
        return 1 // version1 est supérieure à version2
      }
    }
    return 0 // Les versions sont égales
  }
  async check() {
    const response = await fetch(this.latestUrl)
    const json = await response.json()
    const latestVersion = json.tag_name.replace('v', '')

    return this.compareVersions(latestVersion, version) > 0
  }

  async getLatestAPK() {
    const response = await fetch(this.latestUrl)
    const json = await response.json()
    const assets = json.assets
    const asset = assets[0]
    return asset.browser_download_url
  }
}
export const androidVersionChecker = () => new AndroidVersionChecker()
