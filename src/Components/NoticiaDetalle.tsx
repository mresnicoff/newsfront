import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Box, Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, useDisclosure } from "@chakra-ui/react";

interface Article {
  id: number;
  date: string;
  author: string;
  title: string;
  description: string;
  content: string; // Añade más campos según sea necesario
}
interface Noticia{
    article: Article}


const NoticiaDetalle: React.FC = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { id } = useParams<{ id: string }>();
  const [noticia, setNoticia] = useState<Article | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchNoticia = async () => {
      try {
        if (id) {
          const response = await axios.get<Noticia>(apiUrl+`news/${id}`);
          setNoticia(response.data.article);
        } else {
          console.error("No se proporcionó un ID de noticia.");
        }
      } catch (error) {
        console.error("Error fetching noticia:", error);
      } finally {
        onOpen(); // Abre el modal una vez que los datos estén cargados
      }
    };

    fetchNoticia();
  }, [id, onOpen]);

  if (!noticia) {
    return <div>Cargando...</div>;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{noticia.title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box p="4">
            <Text>Fecha: {noticia.date}</Text>
            <Text>Autor: {noticia.author}</Text>
            <Text fontSize="xl" dangerouslySetInnerHTML={{ __html: noticia.title }} />
            <Text dangerouslySetInnerHTML={{ __html: noticia.content }} />
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Volver a Noticias
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default NoticiaDetalle;