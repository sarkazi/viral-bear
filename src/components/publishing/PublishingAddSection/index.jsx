import React, { useRef, useState } from 'react'

import styles from './publishingAddSection.module.scss'

import {
   Box,
   Grid,
   TextField,
   Button,
   Chip,
   FormControlLabel,
   Checkbox,
   InputAdornment,
   Autocomplete
} from '@mui/material'
import { ReportProblem } from '@mui/icons-material';

import clsx from 'clsx'

import toast from 'react-hot-toast';
import { toastOptions } from '../../../toast/constants/toastOptions';
import ToastCustom from '../../../toast/components/ToastCustom';

import { Axios } from '../../../api/axios.instance'

import validator from 'validator'



const PublishingAddSection =
   ({
      activeAddVideo,
      setActiveAddVideo,
      setModalOpen,
      findLastVideo,
      categoryVariants,
      members,
      fetchStatus,
      setFetchStatus
   }) => {


      const addForm = useRef(null)

      const resetAddState = () => {
         setActiveAddVideo({
            vbCode: '',
            authorEmail: '',
            percentage: '',
            researchers: [],
            advancePayment: '',
            trelloCardUrl: '',
            trelloCardId: '',
            trelloCardName: '',
            agreementLink: '',
            originalLink: '',
            priority: false,
            video: '',
            title: '',
            desc: '',
            creditTo: '',
            tags: [],
            category: '',
            city: '',
            country: '',
            date: '',
            whereFilmed: '',
            whyDecide: '',
            whatHappen: '',
            whenFilmed: '',
            whoAppears: '',
         })
      }


      const onAddForm = async (e) => {
         e.preventDefault()
         const notification = toast.loading("Wait. Upload the video to the server...");
         try {

            toast.loading("Wait. Upload the video to the server...", {
               id: notification
            });
            setFetchStatus('loading')

            const formData = new FormData()
            formData.append('trelloCardUrl', activeAddVideo.trelloCardUrl)
            formData.append('trelloCardId', activeAddVideo.trelloCardId)
            formData.append('trelloCardName', activeAddVideo.trelloCardName)
            formData.append('priority', activeAddVideo.priority)
            formData.append('originalLink', activeAddVideo.originalLink)
            activeAddVideo.vbCode && formData.append('vbCode', activeAddVideo.vbCode)
            activeAddVideo.authorEmail && formData.append('authorEmail', activeAddVideo.authorEmail)
            activeAddVideo.percentage && formData.append('percentage', activeAddVideo.percentage)
            formData.append('researchers', JSON.stringify(activeAddVideo.researchers))
            activeAddVideo.advancePayment && formData.append('advancePayment', activeAddVideo.advancePayment)
            formData.append('video', activeAddVideo.video)
            formData.append('screen', activeAddVideo.screen)
            formData.append('title', activeAddVideo.title)
            formData.append('desc', activeAddVideo.desc)
            activeAddVideo.creditTo && formData.append('creditTo', activeAddVideo.creditTo)
            formData.append('tags', JSON.stringify(activeAddVideo.tags))
            formData.append('category', activeAddVideo.category)
            formData.append('city', activeAddVideo.city)
            formData.append('country', activeAddVideo.country)
            formData.append('date', activeAddVideo.date)
            activeAddVideo.agreementLink && formData.append('agreementLink', activeAddVideo.agreementLink)
            activeAddVideo.whereFilmed && formData.append('whereFilmed', activeAddVideo.whereFilmed)
            activeAddVideo.whyDecide && formData.append('whyDecide', activeAddVideo.whyDecide)
            activeAddVideo.whatHappen && formData.append('whatHappen', activeAddVideo.whatHappen)
            activeAddVideo.whenFilmed && formData.append('whenFilmed', activeAddVideo.whenFilmed)
            activeAddVideo.whoAppears && formData.append('whoAppears', activeAddVideo.whoAppears)

            const config = {
               headers: {
                  "Content-Type": "multipart/form-data"
               }
            }

            const { data } = await Axios.post('/video2/addVideo', formData, config)

            if (data.message) {
               toast.custom(
                  <ToastCustom text={data.message} />,
                  { duration: 5000, id: notification });
            } else {
               toast.success('The video has been successfully added to the database', { duration: 5000, id: notification });
               resetAddState()
               findLastVideo()
            }

         } catch (err) {
            console.log(err)
            toast.error(err?.response?.data?.message ? err?.response?.data?.message : 'Whoops...something went wrong', {
               duration: 5000, id: notification
            });
         } finally {
            setFetchStatus('fulfilled')
         }
      }

      const onFindForm = async () => {
         try {
            const { data } = await Axios.get(`/uploadInfo/findOne/${activeAddVideo.vbCode}`, null, {
               headers: {
                  'Content-Type': 'application/json'
               },
            })
            if (data.message === 'Форма не найдена!') {
               toast.custom(
                  <div style={toastOptions}>
                     <ReportProblem style={{ width: '20px' }} />
                     <span></span>
                  </div>,
                  <ToastCustom text={`The form with the number "VB${activeAddVideo.vbCode}" was not found in the database!`} />,
                  { duration: 5000 });
               resetAddState()
            } else {
               toast.success(`data from the ${activeAddVideo.vbCode} form is obtained from the database!`, {
                  duration: 6000
               });
               setActiveAddVideo({
                  trelloCardUrl: '',
                  trelloCardName: '',
                  trelloCardId: '',
                  originalLink: '',
                  vbCode: activeAddVideo.vbCode,
                  agreementLink: data.agreementLink,
                  authorEmail: data.email,
                  percentage: data.percentage && data.percentage,
                  advancePayment: data.advancePayment && data.advancePayment,
                  whereFilmed: data.whereFilmed && data.whereFilmed,
                  whyDecide: data.whyDecide && data.whyDecide,
                  whatHappen: data.whatHappen && data.whatHappen,
                  whenFilmed: data.whenFilmed && data.whenFilmed,
                  whoAppears: data.whoAppears && data.whoAppears,
                  researchers: [],
                  video: '',
                  priority: false,
                  screen: '',
                  title: '',
                  desc: '',
                  creditTo: '',
                  tags: [],
                  category: '',
                  city: '',
                  country: '',
                  date: '',
               })
            }
         } catch (err) {
            console.log(err)
            toast.error('Database error', {
               duration: 6000
            });
         }
      }

      const isPublishingBtnDisabled = () => {
         if (
            activeAddVideo.researchers.length === 0 ||
            !activeAddVideo.trelloCardUrl ||
            !activeAddVideo.trelloCardId ||
            !activeAddVideo.trelloCardName ||
            !activeAddVideo.originalLink ||
            !activeAddVideo.video ||
            !activeAddVideo.screen ||
            !activeAddVideo.title ||
            !activeAddVideo.desc ||
            activeAddVideo.tags.length === 0 ||
            !activeAddVideo.category ||
            !activeAddVideo.city ||
            !activeAddVideo.country ||
            !activeAddVideo.date ||
            fetchStatus === 'loading' ||
            !validator.isURL(activeAddVideo.trelloCardUrl) ||
            !validator.isURL(activeAddVideo.originalLink) ||
            (activeAddVideo.agreementLink && !validator.isURL(activeAddVideo.agreementLink))
         ) {
            return true
         } else {
            return false
         }
      }

      const tagsHandleSubmit = (e, value) => {
         e.preventDefault()
         setActiveAddVideo({ ...activeAddVideo, tags: value })
      }

      const researcherHandleSubmit = (e, value) => {
         e.preventDefault()
         setActiveAddVideo({ ...activeAddVideo, researchers: value })
      }

      const advancePaymentHandleSubmit = (e) => {
         const value = Math.max(0, Math.min(...[], Number(e.target.value)));
         setActiveAddVideo({ ...activeAddVideo, advancePayment: value })

      };

      const percentageHandleSubmit = (e) => {
         const value = Math.max(0, Math.min(100, Number(e.target.value)));
         setActiveAddVideo({ ...activeAddVideo, percentage: value })
      };


      return (
         <Grid className={styles.itemBlock}>
            <h2>Add video</h2>
            <form onSubmit={(e) => onAddForm(e)} ref={addForm} className={styles.form}>
               <Grid className={styles.formUpBlock}>
                  <Box className={styles.inputBox}>

                     <TextField InputProps={{
                        startAdornment: (
                           <InputAdornment position="start">
                              <span>VB</span>
                           </InputAdornment>
                        ),
                     }} value={activeAddVideo.vbCode || ''} onChange={(e) => setActiveAddVideo({ ...activeAddVideo, vbCode: e.target.value })} variant="outlined" label="VB code" />

                     <Button disabled={!activeAddVideo.vbCode} onClick={() => onFindForm()} variant="contained">Find</Button>
                  </Box>
                  <Box className={styles.inputBox}>
                     <TextField value={activeAddVideo.agreementLink || ''} onChange={(e) => setActiveAddVideo({ ...activeAddVideo, agreementLink: e.target.value })} variant="outlined" label="Link to the agreement" disabled />
                     <Button className={styles.followLinkBtn} disabled={!validator.isURL(activeAddVideo.agreementLink)} onClick={() => window.open(activeAddVideo.agreementLink)} variant="contained">Follow the link</Button>
                  </Box>
                  <TextField value={activeAddVideo.authorEmail || ''} onChange={(e) => setActiveAddVideo({ ...activeAddVideo, authorEmail: e.target.value })} variant="outlined" label="Author's email" disabled />
                  <TextField type='number' value={activeAddVideo.advancePayment || ''} onChange={(e) => advancePaymentHandleSubmit(e)} variant="outlined" label='Advance payment ($)' disabled />
                  <TextField type='number' value={activeAddVideo.percentage || ''} onChange={(e) => percentageHandleSubmit(e)} variant="outlined" label='Percentage (%)' disabled />

                  <Autocomplete
                     multiple
                     autoSelect
                     value={activeAddVideo.researchers.map(el => el)}
                     options={members}
                     advancePaymentHandleSubmit
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
                     <TextField value={activeAddVideo.trelloCardUrl || ''} onChange={(e) => setActiveAddVideo({ ...activeAddVideo, trelloCardUrl: e.target.value })} variant="outlined" label='Trello card (link)' required disabled />
                     <Button onClick={() => window.open(activeAddVideo.trelloCardUrl)} className={styles.followLinkBtn} disabled={!validator.isURL(activeAddVideo.trelloCardUrl) ? true : false} variant="contained">Follow the link</Button>
                  </Box>
                  <TextField value={activeAddVideo.trelloCardId} onChange={(e) => setActiveAddVideo({ ...activeAddVideo, trelloCardId: e.target.value })} variant="outlined" label='Trello card (id)' required disabled />
                  <TextField value={activeAddVideo.trelloCardName} onChange={(e) => setActiveAddVideo({ ...activeAddVideo, trelloCardName: e.target.value })} variant="outlined" label='Trello card (name)' required disabled />
                  <FormControlLabel control={<Checkbox checked={activeAddVideo.priority} onChange={(e) => setActiveAddVideo({ ...activeAddVideo, priority: e.target.checked })} disabled />} label="Priority" required disabled />
                  <Box className={styles.inputBox}>
                     <TextField value={activeAddVideo.originalLink || ''} onChange={(e) => setActiveAddVideo({ ...activeAddVideo, originalLink: e.target.value })} variant="outlined" label='Original video link' required />
                     <Button onClick={() => window.open(activeAddVideo.originalLink)} className={styles.followLinkBtn} disabled={!validator.isURL(activeAddVideo.originalLink) ? true : false} variant="contained">Follow the link</Button>
                  </Box>
               </Grid>
               <Grid className={styles.formCenterBlock}>
                  <label htmlFor='video-file-input'>
                     <input value={''} accept="video/mp4" onChange={(e) => setActiveAddVideo({ ...activeAddVideo, video: e.target.files[0] })} id='video-file-input' type="file" />
                     <p>Upload a video (mp4) *</p>
                     {activeAddVideo.video && <span>{activeAddVideo.video.name}</span>}
                  </label>
                  <label style={{ backgroundImage: activeAddVideo.screen ? `url(${URL.createObjectURL(activeAddVideo.screen)})` : 'unset' }} htmlFor='screenshot-file-input'>
                     <input value={''} accept="image/jpeg" onChange={(e) => setActiveAddVideo({ ...activeAddVideo, screen: e.target.files[0] })} id='screenshot-file-input' type="file" />
                     <p>Upload a screenshot 1280x720 (jpg) *</p>
                     {activeAddVideo.screen && <span>{activeAddVideo.screen.name}</span>}
                  </label>
               </Grid>
               <Grid className={styles.formDownBlock}>
                  <TextField value={activeAddVideo.title || ''} onChange={(e) => setActiveAddVideo({ ...activeAddVideo, title: e.target.value })} variant="outlined" label="Title" required />
                  <Box className={styles.inputBox}>
                     <TextField value={activeAddVideo.desc || ''} onChange={(e) => setActiveAddVideo({ ...activeAddVideo, desc: e.target.value })} variant="outlined" label='Description' multiline required />
                     <Button disabled={
                        !activeAddVideo.whereFilmed &&
                        !activeAddVideo.whyDecide &&
                        !activeAddVideo.whatHappen &&
                        !activeAddVideo.whenFilmed &&
                        !activeAddVideo.whoAppears
                     } onClick={() => setModalOpen(true)} className={clsx(styles.textAreaBtn)} variant='filled'>Check author's answers</Button>
                  </Box>
                  <TextField value={activeAddVideo.creditTo || ''} onChange={(e) => setActiveAddVideo({ ...activeAddVideo, creditTo: e.target.value })} variant="outlined" label="Credit to" />


                  <Autocomplete
                     multiple
                     freeSolo
                     autoSelect
                     options={[]}
                     required
                     value={activeAddVideo.tags.map(el => el)}
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
                     renderInput={(params) => <TextField {...params} label="Category" variant="outlined" required />}
                     onChange={(e, value) => setActiveAddVideo({ ...activeAddVideo, category: value })}
                     value={activeAddVideo.category || ''}
                  />

                  <TextField value={activeAddVideo.city || ''} onChange={(e) => setActiveAddVideo({ ...activeAddVideo, city: e.target.value })} variant="outlined" label="City" required />
                  <TextField value={activeAddVideo.country || ''} onChange={(e) => setActiveAddVideo({ ...activeAddVideo, country: e.target.value })} variant="outlined" label="Country" required />
                  <TextField InputLabelProps={{
                     shrink: true,
                  }} type='date' value={activeAddVideo.date || ''} onChange={(e) => setActiveAddVideo({ ...activeAddVideo, date: e.target.value })} variant="outlined" label="Date" required />
                  <Button disabled={isPublishingBtnDisabled()} type='submit' className={styles.mainBtn}>Add the video for publishing</Button>
               </Grid>
            </form>

         </Grid>
      )
   }

export default PublishingAddSection
