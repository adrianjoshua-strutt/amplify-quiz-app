import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Plus, Edit3, Trash2, Wand2, RefreshCw, Save, X } from 'lucide-react';
import { client } from '../lib/amplify';
import { useAuth } from '../contexts/AuthContext';
import type { Schema } from '../lib/amplify';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

interface QuestionForm {
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  categoryId: string;
  points: number;
}

export default function AdminPage() {
  const [categories, setCategories] = useState<Schema['QuestionCategory']['type'][]>([]);
  const [questions, setQuestions] = useState<Schema['Question']['type'][]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Schema['Question']['type'] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { userProfile } = useAuth();

  const [questionForm, setQuestionForm] = useState<QuestionForm>({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    difficulty: 'MEDIUM',
    categoryId: '',
    points: 200,
  });

  useEffect(() => {
    if (userProfile?.isAdmin) {
      loadAdminData();
    }
  }, [userProfile]);

  const loadAdminData = async () => {
    try {
      const [categoriesResult, questionsResult] = await Promise.all([
        client.models.QuestionCategory.list(),
        client.models.Question.list(),
      ]);
      
      setCategories(categoriesResult.data);
      setQuestions(questionsResult.data);
      
      if (categoriesResult.data.length > 0 && !questionForm.categoryId) {
        setQuestionForm(prev => ({ ...prev, categoryId: categoriesResult.data[0].id }));
      }
    } catch (error) {
      console.error('Error loading admin data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!questionForm.question.trim() || questionForm.options.some(opt => !opt.trim())) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      if (editingQuestion) {
        await client.models.Question.update({
          id: editingQuestion.id,
          ...questionForm,
        });
        toast.success('Question updated successfully');
      } else {
        await client.models.Question.create(questionForm);
        toast.success('Question created successfully');
      }
      
      resetForm();
      loadAdminData();
    } catch (error) {
      console.error('Error saving question:', error);
      toast.error('Failed to save question');
    }
  };

  const handleEditQuestion = (question: Schema['Question']['type']) => {
    setEditingQuestion(question);
    setQuestionForm({
      question: question.question,
      options: question.options,
      correctAnswer: question.correctAnswer,
      difficulty: question.difficulty as 'EASY' | 'MEDIUM' | 'HARD',
      categoryId: question.categoryId || '',
      points: question.points || 200,
    });
    setShowQuestionForm(true);
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    
    try {
      await client.models.Question.delete({ id: questionId });
      toast.success('Question deleted successfully');
      loadAdminData();
    } catch (error) {
      console.error('Error deleting question:', error);
      toast.error('Failed to delete question');
    }
  };

  const generateQuestionsWithAI = async () => {
    if (!questionForm.categoryId) {
      toast.error('Please select a category first');
      return;
    }

    setIsGenerating(true);
    try {
      const category = categories.find(c => c.id === questionForm.categoryId);
      const prompt = `Generate 5 ${questionForm.difficulty.toLowerCase()} difficulty quiz questions about ${category?.name || 'general knowledge'}. Make them engaging and accurate.`;
      
      const { data } = await client.generations.generateQuestions({
        prompt,
      });

      if (data?.questions) {
        // Parse and create questions
        const generatedQuestions = JSON.parse(data.questions);
        
        for (const q of generatedQuestions.questions) {
          await client.models.Question.create({
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
            difficulty: questionForm.difficulty,
            categoryId: questionForm.categoryId,
            points: q.points || (questionForm.difficulty === 'EASY' ? 100 : questionForm.difficulty === 'MEDIUM' ? 200 : 300),
            isActive: true,
          });
        }
        
        toast.success(`Generated ${generatedQuestions.questions.length} questions successfully!`);
        loadAdminData();
      }
    } catch (error) {
      console.error('Error generating questions:', error);
      toast.error('Failed to generate questions with AI');
    } finally {
      setIsGenerating(false);
    }
  };

  const resetForm = () => {
    setQuestionForm({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      difficulty: 'MEDIUM',
      categoryId: categories.length > 0 ? categories[0].id : '',
      points: 200,
    });
    setEditingQuestion(null);
    setShowQuestionForm(false);
  };

  if (!userProfile?.isAdmin) {
    return (
      <div className="text-center py-12">
        <Settings className="w-16 h-16 text-white/40 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
        <p className="text-white/70">You don't have admin privileges to access this page.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <p className="text-xl text-white/80">
          Manage questions, categories, and quiz content
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card text-center">
          <div className="text-3xl font-bold text-white">{categories.length}</div>
          <div className="text-white/60">Categories</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-white">{questions.length}</div>
          <div className="text-white/60">Questions</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-white">
            {questions.filter(q => q.isActive).length}
          </div>
          <div className="text-white/60">Active Questions</div>
        </div>
      </div>

      {/* Question Management */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Settings className="w-6 h-6" />
            <span>Question Management</span>
          </h2>
          
          <div className="flex space-x-2">
            <button
              onClick={generateQuestionsWithAI}
              disabled={isGenerating || !questionForm.categoryId}
              className="btn-secondary flex items-center space-x-2"
            >
              {isGenerating ? (
                <LoadingSpinner size="sm" />
              ) : (
                <Wand2 className="w-4 h-4" />
              )}
              <span>Generate with AI</span>
            </button>
            
            <button
              onClick={() => setShowQuestionForm(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Question</span>
            </button>
          </div>
        </div>

        {/* AI Generation Controls */}
        <div className="mb-6 p-4 bg-white/5 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-3">AI Question Generation</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Category</label>
              <select
                value={questionForm.categoryId}
                onChange={(e) => setQuestionForm(prev => ({ ...prev, categoryId: e.target.value }))}
                className="input"
              >
                <option value="">Select category...</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Difficulty</label>
              <select
                value={questionForm.difficulty}
                onChange={(e) => setQuestionForm(prev => ({ ...prev, difficulty: e.target.value as 'EASY' | 'MEDIUM' | 'HARD' }))}
                className="input"
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={generateQuestionsWithAI}
                disabled={isGenerating || !questionForm.categoryId}
                className="btn-primary w-full flex items-center justify-center space-x-2"
              >
                {isGenerating ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <Wand2 className="w-4 h-4" />
                )}
                <span>Generate 5 Questions</span>
              </button>
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-3">
          {questions.map((question) => (
            <div key={question.id} className="p-4 bg-white/5 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-2">{question.question}</h3>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {question.options.map((option, index) => (
                      <div
                        key={index}
                        className={`p-2 rounded text-sm ${
                          index === question.correctAnswer
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-white/5 text-white/70'
                        }`}
                      >
                        {String.fromCharCode(65 + index)}. {option}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-white/60">
                    <span>Difficulty: {question.difficulty}</span>
                    <span>Points: {question.points}</span>
                    <span>Category: {categories.find(c => c.id === question.categoryId)?.name}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleEditQuestion(question)}
                    className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteQuestion(question.id)}
                    className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Question Form Modal */}
      {showQuestionForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={resetForm} />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-2xl card max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editingQuestion ? 'Edit Question' : 'Add New Question'}
              </h2>
              <button onClick={resetForm} className="p-2 text-white/70 hover:text-white rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleQuestionSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Question</label>
                <textarea
                  value={questionForm.question}
                  onChange={(e) => setQuestionForm(prev => ({ ...prev, question: e.target.value }))}
                  placeholder="Enter your question..."
                  className="input min-h-[80px] resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Answer Options</label>
                <div className="space-y-2">
                  {questionForm.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={questionForm.correctAnswer === index}
                        onChange={() => setQuestionForm(prev => ({ ...prev, correctAnswer: index }))}
                        className="text-primary-600"
                      />
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...questionForm.options];
                          newOptions[index] = e.target.value;
                          setQuestionForm(prev => ({ ...prev, options: newOptions }));
                        }}
                        placeholder={`Option ${String.fromCharCode(65 + index)}`}
                        className="input flex-1"
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Category</label>
                  <select
                    value={questionForm.categoryId}
                    onChange={(e) => setQuestionForm(prev => ({ ...prev, categoryId: e.target.value }))}
                    className="input"
                    required
                  >
                    <option value="">Select category...</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Difficulty</label>
                  <select
                    value={questionForm.difficulty}
                    onChange={(e) => setQuestionForm(prev => ({ ...prev, difficulty: e.target.value as 'EASY' | 'MEDIUM' | 'HARD' }))}
                    className="input"
                  >
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Points</label>
                  <input
                    type="number"
                    value={questionForm.points}
                    onChange={(e) => setQuestionForm(prev => ({ ...prev, points: Number(e.target.value) }))}
                    min="50"
                    max="500"
                    step="50"
                    className="input"
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button type="button" onClick={resetForm} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1 flex items-center justify-center space-x-2">
                  <Save className="w-4 h-4" />
                  <span>{editingQuestion ? 'Update' : 'Create'} Question</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}