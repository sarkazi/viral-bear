

export const downloadExcelWidthVideoInfo = (data) => {
   const url = window.URL.createObjectURL(new Blob([data]));
   const link = document.createElement('a');
   link.href = url;
   if (typeof window.navigator.msSaveBlob === 'function') {
      window.navigator.msSaveBlob(
         data,
         "data.xlsx"
      );
   } else {
      link.setAttribute('download', "data.xlsx");
      document.body.appendChild(link);
      link.click();
   }
   document.body.removeChild(link);
   link.remove()
}