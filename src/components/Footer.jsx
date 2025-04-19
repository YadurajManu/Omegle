import React from 'react'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-container">
          <div className="footer-left">
            <div className="footer-logo">
              <span className="logo-text">cupid</span>
              <div className="logo-dot"></div>
            </div>
            <p className="footer-tagline">Connect with new people around the world through anonymous video chats.</p>
            <div className="app-badges">
              <div className="app-badge">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.954 11.616L15.911 8.65599L6.36601 3.29399C5.93735 3.03569 5.44256 2.90317 4.94324 2.91342C4.44392 2.92368 3.9548 3.07619 3.53601 3.35699L12.954 11.616Z" fill="currentColor"/>
                  <path d="M16.911 14.856L20.637 12.634C21.0315 12.3978 21.3482 12.054 21.5417 11.6436C21.7351 11.2331 21.796 10.7735 21.7151 10.3266C21.6342 9.87959 21.4156 9.46752 21.0889 9.14888C20.7622 8.83024 20.3449 8.6205 19.895 8.546L16.905 14.856H16.911Z" fill="currentColor"/>
                  <path d="M3.53598 3.357C3.01231 3.70112 2.63486 4.22141 2.47765 4.82182C2.32044 5.42222 2.39521 6.0553 2.68898 6.6L12.953 11.616L3.53598 3.357Z" fill="currentColor"/>
                  <path d="M16.911 14.862L12.953 11.616L3.53601 20.643C3.95485 20.9238 4.44404 21.0762 4.94342 21.0865C5.4428 21.0967 5.93765 20.9642 6.36601 20.706L16.911 14.862Z" fill="currentColor"/>
                </svg>
                <span>Get it on Google Play</span>
              </div>
              <div className="app-badge">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.377 24H5.62296C4.57921 24 3.57827 23.5891 2.83431 22.8584C2.09035 22.1276 1.66968 21.146 1.66669 20.1225V3.87746C1.66968 2.85404 2.09035 1.87241 2.83431 1.14165C3.57827 0.410885 4.57921 0 5.62296 0H18.377C19.4193 0 20.4192 0.409845 21.1624 1.13944C21.9056 1.86904 22.3261 2.84929 22.33 3.87175V20.1225C22.3261 21.145 21.9056 22.1252 21.1624 22.8548C20.4192 23.5844 19.4193 23.9943 18.377 24Z" fill="currentColor"/>
                  <path d="M16.0842 12.0057C16.0752 11.1795 16.3442 10.3724 16.8524 9.70186C17.3605 9.03136 18.0783 8.53542 18.8917 8.29125C18.524 7.75091 18.0301 7.31083 17.4523 7.00654C16.8745 6.70225 16.2311 6.54287 15.577 6.54297C14.1814 6.4248 12.8433 7.41501 12.1291 7.41501C11.4008 7.41501 10.3175 6.55669 9.14421 6.58021C8.35033 6.60516 7.57932 6.83297 6.91379 7.23938C6.24826 7.64579 5.71354 8.21379 5.36914 8.88364C3.91554 11.5113 4.99645 15.3496 6.38611 17.4838C7.07978 18.5267 7.89674 19.7092 8.9659 19.6716C10.0025 19.6292 10.398 19.0221 11.6512 19.0221C12.8901 19.0221 13.2608 19.6716 14.3501 19.6481C15.4751 19.6292 16.1804 18.5855 16.8444 17.5309C17.3392 16.7549 17.7086 15.8998 17.9361 15H17.9252C17.9352 14.9932 17.9434 14.9839 17.9489 14.9733C17.9543 14.9627 17.9568 14.951 17.9561 14.9393C17.9555 14.9276 17.9517 14.9163 17.9452 14.9064C17.9388 14.8965 17.9298 14.8884 17.9191 14.8826C17.027 14.4525 16.4198 13.5979 16.0842 12.0057Z" fill="white"/>
                  <path d="M14.0559 5.3363C14.6603 4.62341 14.9281 3.69259 14.7909 2.77583H14.78C14.0094 2.85065 13.2939 3.22019 12.7746 3.8087C12.5226 4.09279 12.3253 4.42015 12.1931 4.77385C12.0609 5.12754 11.9962 5.50181 12.0023 5.87838C12.3923 5.88626 12.7789 5.80473 13.134 5.63953C13.4891 5.47432 13.8038 5.22966 14.0559 4.92352V5.3363Z" fill="white"/>
                </svg>
                <span>Download on App Store</span>
              </div>
            </div>
          </div>
          
          <div className="footer-links">
            <div className="footer-column">
              <h4>Legal</h4>
              <ul>
                <li><a href="#" className="footer-link">Terms of Service</a></li>
                <li><a href="#" className="footer-link">Privacy Policy</a></li>
                <li><a href="#" className="footer-link">Cookie Policy</a></li>
                <li><a href="#" className="footer-link">GDPR Compliance</a></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h4>Resources</h4>
              <ul>
                <li><a href="#" className="footer-link">Safety Tips</a></li>
                <li><a href="#" className="footer-link">Community Guidelines</a></li>
                <li><a href="#" className="footer-link">Support Center</a></li>
                <li><a href="#" className="footer-link">FAQ</a></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h4>Company</h4>
              <ul>
                <li><a href="#" className="footer-link">About Us</a></li>
                <li><a href="#" className="footer-link">Blog</a></li>
                <li><a href="#" className="footer-link">Careers</a></li>
                <li><a href="#" className="footer-link">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Cupid. All rights reserved.</p>
          <div className="social-links">
            <a href="#" className="social-link" aria-label="Twitter">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 4.01C21 4.5 20.02 4.69 19 4.82C20.07 4.19 20.85 3.13 21.23 1.92C20.24 2.52 19.14 2.98 18 3.19C17.07 2.13 15.84 1.5 14.5 1.5C12.15 1.5 10.26 3.41 10.26 5.77C10.26 6.16 10.3 6.54 10.37 6.91C6.82 6.7 3.41 5.09 1.39 2.62C1.02 3.36 0.83 4.19 0.83 5.07C0.83 6.71 1.61 8.16 2.78 9.03C1.94 9.01 1.15 8.79 0.48 8.44V8.5C0.48 10.56 2 12.29 4 12.75C3.65 12.86 3.28 12.91 2.9 12.91C2.63 12.91 2.37 12.88 2.12 12.83C2.64 14.51 4.2 15.73 6.01 15.76C4.57 16.89 2.82 17.56 0.91 17.56C0.57 17.56 0.23 17.54 0 17.5C1.84 18.72 4.01 19.41 6.35 19.41C14.54 19.41 18.82 12.95 18.82 7.28V6.69C19.83 6.13 20.66 5.32 21.5 4.5L22 4.01Z" fill="currentColor"/>
              </svg>
            </a>
            <a href="#" className="social-link" aria-label="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.162C15.204 2.162 15.584 2.174 16.849 2.232C18.157 2.291 19.504 2.599 20.457 3.551C21.419 4.513 21.728 5.827 21.786 7.151C21.845 8.416 21.857 8.796 21.857 12C21.857 15.204 21.845 15.584 21.786 16.849C21.728 18.172 21.419 19.486 20.457 20.449C19.495 21.401 18.157 21.709 16.849 21.768C15.584 21.826 15.204 21.838 12 21.838C8.796 21.838 8.416 21.826 7.151 21.768C5.843 21.709 4.496 21.401 3.543 20.449C2.581 19.486 2.272 18.172 2.214 16.849C2.156 15.584 2.143 15.204 2.143 12C2.143 8.796 2.156 8.416 2.214 7.151C2.272 5.827 2.581 4.513 3.543 3.551C4.505 2.599 5.843 2.291 7.151 2.232C8.416 2.174 8.796 2.162 12 2.162ZM12 0C8.741 0 8.332 0.014 7.052 0.072C5.197 0.157 3.355 0.673 2.057 1.971C0.759 3.269 0.243 5.11 0.158 6.966C0.1 8.246 0.086 8.654 0.086 11.914C0.086 15.173 0.1 15.582 0.158 16.862C0.243 18.717 0.759 20.559 2.057 21.857C3.355 23.155 5.197 23.671 7.052 23.756C8.332 23.814 8.741 23.828 12 23.828C15.259 23.828 15.668 23.814 16.948 23.756C18.803 23.671 20.645 23.155 21.943 21.857C23.241 20.559 23.757 18.717 23.842 16.862C23.9 15.582 23.914 15.173 23.914 11.914C23.914 8.654 23.9 8.246 23.842 6.966C23.757 5.11 23.241 3.269 21.943 1.971C20.645 0.673 18.803 0.157 16.948 0.072C15.668 0.014 15.259 0 12 0Z" fill="currentColor"/>
                <path d="M12 5.838C8.597 5.838 5.838 8.597 5.838 12C5.838 15.403 8.597 18.162 12 18.162C15.403 18.162 18.162 15.403 18.162 12C18.162 8.597 15.403 5.838 12 5.838ZM12 16C9.791 16 8 14.209 8 12C8 9.791 9.791 8 12 8C14.209 8 16 9.791 16 12C16 14.209 14.209 16 12 16Z" fill="currentColor"/>
                <path d="M18.406 7.032C19.2014 7.032 19.844 6.38975 19.844 5.594C19.844 4.79825 19.2014 4.156 18.406 4.156C17.6103 4.156 16.968 4.79825 16.968 5.594C16.968 6.38975 17.6103 7.032 18.406 7.032Z" fill="currentColor"/>
              </svg>
            </a>
            <a href="#" className="social-link" aria-label="Facebook">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 12C22 6.477 17.523 2 12 2C6.477 2 2 6.477 2 12C2 16.991 5.657 21.128 10.438 21.879V14.89H7.898V12H10.438V9.797C10.438 7.291 11.93 5.907 14.215 5.907C15.309 5.907 16.453 6.102 16.453 6.102V8.562H15.193C13.95 8.562 13.563 9.333 13.563 10.124V12H16.336L15.893 14.89H13.563V21.879C18.343 21.128 22 16.991 22 12Z" fill="currentColor"/>
              </svg>
            </a>
            <a href="#" className="social-link" aria-label="YouTube">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.54 6.42C22.4212 5.94541 22.1792 5.51057 21.8386 5.15941C21.498 4.80824 21.0707 4.55318 20.6 4.42C18.88 4 12 4 12 4C12 4 5.12 4 3.4 4.46C2.92925 4.59318 2.50198 4.84824 2.16141 5.19941C1.82085 5.55057 1.57878 5.98541 1.46 6.46C1.14521 8.20556 0.991235 9.97631 0.999999 11.75C0.988779 13.537 1.14277 15.3213 1.46 17.08C1.57959 17.5398 1.82153 17.9581 2.16089 18.3044C2.50026 18.6507 2.92487 18.9038 3.39 19.04C5.12 19.5 12 19.5 12 19.5C12 19.5 18.88 19.5 20.6 19.04C21.0707 18.9068 21.498 18.6518 21.8386 18.3006C22.1792 17.9494 22.4212 17.5146 22.54 17.04C22.8524 15.2945 23.0063 13.5238 23 11.75C23.0112 9.96295 22.8572 8.1787 22.54 6.42Z" fill="currentColor"/>
                <path d="M9.75 15.02L15.5 11.75L9.75 8.48001V15.02Z" fill="white"/>
              </svg>
            </a>
          </div>
          <div className="language-selector">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2V2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <select className="language-select">
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer 