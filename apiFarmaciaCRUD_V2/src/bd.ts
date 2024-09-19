import mysql from 'mysql2';

interface DataBaseConfig{
    host :string;
    user :string;
    password :string;
    database :string;
} 

const CreateConnection = () :mysql.Pool =>{
    const config: DataBaseConfig = {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'farmacia'
    };

    // retorno de mensagem de conexão
    let pool = mysql.createPool(config);
    pool.getConnection((err,con)=>{
        let mensagem = err? `Erro de conexão ${err}`: `Conexão bem sucedida!`;
        console.log(mensagem);
    });
    return pool;
};

export default CreateConnection;
