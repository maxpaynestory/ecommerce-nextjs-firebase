import { toast } from "react-toastify";

export const showError = (message: string) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });
};

export const displayMoneyInPKR = (n: number) => {
  const format = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "PKR",
  });
  return format.format(n);
};
