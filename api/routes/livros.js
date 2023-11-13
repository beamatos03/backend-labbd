/* API REST dos livros */
import express from 'express'
import { connectToDatabase } from '../utils/mongodb.js'
import {check, validationResult} from 'express-validator'

const router = express.Router()
const {db, ObjectId} = await connectToDatabase()
const nomeCollection = 'livros'


const validaLivro = [
    check('titulo')
    .not().isEmpty().trim().withMessage('É obrigatório informar o titulo!')
    .isLength({min:2}).withMessage('O titulo deve conter ao menos 2 caracteres')
    .isLength({max:200}).withMessage('A razão é muito longa.'),
    check('paginas').not().isEmpty().trim().withMessage('Por favor informe o número de páginas contidas')
    .isNumeric().withMessage('Por favor informe o número de páginas')
]

/**
 * GET /api/livros
 * Lista todos os livros
 */
router.get('/', async(req, res) => {
    try{
        db.collection(nomeCollection).find().sort({titulo: 1}).toArray((err, docs) => {
            if(!err){
                res.status(200).json(docs)
            }
        })

    } catch(err){
        res.status(500).json({
            errors: [{
                value: `${err.message}`,
                msg: 'Erro ao obter a listagem dos livros',
                param:'/'
            }]
        })
    }
})

/**
 * GET /api/livros/id/:id
 * Lista todos os livros
 */
router.get('/id/:id', async(req, res) => {
    try{
        db.collection(nomeCollection).find({'_id': {$eq: ObjectId(req.params.id)}}).toArray((err,docs) => {
            if(err){
                res.status(400).json(err)
            } else {
                res.status(200).json(docs)
            }
        })
    } catch (err){
        res.status(500).json({"error": err.message})
    }
})

/**
 * DELETE /api/livros/:id
 * Apaga o livro pelo id
 */
router.delete('/:id', async(req, res) => {
    await db.collection(nomeCollection).deleteOne({"_id": {$eq: ObjectId(req.params.id)}}).then(result => res.status(200).send(result)).catch(err => res.status(400).json(err))
}) 


/**
 * POST /api/livros/
 * Insere um novo livro
 */
router.post('/', validaLivro, async(req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json(({
            errors: errors.array()
        }))
    } else{
        await db.collection(nomeCollection)
        .insertOne(req.body)
        .then(result => res.status(200).send(result))
        .catch(err =>res.status(400).json(err))
    }
})


/**
 * PUT /api/livros/
 * Altera um livro
 */
router.put('/', validaLivro, async(req, res) => {
    let idDocumento = req.body._id //armazenanondo o id do item
    delete req.body._id //iremos remover oid do body
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json(({
            errors: errors.array()
        }))
    } else{
        await db.collection(nomeCollection)
        .updateOne({'_id':{$eq : ObjectId(idDocumento)}},
            {$set: req.body})
        .then(result => res.status(200).send(result))
        .catch(err =>res.status(400).json(err))
    }
})

/**

 
GET /api/livros/data

 
Lista todos os livros publicados em  2022 com o numero de paginas entre 100 e 360

 */
router.get('/data', async (req, res) => {
    try {
        db.collection(nomeCollection).find({ $and:[
            {'paginas': { $gte: 350, $lte: 500}}, // Filtrar por paginas menores que 500 e maiores que 360
            {'data-publicacao': /2022$/i}
        ]

        }).toArray((err, docs) => {
            if (err) {
                res.status(400).json(err);
            } else {
                res.status(200).json(docs);
            }
        });
    } catch (err) {
        res.status(500).json({ "error": err.message });
    }
});

export default router 