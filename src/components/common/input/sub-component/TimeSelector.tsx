import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

interface IData {
    value?: any,
    onChange?: any
}

const TimeSelector: React.FC<IData> = ({value, onChange}) => {

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker onChange={onChange}
        sx={{
            width:'100%',
            height:'3rem',
            borderRadius:'8px',

            '& .MuiOutlinedInput-root': {
                '@media (max-width: 1539px)':{
                    height: '4rem',
                },
                borderRadius:'8px',
                fontSize:'14px',
                fontFamily: 'Inter',
                '&:hover': {
                    '& .MuiOutlinedInput-notchedOutline': {
                        border: '1px solid #E4E9F1',
                    },
                  },
       
                '&.Mui-focused': {
                    '& .MuiOutlinedInput-notchedOutline': {
                        border: '1px solid #E4E9F1',
                        boxShadow: 'none'
                    },
                  },
            },
            '& ..css-1g7nc1s-MuiPickersLayout-root': {
                display: 'grid',
                gridAutoColumns: '100%',
                gridAutoRows: '100%',
                width: '234px',
            }        
        }}
        />
    </LocalizationProvider>
  );
}

export default TimeSelector








// import React from 'react';
// import TextField from '@mui/material/TextField';
// import InputAdornment from '@mui/material/InputAdornment';
// import IconButton from '@mui/material/IconButton';
// import AccessTimeIcon from '@mui/icons-material/AccessTime';
// import { styled } from '@mui/material';
// import palettes from '@/constants/palettes';

// const TimeSelector: React.FC = () => {
//     const inputRef = React.useRef();


//     const handleChange = (e: any) => {
//         const selectedTime = e.target.value;
//         const hours = selectedTime.slice(0, 2);
//         const minutes = selectedTime.slice(3, 5);
//         let hours12 = parseInt(hours, 10) % 12 || 12;
//         const amPm = parseInt(hours, 10) < 12 ? 'AM' : 'PM';
//         const time12HourFormat = `${hours12}:${minutes} ${amPm}`;
//         console.log("The event", time12HourFormat);
//       };

//       const handleIconClick = () => {
//         inputRef.current.click();
//         // Programmatically trigger the click on the input to open the time picker
//         document.getElementById('time-input').click();
//       };

//   return (
//     <TimeWrapper
//       onChange={handleChange}
//       defaultValue="04:20"
//       type="time"
//       InputLabelProps={{
//         shrink: true,
//       }}
//       inputProps={{
//         step: 300,
//         style: {
//             height:'.6rem',
//             borderRadius:'8px'
            
//         },
//         id: 'time-input',
//         ref: inputRef,
//       }}
      
//       InputProps={{
//         endAdornment: (
//             <InputAdornment position="end">
//             <IconButton
//             //   className={classes.iconButton}
//               aria-label="select time"
//               onClick={handleIconClick}
//             >
//               <AccessTimeIcon />
//             </IconButton>
//           </InputAdornment>
//         ),
//         style: {
//           // Custom styles for the input container if needed
//         },
//       }}
//     />
//   );
// };

// export default TimeSelector;


// const TimeWrapper = styled(TextField)(({ theme })=>({
//     display:'flex',
//     flexDirection:'column',
//     width:'100%',
//     borderRadius: '8px',
//     '& .MuiOutlinedInput-root': {
//         borderRadius:'8px',
//         '& fieldset': {
//             border: `.5px solid #D0D5DD`
//         },
//         '&:hover fieldset': {
//             border: `.5px solid #D0D5DD`,
//         },
//         '&.Mui-focused fieldset': {
//             border: `.5px solid #D0D5DD`
//         },
//       },
// }))
