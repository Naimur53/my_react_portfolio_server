
import React, { useEffect, useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import GitHubIcon from '@mui/icons-material/GitHub';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Container, Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import { allData } from '../../../tools/dataSlice/dataSlice';
import { AnimatePresence, motion } from 'framer-motion';
import { mainTransition } from '../../../utilities/transition';
import ThreeDBg from './BackgroundAnimation/ThreeDBg';
import CommonHeading from '../CommonHeading/CommonHeading';

const ContactMe = () => {
    const { scrollValue } = useSelector(allData)
    const form = useRef();
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        emailjs.init("user_a3GVCrfeuHPf6uxUpcNzX")
    }, [])
    const sendEmail = (e) => {
        e.preventDefault();
        setLoading(true)

        emailjs.sendForm('service_k43azve', 'template_u7c7h1b', '#contact-form')
            .then((result) => {
                form.current.reset()
                setLoading(false)
                toast.success('Thanks for your Email', {
                    position: "bottom-left",
                    autoClose: 5000,
                    hideProgressBar: false,
                    theme: 'dark',
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }, (error) => {
                setLoading(false)
                toast.error('Something is went wrong', {
                    position: "bottom-left",
                    autoClose: 5000,
                    hideProgressBar: false,
                    theme: 'dark',
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            });
    };

    const xn = [0, 40, 200,]
    const yn = [0, 40, 100,]

    const x = xn.map(single => `${single}%`)
    const y = yn.map(single => `-${single}%`)

    const xRe = xn.map(single => `-${single}%`)
    const yRe = yn.map(single => `${single}%`)
    const normal = {
        x: 0,
        y: 0,
        transition: { ease: [1, 1, 1, 1,] }
    }
    const transition = { delay: .5, ease: [1, 1, 1, 1,], duration: 1 }

    const animate1 = {
        x: xRe,
        y: yRe,
        transition
    }
    const animate2 = {
        x: x,
        y,
        transition

    }
    const rotate = {
        rotate: 0,
    }
    const rotateTran = {
        repeat: Infinity,
        duration: .9,
        delay: 1,
        repeatType: "loop",
        ease: [1, 1, 1, 1,]
    }
    return (
        <AnimatePresence>
            {
                scrollValue >= 15.9 && <motion.div
                    initial={{
                        opacity: 0,
                    }}
                    animate={{
                        opacity: 1,
                        transition: { ease: mainTransition(), delay: .5 }
                    }}
                    exit={{ opacity: 0 }}

                    className='h-full flex justify-center items-center pointer-events-auto relative pt-12 md:pt-0'>
                    <section id='contact' className="contact-section py-5 relative z-50">
                        <CommonHeading heading='Contact me' ></CommonHeading>
                        <Container className="  content-container">
                            <Grid container data-aos="fade-up" spacing={4}>
                                <Grid md={6} item xs={12}>
                                    <form ref={form} id="contact-form" onSubmit={sendEmail}>
                                        <Grid container spacing={4}>
                                            <Grid item xs={6} md={6}>
                                                <input required type="hidden" name="contact_number" className='single-box' />
                                                <input className="w-full single-box p-3 rounded" required type="text" placeholder="Name"
                                                    name="user_name" />
                                            </Grid>
                                            <Grid item xs={6} md={6}>
                                                <input className="w-full single-box p-3 rounded" required type="email" placeholder="Email"
                                                    name="user_email" />
                                            </Grid>
                                            <Grid item xs={12} md={12}>
                                                <textarea className="w-full single-box p-3 rounded h-20 md:h-auto" rows="7" name="message"
                                                    placeholder="Your message"></textarea>
                                            </Grid>
                                        </Grid>
                                        <div className="d-flex justify-content-center mt-3">

                                            {
                                                loading ? <input className="text-center rounded text-white single-box mb-2 px-3 py-2 " value="Sending" type='button' /> : <div>
                                                    <div className="button-wrapper">
                                                        <input className="rounded text-white button single-box mb-2 cursor-pointer hover:bg-black  px-3 py-2 " type="submit" value="Send Message" />
                                                        <div className="button-bg inline-block"></div>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    </form>

                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <Grid container spacing={4}>
                                        <Grid item xs={12}  >
                                            <div className="hidden  p-2 py-4  md:flex flex-col items-center single-box ">
                                                <div
                                                    className="contact-icon-wrap flex  justify-center items-center rounded-full">

                                                    <LocationOnIcon></LocationOnIcon>
                                                </div>
                                                <p className="mt-3">Munshigonj, Dhaka, Bangladesh</p>

                                            </div>
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            <div
                                                className="p-2 pt-4 h-100 single-box   flex flex-col items-center  ">
                                                <div
                                                    className="contact-icon-wrap flex justify-center items-center rounded-full">

                                                    <ConnectWithoutContactIcon></ConnectWithoutContactIcon>
                                                </div>
                                                <ul className="social  flex justify-center pl-0 w-full mt-3">
                                                    <li><a href="https://github.com/Naimur53"> <GitHubIcon></GitHubIcon>
                                                    </a></li>
                                                    <li><a href="https://www.facebook.com/naimur.rahman.39501789"><FacebookIcon></FacebookIcon></a></li>
                                                    <li><a href="https://www.linkedin.com/in/naimur-rahman-a56b83216/"><LinkedInIcon></LinkedInIcon></a></li>


                                                </ul>
                                                <p className="mt-3 block md:hidden">Munshigonj, Dhaka, Bangladesh</p>
                                                <p className="mt-3 block md:hidden">naimurrhman53@gmail.com</p>

                                            </div>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <div className="p-2 py-4 single-box  hidden md:flex flex-col items-center h-full  ">
                                                <div
                                                    className="contact-icon-wrap flex justify-center items-center rounded-full">

                                                    <MailOutlineIcon></MailOutlineIcon>
                                                </div>
                                                <p className="mt-3">naimurrhman53@gmail.com</p>

                                            </div>
                                        </Grid>
                                    </Grid>
                                </Grid>

                            </Grid>
                        </Container>
                        <ToastContainer />
                    </section>
                    <AnimatePresence>

                        {
                            scrollValue >= 16 && <ThreeDBg></ThreeDBg>
                        }
                    </AnimatePresence>

                </motion.div>
            }
        </AnimatePresence >

    );
};

export default ContactMe;