import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  FormControl, 
  FormLabel, 
  Input, 
  VStack, 
  Text, 
  useToast,
  useColorModeValue
} from '@chakra-ui/react';
import axios, { AxiosError } from 'axios';

interface ForgotPasswordFormProps {
  // Si necesitas añadir props aquí
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [email, setEmail] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toast = useToast();
  
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.200");
  const linkColor = useColorModeValue("purple.500", "purple.300");
  const btnColor = useColorModeValue("purple.500", "purple.600");

  const validateEmail = (value: string) => {
    let newErrors: { [key: string]: string } = { ...errors };
    
    if (value.trim() === '') {
      newErrors.email = 'El correo electrónico no puede quedar vacío';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
      newErrors.email = 'Por favor, introduce un correo electrónico válido';
    } else {
      delete newErrors.email;
    }

    setErrors(newErrors);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(apiUrl)
    const { value } = e.target;
    setEmail(value);
    validateEmail(value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    if (!email || errors.email) {
      toast({
        title: "Error",
        description: "Por favor, corrige los errores en el formulario.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setIsLoading(false);
      return;
    }

    try {
      await axios.post(apiUrl + 'emails', { email });
      toast({
        title: "Éxito",
        description: "Se ha enviado un correo electrónico para restablecer tu contraseña.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      const axiosError = error as AxiosError;
      toast({
        title: "Error",
        description: (axiosError?.response?.data as any).message || "Hubo un problema al intentar enviar el correo de recuperación.",
        status: "error",
        duration: 3000,
        isClosable: true, 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box 
      bg={bgColor} 
      p={8} 
      borderRadius="lg" 
      boxShadow="lg" 
      maxW="md" 
      mx="auto" 
      my={10}
    ><form onSubmit={handleSubmit}>
      <VStack spacing={4} align="stretch" as="form">
        <FormControl id="email" isRequired isInvalid={!!errors.email}>
          <FormLabel color={textColor}>Correo Electrónico</FormLabel>
          <Input 
            type="email" 
            value={email} 
            onChange={handleChange} 
            placeholder="Correo electrónico" 
          />
          {errors.email && <Text color="red.500" fontSize="sm">{errors.email}</Text>}
        </FormControl>

        <Button 
          colorScheme="purple" 
          bg={btnColor} 
          type="submit" 
          isLoading={isLoading}
          loadingText="Enviando correo..."
        >
          Recuperar Contraseña
        </Button>

        <Text align="center" fontSize="sm" color={textColor}>
          <a href="/loguearse" style={{ color: linkColor }}>Volver al inicio de sesión</a>
        </Text>
      </VStack>
      </form>
    </Box>
  );
};

export default ForgotPasswordForm;