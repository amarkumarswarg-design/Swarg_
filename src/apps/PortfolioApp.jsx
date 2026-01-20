import React from 'react';
import { Briefcase, Code, Globe, Mail, Github, Linkedin, Award } from 'lucide-react';

const PortfolioApp = () => {
  const projects = [
    {
      id: 1,
      title: 'E-Commerce Platform',
      description: 'Full-stack e-commerce solution with real-time inventory',
      tech: ['React', 'Node.js', 'MongoDB'],
      github: 'https://github.com',
      live: 'https://demo.com',
    },
    {
      id: 2,
      title: 'Health Tracker App',
      description: 'Mobile app for health monitoring and workout tracking',
      tech: ['React Native', 'Firebase', 'Redux'],
      github: 'https://github.com',
      live: 'https://demo.com',
    },
    {
      id: 3,
      title: 'AI Content Generator',
      description: 'AI-powered content creation tool with GPT integration',
      tech: ['Next.js', 'OpenAI', 'Tailwind'],
      github: 'https://github.com',
      live: 'https://demo.com',
    },
  ];

  const skills = [
    { name: 'React/Next.js', level: 95 },
    { name: 'TypeScript', level: 90 },
    { name: 'Node.js', level: 85 },
    { name: 'UI/UX Design', level: 80 },
    { name: 'AWS/DevOps', level: 75 },
  ];

  return (
    <div className="h-full bg-gradient-to-b from-gray-900 to-black text-white overflow-y-auto">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-900/30 to-blue-900/30 p-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
            <Code size={36} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Alex Johnson</h1>
            <p className="text-blue-300">Senior Frontend Developer</p>
            <div className="flex gap-3 mt-2">
              <a href="mailto:alex@example.com" className="flex items-center gap-1 text-sm text-gray-300 hover:text-white">
                <Mail size={14} />
                Email
              </a>
              <a href="https://github.com" className="flex items-center gap-1 text-sm text-gray-300 hover:text-white">
                <Github size={14} />
                GitHub
              </a>
              <a href="https://linkedin.com" className="flex items-center gap-1 text-sm text-gray-300 hover:text-white">
                <Linkedin size={14} />
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* About */}
        <section>
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            <Briefcase size={20} />
            About Me
          </h2>
          <p className="text-gray-300 leading-relaxed">
            Passionate frontend developer with 5+ years of experience building 
            scalable web applications. Specialized in React ecosystem and modern 
            UI frameworks. Love creating seamless user experiences with clean code.
          </p>
        </section>

        {/* Skills */}
        <section>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Award size={20} />
            Skills & Expertise
          </h2>
          <div className="space-y-4">
            {skills.map((skill, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span>{skill.name}</span>
                  <span className="text-blue-300">{skill.level}%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Globe size={20} />
            Featured Projects
          </h2>
          <div className="space-y-4">
            {projects.map((project) => (
              <div 
                key={project.id}
                className="bg-gray-800/50 rounded-xl p-4 hover:bg-gray-800/70 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{project.title}</h3>
                  <div className="flex gap-2">
                    <a 
                      href={project.github}
                      className="p-1 hover:bg-gray-700 rounded"
                      title="GitHub"
                    >
                      <Github size={16} />
                    </a>
                    <a 
                      href={project.live}
                      className="p-1 hover:bg-gray-700 rounded"
                      title="Live Demo"
                    >
                      <Globe size={16} />
                    </a>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mb-3">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech, i) => (
                    <span 
                      key={i}
                      className="px-3 py-1 bg-blue-900/30 text-blue-300 rounded-full text-xs"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-3">Get In Touch</h2>
          <p className="text-gray-300 mb-4">
            Interested in working together? Let's build something amazing!
          </p>
          <div className="flex flex-wrap gap-3">
            <a 
              href="mailto:hello@example.com"
              className="flex-1 min-w-[140px] bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg text-center hover:opacity-90 transition-opacity"
            >
              Send Email
            </a>
            <a 
              href="https://linkedin.com"
              className="flex-1 min-w-[140px] bg-gray-800 text-white py-3 px-4 rounded-lg text-center hover:bg-gray-700 transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PortfolioApp;
