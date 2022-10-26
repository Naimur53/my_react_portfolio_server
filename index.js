const express = require('express')
const app = express()
const cors = require('cors');
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary').v2;

const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;
require('dotenv').config();
const corsOptions = {
    origin: '*',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200,
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

// default
const nodemailer = require("nodemailer");
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure: true
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.icikx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const uuid = function () {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

async function run() {
    try {
        await client.connect();
        const database = client.db('portfolio');
        const bestProjects = database.collection('best_projects');
        const review = database.collection('reviews');
        const showCase = database.collection('showCases');
        app.get('/bestprojects', async (req, res) => {
            const result = await bestProjects.find({}).toArray();
            console.log(result);
            res.json(result)
        })
        app.post('/bestprojects', async (req, res) => {
            console.log('adding', req.body);
            const result = await bestProjects.insertOne(req.body);
            console.log(result);
            res.json(result)
        })
        app.put('/bestprojects/:id', async (req, res) => {
            console.log(req.body);
            console.log(req.params.id);
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const doc = { $set: req.body }
            const options = { upsert: true };
            const result = await bestProjects.updateOne(filter, doc, options);
            console.log(result);
            res.json(result)

        })
        app.delete('/bestprojects/:id', async (req, res) => {
            console.log(req.body);
            console.log(req.params.id);
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await bestProjects.deleteOne(filter);
            console.log(result);
            res.json(result)

        })

        app.get('/allReview', async (req, res) => {
            const response = review.find({});
            const result = await response.toArray()
            res.json(result)
        })
        app.get('/allReviewShow', async (req, res) => {
            const response = review.find({ show: true });
            const result = await response.toArray()
            res.json(result)
        })
        app.post('/addReview', async (req, res) => {
            const data = req.body;
            data.show = false;
            console.log('adding', data);
            const result = await review.insertOne(req.body);
            console.log(result);
            res.json(result)
        })
        app.put('/reviewUpdateShow/:id', async (req, res) => {
            const { value } = req.body;
            const { id } = req.params;
            try {

                const filter = { _id: ObjectId(id) };
                const doc = { $set: { show: value } }
                const options = { upsert: true };
                const result = await review.updateOne(filter, doc, options);
                console.log(result, id)
                res.json(result)
            }
            catch (err) {
                res.status(400).json({ error: 'bad req' })
            }
        })
        app.delete('/reviewUpdateShow/:id', async (req, res) => {
            const { id } = req.params;
            try {

                const filter = { _id: ObjectId(id) };
                const result = await review.deleteOne(filter);
                console.log(result, id)
                res.json(result)
            }
            catch (err) {
                res.status(400).json({ error: 'bad req' })
            }
        })

        app.get('/allShowcase', async (req, res) => {

            const result = await showCase.find({}).toArray();
            console.log(result);
            res.json(result)
        })
        app.post('/addShowcase', async (req, res) => {

            console.log('adding', data);
            const result = await showCase.insertOne(req.body);
            console.log(result);
            res.json(result)
        })
        app.delete('/addShowcase/:id', async (req, res) => {
            const { id } = req.params;
            try {
                const filter = { _id: ObjectId(id) };
                const result = await showCase.deleteOne(filter);
                res.json(result)
            }
            catch (err) {
                res.status(400).json({ error: 'bad req' })
            }
        })
        app.post('/uploadImage', async (req, res) => {
            try {
                const { file } = req?.files;

                // console.log(file, 'get the fiel', uuid());
                if (file) {

                    await cloudinary.uploader.upload(file.tempFilePath,
                        {
                            resource_type: "image", public_id: "myfolder/images/" + file?.name.split('.')[0] + uuid(),
                            overwrite: true,
                        },
                        function (error, result) {
                            if (result) {

                                res.json({ url: result.url })
                            }
                            if (error) {
                                res.status(400).json({ error })


                            }
                            console.log({ result, error })
                        });
                }
            }
            catch (e) {
                console.log(e)
                res.status(400).json({ error: 'could not upload image' })
            }
        })

        app.post('/sendMail', async (req, res) => {

            try {
                const { user_name, user_email, profession, review } = req.body;
                console.log({ user_name, user_email, profession, review });
                const subject = `${user_name} ${profession} has send a review `
                // create reusable transporter object using the default SMTP transport
                const transport = await nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: "naimurrhman53@gmail.com",
                        pass: process.env.USER_PASS
                    }
                });
                // send mail with defined transport object
                const mailOptions = {
                    from: user_email,
                    to: 'naimurrhman53@gmail.com',
                    subject: subject,
                    text: review
                }
                await transport.sendMail(mailOptions, function (error, response) {
                    if (error) {

                        res.status(400).json({ res: 'error' })
                    } else {
                        res.send("Email has been sent successfully");
                        console.log('mail sent');
                        res.json({ res: 'success' })
                    }
                })
            } catch (err) {

                res.status(400).json({ res: 'error' })
            }

        })




    }
    finally {
        // await client.close(); 


    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running server')
})

app.listen(port, () => {
    console.log(`listening at ${port}`)
})

