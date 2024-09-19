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
        this.app.post('/:tabela', (req, res) => {
            let dados = Object.values(req.body).map((val) => val); // Criando uma array com dados do formulário
        });
        this.app.get('/:tabela/:id?', (req, res) => {
        });
        this.app.put('/:tabela/:id', (req, res) => {
        });
        this.app.delete('/:tabela/:id', (req, res) => {
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
