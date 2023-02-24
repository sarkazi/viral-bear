
import React from 'react'
import { toastOptions } from '../constants/toastOptions'
import { ReportProblem } from '@mui/icons-material';


const ToastCustom = ({ text }) => {
   return (
      <div style={toastOptions}>
         <ReportProblem style={{ width: '20px' }} />
         <span>{text}</span>
      </div>
   )
}

export default ToastCustom