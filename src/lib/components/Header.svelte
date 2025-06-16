<script lang="ts">
	import { page } from '$app/stores';
</script>

<header class="bg-white shadow-sm border-b">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex justify-between items-center h-16">
			<!-- 로고 -->
			<div class="flex items-center">
				<a href="/" class="text-xl font-bold text-gray-900">
					My App
				</a>
			</div>

			<!-- 내비게이션 -->
			<nav class="hidden space-x-8 md:flex">
				<a 
					href="/" 
					class="text-gray-600 hover:text-gray-900 {$page.url.pathname === '/' ? 'font-medium text-gray-900' : ''}"
				>
					홈
				</a>
				<a 
					href="/donation" 
					class="text-gray-600 hover:text-gray-900 {$page.url.pathname === '/donation' ? 'font-medium text-gray-900' : ''}"
				>
					후원하기
				</a>
				<a 
					href="/login" 
					class="text-gray-600 hover:text-gray-900 {$page.url.pathname === '/login' ? 'font-medium text-gray-900' : ''}"
				>
					로그인
				</a>
				<a 
					href="/signup" 
					class="text-gray-600 hover:text-gray-900 {$page.url.pathname === '/signup' ? 'font-medium text-gray-900' : ''}"
				>
					회원가입
				</a>
			</nav>

			<!-- 모바일 메뉴 버튼 -->
			<div class="md:hidden">
				<button
					type="button"
					class="text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900"
					aria-label="메뉴 열기"
				>
					<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
					</svg>
				</button>
			</div>
		</div>
	</div>
</header> 