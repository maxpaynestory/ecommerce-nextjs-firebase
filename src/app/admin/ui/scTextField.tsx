import {
  TextField,
  Stack,
  InputLabel,
  Box,
  FormControl,
  Input,
} from "@mui/material";

type ScTextFieldProps = {
  label: string;
  type: string;
  defaultValue: any;
  name: string;
  placeholder?: string;
  error?: boolean;
};

export default function ScTextField({
  label,
  type,
  defaultValue,
  name,
  placeholder,
}: ScTextFieldProps) {
  return (
    <>
      <Box>
        <InputLabel htmlFor={name}>{label}</InputLabel>

        <Input
          fullWidth
          type={type}
          placeholder={placeholder}
          defaultValue={defaultValue}
          name={name}
          id={name}
        />
      </Box>
    </>
  );
}
