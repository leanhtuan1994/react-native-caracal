import Image from 'next/image';

export function CaracalMark({ className }: { className?: string }) {
  return (
    <Image src="/favicon.svg" width={20} height={20} className={className} alt="" />
  );
}
