import React from 'react';
import { Box, Flex, Text, Image } from "@chakra-ui/react";
import { formatDate } from '../hooks/dateFormat';
interface Article {
  id: number;
  date: string; // Suponemos que date vendrá en formato ISO
  nombre:string; 
  avatar:string
  title: string;
  description: string;
  content: string;
  image: string;
  onClick: () => void;
  width: string | number | undefined;
}

const Noticia: React.FC<Article> = ({ id, nombre, avatar,title, description, date, image, onClick, width }) => {
  // Función para eliminar la imagen del contenido HTML si existe
  const removeImageFromHTML = (htmlContent: string) => {
    return htmlContent.replace(/<img.*?src=['"](.*?)['"].*?>/i, '');
  };

  const cleanedDescription = removeImageFromHTML(description);

  // Función para formatear la fecha
  ;

  return (
    <Box 
      width={width} 
      m="2" 
      cursor="pointer" 
      onClick={onClick} 
      borderWidth="1px" 
      borderRadius="lg" 
      p="4" 
      boxShadow="md" 
      bg="white"
      overflow="hidden" // Esto oculta el overflow
      maxHeight="400px" // Ajusta este valor según el largo máximo deseado
    >
      <Flex direction="column">
        <Text fontSize="xl" fontWeight="bold" noOfLines={2}>{title}</Text>
        <Flex>
          {image && (
            <Box width="40%" pr="4">
              <Image 
                src={image} 
                alt={title} 
                width="100%" 
                objectFit="cover" 
                maxHeight="200px" // Ajusta según la altura máxima deseada de la imagen
              />
            </Box>
          )}
          <Box width={image ? "60%" : "100%"}>
            <Flex direction="column" justifyContent="space-between" height="100%">
              <Box>
                <Text fontSize="md" color="red">{formatDate(date)}</Text>
                <Text fontSize="sm" color="gray.500">By {nombre}</Text>
              </Box>
            </Flex>
          </Box>
        </Flex>
        <Box mt="2">
          <Text 
            dangerouslySetInnerHTML={{ __html: cleanedDescription }}
            noOfLines={3} // Limita el número de líneas para el contenido
          />
        </Box>
      </Flex>
    </Box>
  );
};

export default Noticia;