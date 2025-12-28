import React, { useState } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Box,
  Divider,
  useTheme,
  useMediaQuery,
  Container
} from '@mui/material'
import {
  Menu as MenuIcon,
  Person,
  EventNote,
  Assignment,
  Receipt,
  LocalHospital,
  Dashboard,
  Settings,
  ImportExport,
  Print
} from '@mui/icons-material'
import { Link, useLocation } from 'react-router-dom'

interface NavigationProps {
  onImportData: () => void
  onExportData: () => void
  onPrint: () => void
}

const Navigation: React.FC<NavigationProps> = ({ onImportData, onExportData, onPrint }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen)
  }

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/' },
    { text: 'Patients', icon: <Person />, path: '/patients' },
    { text: 'Appointments', icon: <EventNote />, path: '/appointments' },
    { text: 'Treatments', icon: <Assignment />, path: '/treatments' },
    { text: 'Invoices', icon: <Receipt />, path: '/invoices' },
  ]

  const utilityItems = [
    { text: 'Settings', icon: <Settings />, path: '/settings' },
    { text: 'Import Data', icon: <ImportExport />, action: onImportData },
    { text: 'Export Data', icon: <ImportExport />, action: onExportData },
    { text: 'Print', icon: <Print />, action: onPrint },
  ]

  const NavigationContent = () => (
    <Box>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              onClick={() => isMobile && setDrawerOpen(false)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 2 }} />

      <List>
        <ListItem>
          <Typography variant="h6" color="primary">
            Utilities
          </Typography>
        </ListItem>
        {utilityItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => {
                if (item.action) {
                  item.action()
                }
                if (isMobile) {
                  setDrawerOpen(false)
                }
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <>
      <AppBar position="sticky" elevation={2}>
        <Container maxWidth="lg">
          <Toolbar>
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            <LocalHospital sx={{ mr: 2 }} />
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to="/"
              sx={{
                flexGrow: isMobile ? 1 : 0,
                textDecoration: 'none',
                color: 'inherit',
                fontWeight: 'bold'
              }}
            >
              Dental Practice Manager
            </Typography>

            {!isMobile && (
              <Box sx={{ flexGrow: 1, display: 'flex', ml: 4 }}>
                {menuItems.map((item) => (
                  <Button
                    key={item.text}
                    color="inherit"
                    component={Link}
                    to={item.path}
                    sx={{
                      mx: 1,
                      backgroundColor: location.pathname === item.path ? 'rgba(255,255,255,0.1)' : 'transparent'
                    }}
                  >
                    {item.text}
                  </Button>
                ))}
              </Box>
            )}

            {!isMobile && (
              <Box>
                <IconButton color="inherit" onClick={handleMenuOpen}>
                  <Settings />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  {utilityItems.map((item) => (
                    <MenuItem
                      key={item.text}
                      onClick={() => {
                        handleMenuClose()
                        if (item.action) {
                          item.action()
                        }
                      }}
                    >
                      {item.text}
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
            <LocalHospital sx={{ mr: 1, verticalAlign: 'middle' }} />
            Dental Practice
          </Typography>
        </Box>
        <Divider />
        <NavigationContent />
      </Drawer>
    </>
  )
}

export default Navigation