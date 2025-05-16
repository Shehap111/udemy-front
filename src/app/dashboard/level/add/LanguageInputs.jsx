import { Box, TextField } from "@mui/material";
import React from "react";

const languages = [
  { code: 'en', label: 'English' },
  { code: 'ar', label: 'Arabic' },
  { code: 'de', label: 'German' },
  { code: 'es', label: 'Spanish' }
];

const LanguageInputs = React.memo(({ value, onChange, label, multiline = false, rows = 1 }) => {
  const handleChange = (lang, val) => {
    onChange({ [lang]: val });
  };

  return (
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
      {languages.map((lang) => (
        <TextField
          key={lang.code}
          label={`${label} (${lang.label})`}
          value={value[lang.code] || ''}
          onChange={(e) => handleChange(lang.code, e.target.value)}
          required
          multiline={multiline}
          rows={rows}
          size="small"
        />
      ))}
    </Box>
  );
});

LanguageInputs.displayName = 'LanguageInputs';

export default LanguageInputs;