import React from 'react';
import { Briefcase, Code, Mail, Github } from 'lucide-react';

const PortfolioApp = () => {
  const projects = [
    {
      id: 1,
      title: 'iOS Web Simulator',
      description: 'Virtual iOS operating system in browser',
      tech: ['React', 'Tailwind', 'Framer Motion'],
    },
    {
      id: 2,
      title: 'E-Commerce Platform',
      description: 'Full-stack shopping solution',
      tech: ['Next.js', 'Node.js', 'MongoDB'],
    },
  ];

  return (
    <div className="h-full bg-gradient-to-b from-gray-900 to-black text-white overflow-y-auto">
      <div className="relative bg-gradient-to-r from-purple-900/30 to-blue-900/30 p-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
            <Code size={36} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Developer</h1>
            <p className="text-blue-300">Frontend Developer</p>
            <div className="flex gap-3 mt-2">
              <a href="#" className="flex items-center gap-1 text-sm text-gray-300 hover:text-white">
                <Mail size={14} />
                Email
              </a>
              <a href="#" className="flex items-center gap-1 text-sm text-gray-300 hover:text-white">
                <Github size={14} />
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        <section>
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            <Briefcase size={20} />
            About Me
          </h2>
          <p className="text-gray-300 leading-relaxed">
            Passionate frontend developer specializing in React and modern UI frameworks.
            Love creating seamless user experiences with clean code.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">Projects</h2>
          <div className="space-y-4">
            {projects.map((project) => (
              <div 
                key={project.id}
                className="bg-gray-800/50 rounded-xl p-4 hover:bg-gray-800/70 transition-colors"
              >
                <h3 className="font-semibold text-lg">{project.title}</h3>
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
      </div>
    </div>
  );
};

export default PortfolioApp;
