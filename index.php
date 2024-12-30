<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="styling.css">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="manifest" href="/site.webmanifest">
    <title>my_portfolio_namurindaalex</title>
    <link rel="stylesheet" href="style.css">
    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css" rel="stylesheet">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <link rel="stylesheet"
        href="https://use.fontawesome.com/releases/v5.5.0/css/all.css"
        integrity="sha384- 
        B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU"
        crossorigin="anonymous">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">

    <!-- <?php
            //PDO database connection
            // include 'databasecreation.php';
            // include 'db.php';

            // $statusMessage = '';

            // // contact form submission
            // if ($_SERVER["REQUEST_METHOD"] == "POST") {
            //     // Get the input values
            //     $name = $_POST['name'];
            //     $email = $_POST['email'];
            //     $subject = $_POST['subject'];
            //     $message = $_POST['message'];
            //     $sql = "INSERT INTO feedbacks (client_name, client_email, feedback_subject, feedback_message) VALUES (:name, :email, :subject, :message)";

            //     try {
            //         // Prepare the statement
            //         $stmt = $conn->prepare($sql);

            //         // Bind parameters to the statement
            //         $stmt->bindParam(':name', $name);
            //         $stmt->bindParam(':email', $email);
            //         $stmt->bindParam(':subject', $subject);
            //         $stmt->bindParam(':message', $message);

            //         $stmt->execute();

            //         // Set success message with user input
            //         $statusMessage = "Message sent successfully! We shall contact you soon!";
            //     } catch (PDOException $e) {
            //         $statusMessage = "Error: " . $e->getMessage();
            //     }
            // }
            ?> -->

    <script>
        // Function to show the popup and hide it after 2 seconds
        function showPopup(message) {
            const popup = document.getElementById("popup");
            popup.innerText = message;
            popup.style.display = "block";

            // Hide popup after 2 seconds
            setTimeout(() => {
                popup.style.display = "none";
            }, 2000);
        }

        document.addEventListener("DOMContentLoaded", () => {
            const hero = document.getElementById("home");
            const heroContent = document.querySelector(".hero-content");

            const animateHero = () => {
                const heroTop = hero.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;

                // Add animation when hero is visible
                if (heroTop < windowHeight * 0.8 && heroTop > 0) {
                    heroContent.classList.add("animate");
                } else {
                    heroContent.classList.remove("animate"); // Reset animation when leaving viewport
                }
            };

            // Apply animation on scroll
            document.addEventListener("scroll", animateHero);

            // Apply animation on page load
            animateHero();
        });
    </script>
</head>

<body>
    <!-- HEADER HTML -->
    <header class="portfolio-header">
        <div class="logo">
            <h1>MY PORTFOLIO</h1>
        </div>
        <nav class="nav-links">
            <a href="#home">HOME</a>
            <a href="#projects">PROJECTS</a>
            <a href="#about">ABOUT</a>
            <a href="#contact">CONTACT</a>
            <a href="#testimonies">TESTIMONIES</a>
        </nav>

        <div class="menu-btn">☰</div>
    </header>


    <!-- Hero Section -->
    <section class="hero" id="home">
        <div class="hero-bg"></div>
        <div class="hero-content" data-aos="fade-up">
            <h1 id="demo"></h1>
            <p>A Backend Developer | Creative Problem Solver | Communication Engineer | Embedded System Designer | IT Consultant</p>
            <div class="cta">
                <a href="cv.pdf" download class="btn">Download Resume</a>
                <a href="#contact" class="btn">Hire Me</a>
            </div>
        </div>
    </section>


    <!-- projects Section -->
    <section class="projects" id="projects">
        <h2 style="text-align: center; margin-bottom: 1.7rem;">My projects</h2>
        <p> Welcome to my projects showcase! Each project in this portfolio tells a story 
            of curiosity, innovation, and determination.<br />
            From concept to completion, I’ve designed, developed, and refined solutions that solve real-world 
            problems while showcasing the power of technology and creativity.
            <br />These projects are more than just code and design, they’re my 
            way of leaving a meaningful mark in the world of technology.
            <br /><br />Therefore, I invite you to explore my work, where 
            every project is a step forward and a testament to my commitment to solving problems 
            and pushing the boundaries of technology. Explore how I’ve applied my skills in Electronics, 
            Communication, and Software Development to craft solutions that inspire growth and make a difference.
        </p>
        <div class="projects-grid">
            <div class="service-card real-weather" data-aos="fade-up">
                <div class="service-card-image">
                    <img src="images/smartmeter.jpeg" alt="smartmeter Image" class="service-image">
                </div>

                <div class="service-icon">
                    <i class='bx bx-chip'></i>
                </div>
                <h3>Advanced Smart meter</h3>
                <p>This project combines a centralized hardware setup 
                    with a user-friendly web application enabling tenants to 
                    log in to their accounts, view real-time consumption, recharge their 
                    electricity balance remotely, receive personalized 
                    energy-saving recommendations, and access support through an integrated chatbot.
                </p>
            </div>
            <div class="service-card field-sensor" data-aos="fade-up">
                <div class="service-card-image">
                    <img src="images/vanilla.jpg" alt="smart payment" class="service-image">
                </div>

                <div class="service-icon">
                    <i class='bx bx-credit-card'></i>
                </div>
                <h3>Vanilla infonet</h3>
                <p>
                    This is an interactive web-portal designed to empower vanilla farmers in
                    Western Uganda by providing them with real-time access to market information,
                    direct connections to buyers, and detailed insights into pricing trends.
                </p>
            </div>
            <div class="service-card experts" data-aos="fade-up">
                <div class="service-card-image">
                    <img src="images/agritech.png" alt="Real time Monitoring" class="service-image">
                </div>

                <div class="service-icon">
                    <i class='bx bx-bar-chart-alt'></i>
                </div>
                <h3>Smart Garden monitoring system</h3>
                <p>This project utilizes IoT sensors to collect real-time data on soil moisture, temperature, 
                    and humidity, integrated with weather forecast data, to provide farmers with 
                    actionable insights via a user-friendly web application.<br><br>
                </p>
            </div>
            <div class="service-card field-sensor" data-aos="fade-up">
                <div class="service-card-image">
                    <img src="images/attendance.png" alt="smart payment" class="service-image">
                </div>

                <div class="service-icon">
                    <i class='bx bx-credit-card'></i>
                </div>
                <h3>Attendance management system</h3>
                <p>This project presents an efficient Attendance Management System tailored for 
                    hospital employees. The system enables employees to log into their accounts 
                    and mark their attendance in and out with ease.<br>Thus, administrators can monitor attendance records, generate detailed reports, 
                    and ensure accurate tracking of working hours, fostering improved management and productivity 
                    within the healthcare environment.
                </p>
            </div>
            <div class="service-card experts" data-aos="fade-up">
                <div class="service-card-image">
                    <img src="images/voting.jpeg" alt="Real time Monitoring" class="service-image">
                </div>

                <div class="service-icon">
                    <i class='bx bx-bar-chart-alt'></i>
                </div>
                <h3>Electronic voting system</h3>
                <p>This utilizes biometric authentication for secure and efficient voting. Voters simply press their finger to be verified 
                    against the database, granting them access to cast their vote. <br>The system ensures a seamless and 
                    tamper-proof voting process, while real-time results are tracked and monitored through an intuitive 
                    and user-friendly web application, promoting transparency and trust in the electoral process.
                </p>
            </div>
            <div class="service-card field-sensor" data-aos="fade-up">
                <div class="service-card-image">
                    <img src="images/seesaw.jpeg" alt="smart payment" class="service-image">
                </div>

                <div class="service-icon">
                    <i class='bx bx-credit-card'></i>
                </div>
                <h3>Automatic Payment & Disconnection</h3>
                <p>With our integrated mobile payment options, users can conveniently pay for energy usage via mobile money. <br /><br />The system ensures continuous service by automatically disconnecting users with insufficient balances until payments are made.</p>
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section class="about" id="about">
        <div class="about-content">
            <h2 style="text-align: center; margin-bottom: 2rem;">About Me</h2>
            <p class="aboutme">My name is <strong>Namurinda Alex</strong>, and I am a backend developer with a strong
                foundation in electronics, embedded systems, and web technologies.  Born and raised in Ibanda 
                district in Western part of Uganda. I am currently staying in Kampala-Uganda. 
                <br /><br />My academic journey started with a solid performance at Citizen SS- Ibanda, where I excelled in science subjects
                (Physics, Economics and Mathematics), paving the way for <strong>a diploma in Computer Science</strong> at Uganda
                Institute of Information and Technology.
                Building on this, I pursued a <strong>Bachelors degree of Engineering in Electronics and Communication</strong> , which broadened 
                my expertise and gave me the tools to tackle real-world challenges.
                I have honed my skills in database management, PHP, JavaScript, and MySQL, and I am constantly l
                earning to stay ahead in the ever-evolving tech industry
                Over the years, I’ve worked on diverse <a href="#projects" style="text-decoration:none; font-weight:600;">PROJECTS</a> as a few are indicated above.
                <br /><br />Beyond work, I find joy in music and swimming, which help me recharge and stay inspired. Whether 
                it’s the rhythm of a favorite song or the calm of a swim, these moments fuel my creativity.
                I dream of building scalable and impactful solutions that address real-world challenges, particularly 
                in agriculture, healthcare, transport and community empowerment. I’m always open to collaboration and eager to 
                contribute to projects that make a difference.
                <br /><br />Let’s connect and create something extraordinary together!"
            </p>

            <div class="mission-vision">
                <div class="mission-card" data-aos="zoom-in">
                    <div class="mission-vision-card-image">
                        <img src="images/mission_icon.png" alt="Mission Icon">
                    </div>
                    <h3>Mission</h3>
                    <p>To develop smart solutions in embedded systems, backend technologies, and web development that 
                        address pressing challenges in agriculture, healthcare, and business sectors.</p>
                </div>
                <div class="vision-card" data-aos="zoom-in">
                    <div class="mission-vision-card-image">
                        <img src="images/vision_icon.png" alt="Vision Icon">
                    </div>
                    <h3>Vision</h3>
                    <p>To lead as a visionary developer, building systems that connect people, 
                        improve lives, and contribute to a sustainable and inclusive digital future.
                    </p>
                </div>
            </div>
        </div>
    </section>

    <section class="team-section">
        <h2 style="text-align: center; margin-bottom: 3rem;">More of me</h2>
        <div class="team-grid">
            <!-- Team Member 1 -->
            <div class="team-card" data-aos="fade-up" data-aos-delay="100">
                <div class="team-card-image">
                    <img src="images/developer.jpeg" alt="profile photo">
                    <div class="social-overlay">
                        <a href="https://www.linkedin.com/in/namurinda-alex-25217a255/" target="_blank" class="social-icon"><i class="fab fa-linkedin"></i></a>
                        <a href="https://x.com/namurindaalex43" target="_blank" class="social-icon"><i class="fab fa-twitter"></i></a>
                        <a href="https://github.com/namurindaalex" target="_blank" class="social-icon"><i class="fab fa-github"></i></a>
                    </div>
                </div>
                <div class="team-card-content">
                    <h3>Namurinda Alex</h3>
                    <p></p>
                </div>
            </div>

            <!-- Team Member 2 -->
            <div class="team-card" data-aos="fade-up">
                <div class="team-card-image">
                    <img src="images/me2.JPG" alt="developer">
                    <div class="social-overlay">
                        <a href="https://www.linkedin.com/in/namurinda-alex-25217a255/" target="_blank" class="social-icon"><i class="fab fa-linkedin"></i></a>
                        <a href="https://x.com/namurindaalex43" target="_blank" class="social-icon"><i class="fab fa-twitter"></i></a>
                        <a href="https://github.com/namurindaalex" target="_blank" class="social-icon"><i class="fab fa-github"></i></a>
                    </div>
                </div>
                <div class="team-card-content">
                    <h3>Computer Science Graduate</h3>
                    <p>Second class upper</p>
                </div>
            </div>

            <!-- Team Member 3 -->
            <div class="team-card" data-aos="fade-up" data-aos-delay="300">
                <div class="team-card-image">
                    <img src="images/me3.jpg" alt="Williams">
                    <div class="social-overlay">
                        <a href="https://www.linkedin.com/in/namurinda-alex-25217a255/" target="_blank" class="social-icon"><i class="fab fa-linkedin"></i></a>
                        <a href="https://x.com/namurindaalex43" target="_blank" class="social-icon"><i class="fab fa-twitter"></i></a>
                        <a href="https://github.com/namurindaalex" target="_blank" class="social-icon"><i class="fab fa-github"></i></a>
                    </div>
                </div>
                <div class="team-card-content">
                    <h3>AgriTech Team </h3>
                    <p>Head of Electronics</p>
                </div>
            </div>
        </div>
    </section>

    <section class="contact-section" id="contact-section">
        <!-- <?php if ($statusMessage): ?>
            <div id="popup" class="popup"></div>
            <script>
                // Display popup with PHP message
                showPopup("<?php echo $statusMessage; ?>");
            </script>
        <?php endif; ?> -->

        <style>
            .popup {
                display: none;
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background-color: #f6921e;
                color: white;
                padding: 15px;
                border-radius: 5px;
                z-index: 1000;
                white-space: pre-line;
            }
        </style>
    </section>


    <script src="https://static.elfsight.com/platform/platform.js" async></script>
    <div class="elfsight-app-ed47ff79-c1aa-40ee-a5cb-1190ecb3d578" data-elfsight-app-lazy id="testimonies"></div>

    <!-- Footer -->
    <footer id="contact1">
        <div class="footer-content">
            <!--
            <div class="logo-footer">
                <div class="logo-footer-image">
                    <img src="images/logo.png" alt="">
                </div>
                <p>Protecting your bills through technology</p>
            </div>
            -->
            <div class="quick-links">
                <h2>Quick Links</h2>
                <p><a href="#home" style="color: white;">Home</a></p>
                <p><a href="#projects" style="color: white;">projects</a></p>
                <p><a href="#about" style="color: white;">About Us</a></p>
                <p><a href="#how-it-works" style="color: white;">How It Works</a></p>
            </div>
            <div class="contact-us-footer">
                <h2>Contact Details</h2>
                <p><i class='bx bxs-envelope'></i>namurindaalex43@gmail.com</p>
                <p><i class='bx bxs-phone-call'></i>Phone: +256780393671</p>
                <p><i class="fas fa-map-marker-alt"></i>Jinja Road, Nabisunsa close, Kampala</p>
            </div>
            <div class="socials">
                <h2>My socials</h2>
                <p><a href="#"><i class='fab fa-facebook' style="color: #fff;"></i> Facebook</a></p>
                <p><a href="#"><i class='fab fa-instagram' style="color: #fff;"></i> Instagram</a></p>
                <p><a href="#"><i class="fab fa-linkedin" style="color: #fff;"></i> LinkedIn</a></p>
                <p><a href="#"><i class="fab fa-twitter" style="color: #fff;"></i> Twitter</a></p>
            </div>
        </div>
    </footer>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js"></script>
    <script>
        // Initialize AOS animation library
        AOS.init({
            duration: 1000,
            once: true
        });

        // Mobile menu toggle
        const menuBtn = document.querySelector('.menu-btn');
        const navLinks = document.querySelector('.nav-links');

        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
                navLinks.classList.remove("active");
            });
        });
    </script>
    <script>
        var i = 0;
        var txt = 'Hello, <br /> I am NAMURINDA ALEX';
        var speed = 50;

        function typeWriter() {
            if (i < txt.length) {
                if (txt.substring(i, i + 6) === "<br />") {
                    document.getElementById("demo").innerHTML += "<br />";
                    i += 6;
                } else {
                    document.getElementById("demo").innerHTML += txt.charAt(i);
                    i++;
                }
                setTimeout(typeWriter, speed);
            }
        }
        window.onload = typeWriter;
    </script>


    <script src="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js"></script>
    <script>
        AOS.init({
            once: false,
            offset: 120,
            duration: 500,
            easing: 'ease-in-out',
        });
    </script>
</body>

</html>