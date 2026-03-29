import PortfolioClient from "./PortfolioClient";
import { portfolioData } from "@/lib/schema";

export default function Home() {
  return (
    <>
      <noscript>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px", fontFamily: "system-ui, sans-serif" }}>
          <h1>Abdul Rahman Azam – Full Stack AI Engineer</h1>
          <p>Abdul Rahman Azam is a Full Stack AI Engineer from Karachi, Pakistan, specializing in machine learning, deep learning, and modern web development with React, Node.js, and Python. He is currently pursuing a BS in Artificial Intelligence at FAST NUCES Karachi with a CGPA of 3.33.</p>
          <h2>About Abdul Rahman Azam</h2>
          <p>Abdul Rahman Azam builds AI-powered web applications that combine machine learning models with full-stack engineering. His projects include an Income Prediction System achieving 85% accuracy on 32,000+ census records, a Super Tic-Tac-Toe AI with Minimax and Alpha-Beta Pruning, and a University Resource Sharing Platform built with React, Node.js, and PostgreSQL. He has solved 290+ LeetCode problems, earned 6 skill badges, and holds HackerRank Problem Solving certifications at both Basic and Intermediate levels.</p>
          <h2>Skills &amp; Technical Expertise</h2>
          <p>Web Development: {portfolioData.skills.web.map(s => s.name).join(", ")}</p>
          <p>AI/ML &amp; Data Science: {portfolioData.skills.aiml.map(s => s.name).join(", ")}</p>
          <h2>Projects by Abdul Rahman Azam</h2>
          {portfolioData.projects.map(p => (
            <div key={p.id}>
              <h3>{p.title} ({p.period})</h3>
              <p>{p.description} Technologies: {p.technologies.join(", ")}. {p.highlights.join(". ")}.</p>
            </div>
          ))}
          <h2>Education</h2>
          {portfolioData.education.map(e => (
            <p key={e.id}>{e.degree} – {e.institution} ({e.period}) – {e.score}</p>
          ))}
          <h2>Achievements &amp; Certifications</h2>
          {portfolioData.achievements.map(a => (
            <p key={a.id}><strong>{a.title}:</strong> {a.description}</p>
          ))}
          <h2>Contact Abdul Rahman Azam</h2>
          <p>Email: {portfolioData.social.email}</p>
          <p>GitHub: {portfolioData.social.github}</p>
          <p>LinkedIn: {portfolioData.social.linkedin}</p>
          <p>LeetCode: {portfolioData.social.leetcode}</p>
          <p>Website: {portfolioData.siteUrl}</p>
        </div>
      </noscript>
      <PortfolioClient />
    </>
  );
}
