# SvelteKit에서 Mongoose 사용하기

이 문서는 SvelteKit 프로젝트에서 Mongoose를 사용하는 방법을 설명합니다.

## 🚀 설치된 패키지

- `mongoose` - MongoDB ODM
- `bcryptjs` - 비밀번호 해시화
- `@types/bcryptjs` - TypeScript 타입 정의

## 📁 프로젝트 구조

```
src/
├── lib/
│   ├── db.ts                    # 데이터베이스 연결 설정
│   ├── models/
│   │   └── User.ts             # 사용자 모델
│   └── utils/
│       └── auth.ts             # 인증 유틸리티 함수
├── routes/
│   ├── api/
│   │   └── users/
│   │       └── +server.ts      # 사용자 API 라우트
│   ├── login/
│   │   └── +page.server.ts     # 로그인 서버 액션
│   └── register/
│       └── +page.server.ts     # 회원가입 서버 액션
```

## ⚙️ 환경 변수 설정

`.env` 파일에 MongoDB 연결 URL을 설정하세요:

```env
PRIVATE_MONGODB_URI=mongodb://localhost:27017/sveltekit-app
# 또는 MongoDB Atlas 사용 시:
# PRIVATE_MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
```

## 🔧 주요 기능

### 1. 데이터베이스 연결 (`src/lib/db.ts`)
- MongoDB 연결 관리
- 연결 상태 추적
- 자동 재연결 처리

### 2. 사용자 모델 (`src/lib/models/User.ts`)
- Mongoose 스키마 정의
- 유효성 검사
- 자동 타임스탬프
- JSON 변환 시 비밀번호 제외

### 3. 인증 시스템
- 비밀번호 해시화 (bcrypt)
- 로그인/회원가입 폼 액션
- 이메일 중복 검사
- 입력 유효성 검사

### 4. API 라우트
- RESTful API 엔드포인트
- 페이지네이션 지원
- 에러 처리

## 💡 사용 예시

### 사용자 생성

```typescript
import { createUser } from '$lib/utils/auth';

const newUser = await createUser({
    email: 'user@example.com',
    password: 'password123',
    name: '홍길동'
});
```

### 사용자 조회

```typescript
import { getUserByEmail } from '$lib/utils/auth';

const user = await getUserByEmail('user@example.com');
```

### 로그인 검증

```typescript
import { getUserByEmail, verifyPassword } from '$lib/utils/auth';

const user = await getUserByEmail(email);
if (user && await verifyPassword(password, user.password)) {
    // 로그인 성공
}
```

## 🔍 API 엔드포인트

### GET /api/users
사용자 목록 조회 (페이지네이션 지원)

```bash
GET /api/users?page=1&limit=10
```

### POST /api/users
새 사용자 생성

```bash
POST /api/users
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "password123",
    "name": "홍길동"
}
```

## 📝 추가 개발 가이드

### 새 모델 추가하기

1. `src/lib/models/` 폴더에 새 모델 파일 생성
2. Mongoose 스키마 정의
3. TypeScript 인터페이스 작성
4. 필요한 유틸리티 함수 추가

### 데이터베이스 쿼리 최적화

- 인덱스 사용: `schema.index({ field: 1 })`
- 필드 선택: `.select('-password')`
- 페이지네이션: `.skip().limit()`
- 조건부 쿼리: `.find({ condition })`

### 에러 처리

- MongoDB 연결 오류
- 중복 키 오류 (code: 11000)
- 유효성 검사 오류
- 서버 오류 (500)

## 🚨 주의사항

1. **비밀번호 보안**: 항상 bcrypt로 해시화
2. **환경 변수**: MongoDB URI는 PRIVATE_ 접두사 사용
3. **연결 관리**: 서버 액션에서 매번 connectDB() 호출
4. **타입 안전성**: TypeScript 인터페이스 활용
5. **에러 처리**: try-catch 블록으로 적절한 오류 처리 