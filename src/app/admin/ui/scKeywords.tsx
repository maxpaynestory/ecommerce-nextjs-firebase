import {
  TextField,
  Stack,
  InputLabel,
  Box,
  FormControl,
  Input,
  Autocomplete,
  Chip,
} from "@mui/material";

type ScKeywordsProps = {
  label: string;
  name: string;
  value: any;
  onChange: any;
};

export default function ScKeywords({
  label,
  name,
  value,
  onChange,
}: ScKeywordsProps) {
  return (
    <Box>
      <InputLabel htmlFor={name}>{label}</InputLabel>
      <Autocomplete
        multiple
        options={[]}
        defaultValue={value}
        key={value}
        id={name}
        freeSolo
        onChange={(e, data) => onChange(data)}
        renderTags={(values: string[], getTagProps) =>
          values.map((option: string, index: number) => {
            const { key, onDelete } = getTagProps({ index });
            return (
              <Chip
                variant="filled"
                label={option}
                key={key}
                onDelete={onDelete}
              />
            );
          })
        }
        renderInput={(params) => <TextField {...params} />}
      />
    </Box>
  );
}
