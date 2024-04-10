/* eslint-disable no-alert */
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

type removeImageProps = {
  id: string;
  name: string;
};

type onFileChangeProps = {
  name: string;
  type: string;
};

const useFileHandler = (initState: any) => {
  const [imageFile, setImageFile] = useState(initState);
  const [isFileLoading, setFileLoading] = useState(false);

  const removeImage = ({ id, name }: removeImageProps) => {
    const items = imageFile[name].filter((item: any) => item.id !== id);

    setImageFile({
      ...imageFile,
      [name]: items,
    });
  };

  const onFileChange = (event: any, { name, type }: onFileChangeProps) => {
    const val = event.target.value;
    const img = event.target.files[0];
    const size = img.size / 1024 / 1024;
    const regex = /(\.jpg|\.jpeg|\.png)$/i;

    setFileLoading(true);
    if (!regex.exec(val)) {
      alert("File type must be JPEG or PNG");
      setFileLoading(false);
    } else if (size > 5) {
      alert("File size exceeded 5MB, consider optimizing your image");
      setFileLoading(false);
    } else if (type === "multiple") {
      Array.from(event.target.files).forEach((file: any) => {
        const reader = new FileReader();
        reader.addEventListener("load", (e) => {
          setImageFile((oldFiles: any) => ({
            ...oldFiles,
            [name]: [
              ...oldFiles[name],
              { file, url: e.target?.result, id: uuidv4() },
            ],
          }));
        });
        reader.readAsDataURL(file);
      });

      setFileLoading(false);
    } else {
      // type is single
      const reader = new FileReader();

      reader.addEventListener("load", (e) => {
        setImageFile({
          ...imageFile,
          [name]: { file: img, url: e.target?.result },
        });
        setFileLoading(false);
      });
      reader.readAsDataURL(img);
    }
  };

  return {
    imageFile,
    setImageFile,
    isFileLoading,
    onFileChange,
    removeImage,
  };
};

export default useFileHandler;
