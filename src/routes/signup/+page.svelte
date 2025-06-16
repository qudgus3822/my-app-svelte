<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import type { ActionData } from './$types';

	interface Props {
		form?: ActionData;
	}

	let { form }: Props = $props();

	let loading = $state(false);
</script>

<svelte:head>
	<title>회원가입</title>
	<meta name="description" content="회원가입 페이지" />
</svelte:head>

<div
	class="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-500 to-blue-600 p-4"
>
	<div class="w-full max-w-md rounded-xl bg-white p-8 shadow-xl">
		<h1 class="mb-2 text-center text-3xl font-bold text-gray-800">회원가입</h1>
		<p class="mb-8 text-center text-sm text-gray-600">새 계정을 만들어보세요</p>

		{#if form?.error}
			<div class="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
				{form.error}
			</div>
		{/if}

		<form
			method="POST"
			use:enhance={() => {
				loading = true;
				return async ({ result, update }) => {
					await update();
					loading = false;

					// 성공 시 리다이렉트
					if (result.type === 'success' && result.data?.success) {
						const message = encodeURIComponent(result.data.message as string);
						goto(`/login?message=${message}`);
					}
				};
			}}
		>
			<div class="mb-4">
				<label for="name" class="mb-2 block text-sm font-medium text-gray-700"> 이름 </label>
				<input
					id="name"
					name="name"
					type="text"
					value={form?.name || ''}
					placeholder="이름을 입력하세요"
					required
					disabled={loading}
					class="w-full rounded-lg border-2 border-gray-200 px-3 py-3 text-base transition-colors duration-200 focus:border-green-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
				/>
			</div>

			<div class="mb-4">
				<label for="email" class="mb-2 block text-sm font-medium text-gray-700"> 이메일 </label>
				<input
					id="email"
					name="email"
					type="email"
					value={form?.email || ''}
					placeholder="이메일을 입력하세요"
					required
					disabled={loading}
					class="w-full rounded-lg border-2 border-gray-200 px-3 py-3 text-base transition-colors duration-200 focus:border-green-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
				/>
			</div>

			<div class="mb-4">
				<label for="age" class="mb-2 block text-sm font-medium text-gray-700"> 나이 </label>
				<input
					id="age"
					name="age"
					type="number"
					value={form?.age || ''}
					placeholder="나이를 입력하세요"
					min="1"
					max="150"
					required
					disabled={loading}
					class="w-full rounded-lg border-2 border-gray-200 px-3 py-3 text-base transition-colors duration-200 focus:border-green-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
				/>
			</div>

			<div class="mb-4">
				<label for="password" class="mb-2 block text-sm font-medium text-gray-700">
					비밀번호
				</label>
				<input
					id="password"
					name="password"
					type="password"
					placeholder="비밀번호를 입력하세요 (최소 6자)"
					required
					disabled={loading}
					class="w-full rounded-lg border-2 border-gray-200 px-3 py-3 text-base transition-colors duration-200 focus:border-green-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
				/>
			</div>

			<div class="mb-6">
				<label for="confirmPassword" class="mb-2 block text-sm font-medium text-gray-700">
					비밀번호 확인
				</label>
				<input
					id="confirmPassword"
					name="confirmPassword"
					type="password"
					placeholder="비밀번호를 다시 입력하세요"
					required
					disabled={loading}
					class="w-full rounded-lg border-2 border-gray-200 px-3 py-3 text-base transition-colors duration-200 focus:border-green-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
				/>
			</div>

			<button
				type="submit"
				disabled={loading}
				class="w-full rounded-lg bg-gradient-to-r from-green-500 to-blue-600 py-3.5 text-base font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:transform hover:shadow-lg disabled:transform-none disabled:cursor-not-allowed disabled:opacity-70"
			>
				{loading ? '가입 중...' : '회원가입'}
			</button>
		</form>

		<div class="mt-6 text-center text-sm text-gray-600">
			이미 계정이 있으신가요?
			<a href="/login" class="font-semibold text-green-500 hover:underline">로그인</a>
		</div>
	</div>
</div>
