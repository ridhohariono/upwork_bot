"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mail = void 0;
const axios_1 = __importDefault(require("axios"));
const helper_1 = require("./helper");
class Mail {
    username;
    password;
    email;
    base_url = "https://api.mail.tm";
    constructor(username, password) {
        this.username = username;
        this.password = password;
        this.email = `${this.username}@freesourcecodes.com`;
    }
    /**
     *
     * @returns
     */
    async createMail() {
        const httpResponse = await axios_1.default.post(`${this.base_url}/accounts`, {
            address: this.email,
            password: this.password,
        });
        console.log({
            address: this.email,
            password: this.password,
        });
        const data = httpResponse.data;
        return data;
    }
    /**
     *
     * @returns token
     */
    async getMailToken() {
        const httpResponse = await axios_1.default.post(`${this.base_url}/token`, {
            address: this.email,
            password: this.password,
        });
        const data = httpResponse.data;
        let token = data.token;
        console.log(token);
        return token;
    }
    /**
     *
     * @returns verification link
     */
    async getVerificationLink() {
        const token = await this.getMailToken();
        let msgID = await this.getMessages(token);
        console.log(msgID);
        const httpResponse = await axios_1.default.get(`${this.base_url}/messages/${msgID}`, {
            headers: {
                Authorization: "Bearer " + token,
            },
        });
        const data = await httpResponse.data;
        let link = data.text.split("Verify Email: ")[1].split("\n")[0].trim();
        return link;
    }
    /**
     *
     * @param token
     * @returns
     */
    async getMessages(token) {
        await (0, helper_1.sleep_for)(2000, 5000);
        try {
            const httpResponse = await axios_1.default.get(`${this.base_url}/messages?page=1`, {
                headers: {
                    Authorization: "Bearer " + token,
                },
            });
            const data = httpResponse.data;
            let firstMsgId = data["hydra:member"][0]["id"];
            return firstMsgId;
        }
        catch (error) {
            console.log(error);
        }
        return this.getMessages(token);
    }
}
exports.Mail = Mail;
// let createMail = async (username: string, password: string) => {
//   const httpResponse = await axios.post(`${BASE_URL}/accounts`, {
//     address: `${username}@freesourcecodes.com`,
//     password: password,
//   });
//   const data = httpResponse.data;
//   return data;
// };
// let getMailToken = async (email: string, password: string) => {
//   const httpResponse = await axios.post(`${BASE_URL}/token`, {
//     address: email,
//     password: password,
//   });
//   const data = httpResponse.data;
//   return data;
// };
// let getMessage = async (token: string) => {
//   const httpResponse = await axios.post(`${BASE_URL}/messages?page=1`, {
//     headers: {
//       Authorization: "Bearer " + token,
//     },
//   });
//   const data = httpResponse.data;
//   return data;
// };
