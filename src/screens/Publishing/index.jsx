
import React, { useEffect, useState } from 'react'

import styles from './publishing.module.scss'

import { Box, Grid, TextField, Button, FormControlLabel, Checkbox } from '@mui/material'
import { ReportProblem, WhatshotTwoTone, Search } from '@mui/icons-material';

import { Axios } from '../../api/axios.instance'
import { trelloInstance } from '../../api/trello.instance'

import clsx from 'clsx'

import CheckAnswersModal from '../../components/publishing/CheckAnswersModal';
import CheckAnswersModalEdit from '../../components/publishing/CheckAnswersModalEdit';
import { PurpleCheckbox } from '../../mui/components/PurpleCheckbox';
import PublishingEditSection from '../../components/publishing/PublishingEditSection';
import PublishingAddSection from '../../components/publishing/PublishingAddSection';
import FixedModal from '../../components/publishing/FixedModal';

import toast from 'react-hot-toast';
import { toastOptions } from '../../toast/constants/toastOptions';
import ToastCustom from '../../toast/components/ToastCustom';

import { categoryVariants } from '../../constants/categoryVariants';



const trelloListId = process.env.REACT_APP_LIST_DONE_ID




const Publishing = () => {

   const [modalOpen, setModalOpen] = useState(false)
   const [editAnswerModal, setEditAnswerModal] = useState(false)
   const [fixedModalOpen, setFixedModalOpen] = useState(false)

   const [doneCards, isDoneCards] = useState([])
   const [approvedCards, isApprovedCards] = useState([])
   const [socialMediaCards, setSocialMediaCards] = useState([])
   const [fixedCards, setFixedCards] = useState([])
   const [cardsForPublishing, setCardsForPublishing] = useState([])
   const [visitedCards, setVisitedCards] = useState([])

   const [isAdminMode, setIsAdminMode] = useState(false)

   const [videoId, setVideoId] = useState('')

   const [fetchStatus, setFetchStatus] = useState('')

   const [commentForEmployee, setCommentForEmployee] = useState('')

   const [members, setMembers] = useState([])

   const [answerState, setAnswerState] = useState([])
   const [editAnswerState, setEditAnswerState] = useState([])


   const [activeAddVideo, setActiveAddVideo] = useState({
      vbCode: '',
      agreementLink: '',
      authorEmail: '',
      percentage: '',
      researchers: [],
      advancePayment: '',
      trelloCardUrl: '',
      originalLink: '',
      video: null,
      screen: null,
      title: '',
      desc: '',
      creditTo: '',
      tags: [],
      category: '',
      city: '',
      country: '',
      priority: false,
      date: '',
      trelloCardId: '',
      trelloCardName: '',
      whereFilmed: '',
      whyDecide: '',
      whatHappen: '',
      whenFilmed: '',
      whoAppears: '',
   })
   const [editBlockCardInfo, setEditBlockCardInfo] = useState({
      videoId: '',
      agreementLink: '',
      trelloCardUrl: '',
      trelloCardId: '',
      trelloCardName: '',
      priority: false,
      originalLink: '',
      vbCode: '',
      authorEmail: '',
      video: null,
      screen: null,
      percentage: '',
      researchers: [],
      advancePayment: '',
      cloudVideoLink: "",
      cloudScreenLink: "",
      cloudVideoPath: "",
      cloudScreenPath: "",
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
      comment: null,
      brandSafe: false,
   })


   useEffect(() => {
      (async () => {
         try {
            const { data } = await trelloInstance.get(`/1/lists/63e5341325d9dbaec985b3ca/cards/?customFieldItems=true`, {
               headers: {
                  'Content-Type': 'application/json'
               },
               params: {
                  fields: ['name', 'url', 'labels', 'desc'],
                  members: true
               },
            })

            const doneTasks = data.filter(el =>
               el.labels.some(el => el.id === '6243c7bd3718c276cb21e2cb'
               )).filter(el => el.customFieldItems.every(el => el.idValue !== '6360c514c95f85019ca4d612'))

            isDoneCards(doneTasks)

            isApprovedCards(data.filter(el => el.customFieldItems.some(el => el.idValue === '6360c514c95f85019ca4d612')).filter(el => el.labels.some(el => el.id === '6243c7bd3718c276cb21e2cb')))
         } catch (err) {
            console.log(err)
         }
      })()
   }, [])

   useEffect(() => {
      (async () => {
         try {
            const { data } = await Axios.get('/video2/findByNotApproved')
            setCardsForPublishing(data)
            console.log(data)
         } catch (err) {
            console.log(err)
         }
      })()

   }, [])

   useEffect(() => {
      (async () => {
         try {
            const { data } = await Axios.get('/video2/findByIsBrandSafe')
            setSocialMediaCards(data)
         } catch (err) {
            console.log(err)
         }
      })()
   }, [])

   useEffect(() => {
      (async () => {
         try {
            const { data } = await Axios.get('/video2/findByFixed')
            setFixedCards(data)
         } catch (err) {
            console.log(err)
         }
      })()
   }, [])

   useEffect(() => {
      (async () => {
         try {
            const { data } = await trelloInstance.get('/1/boards/qTvBYsA3/memberships?member=true')
            setMembers(Array.from(data.map(el => { return el?.member?.fullName })))

         } catch (err) {
            console.log(err)
         }
      })()
   }, [])

   const changeEditBlockState = (data) => {
      setEditBlockCardInfo({
         ...editBlockCardInfo,
         videoId: data.videoData.videoId,
         trelloCardUrl: data?.trelloData.trelloCardUrl,
         trelloCardId: data?.trelloData.trelloCardId,
         trelloCardName: data?.trelloData.trelloCardName,
         priority: data?.trelloData.priority,
         originalLink: data?.videoData.originalVideoLink,
         vbCode: data?.uploadData && data?.uploadData.vbCode ? data?.uploadData.vbCode.replace('VB', '') : '',
         authorEmail: data?.uploadData && data?.uploadData.authorEmail ? data?.uploadData.authorEmail : '',
         percentage: data?.uploadData && data?.uploadData.percentage ? data?.uploadData.percentage : '',
         researchers: data?.trelloData.researchers,
         advancePayment: data?.uploadData && data?.uploadData.advancePayment ? data?.uploadData.advancePayment : '',
         agreementLink: data.uploadData && data?.uploadData.agreementLink ? data.uploadData.agreementLink : '',
         title: data?.videoData.title,
         desc: data?.videoData.description,
         creditTo: data?.videoData.creditTo ? data?.videoData.creditTo : '',
         tags: data?.videoData.tags,
         category: data?.videoData.category,
         city: data?.videoData.city,
         country: data?.videoData.country,
         date: data?.videoData.date,
         brandSafe: data?.brandSafe,
         comment: data?.needToBeFixed ? data?.needToBeFixed.comment : null,
         cloudVideoLink: data.bucket.cloudVideoLink,
         cloudScreenLink: data.bucket.cloudScreenLink,
         cloudVideoPath: data.bucket.cloudVideoPath,
         cloudScreenPath: data.bucket.cloudScreenPath,
         whereFilmed: data?.uploadData && data?.uploadData.whereFilmed ? data.uploadData.whereFilmed : '',
         whyDecide: data?.uploadData && data?.uploadData.whyDecide ? data.uploadData.whyDecide : '',
         whatHappen: data?.uploadData && data?.uploadData.whatHappen ? data.uploadData.whatHappen : '',
         whenFilmed: data?.uploadData && data?.uploadData.whenFilmed ? data.uploadData.whenFilmed : '',
         whoAppears: data?.uploadData && data?.uploadData.whoAppears ? data.uploadData.whoAppears : '',
         video: null,
         screen: null,
      })
   }

   const addComment = async (e) => {
      e.preventDefault()
      const notification = toast.loading("Wait. the Сomment is added...");
      try {

         setFetchStatus('loading')

         const { data } = await Axios.patch(`/video2/addCommentForFixed`,
            {
               comment: commentForEmployee,
               videoId: editBlockCardInfo.videoId
            })


         if (data.message) {
            toast.custom(
               <ToastCustom text={data.message} />,
               { duration: 5000, id: notification });
         } else {
            toast.success(`Сomment for employee added`, {
               duration: 6000, id: notification
            });
            changeEditBlockState(data)
            setCommentForEmployee(data?.needToBeFixed ? data?.needToBeFixed.comment : '')
            setFixedModalOpen(false)
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

   const findLastVideo = async () => {
      try {
         const { data } = await Axios.get('/video2/findOne', {
            headers: {
               'Content-Type': 'application/json'
            },
         })
         if (!data.message) {

            console.log('dhdjhufjghfhffh')
            changeEditBlockState(data)
         }
      } catch (err) {
         console.log(err)
      }
   }

   const doneCardHandleClick = (card) => {
      window.open(card.url)
      setVisitedCards([...visitedCards, card.id])
   }

   const renderResearcher = (card) => {
      if (card.members) {
         let arr = []
         card.members.map(el => {
            arr.push(el.fullName)
         }).join('')
         console.log(arr)
         return arr
      } else {
         return []
      }

   }

   const findVideoById = async () => {
      try {
         const { data } = await Axios.get(`/video2/findOne/${videoId}`)
         if (data.message) {
            toast.custom(
               <ToastCustom text={data.message} />,
               { duration: 5000 });
         } else {
            changeEditBlockState(data)
            toast.success(`Information on video with id "${data.videoData.videoId}" received`, {
               duration: 6000
            });
         }
      } catch (err) {
         console.log(err)
         toast.error('Server-side error...', {
            duration: 6000
         });
      } finally {
         setVideoId('')
      }
   }

   const handleClickApprovedCard = async (card) => {

      const cardWithVBCode = card.customFieldItems.find(el => el.idCustomField === '63e659f754cea8f9978e3b63')

      console.log(cardWithVBCode)

      if (cardWithVBCode) {
         const VBCode = cardWithVBCode?.value?.number

         try {
            const { data } = await Axios.get(`/uploadInfo/findOne/${VBCode}`, null, {
               headers: {
                  'Content-Type': 'application/json'
               },
            })
            if (data.message === 'Форма не найдена!') {
               toast.custom(
                  <ToastCustom text={`The form with the number VB${VBCode} was not found in the database!`} />,
                  { duration: 5000 });
               setActiveAddVideo({
                  trelloCardUrl: card.url,
                  trelloCardId: card.id,
                  trelloCardName: card.name,
                  originalLink: card.desc,
                  vbCode: VBCode,
                  authorEmail: '',
                  percentage: '',
                  researchers: renderResearcher(card),
                  advancePayment: '',
                  agreementLink: '',
                  video: '',
                  screen: '',
                  title: '',
                  desc: '',
                  creditTo: '',
                  tags: [],
                  category: '',
                  city: '',
                  country: '',
                  date: '',
                  priority: card.customFieldItems.find(el => el.idValue === '62c7e0032a86d7161f8cadb2') ? true : false,
                  whereFilmed: '',
                  whyDecide: '',
                  whatHappen: '',
                  whenFilmed: '',
                  whoAppears: '',
               })
            } else {
               setActiveAddVideo({
                  trelloCardUrl: card.url,
                  trelloCardId: card.id,
                  trelloCardName: card.name,
                  originalLink: card.desc,
                  vbCode: VBCode,
                  authorEmail: data.email,
                  agreementLink: data.agreementLink,
                  percentage: data.percentage && data.percentage,
                  advancePayment: data.advancePayment && data.advancePayment,
                  whereFilmed: data.whereFilmed && data.whereFilmed,
                  whyDecide: data.whyDecide && data.whyDecide,
                  whatHappen: data.whatHappen && data.whatHappen,
                  whenFilmed: data.whenFilmed && data.whenFilmed,
                  whoAppears: data.whoAppears && data.whoAppears,
                  researchers: renderResearcher(card),
                  priority: card.customFieldItems.find(el => el.idValue === '62c7e0032a86d7161f8cadb2') ? true : false,
                  video: '',
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
               toast.success(`data from the ${VBCode} form is obtained from the database!`, {
                  duration: 6000
               });
            }
         } catch (err) {
            console.log(err)
            toast.error('Server-side error...', {
               duration: 6000
            });
         }
      } else {
         toast.custom(
            <ToastCustom text="The 'vb code' field is not in the trello card" />,
            { duration: 6000 });
         setActiveAddVideo({
            trelloCardUrl: card.url,
            trelloCardId: card.id,
            trelloCardName: card.name,
            originalLink: card.desc,
            vbCode: '',
            authorEmail: '',
            agreementLink: '',
            percentage: '',
            researchers: renderResearcher(card),
            advancePayment: '',
            video: '',
            screen: '',
            title: '',
            desc: '',
            priority: card.customFieldItems.find(el => el.idValue === '62c7e0032a86d7161f8cadb2') ? true : false,
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
   }

   const changeTrelloCard = async (data) => {
      try {

         //добавляем кастомное поле "id video" в карточке trello
         const { data: reqTrelloVideoId } = await trelloInstance.put(`/1/cards/${data.trelloCardId}/customField/62c7e085e02dcc1fe80f7b6f/item`, {
            value: {
               number: `${data.videoId}`
            }
         })
         //убираем наклейку "not published" в карточке trello
         const { data: reqTrelloNotPublished } = await trelloInstance.delete(`/1/cards/${data.trelloCardId}/idLabels/6243c7bd3718c276cb21e2cb`)


         //добавляем кастомное поле "brand safe" в карточке trello
         const { data: reqTrelloBrandSafe } = await trelloInstance.put(`/1/cards/${data.trelloCardId}/customField/6363888c65a44802954d88e3/item`, {
            "idValue": data.brandSafe ? "6363888c65a44802954d88e5" : "6363888c65a44802954d88e4"
         })

         toast.success(`The card in trello has been successfully changed`, {
            duration: 6000
         });

      } catch (err) {
         console.log(err)
         toast.error('Error on the "trello" server side...', {
            duration: 6000
         });
      }
   }

   const handleClickCard = (e, card) => {
      e.preventDefault()
      changeEditBlockState(card)
   }

   const toPublish = async (e) => {
      e.preventDefault()
      const notification = toast.loading("Wait. The video is published in the feed...");

      try {

         setFetchStatus('loading')

         const { data } = await Axios.patch(`/video2/publishing/${editBlockCardInfo.videoId}`)

         if (data.message) {
            toast.custom(
               <ToastCustom text={data.message} />,
               { duration: 5000, id: notification });
         } else {

            changeTrelloCard(data)
            toast.success(`The video is published!`, {
               duration: 6000, id: notification
            });



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


   return (
      <Grid className={styles.container} container>
         <FixedModal
            addComment={addComment}
            commentForEmployee={commentForEmployee}
            setCommentForEmployee={setCommentForEmployee}
            open={fixedModalOpen}
            handleClose={() => setFixedModalOpen(false)}
         />
         <CheckAnswersModal
            open={modalOpen}
            handleClose={() => setModalOpen(false)}
            answerState={answerState}
            content={[
               {
                  title: 'Where was this video filmed?',
                  value: activeAddVideo.whereFilmed,
               },
               {
                  title: 'Why did you decide to film this video?',
                  value: activeAddVideo.whyDecide,
               },
               {
                  title: 'What is happening on the video?',
                  value: activeAddVideo.whatHappen,
               },
               {
                  title: 'When was this video filmed?',
                  value: activeAddVideo.whenFilmed,
               },
               {
                  title: 'Who appears in the video? Their names and ages?',
                  value: activeAddVideo.whoAppears,
               },
            ]
               .filter(el => el.value)}
         />
         <CheckAnswersModalEdit
            open={editAnswerModal}
            handleClose={() => setEditAnswerModal(false)}
            answerState={editAnswerState}
            content={[
               {
                  title: 'Where was this video filmed?',
                  value: editBlockCardInfo.whereFilmed,
               },
               {
                  title: 'Why did you decide to film this video?',
                  value: editBlockCardInfo.whyDecide,
               },
               {
                  title: 'What is happening on the video?',
                  value: editBlockCardInfo.whatHappen,
               },
               {
                  title: 'When was this video filmed?',
                  value: editBlockCardInfo.whenFilmed,
               },
               {
                  title: 'Who appears in the video? Their names and ages?',
                  value: editBlockCardInfo.whoAppears,
               },
            ]
               .filter(el => el.value)}
         />
         <FormControlLabel className={styles.modeCheckbox} control={<Checkbox checked={isAdminMode} onChange={(e) => setIsAdminMode(e.target.checked)} />} label="Admin mode" />
         <Grid className={styles.upItems} style={{ gridTemplateRows: isAdminMode ? 'repeat(5, auto)' : 'repeat(4, auto)' }}>
            {isAdminMode && <Grid className={styles.upItem} item xs={12}>
               <Box className={styles.upItemBoxText}><h2>Waiting for publishing:</h2></Box>

               <Box className={styles.upBox} >
                  {cardsForPublishing?.sort((a, b) => {
                     if (a?.trelloData?.priority === true) {
                        return -1
                     } return 1
                  }).map(card => (
                     <Box key={card.videoData.videoId} className={clsx(styles.upBoxItem, card.videoData.videoId === editBlockCardInfo.videoId && styles.active)}>
                        <button onClick={(e) => handleClickCard(e, card)}>
                           <span>{card.trelloData.trelloCardName}</span>
                        </button>
                        {card.trelloData.priority === true && <WhatshotTwoTone />}
                     </Box>
                  ))}
               </Box>
            </Grid>}
            <Grid className={styles.upItem} item xs={12}>
               <Box className={styles.upItemBoxText}><h2 className={styles.upItemDoneTitle}>Done:</h2></Box>
               <Box className={styles.upBox} >
                  {doneCards?.sort((a, b) => {
                     if (a?.customFieldItems?.find(el => el.idValue === '62c7e0032a86d7161f8cadb2')) {
                        return -1
                     } return 1
                  }).map(card => (
                     <Box key={card.id} className={clsx(styles.upBoxItem, visitedCards.find(id => id === card.id) && styles.visited)}>
                        <button onClick={() => doneCardHandleClick(card)}>
                           <span>{card?.name?.substring(0, 20)}{card?.name?.length >= 20 && '...'}</span>
                        </button>
                        {card.customFieldItems.find(el => el.idValue === '62c7e0032a86d7161f8cadb2') && <WhatshotTwoTone />}

                     </Box>
                  ))}
               </Box>
            </Grid>
            <Grid className={styles.upItem} item xs={12}>
               <Box className={styles.upItemBoxText}><h2 className={styles.upItemApprovedTitle}>Approved:</h2></Box>
               <Box className={styles.upBox}>
                  {approvedCards?.sort((a, b) => {
                     if (a?.customFieldItems?.find(el => el.idValue === '62c7e0032a86d7161f8cadb2')) {
                        return -1
                     } return 1
                  }).map(card => (
                     <Box key={card.id} className={clsx(styles.upBoxItem, card.id === activeAddVideo.trelloCardId && styles.active)}>
                        <button onClick={() => handleClickApprovedCard(card)}>
                           <span>{card?.name?.substring(0, 20)}{card?.name?.length >= 20 && '...'}</span>
                        </button>
                        {card.customFieldItems.find(el => el.idValue === '62c7e0032a86d7161f8cadb2') && <WhatshotTwoTone />}
                     </Box>
                  ))}
               </Box>
            </Grid>
            <Grid className={styles.upItem} item xs={12}>
               <Box className={styles.upItemBoxText}><h2>Social media:</h2></Box>
               <Box className={styles.upBox}>
                  {socialMediaCards?.sort((a, b) => {
                     if (a?.trelloData?.priority === true) {
                        return -1
                     } return 1
                  }).map(card => (
                     <Box key={card.videoData.videoId} className={clsx(styles.upBoxItem, card.videoData.videoId === editBlockCardInfo.videoId && styles.active)}>
                        <button onClick={(e) => handleClickCard(e, card)}>
                           <span>{card.trelloData.trelloCardName}</span>
                        </button>
                        {card.trelloData.priority === true && <WhatshotTwoTone />}
                     </Box>
                  ))}
               </Box>
            </Grid>
            <Grid className={styles.upItem} item xs={12}>
               <Box className={styles.upItemBoxText}><h2>Fix this:</h2></Box>
               <Box className={styles.upBox}>
                  {fixedCards?.sort((a, b) => {
                     if (a?.trelloData?.priority === true) {
                        return -1
                     } return 1
                  }).map(card => (
                     <Box key={card.videoData.videoId} className={clsx(styles.upBoxItem, card.videoData.videoId === editBlockCardInfo.videoId && styles.active)}>
                        <button onClick={(e) => handleClickCard(e, card)}>
                           <span>{card.trelloData.trelloCardName}</span>
                        </button>
                        {card.trelloData.priority === true && <WhatshotTwoTone />}
                     </Box>
                  ))}
               </Box>
            </Grid>
         </Grid>
         <Grid className={styles.mainBlock} container sm={12} onClick={() => console.log(activeAddVideo)}>

            <PublishingAddSection
               categoryVariants={categoryVariants}
               findLastVideo={findLastVideo}
               activeAddVideo={activeAddVideo}
               setActiveAddVideo={setActiveAddVideo}
               setModalOpen={setModalOpen}
               members={members}
               fetchStatus={
                  fetchStatus
               }
               setFetchStatus={setFetchStatus}
            />

            <PublishingEditSection
               categoryVariants={categoryVariants}
               isAdminMode={isAdminMode}
               findLastVideo={findLastVideo}
               setEditBlockCardInfo={setEditBlockCardInfo}
               editBlockCardInfo={editBlockCardInfo}
               setEditAnswerModal={setEditAnswerModal}
               changeEditBlockState={changeEditBlockState}
               members={members}
               fetchStatus={
                  fetchStatus
               }
               setFetchStatus={setFetchStatus}
            />

         </Grid>
         <Grid sm={12} className={styles.downFindBlock}>
            <Box className={styles.downFindBox}>
               <TextField type='number' value={videoId} onChange={(e) => { setVideoId(e.target.value) }} variant='outlined' label='Find a video' />
               <Button disabled={!videoId || fetchStatus === 'loading'} onClick={() => findVideoById()} className={clsx([styles.grayBtn, styles._btn])}><span>Search</span><Search /></Button>
            </Box>
            {isAdminMode && <Box className={styles.adminBtnBlock}>
               <Button disabled={!editBlockCardInfo.videoId || editBlockCardInfo.comment || fetchStatus === 'loading'} onClick={(e) => toPublish(e)}>Publish</Button>
               <Button disabled={!editBlockCardInfo.videoId || fetchStatus === 'loading'} onClick={() => setFixedModalOpen(true)}>Fix it</Button>
            </Box>}

         </Grid>
      </Grid>
   )
}

export default Publishing






