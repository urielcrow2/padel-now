import {useEffect,useState,useRef} from 'react';
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import {HomeScreen1} from './HomeScreen1';
import {ButtonWhatsApp} from '../utils/whatsapp/ButtonWhatsApp';

import './slide.css';

function TabPanel({ children, value, index, ...other }) {

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      style={{minHeight:'calc( 100vh - 94px )'}}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const Icon = ({name})=>{
    return(
        <i className={`fa ${name} fa-2x fa-fw`}></i>
    )
}

const Borrar = ()=>{
    return(
        <input type="text" name="name" className="form-control" placeholder="probando..."/>
    )
}

const HomeScreen = ()=> {

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    <Box sx={{ bgcolor: '#fff', width: '100%' }}>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
        //   indicatorColor="secondary"
            TabIndicatorProps={{
            style: {
              backgroundColor: "#fff"
            }
          }}
          textColor="inherit"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab style={{fontSize:10}} className="crow-custome" label="Nuevo" icon={<Icon name="fa-plus" />} {...a11yProps(0)} />
          <Tab label="Administrar" icon={<Icon name="fa-pencil-square-o" />} {...a11yProps(1)} />
          <Tab label="Configurar" icon={<Icon name="fa-cog" />} {...a11yProps(2)} />
        </Tabs>
      </AppBar>

      <SwipeableViews axis={'x'} index={value} onChangeIndex={handleChangeIndex}>
        <TabPanel value={value} index={0} >
            <Borrar/>
        </TabPanel>
        <TabPanel value={value} index={1} >
            <HomeScreen1 />
            
        </TabPanel>
        <TabPanel value={value} index={2}>
          Item Three
        </TabPanel>
      </SwipeableViews>

      <ButtonWhatsApp />  

    </Box>
  );
}

export default HomeScreen;
