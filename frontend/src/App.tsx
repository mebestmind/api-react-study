import React, { useState, useEffect } from 'react';
import './App.css';

interface MemoItem {
  id: number;
  created_at: string;
  content: string;
  text_length?: number;
}

function App() {
  const [memos, setMemos] = useState<MemoItem[]>([]);
  const [inputText, setInputText] = useState<string>('');
  
  // 수정을 위한 상태 (어떤 메모를 수정 중인지, 수정할 텍스트는 무엇인지)
  const [editId, setEditId] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>('');

  // 곧 만들 파이썬 FastAPI 서버의 주소입니다.
  const API_URL = 'http://localhost:8000/memos';

  // [Read] 메모 불러오기 (GET)
  const fetchMemos = async () => {
    try {
      const response = await fetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        setMemos(data);
      }
    } catch (error) {
      console.error('서버 연결 실패 (아직 파이썬 서버가 안 켜져 있으면 정상입니다!):', error);
    }
  };

  useEffect(() => {
    fetchMemos();
  }, []);

  // [Create] 메모 추가하기 (POST)
  const handleAddMemo = async () => {
    if (inputText.trim() === '') return;
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: inputText })
      });
      if (response.ok) {
        setInputText('');
        fetchMemos(); // 추가 후 최신 데이터 다시 불러오기
      }
    } catch (error) {
      console.error('메모 추가 실패:', error);
    }
  };

  // [Update] 메모 수정 완료하기 (PUT)
  const handleUpdateMemo = async (id: number) => {
    if (editText.trim() === '') return;
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editText })
      });
      if (response.ok) {
        setEditId(null);
        setEditText('');
        fetchMemos(); // 수정 후 최신 데이터 다시 불러오기
      }
    } catch (error) {
      console.error('메모 수정 실패:', error);
    }
  };

  // [Delete] 메모 삭제하기 (DELETE)
  const handleDeleteMemo = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchMemos(); // 삭제 후 최신 데이터 다시 불러오기
      }
    } catch (error) {
      console.error('메모 삭제 실패:', error);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>🚀 풀스택 스마트 메모장 (API 연동 버전)</h2>
      
      {/* 메모 입력창 */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="새 메모를 입력하세요..."
          style={{ flex: 1, padding: '10px', fontSize: '16px' }}
        />
        <button onClick={handleAddMemo} style={{ padding: '10px 20px', cursor: 'pointer' }}>등록</button>
      </div>

      {/* 메모 리스트 출력 영역 */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {memos.map((item) => (
          <li key={item.id} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px', backgroundColor: '#f3f4f6', marginBottom: '8px', borderRadius: '4px'
          }}>
            
            {/* 수정 모드일 때 보여줄 화면 */}
            {editId === item.id ? (
              <div style={{ display: 'flex', flex: 1, gap: '10px' }}>
                <input 
                  type="text" 
                  value={editText} 
                  onChange={(e) => setEditText(e.target.value)}
                  style={{ flex: 1, padding: '5px' }}
                />
                <button onClick={() => handleUpdateMemo(item.id)}>저장</button>
                <button onClick={() => setEditId(null)}>취소</button>
              </div>
            ) : (
              /* 일반 모드일 때 보여줄 화면 (조회/삭제) */
              <>
                <div>
                  <span>{item.content}</span>
                  {item.text_length && (
                    <span style={{ color: 'blue', marginLeft: '10px', fontSize: '14px' }}>
                      ({item.text_length}자)
                    </span>
                  )}
                </div>
                <div>
                  <button onClick={() => {
                    setEditId(item.id);
                    setEditText(item.content); // 기존 내용을 수정창에 채워줌
                  }} style={{ marginRight: '5px', cursor: 'pointer' }}>✏️</button>
                  <button onClick={() => handleDeleteMemo(item.id)} style={{ cursor: 'pointer' }}>❌</button>
                </div>
              </>
            )}

          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;