const API_BASE = 'http://localhost:8000';

// 메모 데이터 타입
export interface MemoItem {
  id: number;
  created_at: string;
  content: string;
  text_length?: number;
  user_id?: number;
}

// ==========================================================
//  공통 요청 함수 — 토큰을 자동으로 헤더에 첨부
// ==========================================================
async function request(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('access_token');

  // 기존 헤더에 인증 헤더를 자동으로 합침
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;   // ← 여기서 자동 첨부
  }

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });

  // 토큰이 만료됐거나 유효하지 않으면 (401) 로그아웃 처리
  if (response.status === 401) {
    localStorage.removeItem('access_token');
    window.location.href = '/login';   // 로그인 페이지로 강제 이동
    throw new Error('로그인이 필요합니다.');
  }

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.detail || '요청에 실패했습니다.');
  }

  return response.json();
}

// ==========================================================
//  메모 API — 위 request 를 쓰므로 토큰이 자동으로 붙음
// ==========================================================

// [Read] 내 메모 목록
export function getMemos(): Promise<MemoItem[]> {
  return request('/memos');
}

// [Create] 새 메모 추가
export function createMemo(content: string): Promise<MemoItem[]> {
  return request('/memos', {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
}

// [Update] 메모 수정
export function updateMemo(id: number, content: string): Promise<MemoItem[]> {
  return request(`/memos/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ content }),
  });
}

// [Delete] 메모 삭제
export function deleteMemo(id: number): Promise<MemoItem[]> {
  return request(`/memos/${id}`, {
    method: 'DELETE',
  });
}