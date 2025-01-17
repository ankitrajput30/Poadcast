import React, { useContext } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { closePlayer, openPlayer } from "../redux/audioplayerSlice";
import { addView } from "../api";
import { openSnackbar } from "../redux/snackbarSlice";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import { Button, Stack } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { deleteEpisode } from "../api/index.js";
import { context } from "../context/ContextProvider.jsx";
// import DeleteIcon from '@mui/icons-material/Delete';  // Material UI icon

const Card = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  align-items: center;
  padding: 20px 30px;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.card};
  &:hover {
    transform: translateY(-8px);
    transition: all 0.4s ease-in-out;
    box-shadow: 0 0 18px 0 rgba(0, 0, 0, 0.3);
    filter: brightness(1.3);
  }
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Image = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.text_secondary};
  object-fit: cover;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: 800;
  color: ${({ theme }) => theme.text_primary};
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const Description = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_secondary};
`;
const ImageContainer = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
`;

const Episodecard = ({ episode, podid, user, type, index }) => {
  const dispatch = useDispatch();
  const { setLoadData } = useContext(context);
  // console.log()

  const addviewtToPodcast = async () => {
    await addView(podid._id).catch((err) => {
      dispatch(
        openSnackbar({
          message: err.message,
          type: "error",
        })
      );
    });
  };

  const token = localStorage.getItem("token");

  const handleDelete = async (id, token) => {
    try {
      const res = await deleteEpisode(id, token); // Await the API call properly
      console.log("Delete response:", res);

      // Correctly checking for success response
      if (res.data && res.status === 200) {
        setLoadData(true);
        dispatch(
          openSnackbar({
            message: "Episode deleted successfully",
            type: "success",
          })
        );
      } else {
        dispatch(
          openSnackbar({
            message: res.data?.message || "Failed to delete episode",
            type: "error",
          })
        );
      }
    } catch (error) {
      console.error("Error deleting episode:", error);
      dispatch(
        openSnackbar({
          message: error.response?.data?.message || "Error deleting episode",
          type: "error",
        })
      );
    }
  };

  return (
    <Card>
      <ImageContainer
        // sx={{cursor:"pointer"}}
        onClick={async () => {
          await addviewtToPodcast();
          if (type === "audio") {
            //open audio player
            dispatch(
              openPlayer({
                type: "audio",
                episode: episode,
                podid: podid,
                index: index,
                currenttime: 0,
              })
            );
          } else {
            //open video player
            dispatch(
              dispatch(
                openPlayer({
                  type: "video",
                  episode: episode,
                  podid: podid,
                  index: index,
                  currenttime: 0,
                })
              )
            );
          }
        }}
      >
        <Image style={{ cursor: "pointer" }} src={podid?.thumbnail} />
        <PlayCircleOutlineIcon
          style={{
            position: "absolute",
            top: "26px",
            left: "26px",
            color: "white",
            width: "50px",
            height: "50px",
          }}
        />
      </ImageContainer>
      <Details>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <div>
            <Title>{episode.name}</Title>
            <Description>{episode.desc}</Description>
          </div>

          <Button
            variant="outlined"
            color="secondary"
            startIcon={<DeleteForeverIcon />}
            onClick={() => handleDelete(episode._id, token)}
            className="delete-button"
          >
            Delete
          </Button>
        </Stack>
      </Details>
    </Card>
  );
};

export default Episodecard;
