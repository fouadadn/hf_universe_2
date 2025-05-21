'use client';
import authe from '../firebase';
import { useCallback } from 'react';
import apiForHf from '../utils/axiosInstanceForHfApi';

const useDeleteFromhistory = () => {

  const deleteFromWishList = useCallback(async (show_id, mediaType) => {
    const user = authe.currentUser;

    if (!user) {
      return;
    }

    const token = await user.getIdToken(true);

    const res = await fetch('https://hf-stream-api.vercel.app/api/history', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        // Add other headers here if needed, like Authorization
      },
      body: JSON.stringify({
        show_id,
        mediaType: mediaType === "movie" ? "movies" : "series"
      })
    })

  }, []);

  return deleteFromWishList;
};

export default useDeleteFromhistory;
