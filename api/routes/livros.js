/* API REST dos livros */
import express from 'express'
import { connectToDatabase } from '../utils/mongodb.js'

const router = express.Router()
const {db, ObjectId} = await connectToDatabase()
const nomeCollection = 'livros'

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

export default router 