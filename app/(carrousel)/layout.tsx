'use client'

import Timer from '@/components/Timer';
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation';

interface CarrouselLayoutProps {
    children: React.ReactNode;
    pageTimeout?: number;
}


const CarrouselLayout = ({ children }: CarrouselLayoutProps) => {
    const router = useRouter();
    const consoleLog = () => {
        router.push('/');
        console.log('fi');
    }
    const pathname = usePathname();
    return (
        <div>
            {children}
            <Timer currentRoute={pathname} loopCount={3} onEnd={consoleLog} />
        </div>
    )
}

export default CarrouselLayout