import Image from 'next/image';
import Cogs from '@/public/cogs-settings.svg';
export default function UnderMaintenancePage() {
  return (
<div className="bg-gray-100 dark:bg-gray-800">
  <div className="min-h-screen flex flex-col justify-center items-center">
    <Image src={Cogs} alt="Under Maintenance" width={200} height={200} />
    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center text-gray-700 dark:text-white mb-4">Site is under maintenance</h1>
    <p className="text-center text-gray-500 dark:text-gray-300 text-lg md:text-xl lg:text-2xl mb-8">We&apos;re working hard to improve the user experience. Stay tuned!</p>
  </div>
</div>
  )
}
