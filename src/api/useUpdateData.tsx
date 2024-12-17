import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useUpdateData = () =>

  useMutation({
    mutationFn: async (myData: {title:string, content:string}) => {
      const { data } = await axios.post("http://localhost:3001/data", { myData });
      return data;
    },
  });
