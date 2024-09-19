"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bd_1 = __importDefault(require("./bd"));
const con = (0, bd_1.default)();
const obterCampos = (tabela) => {
    let sql = `DESCRIBE ${tabela}`;
    let campos = [];
    con.query(sql, (err, resbd) => {
        console.log(resbd);
        campos = resbd.map((c) => c.Field);
    });
    console.log(campos);
};
obterCampos("fornecedores");
