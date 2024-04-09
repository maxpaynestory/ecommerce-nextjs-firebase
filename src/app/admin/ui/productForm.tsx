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
import { useForm, Controller } from "react-hook-form";
import ScTextField from "./scTextField";
import ScTextArea from "./scTextArea";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ScSelect from "./scSelect";
import ScKeywords from "./scKeywords";
import { MuiColorInput } from "mui-color-input";
import ScColorInput from "./scColorInput";

type ProductFormProps = {
  product?: Product | null;
};

const vSchema = yup.object().shape({
  name: yup.string().required("Product Name is required"),
  brand: yup.string().required("Product Brand is required"),
  description: yup.string().required("Product Description is required"),
  price: yup.number().moreThan(0),
  maxQuantity: yup.number().moreThan(0),
  keywords: yup.array().min(1),
  sizes: yup.array().length(1),
  availableColors: yup.array().length(1),
});

const getInitValues = () => {
  return {
    name: "",
    brand: "No brand",
    description: "",
    price: 0,
    maxQuantity: 0,
    keywords: [],
    sizes: [],
    availableColors: ["#000000"],
  };
};

export default function ProductForm({ product }: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  let initialValues: any = getInitValues();
  if (product?.id) {
    initialValues = product;
  }
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    reset,
    control,
  } = useForm({
    resolver: yupResolver(vSchema),
    values: initialValues,
  });

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
              type="text"
              label="Product Name"
              register={register("name")}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="brand"
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <ScSelect
                  name={name}
                  label="Brand"
                  menuItems={[
                    "Safina Lawn Printed Collection Vol 11",
                    "Safina Lawn Printed Collection Vol 10",
                    "No brand",
                  ]}
                  value={value}
                  onChange={onChange}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <ScTextArea
              label="Product Decription"
              register={register("description")}
            />
          </Grid>
          <Grid item xs={6}>
            <ScTextField
              label="Price"
              type="number"
              register={register("price")}
            />
          </Grid>
          <Grid item xs={6}>
            <ScTextField
              label="Max Quantity"
              type="number"
              register={register("maxQuantity")}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="keywords"
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <ScKeywords
                  label="Keywords"
                  name={name}
                  value={value}
                  onChange={onChange}
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="sizes"
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <ScKeywords
                  label="Sizes"
                  name={name}
                  value={value}
                  onChange={onChange}
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="availableColors"
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <ScColorInput
                  onChange={onChange}
                  value={value[0]}
                  name={name}
                  label="Color"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Button variant="contained" type="submit">
              {product ? "Update" : "Add"}
            </Button>
            <Button variant="outlined" onClick={() => reset()}>
              Reset
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
