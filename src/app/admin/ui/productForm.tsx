"use client";
import { useCallback, useState } from "react";
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

type ProductFormProps = {
  product?: Product | null;
};

export default function ProductForm({ product }: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    // @ts-ignore
  } = useForm();

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
  return (
    <Paper elevation={3} sx={{ padding: "2rem" }}>
      <Typography variant="h5" sx={{ mb: "1em" }}>
        {product ? "Edit" : "Create New"}
      </Typography>

      <ScTextField
        label="Product Name"
        type="text"
        defaultValue={product?.name as string}
        name="asdasd"
      />
      <ScTextField
        label="Brand"
        type="text"
        defaultValue={product?.brand as string}
        name="brand"
      />
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Paper>
  );
}
