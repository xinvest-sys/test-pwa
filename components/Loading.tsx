import { Loader } from '@mantine/core';

export default function Loading() {
  return (
    <div className="grid h-screen place-items-center">
      <Loader size="lg" variant="bars" />
    </div>
  );
}