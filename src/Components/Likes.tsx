// Likes.tsx
import React, { useState, useEffect } from 'react';
import { IconButton, Text, Flex } from "@chakra-ui/react";
import { AiFillLike, AiOutlineLike } from 'react-icons/ai';

interface LikeProps {
  id: number; 
  initialLikes: number;
  onLikeToggle: (id: number, liked: boolean) => void; 
}

const Likes: React.FC<LikeProps> = ({ id, initialLikes, onLikeToggle }) => {
  const [liked, setLiked] = useState<boolean>(() => {
    const localStorageLikes = localStorage.getItem(`like-${id}`);
    return localStorageLikes === 'true';
  });

  useEffect(() => {
    localStorage.setItem(`like-${id}`, liked.toString());
  }, [id, liked]);

  const toggleLike = () => {
    setLiked(!liked);
    onLikeToggle(id, !liked);
  };

  return (
    <Flex alignItems="bottom"> 
      <IconButton 
        aria-label={liked ? 'Unlike' : 'Like'} 
        onClick={toggleLike}
        icon={liked ? <AiFillLike color="red" /> : <AiOutlineLike />}
        variant="ghost"
        size="sm" 
      />
      <Text ml={1}>{initialLikes}</Text> 
    </Flex>
  );
};

export default Likes;