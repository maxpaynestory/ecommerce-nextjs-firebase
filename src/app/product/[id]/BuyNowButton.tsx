"use client";
import { Button } from "react-bootstrap";
import { useRouter } from "next/navigation";
type BuyNowButtonProps = {
  product: any;
};
export async function BuyNowButton(props: BuyNowButtonProps) {
  const { product } = props;
  const router = useRouter();
  return (
    <>
      <Button
        variant="primary"
        disabled={product.maxQuantity < 1 ? true : false}
        onClick={() => router.push(`/buynow/${product.id}`)}
      >
        Buy Now
      </Button>
    </>
  );
}
