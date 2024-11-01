"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const checkCardIfExist = (card, dir, chars) => __awaiter(void 0, void 0, void 0, function* () {
    if (card == undefined && fs_1.default.existsSync(dir)) {
        const files = fs_1.default.readdirSync(dir);
        if (files.length > 0) {
            const card = fs_1.default.readdirSync(dir).filter((item) => item.includes(chars));
            if (card)
                return true;
        }
    }
    return false;
});
exports.default = checkCardIfExist;
//# sourceMappingURL=checkCardIfExist.js.map