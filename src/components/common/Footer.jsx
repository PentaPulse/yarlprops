import React from 'react';
import '@fortawesome/fontawesome-free/css/all.css';
import './Footer.css';

const Footer = () => {
    return (
        <>
            <div className="Footer">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 col-lg-5 col-12 ft-1">
                            <h3><span>YARL</span>PROPS</h3>
                            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laborum ea quo ex ullam laboriosam magni totam, facere eos iure voluptate.</p>
                            <div className="footer-icons">
                                <i className="fa-brands fa-facebook"></i>
                                <i className="fa-brands fa-twitter"></i>
                                <i className="fa-brands fa-instagram"></i>
                                <i className="fa-brands fa-linkedin-in"></i>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-3 col-12 ft-2">
                            <h5>Quick Links</h5>
                            <ul>
                                <li className="nav-item">
                                    <a className="" href="/">Services</a>
                                </li>
                                <li className="nav-item">
                                    <a className="" href="/">Contact Us</a>
                                </li>
                                <li className="nav-item">
                                    <a className="" href="/">Portfolio</a>
                                </li>
                            </ul>
                        </div>
                        <div className="col-md-6 col-lg-4 col-12 ft-3">
                            <h5>Quick Links</h5>
                            <p><i className="fa-solid fa-phone-volume"></i> +94 77 1234567</p>
                            <p><i className="fa-solid fa-envelope"></i> PentaPulse@gmail.com</p>
                            <p><i className="fa-solid fa-paper-plane"></i> Ramanathan Road, Thirunelvely, Jaffna</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='Last-footer'>
                <p>© 2024 Designed By PentaPulse</p>
            </div>
        </>
    )
}

export default Footer;
