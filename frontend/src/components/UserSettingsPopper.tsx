import React, {useContext} from 'react'
import {useTheme} from '@mui/material/styles'
import {
  Button,
  Tooltip,
  Typography,
  Popover,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper
} from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings'

import {useStore} from '@nanostores/react'
import {userSettings} from '../utils/nanostores'

export default function UserSettingsPopper() {
  const theme = useTheme()
  const $userSettings = useStore(userSettings)

  // Popover settings
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  return (
    <div>
      <Tooltip title="Application settings">
        <Button
          onClick={handleClick}
          aria-describedby={id}
          color="inherit"
          style={{color: '#fff', textTransform: 'none', marginLeft: theme.spacing(2)}}
        >
          <SettingsIcon />
        </Button>
      </Tooltip>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
      >
        <Paper elevation={4} style={{padding: theme.spacing(2), textAlign: 'center'}}>
          <Typography variant="h6" style={{marginBottom: theme.spacing(2)}}>
            Settings
          </Typography>
          {/* Dropdown to choose server */}
          <FormControl style={{marginRight: theme.spacing(2)}}>
            <InputLabel id="server-select-label">Server</InputLabel>
            <Select
              labelId="server-select-label"
              id="server-select"
              value={$userSettings.api}
              label="Server"
              size="small"
              onChange={event => {
                event.preventDefault()
                userSettings.set({...$userSettings, api: event.target.value as string})
              }}
            >
              <MenuItem value="https://api.collaboratory.semanticscience.org">IDS development server</MenuItem>
              <MenuItem value="https://collaboratory-api.ci.transltr.io">ITRB CI server</MenuItem>
              <MenuItem value="https://collaboratory-api.test.transltr.io">ITRB test server</MenuItem>
              <MenuItem value="https://collaboratory-api.transltr.io">ITRB production server</MenuItem>
            </Select>
          </FormControl>
        </Paper>
      </Popover>
    </div>
  )
}
