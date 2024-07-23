import { Box, Button, Modal, Typography } from "@mui/material";
import { useTranslation } from "@/i18n/client";

export default function ViewDetailModal({
  open,
  handleClose,
  aiArticleData,
}: {
  open: boolean;
  handleClose: () => void;
  aiArticleData: {
    content: string;
    form: string;
  };
}) {

  const { t } = useTranslation();

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography
          id="simple-modal-title"
          variant="h6"
          color="primary"
          sx={{
            fontWeight: "bold",
          }}
        >
          {t("components.writerForm.view attached file details")}
        </Typography>
        <Typography
          id="simple-modal-description"
          variant="body2"
          sx={{
            my: 2,
          }}
        >
          {aiArticleData.content}
        </Typography>
        <Typography id="simple-modal-description" variant="caption">
          {aiArticleData.form}
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            mt: 4,
          }}
        >
          <Button variant="contained" onClick={handleClose}>
            {t("components.writerForm.close")}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
