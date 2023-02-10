
import React, { useEffect, useState } from 'react'
import styles from './publishing.module.scss'
import { Box, Grid, TextField, Button, IconButton } from '@mui/material'

import { Edit } from '@mui/icons-material';

import axios from 'axios'

import clsx from 'clsx'

//import { useNavigate } from 'react-router-dom'


const trelloListId = process.env.REACT_APP_LIST_DONE_ID
const trelloApiKey = process.env.REACT_APP_TRELLO_API_KEY
const trelloApiToken = process.env.REACT_APP_TRELLO_API_TOKEN


const Publishing = () => {

   //const navigate = useNavigate()

   const [doneCards, isDoneCards] = useState([])
   const [approvedCards, isApprovedCards] = useState([])


   useEffect(() => {
      (async () => {
         try {
            const { data } = await axios.get(`https://api.trello.com/1/lists/${trelloListId}/cards/?customFieldItems=true&key=${trelloApiKey}&token=${trelloApiToken}`, {
               headers: {
                  'Content-Type': 'application/json'
               },
               params: {
                  fields: ['name', 'url']
               }


            })
            console.log(data)
            isDoneCards(data)
            isApprovedCards(data.filter(el => el.customFieldItems.some(el => el.idValue === '6360c514c95f85019ca4d612')))
         } catch (err) {
            console.log(err)
         }
      })()
   }, [])


   const doneCardHandleClick = (card) => {
      window.open(card.url)
      const videoId = card.customFieldItems.find(el => el.value)?.value?.number
      if (videoId) {
         //findVideoById()
      }
   }



   return (
      <Grid className={styles.container} container>
         <Grid className={styles.upItems}>
            <Grid className={styles.upItem} item xs={12}>
               <h2>Done:</h2>
               <Box className={styles.upBox} >
                  {doneCards.map(card => (
                     <div key={card.id} className={clsx(styles.upBoxItem, card.customFieldItems.find(el => el.idValue === '62c7e0032a86d7161f8cadb2') && styles.hot)}>
                        <button onClick={() => doneCardHandleClick(card)}>
                           <span>{card?.name?.substring(0, 20)}{card?.name?.length >= 20 && '...'}</span>
                        </button>
                     </div>
                  ))}
               </Box>
            </Grid>
            <Grid className={styles.upItem} item xs={12}><h2>Approved:</h2>
               <Box className={styles.upBox}>
                  {approvedCards.map(card => (
                     <Box key={card.id} className={clsx(styles.upBoxItem, card.customFieldItems.find(el => el.idValue === '62c7e0032a86d7161f8cadb2') && styles.hot)}>
                        <button>
                           <span>{card?.name?.substring(0, 20)}{card?.name?.length >= 20 && '...'}</span>
                        </button>
                     </Box>
                  ))}
               </Box>
            </Grid>
            <Grid className={styles.upItem} item xs={12}> <h2>Social media:</h2></Grid>
            <Grid className={styles.upItem} item xs={12}> <h2>Fix this:</h2></Grid>
         </Grid>
         <Grid className={styles.mainBlock} container sm={12}>
            <Grid className={styles.itemBlock}>
               <h2>Add video</h2>
               <form className={styles.form}>
                  <Grid className={styles.formUpBlock}>
                     <Box className={styles.inputBox}>
                        <TextField variant="outlined" label="VB code" />
                        <Button variant="contained">Find</Button>
                     </Box>
                     <TextField variant="outlined" label="Author's email" />
                     <TextField variant="outlined" label='Advance payment ($)' />
                     <TextField variant="outlined" label='Percentage (%)' />
                     <TextField variant="outlined" label='Researcher' required />
                     <TextField variant="outlined" label='Trello card (link)' required />
                     <TextField variant="outlined" label='Original video link' required />
                  </Grid>
                  <Grid className={styles.formCenterBlock}>
                     <label htmlFor='video-file-input'>
                        <input id='video-file-input' type="file" />
                        <p>Upload a video (mp4) *</p>
                     </label>
                     <label htmlFor='screenshot-file-input'>
                        <input id='screenshot-file-input' type="file" />
                        <p>Upload a screenshot 1280x720 (jpg) *</p>
                     </label>
                  </Grid>
                  <Grid className={styles.formDownBlock}>
                     <TextField variant="outlined" label="Title" required />
                     <Box className={styles.inputBox}>
                        <TextField variant="outlined" label='Description' multiline required />
                        <Button className={styles.textAreaBtn} variant='filled'>Check author's answers</Button>
                     </Box>
                     <TextField variant="outlined" label="Credit to" />
                     <TextField variant="outlined" label="Tags" required />
                     <TextField variant="outlined" label="Category" required />
                     <TextField variant="outlined" label="City" required />
                     <TextField variant="outlined" label="Country" required />
                     <TextField variant="outlined" label="Date" required />
                     <Button type='submit' className={styles.mainBtn}>Add the video for publishing</Button>
                  </Grid>
               </form>

            </Grid>
            <Grid className={styles.itemBlock}>
               <h2>Last / found video</h2>
               <form className={styles.form}>
                  <Grid className={styles.formUpBlock}>
                     <TextField variant="outlined" label="VB code" />
                     <TextField variant="outlined" label="Author's email" />
                     <TextField variant="outlined" label='Advance payment ($)' />
                     <TextField variant="outlined" label='Percentage (%)' />
                     <TextField variant="outlined" label='Researcher' />
                     <TextField variant="outlined" label='Trello card (link)' />
                     <TextField variant="outlined" label='Original video link' />
                  </Grid>
                  <Grid className={styles.formCenterBlock}>
                     <Box className={styles.mediaBlock} >
                        <IconButton>
                           <Edit />
                        </IconButton>
                        <iframe width="560" height="315" src="https://www.youtube.com/embed/Wy4uKyh14GY" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
                     </Box>
                     <Box className={styles.mediaBlock} style={{ backgroundImage: 'url(/assets/images/publishing/screen.jpg)' }}>
                        <IconButton>
                           <Edit />
                        </IconButton>
                     </Box>
                  </Grid>
                  <Grid className={styles.formDownBlock}>
                     <TextField variant="outlined" label="Title" />
                     <Box className={styles.inputBox}>
                        <TextField variant="outlined" label='Description' multiline />
                        <Button className={styles.textAreaBtn} variant='filled'>Check author's answers</Button>
                     </Box>
                     <TextField variant="outlined" label="Credit to" />
                     <TextField variant="outlined" label="Tags" />
                     <TextField variant="outlined" label="Category" />
                     <TextField variant="outlined" label="City" />
                     <TextField variant="outlined" label="Country" />
                     <TextField variant="outlined" label="Date" />
                     <Box className={styles.rightBtnBlock}>
                        <Button type='submit' className={styles.mainBtn}>Save</Button>
                        <Button className={styles.grayBtn}>Delete</Button>
                     </Box>
                  </Grid>
               </form>
            </Grid>
         </Grid>
         <Grid sm={12} className={styles.downFindBlock}>
            <Box className={styles.downFindBox}>
               <TextField variant='outlined' label='Find a video' />
               <Button className={styles.grayBtn}>Search</Button>
            </Box>
         </Grid>
      </Grid>
   )
}

export default Publishing






