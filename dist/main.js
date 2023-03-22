"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const glob = __importStar(require("@actions/glob"));
const fs = __importStar(require("fs/promises"));
const fast_xml_parser_1 = require("fast-xml-parser");
function readFile(pattern) {
    return __awaiter(this, void 0, void 0, function* () {
        const globber = yield glob.create(pattern);
        const files = yield globber.glob();
        if (files.length == 0) {
            throw new Error("No matching file found");
        }
        else if (files.length > 1) {
            core.warning(`Action supports only one mutations.xml at a time, will only use ${files[0]}`);
        }
        const file = files[0];
        if (!file.endsWith('xml')) {
            throw new Error(`Matched file (${file}) doesn't end in 'xml'`);
        }
        return yield fs.readFile(file, { encoding: 'utf8' });
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const file = core.getInput("file");
            const data = yield readFile(file);
            const summary = core.getBooleanInput("summary");
            const parser = new fast_xml_parser_1.XMLParser();
            const mutations = parser.parse(data);
            core.debug(JSON.stringify(mutations));
            if (summary) {
                core.summary.addCodeBlock(mutations, "json");
            }
        }
        catch (error) {
            if (error instanceof Error) {
                core.setFailed(error.message);
            }
        }
    });
}
run();