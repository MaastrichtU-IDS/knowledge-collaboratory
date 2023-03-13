import * as React from 'react';
import {Button, ButtonGroup, ClickAwayListener, Grow, Paper, Popper, MenuItem, MenuList} from '@mui/material';
import Icon from './Icon';

export default function DropdownButton({onChange, onClick, options, loggedIn}: any) {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(options.length - 1);

  const handleClick = () => {
    onClick();
    // console.info(`You clicked ${options[selectedIndex]}`);
  };

  const handleMenuItemClick = (event: React.MouseEvent<HTMLLIElement, MouseEvent>, index: number) => {
    setSelectedIndex(index);
    setOpen(false);
    onChange(event, index);
  };

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen);
  };

  const handleClose = (event: Event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setOpen(false);
  };

  return (
    <React.Fragment>
      <ButtonGroup
        variant="contained"
        color="success"
        style={{width: 'fit-content'}}
        ref={anchorRef}
        aria-label="split button"
      >
        <Button type="submit" startIcon={<Icon name="auto_fix_high" style={{color: 'white'}} />} onClick={handleClick}>
          {options[selectedIndex]}
        </Button>
        <Button
          size="small"
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={handleToggle}
        >
          <Icon name="arrow_drop_down" />
        </Button>
      </ButtonGroup>
      <Popper
        // @ts-ignore
        sx={{
          zIndex: 1
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({TransitionProps, placement}) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom'
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {options.map((option: any, index: any) => (
                    <MenuItem
                      key={option}
                      // disabled={index === 0 && !loggedIn}
                      // Disable OpenAI model if not logged in
                      selected={index === selectedIndex}
                      onClick={event => handleMenuItemClick(event, index)}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </React.Fragment>
  );
}
