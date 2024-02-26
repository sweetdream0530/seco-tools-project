import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Input from '@mui/material/Input';

import FormControlLabel, { Checkbox } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import styles from './DataInputWidget.scss';

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

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

export default function ModelUploadWidget(props: any) {
  const toggleSidebar = (e: any) => {
    props.sidebar;
  };

  const myArray = ['apple', 'banana', 'orange'];

  const myList = myArray.map((item) => <p>{item}</p>);

  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Stack className={styles.buttton} direction="column" alignItems="center" spacing={0.5}>
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <Button variant="contained" component="label" onClick={toggleSidebar}>
          X
        </Button>
        <Button variant="contained" component="label" onClick={toggleSidebar}>
          Y
        </Button>
        <Button variant="contained" component="label" onClick={toggleSidebar}>
          Z
        </Button>
      </Stack>
      <Stack direction="row" alignItems="center" spacing={0.5} style={{ flex: 1 }}>
        <Button variant="contained" component="label" onClick={toggleSidebar}>
          -X
        </Button>
        <Button variant="contained" component="label" onClick={toggleSidebar}>
          -Y
        </Button>
        <Button variant="contained" component="label" onClick={toggleSidebar}>
          -Z
        </Button>
      </Stack>
      <p>Blank Dimensions</p>
      <Stack direction="row" alignItems="center" spacing={0.5} style={{ flex: 1 }}>
        <Button variant="contained" component="label" onClick={toggleSidebar}>
          Fill From Part
        </Button>

        <Stack direction="column" alignItems="left" spacing={0}>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Checkbox defaultChecked color="primary" />
            Show Part
          </Stack>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Checkbox color="primary" />
            Show Blank
          </Stack>
        </Stack>
      </Stack>

      {/* <Stack direction="row" alignItems="left" spacing={0.5}>
        <Stack direction="column" alignItems="left" spacing={0}>
          <p>Part:</p>
          <p>Add before:</p>
          <p>Add after:</p>
          <p>Total:</p>
        </Stack>
        <Stack direction="column" alignItems="left" spacing={0}>
          <p>Axis X</p>
          <Input style={{ flex: 1}}></Input>
          <Input style={{ flex: 1}}></Input>
          <Input style={{ flex: 1}}></Input>
        </Stack>

        <Stack direction="column" alignItems="left" spacing={0}>
          <p>Axis Y</p>
          <Input style={{ flex: 1}}></Input>
          <Input style={{ flex: 1}}></Input>
          <Input style={{ flex: 1}}></Input>
        </Stack>

        <Stack direction="column" alignItems="left" spacing={0}>
          <p>Axis Z</p>
          <Input style={{ flex: 1}}></Input>
          <Input style={{ flex: 1}}></Input>
          <Input style={{ flex: 1}}></Input>
        </Stack>
      </Stack> */}

      <Stack direction="row" alignItems="center" spacing={0.5}>
        <p>Axis X, Length:</p>

        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </Stack>

      <Collapse in={expanded} timeout="auto" unmountOnExit>

        <Stack direction="column" alignItems="left" spacing={0}>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            Part:
            <Input style={{ flex: 1 }} />
          </Stack>

          <Stack direction="row" alignItems="center" spacing={0.5}>
            Add before:
            <Input style={{ flex: 1 }} />
          </Stack>

          <Stack direction="row" alignItems="center" spacing={0.5}>
            Add after:
            <Input style={{ flex: 1 }} />
          </Stack>

          <Stack direction="row" alignItems="center" spacing={0.5}>
            Total:
            <Input style={{ flex: 1 }} />
          </Stack>
        </Stack>

      </Collapse>

      <p>Axis Y, Length:</p>

      <Stack direction="column" alignItems="left" spacing={0}>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          Part:
          <Input style={{ flex: 1 }} />
        </Stack>

        <Stack direction="row" alignItems="center" spacing={0.5}>
          Add before:
          <Input style={{ flex: 1 }} />
        </Stack>

        <Stack direction="row" alignItems="center" spacing={0.5}>
          Add after:
          <Input style={{ flex: 1 }} />
        </Stack>

        <Stack direction="row" alignItems="center" spacing={0.5}>
          Total:
          <Input style={{ flex: 1 }} />
        </Stack>
      </Stack>

      <p>Axis Z, Length:</p>

      <Stack direction="column" alignItems="left" spacing={0}>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          Part:
          <Input style={{ flex: 1 }} />
        </Stack>

        <Stack direction="row" alignItems="center" spacing={0.5}>
          Add before:
          <Input style={{ flex: 1 }} />
        </Stack>

        <Stack direction="row" alignItems="center" spacing={0.5}>
          Add after:
          <Input style={{ flex: 1 }} />
        </Stack>

        <Stack direction="row" alignItems="center" spacing={0.5}>
          Total:
          <Input style={{ flex: 1 }} />
        </Stack>
      </Stack>
      <tbody>{myList}</tbody>
    </Stack>
  );
}
