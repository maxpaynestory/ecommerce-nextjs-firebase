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
  defaultValue: string;
  name: string;
};

export default function ScTextField({
  label,
  type,
  defaultValue,
  name,
}: ScTextFieldProps) {
  return (
    <TextField
      label={label}
      type={type}
      variant="outlined"
      defaultValue={defaultValue}
      name={name}
    />
  );
}
