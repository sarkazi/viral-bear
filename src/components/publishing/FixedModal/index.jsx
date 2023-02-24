import { Modal, Typography, Box, Grid, TextField, Button } from "@mui/material";
import React from "react";
import styles from './checkAnswersModal.module.scss'
import { Axios } from '../../../api/axios.instance'

const FixedModal = ({ open, handleClose, commentForEmployee, setCommentForEmployee, addComment }) => {





   return (
      <Modal
         open={open}
         onClose={handleClose}
         className={styles.wrapper}
      >
         <Box className={styles.modal}>
            <TextField value={commentForEmployee} onChange={(e) => setCommentForEmployee(e.target.value)} className={styles.input} variant='outlined' label="What to fix" placeholder="Enter a comment for the employee" multiline></TextField>
            <Button onClick={(e) => addComment(e)} disabled={!commentForEmployee}>Send a comment</Button>
         </Box>
      </Modal>
   );
};

export default FixedModal;
