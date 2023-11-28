import { ReactElement, useEffect } from "react";
import { ThemeProvider } from '@emotion/react'

import { theme } from '@enigma0z/brand-resources/theme/main'
import { Box, CssBaseline, Link, List, ListItem, Typography, responsiveFontSizes } from "@mui/material";
import { NextLink } from "../NextLink";

import { NitroPayConfig } from "@enigma0z/brand-resources";
import EnigmaSvg from "@enigma0z/brand-resources/res/enigma.svg";

import css from './index.module.css'
import { OverlayBackground } from "../Background";

// Basic dumb layout
export function Layout({ children }: { sidebar?: ReactElement, children: ReactElement }) {
  useEffect(() => {
    //@ts-ignore
    window['nitroAds'].createAd(BOTTOM_ANCHOR_ID, {
      ...NitroPayConfig,
      "format": "anchor",
      "anchor": "bottom",
      "anchorPersistClose": false,
      "report": {
        "enabled": true,
        "icon": true,
        "wording": "Report Ad",
        "position": "top-left"
      },
      "mediaQuery": "(min-width: 320px)"
    });
  }, [])
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
        <NextLink underline="none" href='/'>
          <Typography variant='h1' textAlign={'center'} marginBottom={'.25em'}>
            {"Meteor Tonight"} {/* Hero image instead of dumb text */}
          </Typography>
        </NextLink>
        <nav>
          <Box display="flex" flexDirection="row" marginBottom={'.5em'}>
            <Typography variant='h3' flex={1} textAlign={'center'}>
              <NextLink href='/content/view/category/news'>News</NextLink>
            </Typography>
            <Typography variant='h3' flex={1} textAlign={'center'}>
              <NextLink href='/content/view/category/guides'>Guides</NextLink>
            </Typography>
            <Typography variant='h3' flex={1} textAlign={'center'}>
              <NextLink href='/content/view/category/games'>Minigames</NextLink>
            </Typography>
            <Typography variant='h3' flex={1} textAlign={'center'}>
              <NextLink href='/content/view/category/tools'>Tools</NextLink>
            </Typography>
            <Typography variant='h3' flex={1} textAlign={'center'}>
              <NextLink href='/content/view/post/about'>About</NextLink>
            </Typography>
          </Box>
        </nav>
        {/* Page header content here  */}
        {/* Different for mobile */}
      </Box>
      <Box display={'flex'} flexDirection='column' width='100%'>
        {children}
      </Box>
    </Box>
    <Box height={120}>
      <Typography variant="body1" display={'block'} textAlign={'center'} position={'relative'} top={'3ex'}>
        <NextLink target="_blank" href="https://enigma0z.com/yt">YouTube</NextLink>{' | '}
        <NextLink target="_blank" href="https://enigma0z.com/discord">Discord</NextLink>{' | '}
        <NextLink target="_blank" href="https://enigma0z.com/twitter">Twitter</NextLink>{' | '}
        <NextLink target="_blank" href="https://enigma0z.com/merch">Merch</NextLink>
      </Typography>
      <EnigmaSvg preserveAspectRatio="xMidYMid meet" className={css.SvgFooter} />
    </Box>
  </ThemeProvider>)
}
