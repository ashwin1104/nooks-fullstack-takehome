import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField } from "@mui/material";

const CreateSession: React.FC = () => {
  const navigate = useNavigate();
  const [newUrl, setNewUrl] = useState("");

  const validateYoutubeLink = async (link:string) => {
    if (!link) // TODO: better validation
    {
        return false
    }
    return true
  } 

  const createSession = async () => {
    if (!validateYoutubeLink(newUrl))
    {
        // TODO: logging
        return
    }

    const youtubeLink = newUrl
    setNewUrl("");

    const response = await fetch('http://localhost:9000/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ youtubeLink }),
      });
    const responseJson = await response.json();
    if (!responseJson.success || !responseJson.result)
    {
        console.log(`Failed to create session.`)
        return
    }
    navigate(`/watch/${responseJson.result.sessionId}`);
  };

  return (
    <Box width="100%" maxWidth={600} display="flex" gap={1} marginTop={1}>
      <TextField
        label="Youtube URL"
        variant="outlined"
        value={newUrl}
        onChange={(e) => setNewUrl(e.target.value)}
        fullWidth
      />
      <Button
        disabled={!newUrl}
        onClick={createSession}
        size="small"
        variant="contained"
      >
        Create a session
      </Button>
    </Box>
  );
};

export default CreateSession;
