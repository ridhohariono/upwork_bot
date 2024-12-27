"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpworkAccount = void 0;
const accounts_json_1 = __importDefault(require("../data/accounts.json"));
class UpworkAccount {
    getAll() {
        return accounts_json_1.default;
    }
}
exports.UpworkAccount = UpworkAccount;
