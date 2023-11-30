import { ReactElement, useEffect } from "react";
import { ThemeProvider } from '@emotion/react'

import { theme } from '@enigma0z/brand-resources/theme/main'
import { Box, CssBaseline, Typography, responsiveFontSizes } from "@mui/material";
import { NextLink } from "../NextLink";

import EnigmaSvg from "@enigma0z/brand-resources/res/enigma.svg";

import css from './index.module.css'
import { OverlayBackground } from "../Background";

// Basic dumb layout
export function Layout({ children }: { sidebar?: ReactElement, children: ReactElement }) {
  return (<ThemeProvider theme={responsiveFontSizes(theme)}>
    <OverlayBackground opacity='10%' />
    <CssBaseline />
    <Box sx={{
      marginLeft: 'auto',
      marginRight: 'auto',
      [theme.breakpoints.up('md')]: {
        width: '800px'
      },
      [theme.breakpoints.down('md')]: {
        padding: '.5em',
        width: '100%'
      }
    }}>
      <Box display='flex' flexDirection='column' width='100%'>
        {/* Page header content here  */}
        <NextLink href='/' style={{textAlign: 'center'}}>
          <img src="/img/banner.png" width={'100%'} />
        </NextLink>
        <nav>
          <Box display="flex" flexDirection="row" marginBottom={'.5em'}>
            <Typography variant='h3' flex={1} textAlign={'center'}>
              <NextLink href='/content/view/category/blog'>blog</NextLink>
            </Typography>
            <Typography variant='h3' flex={1} textAlign={'center'}>
              <NextLink href='/content/view/category/music'>music</NextLink>
            </Typography>
            <Typography variant='h3' flex={1} textAlign={'center'}>
              <NextLink href='/content/view/post/about'>about</NextLink>
            </Typography>
          </Box>
        </nav>
        {/* Different for mobile */}
      </Box>
      <Box display={'flex'} flexDirection='column' width='100%'>
        {children}
      </Box>
    </Box>
    <Box height={120}>
      {/* <!-- Footer --> */}
    </Box>
  </ThemeProvider>)
}
