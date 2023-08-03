import { useEffect, useState } from "react";
import VideoPlayer from "../components/VideoPlayer";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, TextField, Tooltip } from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import { io } from "socket.io-client";

const WatchSession: React.FC = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [youtubeLink, setYoutubeLink] = useState<string | null>(null);
  const [newUrl, setNewUrl] = useState<string | null>(null);
  const [timestamp, setTimestamp] = useState<number | 0>(0);
  const [isPlaying, setIsPlaying] = useState<boolean | false>(false);

  const [linkCopied, setLinkCopied] = useState(false);
  const [socket, setSocket] = useState<any | null>(null)

  useEffect(() => {
    const onConnect = (socketId:string) =>
    {
        console.log(`${socketId} connected!`);
        newSocket.emit("join", { sessionId })
    }
    const onDisconnect = (socketId:string) =>
    {
        console.log(`${socketId} disconnected.`)
    }
    const onState = (state: {youtubeLink: string, isPlaying: boolean, timestamp: number}) =>
    {
        if (!state)
        {
            console.log(`Session with sessionId ${sessionId} does not exist or has expired. Redirecting...`)
            navigate("/create")
            return
        }
        setYoutubeLink(state.youtubeLink)
        setIsPlaying(state.isPlaying);
        setTimestamp(state.timestamp);
    }
    const onPlayPause = (state: {isPlaying: boolean}) =>
    {
        setIsPlaying(state.isPlaying);
    }
    const onSeek = (state: {timestamp: number}) =>
    {
        setTimestamp(state.timestamp);
    }
    const onLink = (state: {youtubeLink: string}) =>
    {
        setYoutubeLink(state.youtubeLink);
    }

    const newSocket = io("http://localhost:9000") // TODO: keep backend URL in .env
    setSocket(newSocket)
    
    newSocket.on("connect", () => onConnect(newSocket.id))
    newSocket.on("disconnect", () => onDisconnect(newSocket.id))
    newSocket.on("state", onState)
    newSocket.on('playState', onPlayPause);
    newSocket.on('timeState', onSeek)
    newSocket.on('linkState', onLink)
    return () => {
        socket.off('connect', onConnect);
        socket.off('disconnect', onDisconnect);
        socket.off("state", onState)
        socket.off('playState', onPlayPause);
        socket.off('timeState', onSeek)
        socket.off('linkState', onLink)
    }
  }, []);

  const seek = (time:number) => {
    setTimestamp(time)
    socket.emit("seek", { sessionId, timestamp: time})
  }

  const playPause = (play:boolean, time:number) => {
    setIsPlaying(play)
    socket.emit("playPause", { sessionId, isPlaying: play, timestamp: time})
  }
  
  const switchYoutubeLink = () => {
    socket.emit("switchLink", { sessionId, youtubeLink: newUrl})
    setYoutubeLink(newUrl)
    setNewUrl("")
  }

  if (!!youtubeLink) {
    return (
      <>
        <Box
          width="100%"
          maxWidth={1000}
          display="flex"
          gap={1}
          marginTop={1}
          alignItems="center"
        >
          <TextField
            label="Current Youtube URL"
            variant="outlined"
            value={youtubeLink}
            inputProps={{
              readOnly: false,
              disabled: false,
            }}
            fullWidth
          />
          <Tooltip title={linkCopied ? "Link copied" : "Copy link to share"}>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setLinkCopied(true);
                setTimeout(() => setLinkCopied(false), 2000);
              }}
              disabled={linkCopied}
              variant="contained"
              sx={{ whiteSpace: "nowrap", minWidth: "max-content" }}
            >
              <LinkIcon />
            </Button>
          </Tooltip>
          <TextField
            label="New Youtube URL"
            variant="outlined"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            fullWidth
          />
          <Button
            disabled={!newUrl}
            onClick={switchYoutubeLink}
            size="small"
            variant="contained"
          >
            Switch to New Video
          </Button>
        </Box>
        <VideoPlayer url={youtubeLink} playPause={playPause} seek={seek} isPlaying={isPlaying} timestamp={timestamp} />;
      </>
    );
  }

  return null;
};

export default WatchSession;
