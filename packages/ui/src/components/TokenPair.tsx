import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Collapse,
  IconButton,
  IconButtonProps,
  styled,
} from '@mui/material';
import { useState } from 'react';
import TokenForm from '../components/TokenForm';
import { TOKEN } from '../utils/const';
import PairInfo from './PairInfo';

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

function TokenPair({
  token0,
  token0Value,
  token0ChangeHandler,
  token0ValueChangeHandler,
  token1,
  token1Value,
  token1ChangeHandler,
  token1ValueChangeHandler,
  submitHandler,
  submitButtonText,
  lock,
  refresh,
  token0ValueLoading,
  token1ValueLoading,
}: {
  token0: TOKEN;
  token0Value: string;
  token0ChangeHandler: (token: TOKEN) => void;
  token0ValueChangeHandler: (value: string) => void;
  token1: TOKEN;
  token1Value: string;
  token1ChangeHandler: (token: TOKEN) => void;
  token1ValueChangeHandler: (value: string) => void;
  submitHandler: () => void;
  submitButtonText: string;
  lock?: boolean;
  refresh: number;
  token0ValueLoading: boolean;
  token1ValueLoading: boolean;
}) {
  const token0Number = parseFloat(token0Value);
  const token1Number = parseFloat(token1Value);
  const disabled =
    Number.isNaN(token0Number) ||
    Number.isNaN(token0Number) ||
    token0Number * token1Number <= 0;

  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  }));

  const buttonText = () => {
    let text = submitButtonText;

    if (disabled) {
      text = 'Please input amount';
    }

    if (token0ValueLoading || token1ValueLoading) {
      text = 'Cauculating amount';
    }

    return text;
  };

  return (
    <Card
      sx={{
        maxWidth: 475,
        pb: '20px',
        boxShadow: {
          xs: 0,
          sm: 1,
          md: 2,
        },
      }}
    >
      <CardContent
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <TokenForm
          token={token0}
          onTokenChange={token0ChangeHandler}
          tokenValue={token0Value}
          onTokenValueChange={token0ValueChangeHandler}
          loading={token0ValueLoading}
        />
        <TokenForm
          disabled={lock}
          token={token1}
          onTokenChange={token1ChangeHandler}
          tokenValue={token1Value}
          onTokenValueChange={token1ValueChangeHandler}
          loading={token1ValueLoading}
        />
      </CardContent>

      <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          sx={{ marginLeft: 'auto', marginRight: 'auto' }}
          variant="outlined"
          onClick={submitHandler}
          disabled={disabled || token0ValueLoading || token1ValueLoading}
        >
          {buttonText()}
        </Button>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <PairInfo token0={token0} token1={token1} refresh={refresh} />
        </CardContent>
      </Collapse>
    </Card>
  );
}

export default TokenPair;
