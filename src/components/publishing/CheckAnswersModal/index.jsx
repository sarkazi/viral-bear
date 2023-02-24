import { Modal, Typography, Box, Grid } from "@mui/material";
import React from "react";
import styles from './checkAnswersModal.module.scss'

const CheckAnswersModal = ({ open, handleClose, content }) => {


   return (
      <Modal
         open={open}
         onClose={handleClose}
         className={styles.wrapper}
      >
         <Box className={styles.modal}>
            <Grid container direction="column" className={styles.list}>
               {content.map(el => (
                  <Grid key={el.title} sm='12' className={styles.item}>
                     <Typography variant="h6">
                        {el.title}
                     </Typography>
                     <Typography>
                        {el.value}
                     </Typography>
                  </Grid>
               ))}
            </Grid>

         </Box>
      </Modal>
   );
};

export default CheckAnswersModal;
