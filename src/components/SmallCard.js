import React from 'react';
import { Paper, Typography } from '@mui/material';

const SmallCard = ({ title, isSelected, onClick }) => {
  return (
    <Paper 
      elevation={isSelected ? 6 : 1}
      sx={{ 
        p: 2, 
        cursor: 'pointer',
        bgcolor: isSelected ? 'primary.light' : 'background.paper',
        color: isSelected ? 'white' : 'text.primary',
        transition: 'all 0.3s ease',
        '&:hover': {
          elevation: 3,
          bgcolor: isSelected ? 'primary.light' : 'grey.100'
        }
      }}
      onClick={onClick}
    >
      <Typography variant="h6" align="center">
        {title}
      </Typography>
    </Paper>
  );
};

export default SmallCard;