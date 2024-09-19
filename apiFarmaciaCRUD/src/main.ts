import express, { Express } from "express";
import path from "path";
import CreateConnection from './bd';
import { createConnection } from 'mysql2';
import { error } from "console";

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
        this.app.post('/fornecedores', (req, res)=>{
            let dados :any[] = Object.values(req.body).map((val) => val); // Criando uma array com dados do formulário
            let sql :string = `INSERT INTO farmacia.fornecedores (cnpj, nome, telefone, contato) VALUES (?,?,?,?)`
            try{
                this.con.query(sql, dados,(err :Error, resbd :any)=>{err?res.json(err):res.json(resbd)}); // resposta do banco de dados
   
            }catch(error){
                res.json(error);
            }
        });
        this.app.get('/fornecedores/:id?', (req, res)=>{
            let sql : string;
            sql = `SELECT * FROM fornecedores`;
            sql = req.params.id?sql+ ` WHERE id=${req.params.id}`:sql;
            try{
                this.con.query(sql,(err :Error, resbd :any)=>{err?res.json(err):res.json(resbd);})
            }catch(error){
                console.log(error);
            }
            
        });
        this.app.put('/fornecedores/:id', (req, res)=>{
            let dados :any[] = Object.values(req.body).map((val) => val);
            dados.push(req.params.id)
            let sql :string
            sql = `UPDATE farmacia.fornecedores SET cnpj=?, nome=?, telefone=?, contato=? WHERE id=?;`
            try{
                this.con.query(sql,dados,(err :Error, resbd :any)=>{err?res.json(err):res.json(resbd);})
            }catch(error){
                console.log(error);
            };
            
        });
        this.app.delete('/fornecedores/:id', (req, res)=>{
            let sql :string;
            sql = `DELETE FROM fornecedores WHERE id=${req.params.id}`
            this.con.query(sql,(err :Error, resbd :any)=>{err?res.json(err):res.json(resbd);})
            
        });
        
        // ROTAS PRODUTOS
        this.app.post('/produtos',(req,res)=>{
            let dados :any[] = Object.values(req.body).map((val) => val); // Criando uma array com dados do formulário
            let sql :string = `INSERT INTO farmacia.produtos (id_fornecedor,cod_barras, nome, preco) VALUES (?,?,?,?)`
            try{
                this.con.query(sql, dados,(err :Error, resbd :any)=>{err?res.json(err):res.json(resbd)}); // resposta do banco de dados
                
            }catch(error){
                res.json(error);
            }
        })
        this.app.get('/produtos/:id?', (req, res)=>{
            let sql : string;
            sql = `SELECT * FROM produtos`;
            sql = req.params.id?sql+ ` WHERE id=${req.params.id}`:sql;
            try{
                this.con.query(sql,(err :Error, resbd :any)=>{err?res.json(err):res.json(resbd);})
            }catch(error){
                console.log(error);
            }
            
        });
        this.app.put('/produtos/:id', (req, res)=>{
            let dados :any[] = Object.values(req.body).map((val) => val);
            dados.push(req.params.id)
            let sql :string
            sql = `UPDATE farmacia.produtos SET cod_barras=?, nome=?, preco=? WHERE id=?;`
            this.con.query(sql,dados,(err :Error, resbd :any)=>{err?res.json(err):res.json(resbd);})
            
        });
        this.app.delete('/produtos/:id', (req, res)=>{
            let sql :string;
            sql = `DELETE FROM produtos WHERE id=${req.params.id}`
            this.con.query(sql,(err :Error, resbd :any)=>{err?res.json(err):res.json(resbd);})
            
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