"use client";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

const AdminApp = () => {
  return (
    <Container sx={{ marginTop: "100px" }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <h1>Admin</h1>
        </Grid>
      </Grid>
    </Container>
  );
};
export default AdminApp;
