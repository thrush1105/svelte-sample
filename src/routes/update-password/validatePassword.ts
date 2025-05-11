import { AppError, MINIMUM_PASSWORD_LENGTH } from '$lib/utils';

export const validatePassword = (
  currentPassword: string,
  newPassword: string,
  confirmNewPassword: string
) => {
  if (!currentPassword || !newPassword || !confirmNewPassword) {
    throw new AppError('すべてのフィールドを入力してください。');
  }

  if (
    currentPassword.length < MINIMUM_PASSWORD_LENGTH ||
    newPassword.length < MINIMUM_PASSWORD_LENGTH ||
    confirmNewPassword.length < MINIMUM_PASSWORD_LENGTH
  ) {
    throw new AppError(`パスワードは${MINIMUM_PASSWORD_LENGTH}文字以上である必要があります。`);
  }

  if (newPassword !== confirmNewPassword) {
    throw new AppError('新しいパスワードが一致しません。');
  }

  if (currentPassword === newPassword) {
    throw new AppError('新しいパスワードは現在のパスワードと異なる必要があります。');
  }
};
