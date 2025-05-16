import { 
  Box, Typography, IconButton, 
  Collapse, TextField 
} from "@mui/material";
import { Delete, ExpandLess, ExpandMore } from "@mui/icons-material";
import React, { useCallback } from "react";
import LanguageInputs from "./LanguageInputs";

const LessonItem = React.memo(({ 
  lesson, 
  index, 
  expanded, 
  onUpdate, 
  onRemove, 
  onToggleExpand 
}) => {
  const handleFieldChange = useCallback((field, lang, value) => {
    if (lang) {
      onUpdate(index, field, { ...lesson[field], [lang]: value });
    } else {
      onUpdate(index, field, value);
    }
  }, [index, lesson, onUpdate]);

  return (
    <Box sx={{ mb: 2, border: "1px solid #ddd", borderRadius: 1 }}>
      <Box 
        sx={{ 
          p: 2, 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          cursor: "pointer",
          backgroundColor: "#f5f5f5"
        }}
        onClick={() => onToggleExpand(index)}
      >
        <Typography>
          {lesson.lessonTitle.en || `Lesson ${index + 1}`}
        </Typography>
        <Box>
          <IconButton 
            onClick={(e) => {
              e.stopPropagation();
              onRemove(index);
            }}
            color="error"
            size="small"
          >
            <Delete />
          </IconButton>
          <IconButton size="small">
            {expanded === index ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>
      </Box>

      <Collapse in={expanded === index}>
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle2" gutterBottom>Lesson Title</Typography>
          <LanguageInputs
            value={lesson.lessonTitle}
            onChange={(title) => handleFieldChange('lessonTitle', Object.keys(title)[0], Object.values(title)[0])}
            label="Title"
          />

          <TextField
            fullWidth
            label="Video URL"
            value={lesson.videoUrl}
            onChange={(e) => handleFieldChange('videoUrl', null, e.target.value)}
            required
            size="small"
            sx={{ my: 2 }}
          />

          <Typography variant="subtitle2" gutterBottom>Lesson Content</Typography>
          <LanguageInputs
            value={lesson.content}
            onChange={(content) => handleFieldChange('content', Object.keys(content)[0], Object.values(content)[0])}
            label="Content"
            multiline
            rows={3}
          />
        </Box>
      </Collapse>
    </Box>
  );
});

LessonItem.displayName = 'LessonItem';

export default LessonItem;