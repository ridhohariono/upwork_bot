"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Proxy = void 0;
const axios_1 = __importDefault(require("axios"));
class Proxy {
    base_url = "https://api.proxyscrape.com/v4/free-proxy-list";
    /**
     *
     * @param countryCode
     * @returns
     */
    async getProxyList(countryCode) {
        const httpResponse = await axios_1.default.get(`${this.base_url}/get?request=display_proxies&proxy_format=protocolipport&format=json&country=${countryCode}`);
        const data = await httpResponse.data.proxies;
        return data;
    }
}
exports.Proxy = Proxy;
