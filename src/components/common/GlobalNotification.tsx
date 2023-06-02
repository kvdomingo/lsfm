import { Alert, CircularProgress, Snackbar } from "@mui/material";

import { useSelector } from "@/hooks/store.ts";

function GlobalNotification() {
  const notification = useSelector(state => state.app.notification);

  return (
    <Snackbar
      open={notification.isOpen}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert severity={notification.status} icon={false}>
        <div className="flex items-center">
          <CircularProgress className="mr-2" size="1.5em" disableShrink />
          {notification.message}
        </div>
      </Alert>
    </Snackbar>
  );
}

export default GlobalNotification;
