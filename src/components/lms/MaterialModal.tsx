import React, { useState, useEffect } from 'react';
import { LessonMaterial, MaterialType, QuizQuestionItem } from '../../types';
import {
  X,
  FileText,
  Video,
  FileDown,
  Volume2,
  Image as ImageIcon,
  ExternalLink,
  HelpCircle,
  FileCheck2,
  Plus,
  Trash2,
} from 'lucide-react';

interface MaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<LessonMaterial>) => Promise<void>;
  initialMaterial?: LessonMaterial | null;
  defaultOrder?: number;
}

export const MaterialModal: React.FC<MaterialModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialMaterial,
  defaultOrder = 1,
}) => {
  const [type, setType] = useState<MaterialType>('text');
  const [title, setTitle] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [description, setDescription] = useState('');
  const [order, setOrder] = useState(defaultOrder);
  const [saving, setSaving] = useState(false);

  // Text Material State
  const [textBody, setTextBody] = useState('');
  const [readMinutes, setReadMinutes] = useState(5);
  const [vocabTerm, setVocabTerm] = useState('');
  const [vocabDef, setVocabDef] = useState('');
  const [vocabList, setVocabList] = useState<{ term: string; definition: string; example?: string }[]>([]);

  // Video Material State
  const [videoUrl, setVideoUrl] = useState('');
  const [videoDuration, setVideoDuration] = useState(600);
  const [videoTranscript, setVideoTranscript] = useState('');

  // PDF Material State
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfFileName, setPdfFileName] = useState('');
  const [pdfPages, setPdfPages] = useState(12);

  // Audio Material State
  const [audioUrl, setAudioUrl] = useState('');
  const [audioAccent, setAudioAccent] = useState('British RP');
  const [audioSpeaker, setAudioSpeaker] = useState('Dr. Eleanor Vance');
  const [audioTranscript, setAudioTranscript] = useState('');

  // Image Material State
  const [imageUrl, setImageUrl] = useState('');
  const [imageCaption, setImageCaption] = useState('');

  // External Resource State
  const [externalUrl, setExternalUrl] = useState('');
  const [externalDesc, setExternalDesc] = useState('');

  // Quiz Material State
  const [quizPassingScore, setQuizPassingScore] = useState(75);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestionItem[]>([
    {
      id: 'q_1',
      question: 'Which of the following phrases is most suitable for introducing an IELTS Task 2 concession paragraph?',
      options: [
        'Admittedly, proponents of the opposing stance contend that...',
        'Like I said before, everyone knows that...',
        'On the other side of things, it is super clear that...',
        'I think maybe people have some random reasons that...',
      ],
      correctOptionIndex: 0,
      explanation: 'Academic discourse requires formal hedging markers like "Admittedly..." or "It is widely acknowledged that...".',
    },
  ]);

  // Assignment Material State
  const [assignmentPrompt, setAssignmentPrompt] = useState('');
  const [assignmentRubric, setAssignmentRubric] = useState('');
  const [assignmentMaxScore, setAssignmentMaxScore] = useState(100);

  useEffect(() => {
    if (initialMaterial) {
      setType(initialMaterial.type || 'text');
      setTitle(initialMaterial.title || '');
      setTitleAr(initialMaterial.titleAr || '');
      setDescription(initialMaterial.description || '');
      setOrder(initialMaterial.order || defaultOrder);

      // Populate text
      if (initialMaterial.textContent) {
        setTextBody(initialMaterial.textContent.body || '');
        setReadMinutes(initialMaterial.textContent.estimatedReadMinutes || 5);
        setVocabList(initialMaterial.textContent.keyVocabulary || []);
      }

      // Populate video
      if (initialMaterial.videoContent) {
        setVideoUrl(initialMaterial.videoContent.videoUrl || '');
        setVideoDuration(initialMaterial.videoContent.durationSeconds || 600);
        setVideoTranscript(initialMaterial.videoContent.transcript || '');
      }

      // Populate pdf
      if (initialMaterial.pdfContent) {
        setPdfUrl(initialMaterial.pdfContent.fileUrl || '');
        setPdfFileName(initialMaterial.pdfContent.fileName || '');
        setPdfPages(initialMaterial.pdfContent.totalPages || 12);
      }

      // Populate audio
      if (initialMaterial.audioContent) {
        setAudioUrl(initialMaterial.audioContent.audioUrl || '');
        setAudioAccent(initialMaterial.audioContent.accent || 'British RP');
        setAudioSpeaker(initialMaterial.audioContent.speakerName || 'Instructor');
        setAudioTranscript(initialMaterial.audioContent.transcript || '');
      }

      // Populate image
      if (initialMaterial.imageContent) {
        setImageUrl(initialMaterial.imageContent.imageUrl || '');
        setImageCaption(initialMaterial.imageContent.caption || '');
      }

      // Populate external
      if (initialMaterial.externalContent) {
        setExternalUrl(initialMaterial.externalContent.url || '');
        setExternalDesc(initialMaterial.externalContent.description || '');
      }

      // Populate quiz
      if (initialMaterial.quizContent) {
        setQuizPassingScore(initialMaterial.quizContent.passingScore || 75);
        setQuizQuestions(initialMaterial.quizContent.questions || []);
      }

      // Populate assignment
      if (initialMaterial.assignmentContent) {
        setAssignmentPrompt(initialMaterial.assignmentContent.prompt || '');
        setAssignmentRubric(initialMaterial.assignmentContent.rubric || '');
        setAssignmentMaxScore(initialMaterial.assignmentContent.maxScore || 100);
      }
    } else {
      setType('text');
      setTitle('');
      setTitleAr('');
      setDescription('');
      setOrder(defaultOrder);
      setTextBody('');
      setReadMinutes(5);
      setVocabList([]);
      setVideoUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
      setVideoDuration(600);
      setVideoTranscript('');
      setPdfUrl('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');
      setPdfFileName('Course_Reading_Pack.pdf');
      setPdfPages(12);
      setAudioUrl('https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg');
      setAudioAccent('British RP');
      setAudioSpeaker('Dr. Eleanor Vance');
      setAudioTranscript('');
      setImageUrl('https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80');
      setImageCaption('Visual Map: Band 8 Lexical Range Distribution');
      setExternalUrl('https://ielts.org');
      setExternalDesc('Official IELTS Cambridge Scoring Benchmark Guide');
      setQuizPassingScore(75);
      setAssignmentPrompt('Write an analytical essay (250-300 words) discussing whether automated language models enhance or impair learner autonomy in acquiring CEFR C1 fluency.');
      setAssignmentRubric('Task Achievement: 25% | Cohesion & Coherence: 25% | Lexical Resource: 25% | Grammatical Accuracy: 25%');
      setAssignmentMaxScore(100);
    }
  }, [initialMaterial, isOpen, defaultOrder]);

  if (!isOpen) return null;

  const handleAddQuestion = () => {
    setQuizQuestions([
      ...quizQuestions,
      {
        id: `q_${Date.now()}`,
        question: 'New comprehension or grammar question...',
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctOptionIndex: 0,
        explanation: 'Rationale for the correct option choice.',
      },
    ]);
  };

  const handleUpdateQuestion = (idx: number, field: string, val: any) => {
    const updated = [...quizQuestions];
    (updated[idx] as any)[field] = val;
    setQuizQuestions(updated);
  };

  const handleUpdateOption = (qIdx: number, optIdx: number, val: string) => {
    const updated = [...quizQuestions];
    updated[qIdx].options[optIdx] = val;
    setQuizQuestions(updated);
  };

  const handleRemoveQuestion = (idx: number) => {
    setQuizQuestions(quizQuestions.filter((_, i) => i !== idx));
  };

  const handleAddVocab = () => {
    if (!vocabTerm.trim() || !vocabDef.trim()) return;
    setVocabList([...vocabList, { term: vocabTerm.trim(), definition: vocabDef.trim() }]);
    setVocabTerm('');
    setVocabDef('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSaving(true);
    try {
      const payload: Partial<LessonMaterial> = {
        title,
        titleAr: titleAr.trim() || undefined,
        type,
        order: Number(order) || 1,
        description: description.trim() || undefined,
      };

      if (type === 'text') {
        payload.textContent = {
          body: textBody,
          estimatedReadMinutes: Number(readMinutes) || 5,
          keyVocabulary: vocabList,
        };
      } else if (type === 'video') {
        payload.videoContent = {
          videoUrl,
          durationSeconds: Number(videoDuration) || 600,
          transcript: videoTranscript || undefined,
          provider: 'direct',
        };
      } else if (type === 'pdf') {
        payload.pdfContent = {
          fileUrl: pdfUrl,
          fileName: pdfFileName || 'Lecture_Notes.pdf',
          totalPages: Number(pdfPages) || 10,
          allowDownload: true,
        };
      } else if (type === 'audio') {
        payload.audioContent = {
          audioUrl,
          durationSeconds: 300,
          accent: audioAccent,
          speakerName: audioSpeaker,
          transcript: audioTranscript || undefined,
        };
      } else if (type === 'image') {
        payload.imageContent = {
          imageUrl,
          caption: imageCaption,
          altText: title,
        };
      } else if (type === 'external_resource') {
        payload.externalContent = {
          url: externalUrl,
          title,
          description: externalDesc,
          openInNewTab: true,
        };
      } else if (type === 'quiz') {
        payload.quizContent = {
          title,
          description,
          passingScore: Number(quizPassingScore) || 75,
          questions: quizQuestions,
        };
      } else if (type === 'assignment') {
        payload.assignmentContent = {
          prompt: assignmentPrompt,
          rubric: assignmentRubric,
          maxScore: Number(assignmentMaxScore) || 100,
        };
      }

      await onSave(payload);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const materialTypes: { type: MaterialType; label: string; icon: any; color: string }[] = [
    { type: 'text', label: 'Text & Lexicon', icon: FileText, color: 'text-sky-600 bg-sky-50' },
    { type: 'video', label: 'Video Lecture', icon: Video, color: 'text-red-600 bg-red-50' },
    { type: 'pdf', label: 'PDF Handout', icon: FileDown, color: 'text-amber-600 bg-amber-50' },
    { type: 'audio', label: 'Audio Listening', icon: Volume2, color: 'text-purple-600 bg-purple-50' },
    { type: 'image', label: 'Linguistic Chart', icon: ImageIcon, color: 'text-emerald-600 bg-emerald-50' },
    { type: 'external_resource', label: 'External Link', icon: ExternalLink, color: 'text-blue-600 bg-blue-50' },
    { type: 'quiz', label: 'Interactive Quiz', icon: HelpCircle, color: 'text-indigo-600 bg-indigo-50' },
    { type: 'assignment', label: 'Writing Assignment', icon: FileCheck2, color: 'text-rose-600 bg-rose-50' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {initialMaterial ? 'Edit Learning Material' : 'Add Learning Material to Lesson'}
            </h3>
            <p className="text-xs text-slate-500">
              Select one of the 8 material modalities supported by MR. FLUENCY LMS.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Material Type Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Material Modality *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {materialTypes.map((item) => {
                const Icon = item.icon;
                const active = type === item.type;
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => setType(item.type)}
                    className={`p-2.5 rounded-xl border text-left flex flex-col items-start gap-1.5 transition ${
                      active
                        ? 'border-indigo-600 bg-indigo-50/70 shadow-sm ring-1 ring-indigo-500'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg ${item.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Common Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Material Title (English) *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Band 8 Vocabulary Masterclass"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Material Title (Arabic)
              </label>
              <input
                type="text"
                dir="rtl"
                value={titleAr}
                onChange={(e) => setTitleAr(e.target.value)}
                placeholder="شرح المفردات المتقدمة للدرجة 8"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-serif"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Summary / Instruction
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short guiding note for the student before launching this material..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Display Order
              </label>
              <input
                type="number"
                min={1}
                value={order}
                onChange={(e) => setOrder(parseInt(e.target.value, 10) || 1)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Type-Specific Content Builders */}

          {/* 1. TEXT */}
          {type === 'text' && (
            <div className="space-y-3 pt-3 border-t border-slate-100 bg-sky-50/40 p-4 rounded-xl border border-sky-100">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-sky-600" />
                  <span>Text Content & Lexicon Cards</span>
                </h4>
                <div className="flex items-center gap-1 text-xs text-sky-800">
                  <span>Read time:</span>
                  <input
                    type="number"
                    min={1}
                    value={readMinutes}
                    onChange={(e) => setReadMinutes(parseInt(e.target.value, 10) || 5)}
                    className="w-14 px-2 py-0.5 rounded border border-sky-200 text-xs bg-white"
                  />
                  <span>min</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Main Lesson Body (Markdown / Text)
                </label>
                <textarea
                  rows={5}
                  value={textBody}
                  onChange={(e) => setTextBody(e.target.value)}
                  placeholder="### Academic Writing Principles&#10;&#10;In IELTS Academic Task 1, an overview statement must summarize the principal trends without citing microscopic data points..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono bg-white"
                />
              </div>

              {/* Key Vocabulary helper */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Add Key CEFR Vocabulary Terms
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Term (e.g. Paramount)"
                    value={vocabTerm}
                    onChange={(e) => setVocabTerm(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Definition / CEFR Meaning"
                    value={vocabDef}
                    onChange={(e) => setVocabDef(e.target.value)}
                    className="flex-2 px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddVocab}
                    className="px-3 py-1.5 rounded-xl bg-sky-600 text-white text-xs font-semibold"
                  >
                    Add
                  </button>
                </div>

                {vocabList.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {vocabList.map((v, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-100 text-sky-800 text-[11px]"
                      >
                        <strong>{v.term}:</strong> {v.definition}
                        <button
                          type="button"
                          onClick={() => setVocabList(vocabList.filter((_, idx) => idx !== i))}
                          className="hover:text-red-500 ml-1"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 2. VIDEO */}
          {type === 'video' && (
            <div className="space-y-3 pt-3 border-t border-slate-100 bg-red-50/40 p-4 rounded-xl border border-red-100">
              <h4 className="text-xs font-bold text-red-900 flex items-center gap-1.5">
                <Video className="w-4 h-4 text-red-600" />
                <span>Video Player Configuration</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Video Stream URL (MP4 / WebM / Direct Stream)
                  </label>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://commondatastorage.googleapis.com/.../sample.mp4"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Duration (Seconds)
                  </label>
                  <input
                    type="number"
                    value={videoDuration}
                    onChange={(e) => setVideoDuration(parseInt(e.target.value, 10) || 600)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Video Transcript / Lecture Outline
                </label>
                <textarea
                  rows={3}
                  value={videoTranscript}
                  onChange={(e) => setVideoTranscript(e.target.value)}
                  placeholder="[00:00] Introduction to Task 1&#10;[02:15] Identifying the dynamic axis..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                />
              </div>
            </div>
          )}

          {/* 3. PDF */}
          {type === 'pdf' && (
            <div className="space-y-3 pt-3 border-t border-slate-100 bg-amber-50/40 p-4 rounded-xl border border-amber-100">
              <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <FileDown className="w-4 h-4 text-amber-600" />
                <span>PDF Document Viewer Configuration</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    PDF Document URL
                  </label>
                  <input
                    type="url"
                    value={pdfUrl}
                    onChange={(e) => setPdfUrl(e.target.value)}
                    placeholder="https://.../handout.pdf"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Total Pages
                  </label>
                  <input
                    type="number"
                    value={pdfPages}
                    onChange={(e) => setPdfPages(parseInt(e.target.value, 10) || 10)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Display File Name
                </label>
                <input
                  type="text"
                  value={pdfFileName}
                  onChange={(e) => setPdfFileName(e.target.value)}
                  placeholder="IELTS_Writing_Task1_Vocabulary_Guide.pdf"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                />
              </div>
            </div>
          )}

          {/* 4. AUDIO */}
          {type === 'audio' && (
            <div className="space-y-3 pt-3 border-t border-slate-100 bg-purple-50/40 p-4 rounded-xl border border-purple-100">
              <h4 className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-purple-600" />
                <span>Audio Listening Lab Configuration</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Audio Stream URL (MP3 / OGG)
                  </label>
                  <input
                    type="url"
                    value={audioUrl}
                    onChange={(e) => setAudioUrl(e.target.value)}
                    placeholder="https://.../recording.mp3"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Speaker Accent
                  </label>
                  <input
                    type="text"
                    value={audioAccent}
                    onChange={(e) => setAudioAccent(e.target.value)}
                    placeholder="British RP, General American, Australian..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Audio Script / Transcript
                </label>
                <textarea
                  rows={3}
                  value={audioTranscript}
                  onChange={(e) => setAudioTranscript(e.target.value)}
                  placeholder="Complete listening passage script for student self-check..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                />
              </div>
            </div>
          )}

          {/* 5. IMAGE */}
          {type === 'image' && (
            <div className="space-y-3 pt-3 border-t border-slate-100 bg-emerald-50/40 p-4 rounded-xl border border-emerald-100">
              <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-emerald-600" />
                <span>Linguistic Chart & Infographic</span>
              </h4>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://.../grammar_matrix.png"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Caption / Pedagogical Explanation
                </label>
                <input
                  type="text"
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                  placeholder="Matrix breakdown illustrating CEFR verb tense progression..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>
            </div>
          )}

          {/* 6. EXTERNAL RESOURCE */}
          {type === 'external_resource' && (
            <div className="space-y-3 pt-3 border-t border-slate-100 bg-blue-50/40 p-4 rounded-xl border border-blue-100">
              <h4 className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                <ExternalLink className="w-4 h-4 text-blue-600" />
                <span>External Pedagogical Resource</span>
              </h4>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Destination URL
                </label>
                <input
                  type="url"
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Resource Context & Purpose
                </label>
                <input
                  type="text"
                  value={externalDesc}
                  onChange={(e) => setExternalDesc(e.target.value)}
                  placeholder="e.g., Cambridge English Dictionary online phonetic transcription generator"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
            </div>
          )}

          {/* 7. QUIZ */}
          {type === 'quiz' && (
            <div className="space-y-4 pt-3 border-t border-slate-100 bg-indigo-50/40 p-4 rounded-xl border border-indigo-100">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-indigo-600" />
                  <span>Interactive Quiz Builder</span>
                </h4>
                <div className="flex items-center gap-1 text-xs text-indigo-800">
                  <span>Passing Score:</span>
                  <input
                    type="number"
                    min={10}
                    max={100}
                    value={quizPassingScore}
                    onChange={(e) => setQuizPassingScore(parseInt(e.target.value, 10) || 75)}
                    className="w-14 px-2 py-0.5 rounded border border-indigo-200 text-xs bg-white text-center font-bold"
                  />
                  <span>%</span>
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-3">
                {quizQuestions.map((q, qIdx) => (
                  <div
                    key={q.id || qIdx}
                    className="p-3 bg-white rounded-xl border border-indigo-100 space-y-2.5 shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-indigo-600">Question {qIdx + 1}</span>
                      {quizQuestions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(qIdx)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <input
                      type="text"
                      value={q.question}
                      onChange={(e) => handleUpdateQuestion(qIdx, 'question', e.target.value)}
                      placeholder="Type the question prompt..."
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 font-medium"
                    />

                    {/* Options */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        Options (Mark correct answer radio):
                      </span>
                      {q.options.map((opt, optIdx) => (
                        <div key={optIdx} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`correct_${qIdx}`}
                            checked={q.correctOptionIndex === optIdx}
                            onChange={() => handleUpdateQuestion(qIdx, 'correctOptionIndex', optIdx)}
                            className="text-indigo-600 focus:ring-indigo-500"
                          />
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => handleUpdateOption(qIdx, optIdx, e.target.value)}
                            placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                            className="flex-1 px-2.5 py-1 text-xs rounded-lg border border-slate-200 bg-white"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Explanation */}
                    <div>
                      <input
                        type="text"
                        value={q.explanation || ''}
                        onChange={(e) => handleUpdateQuestion(qIdx, 'explanation', e.target.value)}
                        placeholder="Pedagogical explanation for correct answer..."
                        className="w-full px-2.5 py-1 text-[11px] rounded-lg border border-slate-200 text-slate-600"
                      />
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="w-full py-2 rounded-xl border border-dashed border-indigo-300 text-indigo-600 hover:bg-indigo-50 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Another Question</span>
                </button>
              </div>
            </div>
          )}

          {/* 8. ASSIGNMENT */}
          {type === 'assignment' && (
            <div className="space-y-3 pt-3 border-t border-slate-100 bg-rose-50/40 p-4 rounded-xl border border-rose-100">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                  <FileCheck2 className="w-4 h-4 text-rose-600" />
                  <span>Writing Assignment Configuration</span>
                </h4>
                <div className="flex items-center gap-1 text-xs text-rose-800">
                  <span>Max Score:</span>
                  <input
                    type="number"
                    min={10}
                    value={assignmentMaxScore}
                    onChange={(e) => setAssignmentMaxScore(parseInt(e.target.value, 10) || 100)}
                    className="w-14 px-2 py-0.5 rounded border border-rose-200 text-xs bg-white text-center font-bold"
                  />
                  <span>pts</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Essay / Writing Assignment Prompt *
                </label>
                <textarea
                  rows={4}
                  value={assignmentPrompt}
                  onChange={(e) => setAssignmentPrompt(e.target.value)}
                  placeholder="Task prompt details, scenario instructions, minimum word count..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Grading Rubric & Criteria
                </label>
                <input
                  type="text"
                  value={assignmentRubric}
                  onChange={(e) => setAssignmentRubric(e.target.value)}
                  placeholder="Task Response (25%), Coherence (25%), Lexical Resource (25%), Grammar (25%)"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition disabled:opacity-50"
            >
              {saving ? 'Saving...' : initialMaterial ? 'Update Material' : 'Save Material'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
