<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	interface Props {
		form?: ActionData;
	}

	let { form }: Props = $props();

	let loading = $state(false);
	let selectedAmount = $state(0);
	let customAmount = $state('');
	let message = $state('');
	let userName = $state('');
	let userEmail = $state('');

	const presetAmounts = [1000, 3000, 5000, 10000, 30000, 50000];

	function selectAmount(amount: number) {
		selectedAmount = amount;
		customAmount = '';
	}

	function onCustomAmountChange() {
		if (customAmount) {
			selectedAmount = parseInt(customAmount) || 0;
		}
	}

	$effect(() => {
		if (customAmount && !isNaN(parseInt(customAmount))) {
			selectedAmount = parseInt(customAmount);
		}
	});
</script>

<svelte:head>
	<title>후원하기</title>
	<meta name="description" content="프로젝트를 후원해주세요" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-purple-500 to-pink-600 p-4">
	<div class="mx-auto max-w-2xl">
		<!-- 헤더 -->
		<div class="mb-8 text-center text-white">
			<h1 class="mb-4 text-4xl font-bold">💝 후원하기</h1>
			<p class="text-lg opacity-90">
				여러분의 소중한 후원이 더 나은 서비스를 만드는 데 큰 힘이 됩니다.
			</p>
		</div>

		<!-- 후원 폼 -->
		<div class="rounded-xl bg-white p-8 shadow-xl">
			{#if form?.error}
				<div class="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
					{form.error}
				</div>
			{/if}

			<form
				method="POST"
				use:enhance={() => {
					loading = true;
					return async ({ update }) => {
						await update();
						loading = false;
					};
				}}
			>
				<!-- 후원자 정보 -->
				<div class="mb-6">
					<h3 class="mb-4 text-lg font-semibold text-gray-800">후원자 정보</h3>
					<div class="grid gap-4 md:grid-cols-2">
						<div>
							<label for="userName" class="mb-2 block text-sm font-medium text-gray-700">
								이름
							</label>
							<input
								id="userName"
								name="userName"
								type="text"
								bind:value={userName}
								placeholder="이름을 입력하세요"
								required
								disabled={loading}
								class="w-full rounded-lg border-2 border-gray-200 px-3 py-3 text-base transition-colors duration-200 focus:border-purple-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
							/>
						</div>
						<div>
							<label for="userEmail" class="mb-2 block text-sm font-medium text-gray-700">
								이메일
							</label>
							<input
								id="userEmail"
								name="userEmail"
								type="email"
								bind:value={userEmail}
								placeholder="이메일을 입력하세요"
								required
								disabled={loading}
								class="w-full rounded-lg border-2 border-gray-200 px-3 py-3 text-base transition-colors duration-200 focus:border-purple-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
							/>
						</div>
					</div>
				</div>

				<!-- 후원 금액 선택 -->
				<div class="mb-6">
					<h3 class="mb-4 text-lg font-semibold text-gray-800">후원 금액</h3>
					<div class="grid grid-cols-3 gap-3 md:grid-cols-6">
						{#each presetAmounts as amount}
							<button
								type="button"
								onclick={() => selectAmount(amount)}
								class="rounded-lg border-2 py-3 text-center font-medium transition-all duration-200 {selectedAmount === amount
									? 'border-purple-500 bg-purple-50 text-purple-700'
									: 'border-gray-200 text-gray-700 hover:border-purple-300'}"
							>
								{amount.toLocaleString()}원
							</button>
						{/each}
					</div>
					<div class="mt-4">
						<label for="customAmount" class="mb-2 block text-sm font-medium text-gray-700">
							직접 입력 (1,000원 ~ 1,000,000원)
						</label>
						<input
							id="customAmount"
							name="customAmount"
							type="number"
							bind:value={customAmount}
							oninput={onCustomAmountChange}
							min="1000"
							max="1000000"
							placeholder="원하는 금액을 입력하세요"
							disabled={loading}
							class="w-full rounded-lg border-2 border-gray-200 px-3 py-3 text-base transition-colors duration-200 focus:border-purple-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
						/>
					</div>
				</div>

				<!-- 후원 메시지 -->
				<div class="mb-6">
					<label for="message" class="mb-2 block text-sm font-medium text-gray-700">
						후원 메시지 (선택사항)
					</label>
					<textarea
						id="message"
						name="message"
						bind:value={message}
						rows="4"
						placeholder="응원의 메시지를 남겨주세요"
						maxlength="500"
						disabled={loading}
						class="w-full rounded-lg border-2 border-gray-200 px-3 py-3 text-base transition-colors duration-200 focus:border-purple-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
					></textarea>
					<div class="mt-1 text-right text-sm text-gray-500">
						{message.length}/500
					</div>
				</div>

				<!-- 선택된 금액 표시 -->
				{#if selectedAmount > 0}
					<div class="mb-6 rounded-lg bg-purple-50 p-4">
						<div class="text-center">
							<p class="text-sm text-gray-600">후원 금액</p>
							<p class="text-2xl font-bold text-purple-600">
								{selectedAmount.toLocaleString()}원
							</p>
						</div>
					</div>
				{/if}

				<!-- 숨겨진 필드 -->
				<input type="hidden" name="amount" value={selectedAmount} />

				<!-- 결제 버튼 -->
				<button
					type="submit"
					disabled={loading || selectedAmount < 1000 || !userName || !userEmail}
					class="w-full rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 py-4 text-lg font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:transform hover:shadow-lg disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50"
				>
					{loading ? '결제 준비 중...' : `카카오페이로 ${selectedAmount.toLocaleString()}원 후원하기`}
				</button>

				<!-- 카카오페이 로고 -->
				<div class="mt-4 text-center">
					<p class="text-sm text-gray-500">안전한 결제를 위해 카카오페이를 사용합니다</p>
				</div>
			</form>
		</div>

		<!-- 안내사항 -->
		<div class="mt-8 rounded-lg bg-white/20 p-6 text-white">
			<h3 class="mb-3 text-lg font-semibold">📢 안내사항</h3>
			<ul class="space-y-2 text-sm opacity-90">
				<li>• 최소 후원 금액은 1,000원입니다.</li>
				<li>• 카카오페이를 통해 안전하게 결제됩니다.</li>
				<li>• 후원금은 서비스 개선과 운영에 사용됩니다.</li>
				<li>• 후원 내역은 이메일로 발송됩니다.</li>
			</ul>
		</div>
	</div>
</div> 