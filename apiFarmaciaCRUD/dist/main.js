"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const bd_1 = __importDefault(require("./bd"));
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = '3200';
        this.baseDir = path_1.default.join(__dirname, 'templates');
        this.con = (0, bd_1.default)();
        this.routes();
    }
    routes() {
        //Midwares para receber dados via POST do formulário
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use(express_1.default.json());
        //Rotas das páginas
        this.app.get("/", (req, res) => res.sendFile(`${this.baseDir}/index.html`));
        this.app.get("/cadastrar-fornecedor", (req, res) => res.sendFile(`${this.baseDir}/cadastrar-fornecedor.html`));
        this.app.get("/sobre", (req, res) => res.sendFile(`${this.baseDir}/sobre.html`));
        //Rotas para realizar operações no banco de dados
        this.app.post('/fornecedores', (req, res) => {
            let dados = Object.values(req.body).map((val) => val); // Criando uma array com dados do formulário
            let sql = `INSERT INTO farmacia.fornecedores (cnpj, nome, telefone, contato) VALUES (?,?,?,?)`;
            try {
                this.con.query(sql, dados, (err, resbd) => { err ? res.json(err) : res.json(resbd); }); // resposta do banco de dados
            }
            catch (error) {
                res.json(error);
            }
        });
        this.app.get('/fornecedores/:id?', (req, res) => {
            let sql;
            sql = `SELECT * FROM fornecedores`;
            sql = req.params.id ? sql + ` WHERE id=${req.params.id}` : sql;
            try {
                this.con.query(sql, (err, resbd) => { err ? res.json(err) : res.json(resbd); });
            }
            catch (error) {
                console.log(error);
            }
        });
        this.app.put('/fornecedores/:id', (req, res) => {
            let dados = Object.values(req.body).map((val) => val);
            dados.push(req.params.id);
            let sql;
            sql = `UPDATE farmacia.fornecedores SET cnpj=?, nome=?, telefone=?, contato=? WHERE id=?;`;
            try {
                this.con.query(sql, dados, (err, resbd) => { err ? res.json(err) : res.json(resbd); });
            }
            catch (error) {
                console.log(error);
            }
            ;
        });
        this.app.delete('/fornecedores/:id', (req, res) => {
            let sql;
            sql = `DELETE FROM fornecedores WHERE id=${req.params.id}`;
            this.con.query(sql, (err, resbd) => { err ? res.json(err) : res.json(resbd); });
        });
        // ROTAS PRODUTOS
        this.app.post('/produtos', (req, res) => {
            let dados = Object.values(req.body).map((val) => val); // Criando uma array com dados do formulário
            let sql = `INSERT INTO farmacia.produtos (id_fornecedor,cod_barras, nome, preco) VALUES (?,?,?,?)`;
            try {
                this.con.query(sql, dados, (err, resbd) => { err ? res.json(err) : res.json(resbd); }); // resposta do banco de dados
            }
            catch (error) {
                res.json(error);
            }
        });
        this.app.get('/produtos/:id?', (req, res) => {
            let sql;
            sql = `SELECT * FROM produtos`;
            sql = req.params.id ? sql + ` WHERE id=${req.params.id}` : sql;
            try {
                this.con.query(sql, (err, resbd) => { err ? res.json(err) : res.json(resbd); });
            }
            catch (error) {
                console.log(error);
            }
        });
        this.app.put('/produtos/:id', (req, res) => {
            let dados = Object.values(req.body).map((val) => val);
            dados.push(req.params.id);
            let sql;
            sql = `UPDATE farmacia.produtos SET cod_barras=?, nome=?, preco=? WHERE id=?;`;
            this.con.query(sql, dados, (err, resbd) => { err ? res.json(err) : res.json(resbd); });
        });
        this.app.delete('/produtos/:id', (req, res) => {
            let sql;
            sql = `DELETE FROM produtos WHERE id=${req.params.id}`;
            this.con.query(sql, (err, resbd) => { err ? res.json(err) : res.json(resbd); });
        });
        this.app.use((req, res) => res.sendFile(`${this.baseDir}/404.html`)); //essa página sempre ficará por último
    }
    start() {
        this.app.listen(this.port, () => console.log(`Servidor rodando em: http://localhost:${this.port}`));
    }
}
//instância da classe
const server = new Server();
//invocação do método start
server.start();
