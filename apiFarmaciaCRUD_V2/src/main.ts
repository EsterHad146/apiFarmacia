import express, { Express } from "express";
import path from "path";
import CreateConnection from './bd';
import { createConnection } from 'mysql2';
import { executarQuery, obterCampos } from "queries";


class Server{
    private app: Express;
    private port: string;
    private baseDir: string;
    private con: any;

    constructor(){
        this.app = express();
        this.port = '3200';
        this.baseDir = path.join(__dirname, 'templates');
        this.con = CreateConnection();
        this.routes();
    }
    private routes():void{
        //Midwares para receber dados via POST do formulário
        this.app.use(express.urlencoded({extended:true}));
        this.app.use(express.json());

        //Rotas das páginas
        this.app.get("/",(req,res)=>res.sendFile(`${this.baseDir}/index.html`));
        this.app.get("/cadastrar-fornecedor",(req,res)=>res.sendFile(`${this.baseDir}/cadastrar-fornecedor.html`));
        this.app.get("/sobre",(req,res)=>res.sendFile(`${this.baseDir}/sobre.html`));

        //Rotas para realizar operações no banco de dados
        this.app.post('/:tabela', async(req, res)=>{
            try{
                let dados :any[] = Object.values(req.body).map((val) => val); // Criando uma array com dados do formulário
                let campos = (await obterCampos(req.params.tabela));
                campos.shift(); //exclui o primeiro atributo do banco de dados "ID"
                let parametros = campos.map(item => '?').toString();
                let camposTxt = campos.toString();
                let sql :string =  `INSERT INTO ${req.params.tabela} (${camposTxt}) VALUES (${parametros});`;
                let resbd = (await executarQuery(sql, dados));
                res.json(resbd).status(200);
            }catch (error) {
                let erro = {
                    message:`A rota ${req.params.tabela} não foi encontrada.`,
                    status:'400',
                    erro:error
                };
                res.json(erro).status(200);
            }     
        });
        this.app.get('/:tabela/:id?', async(req, res)=>{
            try {
                let campos = (await obterCampos(req.params.tabela));
                let sql :string;
                sql =`SELECT * FROM ${req.params.tabela} `;
                sql = req.params.id?sql+`WHERE ${campos[0]}=${req.params.id}`:sql;
                let resbd = (await executarQuery(sql));
                res.json(resbd[0]).status(200);
            } catch (error) {
                let erro = {
                    message:`A rota ${req.params.tabela} não foi encontrada.`,
                    status:'400',
                    erro:error
                };
                res.json(erro).status(200);
            }    
        });
        this.app.put('/:tabela/:id', async(req, res)=>{
            try {
                let dados :any[] = Object.values(req.body).map((val)=>val);
                let campos = (await obterCampos(req.params.tabela));
                let pk = campos[0];
                campos.shift();
                let parametros = campos.map(item =>item+'=?').toString();
                dados.push(req.params.id);
                let sql = `UPDATE ${req.params.tabela} SET ${parametros} WHERE ${pk}=?;`;
                let resbd = (await executarQuery(sql, dados));
                res.json(resbd[0]).status(200);
            } catch (error) {
                let erro = {
                    message:`A rota ${req.params.tabela} não foi encontrada.`,
                    status:'400',
                    erro:error
                };
                res.json(erro).status(200);
            }
        });
        
        this.app.delete('/:tabela/:id', async(req, res)=>{
            try{
                let campos = (await obterCampos(req.params.tabela));
                let sql :string;
                sql = `DELETE FROM ${req.params.tabela} WHERE id=${campos[0]} =?`
                let resbd = (await executarQuery(sql, [parseInt(req.params.id)]));
                res.json(resbd[0]).status(200);
            }catch (error) {
                let erro = {
                    message:`A rota ${req.params.tabela} não foi encontrada.`,
                    status:'400',
                    erro:error
                };
                res.json(erro).status(200);
            }
        });
        
 
        this.app.use((req, res)=>res.sendFile(`${this.baseDir}/404.html`)); //essa página sempre ficará por último
    }
    public start():void{
        this.app.listen(this.port, ()=>console.log(`Servidor rodando em: http://localhost:${this.port}`))
    }
}

//instância da classe
const server: Server = new Server()

//invocação do método start
server.start();