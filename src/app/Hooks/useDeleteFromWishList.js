'use client';
import authe from '../firebase';
import { useTvContext } from '../context/idContext';
import { useCallback } from 'react';
import apiForHf from '../utils/axiosInstanceForHfApi';

const useDeleteFromWishList = () => {
  const { setwhishlistChange } = useTvContext();

  const deleteFromWishList = useCallback(async (show_id) => {
    const user = authe.currentUser;

    if (!user) {
      return;
    }

    const token = await user.getIdToken(true);

    await apiForHf.delete(`/api/wishlist/${show_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    setwhishlistChange((prev) => !prev);
  }, [setwhishlistChange]);

  return deleteFromWishList;
};

export default useDeleteFromWishList;
