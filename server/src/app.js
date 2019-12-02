import { PORT } from './env'

import https from 'https'
import fs from 'fs'
import path from 'path'
import express from 'express'
import bodyParser from 'body-parser'
import * as db from './db'

const app = express()
var dados = {
	valor: 12,
	nivel: 'baixo'
};

const opcoes = {
    key: fs.readFileSync(path.resolve(__dirname, '../certs/server_private_key.pem')),
    cert: fs.readFileSync(path.resolve(__dirname, '../certs/server_crt.pem')),
    ca: fs.readFileSync(path.resolve(__dirname, '../certs/cert_crt.pem'))
}


app.use(bodyParser.json())

app.use(express.static(path.resolve(__dirname, '../public')))

app.get('/connect', (req, res) => db.connect(res))

app.get('/', (req, res) => {
	console.log('oi')
	res.end('<p> OI </p>')

})

app.get('/disconnect', (req, res) => db.disconnect(res))

app.get('/dados', (req, res) => {
	try {
		if(dados != undefined)
			res.send(dados)
	} catch(err) {
		return res.status(400).send({error: 'erro ao mostrar dado' })

	}
})

app.post('/dado', (req,res) => {
	try {
		var dado = {
			valor: req.body.valor,
			nivel: req.body.nivel
		}
		console.log(req)
		dados = dado;
		return res.status(200).send({success: 'sucesso!'})
	} catch(err) {
		return res.status(400).send({error: 'erro ao inserir dado' })

	}
})

const server = https.createServer(opcoes, app)

server.listen(PORT, () => console.log(`No ar, porta ${PORT}...`))
