import './navbar.css'

import Image from 'next/image';
import logo from '../../assets/logo.svg';
import { CircleUserRound } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  return (
        <nav>
            <div className="logo">
                <Image src={logo} alt="logo via" width={50}/>
                <div>
                    Via
                </div>
            </div>

            <Link href="/auth/login" className="user-area">
                <CircleUserRound />
                <div>Entrar</div>
            </Link>
        </nav>
    )
}