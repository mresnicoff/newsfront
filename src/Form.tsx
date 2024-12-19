import { Box, Button, Input } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useData, useUpdateData } from "./api";
import { RichTextEditor } from "./RichTextEditor";
import { useAuthContext } from './auth/authContext';


interface FormData {
  title: string;
  content: string;
  usuarioId: number
}

export default function Form() {
  const { loggedUser } = useAuthContext();
  const [formData, setFormData] = useState<FormData>({
    title: "",
    content: "",
    usuarioId: (loggedUser as { id: number }).id
  });
  const { mutateAsync: saveText, isPending } = useUpdateData();
  const { data: fetchedData } = useData();

  useEffect(() => {
    if (fetchedData) {
      setFormData({
        title: fetchedData.title || "",
        content: fetchedData.content || "",
        usuarioId: (loggedUser as { id: number }).id
      });
    }
  }, [fetchedData]);

  const onSave = () => {
       saveText(formData);
  };

  const handleChange = (field: keyof FormData) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Box p={2}>
      <Input
        placeholder="Tipee el título"
        name="title"
        value={formData.title}
        onChange={(e) => handleChange('title')(e.target.value)}
        mb={2}
      />
      <RichTextEditor
        placeholder="Write Post"
        name="post"
        value={formData.content}
        onChange={handleChange('content')}
      />
      <Button colorScheme="whatsapp" size="xs" mt={2} onClick={onSave}>
        {isPending ? "Saving..." : "Save"}
      </Button>
    </Box>
  );
}