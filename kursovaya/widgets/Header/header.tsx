import Image from "next/image"
import Link from "next/link"
export default function Header () {
    return(

        <header>
            <nav className="navbar">
                <div className="">
                    <Link href="/">
                    <Image 
                        className="" 
                        src=""
                        alt=""
                        width={20}
                        height={20}
                    />
                        Global Edu
                    </Link>
                </div>
                <div className="header-button">
                    <Link href="/finder/university">University</Link>
                    <Link href="/finder/College">College</Link>
                    <Link href="/finder/School">School</Link>
                </div>
            <input type="text"   />

            <div className="contact">
                    <a href="tel:+79677158899">+7 967 715 88 99</a>
                    <a href="mailto:info@globaledu.com">info@globaledu.com</a>
                </div>
                <div>
                    <Link href="/login">
                        <button>Login</button>/
                    </Link>
                    <Link href="/registration">
                        <button>Reg</button>
                    </Link>
                </div>
            </nav>
            <div>
                <p>Need help choosing? Contact our educational consultants!</p>
                <div> <Image src="" alt="" /> <a href="tel:+18001234567">+1 (800) 123-4567</a></div>
                <div> <Image src="" alt="" /> <a href="mailto:support@globaledu.com">support@globaledu.com</a></div>
                <button>Live Chat</button>
                <div>ПОН-ПЯТ С 09.00-18.00</div>
            </div>
        </header>
    )

}