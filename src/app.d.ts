// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

// 환경 변수 타입 정의
interface ImportMetaEnv {
	readonly PUBLIC_API_URL: string
	readonly PUBLIC_APP_NAME: string
	// 여기에 더 많은 환경 변수를 추가할 수 있습니다
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}

export {};
