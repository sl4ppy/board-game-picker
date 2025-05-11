import { extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

const customTheme = extendTheme({
  config: {
    initialColorMode: 'dark', // Set the default color mode to dark
    useSystemColorMode: false, // Disable system color mode preference
  },
  styles: {
    global: (props) => ({
      body: {
        bg: mode('gray.100', 'gray.900')(props), // Light mode: gray.100, Dark mode: gray.900
        color: mode('gray.800', 'gray.200')(props), // Light mode: gray.800, Dark mode: gray.200
      },
    }),
  },
  colors: {
    brand: {
      50: '#E3FDFD',
      100: '#CBF1F5',
      200: '#A6E3E9',
      300: '#71C9CE',
      400: '#45B8C7',
      500: '#2D9CDB', // Primary brand color
      600: '#1A73E8',
      700: '#1664C0',
      800: '#0F4A8A',
      900: '#09316A',
    },
  },
  components: {
    Button: {
      baseStyle: {
        _focus: {
          boxShadow: 'none',
        },
      },
      variants: {
        solid: (props) => ({
          bg: mode('brand.500', 'brand.400')(props),
          color: 'white',
          _hover: {
            bg: mode('brand.600', 'brand.300')(props),
          },
        }),
      },
    },
    Link: {
      baseStyle: (props) => ({
        color: mode('brand.500', 'brand.300')(props),
        _hover: {
          textDecoration: 'underline',
        },
      }),
    },
  },
});

export default customTheme;