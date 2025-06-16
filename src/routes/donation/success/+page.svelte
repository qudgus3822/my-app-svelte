<script lang="ts">
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<svelte:head>
	<title>후원 완료</title>
	<meta name="description" content="후원이 성공적으로 완료되었습니다" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-green-500 to-blue-600 p-4">
	<div class="mx-auto max-w-2xl">
		<div class="rounded-xl bg-white p-8 shadow-xl">
			<!-- 성공 아이콘 -->
			<div class="mb-6 text-center">
				<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
					<svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
					</svg>
				</div>
				<h1 class="mb-2 text-3xl font-bold text-gray-800">🎉 후원 완료</h1>
				<p class="text-lg text-gray-600">소중한 후원에 진심으로 감사드립니다!</p>
			</div>

			<!-- 후원 정보 -->
			<div class="mb-6 rounded-lg bg-gray-50 p-6">
				<h2 class="mb-4 text-lg font-semibold text-gray-800">후원 정보</h2>
				<div class="space-y-3">
					<div class="flex justify-between">
						<span class="text-gray-600">후원자:</span>
						<span class="font-medium">{data.donation.userName}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-gray-600">이메일:</span>
						<span class="font-medium">{data.donation.userEmail}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-gray-600">후원 금액:</span>
						<span class="text-lg font-bold text-green-600">{data.donation.amount.toLocaleString()}원</span>
					</div>
					{#if data.donation.message}
						<div class="border-t pt-3">
							<span class="text-gray-600">후원 메시지:</span>
							<p class="mt-1 rounded bg-white p-3 text-gray-800">{data.donation.message}</p>
						</div>
					{/if}
				</div>
			</div>

			<!-- 결제 정보 -->
			<div class="mb-6 rounded-lg bg-gray-50 p-6">
				<h2 class="mb-4 text-lg font-semibold text-gray-800">결제 정보</h2>
				<div class="space-y-3">
					<div class="flex justify-between">
						<span class="text-gray-600">주문번호:</span>
						<span class="font-mono text-sm">{data.donation.orderId}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-gray-600">결제방법:</span>
						<span class="font-medium">카카오페이</span>
					</div>
					<div class="flex justify-between">
						<span class="text-gray-600">결제시간:</span>
						<span class="font-medium">
							{new Date(data.donation.completedAt || '').toLocaleDateString('ko-KR', {
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
						<h3 class="text-sm font-medium text-blue-800">후원 영수증</h3>
						<p class="mt-1 text-sm text-blue-700">
							후원 영수증이 등록하신 이메일({data.donation.userEmail})로 발송됩니다.
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
					추가 후원하기
				</a>
				<a
					href="/"
					class="block w-full rounded-lg border-2 border-gray-300 py-3 text-center font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-50"
				>
					홈으로 돌아가기
				</a>
			</div>
		</div>

		<!-- 감사 메시지 -->
		<div class="mt-8 rounded-lg bg-white/20 p-6 text-center text-white">
			<h3 class="mb-2 text-xl font-semibold">💝 감사합니다</h3>
			<p class="opacity-90">
				여러분의 소중한 후원이 더 나은 서비스를 만드는 데 큰 힘이 됩니다.<br>
				앞으로도 많은 관심과 응원 부탁드립니다.
			</p>
		</div>
	</div>
</div> 