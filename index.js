const express = require("express")
const app = express()
const server = require("http").createServer(app)
const cors = require("cors")
const mongoose = require("mongoose");
const { Session } = require("./sessionModel")
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

const { updateYoutubeLink, updatePlayPause, updateTimestamp, getSession} = require("./dbHelper")
const { errorHandler, errorWrap } = require("./middleware")

const API_PORT = 9000; // TODO: keep in .env
const MONGO_URI = "mongodb+srv://dev:test@nooks.uhslfuh.mongodb.net/?retryWrites=true&w=majority" // TODO: keep in .env

app.use(express.json())
app.use(cors())
app.use(errorHandler);

const connectToDatabase = async () => {
    mongoose.set("strictQuery",false)
    await mongoose.connect(MONGO_URI);
    console.log("Connected to the database!");
}

connectToDatabase()

io.on("connection", socket => {
    console.log(`Socket connection ID: ${socket.id}`)
    socket.on("join", async ({ sessionId }) => {
        socket.join(sessionId)
        const state = await getSession(sessionId)
        io.to(socket.id).emit("state", state);
    });
    socket.on("switchLink", async ({ sessionId, youtubeLink }) => {
        const state = await updateYoutubeLink(sessionId, youtubeLink)
        io.to(sessionId).emit("linkState", state)
    })
    socket.on("playPause", async ({ sessionId, isPlaying, timestamp }) => {
        const state = await updatePlayPause(sessionId, isPlaying, timestamp)
        io.to(sessionId).emit("playState", state)
    })
    socket.on("seek", async ({ sessionId, timestamp }) => {
        const state = await updateTimestamp(sessionId, timestamp)
        io.to(sessionId).emit("timeState", state)
    })
})

app.post(
    "/", 
    errorWrap( async (req, res) => {
        const { youtubeLink } = req.body
        const session = await Session.create({
            youtubeLink
        })
        res.status(200).json({
            success: true,
            message: "Successfully created new session!",
            result: { sessionId: session._id }
        })
    }),
)

server.listen(API_PORT, () => {
    console.log(`Server running on port ${API_PORT}!`)
})