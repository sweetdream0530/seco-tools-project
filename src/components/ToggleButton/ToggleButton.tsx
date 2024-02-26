import * as React from 'react';
import Button from '@mui/material/Button';
import styles from './ToggleButton.scss';

interface Props {
  children?: Element | string;
  callback?: Function;
  selected?: boolean;
}

function ToggleButton({ children, callback, selected }: Props) {
  const [colour, setColour] = React.useState(true);

  const toggle = () => {
    setColour(!colour);
    if (callback) {
      callback();
    }
  };

  return (
    <Button
      className={styles.toggleButton}
      variant="contained"
      component="label"
      onClick={() => toggle()}

      color={selected ? 'secondary' : 'primary'}
    >
      { children }
    </Button>
  );
}
// style = { { color: colour ? "red" : "blue" } }
export default ToggleButton;
