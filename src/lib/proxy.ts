import axios from "axios";

export class Proxy {
  base_url = "https://api.proxyscrape.com/v4/free-proxy-list";
  /**
   *
   * @param countryCode
   * @returns
   */
  async getProxyList(countryCode: string): Promise<[any]> {
    const httpResponse = await axios.get(
      `${this.base_url}/get?request=display_proxies&proxy_format=protocolipport&format=json&country=${countryCode}`
    );
    const data = await httpResponse.data.proxies;
    return data;
  }
}
