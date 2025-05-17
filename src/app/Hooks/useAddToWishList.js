"use client";
import authe from "../firebase";
import { useTvContext } from "../context/idContext";
import { useCallback } from "react";
import apiForHf from "../utils/axiosInstanceForHfApi";

const useAddToWishList = () => {
  const { setwhishlistChange } = useTvContext();

  const addToWishList = useCallback(async (id, title, img, genres, rate, media_type, poster_path, release_date) => {
    const user = authe.currentUser;

    if (!user) {
      return;
    }

    const token = await user.getIdToken(true);

    const showData = {
      show_id: id,
      title,
      backdrop_path: img,
      genre_ids: genres,
      vote_average: rate,
      media_type,
      poster_path,
      release_date
    };

    const response = await apiForHf.post(
      "/api/wishlist",
      showData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    setwhishlistChange((prev) => !prev);
  }, [setwhishlistChange]);

  return addToWishList;
};

export default useAddToWishList;
