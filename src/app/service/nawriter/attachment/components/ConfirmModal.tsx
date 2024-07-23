import { Modal, Box, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function ConfirmModal({
  open,
  createdAt,
  handleClose,
}: {
  open: boolean;
  createdAt: string;
  handleClose: () => void;
}) {
  const router = useRouter();

  const handleConfirm = () => {
    router.push(`/service/nawriter/edit?createdAt=${createdAt}`);
  };
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
          width: 400,
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
          sx={{ fontWeight: "bold" }}
        >
          기사 만들기
        </Typography>
        <Typography
          id="simple-modal-description"
          variant="body2"
          sx={{
            mt: 2,
          }}
        >
          요약된 내용은 별도로 저장 되지 않습니다.
        </Typography>
        <Typography id="simple-modal-description" variant="body2">
          진행하시겠습니까?
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            mt: 4,
          }}
        >
          <Button variant="text" color="secondary" onClick={handleClose}>
            취소
          </Button>
          <Button variant="contained" color="primary" onClick={handleConfirm}>
            확인
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
