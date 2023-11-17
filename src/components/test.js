import axios from 'axios';
import { useState, StrictMode, useEffect } from 'react';
import { Button, Container, Navbar, Row } from 'react-bootstrap';
import {
    Outlet,
    useLocation,
    createBrowserRouter,
    Link,
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";
import { createContext } from 'react';
import { io } from "socket.io-client";
import { motion } from "framer-motion";
import Pageone from './pageone';
import Pagetwo from './pagetwo';
import Summary from './pagethree';

export const date = createContext(null);
export const time = createContext(null);
export const start = createContext(null);
export const end = createContext(null);
export const car = createContext(null);
export const note = createContext(null);

const router = createBrowserRouter([
    {
        path: '/pageone', element: < Pageone />
    },
    {

        path: '/pagetwo', element: < Pagetwo />
    }]);


const PageLayout = ({ children }) => children;

const pageVariants = {
    initial: {
        opacity: 0
    },
    in: {
        opacity: 1
    },
    out: {
        opacity: 1
    }
};

const pageTransition = {
    type: "tween",
    ease: "linear",
    duration: 0.5
};

const AnimationLayout = () => {
    const { pathname } = useLocation();
    return (
        <PageLayout>
            <motion.div
                key={pathname}
                initial="initial"
                animate="in"
                variants={pageVariants}
                transition={pageTransition}
            >
                <Outlet />
            </motion.div>
        </PageLayout>
    );
};
function Test(props) {
    const [data_date, setdate] = useState('');
    const [data_time, settime] = useState('');
    const [data_start, setstart] = useState('');
    const [data_end, setend] = useState('');
    const [data_car, setcar] = useState('')
    const [text, settext] = useState('none')
    const [data_dropoffdis,setdropoffdis]=useState(0);
    const [data_dropoffprice,setdropoffprice]=useState(0)
    const [data_dropofftotal,setdropofftotal]=useState(0)
    const [data_pickupdis,setpickupdis]=useState(0);
    const [data_pickupprices,setpickupprices]=useState(0);
    const [data_pickuptotal,setpickuptotal]=useState(0);
    const [data_void,set_void]=useState(0);
    
    useEffect(() => {
        // socket.connect();
    })
    var getprice = () => {
        axios.get('/price',  {params:{ date: data_date, time: data_time, start: data_start, end: data_end,car:data_car }} ).then((res)=>{
            console.log(res);
            setstart(res.data.address)
            setdropoffdis(res.data.dropoff_dis)
            setdropoffprice(res.data.dropoff_price)
            setdropofftotal(res.data.dropoff_total)
            setpickupdis(res.data.pickup_dis)
            setpickupprices(res.data.pickup_price)
            setpickuptotal(res.data.pickup_total)
            set_void(res.data.pickup_dis_aviod)
        }).catch((err)=>{
            console.log(err)
        })
    }
    // useEffect(() => {
    //     socket.emit('coming',{date:data_date,time:data_time,start:data_start,end:data_end})
    // }, [data_date, data_end, data_start, data_time])
    return (
        <date.Provider value={{ data_date, setdate }}>
            <time.Provider value={{ data_time, settime }}>
                <start.Provider value={{ data_start, setstart }}>
                    <end.Provider value={{ data_end, setend }}>
                        <car.Provider value={{ data_car, setcar }}>
                            <Container style={{ 'maxWidth': '400px', 'minHeight': '400px', 'height': '100vh' }}>
                                <Row style={{ 'height': '100%' }}>
                                    <StrictMode>
                                        <Router>
                                            <Navbar>
                                                <Link to='pageone'>pageone</Link>
                                                <Link to='pagetwo'>pagetwo</Link>
                                                <Link to='/pagethree'>pagethree</Link>
                                            </Navbar>
                                            <Routes>
                                                <Route element={<AnimationLayout />}>

                                                    {[<Route path='/pageone' name='pageone' element={<Pageone></Pageone>} />,
                                                    <Route path='/pagetwo' name='pagetwo' element={<Pagetwo getprice={getprice}></Pagetwo>} />,
                                                    <Route path='/pagethree' name='pagethree' element={<Summary 
                                                        data_dropoffdis={data_dropoffdis} 
                                                        data_dropoffprice={data_dropoffprice}
                                                        data_dropofftotal={data_dropofftotal}
                                                        data_pickupdis={data_pickupdis}
                                                        data_pickupprices={data_pickupprices}
                                                        data_pickuptotal={data_pickuptotal}
                                                        data_void={data_void}
                                                        data_date={data_date}
                                                        data_time={data_time}
                                                        data_car={data_car}
                                                        data_start={data_start}
                                                        data_end={data_end}
                                                        ></Summary>} />]
                                                    }
                                                </Route>
                                            </Routes>
                                        </Router>
                                    </StrictMode>
                                </Row>

                            </Container >
                        </car.Provider>
                    </end.Provider>
                </start.Provider>
            </time.Provider>
        </date.Provider>


    )

}
export default Test

