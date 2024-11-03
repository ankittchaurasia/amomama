import '@mantine/core/styles.css';
import '@mantine/tiptap/styles.css';
import "./globals.css";
import { ColorSchemeScript, MantineProvider } from '@mantine/core';


export const metadata = {
  title: "Scrape Amomama",
};

export default function RootLayout({children}) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript  />
      </head>
      <body>
        <MantineProvider >{children}</MantineProvider>
      </body>
    </html>
  );
}