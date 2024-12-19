import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../auth/authContext';
import { 
  Box, 
  Button, 
  FormControl, 
  FormLabel, 
  Input, 
  VStack, 
  Text, 
  Link, 
  useToast,
  useColorModeValue
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom'; // Asegúrate de importar esto si usas react-router
import axios from 'axios';

interface LoginFormProps {
  // Si necesitas añadir props aquí
}

const LoginForm: React.FC<LoginFormProps> = () => {
  const {login}= useAuthContext();
  const navigate = useNavigate();
  const [user, setUser] = useState<{ email: string; password: string }>({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const apiUrl = import.meta.env.VITE_API_URL;
  const toast = useToast();
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.200");
  const linkColor = useColorModeValue("purple.500", "purple.300");
  const btnColor = useColorModeValue("purple.500", "purple.600");

  const validateField = (name: string, value: string) => {
    let newErrors = { ...errors };
    
    switch (name) {
      case 'email':
        if (value.trim() === '') newErrors.email = 'El correo electrónico no puede quedar vacío';
        else delete newErrors.email;
        break;
      case 'password':
        if (value.trim() === '') newErrors.password = 'La contraseña no puede quedar vacía';
        else if (value.length < 6) newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        else delete newErrors.password;
        break;
    }

    setErrors(newErrors);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser(prevState => ({ ...prevState, [name]: value }));
    validateField(name, value);
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    if (!user.email || errors.email || !user.password || errors.password) {
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
           const response = await axios.post(apiUrl+'usuarios/', {email:user.email, password:user.password}
      );

      if (response.data.success) {
        toast({
          title: "Éxito",
          description: "Inicio de sesión exitoso. Redirigiendo a Noticias",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        login(user.email)
        console.log(user.email)
        navigate('/');
      } else {
        toast({
          title: "Error",
          description: "Credenciales incorrectas.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: (error as any).response.data.message|| "Hubo un problema al intentar iniciar sesión.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const showError = (field: string) => touched[field] && errors[field];

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
      <VStack spacing={4} align="stretch" as="form" >
        <FormControl id="email" isRequired isInvalid={!!showError('email')}>
          <FormLabel color={textColor}>Correo Electrónico</FormLabel>
          <Input 
            type="email" 
            name="email" 
            value={user.email} 
            onChange={handleChange} 
            onBlur={handleBlur}
            placeholder="Correo electrónico" 
          />
          {showError('email') && <Text color="red.500" fontSize="sm">{errors.email}</Text>}
        </FormControl>

        <FormControl id="password" isRequired isInvalid={!!showError('password')}>
          <FormLabel color={textColor}>Contraseña</FormLabel>
          <Input 
            type="password" 
            name="password" 
            value={user.password} 
            onChange={handleChange} 
            onBlur={handleBlur}
            placeholder="Contraseña"
          />
          {showError('password') && <Text color="red.500" fontSize="sm">{errors.password}</Text>}
        </FormControl>

        <Button 
          colorScheme="purple" 
          bg={btnColor} 
          type="submit" 
          isLoading={isLoading}
          loadingText="Iniciando sesión..."
        >
          Iniciar sesión
        </Button>

        <Text align="center" fontSize="sm" color={textColor}>
          <Link as={RouterLink} to="/forgot-password" color={linkColor}>
            ¿Olvidó su contraseña?
          </Link>
        </Text>
        <Text align="center" fontSize="sm" color={textColor}>
          <Link as={RouterLink} to="/registrarse" color={linkColor}>
            No tiene cuenta, regístrese
          </Link>
        </Text>
      </VStack>
      </form>
    </Box>
  );
};

export default LoginForm;