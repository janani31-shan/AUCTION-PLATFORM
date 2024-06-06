import React from 'react';
import { Link as RouterLink } from "react-router-dom";
import './css/footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhone, faEnvelopeOpen,faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css'; // Import Font Awesome CSS
import { faFacebookF, faInstagram, faTwitter,faTelegram} from '@fortawesome/free-brands-svg-icons';
 import logo from '../assets/logo.svg';
const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="container">
        <div className="footer-cta pt-5 pb-5">
          <div className="row">
            <div className="col-xl-4 col-md-4 mb-30">
              <div className="single-cta">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="icon-color" size="2x" />
                <div className="cta-text">
                  <h4>Find us</h4>
                  <span>1010 Avenue, sw 54321, chandigarh</span>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-md-4 mb-30">
              <div className="single-cta">
              <FontAwesomeIcon icon={faPhone} className="icon-color" size="2x" />
                <div className="cta-text">
                  <h4>Call us</h4>
                  <span>9876543210 0</span>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-md-4 mb-30">
              <div className="single-cta">
              <FontAwesomeIcon icon={faEnvelopeOpen} className="icon-color" size="2x"/>
                <div className="cta-text">
                  <h4>Mail us</h4>
                  <span>mail@info.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-content pt-5 pb-5">
          <div className="row">
            <div className="col-xl-4 col-lg-4 mb-50">
              <div className="footer-widget">
                <div className="footer-logo">
                  <a href="index.html">
                    <img
                      src={logo}
                      className="img-fluid"
                      alt="logo"
                    />
                  </a>
                </div>
                <div className="footer-text">
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                    sed do eiusmod tempor incididuntut consectetur adipisicing
                    elit, Lorem ipsum dolor sit amet.
                  </p>
                </div>
                <div className="footer-social-icon">
                  <span>Follow us</span>
                  <a href="#">
                  <FontAwesomeIcon icon={faFacebookF} className="icon-color" size="2x" />
                  </a>
                  <a href="#">
                  <FontAwesomeIcon icon={faInstagram} className="icon-color" size="2x" />
                  </a>
                  <a href="#">
                  <FontAwesomeIcon icon={faTwitter} className="icon-color" size="2x" />
                  </a>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6 mb-30">
              <div className="footer-widget">
                <div className="footer-widget-heading">
                  <h3>Useful Links</h3>
                </div>
                <ul>

                  <li>
                  <RouterLink  to="/">
                  Home
                </RouterLink>
                  </li>

                  <li>
                  <RouterLink to="/profile">
                  Profile
                  </RouterLink>
                  </li>

                  <li>
                  <RouterLink  to="/dashboard">
                  Dashboard
                 </RouterLink>
                  </li>

                  <li>
                    <a href="#">About us</a>
                  </li>

                  <li>
                    <a href="#">Contact</a>
                  </li>

                  <li>
                    <a href="#">Community</a>
                  </li>

                  <li>
                    <a href="#">Our Services</a>
                  </li>

                  <li>
                    <a href="#">Expert Team</a>
                  </li>

                </ul>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6 mb-50">
              <div className="footer-widget">
                <div className="footer-widget-heading">
                  <h3>Subscribe</h3>
                </div>
                <div className="footer-text mb-25">
                  <p>
                    Don’t miss to subscribe to our new feeds, kindly fill the
                    form below.
                  </p>
                </div>
                <div className="subscribe-form">
                  <form action="#">
                    <input type="text" placeholder="Email Address" />
                    <button>
                    <FontAwesomeIcon icon={faPaperPlane} className="icon-color" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="copyright-area">
        <div className="container">
          <div className="row">
            <div className="col-xl-6 col-lg-6 text-center text-lg-left">
              <div className="copyright-text">
                <p>
                  Copyright &copy; 2023, All Right Reserved{' '}
                  <a href="https://codepen.io/anupkumar92/"> Team 9/11</a>
                </p>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 d-none d-lg-block text-right">
              <div className="footer-menu">
                <ul>

                  <li>
                  <RouterLink  to="/">
                  Home
                </RouterLink>
                  </li>

                  <li>
                    <a href="#">Terms</a>
                  </li>

                  <li>
                    <a href="#">Privacy</a>
                  </li>

                  <li>
                    <a href="#">Policy</a>
                  </li>

                  <li>
                    <a href="#">Contact</a>
                  </li>

                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
