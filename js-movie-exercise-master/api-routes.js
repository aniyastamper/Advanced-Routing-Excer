
const router = require('express').Router()
const { MongoClient, ObjectId } = require('mongodb')

const url = process.env.MONGODB_URL || require('./secrets/mongodb.json').url /*May need to change URI to URL */
const client = new MongoClient(url)

const getCollection = async (dbName, collectionName) => {
	await client.connect()
	return client.db(dbName).collection(collectionName)
}

module.exports = {getCollection, ObjectId}
// todo: add your endpoints here

router.get('/movies', async (request,response) =>{
	const collection = await getCollection('movie-api','movies')
	const movies = await collection.find({}).toArray()
	response.json(movies)
})

router.get('/movies/:id', async (request,response)=>{
	const { id } = request.params
	const collection = await getCollection('movie-api','movies')
	const movie = await collection.findOne({"_id": new ObjectId(id)})
	response.json(movie)
})

router.post('/movies', async (request, response) =>{
	const {body} = request
	const {title, year, director, genre} = body
	const movie = {title, year, director, genre}

	const collection = await getCollection('movie-api','movies')
	const result = await collection.insertOne(movie)
	response.send(result)
})

/*Want to Update a Movie? or Object */
router.put('/movies/:id', async (request, response) =>{
	const { body, params } = request   /*when updating we need the body and the params for the object per its id  */
	const { id } = params
	const { title, year, director, genre } = body
	const movie = { title, year, director, genre } 

	const collection = await getCollection('movie-api', 'movies')
	const result = collection.updateOne({ _id: new ObjectId(id) }, { $set: movie })
	response.send(result)
})

router.delete('/movies/:id',async (request,response) => {
	const { id } = request.params 

	const collection = await getCollection('movie-api', 'movies')
	const result = await collection.deleteOne({ _id: new ObjectId(id) })
	response.send(result)
})

module.exports = router