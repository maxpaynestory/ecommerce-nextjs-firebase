"use client";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
export default function Product() {
  return (
    <Container sx={{ marginTop: "100px" }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <h1>Products</h1>
        </Grid>
      </Grid>
    </Container>
  );
}
