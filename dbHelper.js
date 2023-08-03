const { Session } = require("./sessionModel");

const updateYoutubeLink = async (sessionId, youtubeLink) => {
    const session = await Session.findById(sessionId)
    session.youtubeLink = youtubeLink
    const updatedSession = await session.save()
    return updatedSession
}

const updatePlayPause = async (sessionId, isPlaying, timestamp) => {
    const session = await Session.findById(sessionId)
    session.isPlaying = isPlaying
    session.timestamp = timestamp
    const updatedSession = await session.save()
    return updatedSession
}

const updateTimestamp = async (sessionId, timestamp) => {
    const session = await Session.findById(sessionId)
    session.timestamp = timestamp
    const updatedSession = await session.save()
    return updatedSession
}

const getSession = async (sessionId) => {
    const session = await Session.findById(sessionId)
    return session
}

module.exports = {
    updateYoutubeLink,
    updatePlayPause,
    updateTimestamp,
    getSession
}