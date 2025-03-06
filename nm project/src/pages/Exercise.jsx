import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/Exercise.css";

const Exercise = () => {
  const { id } = useParams();
  const [exercise, setExercise] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id]); // ✅ Added `id` to dependency array

  const fetchData = async (id) => {
    const options = {
      method: "GET",
      url: `https://exercisedb.p.rapidapi.com/exercises/exercise/${id}`,
      headers: {
        "X-RapidAPI-Key": 'e85478d7damsh07268f3305efd99p1c766fjsn8d5a641e7ca8',
        "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.request(options);
      console.log(response.data);
      setExercise(response.data);
      fetchRelatedVideos(response.data.name);
    } catch (error) {
      console.error("Error fetching exercise data:", error);
    }
  };

  const fetchRelatedVideos = async (name) => {
    console.log(name);
    const options = {
      method: "GET",
      url: "https://youtube-search-and-download.p.rapidapi.com/search",
      params: {
        query: name,
        hl: "en",
        upload_date: "t",
        duration: "l",
        type: "v",
        sort: "r",
      },
      headers: {
        "X-RapidAPI-Key": 'e85478d7damsh07268f3305efd99p1c766fjsn8d5a641e7ca8',
        "X-RapidAPI-Host": "youtube-search-and-download.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.request(options);
      console.log(response.data.contents);
      setRelatedVideos(response.data.contents);
    } catch (error) {
      console.error("Error fetching related videos:", error);
    }
  };

  return (
    <div className="exercise-page">
      {exercise && (
        <div className="exercise-container">
          <div className="exercise-image">
            <img src={exercise.gifUrl} alt="exercise img" />
          </div>

          <div className="exercise-data">
            <h3>{exercise.name}</h3>
            <span>
              <b>Target:</b>
              <p>{exercise.target}</p>
            </span>
            <span>
              <b>Equipment:</b>
              <p>{exercise.equipment}</p>
            </span>
            <span>
              <b>Secondary Muscles:</b>
              <ul>
                {exercise.secondaryMuscles.map((muscle, index) => (
                  <li key={index}>{muscle}</li>
                ))}
              </ul>
            </span>
            <div className="exercise-instructions">
              <h3>Instructions</h3>
              <ul>
                {exercise.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="related-videos-container">
        <h3>Related Videos on Youtube</h3>
        {relatedVideos.length > 0 && (
          <div className="related-videos">
            {relatedVideos.slice(0, 15).map((video, index) => (
              <div
                className="related-video"
                key={index}
                onClick={() =>
                  window.open(
                    `https://www.youtube.com/watch?v=${video.video.videoId}`,
                    "_blank"
                  )
                }
              >
                <img src={video.video.thumbnails[0].url} alt="Video thumbnail" />
                <h4>{video.video.title.slice(0, 40)}...</h4>
                <span>
                  <p>{video.video.channelName}</p>
                  <p>{video.video.viewCountText}</p>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Exercise;
