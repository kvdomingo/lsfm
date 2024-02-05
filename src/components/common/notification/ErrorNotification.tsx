import { Alert, Snackbar } from "@mui/material";

import { useZStore } from "@/store.ts";

function ErrorNotification() {
  const { isErrorNotificationOpen, setIsErrorNotificationOpen } = useZStore();

  return (
    <Snackbar
      open={isErrorNotificationOpen}
      autoHideDuration={5000}
      onClose={() => setIsErrorNotificationOpen(false)}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert severity="info" icon={false}>
        An error occurred. Please try again later.
      </Alert>
    </Snackbar>
  );
}

export default ErrorNotification;
