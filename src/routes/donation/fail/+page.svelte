<script lang="ts">
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<svelte:head>
	<title>결제 실패</title>
	<meta name="description" content="결제 처리 중 오류가 발생했습니다" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-red-500 to-pink-600 p-4">
	<div class="mx-auto max-w-2xl">
		<div class="rounded-xl bg-white p-8 shadow-xl">
			<!-- 실패 아이콘 -->
			<div class="mb-6 text-center">
				<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
					<svg class="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
					</svg>
				</div>
				<h1 class="mb-2 text-3xl font-bold text-gray-800">❌ 결제 실패</h1>
				<p class="text-lg text-gray-600">결제 처리 중 오류가 발생했습니다</p>
			</div>

			<!-- 오류 메시지 -->
			<div class="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
				<div class="flex">
					<svg class="h-5 w-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
					</svg>
					<div class="ml-3">
						<h3 class="text-sm font-medium text-red-800">오류 상세</h3>
						<p class="mt-1 text-sm text-red-700">
							{data.error}
						</p>
					</div>
				</div>
			</div>

			<!-- 실패한 결제 정보 -->
			<div class="mb-6 rounded-lg bg-gray-50 p-6">
				<h2 class="mb-4 text-lg font-semibold text-gray-800">실패한 결제 정보</h2>
				<div class="space-y-3">
					<div class="flex justify-between">
						<span class="text-gray-600">주문번호:</span>
						<span class="font-mono text-sm">{data.donation.orderId}</span>
					</div>
					{#if data.donation.amount > 0}
						<div class="flex justify-between">
							<span class="text-gray-600">시도한 금액:</span>
							<span class="text-lg font-bold text-red-600">{data.donation.amount.toLocaleString()}원</span>
						</div>
					{/if}
					{#if data.donation.userName}
						<div class="flex justify-between">
							<span class="text-gray-600">후원자:</span>
							<span class="font-medium">{data.donation.userName}</span>
						</div>
					{/if}
					<div class="flex justify-between">
						<span class="text-gray-600">실패시간:</span>
						<span class="font-medium">
							{new Date(data.donation.failedAt).toLocaleDateString('ko-KR', {
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
			<div class="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
				<div class="flex">
					<svg class="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
					</svg>
					<div class="ml-3">
						<h3 class="text-sm font-medium text-blue-800">결제 실패 안내</h3>
						<div class="mt-1 text-sm text-blue-700">
							<p class="mb-2">결제가 정상적으로 처리되지 않았습니다. 다음 사항을 확인해 주세요:</p>
							<ul class="list-disc list-inside space-y-1">
								<li>카드 한도 및 잔액 확인</li>
								<li>카드 정보 정확성</li>
								<li>인터넷 연결 상태</li>
								<li>카카오페이 앱 상태</li>
							</ul>
						</div>
					</div>
				</div>
			</div>

			<!-- 버튼들 -->
			<div class="space-y-3">
				<a
					href="/donation"
					class="block w-full rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 py-3 text-center font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
				>
					다시 시도하기
				</a>
				<a
					href="/"
					class="block w-full rounded-lg border-2 border-gray-300 py-3 text-center font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-50"
				>
					홈으로 돌아가기
				</a>
			</div>
		</div>

		<!-- 고객센터 안내 -->
		<div class="mt-8 rounded-lg bg-white/20 p-6 text-center text-white">
			<h3 class="mb-2 text-xl font-semibold">🆘 도움이 필요하신가요?</h3>
			<p class="opacity-90">
				지속적인 결제 오류가 발생하거나 문제가 해결되지 않으면<br>
				고객센터로 문의해 주세요. 빠르게 도움을 드리겠습니다.
			</p>
		</div>
	</div>
</div> 