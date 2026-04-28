import React, { useState, useMemo } from 'react';
import { 
  ChevronRight, 
  ChevronDown, 
  ClipboardCheck, 
  ShieldCheck, 
  BookOpen, 
  Settings, 
  Workflow, 
  AlertCircle,
  Search,
  MessageSquare,
  Send,
  Loader2,
  Menu,
  X,
  FileText,
  User,
  Clock,
  Wrench,
  CheckCircle2,
  Key,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PLAYBOOK_DATA } from './data/playbook';
import { Group, Section, Task } from './types';
import { askPlaybot } from './services/aiService';

export default function App() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('gemini_api_key'));

  const handleLogin = (key: string) => {
    localStorage.setItem('gemini_api_key', key);
    setApiKey(key);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('gemini_api_key');
    setApiKey('');
    setIsLoggedIn(false);
  };

  const [selectedGroup, setSelectedGroup] = useState<Group | null>(PLAYBOOK_DATA.groups[0]);
  const [selectedSection, setSelectedSection] = useState<Section | null>(PLAYBOOK_DATA.groups[0].sections[0]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPlaybotOpen, setIsPlaybotOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'bot'; text: string }[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const filteredGroups = useMemo(() => {
    if (!searchQuery) return PLAYBOOK_DATA.groups;
    return PLAYBOOK_DATA.groups.map(group => ({
      ...group,
      sections: group.sections.map(section => ({
        ...section,
        tasks: section.tasks.filter(task => 
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(section => section.tasks.length > 0)
    })).filter(group => group.sections.length > 0);
  }, [searchQuery]);

  const handleSendChat = async () => {
    if (!chatInput.trim()) return;
    
    const context = `Task đang xem: ${selectedTask?.title || 'Không có task nào đang được chọn'}. ${selectedTask?.description || ''}`;
    const userMsg = chatInput;
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsAiLoading(true);

    const response = await askPlaybot(userMsg, context, apiKey);
    setChatHistory(prev => [...prev, { role: 'bot', text: response }]);
    setIsAiLoading(false);
  };

  const [isTaskGenOpen, setIsTaskGenOpen] = useState(false);
  const [taskGenData, setTaskGenData] = useState({ stage: '', section: '', taskName: '' });
  const [genResult, setGenResult] = useState('');
  const [isGenLoading, setIsGenLoading] = useState(false);

  const handleGenerateDocument = async () => {
    if (!taskGenData.stage || !taskGenData.section || !taskGenData.taskName) return;
    setIsGenLoading(true);
    const prompt = `Hãy soạn thảo một văn bản hành chính (Administrative Document) cho công tác sau:
    - Giai đoạn: ${taskGenData.stage}
    - Mục/Hạng mục: ${taskGenData.section}
    - Tên công tác: ${taskGenData.taskName}
    
    Yêu cầu:
    1. Định dạng văn bản hành chính chuyên nghiệp (Quốc hiệu, Tiêu ngữ, Tên văn bản, Nội dung, Các bên ký...).
    2. Nội dung phải phù hợp với tính chất của Mục/Hạng mục đã chọn.
    3. Ngôn ngữ kỹ thuật chính xác, tuân thủ Nghị định 06.`;
    
    const response = await askPlaybot(prompt, "Sáng tạo văn bản hành chính mới", apiKey);
    setGenResult(response);
    setIsGenLoading(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-800">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-sky-50 border border-sky-100 rounded-2xl flex items-center justify-center shadow-sm">
              <Key className="w-8 h-8 text-sky-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center text-slate-900 mb-2">QMS Playbook Pro</h1>
          <p className="text-center text-slate-500 text-sm mb-8">Vui lòng cung cấp Gemini API Key để tiếp tục</p>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const key = fd.get('apiKey') as string;
            if (key) {
              handleLogin(key);
            }
          }} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-widest mb-2">Google Gemini API Key</label>
              <input type="password" name="apiKey" required placeholder="AIzaSy..." className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all outline-none" />
            </div>
            <button type="submit" className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-md hover:bg-black transition-all">
              Xác Nhận & Đăng Nhập
            </button>
          </form>
          <p className="text-center text-[11px] text-slate-400 mt-6 leading-relaxed">
            API Key của bạn được lưu trữ an toàn ngay trên trình duyệt (localStorage).
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">
      {/* Sidebar Navigation */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside 
            initial={{ x: -260, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -260, opacity: 0 }}
            className="w-64 bg-slate-900 text-slate-300 flex flex-col z-20"
          >
            <div className="p-6 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <h1 className="text-white font-bold text-xl tracking-tight">QMS Playbook</h1>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">Hệ thống quản lý chất lượng</p>
                </div>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="lg:hidden p-1.5 hover:bg-slate-800 rounded-lg"
                >
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>
            </div>

            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                <input 
                  type="text"
                  placeholder="Tìm kiếm task..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-800 border-none rounded-lg text-xs focus:ring-1 focus:ring-sky-500 transition-all text-slate-200 placeholder:text-slate-600"
                />
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 pb-10 space-y-1 custom-scrollbar">
              <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Giai đoạn dự án</div>
              {filteredGroups.map(group => (
                <div key={group.id} className="space-y-0.5">
                  <div 
                    onClick={() => {
                      setSelectedGroup(group);
                      setSelectedSection(null);
                      setSelectedTask(null);
                    }}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg cursor-pointer transition-all group ${selectedGroup?.id === group.id ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/50'}`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${selectedGroup?.id === group.id ? 'bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.6)]' : 'bg-slate-600 group-hover:bg-slate-400'}`}></div>
                    <span className="text-sm font-medium truncate">{group.title.split(':')[0]}</span>
                    {selectedGroup?.id === group.id ? <ChevronDown className="ml-auto w-3.5 h-3.5 text-slate-500" /> : <ChevronRight className="ml-auto w-3.5 h-3.5 text-slate-600" />}
                  </div>
                  
                  {selectedGroup?.id === group.id && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="pl-4 space-y-0.5"
                    >
                      {group.sections.map(section => (
                        <div key={section.id}>
                          <div 
                            onClick={() => {
                              setSelectedSection(section);
                              setSelectedTask(null);
                            }}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-[12px] transition-colors ${selectedSection?.id === section.id ? 'text-sky-400 font-bold bg-sky-900/20' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/30'}`}
                          >
                            <Workflow className="w-3 h-3 shrink-0" />
                            <span className="truncate">{section.title}</span>
                          </div>

                          {selectedSection?.id === section.id && (
                            <div className="pl-5 mt-1 space-y-0.5">
                              {section.tasks.map(task => (
                                <div 
                                  key={task.id}
                                  onClick={() => setSelectedTask(task)}
                                  className={`px-3 py-1.5 rounded-md cursor-pointer text-[11px] transition-all border-l-2 ${selectedTask?.id === task.id ? 'border-sky-500 text-sky-400 bg-sky-500/5 font-bold' : 'border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700'}`}
                                >
                                  {task.title}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>
              ))}
            </nav>

            <div className="p-4 border-t border-slate-800 bg-slate-950">
              <div className="flex items-center justify-between text-[10px] mb-3 uppercase tracking-widest font-bold">
                <span className="text-slate-500">AI Playbots Status</span>
                <span className="text-emerald-400">Online</span>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-sky-500"></div>
                  Bot Pháp lý (Luật 135/2025)
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-sky-500"></div>
                  Bot Checklist Auto-Gen
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                Đăng Xuất API Key
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col min-w-0 relative h-full">
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            <div className="flex items-center gap-3 text-sm">
              <span className="text-slate-400 font-medium">{selectedGroup?.title.split(':')[0] || 'Giai đoạn'}</span>
              <span className="text-slate-300">/</span>
              <span className="text-slate-800 font-bold">{selectedSection?.title || 'Hạng mục'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsPlaybotOpen(!isPlaybotOpen)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${isPlaybotOpen ? 'bg-sky-600 text-white shadow-lg shadow-sky-200' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'}`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>AI PLAYBOT</span>
            </button>
            <div className="h-6 w-[1px] bg-slate-200 mx-1"></div>
            <button 
              onClick={() => setIsTaskGenOpen(true)}
              className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-black transition-all shadow-sm"
            >
              Tạo Task mới
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-slate-50">
          <AnimatePresence mode="wait">
            {selectedTask ? (
              <motion.div 
                key={selectedTask.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-6xl mx-auto flex gap-6"
              >
                {/* Task Details Side */}
                <div className="flex-1 space-y-6">
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-8 border-b border-slate-100">
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-500 font-mono text-[10px] font-bold">
                          ID: {selectedTask.id}
                        </span>
                        <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Status: In Progress</span>
                        </div>
                      </div>
                      <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
                        {selectedTask.title}
                      </h1>
                      <p className="text-slate-500 text-sm leading-relaxed">
                        {selectedTask.description}
                      </p>
                    </div>
                    
                    <div className="p-8 bg-slate-50/50 flex items-center gap-4 border-b border-slate-100">
                      <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold shadow-sm">!</div>
                      <div>
                        <p className="text-xs font-bold text-emerald-900 uppercase tracking-widest mb-0.5">Phân tích từ Bot Pháp lý</p>
                        <p className="text-[11px] text-emerald-700 font-medium">Task này tuân thủ các quy định mới nhất của Nghị định 06/2021 và Luật 135/2025/QH15.</p>
                      </div>
                    </div>

                    <div className="p-8 space-y-8">
                       {/* Tools & Process */}
                       <div className="space-y-4">
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Hành động & Công cụ</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div className="p-4 bg-sky-50 rounded-xl border border-sky-100">
                              <p className="text-[10px] font-bold text-sky-600 uppercase tracking-widest mb-2">Công cụ thực hiện (Tool)</p>
                              <p className="text-sm font-bold text-sky-900 underline decoration-sky-300 underline-offset-4">{selectedTask.tool}</p>
                           </div>
                           <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Kết quả đầu ra (Output)</p>
                              <p className="text-sm font-semibold text-slate-700 italic">{selectedTask.output}</p>
                           </div>
                        </div>
                      </div>

                      {/* Checklist */}
                      <div className="space-y-4">
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Checklist Kỹ thuật</h3>
                        <div className="grid grid-cols-1 gap-2">
                          {selectedTask.checklist ? selectedTask.checklist.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-100 hover:border-sky-200 transition-all group">
                              <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500" />
                              <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{item}</span>
                            </div>
                          )) : (
                            <div className="p-10 border-2 border-dashed border-slate-100 rounded-xl flex flex-col items-center justify-center text-center">
                              <ClipboardCheck className="w-8 h-8 text-slate-200 mb-2" />
                              <p className="text-xs text-slate-400">Chưa có checklist chi tiết.</p>
                              <button onClick={() => setIsPlaybotOpen(true)} className="mt-2 text-sky-600 text-xs font-bold hover:underline">Tự động tạo bằng AI</button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info Panel */}
                <div className="w-80 shrink-0 space-y-6">
                  <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden flex flex-col">
                    <div className="p-5 border-b border-slate-100 bg-slate-50">
                      <h3 className="text-[10px] font-bold text-sky-600 uppercase tracking-widest mb-1 leading-none">Chi tiết kịch bản</h3>
                      <h2 className="text-sm font-bold text-slate-800 truncate">{selectedTask.title}</h2>
                    </div>
                    <div className="p-6 space-y-6">
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Vai trò (Role)</p>
                        <p className="text-sm font-bold text-slate-900">{selectedTask.role}</p>
                      </div>

                      <div className="space-y-1.5">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Ràng buộc (Constraint)</p>
                        <p className="text-xs font-bold text-rose-600 bg-rose-50 p-3 rounded-lg border border-rose-100 leading-normal">
                          {selectedTask.constraint || 'Không có ràng buộc đặc biệt'}
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Đầu vào (Input)</p>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {selectedTask.input.map((inp, idx) => (
                            <span key={idx} className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded border border-slate-200 uppercase tracking-wide">
                              {inp}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100">
                        <button className="w-full py-3 bg-slate-900 text-white rounded-lg font-bold text-xs hover:bg-black transition-all shadow-sm uppercase tracking-widest">
                          Khai thác Hồ sơ (Prompt5D)
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900 text-white rounded-xl p-6 shadow-xl relative overflow-hidden group">
                    <div className="absolute right-[-20px] top-[-20px] w-24 h-24 bg-sky-600/10 rounded-full blur-2xl group-hover:bg-sky-600/20 transition-all"></div>
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Tài liệu tham khảo</h4>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2 text-xs hover:text-sky-400 cursor-pointer transition-colors">
                        <FileText className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                        <span className="font-medium underline decoration-slate-700 underline-offset-2">Nghị định 06/2021/NĐ-CP</span>
                      </li>
                      <li className="flex items-start gap-2 text-xs hover:text-sky-400 cursor-pointer transition-colors">
                        <FileText className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                        <span className="font-medium underline decoration-slate-700 underline-offset-2">ISO 9001:2015 Mục 8.5</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto"
              >
                <div className="w-20 h-20 bg-white border border-slate-200 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                  <ShieldCheck className="w-10 h-10 text-sky-600" />
                </div>
                <h1 className="text-2xl font-extrabold text-slate-900 mb-2 tracking-tight">QMS Playbook Dashboard</h1>
                <p className="text-slate-500 text-sm leading-relaxed mb-10">
                  Hệ thống quản lý chất lượng được số hóa theo kịch bản hành động. Hãy chọn một task từ danh mục bên trái để bắt đầu.
                </p>
                
                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="bg-white border border-slate-200 p-5 rounded-xl text-left shadow-sm">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                      <div className="w-1 h-1 bg-sky-500 rounded-full"></div> Project
                    </div>
                    <p className="text-sm font-bold text-slate-800">Metro Star v1.2</p>
                  </div>
                  <div className="bg-white border border-slate-200 p-5 rounded-xl text-left shadow-sm">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                      <div className="w-1 h-1 bg-emerald-500 rounded-full"></div> Progress
                    </div>
                    <p className="text-sm font-bold text-emerald-600">74% Completed</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Task Generation Modal */}
      <AnimatePresence>
        {isTaskGenOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsTaskGenOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900">TỔNG HỢP CÔNG TÁC</h3>
                  <p className="text-xs text-slate-500">Tự động khởi tạo văn bản hành chính theo quy trình QMS</p>
                </div>
                <button onClick={() => setIsTaskGenOpen(false)} className="p-2 hover:bg-slate-200 rounded-full"><X className="w-5 h-5 text-slate-400" /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 flex flex-col lg:flex-row gap-8">
                <div className="w-full lg:w-1/3 space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Chọn Giai Đoạn</label>
                      <select 
                        className="w-full p-3 bg-slate-100 rounded-xl border-none text-sm focus:ring-2 focus:ring-sky-500"
                        value={taskGenData.stage}
                        onChange={(e) => {
                          const val = e.target.value;
                          setTaskGenData(prev => ({ ...prev, stage: val, section: '' }));
                        }}
                      >
                        <option value="">-- Chọn giai đoạn --</option>
                        {PLAYBOOK_DATA.groups.map(g => <option key={g.id} value={g.title}>{g.title.split(':')[0]}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Chọn Mục / Hạng Mục</label>
                      <select 
                        className="w-full p-3 bg-slate-100 rounded-xl border-none text-sm focus:ring-2 focus:ring-sky-500"
                        value={taskGenData.section}
                        onChange={(e) => setTaskGenData(prev => ({ ...prev, section: e.target.value }))}
                        disabled={!taskGenData.stage}
                      >
                        <option value="">-- Chọn hạng mục --</option>
                        {PLAYBOOK_DATA.groups.find(g => g.title === taskGenData.stage)?.sections.map(s => <option key={s.id} value={s.title}>{s.title}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Tên Công Tác</label>
                      <input 
                        type="text"
                        placeholder="VD: Kiểm tra cốt thép dầm..."
                        className="w-full p-3 bg-slate-100 rounded-xl border-none text-sm focus:ring-2 focus:ring-sky-500"
                        value={taskGenData.taskName}
                        onChange={(e) => setTaskGenData(prev => ({ ...prev, taskName: e.target.value }))}
                      />
                    </div>
                  </div>
                  <button 
                    onClick={handleGenerateDocument}
                    disabled={isGenLoading || !taskGenData.taskName}
                    className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isGenLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Workflow className="w-5 h-5" />}
                    <span>KHỞI TẠO VĂN BẢN</span>
                  </button>
                </div>

                <div className="flex-1 bg-slate-200/50 rounded-2xl border border-slate-200 p-6 overflow-y-auto custom-scrollbar relative flex justify-center">
                  {genResult ? (
                    <div className="bg-white shadow-xl w-full max-w-[794px] min-h-[1123px] p-12 sm:p-16 border border-slate-200 rounded-sm">
                      <div className="markdown-body">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {genResult}
                        </ReactMarkdown>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                      <FileText className="w-16 h-16 mb-4" />
                      <p className="text-sm font-bold uppercase tracking-widest">Nội dung văn bản hành chính</p>
                      <p className="text-xs px-12">Sau khi nhập thông tin, Playbot sẽ tạo văn bản mẫu tại đây.</p>
                    </div>
                  )}
                  {isGenLoading && <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-sky-600" /></div>}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AI Playbot Drawer */}
      <AnimatePresence>
        {isPlaybotOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPlaybotOpen(false)}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-[2px] z-30"
            />
            <motion.aside 
              initial={{ x: 450 }}
              animate={{ x: 0 }}
              exit={{ x: 450 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white border-l border-slate-200 shadow-2xl z-40 flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="bg-sky-600 p-2 rounded-xl shadow-lg shadow-sky-200">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-tight">AI Playbot</h3>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Active Assistant</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setIsPlaybotOpen(false)}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-white">
                {chatHistory.length === 0 && (
                  <div className="text-center py-10 px-8">
                    <div className="w-16 h-16 bg-sky-50 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-sky-100">
                      <Workflow className="w-8 h-8 text-sky-600" />
                    </div>
                    <p className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-tight">Trợ lý QMS thông minh</p>
                    <p className="text-xs text-slate-500 mb-8 leading-relaxed">
                       Sẵn sàng hỗ trợ kiểm tra pháp lý, tạo checklist và giải đáp các quy định xây dựng.
                    </p>
                    <div className="space-y-2">
                       <button 
                        onClick={() => setChatInput("Tạo Checklist chi tiết cho task này")}
                        className="w-full text-left p-4 rounded-xl border border-slate-100 text-xs font-bold hover:bg-sky-50 hover:border-sky-100 transition-all flex items-center justify-between group"
                       >
                         <span>Checklist cho task này</span>
                         <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-sky-500" />
                       </button>
                       <button 
                        onClick={() => setChatInput("Kiểm tra tính tuân thủ pháp lý theo Nghị định 06")}
                        className="w-full text-left p-4 rounded-xl border border-slate-100 text-xs font-bold hover:bg-sky-50 hover:border-sky-100 transition-all flex items-center justify-between group"
                       >
                         <span>Kiểm tra Nghị định 06</span>
                         <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-sky-500" />
                       </button>
                    </div>
                  </div>
                )}
                
                {chatHistory.map((chat, idx) => (
                  <div key={idx} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[95%] p-4 rounded-2xl text-[13px] leading-relaxed shadow-sm ${chat.role === 'user' ? 'bg-slate-900 text-slate-100 rounded-br-sm' : 'bg-white text-slate-800 rounded-bl-sm border border-slate-200 shadow-sm'}`}>
                      {chat.role === 'user' ? (
                        chat.text
                      ) : (
                        <div className="markdown-body">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {chat.text}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {isAiLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-100 px-5 py-4 rounded-2xl rounded-bl-sm flex items-center gap-3 border border-slate-200/50 shadow-sm">
                      <Loader2 className="w-4 h-4 animate-spin text-sky-600" />
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Processing...</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50/50">
                <div className="relative">
                  <input 
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendChat()}
                    placeholder="Đặt câu hỏi về QMS..."
                    className="w-full pl-4 pr-12 py-3.5 bg-white rounded-xl text-sm border-slate-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all shadow-inner"
                  />
                  <button 
                    onClick={handleSendChat}
                    disabled={isAiLoading || !chatInput.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-slate-900 text-white rounded-lg hover:bg-black disabled:opacity-50 transition-all shadow-md active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
