import { useMutation } from "@tanstack/react-query";
import axios from "axios";
// Asegúrate de que esta variable esté disponible en el scope correcto
const apiUrl = import.meta.env.VITE_API_URL;

export const useUpdateData = () => {
  const mutation = useMutation({
    mutationFn: async (myData: { title: string, content: string }) => {
      const { data } = await axios.post(apiUrl+`data`, myData);
      return data;
    },
  });

  // Retorna la función mutate para que pueda ser usada en componentes
  return mutation;
};