import express from 'express'
import cors from 'cors'

const app = express()
const port = 4000

// import das rotas da app
import rotasLivros from './routes/livros.js'
import rotasUsuarios from './routes/usuario.js'


app.use(cors({
    origin: ['http/127.0.0.1:5500', 'http://localhost:400']
}))

//app.use(express.urlencoded({ extended: true}))
app.use(express.json()) // parse de arquivos JSON

// Rotas de conteúdo público
app.use('/', express.static('public'))

// Configura o favicon
app.use('/favicon.ico', express.static('public/images/computador.png'))

// Rotas da API
app.use('/api/livros', rotasLivros)
app.use('/api/usuarios', rotasUsuarios)

app.get('/api', (req, res) => {
    res.status(200).json({
        message: 'API 100% Funcional',
        version: '1.0.1'
    })
})

// Rotas de Exceção 
app.use(function (req, res){
    res.status(404).json({
        errors: [{
            value: `${req.originalUrl}`,
            msg: `A rota ${req.originalUrl} não existe nesta API`,
            param: 'invalid route'
        }]
    })
})

app.listen(port, function(){
    console.log(`🗄 Servidor rodando na porta ${port}`)
})

