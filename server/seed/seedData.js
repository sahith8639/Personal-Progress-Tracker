const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');
const Profile = require('../models/Profile');
const Education = require('../models/Education');
const Skill = require('../models/Skill');
const Course = require('../models/Course');
const GradeSetting = require('../models/GradeSetting');
const Resource = require('../models/Resource');
const Certificate = require('../models/Certificate');
const Project = require('../models/Project');
const LearningItem = require('../models/LearningItem');
const StudyLog = require('../models/StudyLog');
const Interest = require('../models/Interest');
const ActivityLog = require('../models/ActivityLog');

const seedDatabase = async () => {
  try {
    const connUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/PersonalPortfolioDB';
    await mongoose.connect(connUri);
    console.log('[Seed] Connected to MongoDB for seeding...');

    // Clear existing collections
    await Promise.all([
      User.deleteMany({}),
      Profile.deleteMany({}),
      Education.deleteMany({}),
      Skill.deleteMany({}),
      Course.deleteMany({}),
      GradeSetting.deleteMany({}),
      Resource.deleteMany({}),
      Certificate.deleteMany({}),
      Project.deleteMany({}),
      LearningItem.deleteMany({}),
      StudyLog.deleteMany({}),
      Interest.deleteMany({}),
      ActivityLog.deleteMany({}),
    ]);

    console.log('[Seed] Cleared existing data.');

    // 1. Create Admin User
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@portfolio.local';
    const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPassword@123';
    const adminUser = await User.create({
      name: 'Sahithsai Pasupula (Admin)',
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
    });
    console.log(`[Seed] Created admin account: ${adminEmail}`);

    // 2. Create Grade Settings
    const gradeMappings = [
      { grade: 'S', point: 10, description: 'Outstanding / Exceptional (10.0)' },
      { grade: 'A', point: 9, description: 'Excellent (9.0)' },
      { grade: 'B', point: 8, description: 'Very Good (8.0)' },
      { grade: 'C', point: 7, description: 'Good (7.0)' },
      { grade: 'D', point: 6, description: 'Average (6.0)' },
      { grade: 'E', point: 5, description: 'Satisfactory / Pass (5.0)' },
      { grade: 'F', point: 0, description: 'Fail (0.0)' },
    ];
    await GradeSetting.insertMany(gradeMappings);

    // 3. Create Profile
    await Profile.create({
      fullName: 'Sahithsai Pasupula',
      title: 'Artificial Intelligence & Machine Learning Student',
      subTitle: 'Aspiring AI/ML Engineer | Software Developer | Problem Solver',
      bio: 'Undergraduate student passionate about Artificial Intelligence, Machine Learning, Deep Learning, and Full-Stack Engineering. Dedicated to designing robust machine learning systems and building high-performance modern web platforms.',
      careerObjective: 'To solve challenging computational and real-world problems using cutting-edge deep learning, computer vision, and distributed software systems while maintaining a strong academic foundation.',
      dateOfBirth: '2005-08-15',
      location: 'Hyderabad, India',
      email: 'sahithsai.aiml@gmail.com',
      phone: '+91 98765 43210',
      github: 'https://github.com/sahithsai',
      linkedin: 'https://linkedin.com/in/sahithsai',
      twitter: 'https://twitter.com/sahithsai',
      leetcode: 'https://leetcode.com/sahithsai',
      portfolioUrl: 'https://sahithsai.dev',
      resumeUrl: '',
      avatarUrl: '',
      isEmailPublic: true,
      isPhonePublic: false,
      isDobPublic: false,
    });

    // 4. Create Education
    await Education.create([
      {
        degree: 'B.Tech in Artificial Intelligence & Machine Learning',
        institution: 'Institute of Aeronautical Engineering',
        university: 'Jawaharlal Nehru Technological University',
        department: 'Department of Computer Science & AIML',
        startDate: '2024',
        endDate: '2028 (Expected)',
        cgpa: 8.7,
        percentage: 87.0,
        location: 'Hyderabad, India',
        description: 'Undergraduate coursework covering algorithms, linear algebra, probability, data structures, machine learning architectures, and software engineering principles.',
        achievements: [
          'Ranked in top 5% of department cohort',
          'Academic Merit Scholarship Recipient',
          'Lead Student Coordinator, AI & Robotics Club',
        ],
        relevantCoursework: [
          'Design & Analysis of Algorithms',
          'Machine Learning Fundamentals',
          'Data Structures in C++/Java',
          'Probability & Mathematical Statistics',
          'Database Management Systems',
          'Operating Systems',
        ],
        isPublic: true,
        order: 1,
      },
      {
        degree: 'Senior Secondary (12th Standard) — MPC',
        institution: 'Narayana Junior College',
        university: 'State Board of Intermediate Education',
        department: 'Mathematics, Physics, Chemistry',
        startDate: '2022',
        endDate: '2024',
        cgpa: 9.6,
        percentage: 96.5,
        location: 'Hyderabad, India',
        description: 'Intensive focus on Advanced Mathematics, Mechanics, Electromagnetism, and Physical Chemistry.',
        achievements: [
          'Scored 98% in Mathematics',
          'Qualified in State Competitive Engineering Examination',
        ],
        relevantCoursework: ['Calculus', 'Linear Algebra', 'Physics', 'Coordinate Geometry'],
        isPublic: true,
        order: 2,
      },
    ]);

    // 5. Create Skills
    await Skill.create([
      // Programming Languages
      { name: 'Python', category: 'Programming Languages', proficiency: 92, experience: '3 years', status: 'Expert', technologies: ['NumPy', 'Pandas', 'OOP', 'FastAPI'], order: 1 },
      { name: 'Java', category: 'Programming Languages', proficiency: 80, experience: '2 years', status: 'Intermediate', technologies: ['Collections', 'OOP', 'Multithreading'], order: 2 },
      { name: 'C++', category: 'Programming Languages', proficiency: 85, experience: '2 years', status: 'Advanced', technologies: ['STL', 'Algorithms', 'Memory Management'], order: 3 },
      { name: 'JavaScript', category: 'Programming Languages', proficiency: 86, experience: '2 years', status: 'Advanced', technologies: ['ES6+', 'Async/Await', 'DOM APIs'], order: 4 },
      { name: 'SQL', category: 'Programming Languages', proficiency: 88, experience: '2 years', status: 'Advanced', technologies: ['Joins', 'Indexing', 'Aggregations'], order: 5 },

      // AI/ML
      { name: 'Machine Learning', category: 'AI/ML', proficiency: 90, experience: '2 years', status: 'Advanced', technologies: ['Scikit-learn', 'Linear Models', 'Ensemble Trees', 'XGBoost'], order: 1 },
      { name: 'PyTorch', category: 'AI/ML', proficiency: 82, experience: '1.5 years', status: 'Advanced', technologies: ['Tensors', 'Autograd', 'nn.Module', 'Torchvision'], order: 2 },
      { name: 'Deep Learning', category: 'AI/ML', proficiency: 80, experience: '1.5 years', status: 'Intermediate', technologies: ['CNNs', 'RNNs', 'Transformers', 'Backpropagation'], order: 3 },
      { name: 'Computer Vision', category: 'AI/ML', proficiency: 76, experience: '1 year', status: 'Intermediate', technologies: ['OpenCV', 'YOLOv8', 'Object Detection'], order: 4 },
      { name: 'Natural Language Processing', category: 'AI/ML', proficiency: 78, experience: '1 year', status: 'Intermediate', technologies: ['HuggingFace', 'NLTK', 'Word Embeddings'], order: 5 },

      // Data Science
      { name: 'Data Analysis & Manipulation', category: 'Data Science', proficiency: 92, experience: '2 years', status: 'Expert', technologies: ['Pandas', 'NumPy', 'EDA'], order: 1 },
      { name: 'Data Visualization', category: 'Data Science', proficiency: 88, experience: '2 years', status: 'Advanced', technologies: ['Matplotlib', 'Seaborn', 'Plotly'], order: 2 },

      // Web Development
      { name: 'React.js', category: 'Web Development', proficiency: 85, experience: '2 years', status: 'Advanced', technologies: ['Hooks', 'Context API', 'Vite', 'React Router'], order: 1 },
      { name: 'Node.js & Express', category: 'Web Development', proficiency: 82, experience: '2 years', status: 'Advanced', technologies: ['REST APIs', 'JWT Auth', 'Middleware'], order: 2 },
      { name: 'HTML5 & Modern CSS', category: 'Web Development', proficiency: 90, experience: '3 years', status: 'Expert', technologies: ['Grid', 'Flexbox', 'Responsive UI', 'Animations'], order: 3 },

      // Databases
      { name: 'MongoDB', category: 'Databases', proficiency: 88, experience: '2 years', status: 'Advanced', technologies: ['Mongoose', 'Aggregation Pipeline', 'Indexing'], order: 1 },
      { name: 'PostgreSQL', category: 'Databases', proficiency: 80, experience: '1.5 years', status: 'Intermediate', technologies: ['Relational Schema', 'ACID', 'pgAdmin'], order: 2 },

      // Tools & Cloud
      { name: 'Git & GitHub', category: 'Version Control', proficiency: 90, experience: '3 years', status: 'Expert', technologies: ['Branching', 'Merge Conflict Resolution', 'PRs'], order: 1 },
      { name: 'Linux & Bash', category: 'Tools', proficiency: 82, experience: '2 years', status: 'Intermediate', technologies: ['Shell Scripting', 'CLI', 'Process Management'], order: 2 },
      { name: 'Docker', category: 'Tools', proficiency: 75, experience: '1 year', status: 'Intermediate', technologies: ['Dockerfiles', 'Compose', 'Containerization'], order: 3 },
    ]);

    // 6. Create Courses
    const mlCourse = await Course.create({
      name: 'Machine Learning',
      code: 'CS501',
      semester: 'Semester 4',
      academicYear: '2024 - 2025',
      category: 'AI/ML Specialization',
      credits: 4,
      grade: 'S',
      gradePoint: 10,
      status: 'Completed',
      instructor: 'Dr. K. Ramanathan',
      institution: 'Institute of Aeronautical Engineering',
      startDate: 'Dec 2024',
      completionDate: 'Apr 2025',
      description: 'Comprehensive study of supervised and unsupervised learning algorithms, cost functions, gradient descent optimization, regularization techniques, and statistical evaluation metrics.',
      topics: [
        { title: 'Linear Regression & Cost Functions', completed: true },
        { title: 'Logistic Regression & Classification Metrics', completed: true },
        { title: 'Decision Trees & Random Forests', completed: true },
        { title: 'Support Vector Machines & Kernel Tricks', completed: true },
        { title: 'Neural Networks & Backpropagation', completed: true },
        { title: 'Clustering: K-Means & Hierarchical', completed: true },
        { title: 'Dimensionality Reduction (PCA & t-SNE)', completed: true },
      ],
      isPublic: true,
      order: 1,
    });

    const dsaCourse = await Course.create({
      name: 'Data Structures and Algorithms',
      code: 'CS302',
      semester: 'Semester 3',
      academicYear: '2024 - 2025',
      category: 'Core Computer Science',
      credits: 4,
      grade: 'S',
      gradePoint: 10,
      status: 'Completed',
      instructor: 'Prof. S. Venkatesh',
      institution: 'Institute of Aeronautical Engineering',
      startDate: 'Aug 2024',
      completionDate: 'Nov 2024',
      description: 'Rigorous analysis of asymptotic complexity, linear data structures, binary trees, heaps, balanced BSTs, graphs, greedy algorithms, and dynamic programming.',
      topics: [
        { title: 'Asymptotic Analysis & Big O Notation', completed: true },
        { title: 'Stacks, Queues & Linked Lists', completed: true },
        { title: 'Binary Search Trees & AVL Trees', completed: true },
        { title: 'Priority Queues & Heaps', completed: true },
        { title: 'Graph Traversal (BFS & DFS)', completed: true },
        { title: 'Shortest Path Algorithms (Dijkstra, Bellman-Ford)', completed: true },
        { title: 'Dynamic Programming Paradigms', completed: true },
      ],
      isPublic: true,
      order: 2,
    });

    const dbmsCourse = await Course.create({
      name: 'Database Management Systems',
      code: 'CS403',
      semester: 'Semester 3',
      academicYear: '2024 - 2025',
      category: 'Core Computer Science',
      credits: 3,
      grade: 'A',
      gradePoint: 9,
      status: 'Completed',
      instructor: 'Dr. M. Lakshmi',
      institution: 'Institute of Aeronautical Engineering',
      startDate: 'Aug 2024',
      completionDate: 'Nov 2024',
      description: 'Relational database model, relational algebra, SQL optimization, normalization (1NF through BCNF), concurrency control, transaction isolation levels, and indexing.',
      topics: [
        { title: 'Entity-Relationship Modeling', completed: true },
        { title: 'Relational Algebra & SQL Queries', completed: true },
        { title: 'Normalization (1NF, 2NF, 3NF, BCNF)', completed: true },
        { title: 'Transaction Processing & ACID Properties', completed: true },
        { title: 'Indexing Techniques (B-Trees, B+ Trees, Hashing)', completed: true },
      ],
      isPublic: true,
      order: 3,
    });

    const osCourse = await Course.create({
      name: 'Operating Systems',
      code: 'CS404',
      semester: 'Semester 4',
      academicYear: '2024 - 2025',
      category: 'Core Computer Science',
      credits: 4,
      grade: 'B',
      gradePoint: 8,
      status: 'Completed',
      instructor: 'Prof. R. Naidu',
      institution: 'Institute of Aeronautical Engineering',
      startDate: 'Dec 2024',
      completionDate: 'Apr 2025',
      description: 'Processes, CPU scheduling algorithms, inter-process communication, synchronization primitives, deadlocks, virtual memory management, and file systems.',
      topics: [
        { title: 'Process Scheduling Algorithms', completed: true },
        { title: 'Semaphores, Mutexes & Classical Synchronization', completed: true },
        { title: 'Deadlock Detection & Banker Algorithm', completed: true },
        { title: 'Paging, Segmentation & Virtual Memory', completed: true },
      ],
      isPublic: true,
      order: 4,
    });

    const dlCourse = await Course.create({
      name: 'Deep Learning & Neural Networks',
      code: 'CS502',
      semester: 'Semester 5',
      academicYear: '2025 - 2026',
      category: 'AI/ML Specialization',
      credits: 4,
      grade: '',
      gradePoint: null,
      status: 'Currently Learning',
      instructor: 'Dr. K. Ramanathan',
      institution: 'Institute of Aeronautical Engineering',
      startDate: 'Aug 2025',
      completionDate: 'Dec 2025',
      description: 'Architectures for deep neural networks, convolution arithmetic, sequence modeling, attention mechanisms, transformers, and optimization dynamics.',
      topics: [
        { title: 'Multilayer Perceptrons & Vanishing Gradients', completed: true },
        { title: 'Convolutional Neural Networks (ResNet, EfficientNet)', completed: true },
        { title: 'Recurrent Architectures (LSTM, GRU)', completed: false },
        { title: 'Self-Attention & Transformer Encoders', completed: false },
        { title: 'Generative Adversarial Networks (GANs)', completed: false },
      ],
      isPublic: true,
      order: 5,
    });

    await Course.create({
      name: 'Distributed Systems & Cloud Computing',
      code: 'CS601',
      semester: 'Semester 6',
      academicYear: '2025 - 2026',
      category: 'Elective',
      credits: 3,
      grade: '',
      gradePoint: null,
      status: 'Planned',
      instructor: 'TBD',
      institution: 'Institute of Aeronautical Engineering',
      startDate: 'Jan 2026',
      completionDate: 'May 2026',
      description: 'Distributed consensus algorithms (Raft, Paxos), CAP theorem, microservices architecture, and cloud deployment pipelines.',
      topics: [
        { title: 'RPC & Inter-Process Communication', completed: false },
        { title: 'Consensus Protocols (Raft)', completed: false },
        { title: 'Distributed Key-Value Stores', completed: false },
      ],
      isPublic: true,
      order: 6,
    });

    // 7. Create Course Resources
    await Resource.create([
      {
        title: 'Machine Learning Lecture Notes — Unit 1: Regression & Optimization',
        courseId: mlCourse._id,
        subject: 'Machine Learning',
        type: 'Notes',
        semester: 'Semester 4',
        topic: 'Linear Regression & Gradient Descent',
        externalUrl: 'https://github.com/sahithsai/ml-notes/blob/main/unit1_regression.md',
        fileUrl: '',
        fileSize: 45000,
        mimeType: 'text/markdown',
        description: 'Comprehensive derivation of normal equations, batch gradient descent vs stochastic gradient descent, and learning rate scheduling.',
        isPublic: true,
      },
      {
        title: 'Decision Trees & Ensembles Cheat Sheet (PDF)',
        courseId: mlCourse._id,
        subject: 'Machine Learning',
        type: 'PDF',
        semester: 'Semester 4',
        topic: 'Ensemble Learning',
        externalUrl: 'https://scikit-learn.org/stable/modules/ensemble.html',
        fileUrl: '',
        fileSize: 1250000,
        mimeType: 'application/pdf',
        description: 'Detailed comparison of Bagging, Random Forests, AdaBoost, and Gradient Boosted Trees with hyperparameter tuning guides.',
        isPublic: true,
      },
      {
        title: 'Database Normalization Step-by-Step Guide',
        courseId: dbmsCourse._id,
        subject: 'Database Management Systems',
        type: 'Document',
        semester: 'Semester 3',
        topic: 'Normalization',
        externalUrl: 'https://en.wikipedia.org/wiki/Database_normalization',
        fileUrl: '',
        fileSize: 850000,
        mimeType: 'application/pdf',
        description: 'Illustrated guide covering functional dependencies, candidate keys, 1NF, 2NF, 3NF, and BCNF decomposition examples.',
        isPublic: true,
      },
      {
        title: 'PyTorch Deep Learning Repository & Lab Code',
        courseId: dlCourse._id,
        subject: 'Deep Learning',
        type: 'GitHub Repository',
        semester: 'Semester 5',
        topic: 'CNN & PyTorch Implementation',
        externalUrl: 'https://github.com/pytorch/examples',
        fileUrl: '',
        fileSize: 0,
        mimeType: 'text/html',
        description: 'Lab implementations for training ResNet classifiers and custom PyTorch data loaders with augmentation.',
        isPublic: true,
      },
    ]);

    // 8. Create Certificates
    await Certificate.create([
      {
        name: 'Python for Data Science',
        issuingOrganization: 'IBM',
        issueDate: '2024',
        credentialId: 'IBM-PY-89421',
        credentialUrl: 'https://www.coursera.org/account/accomplishments/verify/IBM-PY-89421',
        category: 'Data Science',
        description: 'Mastered Python fundamentals, data structures, working with data using Pandas & NumPy, and REST APIs.',
        skills: ['Python', 'Data Science', 'Pandas', 'NumPy'],
        courseId: mlCourse._id,
        isPublic: true,
        order: 1,
      },
      {
        name: 'Machine Learning Specialization',
        issuingOrganization: 'DeepLearning.AI & Stanford University',
        issueDate: '2025',
        credentialId: 'DLAI-ML-44028',
        credentialUrl: 'https://www.coursera.org/account/accomplishments/specialization/DLAI-ML-44028',
        category: 'AI & Data Science',
        description: 'Three-course specialization taught by Andrew Ng covering Supervised ML, Advanced Learning Algorithms, and Unsupervised Learning & Recommenders.',
        skills: ['Machine Learning', 'Scikit-learn', 'Neural Networks', 'Decision Trees', 'PCA'],
        courseId: mlCourse._id,
        isPublic: true,
        order: 2,
      },
      {
        name: 'Meta Front-End Developer Professional Certificate',
        issuingOrganization: 'Meta',
        issueDate: '2024',
        credentialId: 'META-FE-12903',
        credentialUrl: 'https://www.coursera.org/account/accomplishments/specialization/META-FE-12903',
        category: 'Web Development',
        description: 'In-depth program covering HTML5, CSS3, JavaScript ES6+, React architecture, UI/UX design, and version control with Git.',
        skills: ['React', 'JavaScript', 'CSS', 'Git', 'UI/UX'],
        courseId: null,
        isPublic: true,
        order: 3,
      },
    ]);

    // 9. Create Projects
    await Project.create([
      {
        name: 'Autonomous Multimodal AI Research Assistant',
        shortDescription: 'Full-stack AI assistant with retrieval-augmented generation (RAG) and document analysis capabilities.',
        detailedDescription: 'Developed an end-to-end multimodal agent capable of indexing academic research papers, performing semantic vector search with ChromaDB, and producing synthesized literature reviews with citations.',
        technologies: ['Python', 'PyTorch', 'LangChain', 'FastAPI', 'React', 'ChromaDB'],
        category: 'Machine Learning & AI',
        githubUrl: 'https://github.com/sahithsai/multimodal-ai-assistant',
        liveDemoUrl: 'https://ai-assistant-demo.web.app',
        startDate: 'Jan 2025',
        endDate: 'Mar 2025',
        status: 'Completed',
        imageUrl: '',
        docUrl: '',
        isPublic: true,
        order: 1,
      },
      {
        name: 'Personal Academic & Learning Management System',
        shortDescription: 'Comprehensive full-stack dashboard for tracking academic coursework, GPA, learning progress, certificates, and projects.',
        detailedDescription: 'Built with React, Express, and MongoDB. Features automatic GPA/CGPA computation, hierarchical course topics and resource attachment, study streak logging, and CSV exports.',
        technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'CSS3', 'JWT'],
        category: 'Full-Stack Development',
        githubUrl: 'https://github.com/sahithsai/personal-academic-management',
        liveDemoUrl: 'https://my-academic-system.dev',
        startDate: 'Aug 2025',
        endDate: 'Present',
        status: 'In Progress',
        imageUrl: '',
        docUrl: '',
        isPublic: true,
        order: 2,
      },
      {
        name: 'Real-Time Edge Computer Vision & Object Tracking',
        shortDescription: 'Edge computing pipeline using YOLOv8 for multi-object detection and Kalman filter tracking.',
        detailedDescription: 'Implemented real-time visual tracking on streaming video feeds. Benchmarked frame rates and latency trade-offs between TensorRT optimizations and vanilla PyTorch models.',
        technologies: ['Python', 'OpenCV', 'PyTorch', 'YOLOv8', 'NumPy'],
        category: 'Computer Vision',
        githubUrl: 'https://github.com/sahithsai/edge-object-tracker',
        liveDemoUrl: '',
        startDate: 'May 2025',
        endDate: 'Jul 2025',
        status: 'Completed',
        imageUrl: '',
        docUrl: '',
        isPublic: true,
        order: 3,
      },
    ]);

    // 10. Create Learning Items & Roadmaps
    const javaItem = await LearningItem.create({
      title: 'Java Programming & Advanced DSA',
      category: 'Software Engineering',
      description: 'Mastering Java core principles, object-oriented design patterns, collections framework internals, and advanced competitive programming data structures.',
      startDate: 'Jan 2025',
      targetDate: 'May 2025',
      currentProgress: 65,
      status: 'Learning',
      priority: 'High',
      hoursCompleted: 72,
      totalEstimatedHours: 100,
      currentLevel: 'Intermediate',
      targetLevel: 'Advanced',
      notes: 'Currently focusing on tree traversal algorithms and graph dynamic programming.',
      roadmap: [
        { topic: 'Java Syntax & Basics', status: 'Completed', progress: 100, targetDate: 'Jan 2025', notes: 'Variables, loops, operators' },
        { topic: 'Object-Oriented Programming (OOP)', status: 'Completed', progress: 100, targetDate: 'Feb 2025', notes: 'Inheritance, Polymorphism, Abstraction' },
        { topic: 'Java Collections Framework', status: 'Completed', progress: 100, targetDate: 'Mar 2025', notes: 'HashMap, TreeMap, PriorityQueue' },
        { topic: 'Exception Handling & Multithreading', status: 'Completed', progress: 100, targetDate: 'Mar 2025', notes: 'Thread lifecycle, synchronized blocks' },
        { topic: 'Data Structures & Algorithms', status: 'In Progress', progress: 65, targetDate: 'Apr 2025', notes: 'Trees, Graphs, Disjoint Set Union' },
        { topic: 'Advanced DSA & Dynamic Programming', status: 'Not Started', progress: 0, targetDate: 'May 2025', notes: 'Hard DP on Trees, Segment Trees' },
      ],
      isPublic: true,
      order: 1,
    });

    const mlRoadmapItem = await LearningItem.create({
      title: 'Machine Learning to Deep Learning Transition',
      category: 'AI & Data Science',
      description: 'Progressing from classical machine learning algorithms to deep learning transformer architectures and vision transformers.',
      startDate: 'Feb 2025',
      targetDate: 'Jun 2025',
      currentProgress: 55,
      status: 'Learning',
      priority: 'High',
      hoursCompleted: 58,
      totalEstimatedHours: 90,
      currentLevel: 'Intermediate',
      targetLevel: 'Advanced',
      notes: 'Completing CNN layer visualization assignments.',
      roadmap: [
        { topic: 'Python Scientific Stack (NumPy & Pandas)', status: 'Completed', progress: 100, targetDate: 'Feb 2025', notes: 'Vectorized computing' },
        { topic: 'Mathematical Statistics & Probability', status: 'Completed', progress: 100, targetDate: 'Feb 2025', notes: 'Bayes rule, normal distribution' },
        { topic: 'Classical ML Algorithms (Regression & Trees)', status: 'Completed', progress: 100, targetDate: 'Mar 2025', notes: 'Scikit-learn workflows' },
        { topic: 'Deep Learning & PyTorch Basics', status: 'In Progress', progress: 60, targetDate: 'Apr 2025', notes: 'Tensors, optimizers, autograd' },
        { topic: 'Convolutional Neural Networks (CNNs)', status: 'In Progress', progress: 50, targetDate: 'May 2025', notes: 'Image classification, feature maps' },
        { topic: 'Self-Attention & Transformers', status: 'Not Started', progress: 0, targetDate: 'Jun 2025', notes: 'BERT and GPT foundations' },
      ],
      isPublic: true,
      order: 2,
    });

    await LearningItem.create({
      title: 'Distributed Systems & Microservices',
      category: 'Systems Architecture',
      description: 'Understanding consensus algorithms, database partitioning, caching layers, and high-availability patterns.',
      startDate: 'Apr 2025',
      targetDate: 'Jul 2025',
      currentProgress: 25,
      status: 'Learning',
      priority: 'Medium',
      hoursCompleted: 15,
      totalEstimatedHours: 60,
      currentLevel: 'Beginner',
      targetLevel: 'Intermediate',
      notes: 'Reading Designing Data-Intensive Applications (DDIA).',
      roadmap: [
        { topic: 'Client-Server & RPC Models', status: 'Completed', progress: 100, targetDate: 'Apr 2025', notes: 'gRPC fundamentals' },
        { topic: 'Data Replication & Partitioning', status: 'In Progress', progress: 40, targetDate: 'May 2025', notes: 'Leader-follower, multi-leader' },
        { topic: 'Distributed Consensus (Raft)', status: 'Not Started', progress: 0, targetDate: 'Jun 2025', notes: 'Election timeouts and log replication' },
      ],
      isPublic: true,
      order: 3,
    });

    // 11. Create Study Logs
    const now = new Date();
    const d1 = new Date(now);
    d1.setDate(d1.getDate() - 0); // Today
    const d2 = new Date(now);
    d2.setDate(d2.getDate() - 1); // Yesterday
    const d3 = new Date(now);
    d3.setDate(d3.getDate() - 2);
    const d4 = new Date(now);
    d4.setDate(d4.getDate() - 3);
    const d5 = new Date(now);
    d5.setDate(d5.getDate() - 4);
    const d6 = new Date(now);
    d6.setDate(d6.getDate() - 5);
    const d7 = new Date(now);
    d7.setDate(d7.getDate() - 6);

    await StudyLog.create([
      {
        date: d1,
        subjectOrTopic: 'Java Multithreading & Synchronization Primitives',
        hoursStudied: 2.5,
        topicsCompleted: ['ReentrantLock', 'Condition variables', 'Thread pools'],
        notes: 'Implemented Producer-Consumer pattern with blocking queue in Java.',
        learningItemId: javaItem._id,
      },
      {
        date: d2,
        subjectOrTopic: 'PyTorch Convolutional Neural Networks',
        hoursStudied: 3.0,
        topicsCompleted: ['Conv2d layers', 'MaxPooling', 'BatchNormalization'],
        notes: 'Trained a ResNet-18 model on CIFAR-10 with data augmentation.',
        learningItemId: mlRoadmapItem._id,
      },
      {
        date: d3,
        subjectOrTopic: 'Graph Algorithms: Shortest Paths',
        hoursStudied: 2.0,
        topicsCompleted: ['Dijkstra with PriorityQueue', 'Bellman-Ford'],
        notes: 'Solved 3 LeetCode Medium graph problems.',
        learningItemId: javaItem._id,
      },
      {
        date: d4,
        subjectOrTopic: 'Machine Learning Model Evaluation & ROC-AUC',
        hoursStudied: 2.5,
        topicsCompleted: ['Confusion Matrix', 'Precision-Recall Tradeoff', 'AUC Score'],
        notes: 'Analyzed imbalanced dataset classification.',
        learningItemId: mlRoadmapItem._id,
      },
      {
        date: d5,
        subjectOrTopic: 'Relational Database Indexing & B-Trees',
        hoursStudied: 2.0,
        topicsCompleted: ['Clustered vs Non-Clustered Indexes', 'Query Execution Plans'],
        notes: 'Reviewed EXPLAIN ANALYZE on complex SQL join queries.',
        learningItemId: null,
      },
      {
        date: d6,
        subjectOrTopic: 'Binary Search Trees & Tree Rotations',
        hoursStudied: 2.5,
        topicsCompleted: ['AVL Tree Rotations', 'Tree Traversals'],
        notes: 'Wrote iterative in-order and post-order traversals.',
        learningItemId: javaItem._id,
      },
      {
        date: d7,
        subjectOrTopic: 'Distributed Systems: RPC & CAP Theorem',
        hoursStudied: 2.0,
        topicsCompleted: ['CAP theorem trade-offs', 'Network partitions'],
        notes: 'Read chapter 5 in DDIA.',
        learningItemId: null,
      },
    ]);

    // 12. Create Interests
    await Interest.create([
      {
        name: 'Artificial Intelligence & Deep Learning',
        category: 'Technology & AI',
        description: 'Exploring neural network architectures, attention models, and generative models for computer vision and language.',
        interestLevel: 'Very High',
        relatedSkills: ['PyTorch', 'Machine Learning', 'Computer Vision'],
        isPublic: true,
        order: 1,
      },
      {
        name: 'Algorithmic Problem Solving',
        category: 'Computer Science',
        description: 'Tackling complex algorithmic puzzles, graph theory, and dynamic programming challenges.',
        interestLevel: 'Very High',
        relatedSkills: ['C++', 'Java', 'Data Structures & Algorithms'],
        isPublic: true,
        order: 2,
      },
      {
        name: 'High-Performance Systems & Cloud Architecture',
        category: 'Systems Engineering',
        description: 'Designing resilient distributed services, concurrent pipelines, and scalable database backends.',
        interestLevel: 'High',
        relatedSkills: ['Node.js', 'PostgreSQL', 'Docker', 'Linux'],
        isPublic: true,
        order: 3,
      },
      {
        name: 'Open Source Software & Research',
        category: 'Community & Academic',
        description: 'Participating in open source tooling, reviewing academic machine learning papers, and reproducibility studies.',
        interestLevel: 'High',
        relatedSkills: ['Git', 'Python', 'Documentation'],
        isPublic: true,
        order: 4,
      },
    ]);

    // 13. Create Activity Logs
    await ActivityLog.create([
      { action: 'Completed Topic', entityType: 'Course', entityTitle: 'CS501: PCA & Dimensionality Reduction', details: 'Finished unit 5 syllabus' },
      { action: 'Added Certificate', entityType: 'Certificate', entityTitle: 'Machine Learning Specialization', details: 'DeepLearning.AI & Stanford' },
      { action: 'Updated Learning Item', entityType: 'Learning', entityTitle: 'Java Programming & Advanced DSA', details: 'Progress updated to 65%' },
      { action: 'Added Course Resource', entityType: 'Resource', entityTitle: 'Decision Trees & Ensembles Cheat Sheet (PDF)', details: 'Uploaded for CS501' },
      { action: 'Logged Study Session', entityType: 'StudyLog', entityTitle: 'Java Multithreading & Synchronization Primitives', details: '2.5 hours studied' },
    ]);

    console.log('[Seed] Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error during seeding:', error);
    process.exit(1);
  }
};

seedDatabase();
