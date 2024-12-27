import axios from "axios";
import { sleep_for } from "./helper";

export class Mail {
  username: string;
  password: string;
  email: string;
  base_url = "https://api.mail.tm";

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
    this.email = `${this.username}@freesourcecodes.com`;
  }
  /**
   *
   * @returns
   */
  async createMail() {
    const httpResponse = await axios.post(`${this.base_url}/accounts`, {
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
  async getMailToken(): Promise<string> {
    const httpResponse = await axios.post(`${this.base_url}/token`, {
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
  async getVerificationLink(): Promise<string> {
    const token = await this.getMailToken();
    let msgID = await this.getMessages(token);
    console.log(msgID);
    const httpResponse = await axios.get(`${this.base_url}/messages/${msgID}`, {
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
  async getMessages(token: string): Promise<string> {
    await sleep_for(2000, 5000);
    try {
      const httpResponse = await axios.get(`${this.base_url}/messages?page=1`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      const data = httpResponse.data;
      let firstMsgId = data["hydra:member"][0]["id"];
      return firstMsgId;
    } catch (error) {
      console.log(error);
    }
    return this.getMessages(token);
  }
}

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
