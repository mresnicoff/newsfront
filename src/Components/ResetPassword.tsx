import React, { useState, useEffect } from 'react';
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
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

interface ResetPasswordFormProps {
  // Aquí puedes añadir props si son necesarios
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = () => {
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isValidToken, setIsValidToken] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const apiUrl = import.meta.env.VITE_API_URL;
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');

  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.200");
  const linkColor = useColorModeValue("purple.500", "purple.300");
  const btnColor = useColorModeValue("purple.500", "purple.600");

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const response = await axios.get(apiUrl+`verify-token?token=${token}`);
          if (response.data.success) {
            setIsValidToken(true);
          } else {
            setIsValidToken(false);
            toast({
              title: "Error",
              description: "El token no es válido o ha expirado.",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          }
        } catch (error) {
          toast({
            title: "Error",
            description: "Hubo un problema al verificar el token.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      } else {
        setIsValidToken(false);
        toast({
          title: "Error",
          description: "No se proporcionó un token válido.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };
    verifyToken();
  }, [token, toast]);

  const validateField = (name: string, value: string) => {
    let newErrors = { ...errors };
    
    switch (name) {
      case 'password':
        if (value.trim() === '') newErrors.password = 'La contraseña no puede quedar vacía';
        else if (value.length < 6) newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        else delete newErrors.password;
        break;
      case 'confirmPassword':
        if (value.trim() === '') newErrors.confirmPassword = 'Repetir contraseña no puede quedar vacío';
        else if (password && password !== value) newErrors.confirmPassword = 'Las contraseñas no coinciden';
        else delete newErrors.confirmPassword;
        break;
    }

    setErrors(newErrors);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'password') {
      setPassword(value);
      // Solo valida confirmPassword si ya se ha tocado
      if (touched.confirmPassword) {
        validateField('confirmPassword', confirmPassword);
      }
    } else if (name === 'confirmPassword') {
      setConfirmPassword(value);
      // Validar confirmPassword solo si password tiene un valor
      if (password) {
        validateField('confirmPassword', value);
      }
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value); // Validar cuando el campo pierde el foco
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    // Solo valida los campos si han sido tocados antes de enviar el formulario
    if (touched.password) validateField('password', password);
    if (touched.confirmPassword) validateField('confirmPassword', confirmPassword);

    if (isValidToken && !errors.password && !errors.confirmPassword) {
      try {
        await axios.post(apiUrl+'reset-password', { 
          token: token, 
          password: password 
        });
        toast({
          title: "Éxito",
          description: "Tu contraseña ha sido restablecida con éxito.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate('/loguearse'); // Redirige al usuario al login
      } catch (error) {
        toast({
          title: "Error",
          description: "Hubo un problema al restablecer tu contraseña.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      toast({
        title: "Error",
        description: "Por favor, corrige los errores en el formulario antes de enviar.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setIsLoading(false);
    }
  };

  if (!isValidToken) return <Text>Token no válido o expirado.</Text>;

  return (
    <Box 
      bg={bgColor} 
      p={8} 
      borderRadius="lg" 
      boxShadow="lg" 
      maxW="md" 
      mx="auto" 
      my={10}
    >
      <form onSubmit={handleSubmit}>
      <VStack spacing={4} align="stretch" as="form" >
        <FormControl id="password" isRequired isInvalid={!!errors.password && touched.password}>
          <FormLabel color={textColor}>Contraseña</FormLabel>
          <Input 
            type="password" 
            name="password" 
            value={password} 
            onChange={handlePasswordChange} 
            onBlur={handleBlur}
            placeholder="Contraseña" 
          />
          {touched.password && errors.password && <Text color="red.500" fontSize="sm">{errors.password}</Text>}
        </FormControl>

        <FormControl id="confirmPassword" isRequired isInvalid={!!errors.confirmPassword && touched.confirmPassword}>
          <FormLabel color={textColor}>Repetir Contraseña</FormLabel>
          <Input 
            type="password" 
            name="confirmPassword" 
            value={confirmPassword} 
            onChange={handlePasswordChange} 
            onBlur={handleBlur}
            placeholder="Repetir Contraseña" 
          />
          {touched.confirmPassword && errors.confirmPassword && <Text color="red.500" fontSize="sm">{errors.confirmPassword}</Text>}
        </FormControl>

        <Button 
          colorScheme="purple" 
          bg={btnColor} 
          type="submit" 
          isLoading={isLoading}
          loadingText="Restableciendo contraseña..."
          isDisabled={!!errors.password || !!errors.confirmPassword}
        >
          Restablecer Contraseña
        </Button>

        <Text align="center" fontSize="sm" color={textColor}>
          <a href="/loguearse" style={{ color: linkColor }}>Volver al inicio de sesión</a>
        </Text>
      </VStack>
      </form>
    </Box>
  );
};

export default ResetPasswordForm;