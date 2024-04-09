import { MuiColorInput } from "mui-color-input";
import {
  TextField,
  Stack,
  InputLabel,
  Box,
  FormControl,
  Input,
} from "@mui/material";

type ScColorInputProps = {
  onChange: (newVal: string[]) => void;
  value: string;
  name: string;
  label: string;
};

export default function ScColorInput({
  value,
  onChange,
  name,
  label,
}: ScColorInputProps) {
  return (
    <Box>
      <InputLabel htmlFor={name}>{label}</InputLabel>

      <MuiColorInput
        name={name}
        format="hex"
        value={value}
        onChange={(newVal) => {
          if (newVal.length === 0) {
            onChange([]);
          } else {
            onChange([newVal]);
          }
        }}
      />
    </Box>
  );
}
