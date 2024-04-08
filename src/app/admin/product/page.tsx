"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import firebaseClientInstance from "../../../firebase/firebaseClient";
import { createColumnHelper } from "@tanstack/react-table";
import { Product as ProductEntity } from "../../entities/product";
import { displayMoneyInPKR } from "../../../helpers/utils";
import ScTable from "../ui/scTable";
import {
  CircularProgress,
  Container,
  Backdrop,
  Grid,
  ButtonGroup,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRouter } from "next/navigation";
import ProductForm from "../ui/productForm";
import ScImage from "../../components/common/scImage";

const columnHelper = createColumnHelper<ProductEntity>();

export default function Product() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ProductEntity[]>([]);
  const [formOrg, setFOrmOrg] = useState<ProductEntity | null>(null);
  const router = useRouter();

  const getProductsForAdmin = useCallback(() => {
    setLoading(false);
    firebaseClientInstance.getProductsAdmin().then((snapshot) => {
      if (!snapshot.empty) {
        setLoading(false);
        const products: ProductEntity[] = [];
        snapshot.forEach((doc) => {
          const product = ProductEntity.createFromDoc(doc.id, doc.data());
          products.push(product);
        });
        setData(products);
      }
    });
  }, []);

  const EditProduct = useCallback(
    (id: string) => {
      const product: any = data.find((o: ProductEntity) => o.id === id);
      setFOrmOrg(product);
      window.scrollTo(0, 0);
    },
    [data]
  );

  useEffect(() => {
    getProductsForAdmin();
  }, [getProductsForAdmin]);

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "image",
        cell: (info) => {
          const product = info.row.original;

          return (
            <ScImage
              src={product.image}
              alt={`${product.name} image`}
              width={50}
              height={50}
            />
          );
        },
      }),
      columnHelper.accessor("id", {
        cell: (info) => info.getValue(),
        header: "ID",
        footer: (info) => info.column.id,
        enableColumnFilter: false,
      }),
      columnHelper.accessor("name", {
        cell: (info) => info.getValue(),
        header: "Name",
        footer: (info) => info.column.id,
        enableColumnFilter: false,
      }),
      columnHelper.accessor("brand", {
        cell: (info) => info.getValue(),
        header: "Brand",
        footer: (info) => info.column.id,
        enableColumnFilter: false,
      }),
      columnHelper.accessor("price", {
        cell: (info) => displayMoneyInPKR(info.getValue()),
        header: "Price",
        footer: (info) => info.column.id,
        enableColumnFilter: false,
      }),
      columnHelper.accessor("quantity", {
        cell: (info) => info.getValue(),
        header: "Qty",
        footer: (info) => info.column.id,
        enableColumnFilter: false,
      }),
      columnHelper.display({
        id: "actions",
        cell: (info) => {
          const id = info.row.original.id as string;
          return (
            <ButtonGroup
              disableElevation
              variant="contained"
              aria-label="Disabled elevation buttons"
            >
              <IconButton
                aria-label="edit"
                title="Edit Organization"
                color="success"
                onClick={() => EditProduct(id)}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                aria-label="delete"
                title="Remove Organization"
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </ButtonGroup>
          );
        },
        header: "",
        enableColumnFilter: false,
      }),
    ],
    [EditProduct]
  );

  return (
    <Container sx={{ marginTop: "100px" }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <h1>Products</h1>
        </Grid>
        <Grid item xs={12}>
          <ProductForm product={formOrg} />
        </Grid>
        <Grid item xs={12}>
          <h3>
            Products ({data.length} / {data.length})
          </h3>
        </Grid>
        <Grid item xs={12}>
          <ScTable columns={columns} data={data} />
        </Grid>
      </Grid>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Container>
  );
}
