import "../pages/About.css";
import ceo from "../assets/ceo.jpg";
import { Link } from "react-router-dom";

function About() {

  return (

    <div className="about-page">
       
       <div className="about-back">
  <Link to="/" className="home-btn">
    ← Home
  </Link>
</div> 

     {/* ================= FOUNDER ================= */}

<section className="founder-section">

  <div className="founder-image">

    <img
      src={ceo}
      alt="Shrinivas H P"
    />

  </div>

  <div className="founder-content">

    <p>

      "At Aetherix Technologies, we believe
      Artificial Intelligence should solve
      real-world challenges and create
      meaningful impact for every industry."

    </p>

    <p>

      Our goal is to develop innovative,
      intelligent and scalable AI solutions
      that empower organizations with
      accurate insights and better
      decision-making.

    </p>

  </div>

</section>

      {/* ================= MISSION & VISION ================= */}

      <section className="mission-section">

        <div className="mission-card">

          <h2>

            Our Mission

          </h2>

          <p>

            To deliver innovative AI-powered
            solutions that improve decision-making,
            efficiency and sustainability through
            intelligent technology.

          </p>

        </div>

        <div className="mission-card">

          <h2>

            Our Vision

          </h2>

          <p>

            To become a globally trusted Artificial
            Intelligence company driving innovation,
            research and digital transformation
            across industries.

          </p>

        </div>

      </section>
            {/* ================= WHY CHOOSE AETHERIX ================= */}

      <section className="why-aetherix">

        <h2>

          Why Choose Aetherix?

        </h2>

        <div className="why-grid">

          <div className="why-card">

            <h3>🤖 AI Powered</h3>

            <p>

              Advanced Artificial Intelligence
              delivering intelligent insights
              and automation.

            </p>

          </div>

          <div className="why-card">

            <h3>⚡ Real-Time Intelligence</h3>

            <p>

              Live monitoring and
              instant analytics for
              smarter decision-making.

            </p>

          </div>

          <div className="why-card">

            <h3>🔒 Secure Platform</h3>

            <p>

              Enterprise-grade security
              with reliable cloud
              infrastructure.

            </p>

          </div>

          <div className="why-card">

            <h3>🌍 Innovation</h3>

            <p>

              Continuously developing
              AI solutions for the
              future.

            </p>

          </div>

        </div>

      </section>

      {/* ================= CONTACT ================= */}

      <section className="contact-section">

        <h2>

          Contact Us

        </h2>

        <p>

          We'd love to hear from you.
          Reach out to Aetherix Technologies
          for collaboration, partnerships
          or support.

        </p>

        <div className="contact-grid">

          <div className="contact-card">

            <h3>📧 Email</h3>

            <p>shrinivas@aetherixcloud.com</p>

          </div>

          <div className="contact-card">

            <h3>🌐 Website</h3>

            <p>www.aetherixcloud.com</p>

          </div>

          <div className="contact-card">

  <h3>📞 Phone</h3>

  <p>

    +91 9900510879 

  </p>

</div>

 </div>


      </section>

    </div>

  );

}

export default About;