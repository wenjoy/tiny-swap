import { Box, Link, Typography } from '@mui/material';
import ReactGA from 'react-ga';
import { useRouteError } from 'react-router-dom';

type RouteError = {
  statusText: string;
  message: string;
};

function ErrorPage() {
  const error: RouteError = useRouteError() as RouteError;
  console.error(error);

  ReactGA.event({
    category: 'Error',
    action: error.message,
    label: 'Error page',
  });

  return (
    <Box id="error-page">
      <Typography variant="h3">Oops!</Typography>
      <Typography>Sorry, an unexpected error has occurred.</Typography>
      <Link href="/">Go back to home page</Link>
    </Box>
  );
}
export default ErrorPage;
