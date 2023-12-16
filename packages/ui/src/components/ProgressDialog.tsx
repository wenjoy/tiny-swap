import {
  Dialog,
  DialogContent,
  LinearProgress,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';

function ProgressDialog({
  totalStage = 1,
  currentStage = 1,
}: {
  totalStage?: number;
  currentStage?: number;
}) {
  const [progress, setProgress] = useState(0);
  const breakpoint = (currentStage / totalStage) * 100;

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === breakpoint) {
          return breakpoint - 1;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, breakpoint);
      });
    }, 500);

    if (breakpoint > 100) {
      clearInterval(timer);
    }

    return () => {
      clearInterval(timer);
    };
  }, [breakpoint]);

  return (
    <Dialog open={currentStage <= totalStage && currentStage !== 0}>
      <DialogContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Transaction is in progress, please don't close current page
        </Typography>
        <LinearProgress variant="determinate" value={progress} />
      </DialogContent>
    </Dialog>
  );
}

export default ProgressDialog;
