import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  name = 'NANDHA KUMAR R';
  title = 'UI/UX Developer';
  subtitle = 'SPA Architect | Micro Frontends & Angular Specialist';
  email = 'nandhakumaran1717@gmail.com';
  phone = '+91 9944495393';
  linkedin = 'https://www.linkedin.com/in/nandha-kumar-r-49b234325?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app';
  github = 'https://github.com/NandhaKumar1717/frontcraft';
  location = 'Bengaluru';
  
  activeModal: string | null = null;
  
  skillCategories = [
    {
      name: 'Frontend Technologies',
      skills: [
        { name: 'Angular', level: 95 },
        { name: 'TypeScript', level: 90 },
        { name: 'JavaScript', level: 88 },
        { name: 'HTML5', level: 92 },
        { name: 'CSS3/SCSS', level: 90 }
      ]
    },
    {
      name: 'Backend & Tools',
      skills: [
        { name: 'Node.js', level: 80 },
        { name: 'Git', level: 85 },
        { name: 'Docker', level: 75 },
        { name: 'AWS', level: 70 }
      ]
    },
    {
      name: 'Design & UI/UX',
      skills: [
        { name: 'Figma', level: 85 },
        { name: 'Adobe XD', level: 80 },
        { name: 'Responsive Design', level: 95 }
      ]
    }
  ];

  coreSkills = [
    { name: 'Angular (14+)', level: 95 },
    { name: 'RESTful APIs', level: 92 },
    { name: 'HTML5/CSS3/SCSS', level: 92 },
    { name: 'TypeScript/JavaScript (ES6+)', level: 90 },
    { name: 'Angular Material & PrimeNG', level: 88 },
    { name: 'RxJS & NgRx State Management', level: 85 },
    { name: 'Micro Frontend Architecture', level: 85 },
    { name: 'Node.js & Express.js', level: 80 }
  ];

  toolsSkills = [
    { name: 'Bootstrap & Responsive Design', level: 90 },
    { name: 'Module Federation & Webpack', level: 88 },
    { name: 'Git/GitHub', level: 88 },
    { name: 'Performance Optimization', level: 87 },
    { name: 'AG Grid & Chart.js', level: 85 },
    { name: 'Agile/Scrum Methodologies', level: 85 },
    { name: 'Jest/Jasmine Testing', level: 82 },
    { name: 'OAuth 2.0 & JWT Security', level: 80 },
    { name: 'PWA & Service Workers', level: 78 }
  ];

  skills = [...this.coreSkills, ...this.toolsSkills];
  
  projects = [
    {
      id: 'automotive',
      title: 'Automotive Logistics',
      subtitle: 'Enterprise Platform',
      description: 'Global logistics platform with real-time tracking',
      image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=600&fit=crop',
      technologies: ['Angular 14', 'TypeScript', 'REST APIs'],
      details: {
        overview: 'Delivered core UI modules for a global automotive logistics platform serving multiple stakeholders.',
        features: [
          'Real-time delay tracking system',
          'Port-level status monitoring',
          'Shipment visibility dashboard',
          'Role-based access control'
        ],
        impact: '40% improvement in operational efficiency',
        duration: '8 months',
        team: '6 developers'
      }
    },
    {
      id: 'microfrontend',
      title: 'Microfrontend Platform',
      subtitle: 'Scalable Architecture',
      description: 'Enterprise-grade microfrontend ecosystem',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
      technologies: ['Angular 17', 'Module Federation', 'OAuth'],
      details: {
        overview: 'Built a scalable enterprise platform using cutting-edge microfrontend architecture.',
        features: [
          'Independent deployable modules',
          'Shared authentication system',
          'Dynamic routing configuration',
          'Performance optimized loading'
        ],
        impact: '60% faster deployment cycles',
        duration: '12 months',
        team: '4 developers'
      }
    }
  ];
  
  experience = {
    company: 'INFOSYS',
    position: 'Senior Systems Engineer',
    duration: 'Apr 2022 – Present',
    location: 'Bengaluru',
    achievements: [
      'Led 3 major frontend modernization projects',
      'Mentored 5+ junior developers',
      'Reduced application load time by 45%',
      'Implemented CI/CD pipelines for 10+ projects'
    ]
  };
  
  openModal(modalId: string) {
    this.activeModal = modalId;
    document.body.style.overflow = 'hidden';
  }
  
  closeModal() {
    this.activeModal = null;
    document.body.style.overflow = 'auto';
  }

  scrollToContact() {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  }

  scrollToWork() {
    const element = document.getElementById('experience');
    if (element) {
      element.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  }

  downloadResume() {
    const link = document.createElement('a');
    link.href = 'assets/resume/Nandha_Kumar_R_Resume.pdf';
    link.download = 'Nandha_Kumar_R_Resume.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  


  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'auto' });
    window.history.pushState('', '', window.location.pathname);
    return false;
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'auto', block: 'start' });
      window.history.pushState('', '', `#${sectionId}`);
    }
  }

  activeDemo: string | null = null;

  toggleCodeDemo(projectId: string) {
    this.activeDemo = this.activeDemo === projectId ? null : projectId;
  }
}
