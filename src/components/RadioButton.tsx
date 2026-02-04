import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { color } from 'framer-motion';
import { pink } from '@mui/material/colors';

interface RadioButtonProps {
  onChange: (val: any) => void;
  defaultValue?: any
}


export default function RadioButton({
  onChange,
  defaultValue
 }: RadioButtonProps) {


  return (
    <FormControl>
      
      <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        defaultValue="Text Message"
        name="radio-buttons-group"
        className='flex flex-row text-[0.83vw] accent-black'
        onChange={(e) => onChange(e.target.value)}
        value={defaultValue}
      >
        <FormControlLabel value="SMS" control={<Radio  sx={{ color: 'black', '&.Mui-checked': { color: 'black' } }} />} label="Text Message" color='pink' className=' text-[0.83vw]'  />
        <FormControlLabel 
        value="CALL" 
        control={<Radio sx={{ color: 'black', '&.Mui-checked': { color: 'black' } }} />} 
        label="Phone Call"
        
        />
       
      </RadioGroup>
    </FormControl>
  );
}
