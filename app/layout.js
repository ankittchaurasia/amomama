import '@mantine/core/styles.css';
import "./globals.css";
import { ColorSchemeScript, MantineProvider } from '@mantine/core';


export const metadata = {
  title: "Scrape Amomama",
};

export default function RootLayout({children}) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript forceColorScheme="light"  />
      </head>
      <body>
        <MantineProvider forceColorScheme="light" >{children}</MantineProvider>
      </body>
    </html>
  );
}