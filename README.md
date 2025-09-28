# Michael Atee — Cybersecurity | Cloud | Frontend 

This is the source code for my professional web profile.

It showcases who I am, what I have built, and how I approach technology with a focus on security, performance, and long-term maintainability.

The site is styled with my personal colour palette, rooted in autumn tones, and structured to reflect how I work: **clean, deliberate, and detail-driven**.


## Why This Exists

I hAve worked across multiple industries, consulting, automotive, retail, and tech, and transitioned into cloud and cybersecurity through both real-world experience and formal training. This portfolio is built to:

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

These are projects I’ve built independently or led end-to-end. In previous roles like Loystar (React + Ant Design), I’ve also contributed to frontend development, but those aren’t the focus of this portfolio.


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


## Contact Submission Alerts & Logging

All contact form submissions are handled by a server-side API route built in Next.js. Messages are validated and sanitised before being processed.

Alerts are pushed in real time using [LogSnag](https://logsnag.com/) (free tier) and emails are sent using **Nodemailer** + **Gmail App Passwords**.

Each submission can optionally be logged to Supabase or written to secure audit logs (not stored in production by default).


## Traffic Monitoring and IP Filtering

- **Cloudflare** provides DNS, TLS, basic analytics, and region-based IP controls  
- Firewall rules block suspicious traffic and limit form access from specific countries or IPs  
- All paths like `/api/contact` are monitored and rate-limited using Cloudflare Rules  
- Optional IP-based access logs can be piped into Supabase or `.log` files for later review

These tools help enforce visibility and resilience without introducing heavy tracking or third-party analytics.


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
├── public/
│ ├── docs/
│ │ ├── scanzo-tech-doc.pdf
│ │ ├── fixedbymyc-doc.pdf
│ │ └── iot-ids-doc.pdf
│ └── images/
├── pages/
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


## Contact

This portfolio presents a clear record of my work. If you are seeking a professional who combines technical expertise with proven delivery in real‑world settings, please get in touch.

- Email: ateemichael@yahoo.com  
- GitHub: [github.com/michaelatee](https://github.com/michaelatee)  
- LinkedIn: [linkedin.com/in/michaelatee](https://linkedin.com/in/michaelatee)
