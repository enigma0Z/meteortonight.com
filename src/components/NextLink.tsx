import { Link as MuiLinkComponent, LinkProps as MuiLinkProps } from "@mui/material";
import NextLinkComponent, { LinkProps as NextLinkProps } from "next/link";

export function NextLink({children, ...props}: MuiLinkProps & NextLinkProps) {
  return (<MuiLinkComponent component={NextLinkComponent} {...props}>
    {children}
  </MuiLinkComponent>)
}