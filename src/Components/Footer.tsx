import React from "react";
import { Box, Text, Flex, Link } from "@chakra-ui/react";

const Footer: React.FC = () => {
  return (
    <Box as="footer" bg="gray.900" color="white" py={4}>
      <Flex 
        direction="column" 
        alignItems="center" 
        justifyContent="center" 
        maxWidth="1200px" 
        mx="auto" 
        px={4}
      >
        <Text fontSize="xs" textAlign="center">
          © {new Date().getFullYear()} Los Resnis. Todos los derechos reservados.<br/>
          Desarrollado con la ayuda de <Link href="https://x.ai/" color="purple.400" isExternal>Grok</Link>.
        </Text>
        <Flex mt={2}>
          <Link mx={2} href="#" color="purple.400">
            Política de Privacidad
          </Link>
          <Link mx={2} href="#" color="purple.400">
            Términos de Servicio
          </Link>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Footer;
