import { TextField, InputLabel, Box, Grid, Typography } from "@mui/material";
import { useCallback, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import ScImage from "../../components/common/scImage";

type ScFileUploadProps = {
  label: string;
  name: string;
  multiple: boolean;
  onChange: (val: any) => void;
  accept: string;
  resetUploads: boolean;
};
export default function ScFileUpload({
  label,
  multiple,
  onChange,
  name,
  accept,
  resetUploads,
}: ScFileUploadProps) {
  const [imageFiles, setImageFiles] = useState<any[]>([]);
  const onFileChange = useCallback((event: any) => {
    setImageFiles([]);
    let hasError = false;
    Array.from(event.target.files).forEach((img: any) => {
      const size = img.size / 1024 / 1024;

      if (size > 5) {
        hasError = true;
        alert("File size exceeded 5MB, consider optimizing your image");
      }
    });

    if (!hasError) {
      Array.from(event.target.files).forEach((file: any) => {
        const reader = new FileReader();
        reader.addEventListener("load", (e) => {
          setImageFiles((oldFiles: any): any => {
            return [...oldFiles, { url: e.target?.result, id: uuidv4() }];
          });
        });
        reader.readAsDataURL(file);
      });
    }
  }, []);

  useEffect(() => {
    setImageFiles([]);
  }, [resetUploads]);
  return (
    <Box>
      {imageFiles.length > 0 && (
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="subtitle2">Preview</Typography>
          </Grid>
          {imageFiles.map((file) => (
            <Grid item key={file.id} xs={3}>
              <ScImage
                src={file.url}
                alt={`${file.id} preview`}
                width={200}
                height={200}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <InputLabel htmlFor={name}>{label}</InputLabel>

      <TextField
        name={name}
        fullWidth
        type="file"
        inputProps={{
          multiple: multiple,
          accept: accept,
        }}
        onChange={onFileChange}
      />
    </Box>
  );
}
