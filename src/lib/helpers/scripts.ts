export const focusInput = (form) => {
	const bxFormItem = form.querySelector('.bx--form-item');
	if (bxFormItem != null) {
		const firstInput = bxFormItem.querySelector('input');
		if (firstInput) {
			firstInput.focus();
		} else {
			const firstInput = bxFormItem.querySelector('textarea');
			if (firstInput) {
				firstInput.focus();
			} else {
				const firstInput = bxFormItem.querySelector('select');
				if (firstInput) {
					firstInput.focus();
				}
			}
		}
	}
};

export const onAfterOpenForm = () => {
	setTimeout(() => {
		const form = document.querySelector('form');
		if (form != null) {
			focusInput(form);
		}
	}, 0);
};
