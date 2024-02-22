"use client";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import AppBar from "./ui/navBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";

const AdminApp = () => {
  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar />
        <Container sx={{ marginTop: "100px" }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <h1>Admin</h1>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};
export default AdminApp;
