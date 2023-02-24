import React, { useEffect, useState } from 'react'

import styles from './publishingEditSection.module.scss'

import {
   Box,
   Grid,
   TextField,
   Button,
   IconButton,
   InputAdornment,
   Chip,
   FormControlLabel,
   Checkbox,
   Autocomplete,
} from '@mui/material'
import { Edit, CloseRounded } from '@mui/icons-material';
//import { PurpleCheckbox } from '../../../mui/components/PurpleCheckbox';

import { Axios } from '../../../api/axios.instance';
import { trelloInstance } from '../../../api/trello.instance'

import toast from 'react-hot-toast';
import ToastCustom from '../../../toast/components/ToastCustom';

import validator from 'validator'



const PublishingEditSection = ({
   setEditBlockCardInfo,
   editBlockCardInfo,
   findLastVideo,
   isAdminMode,
   categoryVariants,
   setEditAnswerModal,
   changeEditBlockState,
   members,
   fetchStatus,
   setFetchStatus
}) => {



   useEffect(() => {
      findLastVideo()
   }, [])

   const researcherHandleSubmit = (e, value) => {
      e.preventDefault()
      setEditBlockCardInfo({ ...editBlockCardInfo, researchers: value })
   }

   const tagsHandleSubmit = (e, value) => {
      e.preventDefault()
      setEditBlockCardInfo({ ...editBlockCardInfo, tags: value })
   }

   const advancePaymentHandleSubmit = (e) => {
      const value = Math.max(0, Math.min(...[], Number(e.target.value)));
      setEditBlockCardInfo({ ...editBlockCardInfo, advancePayment: value })

   };

   const percentageHandleSubmit = (e) => {
      const value = Math.max(0, Math.min(100, Number(e.target.value)));
      setEditBlockCardInfo({ ...editBlockCardInfo, percentage: value })

   };

   const onUpdateData = async (e, endpoint) => {
      e.preventDefault()
      const notification = toast.loading("Wait. The data is being updated...");
      try {
         setFetchStatus('loading')


         const formData = new FormData()
         formData.append('videoId', editBlockCardInfo.videoId)
         editBlockCardInfo.vbCode && formData.append('vbCode', editBlockCardInfo.vbCode)
         editBlockCardInfo.authorEmail && formData.append('authorEmail', editBlockCardInfo.authorEmail)
         editBlockCardInfo.advancePayment && formData.append('advancePayment', JSON.stringify(editBlockCardInfo.advancePayment))
         editBlockCardInfo.percentage && formData.append('percentage', JSON.stringify(editBlockCardInfo.percentage))
         formData.append('researchers', JSON.stringify(editBlockCardInfo.researchers))
         formData.append('originalLink', editBlockCardInfo.originalLink)
         formData.append('title', editBlockCardInfo.title)
         formData.append('desc', editBlockCardInfo.desc)
         editBlockCardInfo.creditTo && formData.append('creditTo', editBlockCardInfo.creditTo)
         formData.append('tags', JSON.stringify(editBlockCardInfo.tags))
         formData.append('category', editBlockCardInfo.category)
         formData.append('city', editBlockCardInfo.city)
         formData.append('country', editBlockCardInfo.country)
         formData.append('date', JSON.stringify(editBlockCardInfo.date))
         formData.append('brandSafe', JSON.stringify(editBlockCardInfo.brandSafe))
         editBlockCardInfo.video && formData.append('video', editBlockCardInfo.video)
         editBlockCardInfo.screen && formData.append('screen', editBlockCardInfo.screen)

         const { data } = await Axios.patch(`/video2/${endpoint}`, formData, {
            headers: {
               "Content-Type": "multipart/form-data"
            },
         })

         if (data.message) {
            toast.custom(
               <ToastCustom text={data.message} />,
               { duration: 5000, id: notification });
         } else {
            changeEditBlockState(data)
            toast.success(`information about video with id ${data?.videoData?.videoId} updated!`, {
               duration: 6000, id: notification
            });
         }
      } catch (err) {
         console.log(err)
         toast.error('Server-side error...', {
            duration: 6000,
            id: notification
         });
      } finally {
         setFetchStatus('fulfilled')
      }
   }

   const changeTrelloCard = async (data) => {
      try {
         //устанавливаем наклейку "not accepted" в карточке trello
         const { data: reqTrelloNotAccepted } = await trelloInstance.post(`https://api.trello.com/1/cards/${data.trelloCardId}/idLabels`, {
            value: "61a1c05f33ccc35e92aab203"
         })

         toast.success(`The "not accepted" flag is set in the trello card`, {
            duration: 6000
         });

      } catch (err) {
         console.log(err)
         toast.error('Error on the "trello" server side...', {
            duration: 6000
         });
      }
   }

   const onDeleteFromDB = async (e) => {
      e.preventDefault()
      const notification = toast.loading("Wait. The video is being deleted...");
      try {

         setFetchStatus('loading')

         const { data } = await Axios.delete(`/video2/delete/${editBlockCardInfo.videoId}`)

         if (data.message) {
            toast.custom(
               <ToastCustom text={data.message} />,
               { duration: 5000, id: notification });
         } else {
            toast.success(`video removed from database`, {
               duration: 6000, id: notification
            });
            findLastVideo()
            changeTrelloCard(data)
         }
      } catch (err) {
         console.log(err)
         toast.error('Server-side error...', {
            duration: 6000
         });
      } finally {
         setFetchStatus('fulfilled')
      }
   }

   const clearInput = (variant) => {
      if (variant === 'screen') {
         setEditBlockCardInfo({ ...editBlockCardInfo, screen: null })
      } else {
         setEditBlockCardInfo({ ...editBlockCardInfo, video: null })
      }
   }

   const isDisabledBtn = () => {
      if (
         editBlockCardInfo.researchers.length === 0 ||
         !editBlockCardInfo.videoId ||
         !editBlockCardInfo.trelloCardId ||
         !editBlockCardInfo.trelloCardName ||
         !editBlockCardInfo.trelloCardUrl ||
         !editBlockCardInfo.originalLink ||
         !editBlockCardInfo.title ||
         !editBlockCardInfo.desc ||
         editBlockCardInfo.tags.length === 0 ||
         !editBlockCardInfo.category ||
         !editBlockCardInfo.city ||
         !editBlockCardInfo.country ||
         !editBlockCardInfo.date ||
         !validator.isURL(editBlockCardInfo.trelloCardUrl) ||
         !validator.isURL(editBlockCardInfo.originalLink) ||
         (editBlockCardInfo.agreementLink && !validator.isURL(editBlockCardInfo.agreementLink))
      ) {
         return true
      } else {
         return false
      }
   }


   return (
      <Grid className={styles.itemBlock} onClick={() => console.log(editBlockCardInfo)}>
         <h2>Last / found video</h2>
         {editBlockCardInfo.comment &&
            <Box className={styles.commentBlock}>
               <h3>Edits:</h3>
               <p>{editBlockCardInfo.comment}</p>
            </Box>}
         <form className={styles.form}>
            <Grid className={styles.formUpBlock}>
               <Grid className={styles.idBlock}>
                  <TextField disabled InputProps={{
                     startAdornment: (
                        <InputAdornment position="start">
                           <span>VB</span>
                        </InputAdornment>
                     ),
                  }} value={editBlockCardInfo.vbCode}
                     onChange={(e) => setEditBlockCardInfo({ ...editBlockCardInfo, vbCode: e.target.value })}
                     variant="outlined"
                     label="VB code"
                  />
                  <TextField
                     type='number'
                     value={editBlockCardInfo.videoId}
                     onChange={(e) => setEditBlockCardInfo({ ...editBlockCardInfo, videoId: e.target.value })}
                     variant="outlined"
                     label="Video id"
                     disabled
                  />
               </Grid>
               <Box className={styles.inputBox}>
                  <TextField
                     value={editBlockCardInfo.agreementLink || ''}
                     onChange={(e) => setEditBlockCardInfo({ ...editBlockCardInfo, agreementLink: e.target.value })}
                     variant="outlined"
                     label="Link to the agreement"
                     disabled
                  />
                  <Button
                     className={styles.followLinkBtn}
                     disabled={!validator.isURL(editBlockCardInfo.agreementLink)}
                     onClick={() => window.open(editBlockCardInfo.agreementLink)}
                     variant="contained"
                  >
                     Follow the link
                  </Button>
               </Box>
               <TextField
                  value={editBlockCardInfo.authorEmail}
                  onChange={(e) => setEditBlockCardInfo({ ...editBlockCardInfo, authorEmail: e.target.value })}
                  variant="outlined"
                  label="Author's email"
                  disabled
               />
               <TextField
                  type='number'
                  value={editBlockCardInfo.advancePayment}
                  onChange={(e) => advancePaymentHandleSubmit(e)}
                  variant="outlined"
                  label='Advance payment ($)'
                  disabled
               />
               <TextField
                  type='number'
                  value={editBlockCardInfo.percentage}
                  onChange={(e) => percentageHandleSubmit(e)}
                  variant="outlined"
                  label='Percentage (%)'
                  disabled
               />
               <Autocomplete
                  multiple
                  autoSelect
                  value={editBlockCardInfo?.researchers.map(el => el)}
                  options={members} advancePaymentHandleSubmit
                  onChange={researcherHandleSubmit}
                  renderTags={(value, getTagProps) =>
                     value.map((option, index) => (
                        <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                     ))
                  }
                  renderInput={params => (
                     <TextField
                        {...params}
                        label="Researchers"
                        variant="outlined"
                     />
                  )}
               />
               <Box className={styles.inputBox}>
                  <TextField
                     value={editBlockCardInfo.trelloCardUrl}
                     onChange={(e) => setEditBlockCardInfo({ ...editBlockCardInfo, trelloCardUrl: e.target.value })}
                     variant="outlined"
                     label='Trello card (link)'
                     disabled
                  />
                  <Button
                     className={styles.followLinkBtn}
                     disabled={!validator.isURL(editBlockCardInfo.trelloCardUrl)}
                     onClick={() => window.open(editBlockCardInfo.trelloCardUrl)}
                     variant="contained"
                  >
                     Follow the link
                  </Button>
               </Box>
               <TextField
                  value={editBlockCardInfo.trelloCardId}
                  onChange={(e) => setEditBlockCardInfo({ ...editBlockCardInfo, trelloCardId: e.target.value })}
                  variant="outlined"
                  label='Trello card (id)'
                  disabled />
               <TextField
                  value={editBlockCardInfo.trelloCardName}
                  onChange={(e) => setEditBlockCardInfo({ ...editBlockCardInfo, trelloCardName: e.target.value })}
                  variant="outlined"
                  label='Trello card (name)'
                  disabled />
               <FormControlLabel
                  control={
                     <Checkbox
                        checked={editBlockCardInfo.priority}
                        onChange={(e) => setEditBlockCardInfo({ ...editBlockCardInfo, priority: e.target.checked })}
                        disabled
                     />}
                  label="Priority"
                  disabled />
               <Box className={styles.inputBox}>
                  <TextField
                     value={editBlockCardInfo.originalLink}
                     onChange={(e) => setEditBlockCardInfo({ ...editBlockCardInfo, originalLink: e.target.value })}
                     variant="outlined"
                     label='Original video link'
                  />
                  <Button
                     className={styles.followLinkBtn}
                     disabled={!validator.isURL(editBlockCardInfo.originalLink)}
                     onClick={() => window.open(editBlockCardInfo.originalLink)}
                     variant="contained"
                  >
                     Follow the link
                  </Button>
               </Box>
            </Grid>
            <Grid className={styles.formCenterBlock}>
               <Box className={styles.mediaBlock} >
                  {editBlockCardInfo.video &&
                     <IconButton
                        onClick={() => clearInput('video')}
                        className={styles.resetBtn}>
                        <CloseRounded />
                     </IconButton>}
                  <IconButton className={styles.editBtn}>
                     <label htmlFor='editVideoInput'>
                        <input
                           accept="video/mp4"
                           value={''}
                           onChange={(e) => setEditBlockCardInfo({ ...editBlockCardInfo, video: e.target.files[0] })}
                           id='editVideoInput'
                           type="file"
                        />
                        <Edit />
                     </label>
                  </IconButton>
                  {editBlockCardInfo.video ?
                     <span className={styles.labelVideoInEditBlock}>{editBlockCardInfo.video.name}</span>
                     :
                     <video src={editBlockCardInfo.cloudVideoLink} controls></video>}
               </Box>
               <Box
                  className={styles.mediaBlock}
                  style={{
                     backgroundImage: editBlockCardInfo.screen
                        ?
                        `url(${URL.createObjectURL(editBlockCardInfo.screen)})`
                        :
                        `url(${editBlockCardInfo.cloudScreenLink})`
                  }}>
                  {editBlockCardInfo.screen &&
                     <IconButton className={styles.resetBtn} onClick={() => clearInput('screen')}>
                        <CloseRounded />
                     </IconButton>}
                  <IconButton className={styles.editBtn}>
                     <label htmlFor='editScreenInput'>
                        <input
                           accept="image/jpeg"
                           value={''}
                           onChange={(e) => setEditBlockCardInfo({ ...editBlockCardInfo, screen: e.target.files[0] })}
                           id='editScreenInput'
                           type="file"
                        />
                        <Edit />
                     </label>
                  </IconButton>
               </Box>
            </Grid>
            <Grid
               style={{ flex: '1 0 auto' }}
               className={styles.formDownBlock}>
               <TextField
                  value={editBlockCardInfo.title}
                  onChange={(e) => setEditBlockCardInfo({ ...editBlockCardInfo, title: e.target.value })}
                  variant="outlined"
                  label="Title"
               />
               <Box className={styles.inputBox}>
                  <TextField
                     value={editBlockCardInfo.desc}
                     onChange={(e) => setEditBlockCardInfo({ ...editBlockCardInfo, desc: e.target.value })}
                     variant="outlined"
                     label='Description'
                     multiline
                  />
                  <Button
                     disabled={
                        !editBlockCardInfo.whereFilmed &&
                        !editBlockCardInfo.whyDecide &&
                        !editBlockCardInfo.whatHappen &&
                        !editBlockCardInfo.whenFilmed &&
                        !editBlockCardInfo.whoAppears}
                     onClick={() => setEditAnswerModal(true)}
                     className={styles.textAreaBtn}
                     variant='filled'
                  >
                     Check author's answers
                  </Button>
               </Box>
               <TextField
                  value={editBlockCardInfo.creditTo}
                  onChange={(e) => setEditBlockCardInfo({ ...editBlockCardInfo, creditTo: e.target.value })}
                  variant="outlined"
                  label="Credit to"
               />
               <Autocomplete
                  multiple
                  freeSolo
                  autoSelect
                  options={[]}
                  value={editBlockCardInfo?.tags.map(el => el)}
                  onChange={tagsHandleSubmit}
                  renderTags={(value, getTagProps) =>
                     value.map((option, index) => (
                        <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                     ))
                  }
                  renderInput={params => (
                     <TextField
                        {...params}
                        label="Tags"
                        variant="outlined"
                     />
                  )}
               />
               <Autocomplete
                  options={categoryVariants}
                  renderInput={(params) => <TextField {...params}
                     label="Category"
                     variant="outlined"
                     required />}
                  onChange={(e, value) => setEditBlockCardInfo({ ...editBlockCardInfo, category: value })}
                  value={editBlockCardInfo.category || ''}
               />
               <TextField
                  value={editBlockCardInfo.city}
                  onChange={(e) => setEditBlockCardInfo({ ...editBlockCardInfo, city: e.target.value })}
                  variant="outlined"
                  label="City"
               />
               <TextField
                  value={editBlockCardInfo.country}
                  onChange={(e) => setEditBlockCardInfo({ ...editBlockCardInfo, country: e.target.value })}
                  variant="outlined"
                  label="Country"
               />
               <TextField
                  InputLabelProps={{
                     shrink: true,
                  }}
                  type='date'
                  value={editBlockCardInfo.date}
                  onChange={(e) => setEditBlockCardInfo({ ...editBlockCardInfo, date: e.target.value })}
                  variant="outlined"
                  label="Date"
               />
               {isAdminMode && <FormControlLabel
                  control={<Checkbox
                     checked={editBlockCardInfo.brandSafe}
                     onChange={(e) => setEditBlockCardInfo({ ...editBlockCardInfo, brandSafe: e.target.checked })}
                  />}
                  label="Brand safe video" />}
               <Box
                  className={styles.rightBtnBlock}
                  style={{ gridTemplateColumns: !isAdminMode && editBlockCardInfo.comment ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)' }}>
                  <Button
                     disabled={isDisabledBtn() || (!isAdminMode && editBlockCardInfo.comment) || fetchStatus === 'loading'}
                     onClick={(e) => onUpdateData(e, 'update')}
                     type='submit'
                     className={styles.mainBtn}
                  >
                     Save
                  </Button>
                  <Button
                     disabled={!editBlockCardInfo.videoId || fetchStatus === 'loading'}
                     onClick={(e) => onDeleteFromDB(e)}
                     className={styles.grayBtn}>
                     Delete
                  </Button>
                  {!isAdminMode && editBlockCardInfo.comment && <Button
                     disabled={isDisabledBtn() || fetchStatus === 'loading'}
                     onClick={(e) => onUpdateData(e, 'fixedVideo')}
                     className={styles.fixedBtn}>
                     Fixed
                  </Button>}
               </Box>
            </Grid>
         </form>
      </Grid>
   )
}

export default PublishingEditSection