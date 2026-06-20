import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Job } from '../models/Job.js';
import { Application } from '../models/Application.js';

export const seedDatabase = async () => {
  try {
    // Check if users already exist
    const usersCount = await User.find({});
    if (usersCount.length > 0) {
      console.log('Database already has data. Skipping seeding.');
      return;
    }

    console.log('Seeding database with default accounts and jobs...');

    // Hash password for default accounts
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // Create default Seeker
    const seeker = await User.create({
      name: 'Jane Doe',
      email: 'seeker@nexthire.com',
      password: hashedPassword,
      role: 'seeker',
      profile: {
        skills: ['React', 'JavaScript', 'CSS Grid', 'Node.js', 'Express'],
        resumeName: 'Jane_Doe_Resume.pdf',
        resumeUrl: 'https://nexthire.com/resumes/jane_doe_resume.pdf',
        bio: 'Passionate Frontend Developer with 3+ years of experience building responsive and interactive web applications.',
        experience: 'Frontend Developer at WebSolutions (2 years)\nJunior Dev at StartupCo (1 year)',
        education: 'B.S. in Computer Science - University of State (2022)',
        companyName: ''
      }
    });

    // Create default Recruiter
    const recruiter = await User.create({
      name: 'John Recruiter',
      email: 'recruiter@nexthire.com',
      password: hashedPassword,
      role: 'recruiter',
      profile: {
        skills: [],
        resumeName: '',
        resumeUrl: '',
        bio: 'Talent Acquisition Manager hiring top tech talents globally.',
        experience: '',
        education: '',
        companyName: 'NextHire Tech'
      }
    });

    const recruiterId = recruiter._id.toString ? recruiter._id.toString() : recruiter._id;

    // Create default Job Listings
    const jobs = [
      {
        title: 'Senior React Developer',
        company: 'Vercel',
        description: 'We are looking for a Senior React Developer to join our core framework team. You will work on Next.js optimization, layout rendering engines, and building world-class developer experiences. Ideal candidates have deep expertise in React concurrent features, React Server Components (RSC), and edge computing paradigms.',
        requirements: [
          '5+ years of software engineering experience',
          'Deep knowledge of React, Next.js, and TypeScript',
          'Experience building developer tools or open-source libraries',
          'Familiarity with Webpack, Turbopack, or modern bundlers',
          'Excellent written and verbal communication skills'
        ],
        location: 'Remote (US/Europe)',
        salaryRange: '$130,000 - $160,000',
        jobType: 'Full-time',
        recruiterId: recruiterId
      },
      {
        title: 'Full Stack Engineer',
        company: 'Stripe',
        description: 'Stripe is looking for a Full Stack Engineer to join our billing platforms. You will design, build, and maintain APIs, merchant dashboards, and reliable payment processing pipelines. You will collaborate closely with product managers and designer leads to deliver exceptional checkout integrations.',
        requirements: [
          '3+ years of experience in product engineering',
          'Proficiency with Ruby, Python, Go, or Node.js backend environments',
          'Solid understanding of databases (Postgres, MongoDB) and API design',
          'Comfortable writing React and CSS layouts for merchant dashboards',
          'Strong security mind-set and attention to edge cases'
        ],
        location: 'San Francisco, CA (Hybrid)',
        salaryRange: '$145,000 - $185,000',
        jobType: 'Full-time',
        recruiterId: recruiterId
      },
      {
        title: 'UI/UX Product Designer',
        company: 'Airbnb',
        description: 'Design the future of travel. Airbnb is seeking a talented Product Designer to redefine our hosting tools. You will create high-fidelity prototypes, conduct user research, and build beautiful component libraries. You should be passionate about detail, glassmorphism aesthetics, accessibility, and micro-interactions.',
        requirements: [
          '4+ years designing consumer-facing mobile/web apps',
          'Stunning portfolio demonstrating interaction design and visual craftsmanship',
          'Expertise in Figma, Framer, and design system creation',
          'Basic understanding of HTML/CSS is highly appreciated',
          'Ability to collaborate across product development lifecycles'
        ],
        location: 'New York, NY',
        salaryRange: '$110,000 - $140,000',
        jobType: 'Contract',
        recruiterId: recruiterId
      },
      {
        title: 'Junior Developer (Node.js)',
        company: 'Supabase',
        description: 'Join Supabase as a Junior Node.js Developer. You will assist in writing serverless edge functions, improving CLI capabilities, and creating user-friendly guides. This is a junior role with immense mentorship and learning opportunities in postgres, database design, and real-time sockets.',
        requirements: [
          '1+ years of coding experience or boot camp graduate',
          'Familiarity with Javascript/Node.js and Express',
          'Understanding of REST APIs and relational databases',
          'Hungry to learn, ask questions, and contribute to open-source',
          'Basic git knowledge (pull requests, branching)'
        ],
        location: 'Remote (Global)',
        salaryRange: '$60,000 - $80,000',
        jobType: 'Full-time',
        recruiterId: recruiterId
      }
    ];

    for (const job of jobs) {
      await Job.create(job);
    }

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};
