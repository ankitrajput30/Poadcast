import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPodcastByCategory, getMostPopularPodcast,deleteEpisode } from "../api/index.js";
import styled from "styled-components";
import { PodcastCard } from "../components/PodcastCard.jsx";
import { useDispatch } from "react-redux";
import { openSnackbar } from "../redux/snackbarSlice";
// import { displayPodcastFailure } from "../redux/userSlice.jsx";
import { CircularProgress } from "@mui/material";
// import {deleteEpisode} from "../api/index.js"
import EpisodeCard from "../components/Episodecard.jsx";

const DisplayMain = styled.div`
  display: flex;
  padding: 30px 30px;
  flex-direction: column;
  height: 100%;
  overflow-y: scroll;
`;
const Topic = styled.div`
  color: ${({ theme }) => theme.text_primary};
  font-size: 24px;
  font-weight: 540;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const Podcasts = styled.div`
  display: flex;
  flex-wrap: wrap;
  height: 100%;
  gap: 10px;
  padding: 30px 0px;
`;
const Container = styled.div`
  background-color: ${({ theme }) => theme.bg};
  padding: 20px;
  border-radius: 6px;
  min-height: 400px;
`;

const Loader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;
const DisplayNo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  color: ${({ theme }) => theme.text_primary};
`;

const DisplayPodcasts = () => {
  const { type } = useParams();
  const [podcasts, setPodcasts] = useState([]);
  const [string, setString] = useState("");
  const dispatch = useDispatch();
  const [Loading, setLoading] = useState(false);
  const [episodes, setEpisodes] = useState([]);

  const mostPopular = async () => {
    await getMostPopularPodcast()
      .then((res) => {
        setPodcasts(res.data);
      })
      .catch((err) => {
        dispatch(
          openSnackbar({
            message: err.message,
            severity: "error",
          })
        );
      });
  };
  const getCategory = async () => {
    await getPodcastByCategory(type)
      .then((res) => {
        setPodcasts(res.data);
      })
      .catch((err) => {
        dispatch(
          openSnackbar({
            message: err.message,
            severity: "error",
          })
        );
      });
  };

  const getallpodcasts = async () => {
    if (type === "mostpopular") {
      setLoading(true);
      let arr = type.split("");
      arr[0] = arr[0].toUpperCase();
      arr.splice(4, 0, " ");
      setString(arr.join(""));
      console.log(string);
      await mostPopular();
      setLoading(false);
    } else {
      setLoading(true);
      let arr = type.split("");
      arr[0] = arr[0].toUpperCase();
      setString(arr);
      await getCategory();
      setLoading(false);
    }
  };

  useEffect(() => {
    getallpodcasts();
  }, []);



  

  return (
    <DisplayMain>
      <Container>
        <Topic>{string}</Topic>
        {Loading ? (
          <Loader>
            <CircularProgress />
          </Loader>
        ) : (
          <Podcasts>
            {podcasts.length === 0 && <DisplayNo>No Podcasts</DisplayNo>}
            {podcasts.map((podcast) => (
              <PodcastCard podcast={podcast} />
            ))}
          </Podcasts>
        )}
        <div className="episode-list">
          {episodes.map((episode) => (
            <EpisodeCard
              key={episode._id}
              episode={episode}
            />
          ))}
        </div>
      </Container>
    </DisplayMain>
  );
};

export default DisplayPodcasts;
