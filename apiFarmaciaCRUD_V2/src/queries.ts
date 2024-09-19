import CreateConnection from './bd';
const con = CreateConnection();
export const obterCampos = async (tabela :string) :Promise<string[]> =>{
    let sql = `DESCRIBE ${tabela}`;
    let resbd :any[] = [] = await con.promise().query(sql);
    let campos :string[] = resbd[0].map((c :any)=>c.Field);
    return campos    
}
export const executarQuery = async (sql :string, dados:any[]=[]) :Promise<any[]>=>{
    let resbd :any[] = [] = await con.promise().query(sql, dados);
    return resbd
}
