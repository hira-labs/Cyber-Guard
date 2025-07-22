import React from 'react';
import styles from '../assets/styles/CyberSecurityLandingPage.module.css';
import Typewriter from "typewriter-effect";

const CyberSecurityLandingPage = () => {
  return (
    <div className={styles.container}>
      {/* Navbar can go here */}
      
      <main className={styles.mainContent}>
        <h2>
          <Typewriter
            options={{ loop: true, typeSpeed: 50, deleteSpeed: 30, delay: 50 }}
            onInit={(typewriter) => {
              typewriter
                .typeString("AI-Powered Hiring")
                .pauseFor(1000)
                .deleteAll()
                .typeString("Automated Evaluations")
                .pauseFor(1000)
                .deleteAll()
                .typeString("Smarter Recruitment Decisions")
                .pauseFor(1000)
                .deleteAll()
                .start();
            }}
          />
        </h2>
        
        <div className={styles.ctaButtons}>
          <button className={styles.signupBtn}>Get Started</button>
          <button className={styles.loginBtn}>Learn More</button> --
        </div>
      </main>
      
      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} CyberSecurity Solutions. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default CyberSecurityLandingPage;