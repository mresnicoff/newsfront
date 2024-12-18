import { Button, IconButton, Input } from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { ImageFill } from "react-bootstrap-icons";
import Modal from "../Components/Modal";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createImageNode } from "../nodes/ImageNode";
import { $insertNodes } from "lexical";
import axios from "axios";

export default function ImagePlugin() {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setURL] = useState("");
  const [file, setFile] = useState<File>();
  const inputRef = useRef<HTMLInputElement>(null);
  const apiUrl = import.meta.env.VITE_API_URL;
  const [editor] = useLexicalComposerContext();

  const onAddImage = () => {
    let src = "";
    if (url) src = url;
    if (file) src = URL.createObjectURL(file);

    editor.update(() => {
      const node = $createImageNode({ src, altText: "Dummy text" });
      $insertNodes([node]);
    });
    setFile(undefined);
    setURL("");
    setIsOpen(false);
  };

  return (
    <div>
      <IconButton
        icon={<ImageFill />}
        aria-label="Add Image"
        size="sm"
        variant="ghost"
        onClick={() => setIsOpen(true)}
      />
      <input
        type="file"
        ref={inputRef}
        accept="image/*"
        style={{ display: "none" }}
        onChange=  {async (e) => {
          const file = e.target.files?.[0];
          if (file) {
            const formData = new FormData();
            formData.append('file', file);
            try {
              const response = await axios.post<{ url: string }>(apiUrl+'upload', formData, {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              });
              console.log(response.data.url)
              setURL(response.data.url);
        
            } catch (error) {
              console.error('Error subiendo la imagen:', error);
            }

          }
          e.target.files = null;
        }}
      />
      {isOpen && (
        <Modal
          title="Add Image"
          onClose={() => setIsOpen(false)}
          footer={
            <Button
              variant="ghost"
              isDisabled={!url && !file}
              onClick={onAddImage}
            >
              Add Image
            </Button>
          }
          isOpen={isOpen}
        >
          <Input
            value={url}
            onChange={(e) => setURL(e.target.value)}
            placeholder="Add Image URL"
          />
          <Button
            variant="ghost"
            mt={4}
            onClick={() => inputRef?.current?.click()}
          >
            {file ? file.name : "Upload Image"}
          </Button>
        </Modal>
      )}
    </div>
  );
}
