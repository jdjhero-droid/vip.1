
import React, { useState, useEffect } from 'react';
import { validateConnection } from '../geminiService';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeyUpdated: () => void;
  isKeyActive: boolean;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onKeyUpdated, isKeyActive }) => {
  const [inputKey, setInputKey] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('wt_api_key');
    if (saved) setInputKey(saved);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveAndTest = async () => {
    if (!inputKey.trim()) return;
    
    setIsTesting(true);
    setTestResult(null);
    
    try {
      const result = await validateConnection(inputKey.trim());
      if (result.success) {
        localStorage.setItem('wt_api_key', inputKey.trim());
        onKeyUpdated();
        setTestResult(result);
        // Close after a brief delay on success
        setTimeout(() => onClose(), 1500);
      } else {
        setTestResult(result);
      }
    } catch (e) {
      setTestResult({ success: false, message: "연결 테스트에 실패했습니다." });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#1e222d] border border-gray-800 rounded-[2rem] w-full max-w-md shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden relative">
        
        {/* Header */}
        <div className="flex justify-between items-center p-8 pb-4">
          <h2 className="text-xl font-bold text-white tracking-tight">API Key 설정</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-8 pb-8 space-y-6">
          <p className="text-[#a0a4b0] text-sm leading-relaxed">
            Gemini API 키를 입력해주세요. 키는 당신의 브라우저에 암호화되어 안전하게 저장됩니다.
          </p>

          <div className="space-y-4">
            <div className="relative group">
              <input 
                type="password"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="AlzaSy... 키를 여기에 붙여넣으세요"
                className="w-full bg-[#151821] border-2 border-[#7c3aed]/30 rounded-2xl p-5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#7c3aed] transition-all"
              />
            </div>

            <button 
              onClick={handleSaveAndTest}
              disabled={isTesting || !inputKey.trim()}
              className={`w-full py-5 bg-[#7c3aed] text-white rounded-2xl font-bold transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 ${
                (isTesting || !inputKey.trim()) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#6d28d9]'
              }`}
            >
              {isTesting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  확인 중...
                </>
              ) : "저장 및 테스트"}
            </button>
          </div>

          {/* Result Message */}
          {testResult && (
            <div className={`text-center text-xs font-bold animate-in fade-in slide-in-from-top-2 ${
              testResult.success ? 'text-green-400' : 'text-red-400'
            }`}>
              {testResult.message}
            </div>
          )}

          {/* Footer Section with Link */}
          <div className="pt-4 flex flex-col items-center gap-4">
            <div className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">
              MANUAL KEY CONTROL V3.0
            </div>
            
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors group"
            >
              <div className="bg-white/5 p-1.5 rounded-lg group-hover:bg-[#7c3aed]/20 transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
                </svg>
              </div>
              <span>API 키 발급받기</span>
              <svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
