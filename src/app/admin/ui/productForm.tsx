"use client";
import { useCallback, useState, useEffect } from "react";
import { Product } from "../../entities/product";
import { useAppDispatch } from "../../../lib/hooks";
import {
  Grid,
  Typography,
  Paper,
  Button,
  Backdrop,
  CircularProgress,
  FormControl,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import ScTextField from "./scTextField";
import ScTextArea from "./scTextArea";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

type ProductFormProps = {
  product?: Product | null;
};

const vSchema = yup.object().shape({
  name: yup.string().required("Product Name is required"),
  brand: yup.string().required("Product Brand is required"),
});

export default function ProductForm({ product }: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm({ resolver: yupResolver(vSchema) });

  const onFormSubmit = useCallback(
    (form: any) => {
      if (product?.id) {
        //dispatch(updateOrg(form));
      } else {
        //dispatch(createOrg(form));
      }
    },
    [product]
  );
  let initialValues: any = {
    organization_name: "",
    website_url: "",
  };
  if (product?.id) {
    initialValues = product;
  }
  useEffect(() => {
    clearErrors();
  }, [clearErrors, product]);
  return (
    <Paper elevation={3} sx={{ padding: "2rem" }}>
      <Typography variant="h5" sx={{ mb: "1em" }}>
        {product ? "Edit" : "Create New"}
      </Typography>
      {errors && Object.keys(errors).length > 0 && (
        <div className="alert alert-danger" role="alert">
          <p>Please fix the following errors:</p>
          <ul>
            {Object.values(errors).map((error: any, index) => (
              <li key={index}>{error.message}</li>
            ))}
          </ul>
        </div>
      )}
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <Grid container spacing={4}>
          <Grid item xs={6}>
            <ScTextField
              label="Product Name"
              type="text"
              defaultValue={product?.name}
              {...register("name")}
            />
          </Grid>
          <Grid item xs={6}>
            <ScTextField
              label="Brand"
              type="text"
              defaultValue={product?.brand}
              {...register("brand")}
            />
          </Grid>
          <Grid item xs={12}>
            <ScTextArea
              label="Product Decription"
              defaultValue={product?.description}
              {...register("description")}
            />
          </Grid>
          <Grid item xs={6}>
            <ScTextField
              label="Price"
              type="number"
              defaultValue={product?.price}
              {...register("price")}
            />
          </Grid>
          <Grid item xs={6}>
            <ScTextField
              label="Max Quantity"
              type="number"
              defaultValue={product?.maxQuantity}
              {...register("maxQuantity")}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Button variant="contained" type="submit">
              {product ? "Update" : "Add"}
            </Button>
          </Grid>
        </Grid>
      </form>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Paper>
  );
}
