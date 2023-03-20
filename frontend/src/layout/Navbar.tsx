import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {useTheme} from '@mui/material/styles';
import {
  AppBar,
  Toolbar,
  Button,
  Tooltip,
  Icon,
  Typography,
  Box,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import InfoIcon from '@mui/icons-material/Info';
import SearchIcon from '@mui/icons-material/Search';
import ShapePublisherIcon from '@mui/icons-material/DynamicForm';
import AnnotateIcon from '@mui/icons-material/LocalOffer';
import MenuIcon from '@mui/icons-material/Menu';

import OrcidLogin from '../components/OrcidLogin';
import UserSettingsPopper from '../components/UserSettingsPopper';
import {useStore} from '@nanostores/react';
import {userSettings} from '../utils/nanostores';

export default function Navbar(props: any) {
  const {window} = props;
  const theme = useTheme();
  const $userSettings = useStore(userSettings)

  // Links shown in the nav
  const leftLinks = [
    {
      text: 'Browse Nanopubs',
      tooltip: '🔍️ Browse Nanopublications',
      href: `/`,
      icon: <SearchIcon />
    },
    {
      text: 'Annotate text',
      tooltip: '🏷️ Annotate biomedical text, and publish the assertion as Nanopublication',
      href: `/annotate`,
      icon: <AnnotateIcon />
    },
    {
      text: 'Shape form',
      tooltip: '📝 Define and publish RDF nanopublications from SHACL shapes',
      href: `/shape-publisher`,
      icon: <ShapePublisherIcon />
    }
  ];
  const rightLinks = [
    {
      text: 'API',
      tooltip: '📖 Access the OpenAPI documentation of the API used by this service',
      href: `${$userSettings.api}/docs`,
      icon: (
        <Icon style={{display: 'flex', marginRight: '8px', padding: '0px'}}>
          <Image
            src="/openapi_logo.svg"
            alt="OpenAPI"
            width={18}
            height={18}
            // fill
          />
        </Icon>
      )
    },
    {
      tooltip: 'ℹ️ About the Knowledge Collaboratory',
      smallText: 'About',
      href: '/about',
      icon: <InfoIcon />
    },
    {
      tooltip: '🛸 Source code on GitHub',
      smallText: 'Source code',
      href: 'https://github.com/MaastrichtU-IDS/knowledge-collaboratory',
      icon: <GitHubIcon />
    }
  ];

  // Drawer nav for small screens
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(prevState => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{textAlign: 'center'}}>
      <Typography variant="h6" sx={{my: 2}}>
        Knowledge Collaboratory
      </Typography>
      <Divider />
      <List>
        {leftLinks.map(item => (
          <Link key={item.href} href={item.href} style={{textDecoration: 'none', color: 'inherit'}}>
            <ListItem disablePadding>
              <ListItemButton sx={{textAlign: 'center'}}>
                {item.icon}
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
        <Divider />
        {rightLinks.map(item => (
          <Link
            key={item.href}
            href={item.href}
            target={item.href.startsWith('http') ? '_blank' : '_self'}
            style={{textDecoration: 'none', color: 'inherit'}}
          >
            <ListItem disablePadding>
              <ListItemButton sx={{textAlign: 'center'}}>
                {item.icon}
                <ListItemText primary={item.text || item.smallText} />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
    </Box>
  );
  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <>
      <AppBar title="" position="static" component="nav">
        <Toolbar variant="dense">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{mr: 2, display: {sm: 'none'}}}
          >
            <MenuIcon />
          </IconButton>

          <Link href="/" style={{alignItems: 'center', display: 'flex'}}>
            <Tooltip title="☑️ Knowledge Collaboratory">
              <Image src="icon.png" alt="Logo" width={32} height={32} />
            </Tooltip>
          </Link>

          <Box style={{width: '100%'}} sx={{display: {xs: 'none', sm: 'flex'}}}>
            {leftLinks.map(item => (
              <Link key={item.href} href={item.href} className="linkButton">
                <Tooltip title={item.tooltip}>
                  <Button color="inherit" style={{color: '#fff', textTransform: 'none', marginLeft: theme.spacing(2)}}>
                    {item.icon}&nbsp;{item.text}
                  </Button>
                </Tooltip>
              </Link>
            ))}
            <div className="flexGrow"></div>

            <OrcidLogin />

            <UserSettingsPopper />

            {rightLinks.map(item => (
              <Link
                key={item.href}
                target={item.href.startsWith('http') ? '_blank' : '_self'}
                href={item.href}
                className="linkButton"
              >
                <Tooltip title={item.tooltip}>
                  <Button color="inherit" style={{color: '#fff', textTransform: 'none', marginLeft: theme.spacing(2)}}>
                    {item.icon}&nbsp;{item.text}
                  </Button>
                </Tooltip>
              </Link>
            ))}
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="nav">
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true // Better open performance on mobile.
          }}
          sx={{
            display: {xs: 'block', sm: 'none'},
            '& .MuiDrawer-paper': {boxSizing: 'border-box', width: 240}
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </>
  );
}
