// NoticiaModal.tsx
import React, { useState, useEffect } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Flex, Box, Text, Image } from "@chakra-ui/react";
import { formatDate } from '../hooks/dateFormat';
import Likes from './Likes';
import axios from 'axios';
interface Article {
  key: number;
  id: number;
  date: string;
  autor:{
    nombre: string;
    avatar: string;}
  title: string;
  description: string;
  content: string;
  image: string;
  likes: number;
  onClick: (id: number) => void;
  width: string | number | undefined;
}

interface NoticiaModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedNews: Article | null;
}

const NoticiaModal: React.FC<NoticiaModalProps> = ({ isOpen, onClose, selectedNews }) => {
  const [likes, setLikes] = useState(selectedNews?.likes || 0);
  const apiUrl = import.meta.env.VITE_API_URL;
  useEffect(() => {

    setLikes(selectedNews?.likes || 0);
      
      }, [selectedNews]);



  const updateLikes = async (id: number, liked: boolean) => {
    setLikes(prevLikes => prevLikes + (liked ? 1 : -1));
    try {
      if (liked) {
        await axios.post(apiUrl+`likes/${id}`, { action: 'increment' });
      } else {
        await axios.post(apiUrl+`likes/${id}`, { action: 'decrement' });
      }
    } catch (error) {
      console.error('Error updating likes:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent bg="white" color="gray.800">
        <ModalHeader bg="purple.500" color="white">{selectedNews?.title}</ModalHeader>
        <ModalCloseButton 
          fontSize="md"
          color="white" 
          _hover={{ color: "purple.300" }}
          zIndex="1"
        />
        <ModalBody>
          <Flex>
            <Box width="80%" overflowY="auto" maxHeight="60vh">
              <Flex alignItems="center" mb={2}>
                {selectedNews?.autor.avatar && (
                  <Image 
                    src={selectedNews.autor.avatar} 
                    alt={selectedNews.autor.nombre + "'s avatar"} 
                    boxSize="50px" 
                    borderRadius="full" 
                    mr={2} 
                  />
                )}
                <Box>
                  <Text fontSize="md" color="red">{formatDate(selectedNews?.date as string)}</Text>
                  <Text color="gray.600">{selectedNews?.autor.nombre}</Text>
                </Box>
              </Flex>
              <Text 
                dangerouslySetInnerHTML={{ __html: selectedNews?.description || '' }} 
                sx={{
                  'p': { color: "gray.700" },
                  'a': { color: "purple.600" }
                }}
              />
            </Box>
            <Box width="20%" p="4">
              <Box 
                borderWidth="1px" 
                borderColor="purple.500" 
                borderRadius="lg" 
                p="4" 
                boxShadow="md" 
                bg="white"
              >
                <Text color="purple.800">Google Ads</Text>
              </Box>
            </Box>
          </Flex>
        </ModalBody>
        <ModalFooter justifyContent="space-between">
          <Likes id={selectedNews?.id || 0} initialLikes={likes} onLikeToggle={updateLikes}/>
          <Button 
            colorScheme="purple" 
            onClick={onClose}
          >
            Cerrar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default NoticiaModal;