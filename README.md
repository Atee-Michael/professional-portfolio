# Michael Atee — Cybersecurity | Cloud | Frontend 

This repository contains source code for my professional web profile.

It showcases who I am, what I have built, and how I approach technology with a focus on security, performance, and long-term maintainability.

The site is styled with my personal colour palette, rooted in autumn tones, and structured to reflect how I work: **clean, deliberate, and detail-driven**.



## Why This Exists

I have worked across multiple industries, consulting, automotive, retail, and tech, and transitioned into cloud and cybersecurity through both real-world experience and formal training. This portfolio is built to:

- Provide access to my CV and technical write-ups  
- Walk through some key projects I have built  
- Demonstrate how I apply security standards like OWASP Top 10, NIST CSF, and ISO 27001 in practice  
- Share design decisions behind the code, not just the outcome



## Projects

Each project links to its own documentation so that anyone, technical or not, can follow the logic behind it.

| Project                              | Docs Path                     |
|--------------------------------------|-------------------------------|
| Scanzo — SQL Injection Scanner       | `/docs/scanzo-tech-doc.pdf`   |
| Fixed by MYC — Automotive Advisory   | `/docs/fixedbymyc-doc.pdf`    |
| IoT Intrusion Detection (ESP32-CAM)  | `/docs/iot-ids-doc.pdf`       |

These are projects I have built independently or led end-to-end. In previous roles like Loystar (React + Ant Design), I have also contributed to frontend development, but those are not the focus of this portfolio.



## Key Areas of Work

- **Cybersecurity Engineering**: Secure architecture, vulnerability scanning, browser-based tools  
- **Cloud & Systems**: AWS-certified, infrastructure planning, secure deployments  
- **Web Development**: Next.js, React, custom theming, component design  
- **Automation & IoT**: Real-world security applications using microcontrollers (ESP32)  
- **Technical Documentation**: Each project includes an explanation of the why, how, and what’s next



## Security Implementation in This Site

This site is not just frontend UI focused, it is built with defensive programming in mind:

- CSP headers and secure HTTP enforced  
- Input sanitisation on all forms  
- OWASP Top 10 considered in every component  
- No third-party scripts unless controlled  
- All static assets are self-hosted  
- No data collected, no trackers, no analytics bloat

I run periodic manual checks using **Burp Suite**, browser console tools, and my own Chrome extension vulnerability scanner **(Scanzo)** to verify resilience.



## Admin Console

The portfolio includes a private `/admin` console to manage site content securely.  



### Features
- Add, edit, or remove projects from a protected dashboard  
- Upload new technical documentation PDFs into `/public/docs/`  
- Modify written sections like About, Skills, or Experience  



### Security Controls
- Authentication via NextAuth (GitHub/Google OAuth)  
- Enforced `HttpOnly`, `Secure`, `SameSite=Strict` cookies  
- Role-based access — only admin can access `/admin`  
- Input sanitisation and validation for all fields  
- PDF uploads restricted by type and size  
- Cloudflare firewall rules and rate limiting on `/api/admin/*`  
- Audit logs of changes stored with timestamp and user identity  



### Storage
- Project data stored in `/data/projects.json`  
- Each edit updates this JSON file and the live site reflects changes immediately  
- PDFs stored in `/public/docs/`  

This admin console makes the portfolio dynamic while demonstrating secure coding and access control in practice.  



## Traffic Monitoring and Access Control

Traffic is monitored and filtered using **Cloudflare services**:  

- HTTPS and TLS enforced by default  
- Analytics include requests by IP, region, and path  
- Firewall rules restrict form abuse and block suspicious IP ranges  
- Rate limiting on contact form and admin routes  
- Optional logging to Supabase for further analysis .



## Stack

- **Frontend**: Next.js, React, Ant Design  
- **Styling**: Custom CSS, Autumn-themed palette  
- **Security**: CSP, HSTS, input validation, strict headers  
- **Email Alerts**: Nodemailer + Gmail  
- **Push Notifications**: LogSnag (free tier)  
- **Traffic Filtering**: Cloudflare Firewall + Region Rules  
- **Deployment**: Vercel or Netlify  
- **Docs**: PDFs hosted locally under `/public/docs/`



## Folder Structure

/my-profile-website
├── data/
│   └── projects.json 
├── public/
│ └── docs/ 
├── pages/
│ ├── admin/ 
│ │ └── index.tsx
│ ├── api/
│ │ ├── admin/ 
│ │ │ ├── addProject.ts
│ │ │ ├── editProject.ts
│ │ │ └── uploadDoc.ts
│ ├── index.tsx
│ ├── about.tsx
│ ├── skills.tsx
│ ├── projects.tsx
│ ├── experience.tsx
│ ├── education.tsx
│ ├── security.tsx
│ └── contact.tsx
├── components/
│ └── ProjectCard.tsx
├── styles/
│ ├── globals.css
│ └── theme.css
├── next.config.js
├── tsconfig.json
└── package.json



## Get Started

Install dependencies and run the dev server:

npm install
npm run dev

Build for production:

npm run build
npm start

Deployment is handled via Vercel. Cloudflare is used for DNS, TLS, analytics, and firewall rules.  



## Contact

This portfolio presents a clear record of my work. If you are seeking a professional who combines technical expertise with proven delivery in real‑world settings, please get in touch.

- Email: ateemichael@yahoo.com  
- GitHub: [github.com/michaelatee](https://github.com/michaelatee)  
- LinkedIn: [linkedin.com/in/michaelatee](https://linkedin.com/in/michaelatee)
