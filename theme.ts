import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#000000", // Black color
    },
    secondary: {
      main: "#007BFF", // Blue color
    },
    success: {
      main: "#28A745", // Green color
    },
    warning: {
      main: "#FFC107", // Yellow color
    },
  },
});

export default theme;
