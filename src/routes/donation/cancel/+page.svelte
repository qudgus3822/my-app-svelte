<script lang="ts">
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<svelte:head>
	<title>결제 취소</title>
	<meta name="description" content="결제가 취소되었습니다" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-orange-500 to-red-600 p-4">
	<div class="mx-auto max-w-2xl">
		<div class="rounded-xl bg-white p-8 shadow-xl">
			<!-- 취소 아이콘 -->
			<div class="mb-6 text-center">
				<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
					<svg class="h-8 w-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
					</svg>
				</div>
				<h1 class="mb-2 text-3xl font-bold text-gray-800">❌ 결제 취소</h1>
				<p class="text-lg text-gray-600">결제가 취소되었습니다</p>
			</div>

			<!-- 취소된 결제 정보 -->
			<div class="mb-6 rounded-lg bg-gray-50 p-6">
				<h2 class="mb-4 text-lg font-semibold text-gray-800">취소된 결제 정보</h2>
				<div class="space-y-3">
					<div class="flex justify-between">
						<span class="text-gray-600">주문번호:</span>
						<span class="font-mono text-sm">{data.donation.orderId}</span>
					</div>
					{#if data.donation.amount > 0}
						<div class="flex justify-between">
							<span class="text-gray-600">취소된 금액:</span>
							<span class="text-lg font-bold text-orange-600">{data.donation.amount.toLocaleString()}원</span>
						</div>
					{/if}
					{#if data.donation.userName}
						<div class="flex justify-between">
							<span class="text-gray-600">후원자:</span>
							<span class="font-medium">{data.donation.userName}</span>
						</div>
					{/if}
					<div class="flex justify-between">
						<span class="text-gray-600">취소시간:</span>
						<span class="font-medium">
							{new Date(data.donation.cancelledAt).toLocaleDateString('ko-KR', {
								year: 'numeric',
								month: 'long',
								day: 'numeric',
								hour: '2-digit',
								minute: '2-digit'
							})}
						</span>
					</div>
				</div>
			</div>

			<!-- 안내 메시지 -->
			<div class="mb-6 rounded-lg border border-orange-200 bg-orange-50 p-4">
				<div class="flex">
					<svg class="h-5 w-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
					</svg>
					<div class="ml-3">
						<h3 class="text-sm font-medium text-orange-800">결제 취소 안내</h3>
						<p class="mt-1 text-sm text-orange-700">
							사용자 요청으로 결제가 취소되었습니다. 
							결제 금액은 즉시 취소 처리되며, 실제 환불은 1-3일 소요될 수 있습니다.
						</p>
					</div>
				</div>
			</div>

			<!-- 버튼들 -->
			<div class="space-y-3">
				<a
					href="/donation"
					class="block w-full rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 py-3 text-center font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
				>
					다시 후원하기
				</a>
				<a
					href="/"
					class="block w-full rounded-lg border-2 border-gray-300 py-3 text-center font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-50"
				>
					홈으로 돌아가기
				</a>
			</div>
		</div>

		<!-- 도움말 -->
		<div class="mt-8 rounded-lg bg-white/20 p-6 text-center text-white">
			<h3 class="mb-2 text-xl font-semibold">❓ 문의사항이 있으신가요?</h3>
			<p class="opacity-90">
				결제 취소나 환불과 관련해 궁금한 점이 있으시면<br>
				언제든지 고객센터로 문의해 주세요.
			</p>
		</div>
	</div>
</div> 