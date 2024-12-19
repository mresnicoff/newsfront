import React, { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { useAuthContext } from '../auth/authContext';
import { FaFilterCircleXmark } from 'react-icons/fa6';
import { 
  Box, 
  Flex, 
  Text, 
  Link as ChakraLink, 
  useColorModeValue,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  VStack,
  useBreakpointValue
} from "@chakra-ui/react";
import { HamburgerIcon, SearchIcon } from '@chakra-ui/icons';
import { Link as ReactRouterLink, useSearchParams } from "react-router-dom";

const Header: React.FC = () => {
  let navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { loggedUser, filtersActive, setFiltersActive } = useAuthContext();
  const clearFilters = () => {
    setFiltersActive(); // Desactiva el estado de filtros
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete('country');
    newSearchParams.delete('category');
    newSearchParams.delete('author');
    newSearchParams.delete('keywords');
    setSearchParams(newSearchParams); // Esto limpia todos los parámetros de búsqueda en la URL actualde búsqueda
    navigate("/notas")
  };

  
  // Colores basados en el modo claro/oscuro
  const bgColor = useColorModeValue("purple.500", "purple.800");
  const textColor = useColorModeValue("white", "gray.200");
  const iconColor = useColorModeValue("white", "gray.200");

  // Estado para el Drawer
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<HTMLButtonElement>(null);

  // Determina si mostrar el menú completo o el menú hamburguesa
  const isMobile = useBreakpointValue({ base: true, md: false });

  const isUserLogged = Object.keys(loggedUser).length > 0;

  const renderAuthLinks = () => {
    if (isUserLogged) {
      return (
        <>
          <Box as="li">
            <ChakraLink as={ReactRouterLink} to="/redactar" color={textColor} _hover={{ color: "yellow.300", textDecoration: 'none' }}>
              Subir Nota
            </ChakraLink>
          </Box>
          <Box as="li">
            <ChakraLink as={ReactRouterLink} to="/logout" color={textColor} _hover={{ color: "yellow.300", textDecoration: 'none' }}>
              Log Out
            </ChakraLink>
          </Box>
          <Box as="li">Hola {(loggedUser as any).nombre}</Box>
        </>
      );
    } else {
      return (
        <>
          <Box as="li">
            <ChakraLink as={ReactRouterLink} to="/loguearse" color={textColor} _hover={{ color: "yellow.300", textDecoration: 'none' }}>
              Login
            </ChakraLink>
          </Box>
          <Box as="li">
            <ChakraLink as={ReactRouterLink} to="/registrarse" color={textColor} _hover={{ color: "yellow.300", textDecoration: 'none' }}>
              Registrarse
            </ChakraLink>
          </Box>
        </>
      );
    }
  };

  return (
    <Box as="header" bg={bgColor} color={textColor} p={4} boxShadow="md" width="100%" position="relative" zIndex="1">
      <Flex width="100%" align="center" justify="space-between" px={4}>
        <Flex width="80%" mx="auto" align="center">
          <ChakraLink as={ReactRouterLink} to="/" _hover={{ textDecoration: 'none' }}>
            <Text fontSize="2xl" fontWeight="bold">
              <Text as="span" color="yellow.300">Mis</Text> Noticias
            </Text>
          </ChakraLink>

          {isMobile ? (
            // Menú hamburguesa para dispositivos móviles
            <>
              <IconButton 
                aria-label="Open Menu" 
                icon={<HamburgerIcon />} 
                onClick={onOpen}
                ref={btnRef}
                color={iconColor}
                bg="transparent"
                ml="auto" // Asegura que el botón esté lo más a la derecha posible dentro de este Flex
              />
              <Drawer
                isOpen={isOpen}
                placement="right"
                onClose={onClose}
                finalFocusRef={btnRef}
              >
                <DrawerOverlay />
                <DrawerContent bg={bgColor}>
                  <DrawerCloseButton color={textColor} />
                  <DrawerHeader color={textColor}>Menú</DrawerHeader>
                  <DrawerBody>
                    <VStack spacing={4} align="stretch">
                      <ChakraLink as={ReactRouterLink} to="/redactar" color={textColor} _hover={{ color: "yellow.300" }}>
                        Subir nota
                      </ChakraLink>
                      <ChakraLink as={ReactRouterLink} to="/" color={textColor} _hover={{ color: "yellow.300" }}>
                        Ver notas
                      </ChakraLink>
                      {renderAuthLinks()}
                    </VStack>
                  </DrawerBody>
                </DrawerContent>
              </Drawer>
            </>
          ) : (
            // Menú regular para pantallas más grandes
            <Flex as="nav" align="center" ml="auto">
              <Flex as="ul" listStyleType="none" p={0} m={0} gap={4}>
                <Box as="li">
                  <ChakraLink as={ReactRouterLink} to="/" color={textColor} _hover={{ color: "yellow.300", textDecoration: 'none' }}>
                    Ver notas
                  </ChakraLink>
                </Box>
                {renderAuthLinks()}
                <Box as="li">
                <ChakraLink as={ReactRouterLink} to="/buscar">
          <IconButton 
            aria-label="Buscar" 
            icon={<SearchIcon />} 
            size="sm" 
            color={iconColor}
            bg="transparent"
            _hover={{ bg: "transparent", color: "yellow.300" }}
          />
        </ChakraLink>
        </Box>
        {filtersActive && 
        <Box as="li">

          <IconButton 
            aria-label="Remover filtros" 
            icon={<FaFilterCircleXmark />} 
            size="sm" 
            color={iconColor}
            bg="transparent"
            _hover={{ bg: "transparent", color: "yellow.300" }}
            onClick={clearFilters} // Llamas a clearFilters aquí para limpiar los filtros
          />
        </Box>}
              </Flex>
            </Flex>
          )}
        </Flex>

        {/* La lupa ahora está completamente a la derecha del Flex principal */}

      </Flex>
    </Box>
  );
};

export default Header;