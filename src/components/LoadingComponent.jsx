import { CircularProgress, Box } from "@mui/material";

const LoadingComponent = () => (
  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
    <CircularProgress />
  </Box>
);
export default LoadingComponent;