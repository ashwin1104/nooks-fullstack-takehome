## Nooks Watch Party Project

Super fun to build!

### Local Dev Setup

Make sure you have `git` and `npm` installed.

1. Clone the repository
2. In the root directory of the repository, install dependencies with `npm i`
3. Run the server with `npm run dev`, or install `nodemon` as a dev dependency and run the server with auto-update functionality using `nodemon run dev`
4. In a separate terminal, start the client with `npm start`
5. Head over to `localhost:3000` and create a session. If you have a valid `sessionId`, you may join an existing session at `localhost:3000/watch/:sessionId`

### Status for Required Functionality

- [ x ] **Creating a session**. Any user should be able to create a session to watch a given Youtube video.
- [ x ] **Joining a session**. Any user should be able to join a session created by another user using the shareable session link.
- [ x ] **Playing/pausing** the video. When a participant pauses the video, it should pause for everyone. When a participant plays the video, it should start playing for everyone.
- [ x ] **“Seek”**. When someone jumps to a certain time in the video it should jump to that time for everyone.
- [ x ] **Late to the party**... Everything should stay synced even if a user joins the watch party late (e.g. the video is already playing)
- [ x ] **Player controls.** All the player controls (e.g. play, pause, and seek) should be intuitive and behave as expected. For play, pause & seek operations you can use the built-in YouTube controls or disable the YouTube controls and build your own UI (including a slider for the seek operation)

### Bonus Functionality

- [ x ] **Realtime** **Switching**. When a session user switches the session to a different youtube video, it will update for everyone.

### Next Steps Towards Preventing Issues That May Be Encountered in Real-World Usage

This solution can be improved upon in many ways:
- Concurrency calibration to minimize differences between video timestamps of all users in a session, over extended periods of time. Think distributed systems protocols.
- Upon joining an existing session, retrieving timestamp info from session users and joining in at the timestamp that minimizes the issue of being too ahead of/behind the group. Currently, it joins in at the last recorded time in the DB, which can be off if there's been no user action for some time. Did not get to this because of time.
- Handling video seeking with arrow-keys. Currently, using arrow-keys to seek will break synchronization across users in a given session.
- Error-handling with socket functionality on server and client sides.
- Rate-limiting to prevent overloading socket.io connections.
- Validating inputs to API call and POST endpoint.
- Validating inputs to socket events.
- General logging for more visibility.
- Formatting and stylistic choices
- Documentation