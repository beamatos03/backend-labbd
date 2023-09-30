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
        db.collection(nomeCollection).find().sort({titulo: 1}).toArray((err, docs) =>{
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

export default router 