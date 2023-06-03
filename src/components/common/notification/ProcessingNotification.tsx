import { Alert, CircularProgress, Snackbar } from "@mui/material";

import { useSelector } from "@/hooks/store.ts";

function ProcessingNotification() {
  const { isProcessingNotificationOpen } = useSelector(state => state.app);

  return (
    <Snackbar
      open={isProcessingNotificationOpen}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert severity="info" icon={false}>
        <div className="flex items-center">
          <CircularProgress className="mr-2" size="1.5em" disableShrink />
          Processing media. Please wait...
        </div>
      </Alert>
    </Snackbar>
  );
}

export default ProcessingNotification;
