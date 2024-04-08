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
  type?: string;
  placeholder?: string;
  error?: boolean;
  register: any;
};

export default function ScTextField({
  label,
  type,
  placeholder,
  register,
}: ScTextFieldProps) {
  return (
    <Box>
      <InputLabel htmlFor={register.name}>{label}</InputLabel>

      <Input fullWidth type={type} placeholder={placeholder} {...register} />
    </Box>
  );
}
