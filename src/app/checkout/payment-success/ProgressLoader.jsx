'use client'

import React, { useEffect, useState } from 'react'
import LinearProgress from '@mui/material/LinearProgress'
import Box from '@mui/material/Box'

const ProgressLoader = () => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(timer)
          return 100
        }
        return oldProgress + 2
      })
    }, 100) // ده هيكمل في 5 ثواني (100 * 50 = 5000ms)

    return () => clearInterval(timer)
  }, [])

  return (
    <Box sx={{ width: '100%', marginTop: 4 }}>
<LinearProgress
  variant="determinate"
  value={progress}
  sx={{
    height: 10,
    borderRadius: 5,
    backgroundColor: '#e0e0e0', // لون الخلفية (تقدر تعدله)
    '& .MuiLinearProgress-bar': {
      backgroundColor: '#07a169', // هنا لون البار نفسه
    },
  }}
/>
    </Box>
  )
}

export default ProgressLoader
