import { Course, CourseModule, CourseLesson, LessonMaterial, StudentCourseProgress } from '../types';

export const INITIAL_LMS_COURSES: Course[] = [
  {
    id: 'crs_oxf_ielts',
    organizationId: 'org_oxford',
    title: 'IELTS Academic Masterclass 7.5+',
    titleAr: 'دورة الآيلتس الأكاديمي المكثفة 7.5+',
    code: 'ENG-IELTS-701',
    description: 'Comprehensive test preparation covering Academic Writing Task 1 & 2, Spoken Fluency, Speed Reading Skimming, and Advanced Listening tactics tailored for high-scoring university and professional admissions.',
    level: 'B2',
    category: 'IELTS Prep',
    durationWeeks: 8,
    totalHours: 48,
    duration: '8 Weeks (48 Hours)',
    teacherId: 'usr_oxf_teacher1',
    teacherName: 'Sarah Jenkins, CELTA',
    teacherAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80',
    status: 'published',
    pricing: {
      type: 'paid',
      amount: 1850,
      currency: 'SAR',
      discountAmount: 200,
    },
    price: 1850,
    enrollmentRules: {
      type: 'open',
      maxStudents: 60,
      requiresPlacementTest: true,
      minimumPlacementLevel: 'B1',
    },
    enrolledStudentsCount: 38,
    rating: 4.9,
    reviewsCount: 52,
    createdAt: '2025-10-20T00:00:00Z',
    updatedAt: '2026-03-01T10:00:00Z',
    syllabus: [
      { week: 1, title: 'IELTS Overview & Diagnostic Speaking Mock', topics: ['Scoring rubric', 'Fluency vs Accuracy', 'Speaking Part 1'] },
      { week: 2, title: 'Writing Task 1 Graphs & Trends', topics: ['Data vocabulary', 'Overview statement', 'Band 8 model essays'] },
      { week: 3, title: 'Academic Reading - Speed & Headings', topics: ['True/False/Not Given', 'Paragraph matching', 'Vocabulary in context'] },
      { week: 4, title: 'Writing Task 2 Opinion & Discussion Essays', topics: ['Thesis statement', 'Cohesion and coherence', 'Complex structures'] },
    ],
    modules: [
      {
        id: 'mod_ielts_01',
        courseId: 'crs_oxf_ielts',
        title: 'Module 1: Speaking Fluency & Phonetic Range',
        titleAr: 'الوحدة 1: الطلاقة الشفهية والنطاق الصوتي',
        description: 'Deconstruct the four official IELTS speaking criteria (Fluency, Lexical Resource, Grammar, Pronunciation) and master spontaneous Part 1 and Part 2 responses.',
        order: 1,
        lessons: [
          {
            id: 'les_ielts_101',
            moduleId: 'mod_ielts_01',
            courseId: 'crs_oxf_ielts',
            title: '1.1 Mastering IELTS Speaking Band 8 Descriptors',
            titleAr: '1.1 إتقان معايير التقييم للدرجة 8 في المحادثة',
            description: 'Understand examiner rubric expectations and avoid memorized, formulaic answers that trigger score penalties.',
            order: 1,
            durationMinutes: 25,
            isFreePreview: true,
            materials: [
              {
                id: 'mat_ielts_vid_1',
                title: 'Examiner Breakdown: What Band 8+ Sounds Like',
                type: 'video',
                order: 1,
                description: 'Deep dive video into fluency markers, intonation contours, and natural hesitation devices.',
                videoContent: {
                  videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
                  provider: 'youtube',
                  durationSeconds: 960,
                  transcript: `In this lecture, Sarah Jenkins reviews authentic Cambridge examiner audio recordings. Notice how high-scoring candidates don't speak at lightning speed; rather, they chunk phrases logically, vary sentence stress, and use natural fillers like "Well, let me reflect on that for a second" rather than robotic silence or repeated "umm" sounds. Key takeaway: intonation delivers the emotion and intent behind your vocabulary.`,
                  thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
                },
              },
              {
                id: 'mat_ielts_txt_1',
                title: 'High-Impact Signposting & Idiomatic Collocations',
                type: 'text',
                order: 2,
                description: 'Essential discourse markers and collocations to transition smoothly between ideas.',
                textContent: {
                  estimatedReadMinutes: 10,
                  body: `# Strategic Discourse Markers for IELTS Speaking

To achieve Band 7.5 and above, examiners assess your ability to signpost your thoughts spontaneously.

### 1. Speculation and Hypothesis
When an examiner asks you about something you are unsure of:
* *"I haven't given it much thought previously, but I'd venture to say that..."*
* *"If my memory serves me correctly..."*
* *"It's widely assumed that X, though my personal inclination leans toward Y."*

### 2. Contrasting Points Smoothly
* *"While on the surface it appears advantageous, the flip side of the coin is..."*
* *"That being said, we mustn't overlook the fact that..."*

### 3. Avoiding Extreme Generalizations
Native speakers hedge their statements:
* Instead of: *"Everyone loves technology."*
* Say: *"A substantial majority of the contemporary workforce relies heavily on digital interfaces."*`,
                  keyVocabulary: [
                    { term: 'To venture an opinion', definition: 'To dare to state an opinion despite uncertainty', example: 'I would venture to say that remote education will dominate.' },
                    { term: 'The flip side of the coin', definition: 'The alternate or opposite aspect of a situation', example: 'Flexibility is great, but the flip side of the coin is isolation.' },
                    { term: 'Substantial majority', definition: 'A very large portion or percentage', example: 'A substantial majority of students completed the mock examination.' },
                  ],
                },
              },
              {
                id: 'mat_ielts_aud_1',
                title: 'Sample Band 8.5 Speaking Part 1 Audio Track',
                type: 'audio',
                order: 3,
                description: 'Listen to this native-level conversational sample focusing on Hometown and Modern Architecture questions.',
                audioContent: {
                  audioUrl: 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg',
                  durationSeconds: 240,
                  accent: 'British RP (Received Pronunciation)',
                  speakerName: 'Dr. Alistair Vance & Fatima Al-Zahra',
                  transcript: `Examiner: Let's talk about where you grew up. Did you enjoy spending your childhood there?\nCandidate: Oh, unequivocally yes! I was raised in the coastal city of Khobar. What struck me most was the serene juxtaposition between the traditional fishing heritage and modern coastal architecture. We used to wander down the Corniche in the balmy evenings, which fostered a real sense of community spirit.\nExaminer: And do you think it is a suitable place for young professionals to relocate today?\nCandidate: Without a shadow of a doubt. The burgeoning tech incubators and multinational hubs have transformed the metropolitan area into an energetic epicenter for nascent careers.`,
                },
              },
              {
                id: 'mat_ielts_pdf_1',
                title: 'CEFR C1 Speaking Competence & Prompt Bank PDF',
                type: 'pdf',
                order: 4,
                description: 'Download the comprehensive 18-page Cambridge IELTS speaking prompt workbook.',
                pdfContent: {
                  fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                  fileName: 'Oxford_IELTS_Speaking_Part1_Workbook.pdf',
                  fileSize: '3.4 MB',
                  totalPages: 18,
                  allowDownload: true,
                  description: 'Contains 120 authentic exam prompts categorised into Leisure, Technology, Urbanism, Global Travel, and Art Appreciation.',
                },
              },
            ],
          },
          {
            id: 'les_ielts_102',
            moduleId: 'mod_ielts_01',
            courseId: 'crs_oxf_ielts',
            title: '1.2 Diagnostic Vocabulary & Grammatical Range Quiz',
            titleAr: '1.2 اختبار تشخيصي في المفردات والتراكيب النحوية',
            description: 'Evaluate your ability to recognize complex grammatical inversion, fronting, and precise lexical choice.',
            order: 2,
            durationMinutes: 20,
            isFreePreview: false,
            materials: [
              {
                id: 'mat_ielts_quiz_1',
                title: 'Interactive Diagnostic Quiz: C1 Grammar & Inversion',
                type: 'quiz',
                order: 1,
                description: 'Test your mastery of advanced inversion, cleft sentences, and subjunctive moods.',
                quizContent: {
                  passingScore: 75,
                  title: 'C1 Academic Grammar & Concord Diagnostic',
                  description: 'Score at least 75% to achieve a Passing verification for this lesson.',
                  questions: [
                    {
                      id: 'q_ielts_1',
                      question: 'Select the grammatically accurate sentence featuring negative inversion:',
                      options: [
                        'Hardly had the candidate finished speaking when the timer chimed.',
                        'Hardly the candidate had finished speaking when the timer chimed.',
                        'Hardly did the candidate finished speaking when the timer chimed.',
                        'Hardly the candidate finished speaking and the timer was chiming.',
                      ],
                      correctOptionIndex: 0,
                      explanation: 'After negative adverbs like "Hardly", "Scarcely", or "No sooner", inverted word order (auxiliary verb + subject + main verb) is mandatory: "Hardly had the candidate finished...".',
                    },
                    {
                      id: 'q_ielts_2',
                      question: 'Which phrase demonstrates the most natural academic collocation for describing rapid change?',
                      options: [
                        'The population experienced a sudden exponential surge.',
                        'The population got big and fast quickly.',
                        'The population made a high climbing move.',
                        'The population developed very largely and wildly.',
                      ],
                      correctOptionIndex: 0,
                      explanation: '"Exponential surge" is a high-level academic collocation praised in IELTS Writing & Speaking descriptors.',
                    },
                    {
                      id: 'q_ielts_3',
                      question: 'Identify the correct subjunctive construction in formal English:',
                      options: [
                        'The committee recommended that every teacher submits their grades.',
                        'The committee recommended that every teacher submit their grades.',
                        'The committee recommended that every teacher is submitting grades.',
                        'The committee recommended for every teacher to be submit grades.',
                      ],
                      correctOptionIndex: 1,
                      explanation: 'The present subjunctive uses the base verb ("submit") regardless of whether the subject is singular.',
                    },
                    {
                      id: 'q_ielts_4',
                      question: 'Choose the sentence that correctly employs a cleft sentence to emphasize an outcome:',
                      options: [
                        'What surprised the examiners most was the applicant\'s profound grasp of idioms.',
                        'Which surprised the examiners most it was the applicant grasp.',
                        'That surprised examiners it was the applicant\'s deep idioms.',
                        'Because the applicant grasped idioms so examiners got surprised.',
                      ],
                      correctOptionIndex: 0,
                      explanation: 'Wh-cleft sentences ("What surprised... was...") provide sophisticated syntactic variety that elevates grammar scores.',
                    },
                  ],
                },
              },
            ],
          },
          {
            id: 'les_ielts_103',
            moduleId: 'mod_ielts_01',
            courseId: 'crs_oxf_ielts',
            title: '1.3 Speaking Part 2 Long Turn: Structure & Delivery',
            titleAr: '1.3 المحادثة الجزء 2: هيكلة الحديث المستمر والإلقاء',
            description: 'Learn the 4-quadrant mind map technique to speak continuously for 2 full minutes without running out of substance.',
            order: 3,
            durationMinutes: 30,
            isFreePreview: false,
            materials: [
              {
                id: 'mat_ielts_img_1',
                title: 'The 4-Quadrant 1-Minute Note-Taking Grid',
                type: 'image',
                order: 1,
                description: 'Visual diagram demonstrating how to organize the prompt points during your 60-second preparation window.',
                imageContent: {
                  imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80',
                  caption: 'Divide your scratch sheet into 4 quadrants: Background, Climax/Action, Sensory Details, and Long-Term Reflection.',
                  altText: '4-Quadrant IELTS Part 2 note-taking sheet illustration',
                },
              },
              {
                id: 'mat_ielts_ext_1',
                title: 'Official British Council IELTS Speaking Simulator Portal',
                type: 'external_resource',
                order: 2,
                description: 'Practice with timed prompts directly inside the verified British Council portal.',
                externalContent: {
                  url: 'https://takeielts.britishcouncil.org/take-ielts/prepare/free-ielts-practice-tests/speaking-practice-tests',
                  title: 'British Council Interactive Speaking Portal',
                  description: 'Access 25+ real exam speaking recordings and timed self-evaluation scripts.',
                  openInNewTab: true,
                },
              },
              {
                id: 'mat_ielts_asg_1',
                title: 'Speaking Part 2 Simulation: Describe an Inspiring Mentor',
                type: 'assignment',
                order: 3,
                description: 'Draft your speech transcript or audio monologue and receive graded feedback from Sarah Jenkins.',
                assignmentContent: {
                  prompt: `You should say:
• Who this mentor is and how you initially met them
• What specific pedagogical or professional qualities made them stand out
• How their guidance altered your perspective or career trajectory
• And explain why their mentorship remains memorable to you.`,
                  instructions: 'Write a comprehensive speech transcript (minimum 250 words) incorporating at least 3 idiomatic collocations and 2 complex syntactic structures (inversion or clefting).',
                  maxScore: 100,
                  dueDate: '2026-09-30',
                  rubric: 'Fluency & Coherence (25pts), Lexical Resource (25pts), Grammatical Range (25pts), Pronunciation/Tone Clarity (25pts).',
                },
              },
            ],
          },
        ],
      },
      {
        id: 'mod_ielts_02',
        courseId: 'crs_oxf_ielts',
        title: 'Module 2: Academic Writing Task 1 Data Synthesis',
        titleAr: 'الوحدة 2: تحليل وتوليف بيانات الكتابة الأكاديمية المهمة 1',
        description: 'Transform complex graphs, charts, and process diagrams into precise 150-word analytical summaries with accurate mathematical trend vocabulary.',
        order: 2,
        lessons: [
          {
            id: 'les_ielts_201',
            moduleId: 'mod_ielts_02',
            courseId: 'crs_oxf_ielts',
            title: '2.1 Bar Charts, Trends & Proportions',
            titleAr: '2.1 المخططات الشريطية والاتجاهات والنسب المئوية',
            description: 'Learn how to write a standout Band 8 overview statement that examiners require for top-tier Task 1 scores.',
            order: 1,
            durationMinutes: 30,
            isFreePreview: false,
            materials: [
              {
                id: 'mat_ielts_txt_2',
                title: 'Task 1 Academic Lexicon for Quantities and Trajectories',
                type: 'text',
                order: 1,
                description: 'Standardized verbs, nouns, and adverbs for upward, downward, and oscillating trends.',
                textContent: {
                  estimatedReadMinutes: 8,
                  body: `# Academic Writing Task 1 Lexicon

Never write *"it went up a lot"* or *"it was very high"*. Replace generic phrases with high-band academic indicators:

### 1. Significant Rises
* **Verbs:** surge, soar, skyrocket, climb steadily, register a marked increase.
* **Nouns:** a steep ascent, an upward trajectory, a dramatic surge.
* **Example:** *"Between 2015 and 2020, solar energy output experienced a dramatic surge, quadrupling from 25 to 100 gigawatt-hours."*

### 2. Declines and Plateaus
* **Verbs:** plummet, plunge, dwindle, bottom out at, level off at.
* **Example:** *"Conversely, fossil fuel dependence dwindled precipitously to an all-time low of 14%."*

### 3. Proportions and Fractions
* 75% -> *"three-quarters of the total cohort"*
* 33% -> *"a third"*
* 24% -> *"just under a quarter"*
* 4% -> *"a negligible fraction"*`,
                  keyVocabulary: [
                    { term: 'Dwindled precipitously', definition: 'Decreased rapidly and steeply', example: 'Coal consumption dwindled precipitously across the decade.' },
                    { term: 'Plateaued at', definition: 'Reached a stable state after an increase', example: 'Sales plateaued at 4,000 units throughout Q3.' },
                    { term: 'Negligible fraction', definition: 'An insignificantly small amount', example: 'Only a negligible fraction reported any software anomalies.' },
                  ],
                },
              },
              {
                id: 'mat_ielts_asg_2',
                title: 'Writing Task 1 Exercise: Global Renewable Energy Adoption',
                type: 'assignment',
                order: 2,
                description: 'Write a 150-word synthesis based on the provided comparative data table.',
                assignmentContent: {
                  prompt: `The chart illustrates solar, wind, and nuclear energy generation across five nations (Germany, Saudi Arabia, China, UK, USA) between 2015 and 2025.

Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.`,
                  instructions: 'Include an introductory paraphrase, a clear 2-sentence overview highlight, and two detailed body paragraphs comparing regional data.',
                  maxScore: 100,
                  dueDate: '2026-10-05',
                  rubric: 'Task Achievement (25pts), Coherence & Cohesion (25pts), Lexical Resource (25pts), Grammatical Accuracy (25pts).',
                },
              },
            ],
          },
        ],
      },
      {
        id: 'mod_ielts_03',
        courseId: 'crs_oxf_ielts',
        title: 'Module 3: Academic Writing Task 2 Discursive Essays',
        titleAr: 'الوحدة 3: مقالات الرأي والنقاش في الكتابة الأكاديمية المهمة 2',
        description: 'Construct cohesive 250-word arguments, counter-arguments, and balanced conclusions for Band 7.5+ scoring.',
        order: 3,
        lessons: [
          {
            id: 'les_ielts_301',
            moduleId: 'mod_ielts_03',
            courseId: 'crs_oxf_ielts',
            title: '3.1 The 4-Paragraph Essay Architecture',
            titleAr: '3.1 هيكل المقال الأكاديمي المكون من 4 فقرات',
            description: 'Master the universal outline that guarantees 100% adherence to Task Response criteria.',
            order: 1,
            durationMinutes: 35,
            isFreePreview: false,
            materials: [
              {
                id: 'mat_ielts_txt_3',
                title: 'Thesis Statements and Counter-Argument Balance',
                type: 'text',
                order: 1,
                description: 'Step-by-step formula for drafting a crisp thesis statement in the introduction.',
                textContent: {
                  estimatedReadMinutes: 12,
                  body: `# The 4-Paragraph IELTS Task 2 Master Template

1. **Paragraph 1: Introduction (45-50 words)**
   * Sentence 1: Background paraphrase of the prompt.
   * Sentence 2: Clear thesis statement detailing your position.
   * Sentence 3: Outline statement foreshadowing your main supporting arguments.

2. **Paragraph 2: Body Paragraph 1 (80-90 words)**
   * Topic sentence presenting primary argument.
   * Supporting elaboration explaining the causal mechanism.
   * Concrete illustrative example (empirical study, real-world case).
   * Concluding sentence linking back to thesis.

3. **Paragraph 3: Body Paragraph 2 (80-90 words)**
   * Topic sentence presenting secondary argument or refuting counter-claim.
   * Analysis of why the counter-view is flawed or limited.
   * Relevant example.
   * Summary link.

4. **Paragraph 4: Conclusion (35-40 words)**
   * Restatement of thesis in fresh vocabulary.
   * Synthesised summary of key points.
   * Final forward-looking recommendation or prediction.`,
                },
              },
              {
                id: 'mat_ielts_asg_3',
                title: 'Task 2 Essay: Artificial Intelligence in Higher Education',
                type: 'assignment',
                order: 2,
                description: 'Write a full 250-word academic essay analyzing the role of AI in academia.',
                assignmentContent: {
                  prompt: `Some educators believe that artificial intelligence tools should be banned in universities because they inhibit critical thinking, while others assert that AI literacy is an indispensable 21st-century skill.

Discuss both views and give your own well-reasoned opinion. Write at least 250 words.`,
                  instructions: 'Ensure your position is clear throughout the essay. Provide specific real-world examples and use precise formal academic registers.',
                  maxScore: 100,
                  dueDate: '2026-10-15',
                  rubric: 'Task Response (25%), Coherence & Cohesion (25%), Lexical Resource (25%), Grammatical Range & Accuracy (25%).',
                },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'crs_oxf_gen',
    organizationId: 'org_oxford',
    title: 'B1 Intermediate Conversational Fluency',
    titleAr: 'دورة المحادثة والطلاقة اللغوية المستوى المتوسط',
    code: 'ENG-CONV-301',
    description: 'Master everyday conversational English, professional telephone manners, idioms, and natural pronunciation in dynamic real-world social environments.',
    level: 'B1',
    category: 'General English',
    durationWeeks: 6,
    totalHours: 36,
    duration: '6 Weeks (36 Hours)',
    teacherId: 'usr_oxf_teacher2',
    teacherName: 'David Miller, DELTA',
    teacherAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&auto=format&fit=crop&q=80',
    status: 'published',
    pricing: {
      type: 'paid',
      amount: 1200,
      currency: 'SAR',
    },
    price: 1200,
    enrollmentRules: {
      type: 'open',
      maxStudents: 40,
      requiresPlacementTest: false,
    },
    enrolledStudentsCount: 45,
    rating: 4.8,
    reviewsCount: 39,
    createdAt: '2025-10-25T00:00:00Z',
    updatedAt: '2026-02-15T00:00:00Z',
    syllabus: [
      { week: 1, title: 'Conversational Icebreakers & Small Talk', topics: ['Opening dialogues', 'Active listening', 'Connected speech'] },
      { week: 2, title: 'Expressing Opinions & Debates', topics: ['Agreeing/disagreeing politely', 'Hedging', 'Idiomatic phrases'] },
    ],
    modules: [
      {
        id: 'mod_gen_01',
        courseId: 'crs_oxf_gen',
        title: 'Module 1: Everyday Social Dialogues & Natural Connected Speech',
        titleAr: 'الوحدة 1: المحادثات اليومية والنطق الطبيعي المترابط',
        description: 'Build confidence striking up conversations, introducing yourself smoothly, and mastering elision and assimilation.',
        order: 1,
        lessons: [
          {
            id: 'les_gen_101',
            moduleId: 'mod_gen_01',
            courseId: 'crs_oxf_gen',
            title: '1.1 Breaking the Ice: Conversational Openers',
            titleAr: '1.1 كسر الجليد: مفاتيح المحادثة وبدايات الحوار',
            description: 'Learn conversational hooks that invite spontaneous dialogue without feeling intrusive.',
            order: 1,
            durationMinutes: 20,
            isFreePreview: true,
            materials: [
              {
                id: 'mat_gen_aud_1',
                title: 'Natural Coffee Shop Dialogues: Small Talk & Networking',
                type: 'audio',
                order: 1,
                description: 'Listen to native speakers strike up a conversation at an international business lounge.',
                audioContent: {
                  audioUrl: 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg',
                  durationSeconds: 180,
                  accent: 'General American',
                  speakerName: 'Mark & Rachel',
                  transcript: `Mark: Excuse me, is anyone sitting here?\nRachel: No, feel free to pull up a chair!\nMark: Appreciate it. It's packed in here today. Are you also attending the FinTech summit upstairs?\nRachel: I am! Just reviewing my notes before the keynote. How about yourself?\nMark: Same here. I'm actually presenting a brief case study this afternoon on cross-border payments.`,
                },
              },
              {
                id: 'mat_gen_txt_1',
                title: '30 Natural Daily Idioms for B1 Fluency',
                type: 'text',
                order: 2,
                description: 'Idiomatic expressions that immediately make your speech sound more relaxed and native-like.',
                textContent: {
                  estimatedReadMinutes: 7,
                  body: `# Conversational Idioms for Everyday Fluency

* **"To break the ice"**: To make people feel relaxed with each other.
* **"To see eye to eye"**: To agree with someone on a key issue.
* **"Call it a day"**: To stop working on something for the evening.
* **"Hit the nail on the head"**: To describe exactly what is causing a situation.
* **"Play it by ear"**: To decide how to deal with a situation as it develops rather than having a rigid plan.`,
                },
              },
              {
                id: 'mat_gen_quiz_1',
                title: 'B1 Everyday Idioms & Register Check',
                type: 'quiz',
                order: 3,
                description: 'Quick quiz to verify correct contextual usage of B1 idioms.',
                quizContent: {
                  passingScore: 70,
                  title: 'B1 Everyday Expressions Quiz',
                  questions: [
                    {
                      id: 'q_gen_1',
                      question: 'When a colleague says: "Let\'s play it by ear," what do they mean?',
                      options: [
                        'Let\'s decide as we go without a fixed plan.',
                        'Let\'s listen to music while working.',
                        'Let\'s cancel the meeting permanently.',
                        'Let\'s hire an audio sound engineer.',
                      ],
                      correctOptionIndex: 0,
                      explanation: '"Play it by ear" is an informal idiom meaning to proceed without a fixed script.',
                    },
                    {
                      id: 'q_gen_2',
                      question: 'Which response is most polite when declining an invitation?',
                      options: [
                        'I\'d love to, but I\'m tied up with prior commitments this evening.',
                        'No, I don\'t want to go there.',
                        'You should go without me because it is boring.',
                        'Never ask me again.',
                      ],
                      correctOptionIndex: 0,
                      explanation: '"I\'d love to, but I\'m tied up..." hedges politely while expressing appreciation.',
                    },
                  ],
                },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'crs_flu_biz',
    organizationId: 'org_fluency',
    title: 'Executive English & Leadership Presentations',
    titleAr: 'الإنجليزية التنفيذية ومهارات العروض القيادية',
    code: 'EXEC-500',
    description: 'High-impact vocabulary and rhetorical strategies for C-suite presentations, negotiations, cross-border mergers, and international board meetings.',
    level: 'C1',
    category: 'Business English',
    durationWeeks: 10,
    totalHours: 60,
    duration: '10 Weeks (60 Hours)',
    teacherId: 'usr_cam_teacher',
    teacherName: 'Prof. Julian Cambridge, MA',
    teacherAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop&q=80',
    status: 'published',
    pricing: {
      type: 'paid',
      amount: 3200,
      currency: 'SAR',
    },
    price: 3200,
    enrollmentRules: {
      type: 'approval_required',
      maxStudents: 25,
      requiresPlacementTest: true,
      minimumPlacementLevel: 'B2',
    },
    enrolledStudentsCount: 22,
    rating: 5.0,
    reviewsCount: 18,
    createdAt: '2025-08-15T00:00:00Z',
    updatedAt: '2026-01-20T00:00:00Z',
    syllabus: [
      { week: 1, title: 'Persuasive Delivery & Executive Presence', topics: ['Tone modulation', 'Signposting language', 'Q&A handling'] },
    ],
    modules: [
      {
        id: 'mod_biz_01',
        courseId: 'crs_flu_biz',
        title: 'Module 1: Rhetoric, Storytelling & Executive Presence',
        titleAr: 'الوحدة 1: البلاغة والسرد القصصي والحضور القيادي',
        description: 'Command the boardroom with signposting language, Aristotle\'s rhetorical triangle (Ethos, Pathos, Logos), and assertive negotiation tactics.',
        order: 1,
        lessons: [
          {
            id: 'les_biz_101',
            moduleId: 'mod_biz_01',
            courseId: 'crs_flu_biz',
            title: '1.1 The C-Suite Elevator Pitch: Clarity Under Pressure',
            titleAr: '1.1 العرض التقديمي التنفيذي: الوضوح تحت الضغط',
            description: 'Distill multi-million-dollar strategic initiatives into 180 seconds of razor-sharp executive synthesis.',
            order: 1,
            durationMinutes: 30,
            isFreePreview: true,
            materials: [
              {
                id: 'mat_biz_pdf_1',
                title: 'Harvard & McKinsey Executive Communication Playbook',
                type: 'pdf',
                order: 1,
                description: 'Download the 24-page framework on the Minto Pyramid Principle.',
                pdfContent: {
                  fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                  fileName: 'McKinsey_Minto_Pyramid_Communication.pdf',
                  fileSize: '4.1 MB',
                  totalPages: 24,
                  allowDownload: true,
                },
              },
              {
                id: 'mat_biz_asg_1',
                title: 'Executive Pitch Submission: Digital Transformation Initiative',
                type: 'assignment',
                order: 2,
                description: 'Draft your executive 3-minute investment pitch for senior leadership.',
                assignmentContent: {
                  prompt: `Draft an executive briefing outlining a strategic AI integration for your enterprise. State the problem, the financial ROI, timeline, and mitigation of operational risks.`,
                  maxScore: 100,
                  dueDate: '2026-10-20',
                  rubric: 'Executive Tone (30%), Strategic Conciseness (30%), ROI Clarity (20%), Risk Mitigation (20%).',
                },
              },
            ],
          },
        ],
      },
    ],
  },
];

export const INITIAL_STUDENT_PROGRESS: StudentCourseProgress[] = [
  {
    id: 'prg_oxf_student1_ielts',
    studentId: 'usr_oxf_student1', // Omar Al-Mansoor
    courseId: 'crs_oxf_ielts',
    organizationId: 'org_oxford',
    status: 'in_progress',
    progressPercentage: 50,
    completedLessonsCount: 2,
    totalLessonsCount: 4,
    timeSpentMinutes: 85,
    startedAt: '2025-11-02T10:00:00Z',
    lastAccessedAt: '2026-03-08T14:20:00Z',
    lessonProgress: {
      les_ielts_101: {
        lessonId: 'les_ielts_101',
        completed: true,
        completedAt: '2025-11-04T15:30:00Z',
        timeSpentSeconds: 1540,
      },
      les_ielts_102: {
        lessonId: 'les_ielts_102',
        completed: true,
        completedAt: '2025-11-08T18:00:00Z',
        timeSpentSeconds: 1200,
      },
    },
    quizProgress: {
      mat_ielts_quiz_1: {
        quizMaterialId: 'mat_ielts_quiz_1',
        score: 100,
        passed: true,
        attempts: 1,
        lastAttemptAt: '2025-11-08T18:00:00Z',
        answers: { q_ielts_1: 0, q_ielts_2: 0, q_ielts_3: 1, q_ielts_4: 0 },
      },
    },
    assignmentProgress: {
      mat_ielts_asg_1: {
        assignmentMaterialId: 'mat_ielts_asg_1',
        submitted: true,
        submittedAt: '2025-11-12T16:00:00Z',
        textSubmission: `Mentor Tribute: Professor Arthur Pendelton.
During my formative undergraduate studies at King Fahd University, I had the distinct privilege of learning under Dr. Arthur Pendelton. What struck me immediately was his pedagogical egalitarianism; rarely did he lecture ex cathedra; instead, he cultivated an intellectually stimulating symposium where discourse flourished.
His insistence on rigorous analytical argumentation profoundly altered my trajectory. When preparing my initial research thesis, hardly had I completed the preliminary abstract when he challenged me to reconsider my methodology. It was his unwavering high standards that inspired my dedication to international scholarship.`,
        status: 'graded',
        score: 94,
        feedback: 'Superb lexical range, precise inversion ("rarely did he lecture", "hardly had I completed"), and compelling voice. Excellent Band 8.5 performance!',
        gradedBy: 'Sarah Jenkins, CELTA',
        gradedAt: '2025-11-14T11:00:00Z',
      },
    },
  },
];
