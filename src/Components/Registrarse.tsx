import React, {ChangeEvent, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  FormControl, 
  FormLabel, 
  Input, 
  VStack, 
  Text, 
  useToast,
  useColorModeValue,
  Switch
} from '@chakra-ui/react';
import axios from 'axios';

interface User {
  email: string;
  avatar: string;
  password: string;
  repeatPassword: string;
  nombre: string;
  puedeescribir: boolean;
  linkautor?: string;
}

const RegisterForm: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log("Hola")
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };
    const navigate = useNavigate();
  const [user, setUser] = useState<User>({
    email: '',
    avatar: '',
    password: '',
    repeatPassword: '',
    nombre: '',
    puedeescribir: false,
    linkautor: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const apiUrl = import.meta.env.VITE_API_URL;
  const toast = useToast();
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.200");
  const btnColor = useColorModeValue("purple.500", "purple.600");

  const validateField = (name: string, value: string) => {
    let newErrors = { ...errors };
    
    switch (name) {
      case 'email':
        if (value.trim() === '') newErrors.email = 'El correo electrónico no puede quedar vacío';
        else if (!/\S+@\S+\.\S+/.test(value)) newErrors.email = 'El correo electrónico no es válido';
        else delete newErrors.email;
        break;
      case 'avatar':
        if (!value || value.length === 0) {
          newErrors.avatar = 'El avatar no puede quedar vacío';}
        else delete newErrors.avatar;
        break;
      case 'password':
        if (value.trim() === '') newErrors.password = 'La contraseña no puede quedar vacía';
        else if (value.length < 6) newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        else delete newErrors.password;
        break;
      case 'repeatPassword':
        if (value.trim() === '') newErrors.repeatPassword = 'Repetir contraseña no puede quedar vacío';
        else if (value !== user.password) newErrors.repeatPassword = 'Las contraseñas no coinciden';
        else delete newErrors.repeatPassword;
        break;
      case 'nombre':
        if (value.trim() === '') newErrors.nombre = 'El nombre no puede quedar vacío';
        else delete newErrors.nombre;
        break;
    }

    setErrors(newErrors);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setUser(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Validate on change for real-time feedback
    validateField(name, type === 'checkbox' ? (checked ? 'true' : '') : value);
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

    let formIsValid = true;
    const validationErrors = {};
    const formData = new FormData();
    if (selectedFile){
 
    formData.append('file', selectedFile);}
    let avatarUrl = user.avatar;
    try {
      const response = await axios.post<{ url: string }>(apiUrl+'upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      avatarUrl=response.data.url
      setUser(prevUser => ({
        ...prevUser,
        avatar: response.data.url 
      }));
    } catch (error) {
      console.error('Error subiendo la imagen:', error);
    }

    // Validate all fields before submit
    Object.keys(user).forEach((field) => {
      if (field !== 'linkautor' && field !== 'puedeescribir') {
    
        validateField(field, user[field as keyof User] as string);
        if (errors[field]) formIsValid = false;
      }
    });

    if (!formIsValid) {
      toast({
        title: "Error",
        description: "Por favor, corrige los errores en el formulario.",
        status: "error",
        duration: 1000,
        isClosable: true,
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(apiUrl+'nuevousuario/', {
        email: user.email,
        avatar: avatarUrl,
        password: user.password,
        nombre: user.nombre, // Asegúrate de enviar 'nombre' al backend
        puedeescribir: user.puedeescribir,
        linkautor: user.linkautor || undefined
      });
       if (response.data.success) {
        toast({
          title: "Éxito",
          description: "Registro exitoso.Redirigiendo al login",
          status: "success",
          duration: 1000,
          isClosable: true,
        });
        navigate('/loguearse');
      } else {
        toast({
          title: "Error",
          description: response.data.message || "No se pudo registrar el usuario.",
          status: "error",
          duration: 1000,
          isClosable: true,
        });
      }
    } catch (error) {
        if ((error as any).response) {
          // Aquí asignamos el mensaje de error a la descripción de la notificación
          toast({
            title: "Error",
            description: (error as any).response.data.message || "Ocurrió un error inesperado.",
            status: "error",
            duration: 1000,
            isClosable: true,
          });
        } else {
          // Manejar otros tipos de errores
          toast({
            title: "Error",
            description: "Hubo un problema con la solicitud.",
            status: "error",
            duration: 1000,
            isClosable: true,
          });
        }
      
    } finally {
      setIsLoading(false);
    }
  };

  // Show error only if field has been touched
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
    >
      <form onSubmit={handleSubmit}>
      <VStack spacing={4} align="stretch" as="form" >
        <FormControl id="nombre" isRequired isInvalid={!!showError('nombre')}>
          <FormLabel color={textColor}>Nombre</FormLabel>
          <Input 
            type="text" 
            name="nombre" 
            value={user.nombre} 
            onChange={handleChange} 
            onBlur={handleBlur}
            placeholder="Nombre completo" 
          />
          {showError('nombre') && <Text color="red.500" fontSize="sm">{errors.nombre}</Text>}
        </FormControl>
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
        <FormControl id="avatar" isRequired isInvalid={!!showError('avatar')}>
  <FormLabel color={textColor}>Imagen de Avatar</FormLabel>
  <Input 
    type="file" 
    name="avatar" 
    onChange={handleFileChange} // Usar handleFileChange aquí
    onBlur={handleBlur}
  />
  {/* Mostrar el nombre del archivo o mensaje por defecto */}
  {showError('avatar') && <Text color="red.500" fontSize="sm">{errors.avatar}</Text>}

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
        <FormControl id="repeatPassword" isRequired isInvalid={!!showError('repeatPassword')}>
          <FormLabel color={textColor}>Repetir Contraseña</FormLabel>
          <Input 
            type="password" 
            name="repeatPassword" 
            value={user.repeatPassword} 
            onChange={handleChange} 
            onBlur={handleBlur}
            placeholder="Repetir contraseña"
          />
          {showError('repeatPassword') && <Text color="red.500" fontSize="sm">{errors.repeatPassword}</Text>}
        </FormControl>
        <FormControl id="puedeescribir">
          <FormLabel color={textColor}>¿Puede Escribir?</FormLabel>
          <Switch 
            name="puedeescribir" 
            isChecked={user.puedeescribir} 
            onChange={handleChange}
          />
        </FormControl>
        <FormControl id="linkautor">
          <FormLabel color={textColor}>Enlace del Autor (opcional)</FormLabel>
          <Input 
            type="text" 
            name="linkautor" 
            value={user.linkautor || ''} 
            onChange={handleChange} 
            placeholder="Enlace opcional del autor"
          />
        </FormControl>

        <Button 
          colorScheme="purple" 
          bg={btnColor} 
          type="submit" 
          isLoading={isLoading}
          loadingText="Registrando..."
        >
          Registrarse
        </Button>
      </VStack>
      </form>
    </Box>
  );
};

export default RegisterForm;