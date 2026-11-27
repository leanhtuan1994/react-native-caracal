import { Text } from 'react-native';

import { renderHook, screen, setup } from '@/lib/test-utils';

import { Modal, useModal } from './modal';

it('forwards present and dismiss to the sheet used by the close button', async () => {
  const { result } = await renderHook(useModal);
  const modal = result.current;
  const { user } = await setup(
    <Modal ref={modal.ref} title="Preferences">
      <Text>Choose a theme</Text>
    </Modal>
  );

  const sheet = modal.ref.current!;
  const present = jest.spyOn(sheet, 'present');
  const dismiss = jest.spyOn(sheet, 'dismiss');
  await modal.present();
  expect(present).toHaveBeenCalledWith();
  expect(screen.getByText('Preferences')).toBeOnTheScreen();
  expect(screen.getByText('Choose a theme')).toBeOnTheScreen();
  await user.press(screen.getByRole('button', { name: 'close modal' }));
  await modal.dismiss();
  expect(dismiss).toHaveBeenCalledTimes(2);
});
