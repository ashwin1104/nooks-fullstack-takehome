import { Box, Slider } from "@mui/material";
import React, { useRef, useState, useEffect } from "react";
import YouTube from "react-youtube"; 

interface VideoPlayerProps {
  url: string;
  hideControls?: boolean;
  playPause: (play: boolean, time:number) => void;
  seek: (time: number) => void;
  isPlaying: boolean;
  timestamp: number;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, playPause, seek, isPlaying, timestamp }) => {
  const [duration, setDuration] = useState<number | 0>(0);
  const [tempTime, setTempTime] = useState<number | 0>(0);

  const player = useRef<any>(null);

  const handleReady = async () => {
    const lengthOfVideo = await player.current?.internalPlayer.getDuration()
    if (player.current)
    {
        player.current.internalPlayer.seekTo(timestamp, true)
        setTimeout(() => {
            player.current.internalPlayer.pauseVideo();
            handlePause();
        }, 1500) // TODO: timeout is hardcoded for now. goal: if others are paused and someone new joins, the video should not automatically unpause for everyone. ideally, find a way to pause right after buffering finishes. 
    }
    setDuration(lengthOfVideo)
    setTempTime(timestamp)
  };

  useEffect(() => {
    const timer = setInterval(async () => {
        const newTime = await player.current.internalPlayer.getCurrentTime();
        setTempTime(newTime)
    }, 1000);

    return () => {
        clearInterval(timer)
    }
  }, [])


  useEffect(() => {
    if (tempTime > 0)
    {
        setTempTime(timestamp)
        player.current.internalPlayer.seekTo(timestamp)
    }
  }, [timestamp])

  useEffect(() => {
    if (isPlaying)
    {
        player.current?.internalPlayer.playVideo();
    }
    else {
        player.current?.internalPlayer.pauseVideo();
    }
  }, [isPlaying])

  const handleEnd = () => {
    console.log("Video ended");
  };

  const handlePlay = async () => {
        const time = await player.current?.internalPlayer.getCurrentTime()
        playPause(true, time)
  };

  const handlePause = async () => {
        const time = await player.current?.internalPlayer.getCurrentTime()
        playPause(false, time)
  };

const handleSeek = (event:Event, newValue: number | number[]) => {
    seek(((newValue as number)/100)*duration) // TODO: magic number
}

  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      <Box
        width="100%"
        height="100%"
        display="flex"
        flexDirection="column"
      >
        <YouTube
            ref={player}
            videoId={url.substr(17)} // TODO: hardcoded
            onReady={handleReady}
            onPlay={handlePlay}
            onPause={handlePause}
            onEnd={handleEnd}
            opts={{
                height: "400%", // TODO: this works for my browser but super arbitrary
                width: "100%",
                playerVars: {
                    autoplay: 0,
                    controls: 0,
                },
            }}
        />
      </Box>
      <Slider aria-label="Seeker" value={100*(tempTime/duration)} onChange={handleSeek} // TODO: magic number
      /> 
    </Box>
  );
};

export default VideoPlayer;
