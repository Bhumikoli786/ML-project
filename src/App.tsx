
import { useState, useEffect, useMemo } from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  ScatterChart, Scatter, ZAxis
} from 'recharts';
import { 
  GraduationCap, BookOpen, Users, TrendingUp, 
  Play, RefreshCw, Info, Moon, Award,
  Lightbulb, CheckCircle, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  parseCSV, trainTestSplit, trainLinearRegression, 
  trainKNN, trainDecisionTree, trainRandomForest, 
  DataPoint, ModelResult 
} from './ml-logic';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Raw CSV data (Mapped from user input)
const CSV_DATA = `Hours_Studied,Attendance,Access_to_Resources,Sleep_Hours,Previous_Scores,Exam_Score
23,84,High,7,73,67
19,64,Medium,8,59,61
24,98,Medium,7,91,74
29,89,Medium,8,98,71
19,92,Medium,6,65,70
19,88,Medium,8,89,71
29,84,Low,7,68,67
25,78,High,6,50,66
17,94,High,6,80,69
23,98,Medium,8,71,72
17,80,High,8,88,68
17,97,High,6,87,71
21,83,Medium,8,97,70
9,82,Medium,8,72,66
10,78,High,8,74,65
17,68,Medium,8,70,64
14,60,Low,10,65,60
22,70,Medium,6,82,65
15,80,Medium,9,91,67
12,75,High,7,58,66
29,78,Medium,5,99,69
19,99,High,6,84,72
20,74,High,8,89,66
11,78,Medium,8,100,66
17,65,High,5,75,63
21,62,Low,6,54,64
13,91,Medium,6,90,65
22,83,High,6,94,71
16,90,Medium,4,58,66
18,66,High,4,51,64
16,83,Medium,6,57,63
31,70,High,7,66,69
20,69,Medium,8,96,67
14,60,Medium,5,50,61
25,65,Medium,5,90,68
13,72,Medium,6,93,61
21,65,Low,7,91,64
8,99,Medium,9,54,67
12,72,Medium,8,84,63
21,65,Medium,6,98,64
24,68,Medium,8,56,67
21,84,Medium,6,52,65
19,63,High,7,94,64
18,94,High,7,82,70
11,98,Medium,9,82,68
16,70,Medium,8,98,65
17,78,Medium,6,88,68
26,61,Low,6,70,64
22,86,Medium,7,72,68
9,77,Medium,5,57,63
22,71,Medium,7,65,64
18,68,Medium,7,72,64
16,86,Medium,8,63,67
24,77,Low,8,96,67
26,67,High,7,51,66
26,88,High,5,79,72
15,83,High,5,89,65
18,94,Medium,6,87,71
22,65,Low,8,82,66
26,91,Low,8,71,68
17,87,Medium,7,96,70
19,65,Medium,10,66,62
13,88,High,9,88,68
13,78,High,9,96,67
25,98,High,8,56,71
28,66,High,8,97,68
20,86,Medium,8,89,69
26,75,High,4,81,70
22,98,High,5,69,69
16,73,Medium,7,95,65
22,98,Low,7,52,70
29,96,Low,7,72,71
20,71,Medium,7,88,65
29,92,Medium,4,91,72
4,100,High,8,60,69
25,70,Medium,7,52,66
21,77,Medium,7,90,68
18,81,Low,8,71,65
21,72,Medium,5,57,64
8,61,Medium,7,54,60
19,69,High,7,82,65
22,71,Medium,6,79,66
29,78,High,4,93,74
17,67,Medium,5,52,62
15,95,Medium,7,93,70
17,88,High,7,94,69
25,63,High,7,72,67
22,86,Low,6,54,64
17,86,High,5,97,71
23,98,Low,7,54,68
21,60,Medium,7,80,64
26,70,Low,8,75,63
16,97,Medium,6,92,71
18,97,Medium,4,75,69
18,89,Medium,4,73,100
11,91,Medium,6,94,68
22,64,Medium,7,98,62
22,81,Medium,7,77,68
20,69,High,6,73,66
19,67,Medium,5,92,64
12,92,Medium,4,92,67
17,65,High,8,66,65
18,79,Medium,7,79,65
15,98,Medium,6,58,69
19,67,Medium,5,82,63
22,99,Low,6,92,72
31,100,Medium,7,59,76
21,82,High,7,66,69
22,67,Medium,7,72,67
20,73,Medium,9,92,69
8,77,Medium,6,87,63
20,72,Medium,9,66,67
20,71,High,7,62,66
35,99,High,7,85,79
19,66,Medium,8,74,64
22,89,High,6,80,73
20,60,High,7,82,63
13,84,Medium,5,78,65
27,97,High,8,81,73
25,72,High,8,94,70
25,67,Medium,9,93,68
15,86,Medium,7,57,65
28,89,High,9,79,71
12,88,Medium,6,72,64
24,73,High,8,64,68
33,70,Medium,6,82,69
14,98,Medium,7,76,69
17,97,Medium,8,89,69
21,78,Medium,10,55,67
17,94,Medium,8,65,68
11,78,High,8,51,64
20,77,Medium,6,87,66
14,66,Low,7,96,63
23,77,Medium,7,79,66
14,81,Medium,9,81,66
29,61,High,7,52,67
15,78,High,9,75,65
18,91,Medium,5,76,68
25,87,Low,9,52,68
13,85,Medium,6,89,65
21,96,Medium,8,64,71
28,61,High,6,86,65
10,82,Low,8,70,64
21,91,Medium,6,100,72
22,82,Medium,9,61,65
25,73,High,8,53,66
13,65,High,6,99,61
12,96,High,8,62,68
23,79,High,8,82,69
22,95,High,6,69,72
22,83,High,5,82,71
22,87,High,5,80,70
16,92,High,5,85,68
21,86,Medium,5,51,67
22,76,Medium,8,92,68
16,81,Medium,8,74,68
31,92,Medium,4,76,72
23,75,High,6,71,65
13,76,High,5,99,66
24,64,Medium,8,90,65
14,97,Medium,6,66,67
25,64,High,5,89,66
27,86,Medium,7,72,69
15,77,Medium,8,94,66
26,76,High,6,52,69
22,87,Low,7,68,67
25,63,Medium,6,71,66
31,84,Medium,9,87,71
19,91,Low,6,59,70
15,93,Medium,6,64,71
15,67,Medium,7,86,66
15,96,Medium,7,54,67
20,86,Low,8,60,66
22,95,High,9,88,72
22,79,Medium,9,94,68
25,82,Medium,6,86,69
20,97,Medium,7,76,71
29,96,Medium,9,55,70
18,78,Medium,9,91,67
36,71,Medium,6,56,69
24,76,High,8,69,65
15,76,High,8,53,65
14,71,Medium,8,85,64
23,71,Low,9,75,63
19,94,Medium,5,95,69
24,63,Low,6,57,64
23,87,High,8,91,72
20,67,Medium,7,76,63
15,74,High,4,68,64
11,62,High,5,82,64
17,71,Medium,8,90,67
25,91,Medium,8,72,71
21,95,Medium,5,62,70
13,69,Low,9,96,61
21,79,High,7,66,67
22,79,Medium,5,100,72
15,95,Low,6,88,66
21,91,High,5,84,70
20,81,Medium,6,51,67
13,87,Low,4,72,67
22,94,Medium,7,75,71
40,100,High,9,100,100
38,98,High,8,99,99
35,95,High,7,98,98
32,100,High,8,100,99`;

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [dataset, setDataset] = useState<DataPoint[]>([]);
  const [models, setModels] = useState<ModelResult[]>([]);
  const [bestModel, setBestModel] = useState<ModelResult | null>(null);
  const [studyHours, setStudyHours] = useState(5);
  const [sleepHours, setSleepHours] = useState(7);
  const [attendance, setAttendance] = useState(75);
  const [accessToResources, setAccessToResources] = useState(0.5); // 1, 0.5, 0
  const [previousScores, setPreviousScores] = useState(70);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [isTraining, setIsTraining] = useState(false);

  // Initialize data and train models
  const trainAll = () => {
    setIsTraining(true);
    setTimeout(() => {
      const data = parseCSV(CSV_DATA);
      const { train, test } = trainTestSplit(data);
      
      const lr = trainLinearRegression(train, test);
      const knn = trainKNN(train, test);
      const dt = trainDecisionTree(train, test);
      const rf = trainRandomForest(train, test);
      
      const allModels = [lr, knn, dt, rf];
      setDataset(data);
      setModels(allModels);
      
      // Best model based on R2 score
      const best = [...allModels].sort((a, b) => b.metrics.r2 - a.metrics.r2)[0];
      setBestModel(best);
      setIsTraining(false);
    }, 800);
  };

  useEffect(() => {
    trainAll();
  }, []);

  const handlePredict = () => {
    if (bestModel) {
      const result = bestModel.predict(studyHours, attendance, accessToResources, sleepHours, previousScores);
      setPrediction(parseFloat(result.toFixed(2)));
    }
  };

  const chartData = useMemo(() => {
    return dataset.map((d, i) => ({
      x: d.studyHours,
      y: d.marks,
      z: d.attendance,
      id: `S${(i + 1).toString().padStart(3, '0')}`
    }));
  }, [dataset]);

  const getAcademicPerformance = (marks: number) => {
    if (marks >= 85) return { 
      label: 'Excellent', 
      color: 'text-emerald-600 bg-emerald-50',
      tips: [
        'Maintain your consistent study schedule.',
        'Consider mentoring peers to deepen your understanding.',
        'Explore advanced topics beyond the curriculum for enrichment.'
      ]
    };
    if (marks >= 70) return { 
      label: 'Good', 
      color: 'text-blue-600 bg-blue-50',
      tips: [
        'Focus on specific weak areas in your previous scores.',
        'Increase daily study hours by 15-30 minutes for higher precision.',
        'Practice with more mock tests to improve exam time management.'
      ]
    };
    if (marks >= 50) return { 
      label: 'Average', 
      color: 'text-amber-600 bg-amber-50',
      tips: [
        'Prioritize attendance to ensure you don\'t miss core concepts.',
        'Create a dedicated study environment free from distractions.',
        'Set specific, small goals for each study session to track progress.'
      ]
    };
    return { 
      label: 'Needs Improvement', 
      color: 'text-rose-600 bg-rose-50',
      tips: [
        'Focus heavily on improving attendance to at least 90%.',
        'Seek help from teachers or tutors for foundational concepts.',
        'Ensure 7-8 hours of sleep to improve cognitive retention and focus.'
      ]
    };
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">MarksPredict AI</h1>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">SDG 4: Quality Education</p>
            </div>
          </div>
          <button 
            onClick={trainAll}
            disabled={isTraining}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-sm font-medium transition-colors disabled:opacity-50"
          >
            <RefreshCw className={cn("w-4 h-4", isTraining && "animate-spin")} />
            Retrain Models
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Intro Section */}
        <section className="mb-12">
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-200">
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-3xl font-bold mb-4">Empowering Quality Education through Data</h2>
              <p className="text-indigo-100 text-lg mb-6 leading-relaxed">
                This project demonstrates how Machine Learning can predict student performance using features like study hours, sleep, and attendance. 
                Aligned with SDG Goal 4, we aim to ensure inclusive and equitable quality education.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                  <div className="text-2xl font-bold">{dataset.length}</div>
                  <div className="text-xs text-indigo-200 uppercase tracking-wide">Student Records</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                  <div className="text-2xl font-bold">4</div>
                  <div className="text-xs text-indigo-200 uppercase tracking-wide">ML Algorithms</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                  <div className="text-2xl font-bold">80/20</div>
                  <div className="text-xs text-indigo-200 uppercase tracking-wide">Train/Test Split</div>
                </div>
              </div>
            </div>
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
              <GraduationCap className="w-96 h-96 -mr-20 -mb-20" />
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Visualization */}
          <div className="lg:col-span-2 space-y-8">
            {/* Scatter Plot */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Dataset Visualization</h3>
                  <p className="text-sm text-slate-500">Study Hours vs. Exam Score (Color by Attendance)</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                  <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                  <span>High Attendance</span>
                </div>
              </div>
              <div className="h-[500px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis 
                      type="number" 
                      dataKey="x" 
                      name="Study Hours" 
                      unit="h" 
                      label={{ value: 'Study Hours', position: 'bottom', offset: 0 }}
                    />
                    <YAxis 
                      type="number" 
                      dataKey="y" 
                      name="Exam Score" 
                      unit="pts" 
                      label={{ value: 'Exam Score', angle: -90, position: 'insideLeft' }}
                    />
                    <ZAxis type="number" dataKey="z" range={[50, 400]} name="Attendance" unit="%" />
                    <Tooltip 
                      cursor={{ strokeDasharray: '3 3' }} 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white p-3 rounded-xl shadow-xl border border-slate-100">
                              <p className="text-xs font-bold text-indigo-600 mb-1">Student: {data.id}</p>
                              <p className="text-xs text-slate-600">Study: {data.x}h</p>
                              <p className="text-xs text-slate-600">Score: {data.y}</p>
                              <p className="text-xs text-slate-600">Attendance: {data.z}%</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Scatter name="Students" data={chartData} fill="#6366f1" fillOpacity={0.6} />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recommendations Section */}
            <AnimatePresence>
              {prediction !== null && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                      <Lightbulb className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">Study Tips & Recommendations</h3>
                      <p className="text-sm text-slate-500">Personalized steps to improve your academic journey</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      {getAcademicPerformance(prediction).tips?.map((tip: string, idx: number) => (
                        <div key={idx} className="flex gap-3 items-start p-4 rounded-2xl bg-slate-50 border border-slate-100">
                          <div className="mt-1">
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                          </div>
                          <p className="text-sm text-slate-700 leading-relaxed font-medium">{tip}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-indigo-50 rounded-2xl p-6 flex flex-col justify-center border border-indigo-100 relative overflow-hidden">
                      <div className="relative z-10">
                        <div className="flex items-center gap-2 text-indigo-700 font-bold mb-3 uppercase tracking-wider text-xs">
                          <ArrowRight className="w-4 h-4" />
                          Impact Analysis
                        </div>
                        <p className="text-indigo-900 font-semibold mb-2">
                          Following these steps could potentially improve your final results by up to 15-20%.
                        </p>
                        <p className="text-indigo-600 text-sm">
                          Consistent application of these personalized strategies is the key to unlocking higher academic potential.
                        </p>
                      </div>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-200/20 blur-3xl rounded-full -mr-16 -mt-16"></div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: Prediction System */}
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200 sticky top-24">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Predict Performance</h3>
              </div>

              <div className="space-y-6">
                {/* Study Hours Slider */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-slate-400" />
                      Study Hours
                    </label>
                    <span className="px-3 py-1 bg-slate-100 rounded-full text-sm font-bold text-indigo-600">
                      {studyHours}h
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="40" 
                    step="0.1"
                    value={studyHours}
                    onChange={(e) => setStudyHours(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>

                {/* Sleep Hours Slider */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <Moon className="w-4 h-4 text-slate-400" />
                      Sleep Hours
                    </label>
                    <span className="px-3 py-1 bg-slate-100 rounded-full text-sm font-bold text-indigo-600">
                      {sleepHours}h
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="12" 
                    step="0.1"
                    value={sleepHours}
                    onChange={(e) => setSleepHours(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>

                {/* Attendance Slider */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <Users className="w-4 h-4 text-slate-400" />
                      Attendance
                    </label>
                    <span className="px-3 py-1 bg-slate-100 rounded-full text-sm font-bold text-indigo-600">
                      {attendance}%
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    step="1"
                    value={attendance}
                    onChange={(e) => setAttendance(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>

                {/* Access to Resources Slider */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <Info className="w-4 h-4 text-slate-400" />
                      Access to Resources
                    </label>
                    <span className="px-3 py-1 bg-slate-100 rounded-full text-sm font-bold text-indigo-600">
                      {accessToResources === 1 ? 'High' : accessToResources === 0.5 ? 'Medium' : 'Low'}
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.5"
                    value={accessToResources}
                    onChange={(e) => setAccessToResources(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>

                {/* Previous Scores Slider */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <Award className="w-4 h-4 text-slate-400" />
                      Previous Scores
                    </label>
                    <span className="px-3 py-1 bg-slate-100 rounded-full text-sm font-bold text-indigo-600">
                      {previousScores}
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    step="1"
                    value={previousScores}
                    onChange={(e) => setPreviousScores(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>

                <button 
                  onClick={handlePredict}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5 fill-current" />
                  Predict Score
                </button>

                {/* Prediction Result */}
                <AnimatePresence mode="wait">
                  {prediction !== null && (
                    <motion.div 
                      key={prediction}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="mt-8 p-6 bg-slate-900 rounded-3xl text-center relative overflow-hidden"
                    >
                      <div className="relative z-10">
                        <p className="text-slate-400 text-sm font-medium mb-1">Predicted Exam Score</p>
                        <div className="text-5xl font-black text-white mb-2">
                          {prediction}
                        </div>
                        {(() => {
                          const perf = getAcademicPerformance(prediction);
                          return (
                            <div className={cn("inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3", perf.color)}>
                              {perf.label}
                            </div>
                          );
                        })()}
                        <div className="block text-[10px] text-slate-500 uppercase tracking-widest">
                          Using {bestModel?.name}
                        </div>
                      </div>
                      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/20 blur-3xl rounded-full -mr-12 -mt-12"></div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Model Performance Comparison */}
                {models.length > 0 && (
                  <div className="mt-8">
                    <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-indigo-600" />
                      Model Comparison
                    </h4>
                    <div className="space-y-2">
                      {models.sort((a,b) => b.metrics.r2 - a.metrics.r2).map((m) => (
                        <div key={m.name} className={cn(
                          "p-3 rounded-xl border flex items-center justify-between transition-all",
                          m.name === bestModel?.name 
                            ? "bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200" 
                            : "bg-white border-slate-100"
                        )}>
                          <div>
                            <div className="text-xs font-bold text-slate-800">{m.name}</div>
                            <div className="text-[10px] text-slate-500">R² Score: {(m.metrics.r2 * 100).toFixed(2)}%</div>
                          </div>
                          {m.name === bestModel?.name && (
                            <div className="bg-indigo-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">
                              Best
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2 opacity-50">
              <GraduationCap className="w-6 h-6" />
              <span className="font-bold text-lg">MarksPredict AI</span>
            </div>
            <div className="flex gap-8 text-sm font-medium text-slate-500">
              <a href="#" className="hover:text-indigo-600 transition-colors">Methodology</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">SDG 4 Goals</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">Documentation</a>
            </div>
            <p className="text-slate-400 text-xs">
              Built for Quality Education (SDG 4) • 2026
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
