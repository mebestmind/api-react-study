import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getMemos, createMemo, updateMemo, deleteMemo, MemoItem } from '../services/api';

function MemoPage() {
  const [memos, setMemos] = useState<MemoItem[]>([]);
  const [inputText, setInputText] = useState<string>('');

  // 수정을 위한 상태
  const [editId, setEditId] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>('');

  const { logout } = useAuth();
  const navigate = useNavigate();

  // [Read] 메모 불러오기
  const fetchMemos = async () => {
    try {
      const data = await getMemos();   // 토큰 자동 첨부 (api.ts)
      setMemos(data);
    } catch (error) {
      console.error('메모 불러오기 실패:', error);
    }
  };

  useEffect(() => {
    fetchMemos();
  }, []);

  // [Create] 메모 추가하기
  const handleAddMemo = async () => {
    if (inputText.trim() === '') return;
    try {
      await createMemo(inputText);
      setInputText('');
      fetchMemos();
    } catch (error) {
      console.error('메모 추가 실패:', error);
    }
  };

  // [Update] 메모 수정 완료하기
  const handleUpdateMemo = async (id: number) => {
    if (editText.trim() === '') return;
    try {
      await updateMemo(id, editText);
      setEditId(null);
      setEditText('');
      fetchMemos();
    } catch (error) {
      console.error('메모 수정 실패:', error);
    }
  };

  // [Delete] 메모 삭제하기
  const handleDeleteMemo = async (id: number) => {
    try {
      await deleteMemo(id);
      fetchMemos();
    } catch (error) {
      console.error('메모 삭제 실패:', error);
    }
  };

  // 로그아웃
  const handleLogout = () => {
    logout();              // 토큰 삭제 (AuthContext)
    navigate('/login');    // 로그인 페이지로 이동
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      {/* 상단 헤더: 제목 + 로그아웃 버튼 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>🚀 풀스택 스마트 메모장</h2>
        <button onClick={handleLogout} style={{ padding: '8px 16px', cursor: 'pointer' }}>
          로그아웃
        </button>
      </div>

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

      {/* 메모 리스트 */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {memos.map((item) => (
          <li key={item.id} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px', backgroundColor: '#f3f4f6', marginBottom: '8px', borderRadius: '4px'
          }}>

            {/* 수정 모드 */}
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
              /* 일반 모드 (조회/수정/삭제) */
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
                    setEditText(item.content);
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

export default MemoPage;