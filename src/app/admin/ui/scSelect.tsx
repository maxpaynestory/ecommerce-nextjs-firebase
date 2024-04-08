import * as React from "react";
import { Box, InputLabel, Select, MenuItem } from "@mui/material";

type ScSelectProps = {
  name: string;
  label: string;
  placeholder?: string;
  error?: boolean;
  menuItems: string[];
  value: string;
  onChange: () => void;
};

export default function ScSelect({
  label,
  menuItems,
  name,
  value,
  onChange,
}: ScSelectProps) {
  return (
    <Box>
      <InputLabel htmlFor={name}>{label}</InputLabel>

      <Select name={name} value={value} onChange={onChange} fullWidth>
        {menuItems.map((item, index) => (
          <MenuItem value={item} key={index}>
            {item}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
}
