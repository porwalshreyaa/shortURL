const express = require("express")

const { connectToMongoDB } = require('./connect')
const app = express();

const URL = require("./models/url")
const path = require("path")
const cookieParser = require('cookie-parser')
const {restrictToLoggedinUserOnly, checkAuth} = require('./middlewares/auth')
require('dotenv').config()

const urlRoute = require('./routes/url')
const staticRoute = require('./routes/staticRouter')
const userRoute = require('./routes/user')

connectToMongoDB(process.env.DATABASE)
    .then(() => console.log("MongoDb connected"))
    .catch((err) => console.log("MongoDB Error:", err))

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"))

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use('/url', restrictToLoggedinUserOnly, urlRoute);
app.use('/user', userRoute);
app.use('/', checkAuth, staticRoute);

app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({ shortId }, {
        $push: {
            visitHistory: { timestamp: Date.now() },
        },
    });
    res.redirect(entry.redirectURL);
})

app.listen(process.env.PORT, () => console.log(`Server running at http://localhost:${process.env.PORT}`));