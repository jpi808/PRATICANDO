// importa o modúlo natido HTTP do Node.js
const http = require('http');

//criamos u, array/vetor para simular o banco de dados (persistencia de memorias)
let livros = [
    {
        id:1,
        titulo: 'o pequeno Principe',
        autor: 'Antoine ded saint-Exipéry'
    }
];

const server = http.createServer((req, res)=> {
    // capturamos o método (GET, POST, PUT, DELETE, Etc)
    const metodo = req.method;
    // captura a URL da requisição (rotas)
    const url = req.url;
    //Define que a resposta será em JSON
    res.setHeader('Content-Type','application/json');

    //get -> LISTAR LIVROS
    if(url==='/livros' && metodo ==='GET'){
    //status 200 = OK/sucesso
        res.statusCode =200;
    //retornamos a lista de livros em formato JSON 
        res.end(JSON.stringify(livros));
        //encerra a execução da requisição
        return;
    }
    
// POST -> CRIAR LIVRO
if(url==='/livros' && metodo ==='POST'){
    // variavel para armazenar os dados vindos do body
    let body ='';
    //evento disparado quando chegam os 'pedaços' da requisição
    req.on('data', parte =>{
        body += parte //concatena os pedaços
    });
    //evento disparado quando todos os 'pedaços' chegarem.
    req.on('end', () => {
        //converte o JSON recebido em objeto javascript
        const novoLivro = JSON.parse(body);
        //adiciona o novo livro ao array livros
        livros.push(novoLivro);
        //status 201 = criado com sucesso
        res.statusCode = 201;
        //retorna mensagem final + objeto criado
        res.end(JSON.stringify({
            mensagem:'Livro cadastrado com sucesso',
            livro: novoLivro
        }))
    })
    return;
}
//PUT -> ATUALIZAR LIVRO
if (url ==='/livros' && metodo === 'PUT'){
    let body ='';
    req.on('data', parte =>{
        body += parte;
    });
    req.on('end', ()=> {
        const livroatualizado = JSON.parse(body);
        livros = livros.map(livro =>{
            if(livro.id === livroatualizado.id){
                return livroatualizado;
            }
            return livro;
        });
        res.statusCode= 200;
        res.end(JSON.stringify({
            mensagem: 'livro atualizado com sucesso!',
            livros:livros
        }));
    });
    return;
}
// DELETE- > remover livro
if(url==='/livros'&&metodo==='DELETE'){
    let body = '';
    req.on('data', parte => {
        body += parte;
    });
    req.on('end', () =>{
        // recebe o ID do livro a ser excluido
        const dados = JSON.parse(body);
        //filtra o array removendo o livro com ID igual ao informado
        livros = livros.filter(livro => livro.id !== dados.id);
        res.statusCode = 200;
        res.end(JSON.stringify({
            mensagem: 'livro removido com sucesso',
            livros:livros
        }))
    })
}
//ROTA NÃO ENCONTRADA
res.statusCode = 404;
res.end(JSON.stringify({
    mensagem: 'Rota não encontrada'
}))


});
server.listen(3000,()=>{
    console.log('http://localhost:3000')
})
