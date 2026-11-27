import {
  BottomSheet,
  type BottomSheetProps,
  type BottomSheetRef,
} from 'heroui-native';
import { type Ref, useCallback, useRef } from 'react';

export function useModal() {
  const ref = useRef<BottomSheetRef>(null);
  const present = useCallback(() => ref.current?.present(), []);
  const dismiss = useCallback(() => ref.current?.dismiss(), []);
  return { ref, present, dismiss };
}

type ModalProps = BottomSheetProps & {
  ref?: Ref<BottomSheetRef>;
  title?: string;
};

export function Modal({
  ref,
  title,
  children,
  scrollableRef,
  ...props
}: ModalProps) {
  return (
    <BottomSheet
      ref={ref}
      dimOpacity={0.4}
      scrollableRef={scrollableRef}
      {...props}
    >
      <BottomSheet.Content className={scrollableRef ? 'flex-1' : undefined}>
        <BottomSheet.Header className="mb-3 flex-row items-center justify-end gap-2">
          {title && (
            <BottomSheet.Title className="flex-1">{title}</BottomSheet.Title>
          )}
          <BottomSheet.Close aria-label="close modal" />
        </BottomSheet.Header>
        <BottomSheet.Body className={scrollableRef ? 'flex-1' : undefined}>
          {children}
        </BottomSheet.Body>
      </BottomSheet.Content>
    </BottomSheet>
  );
}
