"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql2_1 = __importDefault(require("mysql2"));
const CreateConnection = () => {
    const config = {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'farmacia'
    };
    // retorno de mensagem de conexão
    let pool = mysql2_1.default.createPool(config);
    pool.getConnection((err, con) => {
        let mensagem = err ? `Erro de conexão ${err}` : `Conexão bem sucedida!`;
        console.log(mensagem);
    });
    return pool;
};
exports.default = CreateConnection;
